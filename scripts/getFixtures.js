'use strict';

const path = require('path');
const fs = require('fs');

const fixturesFldr = path.join(__dirname, '../specs/fixtures');

const isDirectory = fp => fs.lstatSync(fp).isDirectory();

/**
 * Gets the list of integration test directories. The file paths are absolute.
 *
 * @returns Array<string> directories list.
 */
module.exports = function getFixtures() {
  return fs
    .readdirSync(fixturesFldr)
    .map(name => path.join(fixturesFldr, name))
    .filter(isDirectory);
};
