import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    transformer: 'babel',
    input: 'src',
    output: 'dist',
  },
});
