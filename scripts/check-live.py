"""Wait for Pages to serve the exact release, then verify every runtime asset.
No credentials or answer data are sent to the public site.
"""
from pathlib import Path
import hashlib,json,subprocess,time,urllib.request
ROOT=Path(__file__).resolve().parents[1]
data=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./content.js')))"],cwd=ROOT,text=True))
files=['index.html','style.css','content.js','engine.js','session.js','app.js','favicon.svg','assets/social-preview.png']
files += [t['image'].removeprefix('./') for t in data['types']]+[t['qr'].removeprefix('./') for t in data['types']]
base=data['siteUrl'];stamp=str(int(time.time()))
def fetch(name):
 request=urllib.request.Request(base+name+'?release='+data['version']+'&check='+stamp,headers={'User-Agent':'finance-creatures-release-check','Cache-Control':'no-cache'})
 with urllib.request.urlopen(request,timeout=20) as r:
  assert r.status==200
  return r.read()
expected=(ROOT/'content.js').read_bytes()
for attempt in range(40):
 try:
  if fetch('content.js')==expected:break
 except Exception:pass
 if attempt==39:raise RuntimeError('Pages did not serve this release within the verification window')
 time.sleep(10)
checks=[]
for name in files:
 last=None
 for attempt in range(3):
  try:
   raw=fetch(name);assert raw==(ROOT/name).read_bytes(), 'Content differs from checked-out source'
   checks.append({'path':name,'status':200,'sha256':hashlib.sha256(raw).hexdigest()});break
  except Exception as e:last=e;time.sleep(2)
 else:raise RuntimeError('Live asset check failed: '+name) from last
out=ROOT/'qa-output';out.mkdir(exist_ok=True)
(out/'live-assets.json').write_text(json.dumps({'version':data['version'],'url':base,'allExact':True,'checks':checks},ensure_ascii=False,indent=2))
print('LIVE_OK',data['version'],len(checks),'runtime files match byte-for-byte')
