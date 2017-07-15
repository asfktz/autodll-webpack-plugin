import test from 'ava';
import getInstanceIndex, { isAutoDll } from '../lib/getInstanceIndex';
import AutoDLLPlugin from '../lib/plugin';

test('getInstanceIndex', t => {
  const instance = new AutoDLLPlugin();
  const index = getInstanceIndex(
    [{}, new AutoDLLPlugin(), {}, new AutoDLLPlugin(), instance, {}],
    instance
  );

  t.deepEqual(index, 2, 'Should return the currect index');
});

test('getInstanceIndex | isAutoDll: Should detect a valid AutoDLL plugin', t => {
  const instance = isAutoDll(new AutoDLLPlugin());
  t.deepEqual(instance, true);
});

test('getInstanceIndex | isAutoDll: Should detect an invalid AutoDLL plugin', t => {
  {
    const instance = isAutoDll({});
    t.deepEqual(instance, false);
  }

  {
    const instance = isAutoDll({ constructor: { name: 'SomethingElse' } });
    t.deepEqual(instance, false);
  }

  {
    const instance = isAutoDll(undefined);
    t.deepEqual(instance, false);
  }

  {
    const instance = isAutoDll(null);
    t.deepEqual(instance, false);
  }
});
