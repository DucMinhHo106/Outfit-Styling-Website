(function(root){
    'use strict';
    function createStore(storage){
        const memory=new Map();
        return {
            get(key,fallback){
                if(memory.has(key))return memory.get(key);
                try{const raw=storage?.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}
            },
            set(key,value){
                memory.set(key,value);
                try{if(!storage)return false;storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}
            },
            invalidate(key){memory.delete(key);}
        };
    }
    function selection(value){
        if(!value||value.version!==1)return {occasion:'school',selectedItemIds:[]};
        return {occasion:['school','work','presentation','social'].includes(value.occasion)?value.occasion:'school',selectedItemIds:[...new Set((Array.isArray(value.selectedItemIds)?value.selectedItemIds:[]).filter(x=>typeof x==='string'&&x.length<100))]};
    }
    const key='stylemix_selection_v1';
    function readSelection(storage){return selection(createStore(storage).get(key,null));}
    function writeSelection(storage,state){const clean=selection({...state,version:1});return {persisted:createStore(storage).set(key,{...clean,version:1})};}
    let storage;try{storage=root.localStorage;}catch{}
    root.OutfitStorage={createStore,readSelection,writeSelection,selection,key,store:createStore(storage)};
    if(typeof module!=='undefined')module.exports=root.OutfitStorage;
})(typeof window!=='undefined'?window:globalThis);
