import test from 'tape';
import createSettings from '../src/createSettings';

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
    // the context is diffrent on every environment,
    // resulting in different hash on each
    hash: results.hash
  };

  t.same(results, expected);
  t.end();
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

  t.same(results, expected);
  t.end();
});
