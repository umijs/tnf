import fs from 'fs';
import path from 'pathe';
import type { Context } from '../types';

export async function writeAi(opts: { context: Context }) {
  const { context } = opts;
  const aiPath = path.join(context.paths.tmpPath, 'ai');
  const deps = {
    ...context.pkg.dependencies,
    ...context.pkg.devDependencies,
  };
  fs.mkdirSync(aiPath, { recursive: true });

  const generals = [
    `- This a react project.`,
    `- Use @tanstack/react-router for routing.`,
    `- Don't be lazy, write all the code to implement features I ask for.`,
    `- Keep a log of what, why and how you did what you did in "fyi.md". Keep it updated.`,
  ];
  if (deps['@tanstack/react-query']) {
    generals.push(`- Use @tanstack/react-query for data fetching.`);
  }
  if (fs.existsSync(path.join(context.cwd, 'tailwind.config.js'))) {
    generals.push(`- Use Tailwind CSS for styling.`);
  } else {
    generals.push(
      `- Use less and css modules for styling, css files should be the same name as the component and ending with .module.less.`,
    );
  }

  const fileDirs = [
    `- src/pages/: Pages.`,
    `- src/components/: Components.`,
    `- src/hooks/: Hooks.`,
    `- src/utils/: Utils.`,
    `- src/types/: Types.`,
  ];

  fs.writeFileSync(
    path.join(aiPath, 'general.md'),
    `

## General

${generals.join('\n')}

## File Directory

${fileDirs.join('\n')}

## Code Styles

- Use TypeScript.
- Make sure the created files are ending with a new line at the end of the file.
- File names should be in lowercase with dash separators.
- Test. 1) Use vitest for test cases, not jest. 2) Test cases should be in the same file as the code that is being tested. e.g. \`foo.test.ts\` for \`foo.ts\`. 3) Do use \`test()\` instead of \`describe() + it()\` for test cases.
- Use \`printWidth: 80, singleQuote: true, trailingComma: all, indent_style: space, indent_width: 2\` for code formatting.

  `,
    'utf-8',
  );

  const tnfContent = fs.readFileSync(
    path.join(__dirname, '../../README.md'),
    'utf-8',
  );
  fs.writeFileSync(path.join(aiPath, 'tnf.md'), tnfContent, 'utf-8');

  fs.writeFileSync(
    path.join(aiPath, 'best_practices.md'),
    '/* TODO: best practices */',
    'utf-8',
  );

  fs.writeFileSync(
    path.join(aiPath, 'engineering.md'),
    '/* TODO: engineering */',
    'utf-8',
  );

  fs.writeFileSync(
    path.join(aiPath, 'routing.md'),
    '/* TODO: routing */',
    'utf-8',
  );
}
