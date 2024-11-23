import * as React from 'react';
import { ScriptOnce, useRouter, useRouterState } from '@tanstack/react-router';
import type {
  MakeRouteMatch,
  RouterManagedTag,
  RouterState,
} from '@tanstack/react-router';
import jsesc from 'jsesc';
import { Asset } from './Asset';
import Context from './Context';

export const useMeta = (): RouterManagedTag[] => {
  const router = useRouter();

  const routeMeta = useRouterState({
    select: (state) => {
      return state.matches.map((match) => match.meta!).filter(Boolean);
    },
  });

  const meta: RouterManagedTag[] = React.useMemo(() => {
    const resultMeta: RouterManagedTag[] = [];
    const metaByName: Record<string, boolean> = {};
    let title: RouterManagedTag | undefined;
    [...routeMeta].reverse().forEach((metas) => {
      [...metas].reverse().forEach((m) => {
        if (!m) return;

        if (m.title) {
          if (!title) {
            title = {
              tag: 'title',
              children: m.title,
            };
          }
        } else {
          if (m.name) {
            if (metaByName[m.name]) {
              return;
            } else {
              metaByName[m.name] = true;
            }
          }

          resultMeta.push({
            tag: 'meta',
            attrs: {
              ...m,
            },
          });
        }
      });
    });

    if (title) {
      resultMeta.push(title);
    }

    resultMeta.reverse();

    return resultMeta;
  }, [routeMeta]);

  const links = useRouterState({
    select: (state: RouterState<any, MakeRouteMatch<any>>) =>
      state.matches
        .map((match) => match.links!)
        .filter(Boolean)
        .flat(1)
        .map((link) => ({
          tag: 'link',
          attrs: {
            ...link,
          },
        })) as RouterManagedTag[],
  });

  const preloadMeta = useRouterState({
    select: (state: RouterState<any, MakeRouteMatch<any>>) => {
      const preloadMeta: RouterManagedTag[] = [];

      state.matches
        .map((match) => router.looseRoutesById[match.routeId]!)
        .forEach((route) =>
          router.manifest?.routes[route.id]?.preloads
            ?.filter(Boolean)
            .forEach((preload) => {
              preloadMeta.push({
                tag: 'link',
                attrs: {
                  rel: 'modulepreload',
                  href: preload,
                },
              });
            }),
        );

      return preloadMeta;
    },
  });

  return uniqBy([...meta, ...preloadMeta, ...links], (d) => {
    return JSON.stringify(d);
  });
};

function uniqBy<T>(arr: T[], fn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export const useMetaElements = (): JSX.Element => {
  const router = useRouter();
  const meta = useMeta();

  const dehydratedCtx = React.useContext(
    Context.get('TanStackRouterHydrationContext', {}),
  );

  return (
    <>
      {meta.map((asset, i) => (
        <Asset {...asset} key={`tsr-meta-${JSON.stringify(asset)}`} />
      ))}
      <>
        <ScriptOnce
          log={false}
          children={`__TSR__={matches:[],streamedValues:{},queue:[],runQueue:()=>{let e=!1;__TSR__.queue=__TSR__.queue.filter((_=>!_()||(e=!0,!1))),e&&__TSR__.runQueue()},initMatch:e=>{__TSR__.queue.push((()=>(__TSR__.matches[e.index]||(__TSR__.matches[e.index]=e,Object.entries(e.extracted).forEach((([e,_])=>{if("stream"===_.type){let e;_.value=new ReadableStream({start(_){e=_}}),_.value.controller=e}else if("promise"===_.type){let e,t;_.value=new Promise(((_,u)=>{e=_,t=u})),_.resolve=e,_.reject=t}}))),!0))),__TSR__.runQueue()},resolvePromise:e=>{__TSR__.queue.push((()=>{const _=__TSR__.matches[e.matchIndex];if(_){const t=_.extracted[e.id];if(t)return t.resolve(e.value.data),!0}return!1})),__TSR__.runQueue()},cleanScripts:()=>{document.querySelectorAll(".tsr-once").forEach((e=>{e.remove()}))}};`}
        />
        <ScriptOnce
          children={`__TSR__.dehydrated = ${jsesc(
            router.options.transformer.stringify(dehydratedCtx),
            {
              isScriptContext: true,
              wrap: true,
              json: true,
            },
          )}`}
        />
      </>
    </>
  );
};

/**
 * @description The `Meta` component is used to render meta tags and links for the current route.
 * It should be rendered in the `<head>` of your document.
 */
export const Meta = (): JSX.Element => {
  return <>{useMetaElements()}</>;
};
