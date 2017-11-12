import test from 'ava';
import isUndefined from 'lodash/isUndefined';
import range from 'lodash/range';
import { _createConfig } from '../src/createConfig';
import { cacheDir } from './helpers/mocks';
import createSettingsHelper from './helpers/createSettingsHelper';
import slashify from './helpers/slashify';

import AutoDllPlugin from '../src';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const createConfig = _createConfig(cacheDir);

const settingsHelper = createSettingsHelper({
  index: 2,
  parentConfig: {
    context: '/parent_context/',
  },
  originalSettings: {
    entry: {
      reactStuff: ['react', 'react-dom'],
      animationStuff: ['pixi.js', 'gsap'],
    },
  },
});

const parentConfig = {
  context: './src',
  entry: {
    home: './home.js',
    events: './events.js',
    contact: './contact.js',
  },
  output: {
    path: './dist',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // …
    ],
  },
  node: {
    fs: 'empty',
  },
  plugins: [new AutoDllPlugin(), new HtmlWebpackPlugin(), new UglifyJsPlugin()],
};

test('createConfig: basic', t => {
  const settings = settingsHelper({});
  const results = createConfig(settings, {});

  // The config has `path` attributes which vary depending on the OS. One way to deal
  // with this w.r.t snapshots is snapshot serializers -
  // https://facebook.github.io/jest/docs/en/configuration.html#snapshotserializers-array-string.
  // However, to the best of my knowledge, this cannot be used with ava. So the work
  // around is to manually slashify all the properties which are file paths.
  slashify(
    results,
    ['output.path'].concat(
      range(0, results.plugins.length).map(idx => `plugins[${idx}].options.path`)
    )
  );
  t.snapshot(results);
});

test('createConfig: should not inherit when { inherit: false }', t => {
  const settings = settingsHelper({
    inherit: false,
  });

  const results = createConfig(settings, parentConfig);
  t.true(results.plugins.length === 1, 'should have only one plugin (DllPlugin)');
  t.true(results.plugins[0].constructor.name === 'DllPlugin', 'ensure DllPlugin is included');
  t.true(isUndefined(results.module));
  t.true(isUndefined(results.node));
});

test('createConfig: should inherit', t => {
  const settings = settingsHelper({
    inherit: true,
  });

  const results = createConfig(settings, parentConfig);

  t.deepEqual(results.module, parentConfig.module);
  t.deepEqual(results.node, parentConfig.node);

  t.true(
    results.plugins.length === 1,
    'should not inherit plugins by default. but should have DllPlugin'
  );
  t.true(results.plugins[0].constructor.name === 'DllPlugin', 'ensure DllPlugin is included');
});
