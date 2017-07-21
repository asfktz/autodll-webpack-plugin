import test from 'ava';
import mergeAll from 'lodash/fp/mergeAll';
import { _createSettings } from '../src/createSettings';
import { _getEnv } from '../src/getEnv';

const fakeProcess = { env: { NODE_ENV: 'FAKE_ENV' } };
const getEnv = _getEnv(fakeProcess);
const getContext = () => '/fake_context/';
const createSettings = _createSettings(getEnv, getContext);

const base = {
  index: 0,
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
    t.is(results.hash, 'FAKE_ENV_instance_9_562e0fe624fe82ce5e6172ccfaa4f900');
  }

  {
    const params = mergeAll([
      base,
      { index: 2, originalSettings: { env: 'MARS' } }
    ]);

    const results = createSettings(params);

    t.is(results.hash, 'MARS_instance_2_f25047331adabfbf5310911a578cd763');
  }
});

test('createSettings: set the default base options currently', t => {
  {
    const results = createSettings(base);

    t.is(results.debug, false);
    t.is(results.inject, false);
    t.is(results.filename, '[name].js');
    t.is(results.path, '');
    t.is(results.context, '/fake_context/');
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
        }
      }
    ]);

    const results = createSettings(params);

    t.is(results.debug, true);
    t.is(results.inject, true);
    t.is(results.filename, '[name].[hash].special.js');
    t.is(results.path, '/path/to/dll');
    t.is(results.context, '/override_context/');
  }
});
