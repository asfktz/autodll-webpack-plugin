const path = require('path');
const isEqual = require('lodash/isEqual');

const { log, writeFile, readFile, mkdirp } = require('./utils');
const { cacheDir } = require('./paths');
const del = require('del');

const chalk = require('chalk');

const isCacheValid = settings => {
  return mkdirp(cacheDir)
    .then(() => readFile(path.resolve(cacheDir, 'lastSettings.json')))
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
  return writeFile(
    path.resolve(cacheDir, 'lastSettings.json'),
    JSON.stringify(settings)
  );
};

let counter = 0;

const buildIfNeeded = (settings, getCompiler) => {
  return isCacheValid(settings)
    // .then(() => false) /////// <----
    .then(log(isValid => 'is valid cache? ' + isValid))
    .then(isValid => {
      if (isValid) return;

      const compile = () => {
        return new Promise((resolve, reject) => {
          getCompiler().run((err) => {
            if (err) { return reject(err); }
            resolve();
          });
        });
      };

      console.log(chalk.red('counter', ++counter));

      return (
        Promise.resolve()
          .then(log('cleanup'))
          .then(cleanup)
          .then(log('compile'))
          .then(compile)
          .then(log('write lastSettings.json'))
          .then(storeSettings(settings))
          // .catch((err) => {
          //   console.log(err);
          // })
      );
    });
};


module.exports = { buildIfNeeded };