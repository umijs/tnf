import React from 'react';
import { Link, Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="text-2xl font-bold">Hello "__root"!</div>
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
