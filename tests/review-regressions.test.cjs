const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const root=path.join(__dirname,'..');
test('same-document fragment link never starts a full-page transition',()=>{
    const events={};const anchor={getAttribute:()=> './index.html#wardrobe',addEventListener:(name,fn)=>events[name]=fn};const transition={style:{}};
    const document={getElementById:id=>id==='pageTransition'?transition:null,querySelector:()=>null,querySelectorAll:selector=>selector.startsWith('a[href]')?[anchor]:[],addEventListener:()=>{},dispatchEvent:()=>{}};
    const ctx={URL,document,location:{href:'https://example.test/index.html',pathname:'/index.html'},localStorage:{getItem:()=>null},IntersectionObserver:class{observe(){}},setTimeout:()=>0,clearTimeout:()=>{}};ctx.window=ctx;ctx.addEventListener=()=>{};
    vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/global.js'),'utf8'),ctx);
    let prevented=false;events.click?.({preventDefault(){prevented=true;}});assert.equal(prevented,false);assert.notEqual(transition.style.transform,'scaleY(1)');
});
test('all catalog pages bind their actual search input to the shared controller',()=>{
    for(const name of ['ao','quan','phu-kien','yeu-thich']){
        const html=fs.readFileSync(path.join(root,name+'.html'),'utf8');
        assert.match(html,/<input\b[^>]*\bid="searchInput"[^>]*>/,name+' search binding');assert.match(html,/<input\b[^>]*aria-label="[^"]+"[^>]*>/,name+' accessible label');
    }
});
test('favorites page never bypasses guarded storage with inline handlers',()=>{
    const html=fs.readFileSync(path.join(root,'yeu-thich.html'),'utf8');const inline=[...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');
    assert.doesNotMatch(inline,/localStorage|addEventListener\(['"]input/);
});
test('reference color filter stays next to reference gallery, after wardrobe suggestions',()=>{
    const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(html.indexOf('class="color-filter"')>html.indexOf('id="outfitResults"'));
});
