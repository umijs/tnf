import React, { createLazyFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import type { FetchListResult } from '../../types';

export const Route = createLazyFileRoute('/top/$page')({
  component: TopComponent,
});

function TopComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData<FetchListResult>();
  return (
    <ItemList type="top" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
