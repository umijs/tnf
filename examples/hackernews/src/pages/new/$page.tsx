import React, { createFileRoute } from '@umijs/tnf/router';
import ItemList from '../../components/item-list';

export const Route = createFileRoute('/new/$page')({
  component: NewComponent,
});

function NewComponent() {
  const { page } = Route.useParams();
  return <ItemList type="new" page={Number(page)} />;
}
