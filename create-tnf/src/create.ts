import { intro, isCancel, outro, select, text } from '@clack/prompts';
import fs from 'fs';
import path from 'path';

export async function create({
  cwd,
  name,
  template,
}: {
  cwd: string;
  name?: string;
  template?: string;
}) {
  intro('Creating a new project...');

  const templatesPath = path.join(__dirname, '../templates');
  const templateList = fs
    .readdirSync(templatesPath)
    .filter((file) =>
      fs.statSync(path.join(templatesPath, file)).isDirectory(),
    );
  const selectedTemplate =
    template ||
    (await select({
      message: 'Select a template:',
      options: templateList.map((template) => ({
        label: template,
        value: template,
      })),
    }));
  if (isCancel(selectedTemplate)) {
    outro('Aborted');
    return;
  }
  const projectName = await (async () => {
    if (name) {
      const error = validate(name);
      if (error) {
        throw new Error(error);
      }
      return name;
    }
    return await text({
      message: 'Project name:',
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
  if (isCancel(projectName)) {
    outro('Aborted');
    return;
  }
  if (fs.existsSync(path.join(cwd, projectName))) {
    throw new Error('Project already exists');
  }
  const templatePath = path.join(templatesPath, selectedTemplate as string);
  const projectPath = path.join(cwd, projectName);
  fs.cpSync(templatePath, projectPath, { recursive: true });
  outro(`Project created in ${projectPath}.`);
  console.log(`Now run:

    cd ${projectPath}
    npm install
    npm run build`);
}
