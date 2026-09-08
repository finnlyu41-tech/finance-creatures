const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../content.js');
const { scoreAnswers } = require('../engine.js');

test('12 complete result cards, 12 questions and balanced exposure', () => {
  assert.equal(data.types.length, 12); assert.equal(data.questions.length, 12);
  const exposure = Object.fromEntries(data.types.map(t => [t.id, 0]));
  assert.equal(new Set(data.types.map(t => t.id)).size, 12);
  data.types.forEach(t => {
    ['name', 'tagline', 'catchphrase', 'habitat', 'nemesis', 'label', 'code'].forEach(key => assert.ok(t[key]));
    assert.ok(t.paragraphs.length > 1);
  });
  data.questions.forEach(q => {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.type)).size, 4);
    q.options.forEach(o => { assert.ok(Object.hasOwn(exposure, o.type)); assert.ok(o.text); exposure[o.type]++; });
  });
  Object.values(exposure).forEach(n => assert.equal(n, 4));
});

test('incomplete / malformed answers are rejected', () => {
  for (const input of [null, [], Array(12).fill(null), Array(12).fill(-1), Array(12).fill(4), Array(12).fill('0'), Array(12).fill(0.5), Array(13).fill(0)]) assert.throws(() => scoreAnswers(input));
});

test('deterministic scoring; counts sum to twelve; winners are exactly all top scores', () => {
  const answers = [0,1,2,3,0,1,2,3,0,1,2,3];
  const a = scoreAnswers(answers), b = scoreAnswers(answers);
  assert.deepEqual(a,b);
  assert.equal(Object.values(a.counts).reduce((sum,n) => sum+n,0),12);
  assert.deepEqual(new Set(a.winners), new Set(Object.keys(a.counts).filter(id => a.counts[id] === a.max)));
});

test('changing previous choices recalculates without stale or double scores', () => {
  const a = Array(12).fill(0), b = [...a]; b[0] = 1;
  const x = scoreAnswers(a), y = scoreAnswers(b);
  const former = data.questions[0].options[0].type, next = data.questions[0].options[1].type;
  assert.equal(y.counts[former], x.counts[former]-1);
  assert.equal(y.counts[next], x.counts[next]+1);
});

test('ties remain visible, not silently chosen', () => {
  const r = scoreAnswers(Array(12).fill(0));
  assert.ok(r.winners.length > 1);
  assert.ok(r.winners.every(id => r.counts[id] === r.max));
});

test('every type is reachable as sole winner', () => {
  for (const target of data.types) {
    const counts = Object.fromEntries(data.types.map(t => [t.id, 0]));
    const answers = data.questions.map(q => {
      const found = q.options.findIndex(o => o.type === target.id);
      if (found >= 0) { counts[target.id]++; return found; }
      const best = q.options.map((o,i) => ({id:o.type,i})).sort((a,b) => counts[a.id]-counts[b.id])[0];
      counts[best.id]++; return best.i;
    });
    assert.deepEqual(scoreAnswers(answers).winners, [target.id], `${target.id} must be reachable`);
  }
});
