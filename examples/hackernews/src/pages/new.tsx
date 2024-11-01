import { createFileRoute } from '@umijs/tnf/router'

export const Route = createFileRoute('/new')({
  component: NewComponent,
})

function NewComponent() {
  return <div>New</div>
}
