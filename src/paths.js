import findCacheDir from 'find-cache-dir';

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });