(function(root){
    'use strict';
    function updateSelection(state,action){
        const next={occasion:state.occasion,selectedItemIds:[...state.selectedItemIds]};
        if(action.type==='occasion'&&['school','work','presentation','social'].includes(action.value))next.occasion=action.value;
        if(action.type==='toggle'&&typeof action.id==='string')next.selectedItemIds=next.selectedItemIds.includes(action.id)?next.selectedItemIds.filter(id=>id!==action.id):[...next.selectedItemIds,action.id];
        if(action.type==='clear')next.selectedItemIds=[];
        return next;
    }
    if(typeof module!=='undefined')module.exports={updateSelection};
    if(!root.document)return;
    document.addEventListener('DOMContentLoaded',function(){
        const host=document.getElementById('wardrobe');if(!host)return;
        const status=document.getElementById('wardrobeStatus'),picker=document.getElementById('itemPicker'),results=document.getElementById('outfitResults'),selected=document.getElementById('selectedItems');
        const occasion=document.getElementById('outfitOccasion'),clear=document.getElementById('clearSelection'),find=document.getElementById('findOutfits'),retry=document.getElementById('retryOutfits');
        const store=root.OutfitStorage.store;
        let state=root.OutfitStorage.selection(store.get(root.OutfitStorage.key,null)),catalog=[],templates=[];
        let itemsById=new Map(),templatesById=new Map();
        const text=(tag,content,className)=>{const el=document.createElement(tag);el.textContent=content;if(className)el.className=className;return el;};
        function change(action){
            state=updateSelection(state,action);
            const persisted=store.set(root.OutfitStorage.key,{...state,version:1});
            document.getElementById('selectionStorageNote').textContent=persisted?'Lựa chọn và bộ đã lưu chỉ nằm trên trình duyệt này.':store.mode(root.OutfitStorage.key)==='session'?'Chưa lưu lâu dài; lựa chọn được giữ trong tab này đến khi đóng tab.':'Trình duyệt chặn lưu trữ. Lựa chọn chỉ giữ trên trang hiện tại, sẽ mất khi tải lại hoặc rời trang.';
            renderSelection();renderResults();
        }
        function renderSelection(){
            occasion.value=state.occasion;
            picker.querySelectorAll('[data-item-id]').forEach(button=>{
                const active=state.selectedItemIds.includes(button.dataset.itemId);button.setAttribute('aria-pressed',String(active));button.classList.toggle('active',active);
            });
            selected.replaceChildren();
            for(const id of state.selectedItemIds){
                const item=itemsById.get(id);if(!item)continue;
                const button=text('button',item.name+' ×','filter-chip active');button.type='button';button.setAttribute('aria-label','Bỏ '+item.name);button.addEventListener('click',()=>change({type:'toggle',id}));selected.append(button);
            }
            clear.disabled=!state.selectedItemIds.length;
        }
        function makePicker(){
            picker.replaceChildren();
            const groups=[['Áo',['tee','shirt','polo']],['Quần / chân váy',['trousers','skirt']],['Giày',['shoes']],['Đầm liền',['dress']]];
            groups.forEach(([label,types],index)=>{
                const group=document.createElement('details');group.className='picker-group';group.open=index===0;
                group.append(text('summary',label));const list=document.createElement('div');list.className='picker-items';
                for(const item of catalog.filter(x=>types.includes(x.type))){
                    const button=document.createElement('button');button.type='button';button.className='picker-item';button.dataset.itemId=item.id;button.setAttribute('aria-pressed','false');
                    const image=document.createElement('img');image.src=item.image;image.alt='';image.loading='lazy';image.width=70;image.height=70;
                    button.append(image,text('span',item.name));button.addEventListener('click',()=>change({type:'toggle',id:item.id}));list.append(button);
                }
                group.append(list);picker.append(group);
            });
        }
        function slotNames(template,slotIds){return slotIds.map(id=>{const slot=template.requiredSlots.find(s=>s.id===id);return slot.acceptedItemIds.map(item=>itemsById.get(item)?.name).filter(Boolean).join(' hoặc ');});}
        function notesFor(template,entry){
            if(!entry)return ['Chưa đối chiếu với đồ bạn có. Chọn các món ở trên để kiểm tra.'];
            const notes=[];
            if(entry.matchedSlotIds.length)notes.push('Đã có: '+slotNames(template,entry.matchedSlotIds).join(', ')+'.');
            for(const sub of entry.substitutions)notes.push('Thay '+slotNames(template,[sub.slotId])[0]+' bằng '+itemsById.get(sub.itemId).name+'.');
            if(entry.missingSlotIds.length)notes.push('Cần kiểm tra thêm: '+slotNames(template,entry.missingSlotIds).join(', ')+'.');
            return notes;
        }
        function renderCard(template,entry){
            const card=document.createElement('article');card.className='template-card';card.dataset.templateId=template.id;
            const image=document.createElement('img');image.src=template.image;image.alt='Minh họa '+template.items.join(', ');image.loading='lazy';image.width=660;image.height=410;
            const body=document.createElement('div');body.className='template-card__body';body.append(text('h4',template.title));
            for(const note of notesFor(template,entry))body.append(text('p',note,'template-card__note'));
            const actions=document.createElement('div');actions.className='template-card__actions';
            const detail=text('button','Xem cách phối','btn btn--ghost btn--sm');detail.type='button';detail.addEventListener('click',()=>root.openOutfitModal({...template,fitNotes:notesFor(template,entry)}));
            const save=text('button',root.isOutfitSaved(template.id)?'Đã lưu':'Lưu bộ','btn btn--ghost btn--sm');save.type='button';save.dataset.saveTemplate=template.id;save.setAttribute('aria-pressed',String(root.isOutfitSaved(template.id)));save.setAttribute('aria-label','Lưu bộ '+template.title);
            save.addEventListener('click',()=>root.saveOutfitLocal(template));actions.append(detail,save);body.append(actions);card.append(image,body);return card;
        }
        function renderResults(){
            results.replaceChildren();const hasSelection=state.selectedItemIds.length>0;
            let count=0;
            if(!hasSelection){
                const list=templates.filter(t=>t.occasions.includes(state.occasion));count=list.length;
                results.append(text('h3','Bộ mẫu theo hoàn cảnh — chưa đối chiếu tủ đồ','result-heading'));
                const grid=document.createElement('div');grid.className='template-grid';list.forEach(t=>grid.append(renderCard(t,null)));results.append(grid);
            }else{
                const matches=root.OutfitMatcher.matchTemplates(templates,state.selectedItemIds,state.occasion);
                for(const [key,label] of [['ready','Có thể mặc ngay'],['alternatives','Có thể thay thế'],['incomplete','Còn thiếu món']]){
                    const list=matches[key];count+=list.length;if(!list.length)continue;
                    results.append(text('h3',label+' · '+list.length,'result-heading'));
                    const grid=document.createElement('div');grid.className='template-grid';grid.dataset.matchGroup=key;list.forEach(entry=>grid.append(renderCard(templatesById.get(entry.templateId),entry)));results.append(grid);
                }
            }
            status.textContent=count?`${count} bộ mẫu · ${state.selectedItemIds.length} món đã chọn. ${hasSelection?'Kết quả đã đối chiếu với lựa chọn.':'Chọn ít nhất một món để xem gợi ý phù hợp.'}`:'Chưa có bộ phù hợp. Bạn có thể đổi hoàn cảnh hoặc bỏ bớt lựa chọn; các điều kiện hiện tại được giữ nguyên.';
        }
        async function load(){
            picker.replaceChildren();results.replaceChildren();retry.hidden=true;find.disabled=true;status.textContent='Đang tải thư viện phối đồ…';
            try{
                const responses=await Promise.all(['item-catalog','outfit-templates'].map(async name=>{const response=await fetch('./assets/data/'+name+'.json');if(!response.ok)throw new Error('HTTP '+response.status);return response.json();}));
                [catalog,templates]=responses;
                if(root.OutfitData.validateTemplates(templates,catalog).length)throw new Error('Thư viện không hợp lệ');
                templates=templates.map(template=>({...template,alternativeNotes:root.OutfitData.describeAlternatives(template,catalog)}));
                itemsById=new Map(catalog.map(x=>[x.id,x]));templatesById=new Map(templates.map(x=>[x.id,x]));state.selectedItemIds=state.selectedItemIds.filter(id=>itemsById.has(id));
                makePicker();renderSelection();renderResults();find.disabled=false;
            }catch{status.textContent='Chưa tải được thư viện. Hãy kiểm tra kết nối và thử lại.';retry.hidden=false;}
        }
        occasion.addEventListener('change',()=>change({type:'occasion',value:occasion.value}));clear.addEventListener('click',()=>change({type:'clear'}));retry.addEventListener('click',load);
        find.addEventListener('click',()=>{renderResults();results.scrollIntoView({behavior:root.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});results.focus({preventScroll:true});});
        document.addEventListener('stylemix:likes-changed',()=>{results.querySelectorAll('[data-save-template]').forEach(button=>{const saved=root.isOutfitSaved(button.dataset.saveTemplate);button.textContent=saved?'Đã lưu':'Lưu bộ';button.setAttribute('aria-pressed',String(saved));});});
        load();
    });
})(typeof window!=='undefined'?window:globalThis);
