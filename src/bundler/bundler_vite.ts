import type { Bundler } from './bundler';

export default {
  build: async (opts) => {
    const { bundlerConfig, cwd, watch } = opts;
    try {
      // @ts-ignore
      const { build: bundlerVite } = await import(
        require.resolve('@umijs/bundler-vite', {
          paths: [cwd],
        })
      ).catch(() => {
        throw new Error('Please install first @umijs/bundler-vite');
      });

      // 转换 alias 格式
      const aliasConfig: Record<string, string> = {};
      if (bundlerConfig.alias?.length) {
        bundlerConfig.alias.forEach(([key, value]) => {
          aliasConfig[key] = value;
        });
      }

      const config = {
        resolve: {
          alias: aliasConfig,
        },
        ...bundlerConfig,
      };

      await bundlerVite({
        entry: bundlerConfig.entry,
        config,
        cwd,
        watch: Boolean(watch),
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('Cannot find module')) {
        throw new Error('Please install first @umijs/bundler-vite');
      }
      throw err;
    }
  },
  configDevServer: async (_opts) => {
    throw new Error('Not implemented');
  },
} as Bundler;
