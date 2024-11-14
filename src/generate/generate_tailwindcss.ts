import { confirm } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'pathe';
import type { Context } from '../types';

type FileOperationResult = {
  success: boolean;
  message: string;
};

export async function generateTailwindcss({ context }: { context: Context }) {
  const cwd = context.cwd;
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  const tailwindCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

  fs.ensureDirSync(path.join(cwd, 'src'));

  const tailwindConfigPath = path.join(cwd, 'tailwind.config.js');
  const tailwindCSSPath = path.join(cwd, 'src/tailwind.css');

  const results = await Promise.all([
    writeFileWithConfirmation(
      tailwindConfigPath,
      tailwindConfig,
      'Tailwind config file already exists, do you want to overwrite?',
    ),
    writeFileWithConfirmation(
      tailwindCSSPath,
      tailwindCSS,
      'Tailwind CSS file already exists, do you want to overwrite?',
    ),
  ]);

  results
    .filter((result) => result.success)
    .forEach((result) => console.log(result.message));
}

async function writeFileWithConfirmation(
  filePath: string,
  content: string,
  confirmMessage: string,
): Promise<FileOperationResult> {
  if (fs.existsSync(filePath)) {
    const shouldOverwrite = await confirm({
      message: confirmMessage,
    });

    if (!shouldOverwrite) {
      return {
        success: false,
        message: `Skipped writing to ${filePath}`,
      };
    }
  }

  try {
    await fs.writeFile(filePath, content);
    return {
      success: true,
      message: `Generated file at: ${filePath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to write file: ${error}`,
    };
  }
}
