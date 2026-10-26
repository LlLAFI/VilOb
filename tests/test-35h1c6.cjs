'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);const html=fs.readFileSync(path.join(root,file),'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}return c.VSim;
}
const stable=x=>JSON.stringify(x,(k,v)=>k==='realTime'||/^(?:elapsed|wall|cpu|profile|perf|memory|heap|duration)/i.test(k)||/(?:Ms|milliseconds)(?:\d+[A-Z0-9]*)?$/i.test(k)?undefined:v);
(async()=>{
 const before=boot('tests/fixtures/v035H1C5-standalone.html'),after=boot('index-standalone.html');
 assert.equal(before.RELEASE_VERSION,'V0.35H1C5');assert.equal(after.RELEASE_VERSION,'V0.35H1C6');
 const a=before.V035H1A.createWorld(),b=after.V035H1A.createWorld();
 for(let i=1;i<=30;i++){
  a.advanceOneDay();b.advanceOneDay();
  assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG '+i);
  assert.equal(before.V035H1A.fingerprint(a),after.V035H1A.fingerprint(b),'world '+i);
  assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries),'events '+i);
  assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'snapshots '+i);
 }
 for(let i=0;i<2;i++){
  a.telemetry.snapshot(a,'MANUAL','C6 parity');b.telemetry.snapshot(b,'MANUAL','C6 parity');
  assert.equal(before.V035H1A.fingerprint(a),after.V035H1A.fingerprint(b),'manual world');
  assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'manual snapshots');
  assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries),'manual events');
 }
 assert.equal(b.serialize().version,'V0.35H1B1A');assert.equal(after.V034D3.audit(b).ok,true);
 after.V035H1C1.start(b);b.telemetry.snapshot(b,'MANUAL','C6 nested attach');
 let report=after.V035H1C1.report(b);const stages=report.snapshot.stages;
 assert.equal(stages.C5_F5A_ATTACH.calls,1);
 const measured=after.V035H1C6.stageNames.filter(k=>stages[k]?.calls>0);
 assert(measured.length>=9,'C6 internal attach chain is measured: '+measured.join(','));
 for(const k of measured){assert(stages[k].inclusiveMs>=0&&stages[k].exclusiveMs>=0,k+' is nonnegative');assert(stages[k].exclusiveMs<=stages[k].inclusiveMs+.01,'exclusive<=inclusive '+k);}
 const prevCalls=Object.fromEntries(measured.map(k=>[k,stages[k].calls]));
 after.V033F5P2.attachWorld(b); // outside F5A Snapshot: must NOT be added to C6 F5A stages
 report=after.V035H1C1.report(b);
 for(const k of measured)assert.equal(report.snapshot.stages[k].calls,prevCalls[k],'C6 stage must be snapshot-scoped: '+k);
 after.V035H1B1.stopSnapshot();
 const fresh=after.V035H1C1.report(b);
 assert.equal(fresh.snapshot.stages.C5_F5A_ATTACH.calls,1);
 assert.equal(after.RELEASE_VERSION,'V0.35H1C6');
 console.log(JSON.stringify({status:'PASS',days:30,manualComparisons:2,parity:'world/RNG/events/snapshots',CSVColumns:1683,saveFormat:b.serialize().version,measuredStages:measured,attachCostMs:fresh.snapshot.stages.C5_F5A_ATTACH.inclusiveMs,stages:Object.fromEntries(measured.map(k=>[k,{calls:stages[k].calls,exclusiveMs:+stages[k].exclusiveMs.toFixed(2)}]))},null,2));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
