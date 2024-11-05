import type { BuildParams } from '@umijs/mako';
import { getPort } from 'get-port-please';
import { build } from './build';
import type { Config } from './config';
import { DEFAULT_PORT } from './constants';
import { createServer } from './fishkit/server';

export interface DevOpts {
  cwd: string;
  config?: Config;
}

export async function dev(opts: DevOpts) {
  const devServer = opts.config?.devServer || {};
  const port = await getPort(devServer.port || DEFAULT_PORT);
  const hmrPort = await getPort(port + 1);
  const host = devServer.host || 'localhost';

  await createServer({
    port,
    hmrPort,
    host,
    https: devServer.https,
    ip: devServer.ip,
  });

  // build mako config
  let devMakoConfig: BuildParams['config'] = {};
  if (process.env.HMR === 'none') {
    devMakoConfig.hmr = false;
  } else {
    devMakoConfig.hmr = {};
  }
  devMakoConfig.devServer = { port: hmrPort, host };

  await build({
    ...opts,
    config: opts.config,
    devMakoConfig,
    watch: true,
  });
}
