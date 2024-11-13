import { Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="text-2xl font-bold">Hello "__root"!</div>
      <Outlet />
    </>
  ),
});
