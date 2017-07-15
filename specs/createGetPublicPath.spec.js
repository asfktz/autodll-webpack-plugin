import test from 'ava';
import path from 'path';
import { createGetPublicPath } from '../lib/paths';

test('createGetPublicPath: should return publicPath path currently', (t) => {
  const compilerOptions = { output: { publicPath: '/base' } };
  const dllPath = './dllPath';
  const filename = 'filename.js';
  const getPublicPath = createGetPublicPath(compilerOptions, dllPath);

  const expected = path.normalize('/base/dllPath/filename.js');
  t.deepEqual(getPublicPath(filename), expected);
});

test('createGetPublicPath: should return relative path currently when relative = true', (t) => {
  const compilerOptions = { output: { publicPath: '/base' } };
  const dllPath = './dllPath';
  const filename = 'filename.js';
  const getPublicPath = createGetPublicPath(compilerOptions, dllPath);

  const expected = path.normalize('dllPath/filename.js');
  t.deepEqual(getPublicPath(filename, true), expected);
});

test('createGetPublicPath: without compiler.options.publicPath', (t) => {
  const compilerOptions = { output: {} };
  const dllPath = './dllPath';
  const filename = 'filename.js';
  const getPublicPath = createGetPublicPath(compilerOptions, dllPath);

  const expected = path.normalize('dllPath/filename.js');

  t.deepEqual(getPublicPath(filename), expected);
});
