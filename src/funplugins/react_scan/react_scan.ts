import assert from 'assert';
import type { Plugin } from '../../plugin/types';

export function reactScan(): Plugin {
  return {
    name: 'react-scan',
    transformIndexHtml(html) {
      assert(
        html.includes('</body>'),
        '[react-scan] html must contains </body>',
      );
      return html.replace(
        '</body>',
        '<script src="https://unpkg.com/react-scan/dist/auto.global.js"></script></body>',
      );
    },
  };
}
