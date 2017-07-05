'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheDir = undefined;

var _findCacheDir = require('find-cache-dir');

var _findCacheDir2 = _interopRequireDefault(_findCacheDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cacheDir = exports.cacheDir = (0, _findCacheDir2.default)({
  name: ['autodll-webpack-plugin', process.env.NODE_ENV].filter(Boolean).join('-')
});