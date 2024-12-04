import { chromium } from '@playwright/test';
import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'pathe';
import handler from 'serve-handler';
import { promisify } from 'util';
import { afterEach, beforeEach, expect, test } from 'vitest';

const execAsync = promisify(exec);
const tnfPath = path.join(process.cwd(), 'bin/tnf.js');
const fixturesDir = path.join(process.cwd(), 'e2e/fixtures');

// Get all fixture directories
const fixtures = fs.readdirSync(fixturesDir).filter((f) => {
  return (
    fs.statSync(path.join(fixturesDir, f)).isDirectory() &&
    fs.existsSync(path.join(fixturesDir, f, 'expect.ts'))
  );
});

let server: http.Server;
const port = 3000;
let fixture: string;

beforeEach(async () => {
  const fixturePath = path.join(fixturesDir, fixture);
  console.log(`Building fixture: ${fixture}...`);

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
});

afterEach(() => {
  server?.close();
});

// Create a test for each fixture
fixtures.forEach((currentFixture) => {
  fixture = currentFixture;

  test(`e2e fixture: ${fixture}`, async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(`http://localhost:${port}`);
      await page.waitForTimeout(1000);
      const content = await page.textContent('body');

      await import(`./fixtures/${fixture}/expect`).then((mod) =>
        mod.run({ page, content }),
      );
    } finally {
      await browser.close();
    }
  });
});
