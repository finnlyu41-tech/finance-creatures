"""Verified source-only update for this public quiz; runs on an isolated release branch."""
from pathlib import Path
import base64,hashlib,json,lzma
ROOT=Path.cwd()
encoded=''.join((ROOT/('maintenance/v05-part-'+str(i)+'.b64')).read_text() for i in range(1,5))
raw=base64.b64decode(encoded,validate=True)
assert hashlib.sha256(raw).hexdigest()=='98a9bca8fcaa8c4a5f41daef49c060333c59b897a7d71f00b4da4803b7b2c9cb'
p=json.loads(lzma.decompress(raw))
allowed={'.gitignore','ART-CREDITS.md','README.md','assets/characters/README.md','content.js','engine.js','app.js','index.html','style.css','session.js','requirements-qa.txt','scripts/art-sources.json','scripts/prepare-assets.py','scripts/check-live.py','tests/engine.test.cjs','tests/session.test.cjs','tests/browser.test.py'}
assert set(p['files'])==allowed
assert p['delete']==['v4.css','tests/offline-browser.test.py']
prepared={}
for name,item in p['files'].items():
 path=(ROOT/name).resolve();assert path.is_relative_to(ROOT)
 if 'new' in item:
  assert not path.exists(),'New path already exists: '+name
  text=item['new']
 else:
  raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==item['base'],'Base file changed: '+name
  old=raw.decode();text=list(old) if item['mode']=='chars' else old.splitlines(True)
  for start,end,new in reversed(item['edits']):text[start:end]=[new]
  text=''.join(text)
 final=text.encode();assert hashlib.sha256(final).hexdigest()==item['sha256'],name
 prepared[path]=final
for path,raw in prepared.items():path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(raw)
for name in p['delete']:(ROOT/name).unlink()
print('Applied 17 verified public source files; removed two superseded files.')
