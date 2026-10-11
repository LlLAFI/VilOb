/* D3: physical resource conservation, pooled consumer access, cross-settlement isolation,
 * storage spillover, food flow observation and market non-double-counting. */
'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
function boot(seed=0x11938201){let state=seed>>>0,calls=0;const m=Object.create(Math);m.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};const make=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const storage=new Map();const context={console,Math:m,Date:class FixedDate extends Date{static now(){return 1760101000000;}},Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:make(),documentElement:make(),body:make(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:make}};context.window=context;context.addEventListener=()=>{};vm.createContext(context);for(const [i,script] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries())try{new vm.Script(script[1],{filename:'block-'+i}).runInContext(context,{timeout:10000});}catch(e){if(!/onclick/.test(e.message))throw e;}return {NS:context.VSim,rng:()=>calls,setSeed:s=>{state=s>>>0;calls=0;}};}
const x=boot(),NS=x.NS,D=NS.V034D3;
assert.equal(D.version,'V0.34D3');const w=new NS.World(19,19),v=w.villages[0],core=w.map.get(v.coreTileId),other=w.map.neighbors4(core.id).find(t=>t.ownerId==null&&NS.TERRAIN[t.terrain]?.passable);assert(other);
const rec=w.v34b.settlements.find(z=>String(z.id)===String(core.settlementId));
other.ownerId=v.id;other.settlementId=core.settlementId;v.territory.add(other.id);rec.tileIds=[...rec.tileIds,other.id];
const initialCap=D.physicalCap(v,core.id,'food'),sideCap=D.physicalCap(v,other.id,'food');
core.stocks.food=0;other.stocks={...(other.stocks||{}),food:16,wood:9,stone:7,iron_ore:3,iron:2,tools:1};
const p=v.residents.find(p=>p.alive!==false&&p.homeTileId===core.id);
assert.equal(v.stockAt(core.id,'food'),16,'shared food visible at home');assert.equal(v.stockAt(other.id,'food'),16);
// One nation may own separate Settlements. They must not share their inventories.
const isolated=w.map.neighbors4(core.id).find(t=>t.ownerId==null&&t.id!==other.id&&NS.TERRAIN[t.terrain]?.passable);assert(isolated);isolated.ownerId=v.id;isolated.settlementId='st-d3-isolated';v.territory.add(isolated.id);w.v34b.settlements.push({id:'st-d3-isolated',nationId:v.id,coreTileId:isolated.id,tileIds:[isolated.id],lifecycle:'ACTIVE'});isolated.stocks={...(isolated.stocks||{}),food:21};assert.equal(v.stockAt(core.id,'food'),16);assert.equal(v.stockAt(isolated.id,'food'),21);
assert.equal(D.stockRaw(w,core.id,'food'),0,'physical ownership remains tile-based');
assert.equal(v.settlementCaps(core.id).food,initialCap+sideCap,'all storage joins');
assert.equal(v.stockAt(core.id,'iron_ore'),3,'industrial material shared');
assert.equal(v.withdrawAt(core.id,'food',5),5);assert.equal(D.stockRaw(w,other.id,'food'),11);assert.equal(v.stockAt(core.id,'food'),11);
assert.equal(v.withdrawAt(core.id,'tools',.5),.5);assert.equal(v.stockAt(other.id,'tools'),.5);
core.stocks.food=initialCap-.25;other.stocks.food=0;
assert.equal(v.depositAt(core.id,'food',5),5,'overflow stored at other member tile');
assert.equal(D.stockRaw(w,core.id,'food'),initialCap,'local stock fills first');
assert.equal(D.stockRaw(w,other.id,'food'),4.75);
// Market Gold is transferred conservatively from other member tiles.
core.v29Economy=core.v29Economy||{marketGold:0};other.v29Economy=other.v29Economy||{marketGold:0};core.v29Economy.marketGold=1;other.v29Economy.marketGold=8;const moneyBefore=core.v29Economy.marketGold+other.v29Economy.marketGold;assert.equal(D.fundMarketGold(v,w,core.id,5),5);assert.equal(core.v29Economy.marketGold,6);assert.equal(other.v29Economy.marketGold,3);assert.equal(core.v29Economy.marketGold+other.v29Economy.marketGold,moneyBefore);
assert.equal(v.stockAt(core.id,'food'),initialCap+4.75);
// Deliberately wipe only own group, not other nation's stocks.
const foreign=w.villages[1],ft=w.map.get(foreign.coreTileId);ft.stocks.food=31;
const noAccess=v.withdrawAt(core.id,'food',9999);
assert.equal(noAccess,initialCap+4.75);assert.equal(ft.stocks.food,31);assert.equal(isolated.stocks.food,21);
const childNeed=(v.residents||[]).filter(p=>p.alive!==false&&p.age<15).length*.30,adultNeed=(v.residents||[]).filter(p=>p.alive!==false&&p.age>=15).length*.42;
other.stocks.food=14;core.stocks.food=0;
assert(Math.abs(v.settlementReserveDays(core.id)-14/(childNeed+adultNeed))<1e-8,'shared reserve denominator must count whole Settlement');
const recorded=D.stats(w),beforeRequest=recorded.foodMealRequested;
p.metabolism(v,w,false);
assert(recorded.foodMealRequested>beforeRequest,'actual Person meal request observed');
assert(recorded.foodMealReceived>0,'Person draws food from another member tile');
assert(D.stockRaw(w,core.id,'food')===0,'Person did not need physical relocation');
const beforeHarvest=x.rng(),rows=D.economyRows(w);
assert(rows.length>=7);assert.equal(beforeHarvest,x.rng(),'observation must consume no RNG');
assert(D.csv(w).split('\n')[0].split(',').length===24,'new D3 Settlement Economy CSV column count');
// Same-Settlement trade cannot charge its own market for a fake transfer.
assert(D.sameSettlement(w,core.id,other.id,v.id));assert(!D.sameSettlement(w,core.id,ft.id,v.id));
assert.equal(v.internalLogisticsCapacity(core.id,other.id,'food',false).capacity,0);
// Cost and scarcity signals must be the same for the same economic pool.
const r1={id:core.id,t:core,prices:{food:.7,wood:.4,stone:.5},stock:{},caps:{},ratio:{}},r2={id:other.id,t:other,prices:{food:1.3,wood:.6,stone:.9},stock:{},caps:{},ratio:{}};
D.harmonizeMarketRows(v,w,new Map([[r1.id,r1],[r2.id,r2]]));assert.equal(r1.ratio.food,r2.ratio.food);assert.equal(r1.prices.food,r2.prices.food);
// A natural world (no manual fixture) retains stock/housing cross-audit after 200 days.
const y=boot(0x3d4929),z=y.NS,world=new z.World(19,19);y.setSeed(0x42776);for(let i=0;i<200;i++)world.advanceOneDay();
const verify=z.V034D3.audit(world);assert(verify.ok,verify.errors.join('|'));
assert(z.V034D2A.audit(world).ok);assert(z.V034D1.audit(world).ok);
const sav=world.serialize();assert.equal(sav.version,'V0.34D3A1');const restored=z.World.from(JSON.parse(JSON.stringify(sav)));assert(z.V034D3.audit(restored).ok);
assert.equal(z.V034D0.csvV2(world.telemetry.snapshotsCSV()).split('\n')[0].split(',').length,1683);
assert.equal(z.V034D1A.csv(world).split('\n')[0].split(',').length,48);
assert.equal(z.V034D2.csv(world).split('\n')[0].split(',').length,11);
console.log(JSON.stringify({result:'PASS',version:'V0.34D3',sharedGroupSize:2,sharedFood:true,sharedIron:true,sharedStorage:true,crossNationIsolation:true,foodMealObserved:true,sharedMarketQuote:true,physicalConservation:true,naturalDays:200,naturalAuditErrors:verify.errors.length,economyCSVColumns:24,snapshotColumns:1683}));
