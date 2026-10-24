'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(html){let state=514;const math=Object.create(Math);math.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};const mem=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 for(const m of fs.readFileSync(path.join(root,html),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {N:c.VSim,mem};
}
(async()=>{
 const previous=boot('tests/fixtures/v035H1B-standalone.html'),cur=boot('index-standalone.html');
 assert.equal(previous.N.RELEASE_VERSION,'V0.35H1B');assert.equal(cur.N.RELEASE_VERSION,'V0.35H1C1');
 const a=previous.N.V035H1A.createWorld(),b=cur.N.V035H1A.createWorld();
 const snapValue=x=>JSON.stringify(x,(k,v)=>/^(realTime)$|(?:Ms|milliseconds|perf|Performance|Heap|latency|duration|timings)/i.test(k)?undefined:v);
 for(let i=0;i<60;i++){a.advanceOneDay();b.advanceOneDay();if(i%30===29){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG '+i);assert.equal(previous.N.V035H1A.fingerprint(a),cur.N.V035H1A.fingerprint(b),'state '+i);}}
 assert.equal(snapValue(a.telemetry.snapshots),snapValue(b.telemetry.snapshots),'snapshot schema + values must match after 120 natural days');
 const cp=previous.N.V035H1A.scenario(a);assert.equal(cur.N.V035H1A.fingerprint(cp.world),cp.perf.stateSignature,'serialized signature must be consistent');
 const cpText=JSON.stringify(cp);const imported=await cur.N.V035H1A.importCheckpoint(cpText);assert(['EXACT','RECONCILED_CANONICAL_FIELDS'].includes(cur.N.V035H1B1.recentDiagnostic().result));assert.equal(imported.serialize().version,'V0.35H1B1A');
 let firstDiff=-1;for(let j=0;j<30;j++){a.advanceOneDay();imported.advanceOneDay();if(previous.N.V035H1A.fingerprint(a)!==cur.N.V035H1A.fingerprint(imported)){firstDiff=j+1;break;}}
 // Mimic the legacy attach mutating two serialized signature fields on import.
 const original=cur.N.World.from;cur.N.World.from=function(...args){const w=original.apply(this,args);w.map.tiles[0].terrain='bogus';w.villages[0].residents[0].health=-99;return w;};
 const fixed=await cur.N.V035H1A.importCheckpoint(cpText);cur.N.World.from=original;
 const status=cur.N.V035H1B1.recentDiagnostic();assert.equal(status.result,'RECONCILED_CANONICAL_FIELDS');assert(status.differenceCount>=2);assert(status.repairCount>=2);assert.equal(cur.N.V035H1A.fingerprint(fixed),cp.perf.stateSignature);
 // Corrupt the JSON itself: never silently accept a fabricated checksum.
 const corrupt=JSON.parse(cpText);corrupt.world.map.tiles[0].terrain='bogus';await assert.rejects(cur.N.V035H1A.importCheckpoint(JSON.stringify(corrupt)),/저장된 원본 세계/);
 assert.equal(cur.N.V035H1B1.recentDiagnostic().result,'CORRUPT_OR_UNREPRESENTABLE_SERIALIZATION');
 const missing=cur.N.World.from;cur.N.World.from=function(...args){const w=missing.apply(this,args);w.villages[0].residents.pop();return w;};
 await assert.rejects(cur.N.V035H1A.importCheckpoint(cpText),/개체가 누락/);
 assert.equal(cur.N.V035H1B1.recentDiagnostic().result,'MISSING_ENTITIES');cur.N.World.from=missing;
 // Explicit light observation mode does not change gameplay or snapshot values.
 const c=await cur.N.V035H1A.importCheckpoint(cpText);const d=await cur.N.V035H1A.importCheckpoint(cpText);
 cur.N.V035H1B1.startSnapshot(d);for(let i=0;i<12;i++){c.advanceOneDay();d.advanceOneDay();}
 const snapStats=cur.N.V035H1B1.stopSnapshot();assert(snapStats.calls>=1);assert.equal(cur.N.V035H1B1.snapshotReport().format,'vilob-v035h1b1-snapshot-v1');assert(snapStats.segments.E4_AND_EARLIER?.calls>0);
 assert.equal(cur.N.V035H1A.fingerprint(c),cur.N.V035H1A.fingerprint(d));assert.equal(c.v35h1a.rngState,d.v35h1a.rngState);assert.equal(snapValue(c.telemetry.snapshots),snapValue(d.telemetry.snapshots));
 cur.mem.set('village-observer-v035h1b',JSON.stringify(cp.world));assert.equal(cur.N.SaveSystem.load().serialize().version,'V0.35H1B1A');
 assert.equal(cur.N.TECH_ORDER.length,43);assert(cur.N.PATCH_NOTES.some(x=>x.version==='V0.35H1B1A'));
 console.log(JSON.stringify({status:'PASS',h1bToH1b1WorldAndRngDays:60,snapshotParity:true,checkpointExact:true,canonicalRepair:true,corruptRejected:true,missingPersonRejected:true,uninterruptedReloadFirstDivergentDay:firstDiff,snapshotProbeDays:12,tech:43}));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
