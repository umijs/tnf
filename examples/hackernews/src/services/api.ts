import type { FetchListResult, ItemProps, ListData } from '../types';
import { fetchIdsByType, fetchItems } from './index';

export async function fetchList(
  type: string,
  page: number = 1,
): Promise<FetchListResult> {
  const itemsPerPage = 20;
  let lists: ListData = {};
  if (!lists[type]) {
    lists[type] = [];
  }
  const ids = await fetchIdsByType(type);
  lists[type] = [...(lists[type] || []), ...ids];
  const maxPage = Math.ceil((lists[type]?.length || 0) / itemsPerPage);
  const items = await fetchItems(
    ids.slice(itemsPerPage * (page - 1), itemsPerPage * page),
  );
  const itemsById = items.reduce(
    (_memo, item) => {
      const memo = _memo;
      memo[item.id] = item;
      return memo;
    },
    {} as Record<number, ItemProps>,
  );

  return {
    items,
    maxPage,
    lists,
    itemsById,
  };
}
