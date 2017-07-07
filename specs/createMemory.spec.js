import test from 'tape';
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

  createMemory(fs, cacheDir)(hash).then(memory => {
    const results = memory.getBundles();

    t.equal(results[0].filename, 'vendor-a.bundle.js');
    t.equal(results[1].filename, 'vendor-b.bundle.js');

    t.equal(typeof results[0].buffer, 'object');
    t.equal(typeof results[1].buffer, 'object');

    t.end();
  });
});

test('createMemory should not have bundles', t => {
  const hash = createHash('someSettings');
  const otherSettingsHash = createHash('otherSettings');
  const fs = createFakeFS(otherSettingsHash);

  createMemory(fs, cacheDir)(hash).then(memory => {
    const results = memory.getBundles();
    t.equal(results.length, 0, 'should get no bundles');
    t.end();
  });
});
