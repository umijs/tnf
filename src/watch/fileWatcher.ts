import chokidar, { FSWatcher } from 'chokidar';
import type { ChangeEvent, ChokidarOptions } from './types.js';

export class FileWatcher {
  private watcher: FSWatcher;
  private transformWatchers = new Map<string, FSWatcher>();

  constructor(
    private onChange: (id: string, event: ChangeEvent) => void,
    private options: ChokidarOptions = {},
  ) {
    this.watcher = this.createWatcher();
  }

  watch(id: string): void {
    this.watcher.add(id);
  }

  unwatch(id: string): void {
    this.watcher.unwatch(id);
    const transformWatcher = this.transformWatchers.get(id);
    if (transformWatcher) {
      transformWatcher.close();
      this.transformWatchers.delete(id);
    }
  }

  close(): void {
    this.watcher.close();
    for (const watcher of this.transformWatchers.values()) {
      watcher.close();
    }
  }

  private createWatcher(): FSWatcher {
    return chokidar
      .watch([], this.options)
      .on('add', (id) => this.onChange(id, 'create'))
      .on('change', (id) => this.onChange(id, 'update'))
      .on('unlink', (id) => this.onChange(id, 'delete'));
  }
}
