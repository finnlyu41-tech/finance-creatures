"""Validate current portraits and retained licensed SVG sources; prepare type-only QR codes.
No image-generation service is used. All runtime assets are hosted with the site.
"""
from pathlib import Path
import base64, hashlib, json, re, subprocess, time, urllib.request
import xml.etree.ElementTree as ET
import qrcode
import cv2
from qrcode.image.svg import SvgPathImage
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'scripts/art-sources.json').read_text())
def git_sha(raw):return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
def fetch_blob(sha):
    url='https://api.github.com/repos/Calinou/humaaans/git/blobs/'+sha
    error=None
    for attempt in range(3):
        try:
            request=urllib.request.Request(url,headers={'User-Agent':'finance-creatures-asset-build','Accept':'application/vnd.github+json'})
            with urllib.request.urlopen(request,timeout=25) as r: payload=json.load(r)
            raw=base64.b64decode(payload['content'])
            if git_sha(raw)!=sha:raise ValueError('Downloaded SVG hash mismatch')
            return raw
        except Exception as exc:
            error=exc
            if attempt<2:time.sleep(attempt+1)
    raise RuntimeError('Licensed asset unavailable: '+sha) from error
for item in manifest['entries']:
    path=ROOT/item['target'];path.parent.mkdir(parents=True,exist_ok=True)
    raw=path.read_bytes() if path.exists() else fetch_blob(item['blobSha'])
    assert git_sha(raw)==item['blobSha'], 'Unexpected artwork changes: '+item['target']
    root=ET.fromstring(raw)
    for n in root.iter():
        assert n.tag.split('}')[-1] not in ('script','foreignObject')
        for k,v in n.attrib.items():
            assert not k.lower().startswith('on')
            if k.split('}')[-1]=='href':assert v.startswith('#')
    path.write_bytes(raw)
    print('Verified archived licensed source:',item['id'],item['blobSha'])
data=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./content.js')))"],cwd=ROOT,text=True))
portraits=json.loads((ROOT/'scripts/portrait-manifest.json').read_text())
assert portraits['schemaVersion']==1
assert len(portraits['entries'])==16
by_id={item['id']:item for item in portraits['entries']}
assert len(by_id)==16 and set(by_id)=={t['id'] for t in data['types']}
for t in data['types']:
    item=by_id[t['id']]
    assert item['path']==t['image'].removeprefix('./')
    assert item['path'].startswith('assets/characters/') and item['path'].endswith('.webp')
    path=(ROOT/item['path']).resolve()
    assert path.is_relative_to(ROOT.resolve())
    raw=path.read_bytes()
    assert hashlib.sha256(raw).hexdigest()==item['sha256'], 'Portrait hash mismatch: '+t['id']
    assert len(raw)==item['bytes'] and len(raw)<=100000, 'Portrait size mismatch: '+t['id']
    assert raw[:4]==b'RIFF' and raw[8:12]==b'WEBP', 'Invalid WebP: '+t['id']
    image=cv2.imread(str(path));assert image is not None, 'Undecodable portrait: '+t['id']
    assert (image.shape[1],image.shape[0])==(item['width'],item['height'])
    if item['origin']=='project-ai-assisted-2026-09-09':
        assert (item['width'],item['height'])==(768,672), 'Unexpected replacement dimensions: '+t['id']
    else:
        assert item['width']==384 and item['height'] in (332,336,352), 'Unexpected preserved original dimensions: '+t['id']
    assert t['artStatus']=='illustrated' and t['imageAlt']
    assert item['origin'] in ('project-ai-assisted-existing','project-ai-assisted-2026-09-09')
print('Verified 16 active WebP portraits: exact hashes, sizes, dimensions and source records.')
qrdir=ROOT/'assets/qr';qrdir.mkdir(exist_ok=True)
for t in data['types']:
    assert re.fullmatch(r'[a-z]+(?:-[a-z]+)*',t['id'])
    assert (ROOT/t['image']).is_file(), 'Missing portrait: '+t['id']
    url=data['siteUrl']+'#v4/type/'+t['id']
    code=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=4,box_size=10)
    code.add_data(url);code.make(fit=True)
    code.make_image(image_factory=SvgPathImage).save(qrdir/(t['id']+'.svg'))
print('All 16 portraits present. Generated 16 QR codes containing only public type links.')
