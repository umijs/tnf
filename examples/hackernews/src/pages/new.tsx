import { createFileRoute } from '@umijs/tnf/router'
import ItemList from '../components/item-list'

export const Route = createFileRoute('/new')({
  component: NewComponent,
})

function NewComponent() {
  return <ItemList type="new" />
}
