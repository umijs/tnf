import { createFileRoute } from '@umijs/tnf/router';
import { fetchList } from '../services/api';
import type { Params } from '../types';

export const Route = createFileRoute('/show/$page')({
  loader: async ({ params }: { params: Params }) =>
    await fetchList('show', Number(params.page)),
});
