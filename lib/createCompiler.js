'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _createConfig = require('./createConfig');

var _createConfig2 = _interopRequireDefault(_createConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createCompiler = settings => {
  const config = (0, _createConfig2.default)(settings);
  return (0, _webpack2.default)(config);
};

exports.default = createCompiler;