import test from 'ava';
import normalizeEntry from '../lib/normalizeEntry';

test('normalizeEntry: should exclude empty bundles', (t) => {
  const results = normalizeEntry({
    emptyBundle1: [],
    emptyBundle2: null,
    emptyBundle3: undefined,
    realBundle: ['test']
  });

  t.deepEqual(results, {
    realBundle: ['test']
  });
});

test('normalizeEntry: should return {} when received empty value', (t) => {
  t.deepEqual(normalizeEntry({}), {});
  t.deepEqual(normalizeEntry(undefined), {});
});