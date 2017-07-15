import path from 'path';
import isEmpty from 'lodash/isEmpty';
import fs from './utils/fs';
import makeDir from 'make-dir';
import { cacheDir } from './paths';
import createLogger from './createLogger';
import del from 'del';

const _isCacheValid = (fs, cacheDir) => settings => {
  return makeDir(cacheDir, { fs })
    .then(() => fs.statAsync(path.resolve(cacheDir, settings.hash)))
    .then(() => true)
    .catch(() => false);
};

const _cleanup = (fs, cacheDir) => settings => () => {
  return fs
    .readdirAsync(cacheDir)
    .filter(dirname => dirname.startsWith(`${settings.env}_${settings.id}`))
    .each(dirname => del(path.join(cacheDir, dirname)));
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

export const _compileIfNeeded = (fs, cacheDir) => (settings, getCompiler) => {
  const log = createLogger(settings.debug);
  const isCacheValid = _isCacheValid(fs, cacheDir);
  const cleanup = _cleanup(fs, cacheDir);

  return isCacheValid(settings)
    .then(log.tap(isValid => `is valid cache? ${isValid}`))
    .then(isValid => {
      if (isValid) return;

      return Promise.resolve()
        .then(log.tap('cleanup'))
        .then(cleanup(settings))
        .then(log.tap('compile'))
        .then(compile(settings, getCompiler));
    });
};

export default _compileIfNeeded(fs, cacheDir);
