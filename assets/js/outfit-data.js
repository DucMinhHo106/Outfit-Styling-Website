(function(root){
    'use strict';
    const occasions=['school','work','presentation','social'];
    function validateTemplates(templates,catalog){
        const errors=[];
        if(!Array.isArray(templates)||!Array.isArray(catalog))return ['Thư viện phải là danh sách.'];
        const ids=new Set(),itemIds=new Set();
        for(const item of catalog){
            if(!item||typeof item.id!=='string'||!item.name||!item.type||!item.color||itemIds.has(item.id)){errors.push('Món không hợp lệ hoặc trùng ID.');continue;}
            itemIds.add(item.id);
        }
        for(const t of templates){
            if(!t||typeof t.id!=='string'){errors.push('Bộ mẫu không hợp lệ.');continue;}
            if(ids.has(t.id))errors.push('Trùng ID bộ mẫu: '+t.id);ids.add(t.id);
            if(!t.title||!t.image||!t.imageSource||!Number.isFinite(t.editorialOrder)||!Array.isArray(t.instructions)||!t.instructions.length)errors.push('Thiếu nội dung/nguồn ảnh: '+t.id);
            if(!Array.isArray(t.occasions)||!t.occasions.length||t.occasions.some(x=>!occasions.includes(x)))errors.push('Hoàn cảnh không hợp lệ: '+t.id);
            if(!Array.isArray(t.requiredSlots)||!t.requiredSlots.length){errors.push('Thiếu món thiết yếu: '+t.id);continue;}
            const slotIds=new Set();
            for(const slot of t.requiredSlots){
                if(!slot||!slot.id||slotIds.has(slot.id)||!Array.isArray(slot.acceptedItemIds)||!slot.acceptedItemIds.length){errors.push('Vị trí món không hợp lệ: '+t.id);continue;}
                slotIds.add(slot.id);
                if([...(slot.acceptedItemIds||[]),...(slot.substituteItemIds||[])].some(x=>!itemIds.has(x)))errors.push('Món tham chiếu không tồn tại: '+t.id);
            }
        }
        return errors;
    }
    function describeAlternatives(template,catalog){
        const items=new Map(catalog.map(item=>[item.id,item.name]));
        return template.requiredSlots.filter(slot=>slot.substituteItemIds?.length).map(slot=>
            'Có thể thay '+slot.acceptedItemIds.map(id=>items.get(id)).join(' hoặc ')+' bằng '+slot.substituteItemIds.map(id=>items.get(id)).join(' hoặc ')+' (chưa xác nhận bạn có món thay thế).');
    }
    root.OutfitData={validateTemplates,describeAlternatives,occasions};
    if(typeof module!=='undefined')module.exports=root.OutfitData;
})(typeof window!=='undefined'?window:globalThis);
