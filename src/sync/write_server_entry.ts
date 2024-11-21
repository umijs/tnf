import path from 'pathe';
import { writeFileSync } from './fs';
import type { SyncOptions } from './sync';

export function writeServerEntry({ opts }: { opts: SyncOptions }) {
  const {
    paths: { tmpPath },
  } = opts.context;

  writeFileSync(
    path.join(tmpPath, 'server.tsx'),
    `
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryHistory } from '@umijs/tnf/router';
import { createRouter } from './router';
import { StartServer } from '@umijs/tnf/ssr';

const router = createRouter();

export async function render(request: Request, response: any) {
  const memoryHistory = createMemoryHistory({
    initialEntries: [request.url],
  });
  router.update({
    history: memoryHistory,
  });
  await router.load();
  const appHtml = ReactDOMServer.renderToPipeableStream(<StartServer router={router} />, {
    bootstrapScripts: ['/client.js'],
  });
  response.statusCode = router.hasNotFoundMatch() ? 404 : 200;
  response.setHeader('Content-Type', 'text/html');
  appHtml.pipe(response);
}
  `,
  );
}
