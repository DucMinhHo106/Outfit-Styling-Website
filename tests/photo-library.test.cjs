const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');
test('layered gray shirt outfit also requires the visible white inner top',()=>{
 const t=require('../assets/data/outfit-templates.json').find(x=>x.id==='photo-gray-trousers-blazer');
 assert.ok(t.requiredSlots.some(s=>s.id==='top'&&s.acceptedItemIds.includes('inner-white')));
 assert.ok(t.requiredSlots.some(s=>s.id==='outerwear'&&s.acceptedItemIds.includes('overshirt-gray')));
});
test('home colors include every visible catalog garment color',()=>{
 const templates=require('../assets/data/outfit-templates.json'),catalog=require('../assets/data/item-catalog.json');
 const filter=require('../assets/js/catalog-filter.js');
 for(const t of templates)for(const slot of t.requiredSlots)for(const id of slot.acceptedItemIds){
  const color=catalog.find(x=>x.id===id).color;
  assert.ok(filter.filterItems([t],{color}).length,`${t.id} missing ${color}`);
 }
});
test('every photo modal preserves the whole image',()=>{
 const css=fs.readFileSync(path.join(root,'assets/css/global.css'),'utf8');
 assert.match(css,/\.modal__img img\s*\{[^}]*object-fit:\s*contain/);
});
test('live catalog uses source-linked real photos and apparel groups only',()=>{
    const items=require('../assets/data/item-catalog.json');
    assert.deepEqual([...new Set(items.map(x=>x.category))].sort(),['outerwear','pants','tops']);
    for(const item of items){assert.match(item.image,/^\.\/assets\/photos\//);assert.match(item.sourceUrl,/^https:\/\/www\.pinterest\.com\/pin\/\d+\/$/);assert.ok(fs.existsSync(path.join(root,item.image)));assert.ok(!['shoes','accessory'].includes(item.type));}
});
test('every template uses a full-body photo and no accessory or shoe requirement',()=>{
    const templates=require('../assets/data/outfit-templates.json'),catalog=require('../assets/data/item-catalog.json');const byId=new Map(catalog.map(x=>[x.id,x]));
    assert.equal(templates.length,12);
    for(const t of templates){assert.match(t.image,/^\.\/assets\/photos\//);assert.equal(t.fullBodyReviewed,true);assert.match(t.sourceUrl,/pinterest.com\/pin\//);for(const slot of t.requiredSlots)for(const id of slot.acceptedItemIds)assert.ok(['pants','tops','outerwear'].includes(byId.get(id)?.category));}
});
