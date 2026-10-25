'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
function engine(seed){let state=seed;const rand=Object.create(Math);rand.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};const storage=new Map(),el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},textContent:'',innerHTML:''});const FixedDate=class extends Date{static now(){return 1770000000000;}};const ctx={console,Math:rand,Map,Set,WeakMap,JSON,Date:FixedDate,Blob,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,performance:require('node:perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''},URL};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}return{NS:ctx.VSim,storage};}
(async()=>{
const a=engine(177),b=engine(99),c=engine(781);const H=a.NS.V035H1A;
assert.equal(a.NS.RELEASE_VERSION,'V0.35H1C3');assert.equal(a.NS.TECH_ORDER.length,43);
const wa=H.createWorld(),wb=b.NS.V035H1A.createWorld();
assert.equal(wa.villages.length,7);assert.equal(wa.map.width,19);assert.equal(H.fingerprint(wa),b.NS.V035H1A.fingerprint(wb));assert.equal(wa.v35h1a.rngState,wb.v35h1a.rngState);
assert.notEqual(H.fingerprint(wa),H.fingerprint(H.createWorld('perf-19x19-b-v1')));
for(let i=0;i<60;i++){wa.advanceOneDay();wb.advanceOneDay();if(i%30===29){assert.equal(H.fingerprint(wa),b.NS.V035H1A.fingerprint(wb),'seed parity '+i);assert.equal(wa.v35h1a.rngState,wb.v35h1a.rngState);}}
const exported=H.scenario(wa),blob=JSON.stringify(exported);assert.equal(exported.world.version,'V0.35H1B1A');const one=await b.NS.V035H1A.importCheckpoint(blob),two=await c.NS.V035H1A.importCheckpoint(blob);
assert.equal(b.NS.V035H1A.fingerprint(one),c.NS.V035H1A.fingerprint(two),'two imports equal');
for(let i=0;i<90;i++){one.advanceOneDay();two.advanceOneDay();if(i%30===29){assert.equal(b.NS.V035H1A.fingerprint(one),c.NS.V035H1A.fingerprint(two),'checkpoint repeat '+i);assert.equal(one.v35h1a.rngState,two.v35h1a.rngState);}}
const loaded=b.NS.World.from(JSON.parse(JSON.stringify(one.serialize())));assert.equal(loaded.v35h1a.seed,'perf-19x19-a-v1');assert.equal(loaded.v35h1a.rngState,one.v35h1a.rngState);
b.NS.SaveSystem.save(one);assert(b.storage.has('village-observer-v035h1b1a'));assert.equal(b.NS.SaveSystem.load().v35h1a.seed,'perf-19x19-a-v1');
const corrupted=JSON.parse(blob);corrupted.perf.rngState=123;await assert.rejects(c.NS.V035H1A.importCheckpoint(JSON.stringify(corrupted)),/RNG/);
assert.equal(b.NS.V034D2.audit(one).ok,true);assert.equal(b.NS.V034D2A.audit(one).ok,true);
console.log(JSON.stringify({status:'PASS',version:a.NS.RELEASE_VERSION,initialNaturalDays:60,repeatCheckpointDays:90,map:'19x19',nations:7,techCount:43,checkpointValidation:true}));
})().catch(e=>{console.error(e);process.exit(1)});
