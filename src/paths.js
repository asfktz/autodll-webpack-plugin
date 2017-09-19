import path from 'path';
import findCacheDir from 'find-cache-dir';

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });

export const getManifestPath = hash => bundleName =>
  path.resolve(cacheDir, hash, `${bundleName}.manifest.json`);