"""Fetch four existing, licensed SVGs by immutable blob; prepare type-only QR codes.
No image-generation service is used. All runtime assets are hosted with the site.
"""
from pathlib import Path
import base64, hashlib, json, re, subprocess, time, urllib.request
import xml.etree.ElementTree as ET
import qrcode
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
    print('Verified existing artwork:',item['id'],item['blobSha'])
data=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./content.js')))"],cwd=ROOT,text=True))
qrdir=ROOT/'assets/qr';qrdir.mkdir(exist_ok=True)
for t in data['types']:
    assert re.fullmatch(r'[a-z]+(?:-[a-z]+)*',t['id'])
    assert (ROOT/t['image']).is_file(), 'Missing portrait: '+t['id']
    url=data['siteUrl']+'#v4/type/'+t['id']
    code=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=4,box_size=10)
    code.add_data(url);code.make(fit=True)
    code.make_image(image_factory=SvgPathImage).save(qrdir/(t['id']+'.svg'))
print('All 16 portraits present. Generated 16 QR codes containing only public type links.')
