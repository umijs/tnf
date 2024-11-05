import { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../components/item-list';

export const Route = createFileRoute('/')({
  component: TopComponent,
});

function TopComponent() {
  const page = Number(Route.useParams()?.page ?? '1') ?? 1;

  return <ItemList type="top" page={page} />;
}
