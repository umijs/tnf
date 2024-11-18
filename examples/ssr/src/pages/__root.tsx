import { Link, Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>Hello</div>
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
