import fs from './utils/fs';
import { join } from 'path';
import { resolve } from 'bluebird';
import { cacheDir } from './paths';

const { stringify, parse } = JSON;

const _createEnsureStats = cacheDir => (log, hash, memory) => compileOutput => {
  const statsPath = join(cacheDir, hash, 'stats.json');

  return resolve(compileOutput)
    .then(({ source, stats }) => {
      if (source === 'build') {
        return resolve()
          .then(() => fs.writeFileAsync(
            statsPath,
            stringify(stats)
          ))
          .then(() => {
            memory.writeStats(stats);
            return memory.getStats();
          });
      }

      // from cache
      return resolve()
        .then(() => memory.getStats())
        .then((statsFromMemory) => {
          if (statsFromMemory) {
            return statsFromMemory;
          }

          return resolve()
            .then(() => fs.readFileAsync(statsPath))
            .then((buffer) => parse(buffer))
            .then((statsFromFS) => {
              memory.writeStats(statsFromFS);
              return memory.getStats();
            });
        });
    });
};

export default _createEnsureStats(cacheDir);
