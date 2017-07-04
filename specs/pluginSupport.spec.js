import test from 'tape';
import createConfig from '../src/createConfig';
import { cacheDir } from '../src/paths';
import path from 'path';
import webpack from 'webpack';

test('pluginSupport', (t) => {
  const filename = '[name].[hash].js';
  const entry = {
    vendor: ['react', 'react-dom']
  };

  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
    }),
  ];

  const results = createConfig({ filename, entry, plugins });

  const expected = {
    resolve: {
      extensions: [
        '.js',
        '.jsx'
      ]
    },
    entry: entry,
    output: {
      path: path.join(cacheDir, '/bundles'),
      filename: filename,
      library: '[name]_[hash]'
    },
    plugins: [
      {
        options: {
          path: path.join(cacheDir, '/[name].manifest.json'),
          name: '[name]_[hash]'
        }
      },
      {
        options: {
          compress: true,
        }
      }
    ]
  };

  t.deepEqual(results, expected, 'should out config currently with plugins');
  t.end();
});
