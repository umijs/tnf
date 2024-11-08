import React, { createFileRoute } from '@umijs/tnf/router';
import ItemPage from '../components/item-page';
import { fetchItem } from '../services';

export const Route = createFileRoute('/item/$itemId')({
  component: Item,
  loader: async ({ params }: { params: { itemId: string } }) =>
    await fetchItem(params.itemId),
});

function Item() {
  const item = Route.useLoaderData();
  return <ItemPage item={item} />;
}
