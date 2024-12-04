import { createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => <div>Hello "__root"</div>,
});
