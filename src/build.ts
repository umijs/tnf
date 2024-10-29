import path from 'path';
import { prepare } from './prepare';
import { build as buildWithMako } from '@umijs/mako';

export async function build({ cwd, watch }: { cwd: string; watch?: boolean }) {
  const tmpPath = path.join(cwd, 'src/.tnf');
  await prepare({
    cwd,
    tmpPath,
  });
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
