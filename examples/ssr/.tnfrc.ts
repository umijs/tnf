import { defineConfig } from '@umijs/tnf';

export default defineConfig({
  router: {
    defaultPreload: 'intent',
    convention: {
      routeFileIgnorePattern: 'components',
    },
  },
  ssr: {},
});
