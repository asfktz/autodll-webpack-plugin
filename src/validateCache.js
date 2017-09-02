import path from 'path';
import fs, { mkdirp } from './utils/fs';
import readPkg from 'read-pkg';

const validateCache = (cacheDir, settings) => {
  const prevPkgDepsPath = path.join(cacheDir, 'package.json.hash');

  return fs
    .readFileAsync(prevPkgDepsPath)
    .catch(() => null)
    .then(prevPkgHash =>
      readPkg(settings.context).then(pkg => {
        const pkgHash = JSON.stringify(pkg);

        if (prevPkgHash && prevPkgHash.toString() === pkgHash) {
          return true;
        }

        return mkdirp(path.join(cacheDir, settings.hash))
          .then(() => fs.writeFileAsync(prevPkgDepsPath, pkgHash))
          .then(() => {
            return false;
          });
      })
    );
};

export default validateCache;
