(function(root){
    'use strict';
    function createStore(storage,sessionStorage){
        const memory=new Map(),modes=new Map();
        const sessionKey=key=>'stylemix_session:'+key;
        return {
            get(key,fallback){
                if(memory.has(key))return memory.get(key);
                try{const raw=sessionStorage?.getItem(sessionKey(key));if(raw){const value=JSON.parse(raw);modes.set(key,'session');return value;}}catch{}
                try{const raw=storage?.getItem(key);modes.set(key,storage?'local':'memory');return raw?JSON.parse(raw):fallback;}catch{modes.set(key,'memory');return fallback;}
            },
            set(key,value){
                memory.set(key,value);
                try{
                    if(!storage)throw new Error('unavailable');
                    storage.setItem(key,JSON.stringify(value));modes.set(key,'local');
                    try{sessionStorage?.removeItem?.(sessionKey(key));}catch{}
                    return true;
                }catch{
                    try{if(!sessionStorage)throw new Error('unavailable');sessionStorage.setItem(sessionKey(key),JSON.stringify(value));modes.set(key,'session');}
                    catch{modes.set(key,'memory');}
                    return false;
                }
            },
            invalidate(key){memory.delete(key);modes.delete(key);},
            mode(key){return modes.get(key)||'memory';}
        };
    }
    function selection(value){
        if(!value||value.version!==1)return {occasion:'school',selectedItemIds:[]};
        return {occasion:['school','work','presentation','social'].includes(value.occasion)?value.occasion:'school',selectedItemIds:[...new Set((Array.isArray(value.selectedItemIds)?value.selectedItemIds:[]).filter(x=>typeof x==='string'&&x.length<100))]};
    }
    const key='stylemix_selection_v1';
    function readSelection(storage){return selection(createStore(storage).get(key,null));}
    function writeSelection(storage,state){const clean=selection({...state,version:1});return {persisted:createStore(storage).set(key,{...clean,version:1})};}
    let storage,sessionStorage;try{storage=root.localStorage;}catch{}try{sessionStorage=root.sessionStorage;}catch{}
    root.OutfitStorage={createStore,readSelection,writeSelection,selection,key,store:createStore(storage,sessionStorage)};
    if(typeof module!=='undefined')module.exports=root.OutfitStorage;
})(typeof window!=='undefined'?window:globalThis);
