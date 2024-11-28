import { Link, Outlet, createRootRouteWithContext } from '@umijs/tnf/router';

export const Route = createRootRouteWithContext<{
  root: string;
}>()({
  beforeLoad: () => {
    return {
      root: 'root',
    };
  },
  component: () => (
    <>
      <div>Hello "__root"!</div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/foo">Foo</Link>
        </li>
      </ul>
      <Outlet />
    </>
  ),
});
