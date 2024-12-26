import { getPackages } from '@manypkg/get-packages';
import { fileURLToPath } from 'url';
import 'zx/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '../');
const changesetConfig = path.join(__dirname, '../.changeset/config.json');

const getWorkspaces = async () => getPackages(root);

(async () => {
  const ws = await getWorkspaces();
  const appNames: string[] = [];
  ws.packages.forEach((submodule) => {
    const isPrivate = submodule.packageJson?.private;
    if (isPrivate) {
      appNames.push(submodule.packageJson.name);
    }
  });

  const config = await fs.readJson(changesetConfig, { encoding: 'utf-8' });
  config.ignore = appNames;
  await fs.writeFile(changesetConfig, `${JSON.stringify(config, null, 2)}\n`, {
    encoding: 'utf-8',
  });

  console.log(
    chalk.green(`[changeset-config]: refresh config ignore list complete`),
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
