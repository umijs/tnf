import * as buildTools from './tools_build.js';
import * as configTools from './tools_config.js';
import * as doctorTools from './tools_doctor.js';
import * as generateTools from './tools_generate.js';
import * as syncTools from './tools_sync.js';

const tools = {
  ...generateTools,
  ...buildTools,
  ...doctorTools,
  ...configTools,
  ...syncTools,
};

export { tools };
