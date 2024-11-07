import React, { Link } from '@umijs/tnf/router';
import type { ItemProps } from '../../types';
import Item from '../item';
import styles from './index.module.less';

interface ItemListProps {
  type: keyof Lists;
  page: number;
  maxPage: number;
  items: ItemProps[];
}

interface Lists {
  top: number[];
  new: number[];
  show: number[];
  ask: number[];
  job: number[];
}

export default function ItemList({
  type,
  items,
  page,
  maxPage,
}: ItemListProps) {
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
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
