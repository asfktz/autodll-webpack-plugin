'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _fs = require('./utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./utils/index.js');

var _paths = require('./paths');

var _createLogger = require('./utils/createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isCacheValid = settings => {
  return (0, _index.mkdirp)(_paths.cacheDir).then(() => _fs2.default.readFileAsync(_path2.default.resolve(_paths.cacheDir, 'lastSettings.json'))).then(file => {
    let lastSettings = JSON.parse(file);
    return (0, _isEqual2.default)(lastSettings, settings);
  }).catch(() => {
    return false;
  });
};

const cleanup = () => (0, _del2.default)(_path2.default.join(_paths.cacheDir, '**'));

const storeSettings = settings => () => {
  return _fs2.default.writeFileAsync(_path2.default.resolve(_paths.cacheDir, 'lastSettings.json'), JSON.stringify(settings));
};

let counter = 0;

const compileIfNeeded = (settings, getCompiler) => {
  const log = (0, _createLogger2.default)(settings.debug);

  return isCacheValid(settings).then(log.tap(isValid => `is valid cache? ${isValid}`)).then(isValid => {
    if (isValid) return;

    const compile = () => {
      return new Promise((resolve, reject) => {
        getCompiler().run((err, stats) => {
          if (err) {
            return reject(err);
          }
          resolve(stats);
        });
      });
    };

    log(`counter ${++counter}`);

    return Promise.resolve().then(log.tap('cleanup')).then(cleanup).then(log.tap('compile')).then(compile).then(log.tap('write lastSettings.json')).then(storeSettings(settings));
  });
};

exports.default = compileIfNeeded;