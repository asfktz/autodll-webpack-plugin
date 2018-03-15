const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { SyncHook } = require('tapable');
const config = require('../webpack.config.js');
const test = require('ava');

const {
  routeCalls,
  createRunner,
  createClearCache,
  createPkgHandler,
  createMakeChange,
} = require('../../../helpers/integration');

const runner = createRunner(webpack, WebpackDevServer);

const pkgHandler = createPkgHandler(__dirname);
const makeChange = createMakeChange(__dirname, '../src/text.js');
const clearCache = createClearCache(__dirname);

//on clean exit
process.on('exit', pkgHandler.restore);

//catches ctrl+c event
process.on('SIGINT', pkgHandler.restore);

//catches uncaught exceptions
process.on('uncaughtException', pkgHandler.restore);

console.log('Detect package.json change');

test.serial('Detect package.json change', async t => {
  clearCache();
  makeChange('initial');

  console.log('clean run (cache deleted)');

  await runner(config, ({ done, compiler }) => {
    if (compiler.hooks) {
      compiler.hooks.autodllStatsRetrieved = new SyncHook(['stats', 'source']);
      compiler.hooks.autodllStatsRetrieved.call(
        routeCalls(
          () => {
            console.log('first build');
          },

          (stats, source) => {
            console.log('rebuild is triggered since package.json changed.');
            t.is(source, 'build', 'should rebuild after package.json changed');
          }
        )
      );

      compiler.hooks.done.tapAsync(
        'AutoDllPlugin',
        routeCalls(
          () => {
            console.log('first build is done.');

            console.log('change to package.json');
            pkgHandler.change();

            console.log('making a change to some file to trigger a rebuild');
            makeChange('some change');
          },
          () => {
            console.log('Second build is done.');
            done();
          }
        )
      );

      // Important! We only test package.json right now.
      // But the cache also invalidates when the settings passed to the plugin are different.
    } else {
      compiler.plugin(
        'autodll-stats-retrieved',
        routeCalls(
          () => {
            console.log('first build');
          },
          (stats, source) => {
            console.log('rebuild is triggered since package.json changed.');
            t.is(source, 'build', 'should rebuild after package.json changed');
          }
        )
      );

      compiler.plugin(
        'done',
        routeCalls(
          () => {
            console.log('first build is done.');

            console.log('change to package.json');
            pkgHandler.change();

            console.log('making a change to some file to trigger a rebuild');
            makeChange('some change');
          },
          () => {
            console.log('Second build is done.');
            done();
          }
        )
      );
    }

    pkgHandler.restore();
  });
});
