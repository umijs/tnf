import React from 'react';
import { Link, Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
