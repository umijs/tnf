import fs from 'fs';
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

  // client
  writeFileSync(
    path.join(tmpPath, 'client.tsx'),
    `
import React from 'react';
import { Client } from '@umijs/tnf/ssr';
import { createRouter } from './router';

export function createClient() {
  const router = createRouter();
  return {
    Root: function Root() {
      return <Client router={router} />;
    },
    router,
  };
}
  `,
  );

  // client entry
  const clientEntry = path.join(tmpPath, 'client-entry.tsx');
  const srcClientPath = path.join(cwd, 'src/client.tsx');
  const clientPath = fs.existsSync(srcClientPath) ? srcClientPath : './client';
  writeFileSync(
    clientEntry,
    `
${globalStyleImportPath}
${tailwindcssPath ? `import '${tailwindcssPath}'` : ''}
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as client from '${clientPath}';

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

if (client.createClient) {
  const { Root, router } = client.createClient();
  const elements = <>
      <Root />
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
  </>;
  if (window.__TSR__) {
    ReactDOM.hydrateRoot(document, elements);
  } else {
    ReactDOM.createRoot(document.getElementById('root')!).render(elements);
  }
}
    `,
  );
}
