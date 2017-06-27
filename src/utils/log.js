import isFunction from 'lodash/isFunction';
import chalk from 'chalk';

export const log = (msg, lvl) => {
  const color = (lvl === 1) ? chalk.bgBlue : chalk.red;
  console.log(color(msg));
};

export const tapLog = (msg, lvl) => res => {
  log((isFunction(msg) ? msg(res) : msg), lvl);
  return Promise.resolve(res);
};
