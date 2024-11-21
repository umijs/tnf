import path from 'pathe';
import { writeFileSync } from './fs';
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
  const {
    cwd,
    paths: { tmpPath },
    config,
  } = opts.context;

  if (config?.ssr) {
    writeFileSync(
      path.join(tmpPath, 'client.tsx'),
      `import ReactDOM from 'react-dom/client';
import { createRouter } from './router';
import { StartClient } from '@umijs/tnf/ssr';
${globalStyleImportPath}
${tailwindcssPath ? `import '${tailwindcssPath}'` : ''}
const router = createRouter();
const hydrateRoot = ReactDOM.hydrateRoot(document, <StartClient router={router} />);
hydrateRoot.onRecoverableError = (error, errorInfo) => {
  console.log('Hydration error:', error);
  console.log('Error info:', errorInfo);
};`,
    );
  } else {
    writeFileSync(
      path.join(tmpPath, 'client.tsx'),
      `
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
} from '@umijs/tnf/router';
import { createRouter } from './router';
${globalStyleImportPath}
${tailwindcssPath ? `import '${tailwindcssPath}'` : ''}
const router = createRouter();
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );
const ClickToComponent =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('click-to-react-component').then((res) => ({
          default: res.ClickToComponent,
        })),
      );
const pathModifier = (path) => {
  return path.startsWith('${cwd}') ? path : '${cwd}/' + path;
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    ${
      config?.clickToComponent !== false
        ? `<ClickToComponent editor="${config?.clickToComponent?.editor || 'vscode'}" pathModifier={pathModifier} />`
        : ''
    }
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
}
