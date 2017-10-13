import path from 'path';
import findCacheDir from 'find-cache-dir';
const urlJoin = require('url-join');

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });

export const getManifestPath = hash => bundleName =>
  path.resolve(cacheDir, hash, `${bundleName}.manifest.json`);

export const getInjectPath = ({ publicPath, pluginPath, filename }) => {
  return urlJoin(publicPath, pluginPath, filename);
};