import 'zx/globals';

(async () => {
  console.log('Bootstrapping funplugins');
  const funpluginsDir = path.join(__dirname, '..', 'src', 'funplugins');
  const folders = fs.readdirSync(funpluginsDir).filter((folder) => {
    return (
      fs.statSync(path.join(funpluginsDir, folder)).isDirectory() &&
      !fs.existsSync(path.join(funpluginsDir, folder, `${folder}.ts`))
    );
  });
  console.log(`Found ${folders.length} funplugins to bootstrap`);

  for (const folder of folders) {
    const funpluginDir = path.join(funpluginsDir, folder);
    const indexFilePath = path.join(funpluginDir, `${folder}.ts`);
    fs.writeFileSync(
      indexFilePath,
      `
import type { Plugin } from '../../plugin/types';

interface MockOptions {
  paths: string[];
}

export function ${folder}(opts: MockOptions): Plugin {
  return {
    name: '${folder}',
  };
}
      `.trimStart(),
    );
    console.log(`Created ${indexFilePath}`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
