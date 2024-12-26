import 'zx/globals';

const files = {
  // 'gradient-string': {
  //   file: './node_modules/gradient-string/dist/index.js',
  //   dts: './node_modules/gradient-string/dist/index.d.ts',
  // },
};

const bundleWithMako = async (name: string) => {
  const mako = await import('@umijs/mako');
  await mako.build({
    config: {
      entry: {
        index: files[name].file,
      },
      mode: 'production',
      devtool: false,
      output: {
        path: `./compiled/${name}`,
        mode: 'bundle',
      },
      platform: 'node',
      optimization: {
        // @ts-ignore
        concatenateModules: false,
      },
      cjs: true,
    },
    root: process.cwd(),
    watch: false,
  });
};

const compile = async (name: string) => {
  const { dts } = files[name];
  const targetDir = `./compiled/${name}`;
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true });
  }
  await bundleWithMako(name);
  // await $`bun build ${file} --outfile ${targetDir}/index.js --target node --packages bundle `;
  if (dts) {
    await $`cp ${dts} ${targetDir}/index.d.ts`;
  }
};

(async () => {
  const name = process.argv[2];
  if (!name) {
    console.log('No package name provided, compile all');
    for (const name of Object.keys(files)) {
      await compile(name);
    }
  } else {
    await compile(name);
  }
})().catch(console.error);
