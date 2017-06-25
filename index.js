const createMiddleware = require('./createMiddleware');
const createPluginClass = require('./createPluginClass');

module.exports = {
  middleware: createMiddleware,
  Plugin: createPluginClass
};
