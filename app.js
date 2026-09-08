(function () {
  'use strict';
  const { types, questions } = window.FinanceContent;
  const { scoreAnswers } = window.FinanceEngine;
  const $ = id => document.getElementById(id);
  const byId = new Map(types.map(type => [type.id, type]));
  const state = { answers: Array(questions.length).fill(null), index: 0, current: null, own: null, mode: 'home', tied: false, roast: 0 };
  let toastTimer;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function portrait(type, eager = false) {
    const img = document.createElement('img');
    img.src = type.image; img.alt = type.imageAlt;
    img.width = 384; img.height = 341;
    img.loading = eager ? 'eager' : 'lazy'; img.decoding = 'async';
    return img;
  }
  function theme(node, type) {
    node.style.setProperty('--accent', type.accent);
    node.style.setProperty('--soft', type.soft);
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
    $('question-scene').textContent = q.scene;
    const chosen = state.answers[state.index];
    $('answer-reaction').textContent = chosen === null ? '你选你的，不用向领导解释。' : q.options[chosen].reaction;
    $('answer-reaction').classList.toggle('has-answer', chosen !== null);
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
      input.addEventListener('change', () => {
        state.answers[state.index] = optionIndex; $('next').disabled = false;
        $('answer-reaction').textContent = option.reaction;
        $('answer-reaction').classList.add('has-answer');
      });
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
      theme(button, type);
      const copy = element('span', undefined, 'pick-copy');
      copy.append(element('strong', type.name), element('span', type.tagline));
      button.append(portrait(type, true), copy);
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
    state.roast = 0;
    theme($('result-view'), type);
    $('result-portrait').src = type.image;
    $('result-portrait').alt = type.imageAlt;
    $('result-nickname').textContent = type.nickname;
    $('result-equipment').replaceChildren(...type.equipment.map(item => element('span', item)));
    $('result-roast').textContent = type.roasts[0];
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
    $('restart').textContent = origin === 'own' ? '不服 · 重新鉴定' : '我也来测一下 →';
    $('share-result').dataset.origin = origin;
    setFragment(`#type/${id}`);
    show('result', 'result-name');
    document.title = `${type.name} · 财会生物鉴定中心`;
  }
  function library() {
    if (state.mode === 'quiz' && state.answers.some(answer => answer !== null) && !window.confirm('打开图鉴会离开本次答题，确定吗？')) return;
    $('library-grid').replaceChildren();
    types.forEach((type, i) => {
      const card = element('button', undefined, 'library-card');
      theme(card, type);
      const art = element('span', undefined, 'library-art');
      art.append(element('span', `${String(i + 1).padStart(2, '0')} / ${type.code}`, 'mono'), portrait(type, i < 4));
      card.append(art, element('strong', type.name), element('span', type.nickname, 'card-nickname'), element('span', type.tagline, 'tagline'));
      card.addEventListener('click', () => renderResult(type.id, 'preview'));
      $('library-grid').append(card);
    });
    $('library-return').textContent = state.own ? '返回我的结果' : '返回首页';
    setFragment('#library');
    show('library', 'library-heading');
    document.title = '全部 12 种财会生物 · 财会生物鉴定中心';
  }
  function shareUrl() {
    const base = /^https?:$/.test(location.protocol) ? `${location.origin}${location.pathname}` : window.FinanceContent.siteUrl;
    return `${base}#type/${encodeURIComponent(state.current)}`;
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

  // The illustration and all lettering are composed locally; no upload or screenshot service.
  function loadPortrait(type) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timer = setTimeout(() => { image.onload = image.onerror = null; reject(new Error('人物图暂时没载入，请稍后再试。')); }, 15000);
      image.onload = () => { clearTimeout(timer); resolve(image); };
      image.onerror = () => { clearTimeout(timer); reject(new Error('人物图载入失败，请刷新后再试。')); };
      image.src = type.image;
    });
  }
  async function renderPng(type, roastIndex) {
    const image = await loadPortrait(type);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('当前浏览器无法生成图片。');
    const width = 900, margin = 62;
    const font = '"PingFang SC", "Microsoft YaHei", sans-serif';
    function draw(drawing) {
      let y = 58;
      function text(value, size, color = '#263e36', weight = 400, leading = 1.65, centered = false) {
        ctx.font = `${weight} ${size}px ${font}`;
        ctx.fillStyle = color; ctx.textAlign = centered ? 'center' : 'left'; ctx.textBaseline = 'top';
        const maxWidth = width - margin * 2;
        for (const paragraph of value.split('\n')) {
          let line = '';
          for (const character of paragraph) {
            if (line && ctx.measureText(line + character).width > maxWidth) {
              if (drawing) ctx.fillText(line, centered ? width / 2 : margin, y);
              y += size * leading; line = character;
            } else line += character;
          }
          if (drawing) ctx.fillText(line, centered ? width / 2 : margin, y);
          y += size * leading;
        }
      }
      text('财会生物鉴定中心  /  非正式人物卡', 23, '#69756f', 500, 1.7, true);
      y += 17;
      const artWidth = 616, artHeight = Math.round(artWidth * image.naturalHeight / image.naturalWidth);
      if (drawing) {
        ctx.fillStyle = type.soft;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(54, y, width - 108, artHeight + 16, 26);
        else ctx.rect(54, y, width - 108, artHeight + 16);
        ctx.fill();
        ctx.save(); ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(image, (width - artWidth) / 2, y + 8, artWidth, artHeight); ctx.restore();
      }
      y += artHeight + 45;
      text(type.nickname, 25, type.accent, 500, 1.6, true);
      y += 10;
      text(type.name, 68, '#263e36', 750, 1.3, true);
      y += 27;
      text(type.tagline, 33, type.accent, 650, 1.55, true);
      y += 23;
      if (drawing) { ctx.fillStyle = '#dce1d8'; ctx.fillRect(margin, y, width - margin * 2, 1); }
      y += 30;
      text(type.roasts[roastIndex % type.roasts.length], 29, '#536657', 500, 1.8, true);
      y += 25;
      text(`口头禅  ${type.catchphrase}`, 23, '#69756f', 400, 1.8);
      y += 10;
      text(`天敌  ${type.nemesis}`, 23, '#69756f', 400, 1.8);
      y += 26;
      if (drawing) { ctx.fillStyle = '#dce1d8'; ctx.fillRect(margin, y, width - margin * 2, 1); }
      y += 28;
      text('你在账上算什么东西？', 25, '#263e36', 650, 1.7, true);
      text('FINN / 纯属娱乐 · 原创角色 · 不做绩效', 19, '#69756f', 400, 1.8, true);
      text('finnlyu41-tech.github.io/finance-creatures/', 18, '#69756f', 400, 1.7, true);
      return Math.ceil(y + 42);
    }
    canvas.width = width; canvas.height = 2200;
    const height = draw(false); canvas.height = height;
    ctx.fillStyle = '#fffefa'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#dce1d8'; ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    draw(true);
    return canvas.toDataURL('image/png');
  }
  async function saveCard() {
    const button = $('save-card'), id = state.current, originalLabel = button.textContent;
    if (button.disabled) return;
    button.disabled = true; button.textContent = '人物卡装袋中…';
    try {
      const type = byId.get(id);
      if (!type) return;
      const dataUrl = await renderPng(type, state.roast);
      if (state.current !== id || state.mode !== 'result') return;
      $('save-preview').src = dataUrl;
      $('save-preview').alt = `财会生物人物卡：${type.name}。${type.tagline}`;
      $('download-card').href = dataUrl;
      $('download-card').download = `财会生物-${type.name}.png`;
      if (typeof $('save-dialog').showModal === 'function') $('save-dialog').showModal();
      else $('save-dialog').setAttribute('open', '');
    } catch (error) { toast(error.message || '图片暂时无法生成，可以先截图或分享文字。'); }
    finally { button.disabled = false; button.textContent = originalLabel; }
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
  $('nav-library').addEventListener('click', library);
  $('next-roast').addEventListener('click', () => {
    const type = byId.get(state.current);
    if (!type) return;
    state.roast = (state.roast + 1) % type.roasts.length;
    $('result-roast').textContent = type.roasts[state.roast];
  });
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
