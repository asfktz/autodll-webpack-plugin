const path = require('path');
const isEqual = require('lodash/isEqual');
const fs = require('./utils/fs');
const { mkdirp } = require('./utils');
const { cacheDir } = require('./paths');
const { log, tapLog } = require('./utils/log');
const del = require('del');

const isCacheValid = settings => {
  return mkdirp(cacheDir)
    .then(() => fs.readFileAsync(path.resolve(cacheDir, 'lastSettings.json')))
    .then((() => false)) ////////////// ------
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
  return isCacheValid(settings)
    .then(tapLog(isValid => `is valid cache? ${isValid}`))
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
          .then(tapLog('cleanup'))
          .then(cleanup)
          .then(tapLog('compile'))
          .then(compile)
          .then(tapLog('write lastSettings.json'))
          .then(storeSettings(settings))
      );
    });
};


module.exports = compileIfNeeded;