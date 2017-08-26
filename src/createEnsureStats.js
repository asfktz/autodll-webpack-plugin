import fs from './utils/fs';
import { join } from 'path';
import { resolve } from 'bluebird';
import { cacheDir } from './paths';

const output = (source, stats) => ({ source, stats });

const _createEnsureStats = cacheDir => (log, hash, memory) => compileOutput => {
  const statsPath = join(cacheDir, hash, 'stats.json');

  return resolve(compileOutput).then(({ source, stats }) => {
    if (source === 'build') {
      return resolve()
        .then(() => fs.writeFileAsync(statsPath, JSON.stringify(stats)))
        .then(() => output('build', stats));
    }

    // from cache
    return resolve().then(() => memory.getStats()).then(statsFromMemory => {
      if (statsFromMemory) {
        return output('memory', statsFromMemory);
      }

      return resolve()
        .then(() => fs.readFileAsync(statsPath))
        .then(buffer => JSON.parse(buffer))
        .then((statsFromFS) => output('cache', statsFromFS));
    });
  });
};

export default _createEnsureStats(cacheDir);
