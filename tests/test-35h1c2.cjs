'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);const html=fs.readFileSync(path.join(root,file),'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return c.VSim;
}
const stable=x=>JSON.stringify(x,(k,v)=>k==='realTime'||/^(?:elapsed|wall|cpu|profile|perf|memory|heap|duration)/i.test(k)||/(?:Ms|milliseconds)(?:\d+[A-Z0-9]*)?$/i.test(k)?undefined:v);
(async()=>{
 const old=boot('tests/fixtures/v035H1C1-standalone.html'),cur=boot('index-standalone.html');
 assert.equal(old.RELEASE_VERSION,'V0.35H1C1');assert.equal(cur.RELEASE_VERSION,'V0.35H1C3');
 assert.equal(cur.TECH_ORDER.length,43);assert.equal(cur.V035H1C2.inventory.categories.length,4);
 const a=old.V035H1A.createWorld(),b=cur.V035H1A.createWorld();
 assert.equal(old.V035H1A.fingerprint(a),cur.V035H1A.fingerprint(b));
 for(let i=1;i<=120;i++){a.advanceOneDay();b.advanceOneDay();if(i%15===0){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG '+i);assert.equal(old.V035H1A.fingerprint(a),cur.V035H1A.fingerprint(b),'world '+i);}}
 assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries),'record payload/order kept');
 assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'snapshot fields kept');
 assert.equal(stable(a.telemetry.yearlySummaries),stable(b.telemetry.yearlySummaries),'annual summaries kept');
 assert.equal(stable(old.V034D3A.stats(a)),stable(cur.V034D3A.stats(b)),'D3A ledgers kept');
 let metrics=cur.V035H1C2.Diagnostics.stats();const state=cur.V035H1C2.SimulationState.get(b);
 const recent=Object.keys(state.aiLast);assert(recent.length>0,'AI decision simulation state populated');assert(metrics.decisionsCaptured>0,'AI decision capture active');
 for(const id of recent){const v=b.villages.find(x=>String(x.id)===id),saved=state.aiLast[id];if(Number(saved.ordinalDay)<b.ordinalDay()-1)continue;
  const retrieved=cur.V035H1C2.SimulationState.lastDecision(b,v);assert.equal(retrieved?.payload?.villageId,v.id);
  const logs=b.telemetry.entries; b.telemetry.entries=[];
  try{const independent=cur.V035H1C2.SimulationState.lastDecision(b,v);assert.equal(stable(independent.payload),stable(retrieved.payload),'AI recent decision independent of log retention');}finally{b.telemetry.entries=logs;}
 }
 assert.equal(b.serialize().version,a.serialize().version,'old save version retained');
 assert.equal(b.serialize().v35h1c2.schema,1,'new persistent AI state');
 const json=JSON.stringify(cur.V035H1A.scenario(b)),restored=await cur.V035H1A.importCheckpoint(json);
 assert.equal(cur.V035H1A.fingerprint(restored),cur.V035H1A.fingerprint(b),'H1C2 checkpoint parity');
 assert.equal(stable(cur.V035H1C2.SimulationState.get(restored)),stable(cur.V035H1C2.SimulationState.get(b)),'AI state checkpoint parity');
 const oldSave=JSON.stringify(old.V035H1A.scenario(a)),migrated=await cur.V035H1A.importCheckpoint(oldSave);
 assert.equal(cur.V035H1A.fingerprint(migrated),old.V035H1A.fingerprint(a),'H1C1 checkpoint compatibility');
 assert.equal(migrated.v35h1c2.schema,1,'legacy checkpoint upgraded');
 const restoredTwin=await cur.V035H1A.importCheckpoint(json);
 for(let i=1;i<=30;i++){restored.advanceOneDay();restoredTwin.advanceOneDay();if(i%10===0){assert.equal(restored.v35h1a.rngState,restoredTwin.v35h1a.rngState,'repeat-restored RNG day '+i);assert.equal(cur.V035H1A.fingerprint(restored),cur.V035H1A.fingerprint(restoredTwin),'repeat-restored world day '+i);}}
 const warTarget={nationId:a.villages[0].id,warId:'audit-war',activeTarget:0,fieldTarget:999};
 a.v33f5a3=a.v33f5a3||{};b.v33f5a3=b.v33f5a3||{};
 a.v33f5a3.warTargets={...(a.v33f5a3.warTargets||{}),audit:{...warTarget}};
 b.v33f5a3.warTargets={...(b.v33f5a3.warTargets||{}),audit:{...warTarget}};
 const warEvent={warId:'test',attackerId:a.villages[0].id,defenderId:a.villages[1].id};
 a.telemetry.record('WAR_DECLARED33',a,warEvent);b.telemetry.record('WAR_DECLARED33',b,warEvent);
 assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries),'war event order and payload identical');
 assert.equal(stable(a.v33f5a3.warTargets.audit),stable(b.v33f5a3.warTargets.audit),'war target repair effect parity');
 assert.notEqual(b.v33f5a3.warTargets.audit.fieldTarget,999,'war target really repaired');
 metrics=cur.V035H1C2.Diagnostics.stats();assert(metrics.domainWarDeclarations>=1,'war effect passed through DomainEvent bridge');
 assert.equal(b.serialize().version,'V0.35H1B1A');
 const f=cur.MilitaryFormation.from({id:'M',tileId:5,cohortIds:['a'],v33dAssignedWarId:'war-x',v33c1NextMoveCal:665,v33OccupationWarId:'x'});
 assert.equal(f.v33c1NextMoveCal,665,'Formation movement persisted');
 const report=cur.V035H1C2.report(b);assert.equal(report.format,'vilob-telemetry-lifecycle-v1');
 const gzip=await cur.V035H1C.gzipCheckpoint(b,{download:false}),decoded=await cur.V035H1C.textFromCheckpoint(gzip.blob);
 assert.equal(decoded.compressed,true);assert.equal(stable(JSON.parse(decoded.text).world.v35h1c2),stable(b.serialize().v35h1c2),'gzip H1C2 state byte-equivalent');
 const gzLoaded=await cur.V035H1A.importCheckpoint(decoded.text);assert.equal(cur.V035H1A.fingerprint(gzLoaded),cur.V035H1A.fingerprint(b),'gzip world parity');
 console.log(JSON.stringify({status:'PASS',days:120,worldParity:true,rngParity:true,repeatRestoreParityDays:30,observationParity:true,aiDecisions:metrics.decisionsCaptured,nationsWithState:recent.length,domainEvents:metrics.domainWarDeclarations,restore:true,legacyH1C1Import:true,saveFormat:'V0.35H1B1A',tech:43}));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
