import { createFileRoute } from '@umijs/tnf/router';
import { fetchUser } from '../../services';

export const Route = createFileRoute('/user/$userId')({
  loader: async ({ params }: { params: { userId: string } }) =>
    await fetchUser(params.userId),
});
