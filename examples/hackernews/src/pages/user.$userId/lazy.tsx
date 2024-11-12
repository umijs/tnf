import React, { createLazyFileRoute } from '@umijs/tnf/router';
import UserPage from '../../components/user-page';
import type { User } from '../../types';

export const Route = createLazyFileRoute('/user/$userId')({
  component: User,
});

function User() {
  const user = Route.useLoaderData<User>();
  return <UserPage user={user} />;
}
