import { Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>Hello "with-antdx"!</div>
      <Outlet />
    </>
  ),
});
