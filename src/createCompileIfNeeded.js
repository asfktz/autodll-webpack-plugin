import path from 'path';
import fs from './utils/fs';
import { cacheDir } from './paths';
import del from 'del';
import makeDir from 'make-dir';

import validateCache from './validateCache';

const emptyCacheDir = settings => () => {
  // delete all the cached builds of the current instance
  // filter only the current instance build.
  // subdirectory name example: development_instance_0_bc6309c769a8a9d386898f61f8cb35d2
  return fs
    .readdirAsync(cacheDir)
    .filter(dirname => dirname.startsWith(`${settings.env}_${settings.id}`))
    .each(dirname => del(path.join(cacheDir, dirname)))
    .catch(() => makeDir(cacheDir));
};

export const runCompile = (settings, getCompiler) => () => {
  return new Promise((resolve, reject) => {
    getCompiler().run((err, stats) => {
      if (err) return reject(err);
      if (stats.compilation.errors.length) return reject(stats.compilation.errors);

      resolve(stats);
    });
  });
};

const createCompileIfNeeded = (log, settings) => getCompiler => {
  return validateCache(settings)
    .then(log.tap(isValid => `is valid cache? ${isValid}`))
    .then(isValid => {
      if (isValid) return null;
      return Promise.resolve()
        .then(log.tap('cleanup'))
        .then(emptyCacheDir(settings))
        .then(log.tap('compile'))
        .then(runCompile(settings, getCompiler))
        .then(stats => stats);
    });
};

export default createCompileIfNeeded;
