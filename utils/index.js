const promisify = require('es6-promisify');

const mkdirp = promisify(require('mkdirp'));

const concat = Array.prototype.concat.bind([]);

const merge = (...args) => Object.assign({}, ...args);
const { keys } = Object;

module.exports = {
  mkdirp,
  concat,
  merge,
  keys
};
