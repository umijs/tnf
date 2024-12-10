import { defineConfig } from '@umijs/tnf';

export default defineConfig({
  doctor: {
    phantomDeps: {
      exclude: ['@umijs/tnf'],
    },
  },
});
