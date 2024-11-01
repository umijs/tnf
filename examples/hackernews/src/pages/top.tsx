import { createFileRoute } from '@umijs/tnf/router'

export const Route = createFileRoute('/top')({
  component: TopComponent,
})

function TopComponent() {
  return <div>Top</div>
}
