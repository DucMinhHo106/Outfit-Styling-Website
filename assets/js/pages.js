'use strict';
document.addEventListener('DOMContentLoaded',function(){
    const page=document.body.dataset.page;
    const config={ao:['ao','aoGrid'],quan:['quan','quanGrid'],'phu-kien':['phu-kien','featuredGrid'],'yeu-thich':[null,'likedGrid']}[page];
    if(!config)return;
    const grid=document.getElementById(config[1]);
    const search=document.getElementById('searchInput');
    let data=[],color='all';
    function message(text,retry){
        grid.replaceChildren();const box=document.createElement('div');box.className='catalog-message';
        const p=document.createElement('p');p.textContent=text;box.append(p);
        const button=document.createElement('button');button.className='btn btn--ghost';button.textContent=retry?'Thử lại':'Xóa điều kiện';
        button.addEventListener('click',retry||(()=>{color='all';if(search)search.value='';buildColors();render();}));box.append(button);grid.append(box);
    }
    function buildColors(){
        window.buildColorFilterBar([...new Set(data.flatMap(x=>[x.color||''].flat()).filter(Boolean))],config[1],data);
        document.querySelectorAll('#colorFilterBar .filter-chip').forEach(btn=>btn.classList.toggle('active',btn.dataset.color===color));
    }
    function render(){
        const filtered=window.CatalogFilter.filterItems(data,{query:search?.value,color});
        const count=document.getElementById('productCount');if(count)count.textContent=filtered.length;
        const likedCount=document.getElementById('likedCount');if(likedCount)likedCount.textContent=data.length;
        const empty=document.getElementById('emptyState');if(empty)empty.style.display=data.length?'none':'flex';
        grid.style.display=(!data.length&&page==='yeu-thich')?'none':'';
        grid.replaceChildren();
        if(!filtered.length&&(data.length||page!=='yeu-thich'))message('Không tìm thấy mẫu phù hợp. Hãy đổi từ khóa hoặc xóa điều kiện.');
        filtered.forEach((item,i)=>{
            const card=window.createOutfitCard(item,(i%4)*.06);
            if(page==='phu-kien'){card.classList.add('featured-card');card.querySelector('img').classList.add('featured-card__img');}
            grid.append(card);
        });
        window.initScrollReveal?.();
    }
    window.applyCatalogFilters=function(nextColor){color=nextColor;render();};
    search?.addEventListener('input',render);
    async function load(){
        if(page==='yeu-thich'){data=window.getLikedOutfits();buildColors();render();return;}
        message('Đang tải bộ sưu tập…',load);
        try{
            const response=await fetch('./assets/data/'+config[0]+'.json');if(!response.ok)throw new Error('HTTP '+response.status);
            const result=await response.json();if(!Array.isArray(result))throw new Error('Invalid catalog');
            data=result;buildColors();render();
        }catch{message('Chưa tải được bộ sưu tập. Kiểm tra kết nối rồi thử lại.',load);}
    }
    if(page==='yeu-thich'){
        document.addEventListener('stylemix:likes-changed',load);
        window.clearAllLiked=function(){if(confirm('Xóa tất cả bộ yêu thích?')){window.saveLikedList([]);window.updateNavLikeBadge();window.showToast('Đã xóa danh sách yêu thích');}};
    }
    document.querySelectorAll('.filter-btn').forEach(btn=>{
        btn.removeAttribute('onclick');btn.setAttribute('aria-expanded','true');
        btn.addEventListener('click',()=>{const bar=document.querySelector('.color-filter-bar');if(bar){bar.hidden=!bar.hidden;btn.setAttribute('aria-expanded',String(!bar.hidden));}});
    });
    load();
});
