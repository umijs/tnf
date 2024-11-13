import { createLazyFileRoute } from '@umijs/tnf/router';
import ItemPage from '../../components/item-page';
import type { ItemIdInfo } from '../../types';

export const Route = createLazyFileRoute('/item/$itemId')({
  component: Item,
});

function Item() {
  const { item, comments } = Route.useLoaderData<ItemIdInfo>();
  return <ItemPage item={item} comments={comments} />;
}
