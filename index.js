const { getBundles, getManifests } = require('./paths');
const { buildIfNeeded } = require('./cache');

const middleware = require('./middleware');
const createCompiler = require('./createCompiler');

const build = (webpack, dllSettings) => (
  buildIfNeeded(dllSettings, () => createCompiler(webpack, dllSettings))
);

module.exports = {
  build,
  middleware,
  getBundles,
  getManifests
};
