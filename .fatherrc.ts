import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    transformer: 'babel',
    input: 'src',
    output: 'dist',
  },
});
