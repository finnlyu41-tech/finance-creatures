/* Current-tab recovery only. Never uploaded or included in share URLs. */
(function(root){
  'use strict';
  const data=typeof module!=='undefined'&&module.exports?require('./content.js'):root.FinanceContent;
  const KEY='finance-creatures-session',TTL=24*60*60*1000;
  function validate(value,now=Date.now()){
    try {
      const s=typeof value==='string'?JSON.parse(value):value;
      if(!s||s.contentVersion!==data.contentVersion||!Array.isArray(s.answers)||s.answers.length!==data.questions.length)return null;
      for(let i=0;i<s.answers.length;i++)if(s.answers[i]!==null&&(!Number.isInteger(s.answers[i])||s.answers[i]<0||s.answers[i]>=data.questions[i].options.length))return null;
      if(!Number.isInteger(s.index)||s.index<0||s.index>=data.questions.length||typeof s.completed!=='boolean')return null;
      if(!Number.isFinite(s.updatedAt)||s.updatedAt>now+300000||now-s.updatedAt>TTL)return null;
      if(s.completed&&s.answers.some(a=>a===null))return null;
      return {contentVersion:data.contentVersion,answers:s.answers.slice(),index:s.index,completed:s.completed,updatedAt:s.updatedAt};
    }catch(_){return null;}
  }
  const api={KEY,TTL,validate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FinanceSession=api;
})(globalThis);
