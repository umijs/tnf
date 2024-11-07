export interface ListData {
  [type: string]: number[];
}

export interface ItemProps {
  id: number;
  score: number;
  title: string;
  url?: string;
  type: string;
  by: string;
  descendants: number;
  time: number;
  kids?: number[];
}

export interface FetchListResult {
  items: ItemProps[];
  maxPage: number;
  lists: ListData;
  itemsById: Record<number, ItemProps>;
}

export interface Params {
  page: string;
}
