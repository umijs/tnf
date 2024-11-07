import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import { fetchList } from '../../services/api';
import type { Params } from '../../types';

export const Route = createFileRoute('/new/$page')({
  component: NewComponent,
  loader: async ({ params }: { params: Params }) =>
    await fetchList('new', Number(params.page)),
});

function NewComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData();

  return (
    <ItemList type="new" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
