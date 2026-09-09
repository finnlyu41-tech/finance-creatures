"""Real browser QA against a local server, virtual file delivery, or the live Pages URL.
Native share is mocked; WebKit is not an iPhone hardware test.
"""
from pathlib import Path
import base64, functools, http.server, json, mimetypes, os, shutil, sys, threading
from urllib.parse import urlparse, unquote
from playwright.sync_api import expect, sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('QA_OUTPUT','/tmp/finance-v05-qa'));OUT.mkdir(parents=True,exist_ok=True)
ENGINE=os.environ.get('QA_BROWSER','chromium');VIRTUAL=os.environ.get('QA_VIRTUAL')=='1'
LIVE=os.environ.get('QA_URL');SMOKE=os.environ.get('QA_SMOKE')=='1'
server=None
if LIVE:BASE=LIVE.rstrip('/')+'/'
elif VIRTUAL:BASE='https://finance.test/'
else:
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
 threading.Thread(target=server.serve_forever,daemon=True).start();BASE='http://127.0.0.1:'+str(server.server_port)+'/'
MOCK="""window.__copies=[];window.__shares=[];
Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(t)=>window.__copies.push(t)}});
Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
Object.defineProperty(navigator,'share',{configurable:true,value:async(d)=>window.__shares.push({files:d.files?.length||0,title:d.title||'',text:d.text||'',url:d.url||''})});"""
report=[];errors=[];requests=[]
def ok(text):report.append(text);print('PASS',ENGINE,text,flush=True)
def wait_image_loaded(locator, expected_width=None):
 expect(locator).to_have_js_property('complete',True)
 if expected_width is None:expect(locator).not_to_have_js_property('naturalWidth',0)
 else:expect(locator).to_have_js_property('naturalWidth',expected_width)
with sync_playwright() as p:
 browser_type=getattr(p,ENGINE);launch={'headless':True}
 if ENGINE=='chromium':
  exe=os.environ.get('CHROME_PATH') or (shutil.which('chromium') if not Path(browser_type.executable_path).exists() else None)
  if exe:launch['executable_path']=exe
 browser=browser_type.launch(**launch)
 ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce',device_scale_factor=1)
 ctx.set_default_timeout(10000);ctx.add_init_script(MOCK)
 if VIRTUAL:
  def fulfill(route):
   path=unquote(urlparse(route.request.url).path).lstrip('/') or 'index.html';f=(ROOT/path).resolve()
   if not f.is_relative_to(ROOT) or not f.is_file():route.fulfill(status=404,body='Not found');return
   route.fulfill(status=200,path=str(f),content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
  ctx.route('https://finance.test/**',fulfill)
 def page_at(fragment=''):
  page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append((r.method,r.url)))
  page.goto(BASE+fragment,wait_until='networkidle');return page
 def screenshot(page,name):page.screenshot(path=str(OUT/(name+'-'+ENGINE+'.png')),full_page=True)
 def export(page,name,scan=False):
  page.click('#quick-save');page.wait_for_selector('#save-dialog[open]');wait_image_loaded(page.locator('#save-preview'),900)
  encoded=page.evaluate("""async()=>{const b=await(await fetch(document.getElementById('save-preview').src)).blob();return await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(b);});}""")
  raw=base64.b64decode(encoded);dest=OUT/(name+'-'+ENGINE+'.png');dest.write_bytes(raw)
  if scan:
   import cv2,numpy as np
   im=cv2.imdecode(np.frombuffer(raw,np.uint8),cv2.IMREAD_COLOR)
   value,_,_=cv2.QRCodeDetector().detectAndDecode(im)
   expected=page.evaluate('FinanceContent.siteUrl+FinanceEngine.resultFragment(document.querySelector("#result-art img")?FinanceContent.types.find(t=>t.name===document.getElementById("result-name").textContent).id:"")')
   assert value==expected,(name,value,expected)
  assert page.locator('#share-image').is_visible();page.click('#share-image');assert page.evaluate('window.__shares.at(-1).files')==1
  page.click('#close-save');assert page.locator('#save-preview').get_attribute('src') is None
  return dest
 try:
  page=page_at();assert page.locator('#home-view').is_visible();assert page.evaluate('FinanceContent.version')=='0.5.1'
  def contrast(selector):
   return page.locator(selector).evaluate("""el=>{const parse=v=>{const m=v.match(/\d+(?:\.\d+)?/g).slice(0,3).map(Number);return m.map(x=>{x/=255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)});},lum=v=>{const [r,g,b]=parse(v);return .2126*r+.7152*g+.0722*b;},bg=node=>{for(let n=node;n;n=n.parentElement){const v=getComputedStyle(n).backgroundColor;if(v&&v!=='rgba(0, 0, 0, 0)'&&v!=='transparent')return v}return getComputedStyle(document.documentElement).backgroundColor;},a=lum(getComputedStyle(el).color),b=lum(bg(el)),hi=Math.max(a,b),lo=Math.min(a,b);return (hi+.05)/(lo+.05)}""")
  for selector in ['.hero .eyebrow','.hero-meta span','.note-bottom','.home-bottom .mono','.tiny-seal','.site-footer>p','.site-footer summary','#clear-session','.footer-code']:
   assert contrast(selector)>=4.5,(selector,contrast(selector))
  brand=page.locator('#brand-home');assert brand.get_attribute('aria-label') is None
  brand_a11y=brand.aria_snapshot();assert '财会生物' in brand_a11y and '鉴定中心' in brand_a11y
  screenshot(page,'home-390');ok('home loads v0.5 over '+('live HTTPS' if LIVE else 'virtual HTTPS' if VIRTUAL else 'local HTTP'))
  page.click('#start');assert page.locator('#next').is_disabled();page.keyboard.press('1');assert page.locator('input[value="0"]').is_checked();assert page.locator('#progress').get_attribute('aria-valuenow')=='1';page.click('#next')
  page.reload(wait_until='networkidle');assert page.locator('#question-count').inner_text()=='02 / 20';assert page.locator('#next').is_disabled()
  page.click('#previous');assert page.locator('input[value="0"]').is_checked();page.click('#next')
  page.click('#pause-quiz');assert page.locator('#resume-banner').is_visible();page.reload(wait_until='networkidle');page.click('#resume');assert page.locator('#question-count').inner_text()=='02 / 20'
  ok('keyboard input, live progress, previous answer, reload and pause/resume preserve current-tab answers')
  for i in range(1,20):
   assert page.locator('#question-count').inner_text()==f'{i+1:02} / 20'
   page.locator('.option').nth(0).click();assert page.locator('#answer-reaction').inner_text();page.click('#next')
  assert page.locator('#result-name').inner_text()=='长期待摊费用';assert page.locator('#dimension-pills>span').count()==4;assert not page.locator('#dimension-details').evaluate('(n)=>n.open')
  source_link=page.locator('.account-note a');assert source_link.text_content()=='查看财政部科目说明';assert source_link.get_attribute('href').startswith('https://www.mof.gov.cn/')
  page.locator('#dimension-details summary').click();assert page.locator('.axis-track').count()==4
  page.reload(wait_until='networkidle');assert '唯一结果' in page.locator('#result-context').inner_text();assert page.locator('.axis-track').count()==4
  screenshot(page,'result-own-390');page.click('#quick-share');share=page.evaluate('window.__shares.at(-1)');assert share['files']==0 and '#v4/type/long-term-prepaid' in share['url'] and 'answers=' not in share['url'] and '长期待摊费用' in share['text']
  first_roast=page.locator('#result-roast').inner_text();assert ('鉴定员补刀：'+first_roast) in share['text']
  page.click('#next-roast');second_roast=page.locator('#result-roast').inner_text();assert second_roast!=first_roast
  page.click('#share-result');share=page.evaluate('window.__shares.at(-1)');assert ('鉴定员补刀：'+second_roast) in share['text'] and first_roast not in share['text']
  export(page,'long-term-prepaid-card',scan=True);ok('one automatic outcome, current roast in native text share, real four-axis counts, own-result recovery, QR decode and PNG/native-share mock')
  page.click('#result-library');assert page.locator('.library-card').count()==16
  assert page.locator('.library-card img').count()==16
  assert page.locator('.library-card img').evaluate_all("imgs=>imgs.every(img=>img.getAttribute('alt')==='')")
  page.fill('#library-search','DARN');assert page.locator('.library-card').count()==1
  page.select_option('#library-category','负债类');assert page.locator('#library-empty').is_visible()
  page.fill('#library-search','');assert page.locator('.library-card').count()==2
  page.select_option('#library-category','all');assert page.locator('.library-card').count()==16
  page.locator('[data-type="provision"]').click();assert '预览' in page.locator('#result-context').inner_text();assert page.locator('.axis-track').count()==0
  assert page.locator('#result-art img').get_attribute('alt')
  page.go_back(wait_until='networkidle');assert page.locator('#library-view').is_visible();page.click('#library-return');assert '唯一结果' in page.locator('#result-context').inner_text()
  page.click('#result-method');method_links=page.locator('.method-explanation a');assert method_links.nth(0).get_attribute('href').startswith('https://www.mof.gov.cn/');assert '（官方）' in method_links.nth(0).inner_text();assert '厦大会计发展研究中心' in method_links.nth(1).inner_text();page.click('#method-return');assert page.locator('.axis-track').count()==4
  ok('search/category filters, real browser Back, preview labeling and own-result return')
  data=page.evaluate('FinanceContent.types.map(t=>({id:t.id,name:t.name,pattern:t.pattern,image:t.image}))');page.close()
  for art_id in ['cash','bank-deposits','long-term-prepaid','payroll']:
   art_page=page_at('#v4/type/'+art_id)
   wait_image_loaded(art_page.locator('#result-art img'),768)
   assert art_page.locator('#result-art img').get_attribute('src')=='./assets/characters/'+art_id+'.webp'
   assert art_page.locator('#result-art img').get_attribute('alt')
   assert art_page.locator('#art-credit').is_hidden()
   assert art_page.locator('.licensed-portrait').count()==0
   screenshot(art_page,'unified-'+art_id+'-390')
   export(art_page,'unified-'+art_id+'-card',scan=True)
   art_page.close()
  ok('four replacement human portraits, accurate alt/attribution, four PNG cards and QR destinations')
  if not SMOKE:
   for t in data:
    page=page_at();page.click('#start')
    choices=page.evaluate('(pattern)=>FinanceContent.questions.map(q=>q.options.findIndex(o=>o.side===Number(pattern[FinanceContent.axes.findIndex(a=>a.id===q.axis)])))',t['pattern'])
    for choice in choices:page.locator('.option').nth(choice).click();page.click('#next')
    assert page.locator('#result-name').inner_text()==t['name'];assert page.locator('.axis-track').count()==4
    wait_image_loaded(page.locator('#result-art img'))
    assert page.locator('#result-art img').count()==1 and page.locator('#result-art .art-fallback').count()==0
    export(page,t['id']+'-card',scan=ENGINE=='chromium');page.close()
   ok('all 16 full answer journeys, 16 actual portraits, 16 PNG exports'+(' and 16 decoded QR destinations' if ENGINE=='chromium' else ''))
  page=page_at('#v4/type/provision');assert '朋友分享' in page.locator('#result-context').inner_text();assert page.locator('.axis-track').count()==0
  page.evaluate("window.__copies.length=0;Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('cancelled','AbortError')}})")
  page.click('#quick-share');assert page.evaluate('window.__copies.length')==0 and page.locator('#copy-fallback').is_hidden()
  page.evaluate("Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('blocked','NotAllowedError')}})")
  page.click('#quick-share');copy=page.evaluate('window.__copies.at(-1)');assert '#v4/type/provision' in copy and 'answers=' not in copy
  page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied')}}})")
  page.click('#quick-share');assert page.locator('#copy-fallback').is_visible() and '#v4/type/provision' in page.locator('#copy-text').input_value()
  ok('fresh shared links do not invent personal scores; share cancellation is silent and blocked share falls back to copy/manual text')
  for width in [320,360,390,430,768,1280,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for fragment in ['', '#library','#method','#v4/type/payroll','#v4/type/long-term-prepaid']:
    page.goto(BASE+fragment,wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,fragment)
   if width==390:page.goto(BASE+'#library',wait_until='networkidle');screenshot(page,'library-390')
  ok('seven widths × five views: no horizontal overflow')
  for h in ['#mix','#type/provision','#type/provision/with/goodwill']:
   page.goto(BASE+h,wait_until='networkidle');assert page.locator('#legacy-view').is_visible()
  for h in ['#v4/type/unknown','#v4/type/provision/with/goodwill']:
   page.goto(BASE+h,wait_until='networkidle');assert page.locator('#home-view').is_visible()
  ok('legacy links archived; invalid combinations cannot reintroduce multiple outcomes')
  page.close()
  blocked=ctx.new_page();blocked.add_init_script("Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('denied','SecurityError')}})")
  blocked.goto(BASE,wait_until='networkidle');blocked.click('#start');blocked.locator('.option').nth(1).click();assert '未允许' in blocked.locator('#quiz-storage').inner_text();blocked.close();ok('storage-disabled browser still answers without crashing and discloses no recovery')
  bad=page_at();bad.evaluate("sessionStorage.setItem(FinanceSession.KEY,'{bad-json')");bad.reload(wait_until='networkidle');assert bad.locator('#resume-banner').is_hidden();bad.close();ok('corrupt recovery data discarded safely')
  if not LIVE and ENGINE=='chromium' and os.environ.get('QA_NO_PREVIEW')!='1':
   page=page_at();page.set_viewport_size({'width':1200,'height':630});cast=page.locator('.cast-card img');assert cast.count()>0;[wait_image_loaded(cast.nth(i)) for i in range(cast.count())];page.screenshot(path=str(ROOT/'assets/social-preview.png'));page.close()
  assert not errors,errors
  assert all(m=='GET' and (url.startswith(BASE) or url.startswith(('data:','blob:'))) for m,url in requests),[(m,u) for m,u in requests if not u.startswith(BASE)]
  ok('no JavaScript exceptions, no third-party runtime requests, no answer uploads')
 finally:
  (OUT/('report-'+ENGINE+'.json')).write_text(json.dumps({'browser':ENGINE,'browserVersion':browser.version,'delivery':'live HTTPS' if LIVE else 'virtual files' if VIRTUAL else 'local HTTP','passed':report,'errors':errors,'nativeShare':'mocked; not physical iPhone/Safari','requests':len(requests)},ensure_ascii=False,indent=2))
  ctx.close();browser.close()
  if server:server.shutdown()
