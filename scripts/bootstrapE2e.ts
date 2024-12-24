import 'zx/globals';

(async () => {
  console.log('Bootstrapping e2e fixtures');
  const fixturesDir = path.join(__dirname, '..', 'e2e', 'fixtures');
  const folders = fs.readdirSync(fixturesDir).filter((folder) => {
    return (
      fs.statSync(path.join(fixturesDir, folder)).isDirectory() &&
      !fs.existsSync(path.join(fixturesDir, folder, 'expect.ts'))
    );
  });
  console.log(`Found ${folders.length} fixtures to bootstrap`);

  const total = folders.length;
  let current = 0;
  for (const folder of folders) {
    current++;
    const fixtureDir = path.join(fixturesDir, folder);
    const expectFilePath = path.join(fixtureDir, 'expect.ts');
    fs.writeFileSync(
      expectFilePath,
      `
import { expect } from 'vitest';
import type { E2EContext } from '../../types';

export async function run(context: E2EContext) {
  // TODO: Implement the fixture
}
      `.trimStart(),
    );
    fs.mkdirSync(path.join(fixtureDir, 'src'));
    fs.mkdirSync(path.join(fixtureDir, 'src', 'pages'));
    fs.writeFileSync(
      path.join(fixtureDir, 'src', 'pages', '__root.tsx'),
      `
import { createRootRoute } from '@umijs/tnf/router';

export const Route = createRootRoute({
  component: () => <div>Hello "__root"</div>,
});
    `.trimStart(),
    );
    fs.writeFileSync(
      path.join(fixtureDir, 'tsconfig.json'),
      `
{
  "extends": ".tnf/tsconfig.json",
  "compilerOptions": {}
}
      `.trimStart(),
    );
    fs.writeFileSync(
      path.join(fixtureDir, '.tnfrc.ts'),
      `
import { defineConfig } from '@umijs/tnf';
export default defineConfig({
});
      `.trimStart(),
    );
    console.log(`[${current}/${total}] Bootstrapped fixture ${folder}`);
  }
})().catch(console.error);
