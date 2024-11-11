import React, { createFileRoute } from '@umijs/tnf/router';
import ItemPage from '../components/item-page';
import { fetchItem } from '../services';

export const Route = createFileRoute('/item/$itemId')({
  component: Item,
  loader: async ({ params }: { params: { itemId: string } }) => {
    const item = await fetchItem(params.itemId);
    const commentPromises = item.kids.map(async (id) => await fetchItem(id));
    const comments = await Promise.all(commentPromises);
    return { item, comments };
  },
});

function Item() {
  const { item, comments } = Route.useLoaderData();
  return <ItemPage item={item} comments={comments} />;
}
