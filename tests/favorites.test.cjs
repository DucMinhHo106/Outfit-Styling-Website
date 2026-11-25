const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
test('saving and removing publishes a change for the favorites list',()=>{
 const saved=new Map(),events=[];
 const doc={getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},dispatchEvent:e=>events.push(e.type)};
 const ctx={document:doc,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},location:{pathname:'/index.html'},IntersectionObserver:class{observe(){}},setTimeout:()=>0,clearTimeout:()=>{},Event:class{constructor(type){this.type=type;}}};ctx.window=ctx;ctx.addEventListener=()=>{};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../assets/js/global.js'),'utf8'),ctx);
 const outfit={id:'test',name:'Test',items:[]};ctx.saveOutfitLocal(outfit);ctx.saveOutfitLocal(outfit);
 assert.equal(events.filter(e=>e==='stylemix:likes-changed').length,2);
 assert.equal(JSON.parse(saved.get('stylemix_liked_outfits')).length,0);
});
