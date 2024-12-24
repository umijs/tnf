import fs from 'fs';
import path from 'pathe';
import type { Context } from '../types';
import { writeFileSync } from './fs';

export async function writeDocs(opts: { context: Context }) {
  const { context } = opts;
  const docsPath = path.join(context.paths.tmpPath, 'docs');
  const deps = {
    ...context.pkg.dependencies,
    ...context.pkg.devDependencies,
  };
  fs.mkdirSync(docsPath, { recursive: true });

  const generals = [
    `- This a react project.`,
    `- Use @tanstack/react-router for routing.`,
    `- Don't be lazy, write all the code to implement features I ask for.`,
    `- Keep a log of what, why and how you did what you did in "fyi.md". Keep it updated.`,
    `- Use zod to validate api response.`,
    `- Keep ui components simple and pure.`,
    `- Extract logic from ui components to hooks, deep module is preferred.`,
    `- Use hooks to format data.`,
    `- Hard code values should be replaced by variables with meaningful names.`,
    `- Extract api logic to services, keep services simple.`,
    `- Use react-i18next for internationalization.`,
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
    `- src/services/: Services.`,
    `- src/utils/: Utils.`,
    `- src/types/: Types.`,
    `- mock/: Mock data.`,
    `- public/: Static files.`,
  ];
  fileDirs.push('');
  fileDirs.push(
    `- Components under src/components/ directory should be named using upper camel case and using tsx, e.g. \`FooBar.tsx\`.`,
  );
  fileDirs.push(
    `- Mock files are js only, ts is not allowed. Content example: \`module.exports = { 'GET /api/foo': (req, res) => { res.json(data); } }\``,
  );

  writeFileSync(
    path.join(docsPath, 'general.md'),
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
  );

  const tnfContent = fs.readFileSync(
    path.join(__dirname, '../../README.md'),
    'utf-8',
  );
  writeFileSync(path.join(docsPath, 'tnf.md'), tnfContent);

  writeFileSync(
    path.join(docsPath, 'best_practices.md'),
    '/* TODO: best practices */',
  );

  writeFileSync(
    path.join(docsPath, 'engineering.md'),
    '/* TODO: engineering */',
  );

  writeFileSync(path.join(docsPath, 'routing.md'), '/* TODO: routing */');

  // copy third-party docs
  const docsDir = path.join(__dirname, '../../third-party-docs');
  fs.cpSync(docsDir, path.join(docsPath, 'third-party-docs'), {
    recursive: true,
  });
}
