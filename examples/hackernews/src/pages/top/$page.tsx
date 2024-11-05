import { createFileRoute } from '@umijs/tnf/router'
import ItemList from '../../components/item-list'

export const Route = createFileRoute('/top/$page')({
  component: TopComponent,
  validateSearch: (search) => {},
  loader: async () => {}
})

function TopComponent() {
  const {page} = Route.useParams();
  return <ItemList type="top" page={Number(page)} />
}
