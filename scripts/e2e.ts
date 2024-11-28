import { chromium } from '@playwright/test';
import assert from 'assert';
import { exec } from 'child_process';
import http from 'http';
import path from 'path';
import handler from 'serve-handler';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runE2E() {
  console.log('Building example project...');
  await execAsync('pnpm run build', {
    cwd: path.join(process.cwd(), 'examples/normal'),
  });

  const server = http.createServer((req, res) => {
    handler(req, res, {
      public: path.join(process.cwd(), 'examples/normal/dist'),
    });
  });
  const port = 3000;
  server.listen(port);
  console.log(`Server running at http://localhost:${port}`);

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);
    await page.waitForTimeout(1000);
    const content = await page.textContent('body');
    assert(
      content?.includes('Hello'),
      `Page content should include "Hello" but got ${content}`,
    );

    console.log('E2E tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('E2E tests failed:', error);
    process.exit(1);
  } finally {
    server.close();
  }
}

runE2E().catch((error) => {
  console.error('E2E test script failed:', error);
  process.exit(1);
});
