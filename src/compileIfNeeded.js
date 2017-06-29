import path from 'path';
import isEqual from 'lodash/isEqual';
import fs from './utils/fs';
import { mkdirp } from './utils/index.js';
import { cacheDir } from './paths';
import createLogger from './utils/createLogger';
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

const cleanup = () => del(path.join(cacheDir, '**'));

const storeSettings = settings => () => {
  return fs.writeFileAsync(
    path.resolve(cacheDir, 'lastSettings.json'),
    JSON.stringify(settings)
  );
};

let counter = 0;

const compileIfNeeded = (settings, getCompiler) => {
  const log = createLogger(settings.debug);

  return isCacheValid(settings)
    .then(log.tap(isValid => `is valid cache? ${isValid}`))
    .then(isValid => {
      if (isValid) return;

      const compile = () => {
        return new Promise((resolve, reject) => {
          getCompiler().run((err, stats) => {
            if (err) { return reject(err); }
            resolve(stats);
          });
        });
      };

      log(`counter ${++counter}`);

      return (
        Promise.resolve()
          .then(log.tap('cleanup'))
          .then(cleanup)
          .then(log.tap('compile'))
          .then(compile)
          .then(log.tap('write lastSettings.json'))
          .then(storeSettings(settings))
      );
    });
};

export default compileIfNeeded;