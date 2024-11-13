import type { BuildParams } from '@umijs/mako';
import chokidar from 'chokidar';
import path from 'pathe';
import { sync } from './sync/sync';
import type { Context } from './types';

export async function build({
  context,
  devMakoConfig,
  watch,
}: {
  context: Context;
  devMakoConfig?: BuildParams['config'];
  watch?: boolean;
}) {
  const { cwd, config } = context;

  const doSync = async () => {
    await sync({
      context,
    });
  };

  await doSync();

  if (watch) {
    const pagesDir = path.join(cwd, 'src/pages');
    chokidar
      .watch(pagesDir, {
        ignoreInitial: true,
      })
      .on('all', async (event, path) => {
        console.log(`File ${path} has been ${event}`);
        await doSync();
      });
  }

  const mako = await import('@umijs/mako');
  // @ts-ignore https://github.com/umijs/mako/pull/1679
  const bundleConfig: BuildParams['config'] = config || {};
  bundleConfig.entry = {
    client: path.join(context.paths.tmpPath, 'client.tsx'),
  };
  bundleConfig.mode = 'production';
  bundleConfig.resolve ||= {};
  bundleConfig.resolve.alias = [
    ...(bundleConfig.resolve.alias || []),
    ['@', path.join(cwd, 'src')],
    ['react', resolveLib('react')],
    ['react-dom', resolveLib('react-dom')],
    ['@tanstack/react-router', resolveLib('@tanstack/react-router')],
    ['@tanstack/router-devtools', resolveLib('@tanstack/router-devtools')],
  ];
  await mako.build({
    config: {
      ...bundleConfig,
      ...devMakoConfig,
    },
    root: cwd,
    watch: !!watch,
  });
}

function resolveLib(lib: string) {
  return path.dirname(require.resolve(`${lib}/package.json`));
}
