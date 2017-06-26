const Promise = require('bluebird');
const fs = require('fs');

module.exports = Promise.promisifyAll(fs);

