import { createFileRoute } from '@umijs/tnf/router'
import ItemList from '../../components/item-list'

export const Route = createFileRoute('/job/$page')({
  component: JobComponent,
})

function JobComponent() {
  const {page} = Route.useParams();
  return <ItemList type="job" page={Number(page)} />
}
