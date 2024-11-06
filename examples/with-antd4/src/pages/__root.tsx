import React from 'react';
import { Outlet, createRootRoute } from '@umijs/tnf/router';
import 'antd/dist/antd.less';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>Hello "__root"!</div>
      <Outlet />
    </>
  ),
});
