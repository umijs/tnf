import React from 'react';
import { Button, type ButtonProps } from 'antd';
import styles from './index.module.less';

const MyButton: React.FC<ButtonProps> = (props) => (
  <div className={styles.container}>
    <Button {...props}></Button>
  </div>
);

export default MyButton;
