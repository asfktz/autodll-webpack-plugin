import test from 'ava';
import spy from 'spy';
import path from 'path';
import isObject from 'lodash/isObject';
import isNull from 'lodash/isNull';
import recursive from 'recursive-readdir';
import compileIfNeeded, { runCompile } from '../src/compileIfNeeded';
import createDllCompiler from '../src/createDllCompiler';
import createSettings from '../src/createSettings';
import createConfig from '../src/createConfig';
import { cacheDir } from '../src/paths';
import cleanup from './helpers/cleanup';

test.serial('compileIfNeeded: should generate files', t => {
  t.plan(1);
  cleanup();

  const parentConfig = {
    context: '/parent_context/'
  };

  const settings = createSettings({
    index: 1,
    parentConfig: parentConfig,
    originalSettings: {
      context: path.join(__dirname, '..'),
      env: 'production',
      entry: {
        vendor: ['lodash']
      }
    }
  });

  const dllConfig = createConfig(settings, parentConfig);

  const expected = ['vendor.manifest.json', 'vendor.js'].map(file =>
    path.join(cacheDir, settings.hash, file)
  );

  return compileIfNeeded(settings, createDllCompiler(dllConfig))
    .then(() => recursive(cacheDir))
    .then(files => {
      t.deepEqual(expected.sort(), files.sort());
      cleanup();
    });
});

test.serial(
  'compileIfNeeded: should skip when settings equals lastSettings.json',
  t => {
    t.plan(8);

    cleanup();

    const createDllCompilerSpy = settings => {
      const getCompiler = createDllCompiler(settings, {});
      const compiler = getCompiler();
      spy(compiler, 'run');
      return compiler;
    };


    const parentConfig = {
      context: '/parent_context/'
    };

    const settings = createSettings({
      parentConfig: parentConfig,
      originalSettings: {
        context: path.join(__dirname, '..'),
        entry: {
          vendor: ['lodash']
        }
      },
      index: 4,
      env: 'planet_earth'
    });

    const dllConfig = createConfig(settings, parentConfig);

    return Promise.resolve()
      .then(() => {
        let _compiler;

        return compileIfNeeded(settings, () => {
          _compiler = createDllCompilerSpy(dllConfig);
          return _compiler;
        }).then(state => {
          t.true(isObject(state), 'state is object');
          t.is(state.source, 'build', 'source should be build');
          t.true(isObject(state.stats), 'state should have stats');

          t.is(
            _compiler.run.called,
            true,
            'Should call getCompiler the first time'
          );
        });
      })
      .then(() => {
        return compileIfNeeded(settings, () => {
          t.fail('getDllCompiler is called');
        }).then(state => {
          t.true(isObject(state), 'state is object');
          t.is(state.source, 'cache', 'source should be cache');
          t.true(isNull(state.stats), 'should not have stats');

          t.pass('getDllCompiler is not called');
        });
      })
      .then(() => {
        cleanup();
      });
  }
);
