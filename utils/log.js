const isFunction = require('lodash/isFunction');

const log = msg => res => {
  console.log(isFunction(msg) ? msg(res) : msg);
  return Promise.resolve(res);
};

module.exports = log;