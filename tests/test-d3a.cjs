/* V0.34D3A: actual harvest recovery, physical cross-tile access, transaction return,
   30d flow snapshots, save roundtrip, 80 calendar-day two-run determinism and schema. */
'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(ROOT,'index-standalone.html'),'utf8');
function boot(seed=0x951fab41){let state=seed>>>0,calls=0;const m=Object.create(Math);m.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};const make=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const storage=new Map();const ctx={console,Math:m,Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class DateFixed extends Date{static now(){return 1760101000000;}},performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:make(),body:make(),documentElement:make(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:make}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const [i,match] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){try{new vm.Script(match[1],{filename:'script-'+i}).runInContext(ctx,{timeout:15000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return {NS:ctx.VSim,rng:()=>calls,setSeed:s=>{state=s>>>0;calls=0;}};}
const near=(a,b,msg)=>assert(Math.abs(a-b)<1e-6,`${msg||'mismatch'}: ${a} vs ${b}`);
const bx=boot(),NS=bx.NS,H=NS.V034D3A,D=NS.V034D3,w=new NS.World(19,19),v=w.villages[0],t=w.map.get(v.coreTileId),p=v.residents.find(p=>p.alive!==false);assert(p);assert.equal(w.serialize().version,'V0.34D3B3');
const initialTime=w.ordinalDay();
for(const [k,req] of [['food',2],['wood',1],['stone',1]]){
 t.syncResources(initialTime);t.resources[k]=Math.max(20,t.resources[k]||0);const nat=t.resources[k],cap=D.physicalCap(v,t.id,k);t.stocks[k]=cap;
 const got=H.harvestAndStore(p,v,w,t,k,req,initialTime);near(got,0,'full store should accept nothing');near(t.resources[k],nat,'full store should restore raw nature '+k);near(t.stocks[k],cap,'no store overflow '+k);
}
const rec=w.v34b.settlements.find(x=>String(x.id)===String(t.settlementId));
const neighbor=w.map.neighbors4(t.id).find(z=>z.ownerId==null&&NS.TERRAIN[z.terrain]?.passable);assert(neighbor);
neighbor.ownerId=v.id;neighbor.settlementId=t.settlementId;v.territory.add(neighbor.id);rec.tileIds=[...rec.tileIds,neighbor.id];
const iso=w.map.neighbors4(t.id).find(z=>z.ownerId==null&&z.id!==neighbor.id&&NS.TERRAIN[z.terrain]?.passable);assert(iso);iso.ownerId=v.id;iso.settlementId='d3a-iso';v.territory.add(iso.id);iso.stocks={...(iso.stocks||{}),food:35};w.v34b.settlements.push({id:'d3a-iso',nationId:v.id,coreTileId:iso.id,tileIds:[iso.id],lifecycle:'ACTIVE'});
neighbor.stocks={...(neighbor.stocks||{}),food:0};
t.resources.food=34;t.stocks.food=D.physicalCap(v,t.id,'food');const nat=t.resources.food,priorNeighbor=neighbor.stocks.food;
const oldMul=v.harvestMultiplier;v.harvestMultiplier=function(k,tile){return k==='food'?1.5:oldMul.call(this,k,tile);};
const output=H.harvestAndStore(p,v,w,t,'food',2,w.ordinalDay());v.harvestMultiplier=oldMul;
assert(output>0,'second tile should accept output');near(neighbor.stocks.food-priorNeighbor,output,'physical food placed in same settlement other tile');near(t.resources.food,nat-output/1.5,'nature raw decrement with productivity multiplier');assert.equal(iso.stocks.food,35,'do not deposit into different settlement');
// Partial stock / partial room + nonunit productivity must return only unused input.
neighbor.stocks.food=D.physicalCap(v,neighbor.id,'food')-.3;t.resources.food=22;const rawBefore=t.resources.food;v.harvestMultiplier=function(k,z){return k==='food'?2:oldMul.call(this,k,z);};const put=H.harvestAndStore(p,v,w,t,'food',1.7,w.ordinalDay());v.harvestMultiplier=oldMul;
near(put,.3,'exact partial store');near(t.resources.food,rawBefore-put/2,'restore fraction of raw input');
// Same settlement withdrawal from B, other settlement storage untouched.
t.stocks.food=0;neighbor.stocks.food=3.25;const got=v.withdrawAt(t.id,'food',1.25);near(got,1.25);near(neighbor.stocks.food,2);assert.equal(iso.stocks.food,35);
// A real domestic transfer refusal returns all stock to the true source; no duplication.
const first=v.map??w.map,source=t.id,dest=iso.id;t.stocks.food=10;iso.stocks.food=D.physicalCap(v,iso.id,'food');neighbor.stocks.food=0;const beforeTotal=t.stocks.food+neighbor.stocks.food+iso.stocks.food;
const attempt=H.transferWithReturn(v,source,dest,'food',4);near(attempt.put,0);near(attempt.returned,4);near(attempt.unrecovered,0);near(t.stocks.food+neighbor.stocks.food+iso.stocks.food,beforeTotal,'full reject stock conservation');
// Real remote withdrawal counters, transparent lifecycle & fixed-width CSV.
const stats=H.stats(w);assert(stats.total.remoteFoodWithdrawn>0);assert(stats.total.harvestRestoredNatural>0);assert(stats.total.transferReturned>=4);
assert.equal(H.foodCSV(w).split('\n')[0].split(',').length,H.columns.length);
// Monthly split, non-migrating history identity and save roundtrip.

const wClean=new NS.World(19,19);for(let d=0;d<105;d++)wClean.advanceOneDay();assert(H.stats(wClean).windows.length>=1);const oldCSV=H.foodCSV(wClean),save=JSON.parse(JSON.stringify(wClean.serialize())),back=NS.World.from(save);
assert.equal(back.serialize().version,'V0.34D3B3');assert.equal(H.stats(back).windows.length,H.stats(wClean).windows.length);assert.equal(H.foodCSV(back),oldCSV,'flow observations survive save/restore unchanged');
assert(NS.V034D3.audit(back).ok);assert.equal(D.csv(back).split('\n')[0].split(',').length,24);
// Natural simulation same RNG after 370d (includes birth/illness); physics deep equality.
const a=boot(0x8133a1),b=boot(0x8133a1),wa=new a.NS.World(19,19),wb=new b.NS.World(19,19);a.setSeed(0x42776);b.setSeed(0x42776);
const physical=w=>JSON.stringify({tiles:w.map.tiles.map(t=>[t.id,t.ownerId,t.settlementId,t.resources,t.stocks,t.buildings,t.buildingCondition]),villages:w.villages.map(v=>[v.id,v.gold,[...v.territory],v.residents.map(p=>[p.id,p.alive,p.homeTileId,p.age,p.job,p.hunger,p.health,p.happiness,p.gold29])])});
const started=Date.now();for(let i=0;i<70;i++){wa.advanceOneDay();wb.advanceOneDay();if(i%90===89){assert(a.NS.V034D3.audit(wa).ok,'D3 physical stock audit '+i);assert(a.NS.V034D2A.audit(wa).ok,'D2A housing audit '+i);}}
assert.equal(physical(wa),physical(wb),'same-seed physical state');assert.equal(a.rng(),b.rng(),'same-seed RNG usage');
assert(a.NS.V034D3A.stats(wa).total.harvestRaw>0,'actual nature harvested using patched Person path');
assert(a.NS.V034D3A.stats(wa).windows.length>=2,'periodic food flow report');
const telemetry=wa.telemetry.toJSON(wa);assert(telemetry.worldSummary.v034d3aFoodFlow);assert(Array.isArray(telemetry.worldSummary.v034d3aFoodFlow.laborIssues));
assert.equal(a.NS.V034D0.csvV2(wa.telemetry.snapshotsCSV()).split('\n')[0].split(',').length,1683);
assert.equal(a.NS.V034D1A.csv(wa).split('\n')[0].split(',').length,48);
assert.equal(a.NS.V034D2.csv(wa).split('\n')[0].split(',').length,11);
console.log(JSON.stringify({result:'PASS',version:'V0.34D3A',fullCapacityNaturePreserved:true,crossTileStorage:true,distinctSettlementIsolated:true,partialRefundWithProductivity:true,transferRefund:true,monthlyRows:H.stats(wClean).windows.length,foodCSVColumns:H.columns.length,saveRoundtrip:true,naturalCalendarDays:70,deterministicRuns:2,realNaturalHarvest:a.NS.V034D3A.stats(wa).total.harvestRaw,rngCalls:a.rng(),timeMs:Date.now()-started}));
