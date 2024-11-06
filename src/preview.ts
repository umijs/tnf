import { resolve } from 'path';
import sirv from 'sirv';
import type { Config } from './config';
import { createServer } from './fishkit/server';

export interface PreviewOpts {
  cwd: string;
  config?: Config;
}

export async function preview(opts: PreviewOpts) {
  const devServer = opts.config?.devServer || {};
  const { app } = await createServer({ devServer });
  const distDir = resolve(opts.cwd, 'dist');

  app.use(
    '/',
    sirv(distDir, {
      etag: true,
      dev: true,
      single: true,
    }),
  );
}
