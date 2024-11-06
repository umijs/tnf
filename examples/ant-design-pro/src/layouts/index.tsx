// @ts-ignore
import { Outlet } from '@/utils/importAllFrom';

const Layout = () => {
  return (
    <div>
      <h1>公共layout</h1>
      <Outlet />
    </div>
  );
};

export default Layout;
