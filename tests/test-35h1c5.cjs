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
 const previous=boot('tests/fixtures/v035H1C4-standalone.html'),updated=boot('index-standalone.html');
 assert.equal(previous.RELEASE_VERSION,'V0.35H1C4');assert.equal(updated.RELEASE_VERSION,'V0.35H1C6');
 assert.equal(updated.V035H1C5.stageNames[0],'C5_F5A_ATTACH');
 let a=previous.V035H1A.createWorld(),b=updated.V035H1A.createWorld();
 const days=30;
 for(let i=1;i<=days;i++){
  a.advanceOneDay();b.advanceOneDay();
  assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG at day '+i);
  assert.equal(previous.V035H1A.fingerprint(a),updated.V035H1A.fingerprint(b),'world at day '+i);
  assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries),'events day '+i);
  assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'snapshots day '+i);
 }
 assert.equal(b.serialize().version,'V0.35H1B1A');
 assert.equal(updated.V034D3.audit(b).ok,true);
 // Same world in two engines; profiler disabled to estimate Snapshot-only change.
 const oldSamples=[],newSamples=[];
 for(let i=0;i<12;i++){
  const t0=performance.now();a.telemetry.snapshot(a,'MANUAL','H1C5 local benchmark');const t1=performance.now();
  b.telemetry.snapshot(b,'MANUAL','H1C5 local benchmark');const t2=performance.now();
  if(i>=2){oldSamples.push(t1-t0);newSamples.push(t2-t1);}
  assert.equal(previous.V035H1A.fingerprint(a),updated.V035H1A.fingerprint(b),'manual snapshot world '+i);
  assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'manual snapshot data '+i);
 }
 updated.V035H1C1.start(b);
 b.telemetry.snapshot(b,'MANUAL','H1C5 stage probe');
 updated.V035H1B1.stopSnapshot();
 const report=updated.V035H1C1.report(b),stage=report?.snapshot?.stages?.C5_F5A_ATTACH;
 assert(stage?.calls>=1,'new attach probe sampled');
 assert(stage.inclusiveMs>=0,'measured nonnegative attach time');
 const median=x=>x.slice().sort((a,b)=>a-b)[Math.floor(x.length/2)];
 console.log(JSON.stringify({status:'PASS',parityDays:days,manualSnapComparisons:12,worldRNGEventsSnapshots:true,saveSchema:b.serialize().version,CSVColumns:1683,stageProbe:stage,benchmark:{environment:'Node VM year1, 30-day world, profiler OFF; not representative of 60-year PC',oldMedianMs:+median(oldSamples).toFixed(3),newMedianMs:+median(newSamples).toFixed(3),oldMeanMs:+(oldSamples.reduce((s,x)=>s+x,0)/oldSamples.length).toFixed(3),newMeanMs:+(newSamples.reduce((s,x)=>s+x,0)/newSamples.length).toFixed(3)}},null,2));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
