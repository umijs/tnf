import React, { useEffect, useState } from 'react';
import { Link } from '@umijs/tnf/router';
import { fetchItem } from '../../services';
import { pluralize, timeAgo } from '../../utils';
import styles from './index.module.less';

export default function Comment({ id, itemsById }) {
  const [open, setOpen] = useState(true);
  const [comment, setComment] = useState(null);

  useEffect(() => {
    async function fetchComments() {
      setComment(await fetchItem(id));
    }

    fetchComments();
  }, []);

  if (!comment) return null;
  return (
    <div className={styles.normal}>
      <div className={styles.by}>
        <Link to={`/user/${comment.by}`}>{comment.by}</Link>
        <span>{` ${timeAgo(comment.time)} ago`}</span>
        {comment.kids ? (
          <span>
            {' '}
            |{' '}
            <a
              href=""
              className={styles.expand}
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              {`${open ? 'collapse' : 'expand'} ${pluralize(comment.kids.length)}`}
            </a>
          </span>
        ) : null}
      </div>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
      <div className={styles.commentChildren}>
        {comment.kids && open
          ? comment.kids.map((id) => (
              <Comment key={id} id={id} itemsById={itemsById} />
            ))
          : null}
      </div>
    </div>
  );
}
