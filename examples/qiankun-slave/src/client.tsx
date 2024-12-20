import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter } from '@umijs/tnf/router';
import { Client } from '@umijs/tnf/ssr';
import { routeTree } from '../.tnf/routeTree.gen';

function createClient() {
  const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => <></>,
  });
  return {
    Root: function Root() {
      return <Client router={router} />;
    },
    router,
  };
}

let root: ReactDOM.Root | null = null;
const client = createClient();

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}

export async function bootstrap() {
  console.log('bootstrap foooo');
}

export async function mount() {
  console.log('mount foooo');
  root = ReactDOM.createRoot(document.getElementById('sub-app-container')!);
  root.render(<client.Root />);
}

export async function unmount(x: any) {
  console.log('unmount foooo', x);
  if (typeof root?.unmount === 'function') {
    root?.unmount();
    root = null;
  } else {
    throw new Error('react-dom@18 is required for qiankun');
  }
}

export async function update() {
  console.log('update foooo');
}
