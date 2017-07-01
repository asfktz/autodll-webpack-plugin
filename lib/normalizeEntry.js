'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const normalizeEntry = entries => {
  if ((0, _isNil2.default)(entries)) return {};

  return (0, _keys2.default)(entries).reduce((validEntries, key) => {
    if ((0, _isArray2.default)(entries[key]) && entries[key].length) {
      validEntries[key] = entries[key];
    }

    return validEntries;
  }, {});
};

exports.default = normalizeEntry;