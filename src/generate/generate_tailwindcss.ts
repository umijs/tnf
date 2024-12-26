import fs from 'fs-extra';
import path from 'pathe';
import { setConfig } from '../config/config.js';
import { PackageManager } from '../fishkit/npm.js';
import type { Context } from '../types/index.js';

export async function generateTailwindcss({ context }: { context: Context }) {
  const cwd = context.cwd;
  const tailwindConfigPath = path.join(cwd, 'tailwind.config.js');
  const tailwindCSSPath = path.join(cwd, 'src/tailwind.css');

  if (!context.argv.force) {
    if (fs.existsSync(tailwindConfigPath) || fs.existsSync(tailwindCSSPath)) {
      throw new Error(
        'Tailwind files already exist. Use --force to overwrite.',
      );
    }
  }

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
}
`;

  const tailwindCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  fs.ensureDirSync(path.join(cwd, 'src'));

  try {
    await fs.writeFile(tailwindConfigPath, tailwindConfig);
    await fs.writeFile(tailwindCSSPath, tailwindCSS);

    console.log(`Generated file at: ${tailwindConfigPath}`);
    console.log(`Generated file at: ${tailwindCSSPath}`);

    const pm = new PackageManager({
      cwd,
    });

    pm.addDevDeps({
      tailwindcss: '^3',
    });

    pm.installDeps();

    setConfig({ cwd, name: 'tailwindcss', value: true });
  } catch (error) {
    throw new Error(`Failed to write files: ${error}`);
  }
}
