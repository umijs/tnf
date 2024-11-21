import type { BuildParams } from '@umijs/mako';
import assert from 'assert';
import proxy from 'express-http-proxy';
import { getPort } from 'get-port-please';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Mode } from '../types';
import type { Bundler } from './bundler';

let _hmrPort: number;
let _host: string;

export default {
  build: async (opts) => {
    const { bundlerConfig, cwd, watch } = opts;

    // build config
    const config = {
      clean: bundlerConfig.clean,
      entry: bundlerConfig.entry,
      externals: bundlerConfig.externals,
      less: bundlerConfig.less,
      mode: bundlerConfig.mode,
      platform: bundlerConfig.platform,
      resolve: {
        alias: bundlerConfig.alias,
      },
    } as BuildParams['config'];

    const isDev = bundlerConfig.mode === Mode.Development;
    if (isDev) {
      if (process.env.HMR === 'none') {
        config.hmr = false;
      } else {
        config.hmr = {};
      }
      config.devServer = {
        port: _hmrPort,
        host: _host,
      };
    }
    if (config.platform === 'node') {
      config.cjs = true;
    }

    const mako = await import('@umijs/mako');
    await mako.build({
      config,
      root: cwd,
      watch: Boolean(watch),
    });
  },

  configDevServer: async (opts) => {
    const { port, host } = opts;
    assert(port, 'port is required');
    assert(host, 'host is required');

    const hmrPort = await getPort(port + 1);
    _hmrPort = hmrPort;
    _host = host;

    // proxy ws to mako server
    const wsProxy = createProxyMiddleware({
      target: `http://127.0.0.1:${hmrPort}`,
      ws: true,
    });
    opts.app.use('/__/hmr-ws', wsProxy);
    opts.app.use(
      proxy(`http://127.0.0.1:${hmrPort}`, {
        proxyReqOptDecorator: function (proxyReqOpts: any) {
          proxyReqOpts.agent = false;
          return proxyReqOpts;
        },
        filter: function (req: any, res: any) {
          return req.method == 'GET' || req.method == 'HEAD';
        },
        skipToNextHandlerFilter: function (proxyRes: any) {
          return proxyRes.statusCode !== 200;
        },
      }),
    );
    opts.server.on('upgrade', wsProxy!.upgrade);
  },
} as Bundler;
