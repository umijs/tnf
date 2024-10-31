import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@umijs/tnf/router';

const router = createRouter({});

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
