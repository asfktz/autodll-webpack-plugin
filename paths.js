const findCacheDir = require('find-cache-dir');
const path = require('path');
const cacheDir = findCacheDir({ name: 'create-dll' });

const getManifestPath = bundleName =>
  path.resolve(cacheDir, `${bundleName}.manifest.json`);

module.exports = {
  cacheDir,
  getManifestPath
};