import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';
// @ts-ignore
import randomColor from 'random-color';

interface GenerateOptions {
  cwd: string;
  type: string;
  name: string;
}

export function generate(opts: GenerateOptions) {
  if (opts.type === 'page') {
    return generatePage(opts);
  }
}

function generatePage(opts: GenerateOptions) {
  const pagesDir = path.join(opts.cwd, 'src/pages');
  const pageName = opts.name;
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

  fs.writeFileSync(pagePath, pageContent);
  fs.writeFileSync(styleModulePath, styleContent);

  console.log(`Generated page at: ${pagePath}`);
  console.log(`Generated styles at: ${styleModulePath}`);
}
