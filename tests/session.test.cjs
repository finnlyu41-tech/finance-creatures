'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const d=require('../content.js'),s=require('../session.js');
const now=1760000000000,valid=()=>({contentVersion:d.contentVersion,answers:Array(20).fill(null),index:0,completed:false,updatedAt:now});
test('current-tab snapshots are versioned, copied and contain only expected fields',()=>{
 const a=valid();a.answers[0]=1;a.extra='not saved';const b=s.validate(JSON.stringify(a),now);assert.equal(b.answers[0],1);assert.equal(b.extra,undefined);b.answers[0]=0;assert.equal(a.answers[0],1);
});
test('expired, future, old-version, malformed and partial-completed states are rejected',()=>{
 for(const v of [null,'{',{}, {...valid(),contentVersion:'old'}, {...valid(),updatedAt:now-s.TTL-1},{...valid(),updatedAt:now+300001},{...valid(),index:-1},{...valid(),index:20},{...valid(),completed:true},{...valid(),answers:Array(20)},{...valid(),answers:Array(20).fill('0')}])assert.equal(s.validate(v,now),null);
});
test('completed recovery requires 20 legitimate choices; no stored scores are trusted',()=>{
 const v={...valid(),answers:Array(20).fill(0),completed:true,assessment:{typeId:'fake'}};const r=s.validate(v,now);assert.equal(r.completed,true);assert.equal(r.assessment,undefined);
});
