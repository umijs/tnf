import React from 'react';
import { createFileRoute } from '@umijs/tnf/router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
