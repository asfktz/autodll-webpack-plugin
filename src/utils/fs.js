import Promise from 'bluebird';
import fs from 'fs';

export default Promise.promisifyAll(fs);
