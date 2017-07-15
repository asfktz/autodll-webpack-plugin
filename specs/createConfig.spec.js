import test from 'ava';
import { _createConfig } from '../lib/createConfig';
import createHash from '../lib/createHash';
import path from 'path';

const cacheDir = '/.cache/fake-cache-dir';
const createConfig = _createConfig(cacheDir);

const makeConfig = ({ plugins, module } = {}) => {
  const settings = {
    entry: {
      vendor: ['react', 'react-dom']
    }
  };

  if (plugins) {
    settings.plugins = plugins;
  }

  if (module) {
    settings.module = module;
  }

  const filename = '[name].[hash].js';
  const hash = createHash(settings);
  const results = createConfig({ filename, entry: settings.entry, hash });
  const outputPath = path.join(cacheDir, hash);

  return { results, outputPath };
};

test('createConfig: basic', t => {
  const { outputPath, results } = makeConfig();

  t.snapshot(results);

  // const expected = {
  //   resolve: {
  //     extensions: ['.js', '.jsx']
  //   },
  //   entry: {
  //     vendor: ['react', 'react-dom']
  //   },
  //   output: {
  //     path: outputPath,
  //     filename: '[name].[hash].js',
  //     library: '[name]_[hash]'
  //   },
  //   module: {},
  //   plugins: [
  //     {
  //       options: {
  //         path: path.join(outputPath, '/[name].manifest.json'),
  //         name: '[name]_[hash]'
  //       }
  //     }
  //   ]
  // };

  // t.deepEqual(
  //   JSON.parse(JSON.stringify(results)),
  //   JSON.parse(JSON.stringify(expected)),
  //   'should output config currently'
  // );
});
