import { createRouter } from '@umijs/tnf/router';
import { Client } from '@umijs/tnf/ssr';
import { routeTree } from '../.tnf/routeTree.gen';

export function createClient() {
  const router = createRouter({
    routeTree,
    context: { root: '/' },
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultPendingComponent: () => <div>Loading........</div>,
    defaultPendingMs: 0,
    defaultGcTime: 1000 * 60 * 5,
    defaultStaleTime: 1000 * 60 * 2,
  });
  return {
    Root: function Root() {
      return <Client router={router} />;
    },
    router,
  };
}
