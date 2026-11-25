const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const file=path.join(__dirname,'../assets/js/catalog-filter.js');
function getFilter(){const ctx={};if(fs.existsSync(file))vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);assert.equal(typeof ctx.CatalogFilter?.filterItems,'function');return ctx.CatalogFilter.filterItems;}
const items=[{id:'white',name:'Áo sơ mi trắng',tag:'Minimal',color:'white'},{id:'black',name:'Áo đen',tag:'Streetwear',color:'black'}];
test('search and color intersect rather than replace each other',()=>{const filter=getFilter();assert.equal(filter(items,{query:'trắng',color:'black'}).length,0);assert.equal(filter(items,{query:'ao',color:'black'})[0].id,'black');});
test('Vietnamese accents, localized color names and unknown words',()=>{const filter=getFilter();assert.equal(filter(items,{query:'trang'})[0].id,'white');assert.equal(filter(items,{query:'zzzzz'}).length,0);});
test('apparel category color and garment type apply together',()=>{const ctx={};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);assert.equal(typeof ctx.CatalogFilter.filterGarments,'function');const data=[{id:'one',category:'pants',type:'jeans',color:'blue'},{id:'two',category:'pants',type:'trousers',color:'black'},{id:'three',category:'tops',type:'tee',color:'blue'}];assert.equal(ctx.CatalogFilter.filterGarments(data,{category:'pants',color:'blue',type:'jeans'})[0].id,'one');assert.equal(ctx.CatalogFilter.filterGarments(data,{category:'pants',color:'black',type:'jeans'}).length,0);});
test('uppercase Vietnamese D-stroke normalizes like lowercase',()=>{const filter=getFilter();assert.equal(filter(items,{query:'ĐEN'})[0].id,'black');});
