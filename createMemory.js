const MemoryFileSystem = require('memory-fs');
const fs = require('./utils/fs');
const { join } = require('bluebird');
const { cacheDir } = require('./paths');
const path = require('path');

const getBundles = (mfs) => {
  return mfs.readdirSync('/').map((filename) => ({
    filename,
    buffer: mfs.readFileSync(`/${filename}`)
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
      mfs.writeFileSync(`/${filename}`,buffer);
    })
    .then(() => ({
      getBundles: getBundles.bind(null, mfs)
    }));
};

module.exports = createMemory;