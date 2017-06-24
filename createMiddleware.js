const pathToRegexp = require('path-to-regexp');
const path = require('path');
const { cacheDir } = require('./paths');
const { createReadStream } = require('fs');

const testMatch = (url) => (pathToRegexp('/dll/:bundleName.js').exec(url) || [])[1];

const createMiddleware = (dllSettings) => {
  return () => (req, res, next) => {
    const bundleName = testMatch(req.url);
    const bundlePath = path.resolve(cacheDir, `${bundleName}.bundle.js`);

    if (!dllSettings.entry[bundleName]) {
      return next();
    }

    createReadStream(bundlePath).pipe(res);
  };
};

module.exports = createMiddleware;