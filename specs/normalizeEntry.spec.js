import test from 'tape';
import normalizeEntry from '../src/normalizeEntry';

test('normalizeEntry: should exclude empty bundles', (t) => {
  const results = normalizeEntry({
    emptyBundle1: [],
    emptyBundle2: null,
    emptyBundle3: undefined,
    realBundle: ['test']
  });

  t.same(results, {
    realBundle: ['test']
  });

  t.end();
});


test('normalizeEntry: should return {} when received {}', (t) => {
  t.same(normalizeEntry({}), {});
  t.end();
});