import { chromium } from '@playwright/test';
import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'pathe';
import handler from 'serve-handler';
import { promisify } from 'util';
import { test } from 'vitest';
import yargsParser from 'yargs-parser';

const execAsync = promisify(exec);
const tnfPath = path.join(process.cwd(), 'bin/tnf.js');
const fixturesDir = path.join(process.cwd(), 'e2e/fixtures');

// Get all fixture directories
let fixtures = fs.readdirSync(fixturesDir).filter((f) => {
  return (
    fs.statSync(path.join(fixturesDir, f)).isDirectory() &&
    fs.existsSync(path.join(fixturesDir, f, 'expect.ts'))
  );
});

// Create a test for each fixture
for (const fixture of fixtures) {
  test(`e2e fixture: ${fixture}`, async () => {
    let server: http.Server;
    const port = 3000;

    const fixturePath = path.join(fixturesDir, fixture);
    console.log(`Building fixture: ${fixture}... ${fixturePath}`);

    // Run tnf build in the fixture directory
    await execAsync(`node ${tnfPath} build`, {
      cwd: fixturePath,
    });

    // Start server for this fixture
    server = http.createServer((req, res) => {
      handler(req, res, {
        public: path.join(fixturePath, 'dist'),
      });
    });
    server.listen(port);
    console.log(`Server running for ${fixture} at http://localhost:${port}`);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      const origin = `http://localhost:${port}`;
      await page.goto(origin);
      await page.waitForTimeout(1000);
      const content = await page.textContent('body');

      const mod = await import(`./fixtures/${fixture}/expect`);
      await mod.run({ page, content, port, origin });
    } finally {
      await browser.close();
    }

    server?.close();
  });
}
