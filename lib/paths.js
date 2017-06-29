'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getManifestPath = exports.cacheDir = undefined;

var _findCacheDir = require('find-cache-dir');

var _findCacheDir2 = _interopRequireDefault(_findCacheDir);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cacheDir = exports.cacheDir = (0, _findCacheDir2.default)({ name: 'autodll-webpack-plugin' });

const getManifestPath = exports.getManifestPath = bundleName => _path2.default.resolve(cacheDir, `${bundleName}.manifest.json`);