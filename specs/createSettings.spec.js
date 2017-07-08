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
    hash: 'development_instance_9_89991264035cd7bee58c05bd0a13ca70'
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
    hash: 'mars_instance_9_42b03373e0b5adb471bcb7e7bd8d34e6'
  };

  t.same(results, expected);
  t.end();
});
