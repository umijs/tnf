import compression from 'compression';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import proxy from 'express-http-proxy';
import { getPort } from 'get-port-please';
import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { type Config } from '../config';
import { DEFAULT_PORT } from '../constants';
import { createHttpsServer } from './https';

export interface ServerOpts {
  devServer: Config['devServer'];
  hmr?: boolean;
}

export async function createServer(opts: ServerOpts) {
  const {
    port = DEFAULT_PORT,
    host = 'localhost',
    https,
    ip,
  } = opts.devServer || {};
  const _port = await getPort(port);
  const hmrPort = await getPort(_port + 1);
  const app = express();

  // cors
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );

  // compression
  app.use(compression());

  let wsProxy;
  if (opts.hmr !== false) {
    // proxy ws to mako server
    wsProxy = createProxyMiddleware({
      target: `http://127.0.0.1:${hmrPort}`,
      ws: true,
    });
    app.use('/__/hmr-ws', wsProxy);

    app.use(
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
  }

  // history fallback
  app.use(
    history({
      index: '/',
    }),
  );

  // create server
  let server;
  if (https) {
    https.hosts ||= uniq(
      [
        ...(https.hosts || []),
        // always add localhost, 127.0.0.1, ip and host
        '127.0.0.1',
        'localhost',
        ip,
        host !== '0.0.0.0' && host,
      ].filter(Boolean) as string[],
    );
    server = await createHttpsServer(app, https);
  } else {
    server = http.createServer(app);
  }

  server.listen(_port, () => {
    const protocol = https ? 'https:' : 'http:';
    console.log(`Server is running on ${protocol}//${host}:${_port}`);
  });

  if (opts?.hmr !== false) {
    // prevent first websocket auto disconnected
    server.on('upgrade', wsProxy!.upgrade);
  }

  return { server, app, hmrPort, port: _port, ip, host };
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}
