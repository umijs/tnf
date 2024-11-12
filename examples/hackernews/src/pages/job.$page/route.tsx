import { createFileRoute } from '@umijs/tnf/router';
import { fetchList } from '../../services/api';
import type { Params } from '../../types';

export const Route = createFileRoute('/job/$page')({
  loader: async ({ params }: { params: Params }) =>
    await fetchList('job', Number(params.page)),
});
