import { generator } from '@tanstack/router-generator';
import type { Config } from '@tanstack/router-generator';
import fs from 'fs';
import path from 'pathe';
import type { Config as TnfConfig } from './config';
import { generateTailwindcss } from './fishkit/tailwindcss';

interface BaseOptions {
  cwd: string;
  tmpPath: string;
  config?: TnfConfig;
  mode: 'development' | 'production';
}

interface SyncOptions extends BaseOptions {
  runAgain?: boolean;
}

export async function sync(opts: SyncOptions) {
  const { cwd, tmpPath, config, mode } = opts;

  fs.rmSync(tmpPath, { recursive: true, force: true });
  fs.mkdirSync(tmpPath, { recursive: true });

  // generate route tree
  await generator({
    routeFileIgnorePrefix: '-',
    routesDirectory: path.join(cwd, 'src/pages'),
    generatedRouteTree: path.join(tmpPath, 'routeTree.gen.ts'),
    quoteStyle: 'single',
    semicolons: false,
    disableTypes: false,
    addExtensions: false,
    disableLogging: false,
    disableManifestGeneration: false,
    apiBase: '/api',
    routeTreeFileHeader: [
      '/* prettier-ignore-start */',
      '/* eslint-disable */',
      '// @ts-nocheck',
      '// noinspection JSUnusedGlobalSymbols',
    ],
    routeTreeFileFooter: ['/* prettier-ignore-end */'],
    indexToken: 'index',
    routeToken: 'route',
    experimental: {
      enableCodeSplitting: true,
    },
  } as Config);

  // Check for existing style files (.css or .less) and set import paths
  const supportedExtensions = ['.css', '.less'];
  function getStyleImportPath(basePath) {
    const ext = supportedExtensions.find((ext) =>
      fs.existsSync(path.join(basePath + ext)),
    );
    return ext ? `import '${basePath}${ext}';` : '';
  }
  const globalStylePath = path.join(cwd, 'src/global');
  const globalStyleImportPath = getStyleImportPath(globalStylePath);

  // tailwindcss
  let tailwindcssPath: string | undefined;
  if (config?.tailwindcss && !opts.runAgain) {
    tailwindcssPath = await generateTailwindcss({
      cwd,
      tmpPath,
      config: config?.tailwindcss,
      mode,
    });
  }

  // generate client entry
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

  console.log('Prepared');
}