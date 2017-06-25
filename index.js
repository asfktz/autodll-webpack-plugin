const createMiddleware = require('./createMiddleware');
const createPluginClass = require('./createPluginClass');

module.exports = (dllSettings) => ({
  middleware:   createMiddleware,
  Plugin:       createPluginClass(dllSettings)
});
