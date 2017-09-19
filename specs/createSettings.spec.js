import test from 'ava';
import mergeAll from 'lodash/fp/mergeAll';
import { _createSettings } from '../src/createSettings';
import { getEnv, getContext } from './helpers/mocks';

const createSettings = _createSettings(getEnv, getContext);

const base = {
  index: 0,
  parentConfig: {
    context: '/parent_context/'
  },
  originalSettings: {
    entry: {
      reactStuff: ['react', 'react-dom'],
      animationStuff: ['pixi.js', 'gsap']
    }
  }
};

test('createSettings: basic', t => {
  const results = createSettings(base);
  t.snapshot(results);
});

test('createSettings: create hash with env & instance index', t => {
  {
    const params = mergeAll([base, { index: 9 }]);
    const results = createSettings(params);
    t.is(results.hash, 'FAKE_ENV_instance_9_3a37b749d35175f034d80d4f778a4344');
  }

  {
    const params = mergeAll([
      base,
      { index: 2, originalSettings: { env: 'MARS' } }
    ]);

    const results = createSettings(params);

    t.is(results.hash, 'MARS_instance_2_0aef250e225283a6339e894b1b024211');
  }
});

test('createSettings: set the default base options currently', t => {
  {
    const results = createSettings(base);

    t.is(results.debug, false);
    t.is(results.inject, false);
    t.is(results.filename, '[name].js');
    t.is(results.path, '');
    t.is(results.context, '/parent_context/');
  }
});

test('createSettings: override the base options currently', t => {
  {
    const params = mergeAll([
      base,
      {
        originalSettings: {
          debug: true,
          inject: true,
          filename: '[name].[hash].special.js',
          path: '/path/to/dll',
          context: '/override_context/'
        },
        parentConfig: {
          output: {
            publicPath: '/some_public_path/'
          }
        }
      }
    ]);

    const results = createSettings(params);

    t.is(results.debug, true);
    t.is(results.inject, true);
    t.is(results.filename, '[name].[hash].special.js');
    t.is(results.path, '/path/to/dll');
    t.is(results.context, '/override_context/');
    t.is(results.publicPath, '/some_public_path/');
  }
});


test('createSettings: context override', t => {
  {
    const params = mergeAll([
      base,
      {
        parentConfig: {
          context: '/parent_context/'
        },
        originalSettings: {}
      }
    ]);

    const results = createSettings(params);

    t.is(results.context, '/parent_context/');
  }

  {
    const params = mergeAll([
      base,
      {
        parentConfig: {
          context: '/parent_context/'
        },
        originalSettings: {
          context: '/settings_context/'
        }
      }
    ]);

    const results = createSettings(params);

    t.is(results.context, '/settings_context/');
  }
});
