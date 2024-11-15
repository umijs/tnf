import chokidar from 'chokidar';
import path from 'pathe';
import { BundlerType, createBundler } from './bundler/bundler';
import { PluginHookType } from './plugin/plugin_manager';
import { sync } from './sync/sync';
import { type Context } from './types';

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

  const bundlerType = config.bundler
    ? BundlerType[config.bundler.toUpperCase() as keyof typeof BundlerType]
    : BundlerType.MAKO;
  const bundler = createBundler({
    bundler: bundlerType,
  });
  await bundler.build({
    bundlerConfig: {
      entry: {
        client: path.join(context.paths.tmpPath, 'client.tsx'),
      },
      mode,
      alias: config.alias,
      less: config.less,
      externals: config.externals,
    },
    cwd,
    watch,
  });

  // build end
  await context.pluginManager.apply({
    hook: 'buildEnd',
    args: [],
    type: PluginHookType.Parallel,
    pluginContext: context.pluginContext,
  });
}
