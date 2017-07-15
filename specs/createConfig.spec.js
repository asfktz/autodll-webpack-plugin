import test from 'ava';
import webpack from 'webpack';
import { _createConfig } from '../lib/createConfig';
import createHash from '../lib/createHash';

const cacheDir = '/.cache/fake-cache-dir';
const createConfig = _createConfig(cacheDir);

const makeConfig = ({ plugins, module } = {}) => {
  const userSettings = {
    filename: '[name].[hash].js',
    entry: {
      vendor: ['react', 'react-dom']
    }
  };

  if (plugins) {
    userSettings.plugins = plugins;
  }

  if (module) {
    userSettings.module = module;
  }

  const settings = Object.assign({}, userSettings, {
    hash: createHash(userSettings)
  });

  const results = createConfig(settings);

  return results;
};

test('createConfig: basic', t => {
  t.snapshot(makeConfig());
});

test('createConfig: with plugins', t => {
  t.snapshot(
    makeConfig({
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: true
        })
      ]
    })
  );
});

test('createConfig: with module (loaders)', t => {
  t.snapshot(
    makeConfig({
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: [],
            exclude: [],
            issuer: {},
            enforce: 'post',
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      }
    })
  );
});
