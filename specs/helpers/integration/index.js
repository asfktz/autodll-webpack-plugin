'use strict';

const createRunner = require('./createRunner');
const routeCalls = require('./routeCalls');

const promisifyAll = require('bluebird').promisifyAll;
const fs = promisifyAll(require('fs'));

const del = require('del');
const path = require('path');

const createClearCache = cwd => () => {
  const cachePath = path.join(cwd, '../node_modules/.cache/autodll-webpack-plugin');
  del.sync(cachePath);
};

const writePkg = require('write-pkg');
const readPkg = require('read-pkg');

const createPkgHandler = __dirname => {
  const cwd = path.join(__dirname, '..');
  const originalPkg = readPkg.sync(cwd);

  return {
    change() {
      writePkg.sync(
        cwd,
        merge(originalPkg, {
          dependencies: merge(originalPkg.dependencies, {
            ___TEST_DEP___: (Math.random() * 10000000000).toFixed(),
          }),
        })
      );
    },
    restore() {
      writePkg.sync(cwd, originalPkg);
    },
  };
};

const createMakeChange = (cwd, filepath) => change => {
  if (!filepath) throw new Error('filepath is required');

  return fs.writeFileAsync(path.join(cwd, filepath), `module.exports = '${change}';`);
};

function merge() {
  return Object.assign.apply(Object, [{}].concat(Array.from(arguments)));
}

module.exports = {
  createRunner,
  createClearCache,
  routeCalls,
  createPkgHandler,
  createMakeChange,
  fs,
  merge,
};
