const createMiddleware = require('./createMiddleware');
const createPluginClass = require('./createPluginClass');

module.exports = (dllSettings) => ({
  middleware:   createMiddleware(dllSettings),
  Plugin:       createPluginClass(dllSettings)
});
