(function(){
  'use strict';
  const {types,questions,axes,siteUrl}=window.FinanceContent;
  const {scoreAnswers,parseFragment,resultFragment}=window.FinanceEngine;
  const $=id=>document.getElementById(id);
  const byId=new Map(types.map(t=>[t.id,t]));
  const state={answers:Array(questions.length).fill(null),index:0,current:null,origin:'home',mode:'home',own:null,assessment:null,roast:0,generation:0,returnMode:'home'};
  let imageFile=null,previewUrl=null,toastTimer;
  const sessionAPI=window.FinanceSession;
  let storageAvailable=true,restoringRoute=false;
  function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
  function theme(node,t){node.style.setProperty('--accent',t.accent);node.style.setProperty('--soft',t.soft);}
  function portrait(t,eager=false,decorative=false){
    if(!t.image){
      const p=el('div',undefined,'art-placeholder');
      if(decorative)p.setAttribute('aria-hidden','true');else{p.setAttribute('role','img');p.setAttribute('aria-label',t.imageAlt);}
      p.append(el('span',t.accountNo,'placeholder-no'),el('span',t.name,'placeholder-name'),el('span','插画暂未载入','placeholder-status'));return p;
    }
    const img=new Image();img.src=t.image;img.alt=decorative?'':t.imageAlt;img.width=384;img.height=341;img.loading=eager?'eager':'lazy';img.decoding='async';img.className=t.artStatus==='licensed'?'licensed-portrait':'';
    img.addEventListener('error',()=>{const fallback=el('div',t.name+' · 插画暂未载入','art-fallback');if(decorative)fallback.setAttribute('aria-hidden','true');else{fallback.setAttribute('role','img');fallback.setAttribute('aria-label',t.name+'，插画载入失败，文字结果不受影响');}img.replaceWith(fallback);},{once:true});return img;
  }
  function setFragment(fragment='',replace=false){
    if(restoringRoute||location.hash===fragment)return;
    try{history[replace?'replaceState':'pushState'](null,'',location.pathname+location.search+fragment);}catch(_){/* local previews can restrict History */}
  }
  function storeSession(){
    const record={contentVersion:window.FinanceContent.contentVersion,answers:state.answers,index:state.index,completed:Boolean(state.own&&state.assessment),updatedAt:Date.now()};
    try{sessionStorage.setItem(sessionAPI.KEY,JSON.stringify(record));storageAvailable=true;}catch(_){storageAvailable=false;}
    updateResume();
  }
  function readSession(){
    try{
      const record=sessionAPI.validate(sessionStorage.getItem(sessionAPI.KEY));
      if(!record){sessionStorage.removeItem(sessionAPI.KEY);return;}
      state.answers=record.answers;state.index=record.index;
      if(record.completed){state.assessment=scoreAnswers(state.answers);state.own=state.assessment.typeId;}
    }catch(_){storageAvailable=false;}
  }
  function updateResume(){
    const count=state.answers.filter(a=>a!==null).length;
    $('resume-banner').hidden=count===0;
    $('resume-summary').textContent=state.own?'上次已完成 · '+byId.get(state.own).name:`已答 ${count} / ${questions.length} 题，不用重来。`;
    $('resume').textContent=state.own?'查看我的结果 →':'接着入账 →';
    $('quiz-storage').textContent=storageAvailable?'进度只保留在当前标签页，刷新可继续；不会上传。':'浏览器未允许临时保存；离开或刷新后需要重答。';
  }
  function resume(){
    if(state.own&&state.assessment){renderResult(state.own,'own');return;}
    setFragment('#quiz');renderQuestion();
  }
  function discard(){
    if(state.answers.some(a=>a!==null)&&!confirm('清空本标签页的答题记录？不影响浏览器里的其他数据。'))return;
    try{sessionStorage.removeItem(sessionAPI.KEY);}catch(_){}
    state.answers=Array(questions.length).fill(null);state.index=0;state.own=null;state.assessment=null;state.current=null;
    updateResume();setFragment('',true);show('home','main');
  }
  function closeSave(){
    const d=$('save-dialog');if(typeof d.close==='function'&&d.open)d.close();else d.removeAttribute('open');
    if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null;}
    $('save-preview').removeAttribute('src');$('download-card').removeAttribute('href');imageFile=null;$('share-image').hidden=true;
  }
  function show(view,focus){
    document.querySelectorAll('.view').forEach(s=>{s.hidden=s.id!==view+'-view';});state.mode=view;state.generation++;
    clearTimeout(toastTimer);$('toast').hidden=true;closeSave();$('copy-fallback').hidden=true;
    window.scrollTo({top:0,behavior:'instant'});if(focus)$(focus).focus({preventScroll:true});
  }
  function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>{$('toast').hidden=true;},3800);}
  function leaveQuiz(){storeSession();return true;}
  function start(){
    if(!state.own&&state.answers.some(a=>a!==null)&&!confirm('当前进度会重新开始。继续新一轮鉴定吗？'))return;
    state.answers=Array(questions.length).fill(null);state.index=0;state.current=null;state.assessment=null;state.own=null;storeSession();setFragment('#quiz');renderQuestion();
  }
  function home(){storeSession();state.current=null;setFragment();show('home','main');document.title='财会生物鉴定中心 · 查查你在账上算什么东西';updateResume();}
  function progress(){
    const count=state.answers.filter(a=>a!==null).length;
    $('progress').setAttribute('aria-valuenow',String(count));
    $('progress').setAttribute('aria-valuetext',`已答 ${count} 题，共 ${questions.length} 题；当前第 ${state.index+1} 题`);
    $('progress-fill').style.width=count/questions.length*100+'%';
  }
  function renderQuestion(){
    const q=questions[state.index],choice=state.answers[state.index];
    $('question-count').textContent=`${String(state.index+1).padStart(2,'0')} / ${questions.length}`;
    $('question-title').textContent=q.title;$('question-scene').textContent=q.scene;
    $('answer-reaction').textContent=choice===null?'你选你的，不用向领导解释。':q.options[choice].reaction;
    $('answer-reaction').classList.toggle('has-answer',choice!==null);
    progress();$('options').replaceChildren();
    q.options.forEach((o,i)=>{
      const label=el('label',undefined,'option'),input=document.createElement('input');input.type='radio';input.name='answer';input.value=i;input.checked=choice===i;
      const letter=el('span',String.fromCharCode(65+i),'option-letter');letter.setAttribute('aria-hidden','true');
      input.addEventListener('change',()=>{state.answers[state.index]=i;state.own=null;state.assessment=null;storeSession();progress();$('next').disabled=false;$('answer-reaction').textContent=o.reaction;$('answer-reaction').classList.add('has-answer');});
      label.append(input,letter,el('span',o.text,'option-text'));$('options').append(label);
    });
    $('previous').disabled=state.index===0;$('next').disabled=choice===null;$('next').textContent=state.index===questions.length-1?'出具我的唯一科目 →':'下一题 →';
    show('quiz','question-title');updateResume();
  }
  function finish(){
    const result=scoreAnswers(state.answers);state.assessment=result;state.own=result.typeId;storeSession();
    renderResult(result.typeId,'own');
  }
  function renderAxes(t,own){
    $('profile-code').textContent=t.code;
    $('dimension-heading').textContent=own?'你的四维反应画像':'这个角色的四维设定';
    $('dimension-note').textContent=own?'每轴 5 题，按本次选择计票。它是玩梗维度，不是科目的分类、借贷方向或人格占比。':'这里只展示角色设定，没有你的答题分数。会计主题维度是娱乐比喻，不代表这个科目的真实类别或记账方向。';
    $('dimension-rows').replaceChildren();$('dimension-pills').replaceChildren();
    axes.forEach((a,i)=>{
      const vote=own?state.assessment.axes[i]:null,side=vote?vote.side:Number(t.pattern[i]);
      const selected=side===0?a.left:a.right;$('dimension-pills').append(el('span',selected.short+' · '+selected.label));
      const row=el('div',undefined,'axis-row');row.dataset.axis=a.id;
      const head=el('div',undefined,'axis-row-head');head.append(el('strong',a.name+' · '+a.theme),el('span',vote?`${vote.lean} · ${vote.votes}/5 票`:'角色设定'));
      const labels=el('div',undefined,'axis-labels');labels.append(el('span',a.left.short+' · '+a.left.label,side===0?'selected':''),el('span',a.right.short+' · '+a.right.label,side===1?'selected':''));
      row.append(head,labels);
      if(vote){
        const track=el('div',undefined,'axis-track');track.setAttribute('role','img');track.setAttribute('aria-label',`${a.left.label} ${vote.left} 票，${a.right.label} ${vote.right} 票。`);
        const fill=el('span',undefined,'axis-fill');fill.style.width=vote.left/5*100+'%';track.append(fill);row.append(track);
        row.append(el('small',`${vote.left} 次${a.left.label} / ${vote.right} 次${a.right.label}`));
      }
      $('dimension-rows').append(row);
    });
  }
  function renderResult(id,origin='shared'){
    const t=byId.get(id);if(!t){home();return;}
    const own=origin==='own'&&state.assessment&&state.assessment.typeId===id;
    state.current=id;state.origin=own?'own':origin;state.roast=0;
    theme($('result-view'),t);$('result-art').replaceChildren(portrait(t,true));$('result-nickname').textContent=t.nickname;
    $('result-equipment').replaceChildren(...t.equipment.map(x=>el('span',x)));
    $('result-context').textContent=own?'本次唯一结果 · 已入账，不再兼任':origin==='preview'?'图鉴预览 · 不是你的答题结果':'朋友分享的科目卡 · 不是你的答题结果';
    $('type-code').textContent='科目参考号 / '+t.accountNo;$('type-label').textContent=t.category+' · '+t.label;
    $('result-name').textContent=t.name;$('result-tagline').textContent=t.tagline;
    $('result-body').replaceChildren(...t.paragraphs.map(x=>el('p',x)));$('result-facts').replaceChildren();
    [['口头禅',t.catchphrase],['出没地点',t.habitat],['天敌',t.nemesis]].forEach(([k,v])=>{const r=el('div');r.append(el('dt',k),el('dd',v));$('result-facts').append(r);});
    $('account-definition').textContent=`${t.accountNo} ${t.name}｜${t.category}。${t.definition}`;
    $('result-roast').textContent=t.roasts[0];$('restart').textContent=own?'不服 · 重新鉴定':'我也来测一下 →';
    $('dimension-details').open=false;
    $('art-credit').replaceChildren();$('art-credit').hidden=t.artStatus!=='licensed';
    if(t.artStatus==='licensed'){
      const credit=el('a',t.artCredit);credit.href='./ART-CREDITS.md';credit.target='_blank';credit.rel='noopener noreferrer';$('art-credit').append(credit,el('span',' · 授权现成插画，不是本项目原创'));
    }
    renderAxes(t,own);setFragment(resultFragment(id));show('result','result-name');document.title=t.name+' · 财会生物鉴定中心';
  }
  function library(skipConfirm=false,filtering=false){
    if(!skipConfirm&&!leaveQuiz())return;$('library-grid').replaceChildren();
    const term=$('library-search').value.trim().toLowerCase();
    const category=$('library-category').value;
    const matches=types.filter(t=>(category==='all'||t.category.startsWith(category))&&[t.name,t.code,t.accountNo,t.nickname,t.tagline].join(' ').toLowerCase().includes(term));
    $('library-count').textContent=`显示 ${matches.length} / 16 个科目`;$('library-empty').hidden=matches.length>0;
    matches.forEach((t,i)=>{
      const card=el('button',undefined,'library-card');card.dataset.type=t.id;theme(card,t);
      const art=el('span',undefined,'library-art');art.append(el('span',`${String(types.indexOf(t)+1).padStart(2,'0')} / ${t.code}`,'mono'),portrait(t,i<4,true));
      card.append(art,el('strong',t.name),el('span',t.nickname,'card-nickname'),el('span',t.tagline,'tagline'),el('span',`${t.accountNo} · ${t.category}`,'account-category'));
      card.addEventListener('click',()=>renderResult(t.id,'preview'));$('library-grid').append(card);
    });
    $('library-return').textContent=state.own?'返回我的唯一结果':'返回首页';if(!filtering){setFragment('#library');show('library','library-heading');}document.title='16 科目图鉴 · 财会生物鉴定中心';
  }
  function method(){state.returnMode=state.mode;setFragment('#method');show('method','method-heading');document.title='四维判定规则 · 财会生物鉴定中心';}
  function renderMethod(){
    for(const a of axes){
      const small=el('div');small.append(el('small',a.name),el('strong',a.theme),el('small',a.left.label+' / '+a.right.label));$('home-axis-overview').append(small);
      const section=el('article',undefined,'method-axis');section.append(el('h3',a.name+'：'+a.theme),el('p',a.left.name+' · '+a.left.label+'：'+a.left.detail),el('p',a.right.name+' · '+a.right.label+'：'+a.right.detail));$('method-axes').append(section);
    }
  }
  function shareUrl(){return siteUrl+resultFragment(state.current);}
  async function copyResult(text){
    try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);toast('结果和链接已复制，可以发给朋友了。');}
    catch(_){$('copy-fallback').hidden=false;$('copy-text').value=text;$('copy-text').focus();$('copy-text').select();toast('自动复制受限，请长按文字手动复制。');}
  }
  async function share(){
    const t=byId.get(state.current);if(!t)return;
    const own=state.origin==='own',intro=own?`我测出来是「${t.name}」。`:`这张科目图鉴是「${t.name}」。`;
    const text=`${intro}\n${t.tagline}\n四维设定：${t.axisPhrase}（娱乐比喻，不是科目分类）。\n20 道题，只给 1 个结果。你在账上算什么东西？`,url=shareUrl();
    if(window.isSecureContext&&navigator.share){
      try{await navigator.share({title:`财会生物 · ${t.name}`,text,url});return;}catch(e){if(e&&e.name==='AbortError')return;}
    }
    await copyResult(`${text}\n${url}`);
  }
  function loadImage(src){
    if(!src)return Promise.resolve(null);
    return new Promise(resolve=>{
      const image=new Image(),timer=setTimeout(()=>{image.onload=image.onerror=null;resolve(null);},8000);
      image.onload=()=>{clearTimeout(timer);resolve(image);};image.onerror=()=>{clearTimeout(timer);resolve(null);};image.src=src;
    });
  }
  async function renderPng(t,roastIndex,origin){
    const [image,qr]=await Promise.all([loadImage(t.image),loadImage(t.qr)]);
    if(document.fonts)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1000))]);
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw new Error('当前浏览器无法生成图片。');
    const width=900,margin=62,font='"PingFang SC", "Microsoft YaHei", sans-serif';
    function draw(drawing){
      let y=52;
      function text(value,size,color='#263e36',weight=400,leading=1.55,center=false){
        ctx.font=`${weight} ${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=center?'center':'left';ctx.textBaseline='top';
        for(const paragraph of value.split('\n')){
          let line='';for(const c of paragraph){if(line&&ctx.measureText(line+c).width>width-margin*2){if(drawing)ctx.fillText(line,center?width/2:margin,y);y+=size*leading;line=c;}else line+=c;}
          if(drawing)ctx.fillText(line,center?width/2:margin,y);y+=size*leading;
        }
      }
      function rule(){if(drawing){ctx.fillStyle='#dce1d8';ctx.fillRect(margin,y,width-margin*2,1);}y+=22;}
      text(`财会生物鉴定中心 / ${origin==='own'?'本次唯一结果':'图鉴分享 · 非接收者结果'}`,21,'#69756f',500,1.7,true);y+=16;
      const artHeight=320,artWidth=image?Math.min(500,artHeight*image.naturalWidth/image.naturalHeight):380;
      if(drawing){
        ctx.fillStyle=t.soft;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(42,y,width-84,artHeight+22,26);else ctx.rect(42,y,width-84,artHeight+22);ctx.fill();
        if(image){ctx.save();ctx.globalCompositeOperation='multiply';const h=artWidth*image.naturalHeight/image.naturalWidth;ctx.drawImage(image,(width-artWidth)/2,y+10+(artHeight-h)/2,artWidth,h);ctx.restore();}
        else{ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=t.accent;ctx.font=`700 90px ${font}`;ctx.fillText(t.accountNo,width/2,y+135);ctx.fillStyle='#69756f';ctx.font=`400 23px ${font}`;ctx.fillText('插画暂未载入 · 文字结果保留',width/2,y+240);}
      }
      y+=artHeight+44;text(`${t.accountNo} · ${t.category}`,22,'#69756f',500,1.6,true);y+=10;
      text(t.name,62,'#263e36',750,1.3,true);y+=18;text(t.tagline,34,t.accent,650,1.55,true);y+=20;
      rule();text(`四维设定  ${t.code}  /  ${t.axisPhrase}`,25,t.accent,650,1.7,true);text('娱乐比喻，不代表科目真实类别或记账方向',18,'#69756f',400,1.8,true);y+=15;
      text(t.roasts[roastIndex%t.roasts.length],27,'#536657',500,1.7,true);y+=20;
      text('出厂配置  '+t.equipment.join(' / '),21,'#69756f',400,1.75);y+=10;text('天敌  '+t.nemesis,22,'#69756f',400,1.75);y+=24;rule();
      if(qr){if(drawing){ctx.fillStyle='#fff';ctx.fillRect(width/2-102,y-4,204,204);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(qr,width/2-98,y,196,196);ctx.restore();}y+=209;text('扫码看这张卡，也测测你的科目',20,'#69756f',400,1.7,true);y+=10;}
      if(t.artCredit){text('插画：'+t.artCredit,17,'#69756f',400,1.7,true);text('humaaans.com · creativecommons.org/licenses/by/4.0',14,'#69756f',400,1.7,true);y+=8;}
      text('查查你在账上算什么东西。',27,'#263e36',650,1.7,true);text('16 个会计科目 / 4 个维度 / 1 个结果',20,'#69756f',400,1.8,true);text('FINN · 纯娱乐 · 别拿去做绩效',19,'#69756f',400,1.8,true);text('finnlyu41-tech.github.io/finance-creatures/',18,'#69756f',400,1.7,true);return Math.ceil(y+35);
    }
    canvas.width=width;canvas.height=2400;const height=draw(false);canvas.height=height;ctx.fillStyle='#fffefa';ctx.fillRect(0,0,width,height);ctx.strokeStyle='#dce1d8';ctx.lineWidth=2;ctx.strokeRect(20,20,width-40,height-40);draw(true);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('图片编码失败。')),'image/png'));
    return {blob,warning:!image?'人物插画暂未载入，本次先生成文字卡。':!qr?'二维码暂未载入，卡片底部仍有网址。':''};
  }
  async function saveCard(){
    const button=$('save-card'),id=state.current,generation=state.generation,origin=state.origin,roast=state.roast;if(button.disabled)return;
    const buttons=[$('save-card'),$('quick-save')],labels=buttons.map(b=>b.textContent);
    buttons.forEach(b=>{b.disabled=true;b.textContent='科目卡装袋中…';});
    try{
      const t=byId.get(id);if(!t)return;const {blob,warning}=await renderPng(t,roast,origin);
      if(state.current!==id||state.mode!=='result'||state.generation!==generation)return;
      const filename=`财会生物-${t.name}.png`;imageFile=typeof File==='function'?new File([blob],filename,{type:'image/png'}):null;
      let canShare=false;try{canShare=Boolean(imageFile&&window.isSecureContext&&navigator.share&&navigator.canShare&&navigator.canShare({files:[imageFile]}));}catch(_){}
      if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(blob);
      $('save-message').textContent=warning||'手机可长按图片保存，或用下方的分享／下载按钮。';
      $('share-image').hidden=!canShare;$('save-preview').src=previewUrl;$('save-preview').alt=`科目卡：${t.name}。${t.tagline}`;
      $('download-card').href=previewUrl;$('download-card').download=filename;
      if(typeof $('save-dialog').showModal==='function')$('save-dialog').showModal();else $('save-dialog').setAttribute('open','');
    }catch(e){toast(e.message||'图片暂时无法生成，可以先分享文字。');}finally{buttons.forEach((b,i)=>{b.disabled=false;b.textContent=labels[i];});}
  }
  async function shareImage(){if(!imageFile||!navigator.share)return;try{await navigator.share({files:[imageFile],title:'我的财会科目卡'});}catch(e){if(e.name!=='AbortError')toast('系统分享暂不可用，请长按图片保存或下载。');}}
  function route(){
    restoringRoute=true;
    try{
      const r=parseFragment(location.hash);
      if(r.view==='quiz'){renderQuestion();return;}
      if(r.view==='result'){renderResult(r.typeId,state.own===r.typeId&&state.assessment?'own':'shared');return;}
      if(r.view==='library'){library(true);return;}
      if(r.view==='method'){state.returnMode='home';show('method','method-heading');return;}
      if(r.view==='legacy'){show('legacy','legacy-heading');document.title='旧版分享已归档 · 财会生物鉴定中心';return;}
      show('home');updateResume();
    }finally{restoringRoute=false;}
  }
  ['start','restart','library-start','method-start','legacy-start'].forEach(id=>$(id).addEventListener('click',start));
  $('brand-home').addEventListener('click',home);
  ['home-library','nav-library','result-library','legacy-library'].forEach(id=>$(id).addEventListener('click',()=>library()));
  ['home-method','result-method'].forEach(id=>$(id).addEventListener('click',method));
  $('method-return').addEventListener('click',()=>{if(state.returnMode==='result'&&state.current)renderResult(state.current,state.origin);else if(state.returnMode==='library')library();else home();});
  $('library-return').addEventListener('click',()=>state.own?renderResult(state.own,'own'):home());
  $('quiz-form').addEventListener('submit',e=>{e.preventDefault();if(state.answers[state.index]===null)return;if(state.index<questions.length-1){state.index++;storeSession();renderQuestion();}else try{finish();}catch(error){toast(error.message);}});
  $('previous').addEventListener('click',()=>{if(state.index>0){state.index--;storeSession();renderQuestion();}});
  $('next-roast').addEventListener('click',()=>{const t=byId.get(state.current);if(!t)return;state.roast=(state.roast+1)%t.roasts.length;state.generation++;$('result-roast').textContent=t.roasts[state.roast];});
  $('share-result').addEventListener('click',share);$('save-card').addEventListener('click',saveCard);$('share-image').addEventListener('click',shareImage);$('close-save').addEventListener('click',closeSave);
  $('save-dialog').addEventListener('click',e=>{if(e.target===$('save-dialog'))closeSave();});$('save-dialog').addEventListener('cancel',e=>{e.preventDefault();closeSave();});
  $('resume').addEventListener('click',resume);$('pause-quiz').addEventListener('click',home);
  $('discard-session').addEventListener('click',discard);$('clear-session').addEventListener('click',discard);
  $('quick-save').addEventListener('click',saveCard);$('quick-share').addEventListener('click',share);
  $('library-search').addEventListener('input',()=>library(true,true));$('library-category').addEventListener('change',()=>library(true,true));
  document.addEventListener('keydown',e=>{
    if(state.mode!=='quiz'||e.ctrlKey||e.metaKey||e.altKey||!['1','2','3','4'].includes(e.key))return;
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&document.activeElement.type!=='radio')return;
    e.preventDefault();const radio=$('options').querySelectorAll('input')[Number(e.key)-1];radio.click();radio.focus();
  });
  window.addEventListener('hashchange',route);window.addEventListener('pagehide',storeSession);
  readSession();renderMethod();updateResume();route();
})();
