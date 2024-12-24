import chokidar from 'chokidar';
import fs from 'fs';
import path from 'pathe';
import { BundlerType, createBundler } from './bundler/bundler';
import { doctor } from './doctor/doctor';
import * as logger from './fishkit/logger';
import { buildHtml } from './html';
import { PluginHookType } from './plugin/plugin_manager';
import { sync } from './sync/sync';
import { type Context } from './types';
import { Watcher } from './watch/watcher';

export async function build({
  context,
  watch,
}: {
  context: Context;
  watch?: boolean;
}) {
  const { cwd, config, mode } = context;

  // sync
  const runSync = async () => {
    await sync({
      context,
    });
  };
  await runSync();

  // sync with watch
  if (watch) {
    const watcher = new Watcher({
      chokidar: {
        ignoreInitial: true,
      },
    });

    watcher.watch(['./src']);

    watcher.on('change', async (id, { event }) => {
      await context.pluginManager.apply({
        hook: 'watchChange',
        args: [id, { event }],
        memo: [],
        type: PluginHookType.Parallel,
        pluginContext: context.pluginContext,
      });
    });

    const pagesDir = path.join(cwd, 'src/pages');
    chokidar
      .watch(pagesDir, {
        ignoreInitial: true,
      })
      .on('all', async (event, path) => {
        logger.info(`File ${path} has been ${event}`);
        await runSync();
      });
  }

  // check source
  await doctor({ context });

  // build
  const bundler = createBundler({ bundler: BundlerType.MAKO });
  const unplugins = await context.pluginManager.apply({
    hook: 'configureBundler',
    args: [],
    memo: [],
    type: PluginHookType.SeriesMerge,
    pluginContext: context.pluginContext,
  });
  const baseBundleConfig = {
    mode,
    alias: config.alias,
    externals: config.externals,
    publicPath: config.publicPath,
    unplugins,
  };

  // bundler configs
  const bundlerConfigs = [];
  // client
  bundlerConfigs.push({
    ...baseBundleConfig,
    entry: {
      client: path.join(context.paths.tmpPath, 'client-entry.tsx'),
    },
    less: config.less,
  });
  // server
  if (config.ssr) {
    bundlerConfigs.push({
      ...baseBundleConfig,
      entry: {
        server: path.join(context.paths.tmpPath, 'server.tsx'),
      },
      platform: 'node' as const,
      clean: false,
    });
  }

  // build
  const stats = await bundler.build({
    bundlerConfigs,
    cwd,
    watch,
  });

  // build html
  const html = await buildHtml(context, stats?.[0] || {});
  fs.writeFileSync(path.join(context.paths.outputPath, 'index.html'), html);

  // build end
  await context.pluginManager.apply({
    hook: 'buildEnd',
    args: [
      {
        command: context.argv._[0],
      },
    ],
    type: PluginHookType.Parallel,
    pluginContext: context.pluginContext,
  });
}
