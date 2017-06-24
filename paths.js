const findCacheDir = require('find-cache-dir');
const path = require('path');
const cacheDir = findCacheDir({ name: 'create-dll' });

const getBundles = dllSettings => {
  return Object.keys(dllSettings.entry).map(
    bundleName => `dll/${bundleName}.js`
  );
};

const getManifests = dllSettings => {
  return Object.keys(dllSettings.entry).map(bundleName =>
    path.resolve(cacheDir, `${bundleName}.manifest.json`)
  );
};

module.exports = {
  cacheDir,
  getManifests,
  getBundles
};