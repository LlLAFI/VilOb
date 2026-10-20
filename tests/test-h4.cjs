"use strict";
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
const src=fs.readFileSync(path.join(__dirname,'../index-standalone.html'),'utf8');
const scripts=[...src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].filter(x=>x[1].trim());assert.equal(scripts.length,208);
const elm=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},appendChild(){},classList:{add(){},remove(){},toggle(){}}});
const store=new Map(),c={Math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},alert(){},confirm(){return false},requestAnimationFrame(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:{head:elm(),body:elm(),documentElement:elm(),createElement:elm,addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
for(const s of scripts)try{new vm.Script(s[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=c.VSim;assert.equal(NS.RELEASE_VERSION,'V0.34H4B');assert.equal(NS.TECH_ORDER.length,43);assert(NS.V034H4&&NS.V034H3&&NS.V034H2A);
const w=new NS.World(19,19),v=w.activeVillages[0],t=w.map.get(v.coreTileId);assert(t&&t.ownerId!=null);
// Simulate legitimate historical overhang: an already-filled warehouse goes inactive.
t.addBuilding('warehouse');const i=t.buildings.length-1;t.buildingCondition[i]=100;const active=NS.V034D3.physicalCap(v,t.id,'stone');const potential=NS.V034H4.potentialStoneCap(t);assert(potential>=active-1e-7);
const floor=25;t.stocks.stone=Math.min(potential,Math.max(floor+9,active-1));t.buildingCondition[i]=0;
const rows=NS.V034H4.storageDiagnosis(w);assert(rows.some(r=>r.tileIds.includes(t.id)&&r.classification==='POSSIBLE_CAPACITY_CONTRACTION'),'expected capacity contraction diagnosis');
const stockBefore=t.stocks.stone,summary=NS.V034H4.audit(w);assert.equal(t.stocks.stone,stockBefore,'audit cannot change stock');assert(summary.storageSummary.possibleContraction>=1);assert(summary.warnings.some(x=>x.includes('POSSIBLE_CAPACITY_CONTRACTION')));
const full=NS.V034H4.potentialStoneCap(t);t.stocks.stone=full+10;assert(NS.V034H4.storageDiagnosis(w).some(x=>x.tileIds.includes(t.id)&&x.classification==='UNEXPLAINED_OVERFLOW'));
// Restore physical stock so serialization testing is isolated from synthetic corruption.
t.stocks.stone=0;
const save=w.serialize();assert.equal(save.version,'V0.34H4B');for(const ver of ['V0.34H4B','V0.34H4A','V0.34H4','V0.34H3','V0.34H2A','V0.34H2','V0.34H1','V0.34H0','V0.34G5']){let loaded=NS.World.from({...save,version:ver});assert.equal(loaded.serialize().version,'V0.34H4B',ver);assert(NS.V034C.inspect(loaded).ok,ver);}
NS.SaveSystem.save(w);assert(store.has('village-observer-v034h4b'));assert.equal(NS.SaveSystem.load().serialize().version,'V0.34H4B');
store.delete('village-observer-v034h4b');store.set('village-observer-v034h3',JSON.stringify({...save,version:'V0.34H3'}));assert.equal(NS.SaveSystem.load().serialize().version,'V0.34H4B');
console.log(JSON.stringify({result:'PASS',version:NS.RELEASE_VERSION,tech:43,scripts:scripts.length,loadVersions:7,capacityOverhang:'classified',unexplained:'classified',stockConserved:true}));
