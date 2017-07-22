export { default as safeClone } from './safeClone';
export const concat = Array.prototype.concat.bind([]);
export const merge = (...args) => Object.assign({}, ...args);
export const keys = Object.keys;
