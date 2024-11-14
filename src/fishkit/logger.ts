import picocolors from 'picocolors';

const prefixes = {
  debug: picocolors.gray('[DEBUG]'),
  info: picocolors.cyan('[INFO]'),
  warn: picocolors.yellow('[WARN]'),
  error: picocolors.red('[ERROR]'),
};

export function debug(...messages: string[]) {
  if (process.env.TNF_LOG_LEVEL === 'debug') {
    console.log(prefixes.debug, ...messages);
  }
}

export function info(...messages: string[]) {
  console.log(prefixes.info, ...messages);
}

export function warn(...messages: string[]) {
  console.warn(prefixes.warn, ...messages);
}

export function error(...messages: string[]) {
  console.error(prefixes.error, ...messages);
}
