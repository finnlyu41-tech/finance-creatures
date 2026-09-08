/* Four independently counted entertainment axes. Five binary votes per axis => no ties. */
(function(root){
  'use strict';
  const data=typeof module!=='undefined'&&module.exports?require('./content.js'):root.FinanceContent;
  const axisIds=new Set(data.axes.map(a=>a.id));
  const byPattern=new Map(data.types.map(t=>[t.pattern,t]));
  const byId=new Map(data.types.map(t=>[t.id,t]));
  if(data.axes.length!==4 || data.types.length!==16 || byPattern.size!==16) throw new Error('维度或科目映射不完整。');
  for(let i=0;i<16;i++) if(!byPattern.has(i.toString(2).padStart(4,'0'))) throw new Error('存在未映射的四维组合。');
  for(const axis of data.axes){
    const qs=data.questions.filter(q=>q.axis===axis.id);
    if(qs.length!==5) throw new Error('每个维度必须恰好五题。');
    for(const q of qs){
      if(q.options.length!==4 || q.options.filter(o=>o.side===0).length!==2 || q.options.filter(o=>o.side===1).length!==2) throw new Error('选项必须均衡对应两侧。');
    }
  }
  if(data.questions.length!==20 || data.questions.some(q=>!axisIds.has(q.axis))) throw new Error('题库维度不匹配。');
  function scoreAnswers(answers){
    if(!Array.isArray(answers)||answers.length!==data.questions.length) throw new TypeError('请先完成所有题目。');
    const votes=Object.fromEntries(data.axes.map(a=>[a.id,[0,0]]));
    for(let i=0;i<data.questions.length;i++){
      const choice=answers[i],q=data.questions[i];
      if(!Number.isInteger(choice)||choice<0||choice>=q.options.length) throw new TypeError('存在未完成或无效的答案。');
      votes[q.axis][q.options[choice].side]++;
    }
    const axes=data.axes.map(a=>{
      const [left,right]=votes[a.id];
      if(left+right!==5||left===right) throw new Error('计票校验未通过。');
      const side=left>right?0:1;
      return {id:a.id,left,right,side,votes:Math.max(left,right),lean:Math.max(left,right)===3?'略偏':Math.max(left,right)===4?'较偏':'明显偏'};
    });
    const pattern=axes.map(a=>a.side).join('');
    const type=byPattern.get(pattern);
    return {typeId:type.id,pattern,code:type.code,axes};
  }
  function resultFragment(id){
    if(!byId.has(id)) throw new TypeError('未知科目。');
    return '#v4/type/'+id;
  }
  function parseFragment(fragment){
    if(fragment==='#quiz') return {view:'quiz'};
    if(fragment==='#library') return {view:'library'};
    if(fragment==='#method') return {view:'method'};
    // Old scores cannot be reinterpreted with the new model. Do not silently rename results.
    if(fragment==='#mix'||/^#type\//.test(fragment)) return {view:'legacy'};
    const match=/^#v4\/type\/([a-z-]+)$/.exec(fragment);
    if(match&&byId.has(match[1])) return {view:'result',typeId:match[1]};
    return {view:'home'};
  }
  const api={scoreAnswers,resultFragment,parseFragment};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;else root.FinanceEngine=api;
})(globalThis);
