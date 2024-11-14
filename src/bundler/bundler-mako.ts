import type { BuildParams } from '@umijs/mako';
import assert from 'assert';
import proxy from 'express-http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Mode } from '../types';
import type { Bundler } from './bundler';

let _hmrPort = 8000;
let _host = 'localhost';

export default {
  build: async (opts) => {
    const { bundlerConfig, cwd, watch } = opts;

    // build config
    const config = {
      entry: bundlerConfig.entry,
      mode: bundlerConfig.mode,
      resolve: {
        alias: bundlerConfig.alias,
      },
      externals: bundlerConfig.externals,
      less: bundlerConfig.less,
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
    console.log('config', config);

    const mako = await import('@umijs/mako');
    await mako.build({
      config,
      root: cwd,
      watch: Boolean(watch),
    });
  },

  configDevServer: async (opts) => {
    const { hmrPort, host } = opts;
    assert(hmrPort, 'hmrPort is required');
    assert(host, 'host is required');
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
