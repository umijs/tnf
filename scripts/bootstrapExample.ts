import 'zx/globals';

(async () => {
  const examplesDir = path.join(__dirname, '..', 'examples');
  const folders = fs
    .readdirSync(examplesDir)
    .filter((folder) =>
      fs.statSync(path.join(examplesDir, folder)).isDirectory(),
    );
  const foldersWithoutPackageJson = folders.filter(
    (folder) => !fs.existsSync(path.join(examplesDir, folder, 'package.json')),
  );

  if (foldersWithoutPackageJson.length === 0) {
    console.log('All examples already bootstrapped');
    return;
  }

  // bootstrap each example
  for (const folder of foldersWithoutPackageJson) {
    const exampleDir = path.join(examplesDir, folder);

    // write files
    fs.writeFileSync(
      path.join(exampleDir, 'package.json'),
      JSON.stringify(
        {
          name: `@examples/${folder}`,
          private: true,
          scripts: {
            build: 'tnf build',
            dev: 'tnf dev',
            preview: 'tnf preview',
          },
          dependencies: {
            '@types/react': '^18.3.12',
            '@types/react-dom': '^18.3.1',
            '@umijs/tnf': 'workspace:*',
          },
          devDependencies: {
            typescript: '^5.6.3',
          },
        },
        null,
        2,
      ),
    );
    fs.writeFileSync(
      path.join(exampleDir, 'tsconfig.json'),
      `
{
  "extends": "./.tnf/tsconfig.json",
  "compilerOptions": {}

  // If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
  // from the referenced tsconfig.json - TypeScript does not merge them in
}
    `.trimStart(),
    );
    fs.writeFileSync(
      path.join(exampleDir, '.tnfrc.ts'),
      `
export default {
};
    `.trimStart(),
    );
    fs.mkdirSync(path.join(exampleDir, 'src'));
    fs.mkdirSync(path.join(exampleDir, 'src', 'pages'));
    fs.writeFileSync(
      path.join(exampleDir, 'src', 'pages', '__root.tsx'),
      `
import { Outlet, createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>Hello "${folder}"!</div>
      <Outlet />
    </>
  ),
});
    `.trimStart(),
    );
    fs.mkdirSync(path.join(exampleDir, 'public'));
    fs.writeFileSync(
      path.join(exampleDir, 'public', 'index.html'),
      `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="/client.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="/client.js"></script>
  </body>
</html>
    `.trimStart(),
    );

    // add ignore in .changeset/config.json
    const changesetConfig = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', '.changeset', 'config.json'),
        'utf-8',
      ),
    );
    changesetConfig.ignore.push(`@examples/${folder}`);
    fs.writeFileSync(
      path.join(__dirname, '..', '.changeset', 'config.json'),
      JSON.stringify(changesetConfig, null, 2),
    );

    console.log(`Bootstrapped example "${folder}"`);
  }
})();
