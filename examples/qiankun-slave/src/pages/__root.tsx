import { Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>Hello "qiankun-slave"!</div>
      <Outlet />
    </>
  ),
});
