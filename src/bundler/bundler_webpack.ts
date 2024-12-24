import type { Bundler } from './bundler';

export default {
  build: async (_opts) => {
    try {
      require.resolve('@umijs/bundler-webpack');
    } catch (e) {
      throw new Error(
        'Package "@umijs/bundler-webpack" is not installed. Please run "npm install @umijs/bundler-webpack" to install it.',
      );
    }
    try {
      require.resolve('unplugin-starter');
    } catch (e) {
      throw new Error(
        'Package "unplugin-starter" is not installed. Please run "npm install unplugin-starter" to install it.',
      );
    }
    // @ts-ignore
    const { build } = await import('@umijs/bundler-webpack');
    // @ts-ignore
    const unplugin = await import('unplugin-starter/webpack');
    const { bundlerConfigs, cwd, watch } = _opts;
    const stats = [];

    for (const bundlerConfig of bundlerConfigs) {
      const userConfig = {
        alias: bundlerConfig.alias,
        externals: bundlerConfig.externals,
        outputPath: bundlerConfig.publicPath,
        lessLoader: bundlerConfig.less,
      };
      const config = {
        cwd,
        root: cwd,
        rootDir: cwd,
        watch: Boolean(watch),
        entry: bundlerConfig.entry,
        clean: bundlerConfig.clean,
        config: userConfig,
        userConfig,
        mode: bundlerConfig.mode,
        platform: bundlerConfig.platform,
        plugins: (bundlerConfig.unplugins || []).map((plugin) => {
          return unplugin.default(plugin);
        }),
      };
      // Build
      const buildStats = await build(config);

      stats.push(buildStats?.compilation?.assets);
    }
    return stats;
  },
  configDevServer: async (_opts) => {
    throw new Error('Not implemented');
  },
} as Bundler;
