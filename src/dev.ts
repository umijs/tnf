import type { BuildParams } from '@umijs/mako';
import { getPort } from 'get-port-please';
import { build } from './build';
import { DEFAULT_PORT } from './constants';
import { createServer } from './fishkit/server';

export interface DevOpts {
  cwd: string;
  port?: number;
  https?: {
    hosts?: string[];
  };
  ip?: string;
  host?: string;
}

export async function dev(opts: DevOpts) {
  const port = opts.port || DEFAULT_PORT;
  const _port = await getPort(port);
  const hmrPort = await getPort(_port + 1);
  const host = opts.host || 'localhost';

  await createServer({
    port: _port,
    hmrPort,
    host,
    https: opts.https,
    ip: opts.ip,
  });

  // build mako config
  let config: BuildParams['config'] = {};
  if (process.env.HMR === 'none') {
    config.hmr = false;
  } else {
    config.hmr = {};
  }
  config.devServer = { port: hmrPort, host };

  await build({
    ...opts,
    config,
    watch: true,
  });
}
