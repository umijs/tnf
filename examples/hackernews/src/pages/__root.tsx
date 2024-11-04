import {useReducer} from 'react';
import {Link, Outlet, createRootRoute} from '@umijs/tnf/router';
import {Context, reducer, initialState} from '../context';
import styles from './index.less';

export const Route = createRootRoute({
  component: () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <>
        <div className={styles.header}>
          <div className={styles.inner}>
            <Link to="/">
              <img alt="presentation" className={styles.logo}
                   src="https://zos.alipayobjects.com/rmsportal/AsASAiphPWWUJWG.png"/>
            </Link>
            <Link activeProps={{className: styles['active']}} to="/top/$page" params={{page: 1}}>Top</Link>
            <Link activeProps={{className: styles['active']}} to="/new/$page" params={{page: 1}}>New</Link>
            <Link activeProps={{className: styles['active']}} to="/show/$page" params={{page: 1}}>Show</Link>
            <Link activeProps={{className: styles['active']}} to="/ask/$page" params={{page: 1}}>Ask</Link>
            <Link activeProps={{className: styles['active']}} to="/job/$page" params={{page: 1}}>Jobs</Link>
            <span className={styles.github}>
            Built with <a rel="noopener noreferrer" href="https://github.com/umijs/tnf" target="_blank">Tnf</a> and <a
              rel="noopener noreferrer" href="https://github.com/umijs/mako" target="_blank">Mako</a>
          </span>
          </div>
        </div>
        <div className={styles.view}>
          <Context.Provider value={{state, dispatch}}>
            <Outlet/>
          </Context.Provider>
        </div>
      </>
    )
  },
});
