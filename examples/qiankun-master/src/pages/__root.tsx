import { useEffect } from 'react';
import { createRootRoute } from '@umijs/tnf/router';
import { loadMicroApp } from 'qiankun';

export const Route = createRootRoute({
  component: () => {
    useEffect(() => {
      loadMicroApp({
        name: 'foooo',
        entry: 'http://localhost:3003',
        container: '#sub-app-container',
      });
    }, []);
    return (
      <>
        <div>Hello "qiankun-master"!</div>
        <div id="sub-app-container"></div>
        <div>ok</div>
      </>
    );
  },
});
