(function(root){
    'use strict';
    const labels={white:'trắng',black:'đen',gray:'xám',blue:'xanh dương',brown:'nâu',red:'đỏ',orange:'cam',green:'xanh lá',pink:'hồng'};
    const normalize=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').trim();
    function filterItems(items,state={}){
        const query=normalize(state.query),color=state.color||'all';
        return items.filter(item=>{
            const colors=[item.color||''].flat();
            const words=[item.name,item.tag,...colors,...colors.map(c=>labels[c]||c)].map(normalize).join(' ');
            return (color==='all'||colors.includes(color))&&(!query||words.includes(query));
        });
    }
    function filterGarments(items,state={}){
        return items.filter(item=>(!state.category||item.category===state.category)&&(!state.color||state.color==='all'||item.color===state.color)&&(!state.type||state.type==='all'||item.type===state.type));
    }
    root.CatalogFilter={filterItems,filterGarments,normalize};
    if(typeof module!=='undefined')module.exports=root.CatalogFilter;
})(typeof window!=='undefined'?window:globalThis);
