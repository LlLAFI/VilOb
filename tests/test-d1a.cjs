/* D1A native schema labor test: read-only, childhood, pioneer, military, formal/informal slots. */
const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
const storage=new Map(),M=Object.create(Math);let seed=0x55ab1e20,rngCalls=0;
M.random=()=>{rngCalls++;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
const el=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
const ctx={console,Math:M,Date,Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:el(),documentElement:el(),body:el(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:el}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){try{new vm.Script(m[1],{filename:'script'+i}).runInContext(ctx,{timeout:10000});}catch(e){if(!/onclick/.test(e.message))throw e;}}
const NS=ctx.VSim,w=new NS.World(19,19);assert.equal(NS.V034D1A.version,'V0.34D1A');assert.equal(w.serialize().version,'V0.34D1A');
const A=NS.V034D1A;
const serializeWithoutTelemetry=()=>{const x=JSON.parse(JSON.stringify(w.serialize()));delete x.telemetry;return JSON.stringify(x);};
const old=serializeWithoutTelemetry(),oldRng=rngCalls;
const all=A.all(w),audit=A.audit(w,all);assert(audit.ok,audit.errors.join('|'));assert.equal(old,serializeWithoutTelemetry());assert.equal(rngCalls,oldRng);
assert.equal(A.columns.length,48);assert.equal(new Set(A.columns).size,48);assert.deepEqual(JSON.parse(JSON.stringify(A.columns.slice(0,32))),JSON.parse(JSON.stringify(NS.V034D1.columns)));
assert.equal(A.csv(w).split('\n').length,all.length+1);
assert.equal(NS.V034D0.csvV2(w.telemetry.snapshotsCSV()).split('\n')[0].match(/","/g)?.length+1,1683);
// Synthetic records are used only for observational checks. No game logic is modified.
const r=all.find(q=>q.tileIds.length&&w.villages.find(v=>String(v.id)===String(q.nationId))?.residents?.length>=6),v=w.villages.find(v=>String(v.id)===String(r.nationId)),tile=w.map.get(r.tileIds[0]);
const people=v.residents.filter(p=>p.alive!==false).slice(0,6);assert.equal(people.length,6);
for(const p of people){p.homeTileId=tile.id;p.workTileId=tile.id;p.villageId=v.id;p.assignment=null;p.militaryStatus32A='civilian';p.militaryActive32B=false;p._v29SlotKey=null;p.workBuildingIndex29=null;p.workBuildingType29=null;p.job='무직';}
const [child,facility,informal,guard,pioneer,soldier]=people;
child.age=10;child.job='아이';
facility.age=24;facility.job='농부';const ix=tile.buildings.length;tile.buildings.push('farmstead');tile.buildingCondition.push(100);facility._v29SlotKey=`${tile.id}:${ix}:농부`;facility.workBuildingIndex29=ix;facility.workBuildingType29='farmstead';
informal.age=20;informal.job='광부';informal._v29SlotKey=`${tile.id}:-2:광부`;informal.workBuildingIndex29=-2;informal.workBuildingType29='manual_quarry';
guard.age=25;guard.job='경비';
pioneer.age=23;pioneer.assignment='PIONEER';pioneer.job='농부';
soldier.age=29;soldier.militaryStatus32A='active';soldier.job='경비';
const metrics=A.aggregate(w,r.settlementId).labor;
assert(metrics.civilianEligible15>=3,'civilian eligibility incorrectly missing');
assert(metrics.facilitySlotAssigned15>=1,'formal facility slot');
assert(metrics.informalSlotAssigned15>=1,'informal slot');
assert(metrics.nonFacilityOccupation15>=1,'non-facility occupation');
assert(metrics.pioneerExcluded15>=1);assert(metrics.militaryExcluded15>=1);
assert.equal(A.slotInfo(w,facility).kind,'facility');assert.equal(A.slotInfo(w,informal).kind,'informal');
assert.equal(A.eligible(child),false);assert.equal(A.eligible(pioneer),false);assert.equal(A.eligible(soldier),false);assert.equal(A.eligible(facility),true);
const readOnlyFacts=()=>JSON.stringify(w.villages.map(v=>v.residents.map(p=>({id:p.id,age:p.age,job:p.job,workTileId:p.workTileId,homeTileId:p.homeTileId,assignment:p.assignment,slot:p._v29SlotKey,building:p.workBuildingType29,military:p.militaryStatus32A}))));
const mutation=readOnlyFacts(),rng=rngCalls;
const report=A.audit(w,A.all(w));assert(report.ok,report.errors.join('|'));
assert.equal(mutation,readOnlyFacts(),'read-only aggregation must not change Person work or military state');
assert.equal(rng,rngCalls,'read-only aggregation consumed RNG');
NS.SaveSystem.save(w);const restored=NS.SaveSystem.load();assert.equal(restored.serialize().version,'V0.34D1A');assert.deepEqual(JSON.parse(JSON.stringify(A.all(restored))),JSON.parse(JSON.stringify(A.all(w))));
assert(A.audit(restored).ok);
const d=restored.telemetry.toJSON(restored);assert.equal(d.worldSummary.v034d1aLaborAudit.ok,true);const snapshot=restored.telemetry.snapshot(restored,'MANUAL','D1A');assert.equal(snapshot.global.d1aLaborErrors,0);
assert.throws(()=>NS.World.from({...w.serialize(),version:'V0.34D1'}),/D1A/);
console.log(JSON.stringify({result:'PASS',version:A.version,settlements:all.length,csvColumns:A.columns.length,readOnly:true,noRNG:true,fixture:{formal:metrics.facilitySlotAssigned15,informal:metrics.informalSlotAssigned15,nonFacility:metrics.nonFacilityOccupation15},currentVersionSave:true}));
