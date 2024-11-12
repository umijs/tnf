import { type ChildProcess, spawn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { mkdirSync, rmSync } from 'fs-extra';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import type { Config } from '../config';

const CHECK_INTERVAL = 300;
const CHECK_TIMEOUT_UNIT_SECOND = 5;

interface GenerateTailwindcssOpts {
  cwd: string;
  tmpPath: string;
  config: Config['tailwindcss'];
}

function getTailwindBinPath(opts: { cwd: string }) {
  const require = createRequire(process.cwd());
  const pkgPath = require.resolve('tailwindcss/package.json', {
    paths: [opts.cwd],
  });
  const tailwindPath = require(pkgPath).bin['tailwind'];
  return join(dirname(pkgPath), tailwindPath);
}

let tailwind: ChildProcess;

export async function generateTailwindcss(opts: GenerateTailwindcssOpts) {
  const cwd = opts.cwd;
  const binPath = getTailwindBinPath({ cwd });
  if (existsSync(join(opts.tmpPath, '../.tailwindcss'))) {
    rmSync(join(opts.tmpPath, '../.tailwindcss'), { recursive: true });
  }
  const inputPath = join(
    opts.tmpPath,
    '../.tailwindcss/tailwindDirectives.css',
  );
  const outputPath = join(opts.tmpPath, '../.tailwindcss/tailwind.css');
  const configPath = join(opts.tmpPath, '../.tailwindcss/tailwind.config.js');
  const customConfig = opts.config;
  const defaultTailwindcssConfig = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
  };
  const mergedTailwindcssConfig = {
    ...defaultTailwindcssConfig,
    ...customConfig,
  };
  if (!existsSync(inputPath)) {
    mkdirSync(dirname(inputPath), { recursive: true });
  }

  writeFileSync(
    inputPath,
    `@tailwind base;
@tailwind components;
@tailwind utilities;
    `,
  );

  writeFileSync(
    configPath,
    `export default ${JSON.stringify(mergedTailwindcssConfig, null, 2)}`,
  );

  await generateFile({ binPath, inputPath, outputPath, configPath });

  return outputPath;
}

async function generateFile(opts: {
  binPath: string;
  inputPath: string;
  outputPath: string;
  configPath: string;
}) {
  const { binPath, inputPath, outputPath, configPath } = opts;
  const isProduction = process.env.HMR === 'none';
  return new Promise((resolve) => {
    tailwind = spawn(
      binPath,
      [
        '-i',
        inputPath,
        '-o',
        outputPath,
        '-c',
        configPath,
        isProduction ? '' : '--watch',
      ],
      {
        stdio: 'inherit',
      },
    );

    tailwind.on('error', (err) => {
      console.error('tailwindcss service encounter an error: ' + err);
    });

    console.log('tailwindcss service started');
    tailwind.on('close', () => {
      console.log('tailwindcss service closed');
      resolve(void 0);
    });

    if (!isProduction) {
      // wait for generatedPath to be created by interval
      const interval = setInterval(() => {
        if (existsSync(outputPath)) {
          clearInterval(interval);
          resolve(void 0);
        }
      }, CHECK_INTERVAL);
    }

    // throw error if not generated after 5s
    const timer = setTimeout(() => {
      if (!existsSync(outputPath)) {
        clearInterval(timer);
        console.error(
          `tailwindcss generate failed after ${CHECK_TIMEOUT_UNIT_SECOND} seconds, please check your tailwind.css and tailwind.config.js`,
        );
        process.exit(1);
      }
    }, CHECK_TIMEOUT_UNIT_SECOND * 1000);
  });
}
