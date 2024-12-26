import path from 'pathe';
import { writeFileSync } from './fs.js';
import type { SyncOptions } from './sync.js';

export function writeServerEntry({ opts }: { opts: SyncOptions }) {
  const {
    paths: { tmpPath },
  } = opts.context;

  const renderMode = opts.context.config.ssr?.renderMode || 'stream';
  const renderer =
    renderMode === 'stream'
      ? `
const appHtml = ReactDOMServer.renderToPipeableStream(<Server router={router} />, {
  bootstrapScripts: ['/client.js'],
});
appHtml.pipe(response);
    `
      : `
const appHtml = ReactDOMServer.renderToString(<Server router={router} />);
response.end(appHtml + '<script src="/client.js"></script>');
    `;
  writeFileSync(
    path.join(tmpPath, 'server.tsx'),
    `
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryHistory } from '@umijs/tnf/router';
import { createRouter } from './router';
import { Server } from '@umijs/tnf/ssr';

const router = createRouter();

export async function render(request: Request, response: any) {
  const memoryHistory = createMemoryHistory({
    initialEntries: [request.url],
  });
  router.update({
    history: memoryHistory,
  });
  await router.load();
  response.statusCode = router.hasNotFoundMatch() ? 404 : 200;
  response.setHeader('Content-Type', 'text/html');
  ${renderer}
}
  `,
  );
}
