'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const base=path.join(__dirname,'..');
const txt=fs.readFileSync(path.join(base,'index-standalone.html'),'utf8');
const hosted=fs.readFileSync(path.join(base,'dist/hosted/assets/legacy/091.js'),'utf8');
assert(!hosted.includes('renderEngagementHistoryC(this);'),'Old C duplicate statistics render must be disabled');
assert(hosted.includes('augmentTileC(this);'),'V33C actual battle-tile observer must be preserved');
assert(hosted.includes('NS.Telemetry.prototype.snapshot'),'Engagement metrics must not be removed');
const scripts=[...txt.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].filter(x=>x[1].trim());assert.equal(scripts.length,206);
let randCalls=0,seed=0x1234567;const rng=Object.create(Math);rng.random=()=>{randCalls++;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const e=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},appendChild(){},classList:{add(){},remove(){},toggle(){}}});
const storage=new Map(),c={Math:rng,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:e(),body:e(),documentElement:e(),createElement:e,addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},title:''}};
c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const m of scripts)try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(ex){if(!/onclick/.test(ex.message))throw ex;}
const NS=c.VSim;assert.equal(NS.RELEASE_VERSION,'V0.34H4');assert.equal(NS.TECH_ORDER.length,43);
assert(NS.V034H3&&NS.V034H2A&&NS.V034H2&&NS.V034H1);
const w=new NS.World(19,19),saved=JSON.parse(JSON.stringify(w.serialize()));assert.equal(saved.version,'V0.34H4');
for(const ver of ['V0.34H4','V0.34H3','V0.34H2A','V0.34H2','V0.34H1','V0.34H0','V0.34G5']){
 const x=NS.World.from({...saved,version:ver});assert.equal(x.serialize().version,'V0.34H4',ver);assert(NS.V034C.inspect(x).ok,ver);
}
NS.SaveSystem.save(w);assert(storage.has('village-observer-v034h4'));
assert.equal(NS.SaveSystem.load().serialize().version,'V0.34H4');
storage.delete('village-observer-v034h4');storage.set('village-observer-v034h2a',JSON.stringify({...saved,version:'V0.34H2A'}));
assert.equal(NS.SaveSystem.load().serialize().version,'V0.34H4','H2A local key fallback');
const originalRand=randCalls;const rep=NS.V034F0.performanceReport(w);NS.V034F1.report(w);
assert.equal(randCalls,originalRand,'F0/F1 report does not consume RNG');
assert.equal(w.telemetry.toJSON(w).version,'V0.34H4');
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,scripts:scripts.length,tech:43,loadVersions:7,legacyC:'UI-only suppressed',f0f1Rng:'unchanged'}));
