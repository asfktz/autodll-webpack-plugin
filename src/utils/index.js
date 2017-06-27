import { promisify } from 'bluebird';
import _mkdirp from 'mkdirp';

export const mkdirp = promisify(_mkdirp);
export const concat = Array.prototype.concat.bind([]);

export const merge = (...args) => Object.assign({}, ...args);
export const keys = Object.keys;

export default {
  mkdirp,
  concat,
  merge,
  keys
};
