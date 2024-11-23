import React from 'react';
import { createFileRoute } from '@umijs/tnf/router';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import assert from 'assert';
import OpenAI from 'openai';
import styles from './index.module.less';

export const Route = createFileRoute('/')({
  component: Index,
});

const apiKey = localStorage.getItem('OPENAI_API_KEY');
assert(
  apiKey,
  'OPENAI_API_KEY is required, execute `localStorage.setItem("OPENAI_API_KEY", "<your-api-key>")` to set it',
);
const client = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

function Index() {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const stream = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: info.message }],
        stream: true,
      });
      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || '';
        callbacks.onUpdate(content);
      }
    },
  });

  const { onRequest, messages } = useXChat({ agent });

  const items = messages.map((i) => ({
    content: i.message,
  }));

  return (
    <div className={styles.container}>
      <h3>Welcome to Index Page!</h3>
      <Bubble content="Hello world!" />
      <Bubble.List items={items} />
      <Sender onSubmit={onRequest} />
    </div>
  );
}
