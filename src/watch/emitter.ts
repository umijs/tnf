import type { EventListener } from './types';

export class WatchEmitter<T extends Record<string, (...args: any[]) => any>> {
  private handlers: {
    [K in keyof T]?: EventListener<T, K>[];
  } = Object.create(null);

  async close(): Promise<void> {}

  emit<K extends keyof T>(
    event: K,
    ...args: Parameters<T[K]>
  ): Promise<unknown> {
    const listeners = this.handlers[event] || [];
    return Promise.all(
      listeners.map(async (handler) => await handler(...args)),
    );
  }

  on<K extends keyof T>(event: K, listener: EventListener<T, K>): this {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(listener);
    return this;
  }

  off<K extends keyof T>(event: K, listener: EventListener<T, K>): this {
    const listeners = this.handlers[event];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }
}
