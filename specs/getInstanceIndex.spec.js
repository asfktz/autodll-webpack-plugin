import test from 'tape';
import getInstanceIndex, { isAutoDll } from '../src/getInstanceIndex';
import AutoDLLPlugin from '../src/plugin';

test('getInstanceIndex', t => {
  const instance = new AutoDLLPlugin();
  const index = getInstanceIndex(
    [{}, new AutoDLLPlugin(), {}, new AutoDLLPlugin(), instance, {}],
    instance
  );

  t.equals(index, 2, 'Should return the currect index');
  t.end();
});

test('getInstanceIndex | isAutoDll: Should detect a valid AutoDLL plugin', t => {
  const instance = isAutoDll(new AutoDLLPlugin());
  t.equals(instance, true);
  t.end();
});

test('getInstanceIndex | isAutoDll: Should detect an invalid AutoDLL plugin', t => {
  {
    const instance = isAutoDll({});
    t.equals(instance, false);
  }

  {
    const instance = isAutoDll({ constructor: { name: 'SomethingElse' } });
    t.equals(instance, false);
  }

  {
    const instance = isAutoDll(undefined);
    t.equals(instance, false);
  }

  {
    const instance = isAutoDll(null);
    t.equals(instance, false);
  }

  t.end();
});
