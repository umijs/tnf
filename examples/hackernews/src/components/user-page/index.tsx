import React from 'react';
import { timeAgo } from '../../utils';
import styles from './index.module.less';

interface User {
  id: string;
  created: number;
  karma: number;
  about?: string;
}

export default function UserPage({ user }: { user: User }) {
  if (!user) return null;
  return (
    <div className={styles.normal}>
      <h1>User : {user.id}</h1>
      <ul className={styles.meta}>
        <li>
          <span className={styles.label}>Created: </span>
          <span>{`${timeAgo(user.created)} ago`}</span>
        </li>
        <li>
          <span className={styles.label}>Karma: </span>
          <span>{user.karma}</span>
        </li>
        {user.about ? (
          <li
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: user.about }}
          />
        ) : null}
      </ul>
      <p className={styles.links}>
        <a
          href={`https://news.ycombinator.com/submitted?id=${user.id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          submissions
        </a>
        <span> | </span>
        <a
          href={`https://news.ycombinator.com/threads?id=${user.id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          comments
        </a>
      </p>
    </div>
  );
}
