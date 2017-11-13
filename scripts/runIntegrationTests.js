'use strict';

const spawnSync = require('child_process').spawnSync;
const path = require('path');
const fs = require('fs');

const cwd = path.join(__dirname, '../specs/fixtures');

const isDirectory = source => fs.lstatSync(path.join(cwd, source)).isDirectory();

const failingTests = fs
  .readdirSync(cwd)
  .filter(isDirectory)
  .filter(dirname => {
    const result = spawnSync('npm', ['test'], {
      cwd: path.join(cwd, dirname),
      shell: true,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      console.error(`\nIntegration test for "${dirname}" returned status code ${result.status}!`);
      return true;
    }
    return false;
  });

if (failingTests.length !== 0) {
  console.error('\nIntegration tests are failing!');
  console.error('The following tests returned non-zero status code:');
  failingTests.forEach(t => {
    console.error(`  - ${t}`);
  });
  process.exitCode = 1;
}
