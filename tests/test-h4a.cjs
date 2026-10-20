'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'../index-standalone.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].filter(x=>x[1].trim());assert.equal(scripts.length,208);
const storage=new Map(),node=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
const c={Math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},alert(){},confirm(){return false},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:node(),body:node(),documentElement:node(),createElement:node,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
for(const x of scripts)try{new vm.Script(x[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=c.VSim;assert.equal(NS.RELEASE_VERSION,'V0.34H4B');assert.equal(NS.TECH_ORDER.length,43);assert(NS.V034H4A&&NS.V034H4&&NS.V034H2A.verify().ok);
const w=new NS.World(19,19),v=w.activeVillages[0],t=w.map.get(v.coreTileId);
const baseline=JSON.stringify(w.serialize()),empty=NS.V034H4A.diagnosis(w);assert.equal(empty.format,'vilob-h4a-storage-diagnostic-v1');assert.equal(JSON.stringify(w.serialize()),baseline,'diagnostic must not mutate world');
// Existing excess is observational, not counted as newly created by H4A.
t.stocks.stone=1000;
assert(NS.V034H4B&&NS.V034H4B.boundaryFactor===.7);
const after=NS.V034H4A.diagnosis(w);assert(after.settlements.some(s=>s.tiles.some(x=>x.id===t.id&&x.stocks.stone===1000)));
assert(after.observations.some(r=>r.settlementId&&r.type==='NEWLY_OBSERVED_OVERFLOW'),'newly observed excess must be recorded without claiming a source');
const z=NS.V034H4A.watch(w,'TEST_FOLLOWUP',true);assert(z.records.length>0);
t.stocks.stone=1111;NS.V034H4A.watch(w,'TEST_FOLLOWUP',true);assert(NS.V034H4A.diagnosis(w).observations.some(r=>r.type==='OBSERVED_EXCESS_INCREASE'),'increase must be distinguishable');
t.stocks.stone=0;
const save=w.serialize();assert.equal(save.version,'V0.34H4B');for(const version of ['V0.34H4B','V0.34H4A','V0.34H4','V0.34H3','V0.34H2A','V0.34H2','V0.34H1','V0.34H0','V0.34G5']){const imported=NS.World.from({...save,version});assert.equal(imported.serialize().version,'V0.34H4B');assert(NS.V034C.inspect(imported).ok);}
NS.SaveSystem.save(w);assert(storage.has('village-observer-v034h4b'));assert.equal(NS.SaveSystem.load().serialize().version,'V0.34H4B');
storage.delete('village-observer-v034h4b');storage.set('village-observer-v034h4',JSON.stringify({...save,version:'V0.34H4'}));assert.equal(NS.SaveSystem.load().serialize().version,'V0.34H4B');
// Inter-nation border must be rendered last in pure black only in all mode.
let black=0;const ctx={save(){},restore(){},rect(){},clip(){},beginPath(){},moveTo(){},lineTo(){},stroke(){if(this.strokeStyle==='#000000')black++;}};
const a={x:0,y:0,ownerId:0},b={x:1,y:0,ownerId:1},stub={world:{map:{width:2,height:1,tiles:[a,b],at:(x,y)=>y===0?[a,b][x]:undefined}},_mapGeom:{cell:20,ox:0,oy:0},h1BoundaryMode:'all',q:()=>({getContext:()=>ctx})};
NS.V034H4A.strokeNationalBorders(stub);assert.equal(black,1);
stub.h1BoundaryMode='selected';NS.V034H4A.strokeNationalBorders(stub);assert.equal(black,1,'selected mode must remain unchanged');
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,tech:43,scriptCount:scripts.length,storageReadOnly:true,diagnosticExport:true,observedIncrease:true,loadVersions:9,nationalBorderBlack:true}));
