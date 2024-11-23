import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import type { AnyRouter } from '@tanstack/react-router';
import { afterHydrate } from './utils/serialization';

let cleaned = false;

export function Client(props: { router: AnyRouter }) {
  if (!props.router.state.matches.length) {
    props.router.hydrate();
    afterHydrate({ router: props.router });
  }

  if (!cleaned) {
    cleaned = true;
    window.__TSR__?.cleanScripts();
  }

  return <RouterProvider router={props.router} />;
}
