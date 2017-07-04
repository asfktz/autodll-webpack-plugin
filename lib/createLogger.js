'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = msg => {
  console.log('AutoDllPlugin:', msg);
};

log.tap = msg => res => {
  log((0, _isFunction2.default)(msg) ? msg(res) : msg);
  return res;
};

const createLogger = showLogs => {
  if (!showLogs) {
    const log = () => {};
    log.tap = () => res => res;
    return log;
  }

  return log;
};

exports.default = createLogger;