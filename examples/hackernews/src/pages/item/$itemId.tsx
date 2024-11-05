import React, { useContext } from 'react';
import { createFileRoute } from '@umijs/tnf/router';
import ItemPage from '../../components/item-page';
import { Context } from '../../context';

export const Route = createFileRoute('/item/$itemId')({
  component: Item,
});

function Item() {
  const { itemId } = Route.useParams();
  const { state } = useContext(Context);
  return (
    <ItemPage item={state.itemsById[itemId]} itemsById={state.itemsById} />
  );
}
