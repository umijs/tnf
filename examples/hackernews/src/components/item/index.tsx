import React, { Link } from '@umijs/tnf/router';
import { host, timeAgo } from '../../utils';
import styles from './index.module.less';

interface ItemProps {
  item: {
    score: number;
    title: string;
    url?: string;
    type: string;
    id: number;
    by: string;
    descendants: number;
    time: number;
  };
}

export default function Item({ item }: ItemProps) {
  const { score, title, url, type, id, by, descendants, time } = item;

  return (
    <div className={styles.normal}>
      <span className={styles.score}>{score}</span>
      <span className={styles.title}>
        {url ? (
          <span>
            <a href={url} rel="noopener noreferrer" target="_blank">
              {title}
            </a>
            <span className={styles.host}> ({host(url)})</span>
          </span>
        ) : (
          <Link to={`/item/$itemId`} params={{ itemId: id }}>
            {title}
          </Link>
        )}
      </span>
      <br />
      <span className={styles.meta}>
        {type !== 'job' ? (
          <span className={styles.by}>
            by{' '}
            <Link to={`/user/$by`} params={{ by }}>
              {by}
            </Link>
          </span>
        ) : null}
        <span className={styles.time}>{` ${timeAgo(time)}`} ago</span>
        {type !== 'job' ? (
          <span className={styles.commentsLink}>
            <span>{' | '}</span>
            <Link to={`/item/$itemId`} params={{ itemId: id }}>
              {descendants} comments
            </Link>
          </span>
        ) : null}
      </span>
      {type !== 'story' ? <span className={styles.label}>{type}</span> : null}
    </div>
  );
}
