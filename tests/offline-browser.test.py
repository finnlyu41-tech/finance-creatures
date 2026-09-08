"""Offline DOM/canvas QA; all existing assets are embedded. No network navigation.
Use when an environment blocks loopback HTTP. Not a deployment, HTTP-cache,
native iOS-share, or full reload/history test. No browser policies are changed.
Requires playwright and an available Chromium; CHROME_PATH overrides detection.
"""
from pathlib import Path
import base64, json, os, re, shutil, sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/finance-v04-offline-qa');OUT.mkdir(parents=True,exist_ok=True)
def dataurl(p):
    return 'data:image/'+('svg+xml' if p.suffix=='.svg' else 'webp')+';base64,'+base64.b64encode(p.read_bytes()).decode()
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]*>',lambda m:'<style>'+(ROOT/re.search(r'\./([^?\"]+)',m.group(0)).group(1)).read_text()+'</style>',html)
html=re.sub(r'<link rel="icon"[^>]*>','',html)
html=re.sub(r'<script defer src="\./(?:content|engine|app)\.js[^\"]*"></script>','',html)
for image in (ROOT/'assets/characters').glob('*.webp'):
    html=html.replace('./assets/characters/'+image.name,dataurl(image))
content=(ROOT/'content.js').read_text()
for image in (ROOT/'assets/characters').glob('*.webp'):
    content=content.replace('./assets/characters/'+image.name,dataurl(image)).replace('"assets/characters/'+image.name+'"','"'+dataurl(image)+'"')
scripts='\n'.join([content,(ROOT/'engine.js').read_text(),(ROOT/'app.js').read_text()])
mock="""window.__copies=[];window.__share=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(t)=>window.__copies.push(t)}});Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,value:async(o)=>window.__share.push({count:o.files?.length})});"""
document=html.replace('</body>','<script>'+mock+'</script><script>'+scripts+'</script></body>')
report=[]
def passed(s):report.append(s);print('PASS',s,flush=True)
with sync_playwright() as p:
    exe=os.environ.get('CHROME_PATH') or shutil.which('chromium')
    b=p.chromium.launch(headless=True,executable_path=exe)
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=1,reduced_motion='reduce')
    ctx.set_default_timeout(8000)
    errors=[];requests=[]
    def load(fragment=''):
        page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append((r.method,r.url)))
        if fragment:page.evaluate('(f)=>location.hash=f',fragment)
        page.set_content(document,wait_until='load')
        return page
    stage=os.environ.get('QA_STAGE','all')
    if stage in ('all','flows'):
        page=load();assert page.locator('#home-view').is_visible()
        page.screenshot(path=str(OUT/'home-390.png'),full_page=True)
        passed('offline home renders 16-account, four-axis UI')
        page.click('#start');assert page.locator('#next').is_disabled()
        for i in range(20):
            assert page.locator('#question-count').inner_text()==f'{i+1:02} / 20'
            page.locator('.option').nth(0).click()
            assert page.locator('#answer-reaction').inner_text()!='你选你的，不用向领导解释。'
            if i==2:
                page.click('#previous');assert page.locator('input[value="0"]').is_checked();page.click('#next')
            page.click('#next')
        assert page.locator('#result-name').inner_text()=='长期待摊费用'
        assert page.locator('.axis-track').count()==4 and page.locator('#tie-view,#mix-view,#secondary-section').count()==0
        page.screenshot(path=str(OUT/'result-own-390.png'),full_page=True)
        passed('20-question UI journey: back, instant reactions, exactly one automatic outcome')
        page.click('#share-result');assert '#v4/type/long-term-prepaid' in page.evaluate('window.__copies.at(-1)')
        page.click('#save-card');page.wait_for_selector('#save-dialog[open]')
        assert page.locator('#save-preview').evaluate('(n)=>n.naturalWidth')==900
        u=page.locator('#save-preview').get_attribute('src');(OUT/'placeholder-card.png').write_bytes(base64.b64decode(u.split(',')[1]))
        # Offline about:blank is not a secure context; native sharing correctly stays hidden.
        assert page.locator('#share-image').is_hidden();page.click('#close-save')
        passed('single-account copy and 900px PNG; secure-context share gating preserved')
        page.click('#result-library');assert page.locator('.library-card').count()==16
        assert page.locator('.library-art img').count()==12 and page.locator('.library-art .art-placeholder').count()==4
        page.screenshot(path=str(OUT/'library-390.png'),full_page=True)
        page.locator('[data-type="goodwill"]').click();assert '预览' in page.locator('#result-context').inner_text()
        assert page.locator('.axis-track').count()==0 and '没有你的答题分数' in page.locator('#dimension-note').inner_text()
        page.click('#result-library');page.click('#library-return');assert page.locator('.axis-track').count()==4
        page.click('#result-method');assert page.locator('#method-view').is_visible();page.click('#method-return');assert page.locator('.axis-track').count()==4
        passed('16 previews, 12 portraits plus four labeled placeholders; own-score restoration')
        data=page.evaluate('FinanceContent.types.map(t=>({id:t.id,name:t.name,pattern:t.pattern}))');page.close()
        for t in data:
            print('CHECK journey',t['id'],flush=True)
            page=load();page.click('#start')
            choices=page.evaluate('(pattern)=>FinanceContent.questions.map(q=>q.options.findIndex(o=>o.side===Number(pattern[FinanceContent.axes.findIndex(a=>a.id===q.axis)])))',t['pattern'])
            for choice in choices:page.locator('.option').nth(choice).click();page.click('#next')
            assert page.locator('#result-name').inner_text()==t['name'] and page.locator('.axis-track').count()==4
            page.close()
        passed('16 x 20 real DOM answer clicks: every account reachable as the sole outcome')
        for t in data:
            page=load('#v4/type/'+t['id'])
            assert '朋友分享' in page.locator('#result-context').inner_text() and page.locator('.axis-track').count()==0
            page.click('#save-card');page.wait_for_selector('#save-dialog[open]')
            assert page.locator('#save-preview').evaluate('(n)=>n.naturalWidth')==900
            if t['id'] in ['accumulated-depreciation','payroll','provision']:
                u=page.locator('#save-preview').get_attribute('src');(OUT/(t['id']+'-card.png')).write_bytes(base64.b64decode(u.split(',')[1]))
            page.close()
        passed('16 shared-account previews have no invented scores; all 16 PNG exports succeed')
        assert not errors,errors
        (OUT/'flow-report.json').write_text(json.dumps({'mode':'offline embedded assets','groups':report,'pageErrors':errors},ensure_ascii=False,indent=2))
    if stage in ('all','layout'):
        page=load()
        for width in [320,390,430,768,1280]:
            print('CHECK width',width,flush=True)
            page.set_viewport_size({'width':width,'height':900})
            for fragment in ['', '#library','#method','#v4/type/payroll','#v4/type/accumulated-depreciation']:
                page.evaluate('(f)=>{location.hash=f;window.dispatchEvent(new HashChangeEvent("hashchange"))}',fragment)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,fragment)
                assert not page.evaluate('Array.from(document.images).some(i=>i.currentSrc && i.complete && !i.naturalWidth)')
                if width==1280 and not fragment:page.screenshot(path=str(OUT/'home-1280.png'),full_page=True)
        passed('five widths x five views: no horizontal overflow or broken embedded images')
        for fragment in ['#mix','#type/provision','#type/provision/with/goodwill','#type/materiality']:
            page.evaluate('(f)=>{location.hash=f;window.dispatchEvent(new HashChangeEvent("hashchange"))}',fragment)
            assert page.locator('#legacy-view').is_visible() and page.locator('#result-view').is_hidden()
        for fragment in ['#v4/type/no-such-account','#v4/type/provision/with/goodwill']:
            page.evaluate('(f)=>{location.hash=f;window.dispatchEvent(new HashChangeEvent("hashchange"))}',fragment)
            assert page.locator('#home-view').is_visible()
        passed('old links get legacy notice, invalid new routes are safe')
        page.evaluate('location.hash="#v4/type/provision";window.dispatchEvent(new HashChangeEvent("hashchange"))')
        page.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('denied')}}})")
        page.click('#share-result');assert page.locator('#copy-fallback').is_visible()
        passed('clipboard-denial fallback is selectable')
        assert not errors,errors
        assert all(m=='GET' and u.startswith(('data:','blob:')) for m,u in requests),requests
        passed('zero JavaScript errors; no network requests or answer uploads in offline rendering')
        (OUT/'layout-report.json').write_text(json.dumps({'mode':'offline embedded assets','groups':report,'pageErrors':errors,'limits':['HTTP navigation/cache and real reload not tested: loopback blocked by environment','No native iPhone/Safari share test','Native share not exercised in insecure offline context']},ensure_ascii=False,indent=2))
        ctx.close();b.close()
