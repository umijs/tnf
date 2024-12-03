import {
  Link,
  Outlet,
  createFileRoute,
  useLoaderData,
} from '@umijs/tnf/router';

export const Route = createFileRoute('/foo')({
  component: Foo,
  loader: async ({ context }) => {
    // const res = await fetch('https://dummyjson.com/users');
    const res = await fetch('/api/foo?delay=2000');
    const data = await res.json();
    return data;
  },
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 0,
  gcTime: 1000 * 60 * 5,
  staleTime: 1000 * 60 * 2,
  beforeLoad: async () => {
    return {
      foo: 'foo',
    };
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
      <Link to="/foo/bar">Go to Foo.bar</Link>
      <Outlet />
    </div>
  );
}
