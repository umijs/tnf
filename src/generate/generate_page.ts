import assert from 'assert';
import fs from 'fs-extra';
import path from 'pathe';
// @ts-ignore
import randomColor from 'random-color';
import type { GenerateOptions } from './generate';

export async function generatePage(opts: GenerateOptions) {
  const pagesDir = path.join(opts.cwd, 'src/pages');
  const pageName = opts.argv._[0] as string | undefined;
  assert(pageName, 'Page name is required');
  const pagePath = path.join(pagesDir, `${pageName}.tsx`);
  const styleModulePath = path.join(pagesDir, `${pageName}.module.less`);

  assert(
    !fs.existsSync(pagePath) && !fs.existsSync(styleModulePath),
    `Page ${pageName} already exists.`,
  );

  fs.ensureDirSync(pagesDir);

  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  const pageContent = `import React from 'react';
import { createFileRoute } from '@umijs/tnf/router';
import styles from './${pageName}.module.less';

export const Route = createFileRoute('/${pageName}')({
  component: ${componentName},
});

function ${componentName}() {
  return (
    <div className={styles.container}>
      <h3>Welcome to ${componentName} Page!</h3>
    </div>
  );
}
`;

  const styleContent = `.container {
  color: ${randomColor().hexString()};
}
`;

  await fs.writeFile(pagePath, pageContent);
  await fs.writeFile(styleModulePath, styleContent);

  console.log(`Generated page at: ${pagePath}`);
  console.log(`Generated styles at: ${styleModulePath}`);
}
