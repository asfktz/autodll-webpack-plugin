'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = exports.merge = exports.concat = exports.mkdirp = undefined;

var _bluebird = require('bluebird');

var _mkdirp2 = require('mkdirp');

var _mkdirp3 = _interopRequireDefault(_mkdirp2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mkdirp = exports.mkdirp = (0, _bluebird.promisify)(_mkdirp3.default);
const concat = exports.concat = Array.prototype.concat.bind([]);

const merge = exports.merge = (...args) => Object.assign({}, ...args);
const keys = exports.keys = Object.keys;

exports.default = {
  mkdirp,
  concat,
  merge,
  keys
};