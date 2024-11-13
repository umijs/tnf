import type { BuildParams } from '@umijs/mako';
import { build } from './build';
import { createServer } from './fishkit/server';
import type { Context } from './types';

export async function dev({ context }: { context: Context }) {
  const devServer = context.config?.devServer || {};
  const { hmrPort, host } = await createServer({ devServer, hmr: true });

  // build mako config
  let devMakoConfig: BuildParams['config'] = {};
  if (process.env.HMR === 'none') {
    devMakoConfig.hmr = false;
  } else {
    devMakoConfig.hmr = {};
  }
  devMakoConfig.devServer = { port: hmrPort, host };
  devMakoConfig.mode = 'development';

  await build({
    context,
    devMakoConfig,
    watch: true,
  });
}
