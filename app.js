(function () {
  'use strict';
  const { types, questions } = window.FinanceContent;
  const { scoreAnswers, secondaryCandidates, combination, parseFragment, resultFragment } = window.FinanceEngine;
  const $ = id => document.getElementById(id);
  const byId = new Map(types.map(type => [type.id, type]));
  const state = { answers: Array(questions.length).fill(null), index: 0, current: null, secondary: null, origin: 'home', own: null, mode: 'home', tied: false, roast: 0, assessment: null, generation: 0 };
  let imageFile = null;
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
    state.generation += 1;
    clearTimeout(toastTimer); $('toast').hidden = true;
    closeSave();
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
    state.secondary = null;
    state.assessment = null;
    setFragment();
    renderQuestion();
  }
  function home() {
    if (state.mode === 'quiz' && state.answers.some(answer => answer !== null) && !window.confirm('返回首页会清除本次回答。确定返回吗？')) return;
    state.answers = Array(questions.length).fill(null);
    state.index = 0;
    state.own = null; state.assessment = null; state.secondary = null; state.current = null;
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
    $('next').textContent = state.index === questions.length - 1 ? '看看我是什么东西 ↗' : '下一题 →';
    show('quiz', 'question-title');
  }
  function finish() {
    state.assessment = scoreAnswers(state.answers);
    const { winners } = state.assessment;
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
    const candidates = secondaryCandidates(state.answers, id);
    state.own = { primary: id, secondary: candidates.length === 1 ? candidates[0] : null };
    renderResult(id, 'own', state.own.secondary);
  }
  function updatePair() {
    const primary = byId.get(state.current);
    const secondary = byId.get(state.secondary);
    const pair = secondary && combination(primary.id, secondary.id);
    $('combo-card').hidden = !pair;
    if (pair) {
      $('secondary-portrait').src = secondary.image;
      $('secondary-portrait').alt = secondary.imageAlt;
      $('secondary-name').textContent = secondary.name;
      $('combo-title').textContent = pair.title;
      $('combo-line').textContent = pair.line;
    } else $('secondary-portrait').removeAttribute('src');
    setFragment(resultFragment(primary.id, secondary ? secondary.id : null));
  }
  function renderSecondary() {
    const candidates = state.origin === 'own' && state.assessment ? secondaryCandidates(state.answers, state.current) : [];
    $('secondary-section').hidden = candidates.length === 0 && !state.secondary;
    $('secondary-options').replaceChildren();
    if (state.origin === 'own') {
      const sameTop = candidates.length && state.assessment.counts[candidates[0]] === state.assessment.max;
      $('secondary-note').textContent = candidates.length > 1
        ? (sameTop ? '这些也与主生物同分。选一只合并，也可以先只领主生物。' : '剩余最高分有并列。选一只当副生物，不想选也能直接分享。')
        : (sameTop ? '这一只也与主生物同分。两只一起认领，不分百分比。' : '按本次答案计分选出。不是人格占比，也不代表能力。');
      if (candidates.length > 1) {
        for (const id of candidates) {
          const button = element('button', byId.get(id).name, 'secondary-chip');
          button.dataset.id = id;
          button.setAttribute('aria-pressed', String(state.secondary === id));
          button.addEventListener('click', () => {
            state.secondary = state.secondary === id ? null : id;
            state.own.secondary = state.secondary;
            state.generation += 1;
            for (const node of $('secondary-options').children) node.setAttribute('aria-pressed', String(node.dataset.id === state.secondary));
            updatePair();
          });
          $('secondary-options').append(button);
        }
      }
    } else {
      $('secondary-note').textContent = state.origin === 'mix' ? '自由混搭，由你选的两只。不是答题得分。' : '这是分享来的组合，不是接收者的答题结果。';
    }
    updatePair();
  }

  function renderResult(id, origin = 'shared', secondary = null) {
    const type = byId.get(id);
    if (!type) { home(); return; }
    state.current = id;
    state.secondary = combination(id, secondary) ? secondary : null;
    state.origin = origin;
    state.roast = 0;
    theme($('result-view'), type);
    $('result-portrait').src = type.image;
    $('result-portrait').alt = type.imageAlt;
    $('result-nickname').textContent = type.nickname;
    $('result-equipment').replaceChildren(...type.equipment.map(item => element('span', item)));
    $('result-roast').textContent = type.roasts[0];
    $('result-context').textContent = origin === 'own' ? '本次鉴定 · 已找到你的离谱归属' : origin === 'preview' ? '图鉴预览 · 这不是你的答题结果' : origin === 'mix' ? '自由混搭 · 不是答题结果，不许拿去做绩效' : '朋友分享的鉴定卡 · 不是你的答题结果';
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
    renderSecondary();
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
    return `${base}${resultFragment(state.current, state.secondary)}`;
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
    const secondary = byId.get(state.secondary);
    const names = secondary ? `「${type.name}」×「${secondary.name}」` : `「${type.name}」`;
    const introduction = state.origin === 'own' ? `我测完认领了${names}` : state.origin === 'mix' ? `我自由混搭出${names}` : `这份离谱财会图鉴是${names}`;
    const pair = secondary && combination(type.id, secondary.id);
    const text = `${introduction}。\n${pair ? pair.title + '：' + pair.line : type.tagline}\n你在账上算什么东西？纯属娱乐，自己来盘。\n${shareUrl()}`;
    await copyResult(text);
  }
  function renderMixPreview() {
    const a = byId.get($('mix-primary').value), b = byId.get($('mix-secondary').value);
    const pair = a && b && combination(a.id, b.id);
    $('mix-error').hidden = Boolean(pair);
    $('mix-open').disabled = !pair;
    if (a && b) {
      $('mix-img-a').src = a.image; $('mix-img-a').alt = a.imageAlt;
      $('mix-img-b').src = b.image; $('mix-img-b').alt = b.imageAlt;
    }
    $('mix-title').textContent = pair ? pair.title : '自己和自己，暂不合并';
    $('mix-line').textContent = pair ? pair.line : '换一只副生物，再看看能整出什么。';
  }
  function mix() {
    if (state.mode === 'quiz' && state.answers.some(answer => answer !== null) && !window.confirm('打开混搭会离开本次答题。确定吗？')) return;
    const previousA = $('mix-primary').value, previousB = $('mix-secondary').value;
    for (const id of ['mix-primary', 'mix-secondary']) {
      $(id).replaceChildren(...types.map(type => {
        const option = element('option', type.name); option.value = type.id; return option;
      }));
    }
    $('mix-primary').value = state.current || previousA || 'other-receivables';
    $('mix-secondary').value = state.secondary || previousB || 'provision';
    if ($('mix-secondary').value === $('mix-primary').value) $('mix-secondary').value = types.find(type => type.id !== $('mix-primary').value).id;
    renderMixPreview();
    setFragment('#mix'); show('mix', 'mix-heading');
    document.title = '双生物合并报表 · 财会生物鉴定中心';
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
  async function renderPng(type, roastIndex, secondary, origin) {
    const images = await Promise.all([loadPortrait(type), ...(secondary ? [loadPortrait(secondary)] : [])]);
    const pair = secondary && combination(type.id, secondary.id);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('当前浏览器无法生成图片。');
    const width = 900, margin = 62;
    const font = '"PingFang SC", "Microsoft YaHei", sans-serif';
    function draw(drawing) {
      let y = 52;
      function text(value, size, color = '#263e36', weight = 400, leading = 1.55, centered = false) {
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
      function rule() { if (drawing) { ctx.fillStyle = '#dce1d8'; ctx.fillRect(margin, y, width - margin * 2, 1); } y += 22; }
      const badge = origin === 'own' ? '本次认领' : origin === 'mix' ? '自由混搭 · 非答题结果' : '图鉴分享 · 非接收者结果';
      text(`财会生物鉴定中心  /  ${badge}`, 21, '#69756f', 500, 1.7, true);
      y += 16;
      const artWidth = pair ? 366 : 510;
      const artHeight = Math.round(artWidth * images[0].naturalHeight / images[0].naturalWidth);
      if (drawing) {
        ctx.fillStyle = type.soft;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(42, y, width - 84, artHeight + 22, 26); else ctx.rect(42, y, width - 84, artHeight + 22);
        ctx.fill();
        ctx.save(); ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(images[0], pair ? 64 : (width - artWidth) / 2, y + 10, artWidth, artHeight);
        if (pair) ctx.drawImage(images[1], width - 64 - artWidth, y + 10, artWidth, artHeight);
        ctx.restore();
        if (pair) { ctx.fillStyle = type.accent; ctx.font = `600 38px ${font}`; ctx.textAlign = 'center'; ctx.fillText('×', width / 2, y + artHeight / 2); }
      }
      y += artHeight + 43;
      if (pair) {
        text(`主 · ${type.name}  ×  副 · ${secondary.name}`, 30, type.accent, 650, 1.5, true);
        y += 18;
        text(pair.title, 54, '#263e36', 750, 1.35, true);
        y += 24;
        text(pair.line, 33, type.accent, 600, 1.65, true);
      } else {
        text(type.nickname, 24, type.accent, 550, 1.5, true); y += 12;
        text(type.name, 65, '#263e36', 750, 1.3, true); y += 23;
        text(type.tagline, 36, type.accent, 650, 1.5, true);
      }
      y += 23; rule();
      text(type.roasts[roastIndex % type.roasts.length], 27, '#536657', 500, 1.7, true);
      y += 19;
      text(`出厂配置  ${type.equipment.join(' / ')}`, 21, '#69756f', 400, 1.75);
      y += 10;
      text(`天敌  ${type.nemesis}`, 22, '#69756f', 400, 1.75);
      y += 24; rule();
      text('查查你在账上算什么东西。', 27, '#263e36', 650, 1.7, true);
      text('FINN / 纯属娱乐 · 别拿去做绩效', 19, '#69756f', 400, 1.8, true);
      text('finnlyu41-tech.github.io/finance-creatures/', 18, '#69756f', 400, 1.7, true);
      return Math.ceil(y + 35);
    }
    canvas.width = width; canvas.height = 2200;
    const height = draw(false); canvas.height = height;
    ctx.fillStyle = '#fffefa'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#dce1d8'; ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    draw(true);
    const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('图片编码失败。')), 'image/png'));
    return { dataUrl: canvas.toDataURL('image/png'), blob };
  }

  async function saveCard() {
    const button = $('save-card'), id = state.current, originalLabel = button.textContent;
    const generation = state.generation, secondaryId = state.secondary, origin = state.origin, roast = state.roast;
    if (button.disabled) return;
    button.disabled = true; button.textContent = '人物卡装袋中…';
    try {
      const type = byId.get(id);
      if (!type) return;
      const { dataUrl, blob } = await renderPng(type, roast, byId.get(secondaryId), origin);
      if (state.current !== id || state.mode !== 'result' || state.generation !== generation) return;
      const filename = `财会生物-${type.name}${secondaryId ? '-' + byId.get(secondaryId).name : ''}.png`;
      imageFile = typeof File === 'function' ? new File([blob], filename, { type: 'image/png' }) : null;
      let canShare = false;
      try { canShare = Boolean(imageFile && window.isSecureContext && navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })); } catch (_) { /* Safe download fallback. */ }
      $('share-image').hidden = !canShare;
      $('save-preview').src = dataUrl;
      $('save-preview').alt = `财会生物人物卡：${type.name}${secondaryId ? ' × ' + byId.get(secondaryId).name : ''}。${type.tagline}`;
      $('download-card').href = dataUrl;
      $('download-card').download = filename;
      if (typeof $('save-dialog').showModal === 'function') $('save-dialog').showModal();
      else $('save-dialog').setAttribute('open', '');
    } catch (error) { toast(error.message || '图片暂时无法生成，可以先截图或分享文字。'); }
    finally { button.disabled = false; button.textContent = originalLabel; }
  }
  function closeSave() {
    if (typeof $('save-dialog').close === 'function' && $('save-dialog').open) $('save-dialog').close();
    else $('save-dialog').removeAttribute('open');
    $('save-preview').removeAttribute('src'); $('download-card').removeAttribute('href');
    imageFile = null; $('share-image').hidden = true;
  }
  async function shareImage() {
    if (!imageFile || !navigator.share) return;
    try {
      // File already exists before this click, preserving transient user activation.
      await navigator.share({ files: [imageFile], title: '财会生物合并报表' });
    } catch (error) {
      if (error.name !== 'AbortError') toast('系统暂时不支持分享图片，请长按图片保存或下载。');
    }
  }
  function route() {
    const target = parseFragment(location.hash);
    if (target.view === 'result') { renderResult(target.primary, 'shared', target.secondary); return; }
    if (target.view === 'library') { library(); return; }
    if (target.view === 'mix') { mix(); return; }
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
    state.generation += 1;
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
  $('library-return').addEventListener('click', () => state.own ? renderResult(state.own.primary, 'own', state.own.secondary) : home());
  $('share-result').addEventListener('click', share);
  $('save-card').addEventListener('click', saveCard);
  $('close-save').addEventListener('click', closeSave);
  $('save-dialog').addEventListener('cancel', () => { imageFile = null; });
  $('share-image').addEventListener('click', shareImage);
  for (const id of ['home-mix', 'result-mix', 'library-mix']) $(id).addEventListener('click', mix);
  $('mix-primary').addEventListener('change', renderMixPreview);
  $('mix-secondary').addEventListener('change', renderMixPreview);
  $('mix-open').addEventListener('click', () => {
    const a = $('mix-primary').value, b = $('mix-secondary').value;
    if (combination(a, b)) renderResult(a, 'mix', b);
  });
  $('mix-start').addEventListener('click', start);
  $('mix-library').addEventListener('click', library);
  $('save-dialog').addEventListener('click', event => { if (event.target === $('save-dialog')) closeSave(); });
  window.addEventListener('hashchange', route);
  route();
})();
