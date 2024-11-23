import * as React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import type { AnyRouter } from '@tanstack/react-router';
import jsesc from 'jsesc';
import Context from './Context';
import { AfterEachMatch } from './utils/serialization';

export function Server<TRouter extends AnyRouter>(props: { router: TRouter }) {
  props.router.AfterEachMatch = AfterEachMatch;
  props.router.serializer = (value) =>
    jsesc(value, {
      isScriptContext: true,
      wrap: true,
      json: true,
    });

  const hydrationContext = Context.get('TanStackRouterHydrationContext', {});

  const hydrationCtxValue = React.useMemo(
    () => ({
      router: props.router.dehydrate(),
      payload: props.router.options.dehydrate?.(),
    }),
    [props.router],
  );

  return (
    <hydrationContext.Provider value={hydrationCtxValue}>
      <RouterProvider router={props.router} />
    </hydrationContext.Provider>
  );
}
