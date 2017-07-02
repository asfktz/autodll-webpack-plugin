'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _paths = require('./paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createConfig = ({ filename, entry, plugins }) => {
  plugins = plugins || [];

  return {
    resolve: {
      extensions: ['.js', '.jsx']
    },
    entry: entry,
    output: {
      path: _path2.default.join(_paths.cacheDir, 'bundles'),
      filename: filename,
      library: '[name]_[hash]'
    },
    plugins: [new _webpack2.default.DllPlugin({
      path: _path2.default.join(_paths.cacheDir, '[name].manifest.json'),
      name: '[name]_[hash]'
    })].concat(plugins)
  };
};

exports.default = createConfig;