import { createFileRoute } from '@umijs/tnf/router';
import Home from './components';

export const Route = createFileRoute('/')({
  component: Home,
});
