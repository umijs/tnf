import React, { createLazyFileRoute } from '@umijs/tnf/router';
import ItemList from '../components/item-list';
import type { FetchListResult } from '../types';

export const Route = createLazyFileRoute('/show/$page')({
  component: ShowComponent,
});

function ShowComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData<FetchListResult>();
  return (
    <ItemList type="show" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
