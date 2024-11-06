import React from 'react';
import { createFileRoute, useLoaderData } from '@umijs/tnf/router';

export const Route = createFileRoute('/foo')({
  component: Foo,
  loader: async () => {
    return {
      foo: 'bar',
    };
  },
});

function Foo() {
  const { foo } = useLoaderData({
    from: '/foo',
  });
  return (
    <div>
      <h3>Welcome Foo!</h3>
      <p>Hello {foo}</p>
    </div>
  );
}
