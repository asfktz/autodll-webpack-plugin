import path from 'path';
import crypto from 'crypto';
import isEmpty from 'lodash/isEmpty';
import fs from './utils/fs';
import { mkdirp } from './utils/index.js';
import { cacheDir } from './paths';
import createLogger from './createLogger';
import del from 'del';

const isCacheValid = newHash => {
  return mkdirp(cacheDir)
    .then(() => fs.statAsync(path.resolve(cacheDir, newHash)))
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const cleanup = settings =>
  fs
    .readdirSync(cacheDir)
    .map(file => file.split('_'))
    .filter(
      identifiers =>
        identifiers.includes(settings.id) &&
        identifiers.includes(settings.nodeEnv)
    )
    .map(p => del(path.join(cacheDir, p.join('_'))));

const storeHash = hash => stats => {
  return fs.writeFileAsync(path.resolve(cacheDir, hash), stats.toString());
};

export const compile = (settings, getCompiler) => () => {
  // skip compiling if there is nothing to build
  if (isEmpty(settings.entry)) return;

  return new Promise((resolve, reject) => {
    getCompiler().run((err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
};

const getContents = watchPath => {
  try {
    if (fs.existsSync(watchPath)) {
      if (fs.lstatSync(watchPath).isDirectory()) {
        if (watchPath.startsWith(cacheDir)) {
          return '';
        }
        return fs
          .readdirSync(watchPath)
          .map(p => getContents(path.join(watchPath, p)))
          .join('');
      } else {
        return fs.readFileSync(watchPath, 'utf-8');
      }
    }
  } catch (e) {
    //Failed to read file, fallback to string
    return '';
  }
};

export const getHash = settings => {
  const hash = crypto.createHash('md5');
  const settingsJSON = JSON.stringify(settings);

  hash.update(settingsJSON);

  if (Array.isArray(settings.watch)) {
    hash.update(settings.watch.map(getContents).join(''));
  }
  return [settings.nodeEnv, settings.id, hash.digest('hex')].join('_');
};

const compileIfNeeded = (settings, getCompiler) => {
  const log = createLogger(settings.debug);
  const currentHash = getHash(settings);
  return isCacheValid(currentHash)
    .then(log.tap(isValid => `is valid cache? ${isValid}`))
    .then(isValid => {
      if (isValid) return;

      return Promise.resolve(settings)
        .then(log.tap('cleanup'))
        .then(cleanup)
        .then(log.tap('compile'))
        .then(compile(settings, getCompiler))
        .then(storeHash(currentHash));
    });
};

export default compileIfNeeded;
