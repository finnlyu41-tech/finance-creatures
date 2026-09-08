/* Deterministic local scoring. Ties remain explicit; no personality percentages. */
(function (root) {
  'use strict';
  const data = typeof module !== 'undefined' && module.exports ? require('./content.js') : root.FinanceContent;
  const validIds = new Set(data.types.map(type => type.id));
  function scoreAnswers(answers) {
    if (!Array.isArray(answers) || answers.length !== data.questions.length) throw new TypeError('请先完成所有题目。');
    const counts = Object.fromEntries(data.types.map(type => [type.id, 0]));
    for (let i = 0; i < data.questions.length; i += 1) {
      const choice = answers[i];
      if (!Number.isInteger(choice) || choice < 0 || choice >= data.questions[i].options.length) throw new TypeError('存在未完成或无效的答案。');
      const id = data.questions[i].options[choice].type;
      if (!Object.hasOwn(counts, id)) throw new Error('题库含有未知类型。');
      counts[id] += 1;
    }
    const max = Math.max(...Object.values(counts));
    return { counts, max, winners: data.types.filter(type => counts[type.id] === max).map(type => type.id) };
  }
  function secondaryCandidates(answers, primary) {
    const result = scoreAnswers(answers);
    if (!result.winners.includes(primary)) throw new TypeError('主生物必须来自本次最高分类型。');
    const remaining = data.types.filter(type => type.id !== primary);
    const max = Math.max(0, ...remaining.map(type => result.counts[type.id]));
    return max > 0 ? remaining.filter(type => result.counts[type.id] === max).map(type => type.id) : [];
  }
  function combination(primary, secondary) {
    if (!validIds.has(primary) || !validIds.has(secondary) || primary === secondary) return null;
    return data.combinations[[primary, secondary].sort().join('|')] || null;
  }
  function parseFragment(fragment) {
    if (fragment === '#library') return { view: 'library' };
    if (fragment === '#mix') return { view: 'mix' };
    const match = /^#type\/([a-z-]+)(?:\/with\/([a-z-]+))?$/.exec(fragment);
    if (match && validIds.has(match[1]) && (!match[2] || combination(match[1], match[2]))) {
      return { view: 'result', primary: match[1], secondary: match[2] || null };
    }
    return { view: 'home' };
  }
  function resultFragment(primary, secondary = null) {
    if (!validIds.has(primary) || (secondary && !combination(primary, secondary))) throw new TypeError('未知的生物组合。');
    return `#type/${primary}${secondary ? `/with/${secondary}` : ''}`;
  }
  const api = { scoreAnswers, secondaryCandidates, combination, parseFragment, resultFragment };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FinanceEngine = api;
})(globalThis);
