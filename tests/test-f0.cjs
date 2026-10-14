'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
function boot(file,seed=0x6bc8e002){let state=seed,calls=0;const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000})}catch(e){if(!/onclick/.test(e.message))throw e;}return{NS:ctx.VSim,calls:()=>calls};}
const root=path.join(__dirname,'..'),b=boot(path.join(root,'index-standalone.html')),a=boot(path.join(root,'tests/fixtures/v034D3B3B-index.html'));
assert.equal(b.NS.RELEASE_VERSION,'V0.34F0');assert(b.NS.V034F0);
function food(w){return w.map.tiles.reduce((a,t)=>a+Number(t.stocks?.food||0),0)}
function ensure(w){for(const v of w.villages)for(const p of v.residents){assert(Number.isFinite(p.health)&&p.health>=0&&p.health<=100);assert(Number.isFinite(p.hunger)&&p.hunger>=0&&p.hunger<=100);}for(const t of w.map.tiles){const n=Number(t.stocks?.food||0);assert(Number.isFinite(n)&&n>=-1e-6);}assert(b.NS.V034D3.audit(w).ok);}
const w=new b.NS.World(19,19),old=new a.NS.World(19,19);const t=performance.now();let errors=[];
const days=Math.max(1,Number(process.env.F0_DAYS||90));for(let d=0;d<days;d++){try{w.advanceOneDay();old.advanceOneDay();if(d%15===14)ensure(w);}catch(e){errors.push({day:d+1,error:e.stack});break;}}
assert.equal(errors.length,0,JSON.stringify(errors));const p=b.NS.V034F0.performanceReport(w),c=p.consumption;
assert(c.cycles>0,'no settlement feeding cycle');assert(c.residents>0,'no individual feeding');assert(c.requested>0,'no food requested');assert(c.consumed>=0);assert(c.consumed<=c.requested+1e-5);assert(c.returnFailed<1e-6,`refunded physical food lost ${c.returnFailed}`);assert.equal(c.unmatched,0,'residents without a settlement');
const save=JSON.parse(JSON.stringify(w.serialize())),restore=b.NS.World.from(save);assert.equal(save.version,'V0.34F0');assert.equal(restore.serialize().version,'V0.34F0');assert(b.NS.V034D3.audit(restore).ok);
assert.notEqual(b.calls(),a.calls(),'new metabolism model should not fake old RNG identity');
const payload=w.telemetry.toJSON(w);assert(payload.worldSummary.v034f0);assert.equal(b.NS.V034D0.csvV2(w.telemetry.snapshotsCSV()).split('\n')[0].split(',').length,1683);
const audit=b.NS.V034D3B3A.foodAnomalies(w,5),baselineAudit=a.NS.V034D3B3A.foodAnomalies(old,5);assert(audit.compared>0,'food ledger absent');
// Complete starvation: a resident receives no ration, personal hunger/health must deteriorate.
const scarce=new b.NS.World(19,19),nation=scarce.villages.find(v=>(v.residents||[]).some(p=>p.alive));
const person=nation.residents.find(p=>p.alive),membership=b.NS.V034D3.members(nation,person.homeTileId);
assert(membership&&membership.ids.length>0);
for(const id of membership.ids){scarce.map.get(id).stocks.food=0;}
person.health=60;person.hunger=90;const h0=person.health;
person.metabolism(nation,scarce,false);
assert(person.health<h0,'starvation health is not reducing');
assert(person.hunger>=90,'starvation hunger incorrectly recovered');
assert(b.NS.V034F0.priorityFor({...person,age:8})>b.NS.V034F0.priorityFor({...person,age:30}),'child weight not applied');
assert(b.NS.V034F0.priorityFor({...person,age:8},'CHILD_FIRST')>b.NS.V034F0.priorityFor({...person,age:8},'WORK_FIRST'));
// ×10 metrics record real smoothed UI batches without needing a 150-year run.
w.speed=10;w._v26Perf={samples:1,simMs:925};b.NS.V034F0.recordBatch(w);
const perf1=b.NS.V034F0.performanceReport(w);assert(perf1.allSamples===1,'sim batch trace not recorded');
w._v26Perf={samples:2,simMs:1025};b.NS.V034F0.recordBatch(w);
assert(b.NS.V034F0.performanceReport(w).overThresholdSamples===1,'SIM/BATCH exceedance missing');
const afterPerfSave=JSON.parse(JSON.stringify(w.serialize())),afterPerfRestore=b.NS.World.from(afterPerfSave);
assert.equal(b.NS.V034F0.performanceReport(afterPerfRestore).overThresholdSamples,1);
console.log(JSON.stringify({foodFlowAudit:{compared:audit.compared,mismatched:audit.mismatched,netResidual:audit.netResidual,baselineMismatched:baselineAudit.mismatched,baselineResidual:baselineAudit.netResidual,anomalies:audit.top},starvationScenario:true,simBatchRecording:true}));
console.log(JSON.stringify({status:'PASS',days,population:w.villages.reduce((n,v)=>n+v.population(),0),metabolism:c,physicalFood:food(w),oldPhysicalFood:food(old),simTotalMs:Math.round(performance.now()-t),foodAudit:true,saveRestore:true,modelChangesRNG:true}));
