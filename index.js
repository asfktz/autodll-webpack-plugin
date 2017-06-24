
const { getBundles, getManifests } = require('./paths');
const { buildIfNeeded } = require('./cache');

const middleware = require('./middleware');
const createCompiler = require('./createCompiler');

const build = (dllSettings, webpack) => (
  buildIfNeeded(dllSettings, () => createCompiler(webpack, dllSettings))
);

module.exports = (dllSettings) => {
  const withSettings = (fn) => fn.bind(null, dllSettings);

  return ({
    build:        withSettings(build),
    middleware:   withSettings(middleware),
    getBundles:   withSettings(getBundles),
    getManifests: withSettings(getManifests)
  });
};
