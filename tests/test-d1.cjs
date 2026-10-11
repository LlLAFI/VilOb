/* V0.34D1 aggregate regression: non-invasive, same-day refresh, independent audit, D1 save. */
const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
let state=0x71abc013,calls=0;const math=Object.create(Math);math.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};
const fakeEl=()=>({style:{},addEventListener(){},appendChild(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
const storage=new Map(),ctx={console,Math:math,Date,Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:fakeEl(),documentElement:fakeEl(),body:fakeEl(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:fakeEl}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){try{new vm.Script(m[1],{filename:'script'+i}).runInContext(ctx,{timeout:10000});}catch(e){if(!/onclick/.test(e.message))throw e;}}
const NS=ctx.VSim,digest=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
const w=new NS.World(19,19);assert.equal(NS.V034D1.version,'V0.34D1');
const withoutTime=w=>{const x=JSON.parse(JSON.stringify(w.serialize()));delete x.telemetry;return x;};
const before=digest(withoutTime(w)),rng=calls;const rows=NS.V034D1.all(w),report=NS.V034D1.audit(w,rows);
assert(report.ok,report.errors.slice(0,10).join(' | '));assert.equal(digest(withoutTime(w)),before,'aggregate mutated world');assert.equal(calls,rng,'aggregate consumed RNG');
assert(rows.length>0);assert.equal(rows.reduce((s,r)=>s+r.population,0),w.villages.reduce((s,v)=>s+(v.residents||[]).filter(p=>p.alive!==false).length,0));
for(const r of rows){assert.equal(r.population,r.people.total);assert.equal(r.population,r.housing.residents);assert.equal(r.tileIds.length,r.tiles);for(const k of NS.V034D1.resources)assert(Math.abs(r.resources[k]-r.tileDetails.reduce((sum,t)=>sum+t.stocks[k],0))<1e-7);}
const r=rows.find(r=>r.tiles>0),t=w.map.get(r.tileIds[0]);assert(t);const oldStock=Number(t.stocks?.wood||0),oldGold=Number(t.v29Economy?.marketGold||0);
// Same-day direct stock change must be immediately visible (old V34C day-cache would go stale).
const value=oldStock+2.75;t.stocks.wood=value;const latest=NS.V034D1.aggregate(w,r.settlementId);assert(Math.abs(latest.resources.wood-(r.resources.wood+2.75))<1e-7,'stale wood');
if(!t.v29Economy)t.v29Economy={};t.v29Economy.marketGold=oldGold+0.9;const next=NS.V034D1.aggregate(w,r.settlementId);assert(Math.abs(next.finance.marketGold-(r.finance.marketGold+0.9))<1e-7,'stale market Gold');
const after=NS.V034D1.audit(w);assert(after.ok,after.errors.slice(0,8).join(' | '));
let csv=NS.V034D1.csv(w).split('\n');assert.equal(csv.length,rows.length+1);assert.equal(new Set(csv[0].split(',')).size,NS.V034D1.columns.length);
// Restored current-version world must preserve new version and complete physical state.
NS.SaveSystem.save(w);const restored=NS.SaveSystem.load();assert.equal(restored.serialize().version,'V0.34D1A');const nativeTiles=x=>x.map.tiles.filter(t=>t.ownerId!==null&&t.ownerId!==undefined).map(t=>({id:t.id,owner:t.ownerId,settlementId:t.settlementId,stocks:t.stocks,buildings:t.buildings,condition:t.buildingCondition,marketGold:t.v29Economy?.marketGold}));
// The legacy loader fills absent default fields; compare authoritative stored physical facts.
const owned=(world)=>world.map.tiles.filter(t=>t.ownerId!==null&&t.ownerId!==undefined);
for(const src of owned(w)){const t=restored.map.get(src.id);assert.equal(t.ownerId,src.ownerId);assert.equal(t.settlementId,src.settlementId);
 assert.deepEqual(JSON.parse(JSON.stringify(t.buildings)),JSON.parse(JSON.stringify(src.buildings)),'buildings changed during load');
 assert.deepEqual(JSON.parse(JSON.stringify(t.buildingCondition.slice(0,src.buildings.length))),JSON.parse(JSON.stringify(src.buildingCondition.slice(0,src.buildings.length))),'building condition changed');
 assert.deepEqual(JSON.parse(JSON.stringify(t.stocks)),JSON.parse(JSON.stringify(src.stocks)),'stocks changed during load');
 assert.equal(t.v29Economy?.marketGold,src.v29Economy?.marketGold,'market Gold changed');
}
assert.deepEqual(JSON.parse(JSON.stringify(NS.V034D1.all(restored))),JSON.parse(JSON.stringify(NS.V034D1.all(w))),'Settlement aggregate changed after save/load');
assert.equal(restored.telemetry.entries.length,w.telemetry.entries.length,'save/load added events');
const backup=NS.V034D1.all(restored),b=NS.V034D1.audit(restored,backup);assert(b.ok,b.errors.slice(0,8).join(' | '));
// Synthetic adjacent claimed tile joins an active Settlement. This is an observation fixture, not a gameplay claim.
const live=NS.V034D1.all(restored),one=live.find(q=>q.tiles===1),nation=restored.villages.find(v=>String(v.id)===String(one.nationId)),t0=restored.map.get(one.coreTileId);
const extra=restored.map.neighbors4(t0.id).find(t=>t.ownerId===null&&NS.TERRAIN[t.terrain]?.passable);
if(extra){extra.ownerId=nation.id;nation.territory.add(extra.id);const singleton=restored.v34b.settlements.find(q=>q.id===extra.settlementId);if(singleton&&singleton.id!==one.settlementId){singleton.lifecycle='MERGED';singleton.mergedIntoId=one.settlementId;singleton.tileIds=[];restored._v34bActive?.delete(String(singleton.id));}extra.settlementId=one.settlementId;const record=restored.v34b.settlements.find(q=>q.id===one.settlementId);record.tileIds=[t0.id,extra.id].sort((a,b)=>a-b);const changed=NS.V034D1.aggregate(restored,one.settlementId);assert.equal(changed.tiles,2);
 const reread=NS.V034D1.audit(restored);assert(reread.ok,reread.errors.slice(0,8).join(' | '));
}
const snap=restored.telemetry.snapshot(restored,'MANUAL','D1 audit');assert.equal(snap.global.d1AggregateErrors,0,'snapshot audit mismatch');
const dev=restored.telemetry.toJSON(restored);assert.equal(dev.worldSummary.v034d1Aggregate.ok,true,'devlog audit failed');
console.log(JSON.stringify({result:'PASS',version:'V0.34D1',settlements:rows.length,tiles:report.claimedTiles,people:report.people,csvColumns:NS.V034D1.columns.length,sameDayStock:true,sameDayMarketGold:true,saveRoundTrip:true,syntheticMultiTile:!!extra,readOnly:true,rngConsumption:0}));
