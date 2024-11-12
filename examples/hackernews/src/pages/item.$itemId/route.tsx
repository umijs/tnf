import { createFileRoute } from '@umijs/tnf/router';
import { fetchItem, fetchItems } from '../../services';
import type { CommentType, ItemIdInfo } from '../../types';

export const Route = createFileRoute('/item/$itemId')({
  loader: async ({
    params,
  }: {
    params: { itemId: string };
  }): Promise<ItemIdInfo> => {
    const item = await fetchItem(params.itemId);
    const kids = item.kids || [];
    const comments: CommentType[] = await fetchItems(kids);
    return { item, comments };
  },
});
