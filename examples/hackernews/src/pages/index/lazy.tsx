import { createLazyFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import type { FetchListResult, Params } from '../../types';

export const Route = createLazyFileRoute('/')({
  component: TopComponent,
});

function TopComponent() {
  const params = Route.useParams<Params>();
  const page = Number(params?.page ?? '1') ?? 1;
  const { items, maxPage } = Route.useLoaderData<FetchListResult>();
  return <ItemList type="top" page={page} maxPage={maxPage} items={items} />;
}
