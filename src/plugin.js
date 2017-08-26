import { DllReferencePlugin } from 'webpack';
import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import { RawSource } from 'webpack-sources';

global._ = _;

import path from 'path';

import { cacheDir, createGetPublicDllPath } from './paths';
import { concat, merge, keys } from './utils/index.js';
import createCompileIfNeeded from './createCompileIfNeeded';
import createConfig from './createConfig';
import createDllCompiler from './createDllCompiler';
import createMemory from './createMemory';
import createSettings from './createSettings';
import getInstanceIndex from './getInstanceIndex';
import createEnsureStats from './createEnsureStats';
import createLogger from './createLogger';

export const getManifestPath = hash => bundleName =>
  path.resolve(cacheDir, hash, `${bundleName}.manifest.json`);

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
    const ensureStats = createEnsureStats(log, settings.hash, memory);

    // if (isEmpty(dllConfig.entry)) {
    //   // there's nothing to do.
    //   return;
    // }

    // exposed for better clarity while debugging
    this._settings = settings;
    this._dllConfig = dllConfig;
    const { context, inject } = settings;

    // const getPublicDllPath = createGetPublicDllPath(settings);

    keys(dllConfig.entry)
      .map(getManifestPath(settings.hash))
      .forEach(manifestPath => {
        new DllReferencePlugin({
          context: context,
          manifest: manifestPath
          // scope: settings.path
        }).apply(compiler);
      });

    compiler.plugin('before-compile', (params, callback) => {
      params.compilationDependencies = params.compilationDependencies.filter(
        path => !path.startsWith(cacheDir)
      );

      callback();
    });

    compiler.plugin(['run', 'watch-run'], (compiler, callback) => {
      compileIfNeeded(createDllCompiler(dllConfig))
        .then(ensureStats)
        .then(stats => memory.writeAssets(settings.hash, stats))
        .then(() => callback())
        .catch(error => {
          console.error(error);
        });
    });

    compiler.plugin('emit', (compilation, callback) => {
      const dllAssets = memory
        .getAssets()
        .reduce((assets, { filename, buffer }) => {
          // const assetPath = path.join(settings.publicPath, filename);

          return {
            ...assets,
            [filename]: new RawSource(buffer)
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
              return path.join(settings.publicPath, filename);
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
