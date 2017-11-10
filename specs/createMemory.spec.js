import test from 'ava';
import { _createMemory } from '../src/createMemory';
import createHash from '../src/createHash';
import MemoryFileSystem from 'memory-fs';
import { promisifyAll } from 'bluebird';
import path from 'path';

const cacheDir = '/my/cache/dir';

// why? testing with the FileSystem is hard.
// We can't run multiple tests in parallel when using the FS
// otherwise they'll interrupted each other.
// So instead we test it against another MemoryFileSystem (the API is the same).
// That way evething stays isolated and clean.
const createFakeFS = (hash, files) => {
  const fs = promisifyAll(new MemoryFileSystem());

  fs.mkdirpSync(path.join(cacheDir, hash));

  files.forEach(({ filename, content }) => {
    fs.writeFileSync(path.join(cacheDir, hash, filename), content);
  });

  return fs;
};

test('createMemory should have assets', t => {
  const hash = createHash('someSettings');
  const fs = createFakeFS(hash, [
    {
      filename: 'vendor-a.bundle.js',
      content: 'test 1',
    },
    {
      filename: 'vendor-b.bundle.js',
      content: 'test 2',
    },
  ]);

  const memory = _createMemory(fs, cacheDir)();
  const stats = {
    hash: 'stats-hash',
    assets: [{ name: 'vendor-a.bundle.js' }, { name: 'vendor-b.bundle.js' }],
  };

  return memory.sync(hash, stats).then(() => {
    const assets = memory.getAssets();

    t.deepEqual(memory.getStats(), stats);

    t.is(assets[0].filename, 'vendor-a.bundle.js');
    t.is(assets[0].buffer.toString(), 'test 1');

    t.is(assets[1].filename, 'vendor-b.bundle.js');
    t.is(assets[1].buffer.toString(), 'test 2');
  });
});
