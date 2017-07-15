import test from 'ava';
import createConfig from '../lib/createConfig';
import createHash from '../lib/createHash';
import { cacheDir } from '../lib/paths';
import path from 'path';
import webpack from 'webpack';

test('pluginSupport', t => {
  const filename = '[name].[hash].js';
  const entry = {
    vendor: ['react', 'react-dom']
  };

  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    })
  ];

  const originalSettings = { filename, entry, plugins };
  const hash = createHash(originalSettings);
  const settings = Object.assign({}, originalSettings, { hash: hash });
  const outputPath = path.join(cacheDir, hash);

  const results = createConfig(settings);

  const expected = {
    resolve: {
      extensions: ['.js', '.jsx']
    },
    entry: entry,
    output: {
      path: outputPath,
      filename: filename,
      library: '[name]_[hash]'
    },
    module: {},
    plugins: [
      {
        options: {
          path: path.join(outputPath, '[name].manifest.json'),
          name: '[name]_[hash]'
        }
      },
      {
        options: {
          compress: true
        }
      }
    ]
  };

  t.deepEqual(
    JSON.parse(JSON.stringify(results)),
    JSON.parse(JSON.stringify(expected)),
    'should output config currently with plugins'
  );
});
