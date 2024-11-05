import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';

export const Route = createFileRoute('/show/$page')({
  component: ShowComponent,
});

function ShowComponent() {
  const { page } = Route.useParams();
  return <ItemList type="show" page={Number(page)} />;
}
