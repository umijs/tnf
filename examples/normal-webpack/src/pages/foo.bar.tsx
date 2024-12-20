import React from 'react';
import { createFileRoute, useLoaderData } from '@umijs/tnf/router';
import styles from './foo.bar.module.less';

export const Route = createFileRoute('/foo/bar')({
  loader: async ({ context }) => {
    return {
      bar: 'bar',
      ...context,
    };
  },
  component: FooBar,
});

function FooBar() {
  const { bar, foo, root } = useLoaderData({
    from: '/foo/bar',
  });
  return (
    <div className={styles.container}>
      <h3>Welcome to Foo.bar Page!</h3>
      <p>bar: {bar}</p>
      <p>foo: {foo}</p>
      <p>root: {root}</p>
    </div>
  );
}
