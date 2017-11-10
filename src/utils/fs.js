import Promise from 'bluebird';
import fs from 'fs';

import _mkdirp from 'mkdirp';

export const mkdirp = Promise.promisify(_mkdirp);
export default Promise.promisifyAll(fs);
