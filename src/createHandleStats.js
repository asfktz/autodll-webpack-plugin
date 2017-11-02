import fs from './utils/fs';
import { join } from 'path';
import { cacheDir } from './paths';

const createStoreStats = (fs, statsPath) => stats =>
  fs.writeFileAsync(statsPath, JSON.stringify(stats));

const createRetrieveStats = (memory, statsPath) => () => {
  return Promise.resolve().then(() => {
    const statsFromMemory = memory.getStats();

    if (statsFromMemory) {
      return {
        source: 'memory',
        stats: statsFromMemory,
      };
    }

    return fs
      .readFileAsync(statsPath)
      .then(buffer => JSON.parse(buffer))
      .then(statsFromFS => ({
        source: 'fs',
        stats: statsFromFS,
      }));
  });
};

const _createHandleStats = (fs, cacheDir) => (log, hash, memory) => {
  const statsPath = join(cacheDir, hash, 'stats.json');
  const storeStats = createStoreStats(fs, statsPath);
  const retrieveStats = createRetrieveStats(memory, statsPath);

  return statsFromBuild => {
    if (statsFromBuild) {
      const stats = statsFromBuild.toJson();
      return storeStats(stats).then(() => ({
        source: 'build',
        stats: stats,
      }));
    }

    return retrieveStats().then(({ stats, source }) => {
      return {
        source: source,
        stats: stats,
      };
    });
  };
};

export default _createHandleStats(fs, cacheDir);
