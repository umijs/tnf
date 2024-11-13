import fs from 'fs';
import path from 'pathe';
import type { SyncOptions } from './sync';

export function writeClientEntry({
  opts,
  globalStyleImportPath,
  tailwindcssPath,
}: {
  opts: SyncOptions;
  globalStyleImportPath: string;
  tailwindcssPath: string | undefined;
}) {
  const { tmpPath, config } = opts;

  fs.writeFileSync(
    path.join(tmpPath, 'client.tsx'),
    `
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createRouter,
} from '@umijs/tnf/router';
import { routeTree } from './routeTree.gen';
${globalStyleImportPath}
${tailwindcssPath ? `import '${tailwindcssPath}'` : ''}
const router = createRouter({
  routeTree,
  defaultPreload: ${config?.router?.defaultPreload ? `'${config.router.defaultPreload}'` : 'false'},
  defaultPreloadDelay: ${config?.router?.defaultPreloadDelay || 50},
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    ${
      config?.router?.devtool !== false
        ? `<TanStackRouterDevtools router={router} initialIsOpen=${config?.router?.devtool?.options?.initialIsOpen || '{false}'} position=${config?.router?.devtool?.options?.position || '"bottom-left"'} />`
        : ''
    }
  </>
);
  `,
  );
}
