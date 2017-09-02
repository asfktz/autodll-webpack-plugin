const createRunner = require('./createRunner');
const routeCalls = require('./routeCalls');

const { promisifyAll } = require('bluebird');
const fs = promisifyAll(require('fs'));

const del = require('del');
const { join } = require('path');

const createClearCache = cwd => () => {
  const path = join(cwd, '../node_modules/.cache/autodll-webpack-plugin');
  del.sync(path);
};

const writePkg = require('write-pkg');
const readPkg = require('read-pkg');

const createPkg = __dirname => {
  const cwd = join(__dirname, '..');
  const originalPkg = readPkg.sync(cwd);

  return {
    change() {
      writePkg.sync(
        cwd,
        merge(originalPkg, {
          dependencies: merge(originalPkg.dependencies, {
            ___TEST_DEP___: (Math.random() * 10000000000).toFixed()
          })
        })
      );
    },
    restore() {
      writePkg.sync(cwd, originalPkg);
    }
  };
};

const createMakeChange = (cwd, filepath) => (change) => {
  if (!filepath) throw new Error('filepath is required');

  const path = join(cwd, filepath);
  return fs.writeFileAsync(path, `module.exports = '${change}';`);
};

const merge = (...sources) => Object.assign({}, ...sources);

module.exports = {
  createRunner,
  createClearCache,
  routeCalls,
  createPkg,
  createMakeChange,
  fs,
  merge
};
