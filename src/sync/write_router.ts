import path from 'pathe';
import { writeFileSync } from './fs.js';
import type { SyncOptions } from './sync.js';

export function writeRouter({ opts }: { opts: SyncOptions }) {
  const {
    paths: { tmpPath },
    config,
  } = opts.context;

  writeFileSync(
    path.join(tmpPath, 'router.tsx'),
    `
import {
  createRouter as tnfCreateRouter,
} from '@umijs/tnf/router';
import { routeTree } from './routeTree.gen';
export function createRouter() {
  return tnfCreateRouter({
    routeTree,
    defaultPreload: ${config?.router?.defaultPreload ? `'${config.router.defaultPreload}'` : 'false'},
    defaultPreloadDelay: ${config?.router?.defaultPreloadDelay || 50},
  });
}
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
  `,
  );
}
