import assert from 'assert';
import fs from 'fs-extra';
import path from 'pathe';
// @ts-ignore
import randomColor from 'random-color';
import * as logger from '../fishkit/logger';
import type { Context } from '../types';

export async function generatePage({ context }: { context: Context }) {
  const pagesDir = path.join(context.cwd, 'src/pages');
  const pageName = context.argv._[0] as string | undefined;
  assert(pageName, 'Page name is required');
  const pagePath = path.join(pagesDir, `${pageName}.tsx`);
  const styleModulePath = path.join(pagesDir, `${pageName}.module.less`);

  assert(
    !fs.existsSync(pagePath) && !fs.existsSync(styleModulePath),
    `Page ${pageName} already exists.`,
  );

  fs.ensureDirSync(pagesDir);

  const componentName = pageName
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
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

  logger.info(`Generated page at: ${pagePath}`);
  logger.info(`Generated styles at: ${styleModulePath}`);
}
