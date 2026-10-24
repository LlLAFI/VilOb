'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file=path.join(root,'index-standalone.html'),seed=0x19a34d){
 let rngState=seed,calls=0;const math=Object.create(Math);math.random=()=>{calls++;rngState^=rngState<<13;rngState^=rngState>>>17;rngState^=rngState<<5;return(rngState>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const storage=new Map(),ctx={Math:math,console,Map,Set,WeakMap,WeakSet,JSON,Date,performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:50000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};
}
const x=boot(),NS=x.NS;
assert.equal(NS.RELEASE_VERSION,'V0.35H1C');
const realD3=NS.V034D3;
NS.V034D3={...realD3,stockRaw:(w,id)=>w.map.get(Number(id)).stocks.food,physicalCap:()=>1000};
function fixture(secondDonor=false,blocked=false){
 const tiles=new Map(),adults=(tid,count)=>Array.from({length:count},()=>({alive:true,age:25,homeTileId:tid,hunger:20,assignment:'FARMER'}));
 function tile(id,x,food){tiles.set(id,{id,x,y:1,ownerId:0,settlementId:'s'+id,stocks:{food}});}
 tile(10,1,105.63); if(secondDonor)tile(20,9,220);
 for(let i=0;i<4;i++)tile(11+i,2+i,0);
 const residents=[...adults(10,10),...(secondDonor?adults(20,10):[]),...Array.from({length:4},(_,i)=>adults(11+i,4)).flat()];
 const v={id:0,name:'카이렌 통제',territory:new Set(tiles.keys()),residents,v32e1:{lastFoodRelayCal:-999},v32e2:{},v32d5:{},logisticsStats:{}};
 v.stockAt=id=>tiles.get(Number(id)).stocks.food;
 v.withdrawAt=(id,k,n)=>{const t=tiles.get(Number(id));const took=Math.min(n,t.stocks.food);t.stocks.food-=took;return took;};
 v.depositAt=(id,k,n)=>{const t=tiles.get(Number(id));const put=Math.min(1000-t.stocks.food,n);t.stocks.food+=put;return put;};
 v.internalPathCost=(a,b)=>blocked?null:Math.abs(tiles.get(a).x-tiles.get(b).x)*.62;
 v.internalLogisticsCapacity=()=>({capacity:14});
 const events=[],w={activeVillages:[v],villages:[v],map:{get:id=>tiles.get(Number(id))},calendarOrdinalDay:()=>6,telemetry:{record:(...a)=>events.push(a)}};
 return {w,v,tiles,events,initial:[...tiles.values()].reduce((s,t)=>s+t.stocks.food,0)};
}
function verifyWorld(t){
 const diag=NS.V034G2A.summary(t.w),routes=diag.retainedRoutes;
 assert.equal(diag.reserveViolations,0,JSON.stringify(diag));
 assert.equal(diag.conservationErrors,0,JSON.stringify(diag));
 for(const row of t.events.filter(e=>e[0]==='NATIONAL_FOOD_RELAY32D5')){
  assert.notEqual(row[2].fromSettlementId,row[2].toSettlementId);
  assert(row[2].donorReserveShortfall<=1e-6,row[2]);
 }
 const rows=NS.V034G2A.csv(t.w).trim().split(/\r?\n/);assert.equal(rows.length,diag.shipments+1);
 assert(Math.abs(t.initial-[...t.tiles.values()].reduce((s,t)=>s+t.stocks.food,0))<1e-5);
 return diag;
}
// Reproduces the user's 36y1q21d failure: a donor has only 1.15 cycles of
// surplus but four receivers need relief in the same three-day work cycle.
const single=fixture();NS.V034G2A.relay(single.w);const a=verifyWorld(single);
assert.equal(a.shipments,1,JSON.stringify(a));
assert(Math.abs(single.tiles.get(10).stocks.food-10*NS.V034F0.needFor({age:25})*24)<.0001);
assert.equal(a.reserveChecks,1);
// Re-search another donor after the near donor is depleted; update receiver's
// actual stock and stop at its target rather than counting stale unmet need.
const multi=fixture(true);NS.V034G2A.relay(multi.w);const b=verifyWorld(multi);
assert(b.shipments>1,JSON.stringify(b));
assert(b.alternativeDonorsUsed>0,JSON.stringify(b));
assert(multi.tiles.get(10).stocks.food>=10*NS.V034F0.needFor({age:25})*24-1e-5);
assert(multi.tiles.get(20).stocks.food>=10*NS.V034F0.needFor({age:25})*24-1e-5);
// No fake delivery when actual path is blocked.
const blocked=fixture(false,true);NS.V034G2A.relay(blocked.w);const c=verifyWorld(blocked);
assert.equal(c.shipments,0);assert.equal(c.blocked.NO_ROUTE,4);
// Save/import and CSV columns, UI compatibility public API.
assert.equal(typeof NS.SaveSystem.exportG2Routes,'function');
assert.equal(NS.V034G2.relay,NS.V034G2A.relay);
NS.V034D3=realD3;
console.log(JSON.stringify({status:'PASS',oneDonor:{shipments:a.shipments,reserveViolations:a.reserveViolations,remaining:single.tiles.get(10).stocks.food},alternate:{shipments:b.shipments,alternativeDonorsUsed:b.alternativeDonorsUsed,reserveViolations:b.reserveViolations},blocked:{shipments:c.shipments}}));
