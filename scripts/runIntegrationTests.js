'use strict';

const spawnSync = require('child_process').spawnSync;
const path = require('path');
const getFixtures = require('./getFixtures');

const failingTests = getFixtures().filter(fixtureDir => {
  const result = spawnSync('npm', ['test'], {
    cwd: fixtureDir,
    shell: true,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    const testname = path.basename(fixtureDir);
    console.error(`\nIntegration test for "${testname}" returned status code ${result.status}!`);
    return true;
  }
  return false;
});

if (failingTests.length !== 0) {
  console.error('\nIntegration tests are failing!');
  console.error('The following tests returned non-zero status code:');
  failingTests.forEach(t => {
    console.error(`  - ${path.basename(t)}`);
  });
  process.exitCode = 1;
}
