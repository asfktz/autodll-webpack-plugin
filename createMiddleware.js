const pathToRegexp = require('path-to-regexp');
const path = require('path');
const { cacheDir } = require('./paths');
const { createReadStream } = require('fs');

const testMatch = (url) => (pathToRegexp('/dll/:bundleName.js').exec(url) || [])[1];

const createMiddleware = () => (req, res, next) => {
  if (!req.url.startsWith('/dll/')) {
    return next();
  }

  const bundleName = testMatch(req.url);
  const bundlePath = path.resolve(cacheDir, `${bundleName}.bundle.js`);

  createReadStream(bundlePath)
    .on('error', (err) => next(err))
    .pipe(res);
};

module.exports = createMiddleware;