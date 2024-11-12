import type { BuildParams } from '@umijs/mako';
import { build } from './build';
import type { Config } from './config';
import { createServer } from './fishkit/server';

export interface DevOpts {
  cwd: string;
  config?: Config;
}

export async function dev(opts: DevOpts) {
  const devServer = opts.config?.devServer || {};
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
    ...opts,
    config: opts.config,
    devMakoConfig,
    mode: 'development',
    watch: true,
  });
}
