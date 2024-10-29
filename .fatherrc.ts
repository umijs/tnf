import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    input: 'src',
    ignores: ['src/client/**'],
    output: 'dist',
  },
  esm: {
    input: 'src/client',
    output: 'client',
  },
});
