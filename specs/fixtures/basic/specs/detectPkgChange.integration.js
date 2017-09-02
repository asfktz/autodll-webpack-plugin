const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config.js');
const test = require('ava');

const { routeCalls, createRunner, createClearCache, createPkg, createMakeChange, merge } = require('../../../helpers/integration');

const runner = createRunner(webpack, WebpackDevServer);

const pkg = createPkg(__dirname);
const makeChange = createMakeChange(__dirname, '../src/text.js');
const clearCache = createClearCache(__dirname);

//on clean exit
process.on('exit', pkg.restore);

//catches ctrl+c event
process.on('SIGINT', pkg.restore);

//catches uncaught exceptions
process.on('uncaughtException', pkg.restore);


test.serial('Detect package.json change', async t => {
  clearCache();  
  makeChange('initial');
  
  // clean run (cache deleted)

  await runner(config, ({ done, compiler }) => {
    compiler.plugin('autodll-stats-retrieved', routeCalls(
      () => { /* ignore first run */ },
      (stats, source) => {
        t.is(source, 'build', 'should rebuild after package.json changed from memory');
      })
    );

    compiler.plugin('done', routeCalls(
      () => {
        pkg.change();
        makeChange('some change');
      },
      () => done()
    ));
  });

  pkg.restore();
});
