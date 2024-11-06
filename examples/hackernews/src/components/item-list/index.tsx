import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from '@umijs/tnf/router';
import { Context } from '../../context';
import { fetchIdsByType, fetchItems } from '../../services';
import Item from '../item';
import Loading from '../loading';
import styles from './index.module.less';

interface Item {
  id: number;
  score: number;
  title: string;
  url?: string;
  type: string;
  by: string;
  descendants: number;
  time: number;
}

interface ItemListProps {
  type: keyof Lists;
  page: number;
}

interface Lists {
  top: number[];
  new: number[];
  show: number[];
  ask: number[];
  job: number[];
}


export default function ItemList({ type, page }: ItemListProps) {
  const { dispatch } = useContext(Context);
  const [lists, setLists] = useState<Lists>({
    top: [],
    new: [],
    show: [],
    ask: [],
    job: [],
  });
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 20;
  const maxPage = useMemo(
    () => Math.ceil(lists[type].length / itemsPerPage),
    [lists, type],
  );

  useEffect(() => {
    async function fetchList() {
      const ids = await fetchIdsByType(type);
      setLists({ ...lists, [type]: ids });
      const items = await fetchItems(
        ids.slice(itemsPerPage * (page - 1), itemsPerPage * page),
      );
      const itemsById = items.reduce((_memo, item) => {
        const memo = _memo;
        memo[item.id] = item;
        return memo;
      }, {} as Record<number, Item>);
      setLoading(false);
      setItems(items);
      dispatch({ type: 'saveItems', payload: itemsById });
    }

    fetchList();
  }, [page, type]);

  return (
    <>
      <div className={styles.nav}>
        {page > 1 ? (
          <Link to={`/${type}/$page`} params={{ page: page - 1 }}>
            &lt; prev
          </Link>
        ) : (
          <a className={styles.disabled}>&lt; prev</a>
        )}
        <span>{`${page}/${maxPage}`}</span>
        {page < maxPage ? (
          <Link to={`/${type}/$page`} params={{ page: page + 1 }}>
            more &gt;
          </Link>
        ) : (
          <a className={styles.disabled}>more &gt;</a>
        )}
      </div>

      <div className={styles.list}>
        <Loading loading={loading} />
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
