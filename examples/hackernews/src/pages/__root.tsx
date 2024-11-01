import React from 'react';
import {Link, Outlet, createRootRoute} from '@umijs/tnf/router';
import styles from './index.less';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className={styles.header}>
        <div className={styles.inner}>
          <Link>
            <img alt="presentation" className={styles.logo}
                 src="https://zos.alipayobjects.com/rmsportal/AsASAiphPWWUJWG.png"/>
          </Link>
          <Link activeProps={{className: styles['active']}} to="/top">Top</Link>
          <Link activeProps={{className: styles['active']}} to="/new">New</Link>
          <Link activeProps={{className: styles['active']}} to="/show">Show</Link>
          <Link activeProps={{className: styles['active']}} to="/ask">Ask</Link>
          <Link activeProps={{className: styles['active']}} to="/job">Jobs</Link>
          <span className={styles.github}>
            Built with <a rel="noopener noreferrer" href="https://github.com/umijs/tnf" target="_blank">Tnf</a> and <a
            rel="noopener noreferrer" href="https://github.com/umijs/mako" target="_blank">Mako</a>
          </span>
        </div>
      </div>
      <div className={styles.view}>
        <Outlet/>
      </div>
    </>
  ),
});
