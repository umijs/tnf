import compression from 'compression';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import proxy from 'express-http-proxy';
import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createHttpsServer } from './https';

export interface ServerOpts {
  port: number;
  hmrPort: number;
  host: string;
  https?: {
    hosts?: string[];
  };
  ip?: string;
}

export async function createServer(opts: ServerOpts) {
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

  // proxy ws to mako server
  const wsProxy = createProxyMiddleware({
    target: `http://127.0.0.1:${opts.hmrPort}`,
    ws: true,
  });
  app.use('/__/hmr-ws', wsProxy);

  app.use(
    proxy(`http://127.0.0.1:${opts.hmrPort}`, {
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

  // history fallback
  app.use(
    history({
      index: '/',
    }),
  );

  // create server
  let server;
  const httpsOpts = opts.https;
  if (httpsOpts) {
    httpsOpts.hosts ||= uniq(
      [
        ...(httpsOpts.hosts || []),
        // always add localhost, 127.0.0.1, ip and host
        '127.0.0.1',
        'localhost',
        opts.ip,
        opts.host !== '0.0.0.0' && opts.host,
      ].filter(Boolean) as string[],
    );
    server = await createHttpsServer(app, httpsOpts);
  } else {
    server = http.createServer(app);
  }

  server.listen(opts.port, () => {
    const protocol = opts.https ? 'https:' : 'http:';
    console.log(`Server is running on ${protocol}//${opts.host}:${opts.port}`);
  });

  // prevent first websocket auto disconnected
  server.on('upgrade', wsProxy.upgrade);

  return server;
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}
