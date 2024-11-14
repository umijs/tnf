import { createFileRoute } from '@umijs/tnf/router';
import styles from './index.module.less';

function Home() {
  return (
    <div className={styles.foo}>
      <h3>Welcome Home!</h3>
    </div>
  );
}

export default Home;
