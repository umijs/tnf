import * as p from './prompt/index.js';

(async () => {
  console.log('test');
  p.intro('test');
  p.box('a\nb\nc', 'test');
  const s = p.spinner();
  s.start('1');
  s.message('2');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  s.stop('3');
  const task = p.taskLog('test');
  task.text = '1\n';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  task.text = '2\n';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  task.text = '3\n';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  task.success('4');
  p.outro('test');
  // p.cancel('test');
})();
