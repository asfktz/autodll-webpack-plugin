import test from 'ava';
import spy from 'spy';
import path from 'path';
import del from 'del';
import recursive from 'recursive-readdir';
import compileIfNeeded, { runCompile }  from '../src/compileIfNeeded';
import createDllCompiler from '../src/createDllCompiler';
import createSettings from '../src/createSettings';
import { cacheDir } from '../src/paths';

test('compileIfNeeded: runCompile: should not call getCompiler when entry is {} ', t => {
  {
    const settings = { entry: {} };
    const dllCompiler = { run: spy() };
    runCompile(settings, () => dllCompiler)();

    t.is(dllCompiler.run.called, false, 'should NOT call compiler.run');
  }

  {
    const settings = { entry: { vendor: ['lib'] } };
    const dllCompiler = { run: spy() };
    runCompile(settings, () => dllCompiler)();
    t.is(dllCompiler.run.called, true, 'should call compiler.run');
  }
});

const cleanup = () => del.sync(path.join(cacheDir));

test('compileIfNeeded: should generate files', t => {
  t.plan(1);

  cleanup();

  const settings = createSettings({
    index: 1,
    originalSettings: {
      context: path.join(__dirname, '..'),
      env: 'production',
      entry: {
        vendor: ['lodash']
      }
    }
  });

  const expected = ['vendor.manifest.json', 'vendor.js'].map(file =>
    path.join(cacheDir, settings.hash, file)
  );

  return compileIfNeeded(settings, createDllCompiler(settings, {}))
    .then(() => recursive(cacheDir))
    .then(files => {
      t.deepEqual(expected.sort(), files.sort());
      cleanup();
    });
});

test('compileIfNeeded: should skip when settings equals lastSettings.json', t => {
  cleanup();

  const createDllCompilerSpy = settings => {
    const getCompiler = createDllCompiler(settings, {});
    const compiler = getCompiler();
    spy(compiler, 'run');
    return compiler;
  };

  const settings = createSettings({
    originalSettings: {
      context: path.join(__dirname, '..'),
      entry: {
        vendor: ['lodash']
      }
    },
    index: 4,
    env: 'planet_earth'
  });

  return Promise.resolve()
    .then(() => {
      let _compiler;

      return compileIfNeeded(settings, () => {
        _compiler = createDllCompilerSpy(settings);
        return _compiler;
      }).then(() => {
        t.is(
          _compiler.run.called,
          true,
          'Should call getCompiler the first time'
        );
      });
    })
    .then(() => {
      compileIfNeeded(settings, () => {
        t.fail('getDllCompiler is called');
      });

      t.pass('getDllCompiler is not called');
    })
    .then(() => {
      cleanup();
    });
});
