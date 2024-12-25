import assert from 'assert';
import 'zx/globals';

const compile = async () => {
  const mako = await import('@umijs/mako');
  await mako.build({
    config: {
      entry: {
        cli: './src/cli.ts',
      },
      mode: 'production',
      devtool: false,
      output: {
        path: `./dist`,
        mode: 'bundle',
      },
      platform: 'node',
      optimization: {
        // @ts-ignore
        concatenateModules: false,
      },
      minify: false,
      cjs: true,
    },
    root: process.cwd(),
    watch: false,
  });

  // patch the output file
  // replace "src" with __dirname
  const outputFile = path.join(process.cwd(), 'dist/cli.js');
  assert(fs.existsSync(outputFile), 'Output file not found');
  const content = fs.readFileSync(outputFile, 'utf-8');
  const newContent = content.replace(/"src"/g, `__dirname`);
  // make sure the new content has two "__dirname"
  assert(newContent.includes('__dirname'), 'Output file not patched correctly');
  fs.writeFileSync(outputFile, newContent);
  console.log('Output file patched successfully');
};

(async () => {
  await compile();
})().catch(console.error);
