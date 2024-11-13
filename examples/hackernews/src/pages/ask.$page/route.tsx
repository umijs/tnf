import { createFileRoute } from '@umijs/tnf/router';
import { fetchList } from '../../services/api';
import type { Params } from '../../types';

export const Route = createFileRoute('/ask/$page')({
  loader: async ({ params }: { params: Params }) =>
    await fetchList('ask', Number(params.page)),
});
