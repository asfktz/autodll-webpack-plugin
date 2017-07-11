import { DllReferencePlugin } from 'webpack';
import path from 'path';

import compileIfNeeded from './compileIfNeeded';
import createCompiler from './createCompiler';
import { cacheDir, createGetPublicPath } from './paths';
import { concat, merge, keys } from './utils/index.js';
import createSettings from './createSettings';
import getInstanceIndex from './getInstanceIndex';
import createMemory from './createMemory';

export const getManifestPath = hash => bundleName =>
  path.resolve(cacheDir, hash, `${bundleName}.manifest.json`);

class AutoDLLPlugin {
  constructor(settings) {
    this.originalSettings = settings;
  }

  apply(compiler) {
    const settings = createSettings({
      originalSettings: this.originalSettings,
      index: getInstanceIndex(compiler.options.plugins, this)
    });

    const { context, inject, entry } = settings;
    
    const getPublicPath = createGetPublicPath(
      compiler.options,
      settings.path
    );

    keys(entry)
      .map(getManifestPath(settings.hash))
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
      compileIfNeeded(settings, () => createCompiler(settings))
        .then(() =>
          createMemory(settings.hash).then(memory => {
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

            callback(null, htmlPluginData);
          }
        );
      });
    }
  }
}

export default AutoDLLPlugin;
