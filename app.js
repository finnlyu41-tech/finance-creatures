(function () {
  'use strict';
  const { types, questions } = window.FinanceContent;
  const { scoreAnswers } = window.FinanceEngine;
  const $ = id => document.getElementById(id);
  const byId = new Map(types.map(type => [type.id, type]));
  const state = { answers: Array(questions.length).fill(null), index: 0, current: null, own: null, mode: 'home', tied: false };
  let toastTimer;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function setFragment(fragment = '') {
    try { history.replaceState(null, '', location.pathname + location.search + fragment); } catch (_) { /* Local file previews may limit history access. */ }
  }
  function show(view, focusId) {
    document.querySelectorAll('.view').forEach(section => { section.hidden = section.id !== `${view}-view`; });
    state.mode = view;
    $('copy-fallback').hidden = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focusId) $(focusId).focus({ preventScroll: true });
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
  }
  function start() {
    state.answers = Array(questions.length).fill(null);
    state.index = 0;
    state.own = null;
    state.current = null;
    state.tied = false;
    setFragment();
    renderQuestion();
  }
  function home() {
    if (state.mode === 'quiz' && state.answers.some(answer => answer !== null) && !window.confirm('返回首页会清除本次回答。确定返回吗？')) return;
    state.answers = Array(questions.length).fill(null);
    state.index = 0;
    setFragment();
    show('home', 'main');
    document.title = '财会生物鉴定中心 · 今天先不审账';
  }
  function renderQuestion() {
    const q = questions[state.index];
    $('question-count').textContent = `${String(state.index + 1).padStart(2, '0')} / ${questions.length}`;
    $('question-title').textContent = q.title;
    $('progress').setAttribute('aria-valuenow', String(state.index));
    $('progress').setAttribute('aria-valuetext', `正在回答第 ${state.index + 1} 题，共 ${questions.length} 题`);
    $('progress-fill').style.width = `${state.index / questions.length * 100}%`;
    $('options').replaceChildren();
    q.options.forEach((option, optionIndex) => {
      const label = element('label', undefined, 'option');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'answer'; input.value = String(optionIndex);
      input.checked = state.answers[state.index] === optionIndex;
      const letter = element('span', String.fromCharCode(65 + optionIndex), 'option-letter');
      letter.setAttribute('aria-hidden', 'true');
      input.addEventListener('change', () => { state.answers[state.index] = optionIndex; $('next').disabled = false; });
      label.append(input, letter, element('span', option.text, 'option-text'));
      $('options').append(label);
    });
    $('previous').disabled = state.index === 0;
    $('next').disabled = state.answers[state.index] === null;
    $('next').textContent = state.index === questions.length - 1 ? '出具鉴定结果 ↗' : '下一题 →';
    show('quiz', 'question-title');
  }
  function finish() {
    const { winners } = scoreAnswers(state.answers);
    state.tied = winners.length > 1;
    if (winners.length === 1) { chooseOwn(winners[0]); return; }
    $('tie-options').replaceChildren();
    winners.forEach(id => {
      const type = byId.get(id);
      const button = element('button', undefined, 'type-pick');
      button.append(element('strong', type.name), element('span', type.tagline));
      button.addEventListener('click', () => chooseOwn(id));
      $('tie-options').append(button);
    });
    show('tie', 'tie-heading');
  }
  function chooseOwn(id) {
    state.own = id;
    renderResult(id, 'own');
  }
  function renderResult(id, origin = 'shared') {
    const type = byId.get(id);
    if (!type) { home(); return; }
    state.current = id;
    $('result-context').textContent = origin === 'own' ? '本次鉴定结果 · 请自行对号入账' : origin === 'preview' ? '图鉴预览 · 这不是你的答题结果' : '朋友分享的鉴定卡 · 你还可以自己测一次';
    $('type-code').textContent = `SPECIMEN / ${type.code}`;
    $('type-label').textContent = type.label;
    $('result-name').textContent = type.name;
    $('result-tagline').textContent = type.tagline;
    $('result-body').replaceChildren(...type.paragraphs.map(paragraph => element('p', paragraph)));
    $('result-facts').replaceChildren();
    [['口头禅', type.catchphrase], ['出没地点', type.habitat], ['天敌', type.nemesis]].forEach(([label, text]) => {
      const row = element('div'); row.append(element('dt', label), element('dd', text)); $('result-facts').append(row);
    });
    $('tie-disclosure').hidden = !(origin === 'own' && state.tied);
    $('tie-disclosure').textContent = '本次有并列类型，这一张由你亲自认领。没有偷偷替你随机判定。';
    $('restart').textContent = origin === 'own' ? '申请复核 · 重新测' : '我也来测一下 →';
    $('share-result').dataset.origin = origin;
    setFragment(`#type/${id}`);
    show('result', 'result-name');
    document.title = `${type.name} · 财会生物鉴定中心`;
  }
  function library() {
    $('library-grid').replaceChildren();
    types.forEach((type, i) => {
      const card = element('button', undefined, 'library-card');
      card.append(element('span', `${String(i + 1).padStart(2, '0')} / ${type.code}`, 'mono'), element('strong', type.name), element('span', type.tagline, 'tagline'));
      card.addEventListener('click', () => renderResult(type.id, 'preview'));
      $('library-grid').append(card);
    });
    $('library-return').textContent = state.own ? '返回我的结果' : '返回首页';
    setFragment('#library');
    show('library', 'library-heading');
    document.title = '全部 12 种财会生物 · 财会生物鉴定中心';
  }
  function shareUrl() {
    return `${location.origin}${location.pathname}#type/${encodeURIComponent(state.current)}`;
  }
  async function copyResult(text) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      toast('结果和链接已复制，可以发给朋友了。');
    } catch (_) {
      $('copy-fallback').hidden = false;
      $('copy-text').value = text;
      $('copy-text').focus(); $('copy-text').select();
      toast('当前浏览器限制自动复制，请长按文字复制。');
    }
  }
  async function share() {
    const type = byId.get(state.current);
    if (!type) return;
    const introduction = $('share-result').dataset.origin === 'own' ? `我测出来是「${type.name}」` : `这只财会生物叫「${type.name}」`;
    const text = `${introduction}。\n${type.tagline}\n你在账上算什么东西？纯娱乐，来测一下。`;
    const url = shareUrl();
    if (navigator.share && window.isSecureContext) {
      try { await navigator.share({ title: '财会生物鉴定中心', text, url }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    await copyResult(`${text}\n${url}`);
  }

  // Draw a self-contained, legible PNG locally. No screenshot service or CDN is used.
  function renderPng(type) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('当前浏览器无法生成图片。');
    const width = 900, margin = 62;
    const font = '"PingFang SC", "Microsoft YaHei", sans-serif';
    function draw(drawing) {
      let y = 62;
      const text = (value, size, color = '#213e35', weight = 400, leading = 1.8) => {
        ctx.font = `${weight} ${size}px ${font}`; ctx.fillStyle = color;
        const maxWidth = width - margin * 2;
        for (const paragraph of value.split('\n')) {
          let line = '';
          for (const character of paragraph) {
            if (line && ctx.measureText(line + character).width > maxWidth) {
              if (drawing) ctx.fillText(line, margin, y); y += size * leading; line = character;
            } else line += character;
          }
          if (drawing) ctx.fillText(line, margin, y);
          y += size * leading;
        }
      };
      const rule = () => { if (drawing) { ctx.strokeStyle = '#c8d0c0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(margin, y); ctx.lineTo(width - margin, y); ctx.stroke(); } y += 38; };
      text('财 会 生 物 鉴 定 中 心  /  试营业', 22, '#647067', 500);
      y += 12; rule();
      text(`${type.label}  ·  ${type.code}`, 23, '#647067', 400);
      y += 12; text(type.name, 68, '#213e35', 750, 1.35);
      y += 24; text(type.tagline, 33, '#be4d31', 650, 1.65);
      y += 18;
      type.paragraphs.forEach(paragraph => { text(paragraph, 27, '#213e35', 400, 1.9); y += 17; });
      y += 5; rule();
      text(`口头禅  ${type.catchphrase}`, 23, '#647067', 400, 1.9);
      y += 9; text(`天敌  ${type.nemesis}`, 23, '#647067', 400, 1.9);
      y += 25; rule();
      text('查查你在账上算什么东西。', 25, '#213e35', 650);
      text('FINN / 纯属娱乐 · 不评价专业能力', 19, '#647067', 400);
      text(`${location.host}${location.pathname}`, 17, '#647067', 400);
      return Math.ceil(y + 32);
    }
    canvas.width = width; canvas.height = 2400;
    const height = draw(false);
    canvas.height = height;
    ctx.fillStyle = '#fffef8'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#d6d9cd'; ctx.lineWidth = 2; ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.textBaseline = 'top';
    draw(true);
    return canvas.toDataURL('image/png');
  }
  function saveCard() {
    try {
      const type = byId.get(state.current);
      if (!type) return;
      const dataUrl = renderPng(type);
      $('save-preview').src = dataUrl;
      $('save-preview').alt = `财会生物鉴定卡：${type.name}。${type.tagline}`;
      $('download-card').href = dataUrl;
      $('download-card').download = `财会生物-${type.name}.png`;
      if (typeof $('save-dialog').showModal === 'function') $('save-dialog').showModal();
      else $('save-dialog').setAttribute('open', '');
    } catch (error) { toast(error.message || '图片暂时无法生成，可以先截图或分享文字。'); }
  }
  function closeSave() {
    if (typeof $('save-dialog').close === 'function') $('save-dialog').close();
    else $('save-dialog').removeAttribute('open');
    $('save-preview').removeAttribute('src'); $('download-card').removeAttribute('href');
  }
  function route() {
    const match = location.hash.match(/^#type\/([a-z-]+)$/);
    if (match && byId.has(match[1])) { renderResult(match[1], 'shared'); return; }
    if (location.hash === '#library') { library(); return; }
    setFragment(); show('home');
  }

  $('start').addEventListener('click', start);
  $('brand-home').addEventListener('click', home);
  $('home-library').addEventListener('click', library);
  $('quiz-form').addEventListener('submit', event => {
    event.preventDefault();
    if (state.answers[state.index] === null) return;
    if (state.index < questions.length - 1) { state.index += 1; renderQuestion(); }
    else { try { finish(); } catch (error) { toast(error.message); } }
  });
  $('previous').addEventListener('click', () => { if (state.index > 0) { state.index -= 1; renderQuestion(); } });
  $('tie-back').addEventListener('click', () => { state.index = questions.length - 1; renderQuestion(); });
  $('restart').addEventListener('click', start);
  $('result-library').addEventListener('click', library);
  $('library-start').addEventListener('click', start);
  $('library-return').addEventListener('click', () => state.own ? renderResult(state.own, 'own') : home());
  $('share-result').addEventListener('click', share);
  $('save-card').addEventListener('click', saveCard);
  $('close-save').addEventListener('click', closeSave);
  $('save-dialog').addEventListener('click', event => { if (event.target === $('save-dialog')) closeSave(); });
  window.addEventListener('hashchange', route);
  route();
})();
