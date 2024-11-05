import { createFileRoute } from '@umijs/tnf/router'
import ItemList from '../../components/item-list'

export const Route = createFileRoute('/ask/$page')({
  component: AskComponent,
})

function AskComponent() {
  const {page} = Route.useParams();
  return <ItemList type="ask" page={Number(page)} />
}
