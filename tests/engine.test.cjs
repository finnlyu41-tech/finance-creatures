'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const d=require('../content.js'),e=require('../engine.js');
const expected={cash:['库存现金','1001'],construction:['在建工程','1604'],'bank-deposits':['银行存款','1002'],'fixed-asset':['固定资产','1601'],receivables:['应收账款','1122'],'long-term-prepaid':['长期待摊费用','1801'],allowance:['坏账准备','1231'],provision:['预计负债','2801'],revenue:['主营业务收入','6001'],goodwill:['商誉','1711'],windfall:['营业外收入','6301'],rd:['研发支出','5301'],'other-receivables':['其他应收款','1221'],payroll:['应付职工薪酬','2211'],'management-expense':['管理费用','6602'],'accumulated-depreciation':['累计折旧','1602']};
test('exactly 16 verified account names, unique IDs/numbers/patterns/codes',()=>{
 assert.equal(d.types.length,16);for(const key of ['id','name','accountNo','pattern','code'])assert.equal(new Set(d.types.map(t=>t[key])).size,16);
 for(const t of d.types){assert.deepEqual([t.name,t.accountNo],expected[t.id]);assert.match(t.pattern,/^[01]{4}$/);assert.equal(t.code,d.axes.map((a,i)=>t.pattern[i]==='0'?a.left.code:a.right.code).join(''));assert.ok(t.definition&&t.category);}
});
test('all four axes have five equally weighted questions; every question has two choices each side',()=>{
 assert.equal(d.axes.length,4);assert.equal(d.questions.length,20);assert.equal(new Set(d.questions.map(q=>q.id)).size,20);
 for(const a of d.axes)assert.equal(d.questions.filter(q=>q.axis===a.id).length,5);
 for(const q of d.questions){assert.equal(q.options.length,4);assert.equal(q.options.filter(o=>o.side===0).length,2);assert.equal(q.options.filter(o=>o.side===1).length,2);for(const o of q.options){assert.ok(o.text&&o.reaction);assert.ok(!('type' in o));}}
});
test('all 16 characters reachable uniquely using their four axis patterns',()=>{
 for(const t of d.types){const answers=d.questions.map(q=>q.options.findIndex(o=>o.side===Number(t.pattern[d.axes.findIndex(a=>a.id===q.axis)])));const r=e.scoreAnswers(answers);assert.equal(r.typeId,t.id);assert.equal(r.code,t.code);assert.equal(r.pattern,t.pattern);assert.equal(r.axes.length,4);assert.ok(!('winners' in r));assert.ok(!('secondary' in r));for(const a of r.axes)assert.equal(a.votes,5);}
});
test('all 32 possible five-vote patterns have a non-zero majority',()=>{
 for(let mask=0;mask<32;mask++){const sides=Array.from({length:5},(_,i)=>(mask>>i)&1);const left=sides.filter(s=>s===0).length;assert.notEqual(left,5-left);}
});
test('10,000 deterministic answer sequences yield one valid outcome with totals five on all axes',()=>{
 let seed=174521;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed>>>24)&3;};
 for(let i=0;i<10000;i++){const a=Array.from({length:20},rand),copy=a.slice(),r=e.scoreAnswers(a);assert.deepEqual(r,e.scoreAnswers(a));assert.deepEqual(a,copy);assert.ok(expected[r.typeId]);for(const v of r.axes){assert.equal(v.left+v.right,5);assert.notEqual(v.left,v.right);assert.equal(v.side,v.left>v.right?0:1);}}
});
test('sparse, incomplete, fractional, string, boolean, out-of-range and oversized answers rejected',()=>{
 for(const invalid of [null,{},[],Array(19).fill(0),Array(21).fill(0),Array(20),Array(20).fill(null),Array(20).fill('0'),Array(20).fill(true),Array(20).fill(-1),Array(20).fill(4),Array(20).fill(.5)])assert.throws(()=>e.scoreAnswers(invalid));
 const a=Array(20).fill(0);delete a[7];assert.throws(()=>e.scoreAnswers(a));
});
test('revising a prior answer recalculates from scratch, without old type counts',()=>{
 const a=Array(20).fill(0),before=e.scoreAnswers(a);a[0]=1;const after=e.scoreAnswers(a);assert.notEqual(before.pattern,after.pattern);assert.deepEqual(after,e.scoreAnswers(a));
});
test('16 new single links round trip; legacy combinations are archived, never re-scored',()=>{
 for(const t of d.types)assert.deepEqual(e.parseFragment(e.resultFragment(t.id)),{view:'result',typeId:t.id});
 for(const h of ['#mix','#type/provision','#type/depreciated','#type/provision/with/goodwill','#type/unknown'])assert.deepEqual(e.parseFragment(h),{view:'legacy'});
 for(const h of ['#v4/type/unknown','#v4/type/provision/with/goodwill','#v4/type/../../','<script>','#v4/type/provision?fake=1'])assert.deepEqual(e.parseFragment(h),{view:'home'});
 assert.throws(()=>e.resultFragment('unknown'));
});
test('all 16 accounts have unique local portraits, QR assets, complete text and source credits',()=>{
 const images=new Set();let licensed=0;
 for(const t of d.types){
  assert.ok(t.paragraphs.length>=3);assert.ok(t.roasts.length>=5);assert.equal(t.equipment.length,3);
  assert.ok(t.tagline&&t.nickname&&t.catchphrase&&t.nemesis&&t.habitat);
  assert.ok(t.image&&t.qr);images.add(t.image);
  assert.ok(fs.existsSync(path.resolve(__dirname,'..',t.image)),t.image);
  assert.ok(fs.existsSync(path.resolve(__dirname,'..',t.qr)),t.qr);
  assert.doesNotMatch(t.imageAlt,/待补|占位/);
  if(t.artStatus==='licensed'){licensed++;assert.match(t.artCredit,/Pablo Stanley/);assert.match(t.artLicense,/creativecommons/);}else assert.equal(t.artStatus,'illustrated');
 }
 assert.equal(images.size,16);assert.equal(licensed,4);
});
test('retired multi-outcome UI and APIs no longer exist',()=>{
 const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');for(const id of ['tie-view','secondary-section','secondary-options','mix-view'])assert.ok(!html.includes('id="'+id+'"'));
 assert.equal(e.secondaryCandidates,undefined);assert.equal(e.combination,undefined);assert.equal(d.combinations,undefined);
 assert.match(html,/20 道题/);assert.match(html,/16 个会计科目/);
});
