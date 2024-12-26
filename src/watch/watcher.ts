import { WatchEmitter } from './emitter.js';
import { FileWatcher } from './fileWatcher.js';
import type { ChangeEvent, ChokidarOptions, WatchEvent } from './types.js';

export interface WatchOptions {
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  chokidar?: ChokidarOptions;
}

export class Watcher {
  private fileWatcher: FileWatcher;
  private emitter: WatchEmitter<{
    event: (event: WatchEvent) => Promise<void>;
    change: (path: string, details: { event: ChangeEvent }) => Promise<void>;
    close: () => Promise<void>;
  }>;
  private closed = false;

  constructor(options: WatchOptions = {}) {
    this.emitter = new WatchEmitter();
    this.fileWatcher = new FileWatcher(
      (id, event) => this.handleChange(id, event),
      options.chokidar,
    );
  }

  watch(paths: string | string[]): void {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    for (const path of pathArray) {
      this.fileWatcher.watch(path);
    }
  }

  on<E extends 'event' | 'change' | 'close'>(
    event: E,
    callback: E extends 'event'
      ? (event: WatchEvent) => Promise<void>
      : E extends 'change'
        ? (id: string, details: { event: ChangeEvent }) => Promise<void>
        : () => Promise<void>,
  ): void {
    this.emitter.on(event, callback as any);
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.fileWatcher.close();
    await this.emitter.emit('close');
  }

  /**
   * 提供两种层次的监听
   *
   * 1. event:统一处理所有类型的事件
   * example:
   * watcher.on('event', (event) => {
   *  switch (event.code) {
   *    case 'START':
   *      console.log('Watch started');
   *      break;
   *    case 'CHANGE':
   *      console.log(`File ${event.id} ${event.event}`);
   *      break;
   *    case 'ERROR':
   *      console.error('Watch error:', event.error);
   *      break;
   *    case 'END':
   *      console.log('Watch ended');
   *      break;
   *  }
   * });
   *
   * 2. change:只关心文件变化
   * example:
   * watcher.on('change', (id, {event}) => {
   *  console.log(`File ${id} ${event}`);
   * });
   */
  private async handleChange(id: string, event: ChangeEvent): Promise<void> {
    await this.emitter.emit('event', { code: 'CHANGE', id, event });
    await this.emitter.emit('change', id, { event });
  }
}
