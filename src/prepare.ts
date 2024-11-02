import { generator } from '@tanstack/router-generator';
import type { Config } from '@tanstack/router-generator';
import fs from 'fs';
import path from 'pathe';

interface BaseOptions {
  cwd: string;
  tmpPath: string;
}

interface PrepareOptions extends BaseOptions {}

export async function prepare(opts: PrepareOptions) {
  const { cwd, tmpPath } = opts;

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
  } as Config);

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
const router = createRouter({
  routeTree,
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
  `,
  );

  console.log('Prepared');
}
