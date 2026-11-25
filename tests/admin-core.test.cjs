const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const filename = path.join(__dirname, '../assets/js/admin-core.js');
const core = fs.existsSync(filename) ? require(filename) : {};
const reviewed = () => ({id:'photo-001',sourceUrl:'https://www.pinterest.com/pin/123456/',category:'pants',type:'jeans',color:'blue',name:'Quần jeans xanh',approved:true,fullBodyConfirmed:true,image:'outfit.jpg'});

test('library photo resolves a safe same-origin photo and preserves source', () => {
  assert.equal(typeof core.resolveLibraryPhoto,'function');
  assert.deepEqual(core.resolveLibraryPhoto({id:'library-1',image:'./assets/photos/outfit.jpg',sourceUrl:'https://www.pinterest.com/pin/123/'},'https://style.test/project/admin.html'),{id:'library-1',url:'https://style.test/project/assets/photos/outfit.jpg',filename:'outfit.jpg',sourceUrl:'https://www.pinterest.com/pin/123/'});
});

test('library photo rejects arbitrary URLs, traversal and unsafe sources', () => {
  assert.equal(typeof core.resolveLibraryPhoto,'function');
  for (const image of ['https://evil.test/assets/photos/a.jpg','https://style.test/project/assets/photos/a.jpg','//evil.test/a.jpg','javascript:alert(1)','./assets/photos/../private.jpg','./assets/photos/%2e%2e/private.jpg','./assets/photos/sub/a.jpg','./assets/photos/a.jpg?url=x','./assets/photos/a.svg','./assets/photos/a%2fsecret.jpg']) {
    assert.throws(()=>core.resolveLibraryPhoto({id:'library-1',image,sourceUrl:'https://pinterest.com/pin/123/'},'https://style.test/project/admin.html'), image);
  }
  assert.throws(()=>core.resolveLibraryPhoto({id:'library-1',image:'./assets/photos/a.jpg',sourceUrl:'javascript:alert(1)'},'https://style.test/admin.html'));
});

test('candidate generation follows pants, tops, outerwear and excludes unrelated groups', () => {
  assert.equal(typeof core.candidatesFor, 'function');
  assert.deepEqual(Object.keys(core.taxonomy), ['pants','tops','outerwear']);
  for (const group of Object.keys(core.taxonomy)) {
    const candidates = core.candidatesFor(group);
    assert.ok(candidates.length > 0);
    assert.ok(candidates.every(x => x.category === group && x.label.includes(x.colorEnglish) && x.label.includes(x.typeEnglish)));
    assert.equal(new Set(candidates.map(x=>x.label)).size,candidates.length);
  }
  assert.throws(()=>core.candidatesFor('accessories'));
});

test('maps only finite known model results in selected group and ranks top candidates', () => {
  assert.equal(typeof core.mapCandidates,'function');
  const pants = core.candidatesFor('pants');
  const top = core.candidatesFor('tops')[0];
  const mapped = core.mapCandidates([{label:pants[0].label,score:0.2},{label:pants[1].label,score:0.7},{label:top.label,score:0.9},{label:'imaginary',score:1},{label:pants[2].label,score:NaN}], 'pants');
  assert.deepEqual(mapped.map(x=>[x.type,x.color,x.score]),[[pants[1].type,pants[1].color,0.7],[pants[0].type,pants[0].color,0.2]]);
});

test('a beige vest can be suggested and reviewed only in outerwear', () => {
  const candidates=core.mapCandidates([{label:'a person wearing beige sleeveless vest',score:0.65}], 'outerwear');
  assert.equal(candidates.length,1);
  assert.equal(candidates[0].type,'vest');
  assert.equal(candidates[0].color,'beige');
  const record={...reviewed(),category:'outerwear',type:'vest',color:'beige',name:'Áo gile be'};
  assert.deepEqual(core.exportRecords([record]),{version:1,records:[record]});
  assert.ok(core.validateRecord({...record,category:'tops'}).length);
  assert.deepEqual(core.mapCandidates([{label:'a person wearing beige sleeveless vest',score:0.65}],'pants'),[]);
});

test('source accepts HTTPS Pinterest pin URLs and rejects unsafe or misleading URLs', () => {
  assert.equal(typeof core.validateRecord,'function');
  for (const sourceUrl of ['https://pinterest.com/pin/123/','https://www.pinterest.com/pin/123/','https://vn.pinterest.com/pin/123/']) {
    assert.deepEqual(core.validateRecord({...reviewed(),sourceUrl}), []);
  }
  for (const sourceUrl of ['javascript:alert(1)','http://pinterest.com/pin/123/','https://pinterest.com.evil.test/pin/123/','https://evil.test/?pinterest.com','https://user:pass@pinterest.com/pin/123/','https://pinterest.com/search/pins/','https://pinterest.com:444/pin/123/']) {
    assert.ok(core.validateRecord({...reviewed(),sourceUrl}).length,sourceUrl);
  }
});

test('export requires explicit approval, full-body/source confirmation and known labels', () => {
  assert.equal(typeof core.exportRecords,'function');
  for (const patch of [{approved:false},{fullBodyConfirmed:false},{category:'accessories'},{category:'shoes'},{type:'fleece'},{color:'invisible'},{image:'../private.jpg'},{image:'<img>.jpg'},{id:''},{name:''}]) {
    assert.throws(()=>core.exportRecords([{...reviewed(),...patch}]));
  }
  assert.throws(()=>core.exportRecords([]));
  assert.throws(()=>core.exportRecords([reviewed(),reviewed()]));
});

test('export emits reviewed version 1 data and strips session URLs or extra fields', () => {
  assert.equal(typeof core.exportRecords,'function');
  assert.deepEqual(core.exportRecords([{...reviewed(),previewUrl:'blob:secret',file:{},score:0.9}]),{version:1,records:[reviewed()]});
});

test('local upload accepts supported image MIME up to 12 MiB and rejects unsafe inputs', () => {
  assert.equal(typeof core.validateFile,'function');
  assert.deepEqual(core.validateFile({type:'image/jpeg',size:12*1024*1024,name:'outfit.jpg'}),[]);
  for (const patch of [{type:'image/svg+xml'},{type:'text/html'},{size:0},{size:12*1024*1024+1},{name:'../outfit.jpg'}]) {
    assert.ok(core.validateFile({type:'image/png',size:500,name:'outfit.png',...patch}).length);
  }
});
