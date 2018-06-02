import path from 'path';
import fs from './utils/fs';
import makeDir from 'make-dir';
import readPkg from 'read-pkg';
import { cacheDir } from './paths';

// This file could be written much better.
// Ideally it should just return a boolean of the cache is valid or not
// right now it also save the last package.json to cache.
// I don't like it, But it will do for now.

// Conditions for cache invalidation (return false):
// 1. The build dir is not exist for example:
//    specs/fixtures/basic/node_modules/.cache/
//    autodll-webpack-plugin/development_instance_0_8d5207f894c329f437bd1ff655c7379a
// 2. The previous package.json is not stored in cache
// 3. The previous package.json diffrent from the current package.json

const validateCache = settings => {
  const prevPkgPath = path.join(cacheDir, 'package.json.hash');

  return Promise.all([
    fs.lstatAsync(path.join(cacheDir, settings.hash)).catch(() => null),
    fs.readFileAsync(prevPkgPath).catch(() => null),
    readPkg(settings.context).catch(() => null),
  ]).then(([buildHashDirExist, prevPkgHash, pkg]) => {
    const pkgHash = JSON.stringify(pkg);

    if (buildHashDirExist && (prevPkgHash && prevPkgHash.toString() === pkgHash)) {
      return true;
    }

    return makeDir(cacheDir)
      .then(() => fs.writeFileAsync(prevPkgPath, pkgHash))
      .then(() => false);
  });
};

export default validateCache;
