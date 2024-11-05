import { Link } from '@umijs/tnf/router';
import { host, timeAgo } from '../../utils';
import styles from './index.less';

export default function Item({item}) {
  const {
    score,
    title,
    url,
    type,
    id,
    by,
    descendants,
    time,
  } = item;

  return (
    <div className={styles.normal}>
      <span className={styles.score}>{score}</span>
      <span className={styles.title}>
        {
          url
            ? <span><a href={url} rel="noopener noreferrer" target="_blank">{title}</a><span
              className={styles.host}> ({host(url)})</span></span>
            : <Link to={`/item/$id`} params={{id}} state={{item}}>{title}</Link>
        }
      </span>
      <br/>
      <span className={styles.meta}>
        {
          type !== 'job'
            ? <span className={styles.by}>by <Link to={`/user/$by`} params={{by}}>{by}</Link></span>
            : null
        }
        <span className={styles.time}>{` ${timeAgo(time)}`} ago</span>
        {
          type !== 'job'
            ? <span className={styles.commentsLink}>
              <span>{' | '}</span>
              <Link to={`/item/$id`} params={{id}}>{descendants} comments</Link>
            </span>
            : null
        }
      </span>
      {
        type !== 'story'
          ? <span className={styles.label}>{type}</span>
          : null
      }
    </div>
  )
}
