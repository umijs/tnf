import React from 'react';
import { createFileRoute, useLoaderData } from '@umijs/tnf/router';

export const Route = createFileRoute('/foo')({
  component: Foo,
  loader: async () => {
    const res = await fetch('https://dummyjson.com/users');
    const data = await res.json();
    return data;
  },
});

function Foo() {
  const { users } = useLoaderData({
    from: '/foo',
  });
  return (
    <div>
      <h3>Welcome Foo!</h3>
      <p>Users</p>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.firstName}</li>
        ))}
      </ul>
    </div>
  );
}
