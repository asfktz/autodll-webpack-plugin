import { _getEnv } from '../../src/getEnv';

const fakeProcess = { env: { NODE_ENV: 'FAKE_ENV' } };

export const getEnv = _getEnv(fakeProcess);
export const getContext = () => '/fake_context/';
export const cacheDir = '/.cache/fake-cache-dir';