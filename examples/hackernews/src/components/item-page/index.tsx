import React, { Link } from '@umijs/tnf/router';
import type { CommentType, ItemProps } from '../../types';
import { host, timeAgo } from '../../utils';
import Comment from '../comment';
import styles from './index.module.less';

export default function ItemPage({
  item,
  comments,
}: {
  item: ItemProps;
  comments: CommentType[];
}) {
  if (!item) return null;
  return (
    <>
      <div className={styles.header}>
        <a href={item.url}>
          <h1>{item.title}</h1>
        </a>
        {item.url ? (
          <span className={styles.host}>{host(item.url)}</span>
        ) : null}
        <p className={styles.meta}>
          <span>{`${item.score} points | by `}</span>
          <Link to={`/user/${item.by}`}>{item.by}</Link>
          <span>{` ${timeAgo(item.time)} ago`}</span>
        </p>
      </div>
      <div className={styles.comments}>
        <p className={styles.commentsHeader}>
          {item.kids ? `${item.descendants} comments` : 'No comments yet.'}
        </p>
        <div className={styles.commentChildren}>
          {comments
            ? comments.map((item: CommentType) => (
                <Comment key={item.id} comment={item} />
              ))
            : null}
        </div>
      </div>
    </>
  );
}
