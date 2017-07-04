'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHash = exports.compile = exports.HASH_FILENAME = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _fs = require('./utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./utils/index.js');

var _paths = require('./paths');

var _createLogger = require('./createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HASH_FILENAME = exports.HASH_FILENAME = 'lastHash';

const isCacheValid = newHash => {
  return (0, _index.mkdirp)(_paths.cacheDir).then(() => _fs2.default.readFileAsync(_path2.default.resolve(_paths.cacheDir, HASH_FILENAME), 'utf-8')).then(lastHash => {
    return lastHash === newHash;
  }).catch(() => {
    return false;
  });
};

const cleanup = () => (0, _del2.default)(_path2.default.join(_paths.cacheDir, '**/*'));

const storeHash = hash => () => {
  return _fs2.default.writeFileAsync(_path2.default.resolve(_paths.cacheDir, HASH_FILENAME), hash);
};

const compile = exports.compile = (settings, getCompiler) => () => {
  // skip compiling if there is nothing to build
  if ((0, _isEmpty2.default)(settings.entry)) return;

  return new Promise((resolve, reject) => {
    getCompiler().run((err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
};

const getContents = watchPath => {
  if (_fs2.default.existsSync(watchPath)) {
    if (_fs2.default.lstatSync(watchPath).isDirectory()) {
      if (watchPath.startsWith(_paths.cacheDir)) {
        return '';
      }
      return _fs2.default.readdirSync(watchPath).map(p => getContents(_path2.default.join(watchPath, p))).join('');
    } else {
      return _fs2.default.readFileSync(watchPath, 'utf-8');
    }
  }
};

const getHash = exports.getHash = settings => {
  const hash = _crypto2.default.createHash('md5');
  const settingsJSON = JSON.stringify(settings);

  hash.update(settingsJSON);

  if (Array.isArray(settings.watch)) {
    hash.update(settings.watch.map(getContents).reduce((str, content) => {
      return str += content;
    }, ''));
  }
  return hash.digest('hex');
};

const compileIfNeeded = (settings, getCompiler) => {
  const log = (0, _createLogger2.default)(settings.debug);
  const currentHash = getHash(settings);
  return isCacheValid(currentHash).then(log.tap(isValid => `is valid cache? ${isValid}`)).then(isValid => {
    if (isValid) return;

    return Promise.resolve().then(log.tap('cleanup')).then(cleanup).then(log.tap('compile')).then(compile(settings, getCompiler)).then(storeHash(currentHash));
  });
};

exports.default = compileIfNeeded;