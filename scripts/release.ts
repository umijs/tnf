import assert from 'assert';
import getGitRepoInfo from 'git-repo-info';
import path from 'path';
import { fileURLToPath } from 'url';
import 'zx/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // const currentVersion = require('../package.json').version;
  // console.log('current version', currentVersion);
  // const version = await question('Enter the new version: ');
  const pkg = await import('../package.json');
  const version = pkg.version;
  // pkg.version = version;
  // fs.writeFileSync(
  //   path.join(__dirname, '../package.json'),
  //   JSON.stringify(pkg, null, 2) + '\n',
  // );

  console.log('update templates');
  const templateDir = path.join(__dirname, '../create-tnf/templates');
  const templateDirs = fs
    .readdirSync(templateDir)
    .filter((dir) => fs.statSync(path.join(templateDir, dir)).isDirectory());
  for (const dir of templateDirs) {
    const pkgPath = path.join(templateDir, dir, 'package.json');
    const content = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    pkg.dependencies['@umijs/tnf'] = `^${version}`;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }

  console.log('commit & tag');
  await $`git commit --all --message "release: ${version}" -n`;
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

  // TODO: remove this after the official release
  console.log('add dist-tag temporary');
  await $`npm dist-tag add @umijs/tnf@${version} latest`;

  console.log('git push');
  await $`git push origin ${branch} --tags`;

  console.log('release success');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
