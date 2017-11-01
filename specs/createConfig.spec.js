import test from 'ava';
import isUndefined from 'lodash/isUndefined';
import { _createConfig } from '../src/createConfig';
import { cacheDir } from './helpers/mocks';
import createSettingsHelper from './helpers/createSettingsHelper';

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
