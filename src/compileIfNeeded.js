import path from 'path';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import fs from './utils/fs';
import { mkdirp } from './utils/index.js';
import { cacheDir } from './paths';
import createLogger from './createLogger';
import del from 'del';

const isCacheValid = settings => {
  return mkdirp(cacheDir)
    .then(() => fs.readFileAsync(path.resolve(cacheDir, 'lastSettings.json')))
    .then(file => {
      let lastSettings = JSON.parse(file);
      return isEqual(lastSettings, settings);
    })
    .catch(() => {
      return false;
    });
};

const cleanup = () => del(path.join(cacheDir, '**/*'));

const storeSettings = settings => () => {
  return fs.writeFileAsync(
    path.resolve(cacheDir, 'lastSettings.json'),
    JSON.stringify(settings)
  );
};

export const compile = (settings, getCompiler) => () => {
  // skip compiling if there is nothing to build
  if (isEmpty(settings.entry)) return;

  return new Promise((resolve, reject) => {
    getCompiler().run((err, stats) => {
      if (err) { return reject(err); }
      resolve(stats);
    });
  });
};

const compileIfNeeded = (settings, getCompiler) => {
  const log = createLogger(settings.debug);
      
  return isCacheValid(settings)
    .then(log.tap(isValid => `is valid cache? ${isValid}`))
    .then(isValid => {
      if (isValid) return;

      return Promise.resolve()
        .then(log.tap('cleanup'))
        .then(cleanup)
        .then(log.tap('compile'))
        .then(compile(settings, getCompiler))
        .then(storeSettings(settings));
    });
};

export default compileIfNeeded;