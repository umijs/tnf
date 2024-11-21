import chokidar from 'chokidar';
import path from 'pathe';
import { BundlerType, createBundler } from './bundler/bundler';
import { PluginHookType } from './plugin/plugin_manager';
import { sync } from './sync/sync';
import { type Context, Mode } from './types';

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
  if (watch) {
    const pagesDir = path.join(cwd, 'src/pages');
    chokidar
      .watch(pagesDir, {
        ignoreInitial: true,
      })
      .on('all', async (event, path) => {
        console.log(`File ${path} has been ${event}`);
        await runSync();
      });
  }

  // build
  const bundler = createBundler({ bundler: BundlerType.MAKO });
  const baseBundleConfig = {
    mode,
    alias: config.alias,
    externals: config.externals,
  };
  // client
  await bundler.build({
    bundlerConfig: {
      ...baseBundleConfig,
      entry: {
        client: path.join(context.paths.tmpPath, 'client.tsx'),
      },
      less: config.less,
    },
    cwd,
    watch,
  });
  // server
  if (config.ssr) {
    await bundler.build({
      bundlerConfig: {
        ...baseBundleConfig,
        entry: {
          server: path.join(context.paths.tmpPath, 'server.tsx'),
        },
        platform: 'node',
        clean: false,
      },
      cwd,
      watch,
    });
  }

  // build end
  await context.pluginManager.apply({
    hook: 'buildEnd',
    args: [],
    type: PluginHookType.Parallel,
    pluginContext: context.pluginContext,
  });
}
