import fs from 'fs-extra';
import path from 'pathe';
import type { Context } from '../types';

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
    writeFileWithConfirmation(tailwindConfigPath, tailwindConfig),
    writeFileWithConfirmation(tailwindCSSPath, tailwindCSS),
  ]);

  results.forEach((result) => console.log(result.message));
}

async function writeFileWithConfirmation(
  filePath: string,
  content: string,
): Promise<{
  message: string;
}> {
  if (fs.existsSync(filePath)) {
    return {
      message: `Skipped writing to ${filePath}`,
    };
  }

  try {
    await fs.writeFile(filePath, content);
    return {
      message: `Generated file at: ${filePath}`,
    };
  } catch (error) {
    return {
      message: `Failed to write file: ${error}`,
    };
  }
}
