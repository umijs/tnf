import { Outlet, createRootRoute } from '@umijs/tnf/router';
import { XProvider } from '@ant-design/x';

export const Route = createRootRoute({
  component: () => (
    <XProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <div>Hello "with-antdx"!</div>
      <Outlet />
    </XProvider>
  ),
});
