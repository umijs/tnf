import * as logger from './logger';

export function setNoDeprecation() {
  // Use magic to suppress node deprecation warnings
  // See: https://github.com/nodejs/node/blob/6311de332223e855e7f1ce03b7c920f51f308e95/lib/internal/process/warning.js#L95
  // @ts-ignore
  process.noDeprecation = '1';
}

export function checkVersion(minVersion: number) {
  const ver = parseInt(process.version.slice(1));
  const isOdd = ver % 2 === 1;
  if (isOdd) {
    logger.error(
      `Odd node version is not supported, your node version is ${ver}.`,
    );
    process.exit(1);
  }
  if (ver < minVersion) {
    logger.error(
      `Your node version ${ver} is not supported, please upgrade to ${minVersion} or above.`,
    );
    process.exit(1);
  }
}

export function setNodeTitle(name: string) {
  if (process.title === 'node') {
    process.title = name;
  }
}
