import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../components/item-list';

interface Params {
  page?: string;
}

export const Route = createFileRoute('/')({
  component: TopComponent,
});

function TopComponent() {
  const params = Route.useParams<Params>();
  const page = Number(params?.page ?? '1') ?? 1;

  return <ItemList type="top" page={page} />;
}
