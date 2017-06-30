'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMemory = undefined;

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _fs = require('./utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _paths = require('./paths');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getBundles = mfs => {
  return mfs.readdirSync('/').map(filename => ({
    filename,
    buffer: mfs.readFileSync(`/${filename}`)
  }));
};

const createMemory = exports.createMemory = (fs, cacheDir) => () => {
  const mfs = new _memoryFs2.default();

  return fs.readdirAsync(_path2.default.join(cacheDir, 'bundles')).catch(() => []).map(filename => (0, _bluebird.join)(filename, fs.readFileAsync(_path2.default.join(cacheDir, 'bundles', filename)))).map(([filename, buffer]) => {
    mfs.writeFileSync(`/${filename}`, buffer);
  }).then(() => ({
    getBundles: getBundles.bind(null, mfs)
  }));
};

exports.default = createMemory(_fs2.default, _paths.cacheDir);