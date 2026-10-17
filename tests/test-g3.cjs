'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(){let state=0x1243ce39,calls=0;const math=Object.create(Math);math.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}}),store=new Map();
 const ctx={Math:math,performance,console,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(path.join(root,'index-standalone.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:100000});}catch(e){if(!/onclick/.test(e.message))throw e;}}
 return {NS:ctx.VSim,calls:()=>calls};
}
const {NS,calls}=boot();assert.equal(NS.RELEASE_VERSION,'V0.34G3A');
const G=NS.V034G3;
assert.equal(G.version,'V0.34G3');
// Geometric control: a circle point (2,2) must be accepted at R3, but
// a point (3,1) is outside. Both forward & reverse real road cost matter.
const coords=new Map(),tiles=[];
for(let y=0;y<19;y++)for(let x=0;x<19;x++){const id=y*19+x,t={id,x,y,terrain:'grass',ownerId:0,buildings:['road'],buildingCondition:[100],stocks:{food:0}};coords.set(id,t);tiles.push(t);}
const core=9*19+9,at=(x,y)=>y*19+x;coords.get(core).buildings=['road','house','market','warehouse','school'];coords.get(core).buildingCondition=[100,100,100,100,100];
const v={id:0,name:'정착지 시험',hasTech:()=>true,residents:Array.from({length:35},()=>({alive:true,homeTileId:core,age:20}))};
const w={map:{get:id=>coords.get(Number(id)),neighbors4:id=>{const t=coords.get(Number(id));return [[t.x-1,t.y],[t.x+1,t.y],[t.x,t.y-1],[t.x,t.y+1]].filter(([x,y])=>x>=0&&y>=0&&x<19&&y<19).map(([x,y])=>coords.get(at(x,y)));}},villages:[v]};
const disk3=[],disk4=[];for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){if(dx*dx+dy*dy<=9)disk3.push(at(9+dx,9+dy));if(dx*dx+dy*dy<=16)disk4.push(at(9+dx,9+dy));}
assert.equal(disk3.length,29);assert.equal(disk4.length,49);
let p=G.policy(w,disk3,core);assert.equal(p.radius,3);assert.equal(p.cap,29);
assert.equal(G.withinRadius(w,disk3,core),true);
assert.equal(G.withinRadius(w,[core,at(11,11)],core),true);
assert.equal(G.withinRadius(w,[core,at(12,11)],core),false);
assert.equal(G.withinRadius(w,disk4,core),false);
const diamond=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<=2)diamond.push(at(9+dx,9+dy));
const bridge=at(11,10),extra=at(11,11),aGroup={id:'A',nationId:0,coreTileId:core,tileIds:diamond,createdCalendarDay:0},bGroup={id:'B',nationId:0,coreTileId:bridge,tileIds:[bridge,extra],createdCalendarDay:0};
for(const id of diamond)coords.get(id).settlementId='A';coords.get(bridge).settlementId='B';coords.get(extra).settlementId='B';
assert(NS.V034C.canJoin(w,aGroup,bGroup),'compiled spatial merge must accept R3 circle extension beyond 13');
G.config.spatialEnabled=false;assert.equal(NS.V034C.canJoin(w,aGroup,bGroup),null,'G2A old cap should reject the same merger');G.config.spatialEnabled=true;
const savedResidents=v.residents;w.v34b={settlements:[{...aGroup,lifecycle:'ACTIVE'}]};G.promote(w,w.v34b.settlements[0]);v.residents=[];
assert.equal(G.policy(w,diamond,core).tier,3,'growth tier must remain after temporary population decline');v.residents=savedResidents;delete w.v34b;
assert.equal(G.bothReachable(w,disk3,core,p.join),true);
// Same geometric reach, but physically unpaved long path fails path ceiling.
const temp=[];for(const id of disk3){if(id===core)continue;const t=coords.get(id);temp.push([t,t.buildings,t.buildingCondition]);t.buildings=[];t.buildingCondition=[];}
assert.equal(G.withinRadius(w,disk3,core),true);
assert.equal(G.bothReachable(w,disk3,core,p.join),false);
for(const [t,b,c] of temp){t.buildings=b;t.buildingCondition=c;}
coords.get(core).buildings.push('forum','archive');coords.get(core).buildingCondition.push(100,100);
p=G.policy(w,disk4,core);assert.equal(p.radius,4);assert.equal(p.cap,49);assert.equal(G.withinRadius(w,disk4,core),true);assert.equal(G.bothReachable(w,disk4,core,p.join),true);
// Crisis policy: G2A donor protected at 24 cycles; G3 can spare at most the
// part above 18 cycles, but only when national reserve >=20 cycles.
const realD3=NS.V034D3;
NS.V034D3={...realD3,stockRaw:(world,id)=>world.map.get(Number(id)).stocks.food,physicalCap:()=>1000};
function fixture({critical=true,food=92.4,receiver=0}={}){
 const z=new Map();function t(id,x,stock){z.set(id,{id,x,y:0,ownerId:0,settlementId:'s'+id,stocks:{food:stock}});}
 t(10,0,food);t(11,1,receiver);
 const residents=Array.from({length:10},()=>({alive:true,homeTileId:10,age:25,hunger:20,assignment:'FARMER'}));residents.push({alive:true,homeTileId:11,age:25,hunger:critical?99:20,assignment:'FARMER'});
 const v={id:0,name:'카이렌 위기',territory:new Set(z.keys()),residents,v32e1:{lastFoodRelayCal:-999},v32e2:{},v32d5:{},logisticsStats:{}};
 v.stockAt=id=>z.get(id).stocks.food;
 v.withdrawAt=(id,k,q)=>{const t=z.get(id),amt=Math.min(q,t.stocks.food);t.stocks.food-=amt;return amt;};
 v.depositAt=(id,k,q)=>{const t=z.get(id),amt=Math.min(q,1000-t.stocks.food);t.stocks.food+=amt;return amt;};
 v.internalPathCost=()=>.62;v.internalLogisticsCapacity=()=>({capacity:14});
 const ev=[],w={activeVillages:[v],villages:[v],map:{get:id=>z.get(Number(id))},calendarOrdinalDay:()=>6,telemetry:{record:(...a)=>ev.push(a)}};
 return {w,z,ev,total:food+receiver};
}
G.config.foodEnabled=false;
const old=fixture();NS.V034G2A.relay(old.w);assert.equal(NS.V034G2A.summary(old.w).shipments,0);
G.config.foodEnabled=true;
const critical=fixture();NS.V034G2A.relay(critical.w);
const a=NS.V034G2A.summary(critical.w);
assert.equal(a.shipments,1,JSON.stringify(a));assert.equal(a.reserveViolations,0);
assert.equal(critical.ev[0][2].reliefMode,'IMMINENT');assert.equal(critical.ev[0][2].reliefFloorCycles,18);
assert(critical.z.get(10).stocks.food>=75.6-1e-7);assert(critical.z.get(10).stocks.food<100.8);
assert(Math.abs(critical.total-[...critical.z.values()].reduce((acc,t)=>acc+t.stocks.food,0))<1e-8);
assert.equal(G.summary(critical.w).emergencyShipments,1);
const lowCountry=fixture({food:77});NS.V034G2A.relay(lowCountry.w);assert.equal(NS.V034G2A.summary(lowCountry.w).shipments,0); // below national 20 cycles
const normal=fixture({critical:false});NS.V034G2A.relay(normal.w);assert.equal(NS.V034G2A.summary(normal.w).shipments,0);
NS.V034D3=realD3;
if(process.env.G3_DISABLE_SPATIAL)G.config.spatialEnabled=false;if(process.env.G3_DISABLE_FOOD)G.config.foodEnabled=false;
const days=Number(process.env.G3_DAYS||90),world=new NS.World(19,19),start=performance.now();for(let i=0;i<days;i++){world.advanceOneDay();if(process.env.G3_PROGRESS&&(i%90===89||(i>=800&&i%3===2)))console.error("CHECKPOINT",i+1,"elapsed",Math.round(performance.now()-start),"pop",world.villages.reduce((a,v)=>a+v.population(),0));}
const diag=NS.V034C.inspect(world),ledger=NS.V034D3.audit(world),f2=NS.V034F2.diagnostics(world),food=NS.V034G2A.summary(world);
assert(diag.ok,JSON.stringify(diag.errors).slice(0,1000));assert(ledger.ok,JSON.stringify(ledger.errors).slice(0,1000));assert.equal(f2.duplicateMetabolismRequests,0);assert.equal(f2.missingHomes,0);assert.equal(food.conservationErrors,0);assert.equal(food.reserveViolations,0);
const save=world.serialize();assert.equal(save.version,'V0.34G3A');assert.equal(NS.World.from(JSON.parse(JSON.stringify(save))).serialize().version,'V0.34G3A');
const predecessor={...save,version:'V0.34G2A'};delete predecessor.v034g3;
assert.equal(NS.World.from(JSON.parse(JSON.stringify(predecessor))).serialize().version,'V0.34G3A');
const dev=world.telemetry.toJSON(world);assert.equal(dev.version,'V0.34G3A');assert(dev.worldSummary.v034g3);
console.log(JSON.stringify({status:'PASS',geometry:{disk3:disk3.length,disk4:disk4.length,routeChecks:G.summary(w).pathSweeps},food:{baselineG2A:0,g3:a.shipments,donorAfter:critical.z.get(10).stocks.food,emergency:G.summary(critical.w).emergencyShipments},natural:{days,pop:world.villages.reduce((a,v)=>a+v.population(),0),settlements:diag.counts.activeSettlements,errors:diag.errors.length,foodShipments:food.shipments,conservationErrors:food.conservationErrors,ms:Math.round(performance.now()-start),rng:calls()}}));
