import type { Plugin } from './types';

export enum PluginHookType {
  First = 'first',
  Series = 'series',
  Parallel = 'parallel',
}

export class PluginManager<T extends Plugin> {
  #plugins: T[] = [];
  constructor(rawPlugins: T[]) {
    this.#plugins = [
      ...rawPlugins.filter((p) => p.enforce === 'pre'),
      ...rawPlugins.filter((p) => !p.enforce),
      ...rawPlugins.filter((p) => p.enforce === 'post'),
    ];
  }

  async apply({
    hook,
    args,
    memo,
    type = PluginHookType.Series,
    pluginContext,
  }: {
    hook: keyof T;
    args: any[];
    memo?: any;
    type: PluginHookType;
    pluginContext: any;
  }) {
    const plugins = this.#plugins.filter((p) => !!p[hook]);
    if (type === PluginHookType.First) {
      for (const plugin of plugins) {
        const hookFn = plugin[hook] as Function;
        if (typeof hookFn === 'function') {
          const result = await hookFn.apply(pluginContext, args);
          if (result != null) {
            return result;
          }
        }
      }
      return null;
    } else if (type === PluginHookType.Parallel) {
      const results = await Promise.all(
        plugins.map((p) => {
          const hookFn = p[hook] as Function;
          if (typeof hookFn === 'function') {
            return hookFn.apply(pluginContext, args);
          }
          return null;
        }),
      );
      return results.filter((r) => r != null);
    } else if (type === PluginHookType.Series) {
      let result = memo;
      for (const plugin of plugins) {
        const hookFn = plugin[hook] as Function;
        if (typeof hookFn === 'function') {
          result = await hookFn.apply(pluginContext, [result, ...args]);
        }
      }
      return result;
    } else {
      throw new Error(`Invalid hook type: ${type}`);
    }
  }
}
