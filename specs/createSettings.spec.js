import test from 'ava';
import createSettings from '../lib/createSettings';

test('createSettings:', t => {
  const results = createSettings({
    index: 9,
    originalSettings: {
      entry: {
        reactStuff: ['react', 'react-dom'],
        animationStuff: ['pixi.js', 'gsap']
      }
    }
  });

  const expected = {
    context: process.cwd(),
    path: '',
    entry: {
      reactStuff: ['react', 'react-dom'],
      animationStuff: ['pixi.js', 'gsap']
    },
    filename: '[name].js',
    inject: false,
    debug: false,
    id: 'instance_9',
    env: 'development',
    
    // TODO: test the hash separately.
    // context is diffrent in every environment,
    // resulting in different hash for each
    hash: results.hash
  };

  t.deepEqual(results, expected);
});

test('createSettings:', t => {
  const results = createSettings({
    index: 9,
    originalSettings: {
      debug: true,
      inject: true,
      env: 'mars',
      entry: {
        reactStuff: ['react', 'react-dom'],
        animationStuff: ['pixi.js', 'gsap']
      }
    }
  });

  const expected = {
    context: process.cwd(),
    path: '',
    entry: {
      reactStuff: ['react', 'react-dom'],
      animationStuff: ['pixi.js', 'gsap']
    },
    filename: '[name].js',
    inject: true,
    debug: true,
    id: 'instance_9',
    env: 'mars',
    hash: results.hash
  };

  t.deepEqual(results, expected);
});
