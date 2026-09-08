/* Optional end-to-end smoke checks. Requires puppeteer and an installed Chrome.
   CHROME_PATH=/path/to/chrome node tests/browser.test.cjs /tmp/finance-qa
   Uses an isolated headless profile and a loopback static server; never a personal browser profile. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const puppeteer=require('puppeteer');
const data=require('../content.js');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv[2]||'qa-output');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'application/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 let filename;
 try { const url=new URL(req.url,'http://localhost');filename=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname)); }
 catch { res.writeHead(400);return res.end(); }
 if(!filename.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(filename,(err,body)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(filename)]||'application/octet-stream');res.end(body);});
});
const checks=[],errors=[],requests=[];
function ok(name){checks.push(name);console.log('PASS '+name);}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}/`;
 let browser;
 try {
  browser=await puppeteer.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-first-run']});
  const page=await browser.newPage();page.setDefaultTimeout(12000);
  await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.evaluateOnNewDocument(()=>{
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});
   Object.defineProperty(navigator,'canShare',{value:()=>true});
   Object.defineProperty(navigator,'share',{value:async payload=>{window.__shared={name:payload.files[0].name,type:payload.files[0].type,size:payload.files[0].size};}});
  });
  page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>requests.push({method:r.method(),url:r.url()}));
  const text=selector=>page.$eval(selector,e=>e.textContent);
  const visible=selector=>page.waitForSelector(selector,{visible:true});
  const hidden=selector=>page.waitForSelector(selector,{hidden:true});
  const click=async selector=>{await visible(selector);await page.click(selector);};
  async function overflow(){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.evaluate(()=>JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth})));}
  async function shot(name){await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
  async function savePng(name){
   await click('#save-card');await visible('#save-dialog[open]');
   await page.waitForFunction(()=>document.getElementById('save-preview').src.startsWith('data:image/png'));
   const src=await page.$eval('#save-preview',e=>e.src);
   fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(src.split(',')[1],'base64'));
  }
  await page.goto(base,{waitUntil:'networkidle0'});await visible('#start');await overflow();await shot('home-390');ok('390px home');
  await click('#start');assert.ok(await page.$eval('#next',e=>e.disabled));
  for(let i=0;i<data.questions.length;i++){
   await click('.option:nth-child(1)');assert.equal(await text('#answer-reaction'),data.questions[i].options[0].reaction);
   if(i===0)await shot('question-390');
   if(i===1){await click('#previous');assert.ok(await page.$eval('input[name=answer]',e=>e.checked));await click('#next');}
   await click('#next');
  }
  await visible('#tie-view');assert.ok((await page.$$('#tie-options button')).length>1);
  await click('#tie-options button');await visible('#result-view');assert.match(await text('#result-context'),/本次鉴定/);await visible('#tie-disclosure');
  const chips=await page.$$('.secondary-chip');if(chips.length){await chips[chips.length-1].click();}
  await visible('#combo-card');const ownUrl=page.url();
  await click('#result-library');assert.equal((await page.$$('.library-card')).length,12);await shot('library-390');
  await click('#library-return');assert.equal(page.url(),ownUrl);ok('12-question journey, all immediate reactions, back, primary tie, secondary and restore');
  await click('#share-result');let copied=await page.evaluate(()=>window.__copied);assert.match(copied,/我测完认领了/);assert.ok(copied.includes('/with/'));assert.ok(!copied.includes('answers='));ok('share text preserves primary and secondary, no raw answers');
  await savePng('own-combo-card');await click('#share-image');assert.equal((await page.evaluate(()=>window.__shared)).type,'image/png');await click('#close-save');await hidden('#save-dialog[open]');ok('dual-portrait PNG and prepared-file native-share mock');
  await click('#result-mix');await visible('#mix-view');await page.select('#mix-primary','other-receivables');await page.select('#mix-secondary','provision');await overflow();await shot('mix-390');
  await page.select('#mix-secondary','other-receivables');assert.ok(await page.$eval('#mix-open',e=>e.disabled));await visible('#mix-error');
  await page.select('#mix-secondary','provision');await click('#mix-open');assert.match(await text('#result-context'),/自由混搭/);assert.equal(await text('#combo-title'),'全自动接锅预警机');
  await click('#share-result');assert.match(await page.evaluate(()=>window.__copied),/自由混搭/);await shot('combo-390');await savePng('mix-combo-card');await click('#close-save');ok('mixing, self-pair rejection, non-test labeling, custom combo PNG');
  await page.reload({waitUntil:'networkidle0'});assert.match(await text('#result-context'),/朋友分享/);assert.equal(await text('#secondary-name'),'预计负债');assert.equal((await page.$$('.secondary-chip')).length,0);ok('shared combo reload is not falsely a recipient assessment');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}}}));await click('#share-result');await visible('#copy-fallback');assert.ok((await page.$eval('#copy-text',e=>e.value)).includes('/with/'));ok('clipboard permission denial fallback');
  for(const width of [320,360,390,768,1280]){
   await page.setViewport({width,height:900,deviceScaleFactor:1,isMobile:width<721,hasTouch:width<721});
   for(const route of ['','#library','#mix','#type/substance','#type/other-receivables/with/provision']){await page.goto(base+route,{waitUntil:'load'});await overflow();}
   if(width===1280){await page.goto(base);await shot('home-1280');}
  }
  ok('no horizontal overflow: five viewports across five views');
  await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  for(const type of data.types){
   await page.goto(base+'#type/'+type.id,{waitUntil:'load'});await visible('#result-name');assert.equal(await text('#result-name'),type.name);await hidden('#secondary-section');
   await savePng('card-'+type.id);await click('#close-save');
  }
  ok('all 12 single portrait cards export PNG');
  const counts=Object.fromEntries(data.types.map(t=>[t.id,0]));
  const answers=data.questions.map(q=>{
   const target=q.options.findIndex(o=>o.type==='other-receivables');
   if(target>=0){counts['other-receivables']++;return target;}
   const option=q.options.map((o,i)=>({id:o.type,i})).sort((a,b)=>counts[a.id]-counts[b.id])[0];
   counts[option.id]++;return option.i;
  });
  await page.goto(base);await click('#start');
  for(const answer of answers){await click('.option:nth-child('+(answer+1)+')');await click('#next');}
  await visible('#result-view');assert.equal(await text('#result-name'),'其他应收款');await hidden('#tie-disclosure');
  const candidateCount=(await page.$$('.secondary-chip')).length;
  if(candidateCount){
   await hidden('#combo-card');await click('.secondary-chip');await visible('#combo-card');
   await click('.secondary-chip');await hidden('#combo-card');await click('.secondary-chip');
  }else await visible('#combo-card');
  ok('sole winner, optional secondary tie selection and unselection');
  for(const a of data.types)for(const b of data.types){
   if(a.id===b.id)continue;
   await page.evaluate(hash=>{location.hash=hash;},`#type/${a.id}/with/${b.id}`);
   await page.waitForFunction((name,pair)=>document.getElementById('result-name').textContent===name&&document.getElementById('secondary-name').textContent===pair,{},a.name,b.name);
   assert.equal(await text('#combo-title'),data.combinations[[a.id,b.id].sort().join('|')].title);
  }
  ok('132 directed links resolve to 66 bespoke pairings');
  for(const route of ['#type/goodwill/with/goodwill','#type/goodwill/with/unknown','#type/unknown']){await page.goto(base+route,{waitUntil:'load'});await visible('#home-view');}
  ok('invalid, unknown and self-pair routes return safely home');
  assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.method==='GET'&&(r.url.startsWith(base)||r.url.startsWith('data:image/png;'))));ok('zero browser errors; local GETs only, no answer uploads');
  fs.writeFileSync(path.join(out,'qa-summary.json'),JSON.stringify({checks,errors,requests:requests.length,browser:await browser.version(),nativeShare:'mocked; not a real iPhone share sheet',realIPhoneTested:false},null,2));
  console.log('COMPLETE '+checks.length+' groups; screenshots '+out);
 } finally {if(browser)await browser.close();server.close();}
})().catch(err=>{console.error(err.stack);server.close();process.exitCode=1;});
