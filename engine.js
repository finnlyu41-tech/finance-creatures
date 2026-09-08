/* Pure scoring logic: same answers always produce the same tied winners. */
(function (root) {
  'use strict';
  const data = typeof module !== 'undefined' && module.exports ? require('./content.js') : root.FinanceContent;
  function scoreAnswers(answers) {
    if (!Array.isArray(answers) || answers.length !== data.questions.length) throw new TypeError('请先完成所有题目。');
    const counts = Object.fromEntries(data.types.map(type => [type.id, 0]));
    answers.forEach((choice, i) => {
      if (!Number.isInteger(choice) || choice < 0 || choice >= data.questions[i].options.length) throw new TypeError('存在未完成或无效的答案。');
      const id = data.questions[i].options[choice].type;
      if (!Object.hasOwn(counts, id)) throw new Error('题库含有未知类型。');
      counts[id] += 1;
    });
    const max = Math.max(...Object.values(counts));
    return { counts, max, winners: data.types.filter(type => counts[type.id] === max).map(type => type.id) };
  }
  const api = { scoreAnswers };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FinanceEngine = api;
})(globalThis);
