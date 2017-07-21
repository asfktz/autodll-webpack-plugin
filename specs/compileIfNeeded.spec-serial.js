import test from 'ava';
import spy from 'spy';
import path from 'path';
import del from 'del';
import recursive from 'recursive-readdir';

import compileIfNeeded, { compile } from '../src/compileIfNeeded';
import createCompiler from '../src/createCompiler';
import createSettings from '../src/createSettings';
import { cacheDir } from '../src/paths';

test('compileIfNeeded: compile: should not call getCompiler when entry is {} ', t => {
  {
    const settings = { entry: { vendor: ['lib'] } };
    const compiler = { run: spy() };
    compile(settings, () => compiler)();
    t.is(compiler.run.called, true, 'should call compiler.run');
  }

  {
    const settings = { entry: {} };
    const compiler = { run: spy() };
    compile(settings, () => compiler)();
    t.is(compiler.run.called, false, 'should NOT compiler.run');
  }
});

const cleanup = () => del.sync(path.join(cacheDir));

test('compileIfNeeded: should generate files', t => {
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

  return compileIfNeeded(settings, () => createCompiler(settings))
    .then(() => recursive(cacheDir))
    .then(files => {
      t.deepEqual(expected.sort(), files.sort());
      cleanup();
    });
});

test(
  'compileIfNeeded: should skip when settings equals lastSettings.json',
  t => {
    cleanup();

    const createCompilerSpy = settings => {
      const compiler = createCompiler(settings);
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
          _compiler = createCompilerSpy(settings);
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
        let _compiler = 'NEVER_CREATED';

        return compileIfNeeded(settings, () => {
          _compiler = createCompilerSpy(settings);
          return _compiler;
        }).then(() => {
          t.is(
            _compiler,
            'NEVER_CREATED',
            'Should NOT call the getCompiler the second time'
          );
        });
      })
      .then(() => {
        cleanup();
      });
  }
);
