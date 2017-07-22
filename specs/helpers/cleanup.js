import del from 'del';
import path from 'path';
import { cacheDir } from '../../src/paths';

const cleanup = () => del.sync(path.join(cacheDir));

export default cleanup;