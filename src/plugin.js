import { DllReferencePlugin } from 'webpack';
import path from 'path';

import compileIfNeeded from './compileIfNeeded';
import createCompiler from './createCompiler';
import createHash from './createHash';
import { cacheDir, createGetPublicPath } from './paths';
import { concat, merge, keys } from './utils/index.js';
import normalizeEntry from './normalizeEntry';

import createMemory from './createMemory';

let counter = 0;

export const getManifestPath = hash => bundleName =>
  path.resolve(cacheDir, hash, `${bundleName}.manifest.json`);

export const createSettings = ({ entry, ...settings }) => {
  const defaults = {
    nodeEnv: process.env.NODE_ENV || 'development',
    id: `instance${counter++}`,
    context: __dirname,
    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false,
  };

  const mergedSettings = merge(defaults, settings, {
    entry: normalizeEntry(entry),
  });
  mergedSettings.hash = createHash(mergedSettings);
  return mergedSettings;
};

class AutoDLLPlugin {
  constructor(settings) {
    this.settings = createSettings(settings);
  }

  apply(compiler) {
    const { context, inject, entry } = this.settings;
    
    const getPublicPath = createGetPublicPath(
      compiler.options,
      this.settings.path
    );

    keys(entry)
      .map(getManifestPath(this.settings.hash))
      .forEach(manifestPath => {
        new DllReferencePlugin({
          context: context,
          manifest: manifestPath,
        }).apply(compiler);
      });

    compiler.plugin('before-compile', (params, callback) => {
      params.compilationDependencies = params.compilationDependencies.filter(
        path => !path.startsWith(cacheDir)
      );

      callback();
    });

    const onRun = (compiler, callback) =>
      compileIfNeeded(this.settings, () => createCompiler(this.settings))
        .then(() =>
          createMemory(this.settings.hash).then(memory => {
            this.initialized = true;
            this.memory = memory;
          })
        )
        .then(callback);

    compiler.plugin('watch-run', onRun);
    compiler.plugin('run', onRun);

    compiler.plugin('emit', (compilation, callback) => {
      const { memory } = this;
      
      const assets = memory.getBundles()
        .map(({ filename, buffer }) => {
          const relativePath = getPublicPath(filename, true);
          
          return {
            [relativePath]: {
              source: () => buffer.toString(),
              size: () => buffer.length
            }
          };
        });

      compilation.assets = merge(compilation.assets, ...assets);
      callback();
    });

    if (inject) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin(
          'html-webpack-plugin-before-html-generation',
          (htmlPluginData, callback) => {
            const { memory } = this;
            const bundlesPublicPaths = memory.getBundles().map(({ filename }) => getPublicPath(filename));

            htmlPluginData.assets.js = concat(
              bundlesPublicPaths,
              htmlPluginData.assets.js
            );

            callback();
            callback(null, htmlPluginData);
          }
        );
      });
    }
  }
}

export default AutoDLLPlugin;
