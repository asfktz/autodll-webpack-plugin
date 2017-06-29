'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tapLog = exports.log = undefined;

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noop = () => {};

const log = exports.log = (msg, lvl) => {
  const color = lvl === 1 ? _chalk2.default.bgBlue : _chalk2.default.red;
  console.log('autoDll:', color(msg));
};

const tapLog = exports.tapLog = log => (msg, lvl) => res => {
  log((0, _isFunction2.default)(msg) ? msg(res) : msg, lvl);
  return Promise.resolve(res);
};

const createLogger = shouldShowLogs => {
  if (!shouldShowLogs) {
    return { log: noop, tapLog: tapLog(noop) };
  }

  return { log, tapLog: tapLog(log) };
};

exports.default = createLogger;