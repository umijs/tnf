import React, { useState } from 'react';
import { Link } from '@umijs/tnf/router';
import type { CommentType } from '../../types';
import { timeAgo } from '../../utils';
import styles from './index.module.less';

export default function Comment({ comment }: { comment: CommentType }) {
  const [open, setOpen] = useState(true);

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
              {`${open ? 'collapse' : 'expand'} ${comment.kids.length}`}
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
          ? comment.kids.map((id) => <Comment key={id} id={id} />)
          : null}
      </div>
    </div>
  );
}
