import React, { createFileRoute } from '@umijs/tnf/router';
import UserPage from '../components/user-page';
import { fetchUser } from '../services';

export const Route = createFileRoute('/user/$userId')({
  component: User,
  loader: async ({ params }: { params: { userId: string } }) =>
    await fetchUser(params.userId),
});

function User() {
  const user = Route.useLoaderData();

  return <UserPage user={user} />;
}
