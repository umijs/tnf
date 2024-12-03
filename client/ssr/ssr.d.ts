import type { ReactNode } from 'react';
import type { AnyRouter } from '@tanstack/react-router';

export interface StartClientProps {
  router: AnyRouter;
}

export interface AssetProps {
  tag: 'title' | 'meta' | 'link' | 'style' | 'script';
  attrs?: Record<string, any>;
  children?: ReactNode;
}

export function Client(props: StartClientProps): JSX.Element;
export function Server<TRouter extends AnyRouter>(props: {
  router: TRouter;
}): JSX.Element;
export function Meta(): JSX.Element;
