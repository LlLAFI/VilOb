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
const x=boot(),NS=x.NS;assert.equal(NS.RELEASE_VERSION,'V0.34H3');
assert.equal(typeof NS.V034G2.relay,'function');
// 19x19 subset. Nine plain tiles belong to one Settlement A and an adjacent
// outside tile (4,2) to Settlement B. All actual shortest costs use tile geometry.
const tiles=new Map();for(let y=1;y<=3;y++)for(let xx=1;xx<=3;xx++)tiles.set(y*10+xx,{id:y*10+xx,x:xx,y,ownerId:0,settlementId:'A',stocks:{food:xx===1&&y===1?90:0}});
tiles.set(24,{id:24,x:4,y:2,ownerId:0,settlementId:'B',stocks:{food:250}});
const v={id:0,name:'통제국',territory:new Set(tiles.keys()),residents:[],v32e1:{lastFoodRelayCal:-999},v32e2:{},v32d5:{},logisticsStats:{}};
for(const t of tiles.values())for(let k=0;k<(t.id===24?5:10);k++)v.residents.push({alive:true,homeTileId:t.id,age:25,hunger:20,assignment:'FARMER'});
const events=[],w={activeVillages:[v],villages:[v],map:{get:id=>tiles.get(Number(id))},calendarOrdinalDay:()=>6,telemetry:{record:(...args)=>events.push(args)}};
function sid(id){return tiles.get(Number(id)).settlementId;}
function members(id){return [...tiles.values()].filter(t=>t.settlementId===sid(id));}
v.stockAt=id=>members(id).reduce((s,t)=>s+t.stocks.food,0);
v.withdrawAt=(id,k,qty)=>{let remaining=qty,taken=0;for(const t of members(id)){const take=Math.min(t.stocks.food,remaining);t.stocks.food-=take;taken+=take;remaining-=take;}return taken;};
v.depositAt=(id,k,qty)=>{let remaining=qty,put=0;for(const t of [tiles.get(Number(id)),...members(id).filter(t=>t.id!==id)]){const add=Math.min(1000-t.stocks.food,remaining);t.stocks.food+=add;put+=add;remaining-=add;}return put;};
v.internalPathCost=(a,b)=>{const t=tiles.get(a),u=tiles.get(b);return .62*(Math.abs(t.x-u.x)+Math.abs(t.y-u.y));};
v.internalLogisticsCapacity=()=>({capacity:14,cost:1});
// Retain the real ledger methods but use a test-specific storage capacity.
const realD3=NS.V034D3;
NS.V034D3={...realD3,stockRaw:(world,id)=>world.map.get(Number(id)).stocks.food,physicalCap:()=>1000};
const originalTotal=[...tiles.values()].reduce((a,t)=>a+t.stocks.food,0);
const grouped=NS.V034G2.groups(v,w);assert.equal(grouped.length,2);assert.equal(grouped.find(g=>g.sid==='A').pop,90);assert.equal(grouped.find(g=>g.sid==='A').stock,90);
NS.V034G2.relay(w);
const result=NS.V034G2.summary(w),log=result.retainedRoutes;
assert.equal(result.shipments,1,JSON.stringify(result));
assert.equal(result.conservationErrors,0);
assert.equal(result.invalidEndpoints,0);
assert.equal(events.filter(e=>e[0]==='NATIONAL_FOOD_RELAY32D5').length,1);
assert.equal(events[0][2].fromSettlementId,'B');assert.equal(events[0][2].toSettlementId,'A');
assert.equal(events[0][2].fromTileId,24);assert.equal(events[0][2].toTileId,23);
assert(Math.abs(events[0][2].routeCost-.62)<.001);
assert(Math.abs([...tiles.values()].reduce((a,t)=>a+t.stocks.food,0)-originalTotal)<1e-6);
assert(!events.some(e=>e[2]?.fromSettlementId===e[2]?.toSettlementId));
assert(result.quantity>0);
// All food is shared within the A Settlement: a 1,1-local stock of zero is
// not a separate demand; the entire group is one receiver.
assert.equal(NS.V034G2.groups(v,w).filter(g=>g.sid==='A').length,1);
// Repeated same calendar day is gated by E2's existing six-day cadence.
NS.V034G2.relay(w);assert.equal(NS.V034G2.summary(w).shipments,1);
// Endpoint choice is based on REAL route cost, not Manhattan nearest neighbor.
const supply=NS.V034G2.groups(v,w).find(g=>g.sid==='B'),needGroup=NS.V034G2.groups(v,w).find(g=>g.sid==='A');
const baselineRoute=v.internalPathCost;
v.internalPathCost=(a,b)=>b===13?.5:b===23?Infinity:10;
let pairRoute=NS.V034G2.bestPair(v,w,supply,needGroup,new Map(),{routePairsChecked:0,routePairsReachable:0,routeCacheHits:0});
assert.equal(pairRoute.from,24);assert.equal(pairRoute.to,13);assert.equal(pairRoute.cost,.5);
v.internalPathCost=()=>null;
pairRoute=NS.V034G2.bestPair(v,w,supply,needGroup,new Map(),{routePairsChecked:0,routePairsReachable:0,routeCacheHits:0});
assert.equal(pairRoute,null,'null/blocked paths cannot be treated as zero-cost');
v.internalPathCost=baselineRoute;
// Self-delivery remains disallowed even when the receiver has multiple tiles.
v.territory.delete(24);v.residents=v.residents.filter(p=>p.homeTileId!==24);w.calendarOrdinalDay=()=>12;
NS.V034G2.relay(w);assert.equal(NS.V034G2.summary(w).shipments,1);
NS.V034D3=realD3;
// Native-world regressions: G2 should be stable with its changed decision rules,
// not numerically identical to G1B now that policy changes.
const dayCount=Number(process.env.G2A_DAYS||30),world=new NS.World(19,19);for(let i=0;i<dayCount;i++)world.advanceOneDay();
const d=NS.V034D3.audit(world),f=NS.V034F2.diagnostics(world),g=NS.V034G2.summary(world);
assert(d.ok,JSON.stringify(d.errors));assert.equal(f.duplicateMetabolismRequests,0);assert.equal(f.missingHomes,0);assert.equal(g.conservationErrors,0);assert.equal(world.serialize().version,'V0.34H3');
const loaded=NS.World.from(JSON.parse(JSON.stringify(world.serialize())));assert.equal(loaded.serialize().version,'V0.34H3');
const oldSave={...world.serialize(),version:'V0.34G1B'};delete oldSave.v034g2a;assert.equal(NS.World.from(JSON.parse(JSON.stringify(oldSave))).serialize().version,'V0.34H3');
assert.equal(NS.Telemetry.prototype.toJSON.call(world.telemetry,world).version,'V0.34H3');
console.log(JSON.stringify({status:'PASS',scenario:{from:events[0][2].fromTileId,to:events[0][2].toTileId,qty:events[0][2].qty,actualCost:events[0][2].routeCost,conservationErrors:result.conservationErrors},natural:{days:dayCount,pop:world.villages.reduce((a,v)=>a+v.population(),0),settlementReads:g.settlementReads,routePairs:g.routePairsChecked,shipments:g.shipments,conservationErrors:g.conservationErrors,rngCalls:x.calls(),metabolismDuplicates:f.duplicateMetabolismRequests}},null,2));
