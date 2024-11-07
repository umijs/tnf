import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../components/item-list';
import { fetchList } from '../services/api';
import type { Params } from '../types';

export const Route = createFileRoute('/')({
  component: TopComponent,
  loader: async ({ params }: { params: Params }) =>
    await fetchList('top', Number(params?.page ?? '1') ?? 1),
});

function TopComponent() {
  const params = Route.useParams<Params>();
  const page = Number(params?.page ?? '1') ?? 1;
  const { items, maxPage } = Route.useLoaderData();

  return <ItemList type="top" page={page} maxPage={maxPage} items={items} />;
}
