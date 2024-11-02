import { build as buildWithMako } from '@umijs/mako';
import chokidar from 'chokidar';
import path from 'path';
import { prepare } from './prepare';

export async function build({ cwd, watch }: { cwd: string; watch?: boolean }) {
  const tmpPath = path.join(cwd, 'src/.tnf');

  const doPrepare = async () => {
    await prepare({
      cwd,
      tmpPath,
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

  await buildWithMako({
    config: {
      entry: {
        client: path.join(tmpPath, 'client.tsx'),
      },
      resolve: {
        alias: [
          ['@', path.join(cwd, 'src')],
          ['react', resolveLib('react')],
          ['react-dom', resolveLib('react-dom')],
          ['@tanstack/react-router', resolveLib('@tanstack/react-router')],
          [
            '@tanstack/router-devtools',
            resolveLib('@tanstack/router-devtools'),
          ],
        ],
      },
    },
    root: cwd,
    watch: !!watch,
  });
}

function resolveLib(lib: string) {
  return path.dirname(require.resolve(`${lib}/package.json`));
}
