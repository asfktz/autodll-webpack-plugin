import test from 'tape';
import spy from 'spy';
import compileIfNeeded, { compile, getHash } from '../src/compileIfNeeded';
import createCompiler from '../src/createCompiler';
import { createSettings } from '../src/plugin';
import path from 'path';
import { cacheDir } from '../src/paths';
import del from 'del';
import recursive from 'recursive-readdir';


test('compileIfNeeded: compile: should not call getCompiler when entry is {} ', (t) => {
  {
    const settings = { entry: { vendor: [ 'lib' ] } };
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

  t.end();
});

const cleanup = () => del.sync(path.join(cacheDir));

test('compileIfNeeded: should generate files', (t) => {
  cleanup();

  const settings = createSettings({
    context: path.join(__dirname, '..'),
    entry: {
      vendor: ['lodash']
    }
  });

  const expected = [
    getHash(settings),
    'vendor.manifest.json',
    'bundles/vendor.js'
  ].map((file) => (
    path.join(cacheDir, file)
  ));

  compileIfNeeded(settings, () => createCompiler(settings))
    .then(() => recursive(cacheDir))
    .then((files) => {
      t.same(expected.sort(), files.sort());
    
      cleanup();
      t.end();
    });
});



test('compileIfNeeded: should skip when settings equals lastSettings.json', (t) => {
  cleanup();

  t.timeoutAfter(5000);

  const createCompilerSpy = (settings) => {
    const compiler = createCompiler(settings);
    spy(compiler, 'run');
    return compiler;
  };

  const settings = createSettings({
    context: path.join(__dirname, '..'),
    entry: {
      vendor: ['lodash']
    }
  });

  Promise.resolve()
    .then(() => {
      let _compiler;

      return compileIfNeeded(settings, () => {
        _compiler = createCompilerSpy(settings);
        return _compiler;
      }).then(() => {
        t.is(_compiler.run.called, true, 'Should call getCompiler the first time');
      });
    })

    .then(() => {
      let _compiler = 'NEVER_CREATED';

      return compileIfNeeded(settings, () => {
        _compiler = createCompilerSpy(settings);
        return _compiler;
      }).then(() => {
        t.is(_compiler, 'NEVER_CREATED', 'Should NOT call the getCompiler the second time');
      });
    }) 
    .then(() => {
      cleanup();
      t.end();
    });
});
