const MemoryFileSystem = require('memory-fs');
const fs = require('./utils/fs');
const { join } = require('bluebird');
const { cacheDir } = require('./paths');
const path = require('path');
const pathToRegexp = require('path-to-regexp');

const isBundle = (filename) => {
  // until I set memory subdirs
  return true;
  // return !!(pathToRegexp(':bundleName.bundle.js').exec(filename));
};

const getBundles = (mfs) => {
  return mfs.readdirSync('/')
    .filter(isBundle)
    .map((filename) => ({
      filename,
      buffer: mfs.readFileSync(path.join('/', filename))
    }));
};

const createMemory = () => {
  const mfs = new MemoryFileSystem();  

  return fs.readdirAsync(path.join(cacheDir, 'bundles'))
    .map(filename => join(
      filename,
      fs.readFileAsync(path.join(cacheDir, 'bundles', filename)))
    )
    .map(([filename, buffer]) => {
      mfs.writeFileSync(
        path.join('/', filename),
        buffer
      );
    })
    .then(() => ({
      getBundles: getBundles.bind(null, mfs)
    }));
};

module.exports = createMemory;