'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const data=require('../content.js'),manifest=require('../scripts/portrait-manifest.json');
const root=path.resolve(__dirname,'..');
const replacements=['cash','bank-deposits','long-term-prepaid','payroll'];
test('all 16 active portraits have exact WebP bytes and one-to-one provenance records',()=>{
 assert.equal(manifest.schemaVersion,1);assert.equal(manifest.entries.length,16);
 assert.deepEqual(manifest.entries.map(x=>x.id).sort(),data.types.map(x=>x.id).sort());
 const hashes=new Set();
 for(const t of data.types){
  const row=manifest.entries.find(x=>x.id===t.id);assert.equal(t.image,'./'+row.path);
  assert.match(row.path,/^assets\/characters\/[a-z-]+\.webp$/);
  const raw=fs.readFileSync(path.join(root,row.path));
  assert.equal(raw.subarray(0,4).toString(),'RIFF');assert.equal(raw.subarray(8,12).toString(),'WEBP');
  assert.equal(raw.length,row.bytes);assert.ok(raw.length<=100000);
  assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),row.sha256);
  hashes.add(row.sha256);
  if(row.origin==='project-ai-assisted-existing'){assert.equal(row.width,384);assert.ok([332,336,352].includes(row.height));}
  assert.equal(t.artStatus,'illustrated');assert.ok(t.imageAlt.length>10);
  assert.match(row.sourceCommit,/^[a-f0-9]{40}$/);
 }
 assert.equal(hashes.size,16);
});
test('four replacements retain source hashes without stale Humaaans attribution',()=>{
 for(const id of replacements){
  const row=manifest.entries.find(x=>x.id===id),t=data.types.find(x=>x.id===id);
  assert.equal(row.origin,'project-ai-assisted-2026-09-09');
  assert.equal(row.path,'assets/characters/'+id+'.webp');
  assert.deepEqual([row.width,row.height],[768,672]);
  assert.match(row.sourcePngSha256,/^[a-f0-9]{64}$/);
  for(const field of ['artCredit','artSource','artLicense'])assert.equal(t[field],undefined);
 }
 assert.equal(manifest.entries.filter(x=>x.origin==='project-ai-assisted-existing').length,12);
});
test('four retired licensed SVG originals still match their immutable source records',()=>{
 const archive=require('../scripts/art-sources.json');assert.equal(archive.entries.length,4);
 for(const item of archive.entries){
  const raw=fs.readFileSync(path.join(root,item.target));
  const hash=crypto.createHash('sha1').update(Buffer.from('blob '+raw.length+'\0')).update(raw).digest('hex');
  assert.equal(hash,item.blobSha);
  assert.ok(!data.types.some(t=>t.image==='./'+item.target));
 }
 const credits=fs.readFileSync(path.join(root,'ART-CREDITS.md'),'utf8');
 assert.match(credits,/Pablo Stanley/);assert.match(credits,/CC BY 4.0/);
});
