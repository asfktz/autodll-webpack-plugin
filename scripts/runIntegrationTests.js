const { spawnSync } = require('child_process');
const { join } = require('path');
const { readdirSync, lstatSync } = require('fs');

const cwd = join(__dirname, '../specs/fixtures');

const isDirectory = source => lstatSync(join(cwd, source)).isDirectory();

readdirSync(cwd)
  .filter(isDirectory)
  .map(dirname => join(cwd, dirname))
  .forEach(ctx => {
    spawnSync(
      'node',
      ['./node_modules/.bin/ava', '--serial', 'specs/*.integration.js'],
      {
        cwd: ctx,
        shell: true,
        stdio: 'inherit'
      }
    );
  });
