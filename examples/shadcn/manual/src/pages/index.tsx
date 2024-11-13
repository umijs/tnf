import React from 'react';
import { createFileRoute } from '@umijs/tnf/router';
import { Textarea } from '@/components/ui/textarea';
import styles from './index.module.less';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className={styles.foo}>
      <h3>Welcome Home!</h3>
      <div className="grid w-1/2 mx-auto gap-2.5">
        <Textarea placeholder="Type your message here." id="message-2" />
        <p className="text-sm text-muted-foreground">
          This is a demo of shadcn/ui(Manual Installation) in tnf.
        </p>
      </div>
    </div>
  );
}
