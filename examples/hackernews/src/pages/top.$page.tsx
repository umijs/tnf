import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../components/item-list';
import { fetchList } from '../services/api';
import type { Params } from '../types';

export const Route = createFileRoute('/top/$page')({
  component: TopComponent,
  loader: async ({ params }: { params: Params }) =>
    await fetchList('top', Number(params.page)),
});

function TopComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData();

  return (
    <ItemList type="top" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
