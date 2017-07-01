'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSettings = exports.getManifestPath = undefined;

var _webpack = require('webpack');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compileIfNeeded = require('./compileIfNeeded');

var _compileIfNeeded2 = _interopRequireDefault(_compileIfNeeded);

var _createCompiler = require('./createCompiler');

var _createCompiler2 = _interopRequireDefault(_createCompiler);

var _paths = require('./paths');

var _index = require('./utils/index.js');

var _normalizeEntry = require('./normalizeEntry');

var _normalizeEntry2 = _interopRequireDefault(_normalizeEntry);

var _createLogger = require('./createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _createMemory = require('./createMemory');

var _createMemory2 = _interopRequireDefault(_createMemory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const getManifestPath = exports.getManifestPath = bundleName => _path2.default.resolve(_paths.cacheDir, `${bundleName}.manifest.json`);

const createSettings = (_ref) => {
  let { entry } = _ref,
      settings = _objectWithoutProperties(_ref, ['entry']);

  const defaults = {
    context: __dirname,
    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false
  };

  return (0, _index.merge)(defaults, settings, {
    entry: (0, _normalizeEntry2.default)(entry)
  });
};

exports.createSettings = createSettings;
class Plugin {
  constructor(settings) {
    this.settings = createSettings(settings);
  }

  apply(compiler) {
    const { context, inject, entry, path: outputPath } = this.settings;
    const log = (0, _createLogger2.default)(this.settings.debug);

    const publicPath = filename => _path2.default.join(outputPath, filename);

    (0, _index.keys)(entry).map(getManifestPath).forEach(manifestPath => {
      new _webpack.DllReferencePlugin({ context: context, manifest: manifestPath }).apply(compiler);
    });

    compiler.plugin('before-compile', (params, callback) => {
      params.compilationDependencies = params.compilationDependencies.filter(path => !path.startsWith(_paths.cacheDir));

      callback();
    });

    const onRun = (compiler, callback) => (0, _compileIfNeeded2.default)(this.settings, () => (0, _createCompiler2.default)(this.settings)).then(() => (0, _createMemory2.default)().then(memory => {
      this.initialized = true;
      this.memory = memory;
    }))
    // .then(log.tap('initialized'))
    .then(callback);

    compiler.plugin('watch-run', onRun);
    compiler.plugin('run', onRun);

    compiler.plugin('emit', (compilation, callback) => {
      const { memory } = this;

      const assets = memory.getBundles().map(({ filename, buffer }) => {
        return {
          [publicPath(filename)]: {
            source: () => buffer.toString(),
            size: () => buffer.length
          }
        };
      });

      compilation.assets = (0, _index.merge)(compilation.assets, ...assets);
      callback();
    });

    if (inject) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
          const { memory } = this;
          const bundlesPublicPaths = memory.getBundles().map(({ filename }) => publicPath(filename));

          htmlPluginData.assets.js = (0, _index.concat)(bundlesPublicPaths, htmlPluginData.assets.js);

          callback();
        });
      });
    }
  }
}

exports.default = Plugin;