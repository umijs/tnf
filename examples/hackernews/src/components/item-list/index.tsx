import { useEffect, useState, useMemo, useContext } from 'react';
import { Link } from '@umijs/tnf/router';
import {Context} from '../../context';
import { fetchIdsByType, fetchItems } from '../../services';
import Item from '../item';
import Loading from '../loading';
import styles from './index.less';

export default function ItemList({ type, page }) {
  const {dispatch} = useContext(Context);
  const [lists, setLists] = useState({
    top: [],
    new: [],
    show: [],
    ask: [],
    job: [],
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 20;
  const maxPage = useMemo(() => Math.ceil(lists[type].length / itemsPerPage), [lists])

  useEffect(() => {
    async function fetchList() {
      const ids = await fetchIdsByType(type);
      setLists({ ...lists, [type]: ids });
      const items = await fetchItems(ids.slice(itemsPerPage * (page - 1), itemsPerPage * page));
      const itemsById = items.reduce((_memo, item) => {
        const memo = _memo;
        memo[item.id] = item;
        return memo;
      }, {});
      setLoading(false);
      setItems(items);
      dispatch({ type: 'saveItems', payload: itemsById })
    }

    fetchList();
  }, [page]);

  return (
    <>
      <div className={styles.nav}>
        {
          page > 1
            ? <Link to={`/${type}/$page`} params={{ page: page - 1 }}>&lt; prev</Link>
            : <a className={styles.disabled}>&lt; prev</a>
        }
        <span>{`${page}/${maxPage}`}</span>
        {
          page < maxPage
            ? <Link to={`/${type}/$page`} params={{ page: page + 1 }}>more &gt;</Link>
            : <a className={styles.disabled}>more &gt;</a>
        }
      </div>

      <div className={styles.list}>
        <Loading loading={loading} />
        {items.map(item => <Item key={item.id} item={item} />)}
      </div>
    </>
  )
}
