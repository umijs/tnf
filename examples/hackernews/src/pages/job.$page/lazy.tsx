import React, { createLazyFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import type { FetchListResult } from '../../types';

export const Route = createLazyFileRoute('/job/$page')({
  component: JobComponent,
});

function JobComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData<FetchListResult>();
  return (
    <ItemList type="job" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
