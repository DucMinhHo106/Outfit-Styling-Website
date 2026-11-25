(function(root){
    'use strict';
    function matchTemplates(templates,selectedItemIds,occasion){
        const result={ready:[],alternatives:[],incomplete:[]};
        const selected=new Set(Array.isArray(selectedItemIds)?selectedItemIds:[]);
        if(!selected.size||!['school','work','presentation','social'].includes(occasion))return result;
        for(const template of templates){
            if(!template.occasions.includes(occasion))continue;
            const entry={templateId:template.id,matchedSlotIds:[],substitutions:[],missingSlotIds:[]};
            for(const slot of template.requiredSlots){
                if(slot.acceptedItemIds.some(id=>selected.has(id)))entry.matchedSlotIds.push(slot.id);
                else{
                    const substitute=(slot.substituteItemIds||[]).find(id=>selected.has(id));
                    if(substitute)entry.substitutions.push({slotId:slot.id,itemId:substitute});
                    else entry.missingSlotIds.push(slot.id);
                }
            }
            if(!entry.matchedSlotIds.length&&!entry.substitutions.length)continue;
            const group=entry.missingSlotIds.length?'incomplete':entry.substitutions.length?'alternatives':'ready';
            result[group].push(entry);
        }
        const order=new Map(templates.map(t=>[t.id,t.editorialOrder]));
        for(const group of Object.values(result))group.sort((a,b)=>a.missingSlotIds.length-b.missingSlotIds.length||a.substitutions.length-b.substitutions.length||order.get(a.templateId)-order.get(b.templateId)||a.templateId.localeCompare(b.templateId));
        return result;
    }
    root.OutfitMatcher={matchTemplates};
    if(typeof module!=='undefined')module.exports=root.OutfitMatcher;
})(typeof window!=='undefined'?window:globalThis);
