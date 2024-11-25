import compression from 'compression';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import { getPort } from 'get-port-please';
import http from 'http';
import type { Config } from '../config/types';
import { DEFAULT_PORT } from '../constants';
import { createHttpsServer } from './https';
import * as logger from './logger';

export interface ServerOpts {
  devServer: Config['devServer'];
  configureServer?: (opts: {
    middlewares: express.Application;
  }) => void | (() => void);
}

export async function createServer(opts: ServerOpts): Promise<{
  server: http.Server;
  app: express.Application;
  port: number;
  ip?: string;
  host: string;
}> {
  const {
    port = DEFAULT_PORT,
    host = 'localhost',
    https,
    ip,
  } = opts.devServer || {};
  const _port = await getPort(port);
  const app = express();

  const context = {
    middlewares: app,
  };
  let configureServerFn;
  if (opts.configureServer) {
    configureServerFn = opts.configureServer(context);
  }

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

  // history fallback
  app.use(
    history({
      index: '/',
    }),
  );

  configureServerFn?.();

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
    logger.info(`Server is running on ${protocol}//${host}:${_port}`);
  });

  return { server, app, port: _port, ip, host };
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}
