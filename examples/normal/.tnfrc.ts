import { defineConfig } from '@umijs/tnf';

export default defineConfig({
  router: {
    defaultPreload: 'intent',
    convention: {
      routeFileIgnorePattern: 'components',
    },
  },
  plugins: [
    {
      buildStart: ({ command }) => {
        console.log('buildStart', command);
      },
      buildEnd: ({ command, err }) => {
        console.log('buildEnd', command, err);
      },
    },
  ],
});
