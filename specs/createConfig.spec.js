import test from 'tape';
import createConfig from '../src/createConfig';
import { cacheDir } from '../src/paths';
import path from 'path';

test('createConfig', (t) => {
  const filename = '[name].[hash].js';
  const entry = {
    vendor: ['react', 'react-dom']
  };

  const results = createConfig({ filename, entry });
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
      }
    ]
  };

  t.deepEqual(results, expected, 'should out config currently');
  t.end();
});