const isFunction = require('lodash/isFunction');
const chalk = require('chalk');

const log = msg => {
  return chalk.red(msg);
};

const tapLog = msg => res => {
  console.log(chalk.red(isFunction(msg) ? msg(res) : msg));
  return Promise.resolve(res);
};

module.exports = { log, tapLog };