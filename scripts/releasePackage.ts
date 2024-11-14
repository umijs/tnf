import assert from 'assert';
import 'zx/globals';

(async () => {
  const pkg = argv.pkg;
  assert(pkg, 'pkg is required, specify with --pkg <pkg-name>');
  const pkgDir = path.join(__dirname, '../', pkg);
  assert(fs.existsSync(pkgDir), `pkg ${pkg} not found: ${pkgDir}`);

  console.log('Building package...');
  await $`cd ${pkgDir} && npm run build`;

  // console.log('Bumping version...');
  // const npmVersion = argv.minor ? 'minor' : 'patch';
  // await $`cd ${pkgDir} && npm version ${npmVersion}`;

  console.log('Publishing package...');
  await $`cd ${pkgDir} && npm publish`;

  const newVersion = require(path.join(pkgDir, 'package.json')).version;

  // console.log('Adding to git...');
  // await $`pnpm install`;
  // await $`git add ${pkgDir}`;
  // await $`git commit -m "release: ${pkg}@${newVersion}" -n`;

  console.log('Pushing to git...');
  await $`git push`;

  console.log(`Published ${pkg}@${newVersion}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
