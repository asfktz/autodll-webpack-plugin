import test from 'ava';
import path from 'path';
import { createGetPublicDllPath } from '../src/paths';

test('createGetPublicDllPath: should return publicPath path currently', (t) => {
  const settings = {
    publicPath: '/base',
    path: './dllPath',
  };
  
  const getPublicDllPath = createGetPublicDllPath(settings);
  const filename = 'filename.js';

  const expected = path.normalize('/base/dllPath/filename.js');
  t.deepEqual(getPublicDllPath(filename), expected);
});

test('createGetPublicDllPath: should return relative path currently when relative = true', (t) => {
  const settings = {
    publicPath: '/base',
    path: './dllPath',
  };

  const getPublicDllPath = createGetPublicDllPath(settings);
  const filename = 'filename.js';

  const expected = path.normalize('dllPath/filename.js');
  t.deepEqual(getPublicDllPath(filename, true), expected);
});