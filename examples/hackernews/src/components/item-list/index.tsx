import {useEffect, useState} from 'react';
import {fetchIdsByType, fetchItems} from '../../services';
import Item from '../item';
import Loading from '../loading';
import styles from './index.less';

export default function ItemList({type}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchList() {
      const ids = await fetchIdsByType(type);
      const itemsPerPage = 20;
      const page = 1;
      const items = await fetchItems(ids.slice(itemsPerPage * (page - 1), itemsPerPage * page));
      setLoading(false);
      setItems(items);
    }

    fetchList();
  }, []);

  return (
    <>
      <div className={styles.nav}>
        <span>1/50</span>
      </div>

      <div className={styles.list}>
        <Loading loading={loading} />
        {items.map(item => <Item key={item.id} item={item}/>)}
      </div>
    </>
  )
}
