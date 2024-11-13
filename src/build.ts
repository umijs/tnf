import type { BuildParams } from '@umijs/mako';
import chokidar from 'chokidar';
import path from 'pathe';
import type { Config } from './config';
import { FRAMEWORK_NAME } from './constants';
import { sync } from './sync';

export async function build({
  cwd,
  config,
  devMakoConfig,
  watch,
  mode,
}: {
  cwd: string;
  config?: Config;
  devMakoConfig?: BuildParams['config'];
  watch?: boolean;
  mode: 'development' | 'production';
}) {
  const tmpPath = path.join(cwd, `src/.${FRAMEWORK_NAME}`);

  const doSync = async () => {
    await sync({
      cwd,
      tmpPath,
      config,
      mode,
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
    client: path.join(tmpPath, 'client.tsx'),
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
