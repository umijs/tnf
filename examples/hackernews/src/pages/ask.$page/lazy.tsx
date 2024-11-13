import { createLazyFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';
import type { FetchListResult } from '../../types';

export const Route = createLazyFileRoute('/ask/$page')({
  component: AskComponent,
});

function AskComponent() {
  const { page } = Route.useParams();
  const { items, maxPage } = Route.useLoaderData<FetchListResult>();
  return (
    <ItemList type="ask" page={Number(page)} maxPage={maxPage} items={items} />
  );
}
