import { createFileRoute } from '@umijs/tnf/router';
import { fetchItem } from '../../services';
import type { ItemIdInfo } from '../../types';

export const Route = createFileRoute('/item/$itemId')({
  loader: async ({
    params,
  }: {
    params: { itemId: string };
  }): Promise<ItemIdInfo> => {
    const item = await fetchItem(params.itemId);
    const commentPromises = (item.kids || []).map(
      async (id: number) => await fetchItem(id),
    );
    const comments = await Promise.all(commentPromises);
    return { item, comments };
  },
});
