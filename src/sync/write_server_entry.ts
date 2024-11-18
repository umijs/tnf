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
import {
  RouterProvider,
  createMemoryHistory,
} from '@umijs/tnf/router';
import { createRouter } from './router';
const router = createRouter();
export async function render(request: Request, response: any) {
  const router = createRouter();
  const memoryHistory = createMemoryHistory({
    initialEntries: [request.url],
  });
  router.update({
    history: memoryHistory,
  });
  await router.load();
  const appHtml = ReactDOMServer.renderToPipeableStream(<html><body><RouterProvider router={router} /><script src="/client.js"></script></body></html>);
  response.statusCode = router.hasNotFoundMatch() ? 404 : 200;
  response.setHeader('Content-Type', 'text/html');
  appHtml.pipe(response);
}
  `,
  );
}
