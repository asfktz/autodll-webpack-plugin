import path from 'path';
import isEmpty from 'lodash/isEmpty';
import fs from './utils/fs';
import makeDir from 'make-dir';
import { cacheDir } from './paths';
import createLogger from './createLogger';
import del from 'del';

const isCacheValid = newHash => {
  return makeDir(cacheDir)
    .then(() => fs.statAsync(path.resolve(cacheDir, newHash)))
    .then(() => true)
    .catch(() => false);
};

const cleanup = settings =>
  fs
    .readdirSync(cacheDir)
    .filter(fileName => fileName.includes(settings.nodeEnv))
    .filter(fileName => fileName.includes(settings.id))
    .forEach(p => del(path.join(cacheDir, p)));

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

const compileIfNeeded = (settings, getCompiler) => {
  const log = createLogger(settings.debug);

  return isCacheValid(settings.hash)
    .then(log.tap(isValid => `is valid cache? ${isValid}`))
    .then(isValid => {
      if (isValid) return;

      return Promise.resolve(settings)
        .then(log.tap('cleanup'))
        .then(cleanup)
        .then(log.tap('compile'))
        .then(compile(settings, getCompiler));
    });
};

export default compileIfNeeded;
