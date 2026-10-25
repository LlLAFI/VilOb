'use strict';
// Hotfix validation against the archived H1A runtime. Gameplay must not diverge.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
function boot(htmlName,seed=135){let state=seed;const random=Object.create(Math);random.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};const mem=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){}});const FixedDate=class extends Date{static now(){return 1770000000000;}};
 const ctx={console,Math:random,Map,Set,WeakMap,JSON,Date:FixedDate,Blob,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,performance:require('node:perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},URL,localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);const content=fs.readFileSync(path.join(root,htmlName),'utf8');for(const m of content.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e};return{NS:ctx.VSim,mem,rng:()=>state};
}
(async()=>{
 const old=boot('tests/fixtures/v035H1A-standalone.html'),hf=boot('index-standalone.html');
 assert.equal(old.NS.RELEASE_VERSION,'V0.35H1A');assert.equal(hf.NS.RELEASE_VERSION,'V0.35H1C3');
 assert.equal(hf.NS.V035G1A.constants.BASE_DAILY,.8);assert.equal(hf.NS.V035G1A.constants.ARCH_MULT,3);assert.equal(hf.NS.TECH_ORDER.length,43);
 const a=old.NS.V035H1A.createWorld(),b=hf.NS.V035H1A.createWorld();
 assert.equal(a.v35h1a.rngState,b.v35h1a.rngState);assert.equal(old.NS.V035H1A.fingerprint(a),hf.NS.V035H1A.fingerprint(b));
 for(let i=0;i<60;i++){a.advanceOneDay();b.advanceOneDay();if(i%30===29){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG day '+(i+1));assert.equal(old.NS.V035H1A.fingerprint(a),hf.NS.V035H1A.fingerprint(b),'signature day '+(i+1));}}
 const oldCheckpoint=JSON.stringify(old.NS.V035H1A.scenario(a)),imported=await hf.NS.V035H1A.importCheckpoint(oldCheckpoint);
 assert.equal(imported.serialize().version,'V0.35H1B1A');assert.equal(imported.v35h1a.rngState,a.v35h1a.rngState);assert.equal(hf.NS.V035H1A.fingerprint(imported),old.NS.V035H1A.fingerprint(a));
 const fixture=fs.readFileSync(path.join(root,'tests/fixtures/v035H1A-perf19x19A-initial.json'),'utf8');
 const fromFixture=await hf.NS.V035H1A.importCheckpoint(fixture);assert.equal(fromFixture.serialize().version,'V0.35H1B1A');
 const f2=await hf.NS.V035H1A.importCheckpoint(JSON.stringify(hf.NS.V035H1A.scenario(fromFixture)));
 assert.equal(hf.NS.V035H1A.fingerprint(fromFixture),hf.NS.V035H1A.fingerprint(f2));
 hf.mem.set('village-observer-v035h1a',JSON.stringify(a.serialize()));assert.equal(hf.NS.SaveSystem.load().serialize().version,'V0.35H1B1A');
 hf.NS.SaveSystem.save(imported);assert(hf.mem.has('village-observer-v035h1b1a'));assert.equal(hf.NS.SaveSystem.load().serialize().version,'V0.35H1B1A');
 assert.equal(hf.NS.V034D2.audit(b).ok,true);assert.equal(hf.NS.V034D2A.audit(b).ok,true);
 console.log(JSON.stringify({status:'PASS',fromVersion:'V0.35H1A',toVersion:'V0.35H1B1A',parityDays:60,checkpointImportOld:true,fixtureImportOld:true,newCheckpointRoundtrip:true,oldSaveAutoMigration:true,legacy169:true}));
})().catch(e=>{console.error(e);process.exit(1)});
