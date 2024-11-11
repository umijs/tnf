import React, { Link } from '@umijs/tnf/router';
import type { CommentType } from '../../types';
import { timeAgo } from '../../utils';
import styles from './index.module.less';

export default function Comment({ comment }: { comment: CommentType }) {
  if (!comment) return null;

  return (
    <div className={styles.normal}>
      <div className={styles.by}>
        <Link to={`/user/${comment.by}`}>{comment.by}</Link>
        <span>{` ${timeAgo(comment.time)} ago`}</span>
      </div>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
    </div>
  );
}
