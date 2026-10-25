'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);const html=fs.readFileSync(path.join(root,file),'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return c.VSim;
}
function omitTiming(x){return JSON.stringify(x,(k,v)=>k==='realTime'||/^(?:elapsed|wall|cpu|profile|perf|memory|heap|duration)/i.test(k)||/(?:Ms|milliseconds)$/i.test(k)?undefined:v);}
(async()=>{
 const old=boot('tests/fixtures/v035H1C-standalone.html'),cur=boot('index-standalone.html');
 assert.equal(old.RELEASE_VERSION,'V0.35H1C');assert.equal(cur.RELEASE_VERSION,'V0.35H1C3');
 assert.equal(cur.TECH_ORDER.length,43);assert.equal(typeof cur.V035H1C1.start,'function');
 const a=old.V035H1A.createWorld(),b=cur.V035H1A.createWorld();
 cur.V035H1C1.start(b);
 const days=90;
 for(let day=1;day<=days;day++){
  a.advanceOneDay();b.advanceOneDay();
  if(day%15===0){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG '+day);assert.equal(old.V035H1A.fingerprint(a),cur.V035H1A.fingerprint(b),'fingerprint '+day);}
 }
 const snap=cur.V035H1B1.stopSnapshot(),report=cur.V035H1C1.report(b);
 assert.equal(snap.observedDays,days);assert(snap.calls>=5,'multiple snapshots observed');
 assert.equal(report.snapshot.calls,snap.calls);assert.equal(report.cache.snapshots,snap.calls);
 assert.equal(omitTiming(a.telemetry.snapshots),omitTiming(b.telemetry.snapshots),'every snapshot entry and observation field remains the same');
 assert.equal(omitTiming(a.telemetry.yearlySummaries),omitTiming(b.telemetry.yearlySummaries));
 assert.equal(omitTiming(a.telemetry.entries),omitTiming(b.telemetry.entries));
 assert.equal(omitTiming(old.V034D3A.stats(a)),omitTiming(cur.V034D3A.stats(b)),'D3A full flow ledger, totals and windows unchanged');
 for(const stage of ['D1A_SETTLEMENT_LABOR','D2_HOUSING_AUDIT','D3B_ECONOMIC_OBSERVATION','H4_OBSERVATION_STACK','35F_OBSERVATION_STACK','35H_OBSERVATION_STACK'])assert(report.snapshot.stages[stage]?.calls>0,stage+' was not instrumented');
 assert.equal(a.serialize().version,b.serialize().version,'preserved save version');
 const raw=JSON.stringify(cur.V035H1A.scenario(b)),loaded=await cur.V035H1A.importCheckpoint(raw);
 assert.equal(cur.V035H1A.fingerprint(loaded),cur.V035H1A.fingerprint(b));
 const f=cur.MilitaryFormation.from({id:'H1C1-M',tileId:4,v33dAssignedWarId:'war0',v33c1NextMoveCal:887,cohortIds:['a']});assert.equal(f.v33c1NextMoveCal,887);
 assert.equal(cur.V035H1C1.ledger(b).windows>=0,true);assert.equal(cur.V035H1C1.ledger(b).completedRows>=0,true);
 console.log(JSON.stringify({status:'PASS',days,snapshotCalls:snap.calls,stageCount:Object.keys(report.snapshot.stages||{}).length,topStages:Object.entries(report.snapshot.stages||{}).sort((a,b)=>b[1].exclusiveMs-a[1].exclusiveMs).slice(0,10).map(([name,m])=>({name,calls:m.calls,exclusiveMs:Math.round(m.exclusiveMs*10)/10,inclusiveMs:Math.round(m.inclusiveMs*10)/10})),cache:report.cache,worldParity:true,observationsParity:true,warField:true,tech:cur.TECH_ORDER.length}));
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
