import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import { fileURLToPath } from 'url';
import * as p from './clack/prompt/index.js';

const CANCEL_TEXT = 'Operation cancelled.';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type NpmClient = 'pnpm' | 'yarn' | 'npm';

const templates = {
  minimal: {
    label: 'Minimal',
    hint: 'Minimal template for quick start',
  },
} as const;

export async function create({
  cwd,
  name,
  template,
  npmClient = 'pnpm',
}: {
  cwd: string;
  name?: string;
  template?: string;
  npmClient?: NpmClient;
}) {
  const templatesPath = path.join(__dirname, '../templates');
  const templateList = fs
    .readdirSync(templatesPath)
    .filter((file) =>
      fs.statSync(path.join(templatesPath, file)).isDirectory(),
    );

  const selectedTemplate =
    template ||
    (await (async () => {
      const template = await p.select({
        message: 'Which template would you like?',
        options: templateList.map((template) => ({
          value: template,
          label: templates[template as keyof typeof templates].label,
          hint: templates[template as keyof typeof templates].hint,
        })),
      });
      return template;
    })());
  if (p.isCancel(selectedTemplate)) {
    throw new Error(CANCEL_TEXT);
  }

  const projectName = await (async () => {
    if (name) {
      const error = validate(name);
      if (error) {
        throw new Error(error);
      }
      return name;
    }
    return await p.text({
      message: 'Please enter a name for your new project:',
      initialValue: 'myapp',
      validate,
    });
    function validate(value: string) {
      if (!value) {
        return `Project name is required but got ${value}`;
      }
      if (fs.existsSync(path.join(cwd, value))) {
        return `Project ${path.join(cwd, value)} already exists`;
      }
    }
  })();
  if (p.isCancel(projectName)) {
    throw new Error(CANCEL_TEXT);
  }

  if (fs.existsSync(path.join(cwd, projectName))) {
    throw new Error('Project already exists');
  }

  const copySpinner = p.spinner();
  copySpinner.start(`Copying template ${selectedTemplate}...`);
  const templatePath = path.join(templatesPath, selectedTemplate as string);
  const projectPath = path.join(cwd, projectName);
  fs.cpSync(templatePath, projectPath, { recursive: true });
  copySpinner.stop(`Copied template ${selectedTemplate}`);

  const installTask = p.taskLog(`Installing dependencies with ${npmClient}...`);
  const args = npmClient === 'yarn' ? [] : ['install'];
  try {
    await execa(npmClient, args, {
      cwd: projectPath,
      onData: (data) => {
        installTask.text = data;
      },
    });
  } catch (error) {
    installTask.fail(`Failed to install dependencies with ${npmClient}`);
    throw error;
  }
  installTask.success(`Installed dependencies with ${npmClient}`);

  const syncTask = p.taskLog('Setting up project...');
  try {
    await execa('npx', ['tnf', 'sync'], {
      cwd: projectPath,
      onData: (data) => {
        syncTask.text = data;
      },
    });
  } catch (error) {
    syncTask.fail(`Failed to setup project`);
    throw error;
  }
  syncTask.success(`Project setup complete`);

  p.box(
    `
1: ${pc.bold(pc.cyan(`cd ${projectName}`))}
2: ${pc.bold(pc.cyan(`git init && git add -A && git commit -m "Initial commit"`))} (optional)
3: ${pc.bold(pc.cyan(`${npmClient} run dev`))}

To close the dev server, hit ${pc.bold(pc.cyan('Ctrl+C'))}
    `.trim(),
    'Next Steps',
  );
}

async function execa(
  cmd: string,
  args: string[],
  options: { cwd: string; onData: (data: string) => void },
) {
  const child = spawn(cmd, args, {
    stdio: 'pipe',
    cwd: options.cwd,
  });
  return new Promise((resolve, reject) => {
    child.stdout?.on('data', (data) => {
      options.onData(data);
    });
    child.stderr?.on('data', (data) => {
      options.onData(data);
    });
    child.on('close', (code) => {
      resolve(code);
    });
    child.on('error', (error) => {
      reject(error);
    });
  });
}
