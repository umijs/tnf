import assert from 'assert';
import { type ChildProcess, spawn } from 'child_process';
import fs from 'fs-extra';
import module from 'module';
import path from 'pathe';
import * as logger from '../fishkit/logger.js';
import { Mode } from '../types/index.js';
import type { SyncOptions } from './sync.js';

interface Paths {
  input: string;
  output: string;
  config: string;
}

const CONSTANTS = {
  CHECK_INTERVAL_MS: 300,
  CHECK_TIMEOUT_SECONDS: 5,
  TAILWIND_VERSION: '3',
} as const;

let tailwindProcess: ChildProcess;

function getTailwindBinPath(cwd: string): string {
  const require = module.createRequire(process.cwd());
  let pkgPath: string;

  try {
    pkgPath = require.resolve('tailwindcss/package.json', { paths: [cwd] });
  } catch (error) {
    throw new Error('tailwindcss not found, please install it first');
  }

  const pkg = require(pkgPath);
  assert(
    pkg.version.startsWith(CONSTANTS.TAILWIND_VERSION),
    `tailwindcss version must be ${CONSTANTS.TAILWIND_VERSION}.x`,
  );

  return path.join(path.dirname(pkgPath), pkg.bin.tailwind);
}

async function generateFile(opts: {
  binPath: string;
  paths: Paths;
  mode: Mode;
}): Promise<void> {
  const { binPath, paths, mode } = opts;
  const isProduction = mode === Mode.Production;

  return new Promise((resolve, reject) => {
    tailwindProcess = spawn(
      binPath,
      [
        '-i',
        paths.input,
        '-o',
        paths.output,
        '-c',
        paths.config,
        ...(isProduction ? [] : ['--watch']),
      ],
      { stdio: 'inherit' },
    );

    tailwindProcess.on('error', reject);
    console.log('Tailwind CSS service started');
    tailwindProcess.on('close', () => {
      console.log('Tailwind CSS service closed');
      resolve();
    });

    if (!isProduction) {
      const interval = setInterval(() => {
        if (fs.existsSync(paths.output)) {
          clearInterval(interval);
          resolve();
        }
      }, CONSTANTS.CHECK_INTERVAL_MS);

      setTimeout(() => {
        if (!fs.existsSync(paths.output)) {
          clearInterval(interval);
          throw new Error(
            `Tailwind CSS generation failed after ${CONSTANTS.CHECK_TIMEOUT_SECONDS} seconds`,
          );
        }
      }, CONSTANTS.CHECK_TIMEOUT_SECONDS * 1000);
    }
  });
}

export async function writeTailwindcss({
  context,
  runAgain,
}: SyncOptions): Promise<string | undefined> {
  const {
    cwd,
    paths: { tmpPath },
    mode,
  } = context;
  if (runAgain) return;

  const paths: Paths = {
    input: path.join(cwd, 'src/tailwind.css'),
    output: path.join(tmpPath, 'tailwindcss/tailwind.css'),
    config: path.join(cwd, 'tailwind.config.js'),
  };

  // Enable tailwindcss only if the config file exists
  if (!fs.existsSync(paths.config)) {
    return;
  }

  // Generate input file if it doesn't exist
  if (!fs.existsSync(paths.input)) {
    fs.ensureDirSync(path.dirname(paths.input));
    fs.writeFileSync(
      paths.input,
      `
@tailwind base;
@tailwind components;
@tailwind utilities;
    `.trimStart(),
    );
    logger.info(
      `Created \`src/tailwind.css\` file. Please customize it before using tailwindcss.`,
    );
  }

  await generateFile({
    binPath: getTailwindBinPath(cwd),
    paths,
    mode,
  });

  return paths.output;
}
