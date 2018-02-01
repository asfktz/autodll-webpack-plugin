import { strategy } from 'webpack-merge';
import { DllPlugin } from 'webpack';
import path from 'path';
import { cacheDir } from './paths';

import reject from 'lodash/reject';
import get from 'lodash/get';
import omit from 'lodash/omit';

import mapParentConfig from './mapParentConfig';

const webpackMerge = strategy({
  entry: 'append',
  output: 'append',
  plugins: 'append',
});

// omit properties that can break things
const prepare = config => {
  // We don't want are own plugin in the DLL config
  const plugins = reject(
    config.plugins,
    plugin => get(plugin, 'constructor.name') === 'AutoDLLPlugin'
  );

  // context is omitted becouse we already assigned the parent context as the defaults in createSettings
  // plugins are ommited by default too.
  // It's not ideal, but it's better to let the user make a conscious choice about it.
  const props = ['context', 'plugins', 'entry', 'output'];
  return { ...omit(config, props), plugins };
};

export const _createConfig = cacheDir => (settings, rawParentConfig) => {
  const { hash, filename = [] } = settings;
  const outputPath = path.join(cacheDir, hash);

  const parentConfig = mapParentConfig(settings, prepare(rawParentConfig));

  const ownConfig = {
    context: settings.context,
    entry: settings.entry,
    plugins: [
      ...(settings.plugins || []),
      new DllPlugin({
        path: path.join(outputPath, '[name].manifest.json'),
        name: '[name]_[chunkhash]',
      }),
    ],
    output: {
      filename: filename,
      library: '[name]_[chunkhash]',
    },
  };

  const advanceConfig = settings.config;

  const cacheConfig = {
    // The user is not allowed to change output.path
    // otherwise bad things will happen.
    // (this is the path for the cache)
    output: {
      path: outputPath,
    },
  };

  return webpackMerge(parentConfig, ownConfig, advanceConfig, cacheConfig);
};

export default _createConfig(cacheDir);
