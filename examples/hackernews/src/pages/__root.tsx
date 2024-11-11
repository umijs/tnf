import { Fragment } from 'react';
import React, { Link, Outlet, createRootRoute } from '@umijs/tnf/router';
import '../global.less';
import styles from './index.module.less';

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className={styles.header}>
          <div className={styles.inner}>
            <Link to="/">
              <img
                alt="presentation"
                className={styles.logo}
                src="https://zos.alipayobjects.com/rmsportal/AsASAiphPWWUJWG.png"
              />
            </Link>
            {(
              [
                ['/top/$page', 'Top'],
                ['/new/$page', 'New'],
                ['/show/$page', 'Show'],
                ['/ask/$page', 'Ask'],
                ['/job/$page', 'Jobs'],
              ] as const
            ).map(([to, label]) => {
              return (
                <Fragment key={to}>
                  <Link to={to} preload="intent" params={{ page: 1 }}>
                    {label}
                  </Link>
                </Fragment>
              );
            })}
            <span className={styles.github}>
              Built with
              <a
                rel="noopener noreferrer"
                href="https://github.com/umijs/tnf"
                target="_blank"
              >
                Tnf
              </a>
            </span>
          </div>
        </div>
        <div className={styles.view}>
          <Outlet />
        </div>
      </>
    );
  },
});
