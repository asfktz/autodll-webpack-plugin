const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config.js');
const test = require('ava');

const {
  routeCalls,
  createRunner,
  createClearCache,
  createMakeChange,
} = require('../../../helpers/integration');

const runner = createRunner(webpack, WebpackDevServer);

const clearCache = createClearCache(__dirname);
const makeChange = createMakeChange(__dirname, '../src/text.js');

test.serial('Ensure stats retrieved from the currect source', async t => {
  clearCache();
  makeChange('initial');

  console.log('clean run (cache deleted)');

  await runner(config, ({ done, compiler }) => {
    compiler.plugin(
      'autodll-stats-retrieved',
      routeCalls(
        (stats, source) => {
          t.is(source, 'build', 'should retreive stats from build');
        },
        (stats, source) => {
          t.is(source, 'memory', 'should retreive stats from memory');
        }
      )
    );

    compiler.plugin('done', routeCalls(() => makeChange('some change'), () => done()));
  });

  console.log('second run (with cached dll bundle from previous run)');

  await runner(config, ({ done, compiler }) => {
    compiler.plugin(
      'autodll-stats-retrieved',
      routeCalls(
        (stats, source) => {
          t.is(source, 'fs', 'should retreive stats from fs');
        },
        (stats, source) => {
          t.is(source, 'memory', 'should retreive stats from memory');
        }
      )
    );

    compiler.plugin('done', routeCalls(() => makeChange('some other change'), () => done()));
  });
});
