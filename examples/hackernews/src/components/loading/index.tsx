import React from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

interface SpinnerProps {
  loading: boolean;
}

function Spinner({ loading }: SpinnerProps) {
  const svgCls = classnames({
    [styles.spinner as string]: true,
    [styles.show as string]: loading,
  });
  return (
    <div>
      <svg className={svgCls} width="44px" height="44px" viewBox="0 0 44 44">
        <circle
          className={styles.path}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          cx="22"
          cy="22"
          r="20"
        />
      </svg>
    </div>
  );
}

export default Spinner;
