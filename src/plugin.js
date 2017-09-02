import webpack, { DllReferencePlugin } from 'webpack';
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import { RawSource } from 'webpack-sources';

import path from 'path';

import { cacheDir, getManifestPath } from './paths';
import { concat, merge, keys } from './utils/index.js';
import createCompileIfNeeded from './createCompileIfNeeded';
import createConfig from './createConfig';
import createMemory from './createMemory';
import createSettings from './createSettings';
import getInstanceIndex from './getInstanceIndex';
import createHandleStats from './createHandleStats';
import createLogger from './createLogger';

class AutoDLLPlugin {
  constructor(settings) {
    this._originalSettings = settings;
  }

  apply(compiler) {
    const settings = createSettings({
      originalSettings: this._originalSettings,
      index: getInstanceIndex(compiler.options.plugins, this),
      parentConfig: compiler.options
    });

    const log = createLogger(settings.debug);
    const dllConfig = createConfig(settings, compiler.options);
    const compileIfNeeded = createCompileIfNeeded(log, settings);

    const memory = createMemory();
    const handleStats = createHandleStats(log, settings.hash, memory);

    if (isEmpty(dllConfig.entry)) {
      // there's nothing to do.
      return;
    }

    // exposed for better clarity while debugging   
    // var dllCompiler = webpack(dllConfig);

    const { context, inject } = settings;

    keys(dllConfig.entry)
      .map(getManifestPath(settings.hash))
      .forEach(manifestPath => {
        new DllReferencePlugin({
          context: context,
          manifest: manifestPath
        }).apply(compiler);
      });

    compiler.plugin('before-compile', (params, callback) => {
      params.compilationDependencies = params.compilationDependencies.filter(
        path => !path.startsWith(cacheDir)
      );

      callback();
    });

    compiler.plugin(['run', 'watch-run'], (_compiler, callback) => {
      compileIfNeeded(() => webpack(dllConfig))
        .then((a) => {
          
          return a;
        })
        .then(handleStats)
        .then(({ source, stats }) => {
          compiler.applyPlugins('autodll-stats-retrieved', stats, source);

          if (source === 'memory') return;
          return memory.sync(settings.hash, stats);
        })
        .then(() => callback())
        .catch(console.error);
    });

    compiler.plugin('emit', (compilation, callback) => {
      const dllAssets = memory
        .getAssets()
        .reduce((assets, { filename, buffer }) => {
          const assetPath = path.join(settings.path, filename);

          return {
            ...assets,
            [assetPath]: new RawSource(buffer)
          };
        }, {});

      compilation.assets = merge(
        compilation.assets,
        dllAssets
      );

      callback();
    });

    if (inject) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin(
          'html-webpack-plugin-before-html-generation',
          (htmlPluginData, callback) => {
            const dllEntriesPaths = flatMap(
              memory.getStats().entrypoints,
              'assets'
            ).map((filename) => {
              return path.join(settings.publicPath, settings.path, filename);
            });
            
            htmlPluginData.assets.js = concat(
              dllEntriesPaths,
              htmlPluginData.assets.js
            );

            callback(null, htmlPluginData);
          }
        );
      });
    }
  }
}

export default AutoDLLPlugin;
