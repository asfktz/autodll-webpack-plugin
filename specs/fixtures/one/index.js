const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');
const expect = require('expect');
const del = require('del');
const test = require('ava');

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const { createRunner, routeCalls } = require('../helpers');

const runner = createRunner(webpack, WebpackDevServer);

const makeChange = str => {
  return fs.writeFileAsync('./src/text.js', `module.exports = '${str}';`);
};

test.serial('test ava', t => {
  del.sync('./node_modules/.cache/autodll-webpack-plugin');
  makeChange('initial');

  return Promise.resolve()
    .then(() => {
      console.log('clean run (cache deleted)');

      return runner(config, ({ done, compiler }) => {
        compiler.plugin(
          'autodll-stats-retrieved',
          routeCalls([
            (stats, source) => {
              console.log('source:', source);
              t.is(source, 'build');
            },
            (stats, source) => {
              console.log('source:', source);
              t.is(source, 'memory');
            }
          ])
        );

        compiler.plugin(
          'done',
          routeCalls([
            () => {
              makeChange('some change');
            },

            () => {
              done();
            }
          ])
        );
      });
    })
    .then(() => {
      console.log('second run (with cached dll bundle from previous run)');

      return runner(config, ({ done, compiler }) => {
        compiler.plugin(
          'autodll-stats',
          routeCalls([
            (stats, source) => {
              console.log('source:', source);
              t.is(source, 'fs');
            },
            (stats, source) => {
              console.log('source:', source);
              t.is(source, 'memory');
            }
          ])
        );

        compiler.plugin(
          'done',
          routeCalls([
            () => {
              makeChange('first change');
            },

            () => {
              done();
            }
          ])
        );
      });
    });
});
