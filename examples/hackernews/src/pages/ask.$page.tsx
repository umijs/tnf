import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../components/item-list';
import { fetchList } from '../services/api';
import type { Params } from '../types';

export const Route = createFileRoute('/ask/$page')({
  component: AskComponent,
  loader: async ({ params }: { params: Params }) =>
    await fetchList('ask', Number(params.page)),
});

function AskComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData();

  return (
    <ItemList type="ask" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
