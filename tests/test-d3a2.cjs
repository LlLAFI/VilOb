/* V0.34D3A: actual harvest recovery, physical cross-tile access, transaction return,
   30d flow snapshots, save roundtrip, 80 calendar-day two-run determinism and schema. */
'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(ROOT,'index-standalone.html'),'utf8');
function boot(seed=0x951fab41){let state=seed>>>0,calls=0;const m=Object.create(Math);m.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};const make=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const storage=new Map();const ctx={console,Math:m,Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class DateFixed extends Date{static now(){return 1760101000000;}},performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:make(),body:make(),documentElement:make(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:make}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const [i,match] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){try{new vm.Script(match[1],{filename:'script-'+i}).runInContext(ctx,{timeout:15000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return {NS:ctx.VSim,ctx,rng:()=>calls,setSeed:s=>{state=s>>>0;calls=0;}};}
// D3A2 source-level regression: real national stock setter + physical settlement audit.
const bx=boot(0x951fab41),NS=bx.NS,H=NS.V034D3A,P=NS.V034D3A2,w=new NS.World(19,19),v=w.villages[0],t=w.map.get(v.coreTileId);
const near=(a,b)=>assert(Math.abs(a-b)<1e-6,`${a} != ${b}`);
assert.equal(w.serialize().version,'V0.34D3B3A');
assert.equal(P.columns.length,48);assert.equal(new Set(P.columns).size,48);
assert(P.columns.includes('frontierFoodUpkeep')&&P.columns.includes('frontierFoodAccident'));
let day=1;w.calendarOrdinalDay=()=>day;t.stocks.food=40;
// Check the actual Village.food setter, not a fabricated metric increment.
let before=P.frontierBefore(v,w,t.id),stockBefore=NS.V034D3.stockRaw(w,t.id,'food');
v.food=Math.max(0,v.food-0.064);
let spent=P.frontierAfter(v,w,before,'upkeep',0.064,'test-frontier');
near(stockBefore-NS.V034D3.stockRaw(w,t.id,'food'),spent);near(spent,0.064);
before=P.frontierBefore(v,w,t.id);stockBefore=NS.V034D3.stockRaw(w,t.id,'food');
v.food=Math.max(0,v.food-4);
let loss=P.frontierAfter(v,w,before,'accident',4,'test-frontier');
near(stockBefore-NS.V034D3.stockRaw(w,t.id,'food'),loss);near(loss,4);
near(P.stats(w).upkeepPhysicalSpent,0.064);near(P.stats(w).accidentPhysicalSpent,4);
near(H.stats(w).total.frontierFoodSpent,4.064);
// Month closes at the actual calendar transition. Both sinks must be in the same legacy balance.
day=31;H.addMetric(w,v,t.id,'harvestRequested',1);
assert.equal(H.stats(w).windows.length,1);
const row=H.stats(w).windows[0].rows.find(x=>x.nationId===String(v.id)&&x.tileIds.includes(t.id));
assert(row);near(row.frontierFoodUpkeep,0.064);near(row.frontierFoodAccident,4);near(row.frontierFoodSpent,4.064);
near(row.storageDelta,-4.064);near(row.unattributedDelta,0);
const data=P.foodCSV(w).trimEnd().split('\n');assert.equal(data[0].split(',').length,48);assert(data.slice(1).every(line=>line.split(',').length===48));
const version=JSON.parse(JSON.stringify(w.serialize()));delete w.calendarOrdinalDay;
const loaded=NS.World.from(version);assert.equal(loaded.serialize().version,'V0.34D3B3A');
near(H.stats(loaded).total.frontierFoodUpkeep,0.064);near(H.stats(loaded).total.frontierFoodAccident,4);
near(P.stats(loaded).accidentPhysicalSpent,4);
const prev=JSON.parse(JSON.stringify(version));prev.version='V0.34D3A1';delete prev.v034d3a2;
const fromPrev=NS.World.from(prev);assert.equal(fromPrev.serialize().version,'V0.34D3B3A');
assert(P.stats(fromPrev).otherSaveMigrated===true);
const dev=loaded.telemetry.toJSON(loaded);assert.equal(dev.version,'V0.34D3B3A');
assert.equal(dev.worldSummary.v034d3a2Audit.foodFlowColumns,48);
assert(P.audit(loaded).ok);
console.log(JSON.stringify({result:'PASS',version:version.version,foodColumns:48,realUpkeep:spent,realAccident:loss,calendarWindows:[[1,30]],accountedResidual:row.unattributedDelta,saveRoundtrip:true,previousSaveMigration:true,stockAudit:true}));
// Integration: let V0.20 dailyTick execute its original upkeep and accident branches.
const live=boot(0x4beea1),W=live.NS, ww=new W.World(19,19),vv=ww.villages[0];
const f=ww.map.tiles.find(t=>t.ownerId==null&&['grass','plain','forest','rock','mountain'].includes(t.terrain));
const ps=vv.residents.filter(p=>p.alive&&p.age>=18).slice(0,2);
assert(f&&ps.length===2);
ww.map.get(vv.coreTileId).stocks.food=60;
vv.frontierProjects=[{id:'d3a2-fixture',sourceTileId:vv.coreTileId,targetTileId:f.id,startDay:1,progress:0,duration:10000,pioneerIds:ps.map(p=>p.id),lastRiskCheck:-100,stallDays:0,events:0}];
live.NS._d3a2Test=1;
// Force the V20 accident conditional only after the world has been generated.
// This is a synthetic forced-risk scenario, not the production probability.
const originalMathRandom=live.ctx.Math.random;live.ctx.Math.random=()=>0.11;
try{vv.dailyTick(ww);}finally{live.ctx.Math.random=originalMathRandom;}
assert(W.V034D3A2.stats(ww).upkeepPhysicalSpent>0,'V20 daily path did not account upkeep');
assert(W.V034D3A2.stats(ww).accidentPhysicalSpent>0,'V20 supply-loss branch did not account accident');
near(W.V034D3A2.stats(ww).accidentPhysicalSpent,4);
console.log(JSON.stringify({integration:'PASS',actualFrontierUpkeep:W.V034D3A2.stats(ww).upkeepPhysicalSpent,actualFrontierAccident:W.V034D3A2.stats(ww).accidentPhysicalSpent,originalV20DailyTick:true}));
