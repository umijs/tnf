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

export interface CommentType {
  id: number;
  by: string;
  time: number;
  text: string;
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

export interface User {
  id: string;
  created: number;
  karma: number;
  about?: string;
}

export interface ItemIdInfo {
  item: ItemProps;
  comments: CommentType[];
}
