const isFunction = require('lodash/isFunction');
const chalk = require('chalk');

const log = (msg, lvl) => {
  const color = (lvl === 1) ? chalk.bgBlue : chalk.red;
  return console.log(color(msg));
};

const tapLog = (msg, lvl) => res => {
  log((isFunction(msg) ? msg(res) : msg), lvl);
  return Promise.resolve(res);
};

module.exports = { log, tapLog };