import React, { createLazyFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import type { FetchListResult } from '../../types';

export const Route = createLazyFileRoute('/new/$page')({
  component: NewComponent,
});

function NewComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData<FetchListResult>();
  return (
    <ItemList type="new" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
