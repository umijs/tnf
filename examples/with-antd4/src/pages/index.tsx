import { createFileRoute } from '@umijs/tnf/router';
import MyButton from '../components/MyButton';
import styles from './index.module.less';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className={styles.foo}>
      <MyButton>Click Me!</MyButton>
      <h3>Welcome Home!</h3>
    </div>
  );
}
