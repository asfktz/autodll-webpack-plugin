'use strict';

const spawnSync = require('child_process').spawnSync;
const path = require('path');
const getFixtures = require('./getFixtures');

getFixtures().forEach(fixtureDir => {
  const result = spawnSync('npm', ['install'], {
    cwd: fixtureDir,
    shell: true,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    const testname = path.basename(fixtureDir);
    throw new Error(`Failed to install deps for ${testname}`);
  }
});
