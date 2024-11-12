import { createFileRoute } from '@umijs/tnf/router';
import { fetchList } from '../services/api';
import type { Params } from '../types';

export const Route = createFileRoute('/top/$page')({
  loader: async ({ params }: { params: Params }) =>
    await fetchList('top', Number(params.page)),
});
