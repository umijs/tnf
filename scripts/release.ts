import 'zx/globals';
import assert from 'assert';
import getGitRepoInfo from 'git-repo-info';

(async () => {
  const { branch } = getGitRepoInfo();

  console.log('pnpm install');
  await $`pnpm install`;

  console.log('git status');
  const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');

  console.log('build');
  await $`npm run build`;

  console.log('doctor');
  await $`father doctor`;

  console.log('bump version');
  const currentVersion = require('../package.json').version;
  console.log('current version', currentVersion);
  const version = await question('Enter the new version: ');
  const pkg = require('../package.json');
  pkg.version = version;
  fs.writeFileSync(
    path.join(__dirname, '../package.json'),
    JSON.stringify(pkg, null, 2) + '\n',
  );

  console.log('commit & tag');
  await $`git commit --all --message "release: ${version}"`;
  await $`git tag ${version}`;

  console.log('publish');
  let tag = 'latest';
  if (
    version.includes('-alpha.') ||
    version.includes('-beta.') ||
    version.includes('-rc.')
  ) {
    tag = 'next';
  }
  await $`npm publish --tag ${tag}`;

  console.log('git push');
  await $`git push origin ${branch} --tags`;

  console.log('release success');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
