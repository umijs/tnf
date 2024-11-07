import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import { fetchList } from '../../services/api';
import type { Params } from '../../types';

export const Route = createFileRoute('/show/$page')({
  component: ShowComponent,
  loader: async ({ params }: { params: Params }) =>
    await fetchList('show', Number(params.page)),
});

function ShowComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData();

  return (
    <ItemList type="show" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
