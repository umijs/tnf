import { createFileRoute } from '@umijs/tnf/router';
import Home from './components/Home';

export const Route = createFileRoute('/')({
  loader: async ({ context, route }) => {
    console.log('context', context.root);
    // console.log('route', route.parentRoute);
    return {
      root: context.root,
    };
  },
  component: () => {
    return (
      <>
        <Home />
      </>
    );
  },
});
