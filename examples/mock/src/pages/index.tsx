import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@umijs/tnf/router';
import styles from './index.module.less';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch('/api/list', {
      method: 'post',
      body: JSON.stringify({
        pageSize: 10,
        offset: 0,
      }),
    })
      .then((response) => response.json())
      .then((user) => setList(user.data));
  }, []);
  return (
    <div className={styles.foo}>
      <h3>Welcome Home!</h3>
      <ul>
        {list.map((i: any) => (
          <li key={i.id}>{i.title}</li>
        ))}
      </ul>
    </div>
  );
}
