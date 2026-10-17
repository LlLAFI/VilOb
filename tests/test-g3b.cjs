'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..');
function boot(file){let calls=0,x=0x1234abcd;const math=Object.create(Math);math.random=()=>{calls++;x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296;};
 const elt=()=>({style:{},setAttribute(){},parentNode:null,innerHTML:'',textContent:'',appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const store=new Map(),ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:100000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};
}
const latest=boot(path.join(root,'tests/fixtures-for-g4-g3b.html')),base=boot(path.join(root,'tests/fixtures-for-g3b-baseline.html'));
const NS=latest.NS,G=NS.V034G3,G3B=NS.V034G3B;
assert.equal(NS.RELEASE_VERSION,'V0.34G3B');assert.equal(G3B.joinLimit,1);assert(G3B.verify(new NS.World(19,19)).ok);
const tiles=new Map();for(let y=0;y<19;y++)for(let x=0;x<19;x++){const id=y*19+x;tiles.set(id,{id,x,y,terrain:'grass',ownerId:0,buildings:['road'],buildingCondition:[100],stocks:{food:id===180?123:0}});}
const core=9*19+9,one=core+1,two=core+2;
const vid={id:0,name:'교통 검증',residents:[{alive:true,homeTileId:core,age:30}],hasTech:t=>t==='ROADS',tileResidents:id=>id===core?[{alive:true}]:[]};
function world(N){const z=new Map([...tiles].map(([k,v])=>[k,{...v,buildings:[...v.buildings],buildingCondition:[...v.buildingCondition]}]));return {map:{get:id=>z.get(Number(id)),neighbors4:id=>{const t=z.get(Number(id));return [[t.x-1,t.y],[t.x+1,t.y],[t.x,t.y-1],[t.x,t.y+1]].filter(([x,y])=>x>=0&&y>=0&&x<19&&y<19).map(([x,y])=>z.get(y*19+x));}},villages:[vid],v34b:{settlements:[]},z};}
const w=world(NS),p=(a,b)=>{for(const id of a.tileIds)w.z.get(id).settlementId=a.id;for(const id of b.tileIds)w.z.get(id).settlementId=b.id;return NS.V034C.canJoin(w,a,b);};
const r=(id,ids,coreTileId)=>({id,nationId:0,coreTileId,tileIds:ids,createdCalendarDay:0,lifecycle:'ACTIVE'});
const a=r('A',[core],core),b=r('B',[one],one);w.z.get(core).buildings.push('house');w.z.get(core).buildingCondition.push(100);
assert(p(a,b),'one road step .62 should pass both directions');
const exact=w.z.get(one);exact.buildings=[];exact.buildingCondition=[];const center=w.z.get(core);center.buildings=['house'];center.buildingCondition=[100];
assert(p(a,b),'unpaved one step exactly 1.00 should pass both ways');
exact.buildings=['road'];exact.buildingCondition=[100];center.buildings=['road','house'];center.buildingCondition=[100,100];
const a2=r('A',[core,one],core),b2=r('B',[two],two);
assert.equal(p(a2,b2),null,'two road steps 1.24 must fail both possible cores');
assert.equal(G3B.summary(w).joinRejectedOverOneDay,1);
const wOld=world(base.NS);for(const id of [core,one])wOld.z.get(id).settlementId='A';wOld.z.get(two).settlementId='B';wOld.z.get(core).buildings.push('house');wOld.z.get(core).buildingCondition.push(100);
assert(base.NS.V034C.canJoin(wOld,a2,b2),'G3A accepts same 2-step .62+.62 route');
// Different forward/backward cost: from expensive destination to paved origin = .62,
// but from paved origin to expensive destination >1 (destination is unpaved forest).
const c=r('C',[one],one),d=r('D',[one+1],one+1);w.z.get(one).buildings=['road','house'];w.z.get(one).buildingCondition=[100,100];w.z.get(one+1).buildings=[];w.z.get(one+1).buildingCondition=[];w.z.get(one+1).terrain='forest';
assert.equal(p(c,d),null,'only return route is affordable, no join');
w.z.get(one+1).terrain='grass';w.z.get(one+1).buildings=['road'];w.z.get(one+1).buildingCondition=[20];
assert(p(c,d),'road condition 20 must act unpaved at exactly 1.00');
assert.equal(G3B.travelStats(w,[core,one,two],core).max,1.62); // center still paved, middle paved, distant now B road? 2 roads =>1.24
// Policy is split-isolated: R2 join=1, original R2 split=1.40; R3 join=1, split=3.45.
let pg=G.policy(w,[core,one],core);assert.equal(pg.join,1);assert(Math.abs(pg.split-1.4)<1e-8);
vid.residents=Array.from({length:32},()=>({alive:true,homeTileId:core}));
center.buildings=['road','house','school','market','warehouse','academy','forge'];center.buildingCondition=center.buildings.map(()=>100);
pg=G.policy(w,[core,one,two],core);assert.equal(pg.tier,4);assert.equal(pg.join,1);assert(Math.abs(pg.split-4.69)<1e-8);
// Genuine G3A save loads into G3B without mutating settled pooled-stock rules or forced splits.
const oldWorld=new base.NS.World(19,19),priorSave=JSON.parse(JSON.stringify(oldWorld.serialize()));assert.equal(priorSave.version,'V0.34G3A');
const migrated=NS.World.from(priorSave);assert.equal(migrated.serialize().version,'V0.34G3B');
const countsBefore=NS.V034C.inspect(migrated).counts;for(let day=0;day<30;day++)migrated.advanceOneDay();
const countsAfter=NS.V034C.inspect(migrated).counts;assert(countsAfter.activeSettlements>0);assert(NS.V034D3.audit(migrated).ok);assert.equal(NS.V034F2.diagnostics(migrated).duplicateMetabolismRequests,0);
const vAudit=G3B.audit(migrated);assert(vAudit.integrity.ok,JSON.stringify(vAudit.integrity));assert.equal(vAudit.failures.physical,0);assert.equal(vAudit.failures.conservation,0);
const read1=JSON.stringify(G3B.summary(migrated)),report1=migrated.telemetry.toJSON(migrated);migrated.telemetry.toJSON(migrated);assert.equal(read1,JSON.stringify(G3B.summary(migrated)),'read-only observability');
assert.equal(report1.version,'V0.34G3B');assert.equal(report1.worldSummary.v034g3b.joinLimit,1);
const pool=NS.V034D3;assert.equal(typeof pool.audit,'function');
// Check a synthetic 4-tile imported settled cluster is grandfathered, and not force-split.
const imported=NS.World.from(priorSave),active=imported.v34b.settlements.find(s=>s.lifecycle==='ACTIVE'&&s.tileIds.length>1);
if(active){assert.equal(active.v034g3bLegacy,true);const before=NS.V034C.inspect(imported);assert(before.ok);}
console.log(JSON.stringify({status:'PASS',G3B:'one-day bidirectional gate',oldG3A:'two-step allowed',rejected:G3B.summary(w).joinRejectedOverOneDay,preSettlement:countsBefore.activeSettlements,postSettlement:countsAfter.activeSettlements,allAudits:'PASS'}));
