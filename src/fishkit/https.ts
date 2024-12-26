import { spawnSync } from 'child_process';
import fs from 'fs';
import type { RequestListener } from 'http';
import https from 'https';
import path from 'pathe';
import pc from 'picocolors';
import spdy from 'spdy';
import * as logger from './logger.js';

export interface HttpsServerOptions {
  key?: string;
  cert?: string;
  hosts?: string[];
  http2?: boolean;
}

const defaultHttpsHosts: HttpsServerOptions['hosts'] = [
  'localhost',
  '127.0.0.1',
];

export type { Server as SpdyServer } from 'spdy';

// vite mode requires a key cert
export async function resolveHttpsConfig(httpsConfig: HttpsServerOptions) {
  let { key, cert, hosts } = httpsConfig;

  // if the key and cert are provided return directly
  if (key && cert) {
    return {
      key,
      cert,
    };
  }

  // Check if mkcert is installed
  try {
    // use mkcert -help instead of mkcert --version for checking if mkcert is installed, cause mkcert --version does not exists in Linux
    await execa('mkcert', ['-help']);
  } catch (e) {
    logger.error('[HTTPS] The mkcert has not been installed.');
    logger.info('[HTTPS] Please follow the guide to install manually.');
    switch (process.platform) {
      case 'darwin':
        logger.info(pc.green('$ brew install mkcert'));
        logger.info(pc.gray('# If you use firefox, please install nss.'));
        logger.info(pc.green('$ brew install nss'));
        logger.info(pc.green('$ mkcert -install'));
        break;
      case 'win32':
        logger.info(
          pc.green('Checkout https://github.com/FiloSottile/mkcert#windows'),
        );
        break;
      case 'linux':
        logger.info(
          pc.green('Checkout https://github.com/FiloSottile/mkcert#linux'),
        );
        break;
      default:
        break;
    }
    throw new Error(`[HTTPS] mkcert not found.`, { cause: e });
  }

  hosts = hosts || defaultHttpsHosts;
  key = path.join(__dirname, 'umi.https.key.pem');
  cert = path.join(__dirname, 'umi.https.pem');
  const json = path.join(__dirname, 'umi.https.json');

  // Generate cert and key files if they are not exist.
  if (
    !fs.existsSync(key) ||
    !fs.existsSync(cert) ||
    !fs.existsSync(json) ||
    !hasHostsChanged(json, hosts!)
  ) {
    logger.info('[HTTPS] Generating cert and key files...');
    await execa('mkcert', ['-cert-file', cert, '-key-file', key, ...hosts!]);
    fs.writeFileSync(json, JSON.stringify({ hosts }), 'utf-8');
  }

  return {
    key,
    cert,
  };
}

function hasHostsChanged(jsonFile: string, hosts: string[]) {
  try {
    const json = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    return json.hosts.join(',') === hosts.join(',');
  } catch (e) {
    return true;
  }
}

async function execa(cmd: string, args: string[]) {
  const { stdout } = spawnSync(cmd, args, {
    stdio: 'inherit',
  });
  return stdout.toString();
}

export async function createHttpsServer(
  app: RequestListener,
  httpsConfig: HttpsServerOptions,
) {
  logger.info('[HTTPS] Starting service in https mode...');
  const { key, cert } = await resolveHttpsConfig(httpsConfig);
  const createServer = (
    httpsConfig.http2 === false ? https.createServer : spdy.createServer
  ) as typeof spdy.createServer;
  return createServer(
    {
      key: fs.readFileSync(key, 'utf-8'),
      cert: fs.readFileSync(cert, 'utf-8'),
    },
    app,
  );
}
