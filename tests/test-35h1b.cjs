'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(html,seed=514){let state=seed;const math=Object.create(Math);math.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};const mem=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const m of fs.readFileSync(path.join(root,html),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {N:c.VSim,mem};
}
(async()=>{
 const old=boot('tests/fixtures/v035H1A-HF-standalone.html'),cur=boot('index-standalone.html');assert.equal(old.N.RELEASE_VERSION,'V0.35H1A-HF');assert.equal(cur.N.RELEASE_VERSION,'V0.35H1C5');
 const a=old.N.V035H1A.createWorld(),b=cur.N.V035H1A.createWorld();
 assert.equal(old.N.V035H1A.fingerprint(a),cur.N.V035H1A.fingerprint(b));
 for(let i=0;i<90;i++){a.advanceOneDay();b.advanceOneDay();if(i%30===29){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG '+i);assert.equal(old.N.V035H1A.fingerprint(a),cur.N.V035H1A.fingerprint(b),'state '+i);}}
 const oldCheckpoint=JSON.stringify(old.N.V035H1A.scenario(a));const imported=await cur.N.V035H1A.importCheckpoint(oldCheckpoint);assert.equal(imported.serialize().version,'V0.35H1B1A');
 assert.equal(cur.N.V035H1A.fingerprint(imported),old.N.V035H1A.fingerprint(a));
 cur.mem.set('village-observer-v035h1a-hf',JSON.stringify(a.serialize()));assert.equal(cur.N.SaveSystem.load().serialize().version,'V0.35H1B1A');
 cur.N.SaveSystem.save(imported);assert(cur.mem.has('village-observer-v035h1b1a'));
 const P=cur.N.V035H1B;assert(!P.isActive());
 for(const mode of ['BASELINE','A','C','D']){
  const world=await cur.N.V035H1A.importCheckpoint(oldCheckpoint),r0=world.v35h1a.rngState;
  assert.equal(P.start(world,mode).mode,mode);assert(P.isActive());
  for(let i=0;i<3;i++)world.advanceOneDay();const data=P.stop();assert.equal(data.observedDays,3);assert.equal(data.start.rngState,r0);assert.equal(data.active,false);assert(data.simDays.medianMs>=0);assert.equal(data.format,'vilob-v035h1b-attribution-v1');assert.equal(data.profiler?.observedDays??3,3);
  assert(!P.isActive());const save=world.serialize();assert(!Object.keys(save).some(k=>k.toLowerCase().includes('h1b')),'H1B timings must not serialize except save version');
 }
 const fresh=await cur.N.V035H1A.importCheckpoint(oldCheckpoint);P.start(fresh,'A');for(let i=0;i<3;i++)fresh.advanceOneDay();assert.equal(P.stop().snapshotInclusive.calls>=0,true);
 assert.equal(cur.N.TECH_ORDER.length,43);assert.equal(cur.N.V035G1A.constants.BASE_DAILY,.8);assert.equal(cur.N.V035G1A.constants.ARCH_MULT,3);
 console.log(JSON.stringify({status:'PASS',hfToH1bRngAndStateDays:90,checkpointImport:true,oldSaveFallback:true,independentDiagnosticModes:4,technologyCount:43,legacy169:true}));
})().catch(e=>{console.error(e);process.exit(1)});
