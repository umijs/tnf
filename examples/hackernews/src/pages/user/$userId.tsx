import React, { createFileRoute } from '@umijs/tnf/router';
import UserPage from '../../components/user-page';

export const Route = createFileRoute('/user/$userId')({
  component: User,
});

function User() {
  const { userId } = Route.useParams();
  console.log('userId', userId);
  return <UserPage id={userId} />;
}
