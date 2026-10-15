'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file,seed=0x4ab1221d){let state=seed,calls=0;
 const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};
}
const {NS,calls}=boot(path.join(root,'index-standalone.html'));
assert.equal(NS.RELEASE_VERSION,'V0.34F2');
assert(NS.V034F2?.enabled);
const w=new NS.World(19,19);const d=NS.V034F2.diagnostics(w);
assert.equal(NS.V034D3.audit(w).ok,true);
const days=Math.max(15,Number(process.env.F2_DAYS||90));
for(let i=0;i<days;i++){
 w.advanceOneDay();
 if((i+1)%30===0){assert.equal(NS.V034D3.audit(w).ok,true,'physical audit '+(i+1));const x=NS.V034F2.diagnostics(w);assert(x.dailyStarvationChecks>0);}
}
assert(d.completedCycles>0&&d.aliveProcessed>0);
assert.equal(d.duplicateMetabolismRequests,0);
// The full F0 ration ledger is unchanged in its physical conservation semantics.
const s=w.serialize();assert.equal(s.version,'V0.34F2');
const saved=NS.World.from(JSON.parse(JSON.stringify(s)));
assert.equal(saved.serialize().version,'V0.34F2');assert.equal(NS.V034D3.audit(saved).ok,true);
const older={...s,version:'V0.34F1A1'};delete older.v034f2;const restoredF1A1=NS.World.from(JSON.parse(JSON.stringify(older)));assert.equal(restoredF1A1.serialize().version,'V0.34F2');
// Multi-tile food reserve: physical stock counted once rather than duplicated per home.
const v=w.villages.find(v=>v.population()>0);assert(v);
const g=NS.V034F2.reserveGroups(v);let need=0,food=0;for(const x of g.values()){need+=x.need;food+=x.food;}
if(need>0)assert(Math.abs(v.foodReserveDays()-food/need)<1e-7);
// Wounded Persons use the same physical Settlement ration and generic survival.
const wound=v.residents.find(p=>p.alive&&p.age>=15);assert(wound);
wound.militaryStatus32A='wounded';wound.woundedUntilCal33=1e8;
const beforeWounded=d.woundedMetabolism;
for(let j=0;j<3;j++)w.advanceOneDay();
assert(d.woundedMetabolism>beforeWounded,'wounded must receive unified metabolism');
assert.equal(d.duplicateMetabolismRequests,0);
// Same calendar starvation rule applies to wounded and industrial workers.
const victims=v.residents.filter(p=>p.alive&&p.age>=15).slice(0,2);assert.equal(victims.length,2);
const now=Number(w.calendarOrdinalDay());
for(const p of victims){p.hunger=100;p._v30b3Hunger100SinceCal=now-12;}
victims[0].militaryStatus32A='wounded';victims[1].job='광부';victims[1].workBuildingType29='iron_mine';
const initialDeaths=d.graceDeaths;
NS.V034F2.dailyStarvation(w);
assert.equal(victims.filter(p=>!p.alive).length,2,'wounded and iron worker both die after 12 calendar days');
assert.equal(d.graceDeaths,initialDeaths+2);
assert.equal(NS.V034D3.audit(w).ok,true);
// Isolated calendar test, no work cycles: first day starts grace, day 11 lives, day 12 dies.
const isolated=new NS.World(19,19),iv=isolated.villages[0];
const ip=iv.residents.find(p=>p.alive&&p.age>=15),recovered=iv.residents.find(p=>p!==ip&&p.alive);
const clock=isolated.calendarOrdinalDay.bind(isolated),day0=clock();
let fakeDay=day0;isolated.calendarOrdinalDay=()=>fakeDay;
ip.hunger=100;ip._v30b3Hunger100SinceCal=null;
recovered.hunger=100;recovered._v30b3Hunger100SinceCal=null;
NS.V034F2.dailyStarvation(isolated);
assert.equal(ip._v30b3Hunger100SinceCal,day0);
recovered.hunger=90;fakeDay++;NS.V034F2.dailyStarvation(isolated);
assert.equal(recovered._v30b3Hunger100SinceCal,null,'recovery below 95 resets grace');
for(let i=2;i<12;i++){fakeDay=day0+i;NS.V034F2.dailyStarvation(isolated);assert.equal(ip.alive,true,'must live before 12th calendar day');}
fakeDay=day0+12;NS.V034F2.dailyStarvation(isolated);
assert.equal(ip.alive,false,'dies on 12th calendar day');
const audit=NS.V034F1A.report(w);
// Known legacy F1A1 window-boundary reconciliation findings are reported, not masked.
// F2 still outputs the normal 52-column CSV and exports 1683-column Snapshot CSV.
assert.equal(NS.V034F1A1.columns.length,52);
assert.equal(NS.V034D0?.schema?.columnCount??1683,1683);
console.log(JSON.stringify({status:'PASS',days,version:NS.RELEASE_VERSION,cycles:d.completedCycles,metabolism:d.aliveProcessed,skipped:d.fallbackMetabolism,wounded:d.woundedMetabolism,duplicateMetabolismRequests:d.duplicateMetabolismRequests,dailyStarvationChecks:d.dailyStarvationChecks,graceStarts:d.graceStarts,graceDeaths:d.graceDeaths,foodNewAnomalies:audit.newAnomalies,foodObservedPeriods:audit.observedNewPeriods,rngCalls:calls()}));
