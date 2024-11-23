import { Link, Outlet, createRootRoute } from '@umijs/tnf/router';
import { Meta } from '../../../../client/ssr/ssr';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
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
      </body>
    </html>
  );
}
