import type { BuildParams } from '@umijs/mako';
import chokidar from 'chokidar';
import path from 'pathe';
import { prepare } from './prepare';

export async function build({
  cwd,
  config,
  watch,
}: {
  cwd: string;
  config?: BuildParams['config'];
  watch?: boolean;
}) {
  const tmpPath = path.join(cwd, 'src/.tnf');

  const doPrepare = async () => {
    await prepare({
      cwd,
      tmpPath,
      isDevMode: watch,
    });
  };

  await doPrepare();

  if (watch) {
    const pagesDir = path.join(cwd, 'src/pages');
    chokidar
      .watch(pagesDir, {
        ignoreInitial: true,
      })
      .on('all', async (event, path) => {
        console.log(`File ${path} has been ${event}`);
        await doPrepare();
      });
  }

  const mako = await import('@umijs/mako');
  config ||= {};
  config.entry = {
    client: path.join(tmpPath, 'client.tsx'),
  };
  config.resolve ||= {};
  config.resolve.alias = [
    ...(config.resolve.alias || []),
    ['@', path.join(cwd, 'src')],
    ['react', resolveLib('react')],
    ['react-dom', resolveLib('react-dom')],
    ['@tanstack/react-router', resolveLib('@tanstack/react-router')],
    ['@tanstack/router-devtools', resolveLib('@tanstack/router-devtools')],
  ];
  await mako.build({
    config,
    root: cwd,
    watch: !!watch,
  });
}

function resolveLib(lib: string) {
  return path.dirname(require.resolve(`${lib}/package.json`));
}
