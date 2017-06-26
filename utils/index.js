const promisify = require('es6-promisify');
const fs = require('fs');

const log = require('./log');
const rmdir = promisify(require('rmdir'));
const mkdirp = promisify(require('mkdirp'));

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const concat = Array.prototype.concat.bind([]);

const merge = (...args) => Object.assign({}, ...args);

module.exports = {
  readFile,
  writeFile,
  rmdir,
  log,
  mkdirp,
  concat,
  merge
};
