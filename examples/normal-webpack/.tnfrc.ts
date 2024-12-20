import { defineConfig } from '@umijs/tnf';

export default defineConfig({
  bundler: 'webpack',
  router: {
    defaultPreload: 'intent',
    convention: {
      routeFileIgnorePattern: 'components',
    },
  },
  plugins: [
    {
      config: ({ command }) => {
        console.log('config', command);
        return {
          // foo: 'bar',
        };
      },
      configResolved: (config) => {
        // console.log('configResolved', config);
      },
      buildStart: ({ command }) => {
        console.log('buildStart', command);
      },
      buildEnd: ({ command, err }) => {
        console.log('buildEnd', command, err);
      },
    },
  ],
  mock: { delay: '500-1000' },
  // reactScan: {},
  reactCompiler: {},
});
