import findCacheDir from 'find-cache-dir';

export const cacheDir = findCacheDir({
  name: ['autodll-webpack-plugin', process.env.NODE_ENV]
    .filter(Boolean)
    .join('-'),
});
