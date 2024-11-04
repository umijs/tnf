import { createFileRoute } from '@umijs/tnf/router'
import ItemList from '../components/item-list'

export const Route = createFileRoute('/top')({
  component: TopComponent,
})

function TopComponent() {
  return <ItemList type="top" />
}
