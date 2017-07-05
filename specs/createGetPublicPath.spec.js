import test from 'tape';
import { createGetPublicPath } from '../src/paths';

test('createGetPublicPath: should return publicPath path currently', (tt) => {
  const compilerOptions = { output: { publicPath: '/base' } };
  const dllPath = './dllPath';
  const filename = 'filename.js';
  const getPublicPath = createGetPublicPath(compilerOptions, dllPath);

  const expected = '/base/dllPath/filename.js';
  tt.equals(getPublicPath(filename), expected);
  tt.end();
});

test('createGetPublicPath: should return relative path currently when relative = true', (tt) => {
  const compilerOptions = { output: { publicPath: '/base' } };
  const dllPath = './dllPath';
  const filename = 'filename.js';
  const getPublicPath = createGetPublicPath(compilerOptions, dllPath);

  const expected = 'dllPath/filename.js';
  tt.equals(getPublicPath(filename, true), expected);
  tt.end();
});

test('createGetPublicPath: without compiler.options.publicPath', (t) => {
  const compilerOptions = { output: {} }; 
  const dllPath = './dllPath';
  const filename = 'filename.js';
  const getPublicPath = createGetPublicPath(compilerOptions, dllPath);

  const expected = 'dllPath/filename.js';

  t.equals(getPublicPath(filename), expected);
  t.end();
});