import test from 'ava';
import { createMemory } from '../src/createMemory';
import createHash from '../src/createHash';
import MemoryFileSystem from 'memory-fs';
import { promisifyAll } from 'bluebird';
import path from 'path';

const cacheDir = '/my/cache/dir';

const createFakeFS = bundleDir => {
  const fs = promisifyAll(new MemoryFileSystem());

  fs.mkdirpSync(path.join(cacheDir, bundleDir));
  fs.writeFileSync(
    path.join(cacheDir, bundleDir, 'vendor-a.bundle.js'),
    'test 1'
  );
  fs.writeFileSync(
    path.join(cacheDir, bundleDir, 'vendor-b.bundle.js'),
    'test 2'
  );

  return fs;
};

test('createMemory should have bundles', t => {
  const hash = createHash('someSettings');
  const fs = createFakeFS(hash);

  return createMemory(fs, cacheDir)(hash).then(memory => {
    const results = memory.getBundles();

    t.deepEqual(results[0].filename, 'vendor-a.bundle.js');
    t.deepEqual(results[1].filename, 'vendor-b.bundle.js');

    t.deepEqual(results[0].buffer.toString(), 'test 1');
    t.deepEqual(results[1].buffer.toString(), 'test 2');
  });
});

test('createMemory should not have bundles', t => {
  const hash = createHash('someSettings');
  const otherSettingsHash = createHash('otherSettings');
  const fs = createFakeFS(otherSettingsHash);

  return createMemory(fs, cacheDir)(hash).then(memory => {
    const results = memory.getBundles();
    t.deepEqual(results.length, 0, 'should get no bundles');
  });
});
