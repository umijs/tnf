import * as buildTools from './tools_build';
import * as configTools from './tools_config';
import * as doctorTools from './tools_doctor';
import * as generateTools from './tools_generate';
import * as syncTools from './tools_sync';

const tools = {
  ...generateTools,
  ...buildTools,
  ...doctorTools,
  ...configTools,
  ...syncTools,
};

export { tools };
