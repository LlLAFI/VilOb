'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);const html=fs.readFileSync(path.join(root,file),'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return c.VSim;}
const stable=x=>JSON.stringify(x,(k,v)=>k==='realTime'||/^(?:elapsed|wall|cpu|profile|perf|memory|heap|duration)/i.test(k)||/(?:Ms|milliseconds)(?:\d+[A-Z0-9]*)?$/i.test(k)?undefined:v);
function addOwnedTile(world){const rec=world.v34b.settlements.find(x=>x.lifecycle==='ACTIVE');const v=world.villages.find(x=>String(x.id)===String(rec.nationId));const center=Number(rec.coreTileId),owned=Number(center-1),t=world.map.get(owned);assert.equal(t.ownerId,null);assert.equal(t.settlementId,null);
 t.ownerId=v.id;for(const extra of [...world.v34b.settlements]){if(extra.id!==rec.id&&extra.tileIds?.includes(owned)){world.v34b.settlements.splice(world.v34b.settlements.indexOf(extra),1);world._v34bActive?.delete?.(String(extra.id));}} t.settlementId=rec.id;v.territory.add(owned);rec.tileIds.push(owned);
 const first=world.map.get(center);first.stocks.food=11;first.stocks.wood=9;t.stocks.food=23;t.stocks.wood=7;
 return {rec,v,first,second:t};}
(async()=>{
 const old=boot('tests/fixtures/v035H1C2-standalone.html'),cur=boot('index-standalone.html');assert.equal(old.RELEASE_VERSION,'V0.35H1C2');assert.equal(cur.RELEASE_VERSION,'V0.35H1C3');
 const a=old.V035H1A.createWorld(),b=cur.V035H1A.createWorld();
 assert.equal(old.V035H1A.fingerprint(a),cur.V035H1A.fingerprint(b));
 for(let i=1;i<=90;i++){a.advanceOneDay();b.advanceOneDay();if(i%15===0){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG '+i);assert.equal(old.V035H1A.fingerprint(a),cur.V035H1A.fingerprint(b),'world '+i);}}
 assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries),'event payload/order');assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'snapshot values');assert.equal(stable(old.V034D3A.stats(a)),stable(cur.V034D3A.stats(b)),'food ledger');
 const c=cur.V035H1A.createWorld(),d=old.V035H1A.createWorld();let cc=addOwnedTile(c),dd=addOwnedTile(d);
 assert.equal(cur.V034D3.audit(c).ok,true,JSON.stringify(cur.V034D3.audit(c).errors));assert.equal(old.V034D3.audit(d).ok,true,'old normal case');
 const enemy=Number(c.villages.find(v=>String(v.id)!==String(cc.v.id)).id);
 cc.first.v33OccupierId=enemy;dd.first.v33OccupierId=enemy;
 const badPartial=old.V034D3.audit(d),goodPartial=cur.V034D3.audit(c);
 assert(badPartial.errors.some(x=>x.startsWith('POOL:')),'reproduce historical occupied POOL mismatch');
 assert(goodPartial.ok,JSON.stringify(goodPartial.errors));
 assert.equal(goodPartial.h1c3.occupiedMemberTiles,1);
 assert.equal(goodPartial.h1c3.accessible.food,23);assert.equal(goodPartial.h1c3.physical.food,34);
 cc.second.v33OccupierId=enemy;dd.second.v33OccupierId=enemy;
 const full=cur.V034D3.audit(c);assert(full.ok,JSON.stringify(full.errors));assert.equal(full.h1c3.fullyBlockedSettlements,1);
 assert.equal(cur.V034D3.members(cc.v,cc.first.id),null);assert.equal(cur.V034D3.members(cc.v,cc.second.id),null);
 // The real raw inventories remain untouched by the audit and occupation itself.
 assert.equal(cc.first.stocks.food,11);assert.equal(cc.second.stocks.food,23);
 cc.first.v33OccupierId=null;cc.second.v33OccupierId=null;
 assert(cur.V034D3.audit(c).ok,'liberation restores pool audit');assert.equal(cc.v.stockAt(cc.first.id,'food'),34);
 // WORLD invariant still trips for a physically owned tile omitted from registry.
 const orphan=c.map.get(cc.first.id+1);assert.equal(orphan.ownerId,null);orphan.ownerId=cc.v.id;orphan.stocks.food=19;for(const r of [...c.v34b.settlements])if(r.tileIds?.includes(orphan.id)){c.v34b.settlements.splice(c.v34b.settlements.indexOf(r),1);c._v34bActive?.delete?.(String(r.id));} assert(cur.V034D3.audit(c).errors.some(e=>e.startsWith('WORLD_food')||e.startsWith('D1:')),'independent physical audit detects orphaned ownership');
 const game=cur.V035H1A.createWorld(),ref=old.V035H1A.createWorld();const war={warId:'H1C3_TEST',attackerId:0,defenderId:1};
 for(const type of ['WAR_DECLARED33','WAR_ENDED33']){ref.telemetry.record(type,ref,war);game.telemetry.record(type,game,war);assert.equal(stable(ref.v33f5a3),stable(game.v33f5a3),type+' domain state parity');assert.equal(stable(ref.telemetry.entries),stable(game.telemetry.entries),type+' event record parity');}
 const counts=cur.V035H1C3.DomainEvents.report();assert(counts.WAR_DECLARED33>=1&&counts.WAR_ENDED33>=1,'new event handlers used');
 for(const type of ['TILE_OCCUPIED33','TILE_LIBERATED33']){game.telemetry.record(type,game,{warId:'H1C3_TEST',tileId:1,occupierId:1});}
 const after=cur.V035H1C3.DomainEvents.report();assert(after.TILE_OCCUPIED33>=1&&after.TILE_LIBERATED33>=1);
 assert.equal(cur.V035H1C3.report(b).at.calendarOrdinalDay,b.calendarOrdinalDay());
 assert.equal(cur.V035H1C3.report(b).saveFormatVersion,'V0.35H1B1A');
 const meta=b.telemetry.toJSON(b);assert.equal(meta.version,'V0.35H1C3');assert.equal(meta.saveFormatVersion,'V0.35H1B1A');
 // Explicit DomainEvent dispatch works without writing a Telemetry observation.
 const isolated=cur.V035H1A.createWorld();const legacyLog=isolated.telemetry.entries.length;
 isolated.telemetry.record=function(){};
 cur.V035H1C3.DomainEvents.dispatch('WAR_DECLARED33',isolated,war);
 assert(Object.keys(isolated.v33f5a3.warTargets).length>=1,'war declaration executed independently of record');
 assert.equal(isolated.telemetry.entries.length,legacyLog,'no Devlog dependency for direct event dispatch');
 // The H1C1 profiler should receive real E/F *leaf* segments.
 cur.V035H1C1.start(b);
 for(let j=0;j<15;j++)b.advanceOneDay();
 cur.V035H1B1.stopSnapshot();const leaf=cur.V035H1C1.report(b).snapshot.stages;
 for(const key of ['E4_CULTURE_METRICS','E4_WAR_SCAN','F5_MONEY_PARTS','F5_REALIZED_PRICES'])assert(leaf[key]?.calls>0,'leaf timer '+key);
 assert.equal(b.serialize().version,'V0.35H1B1A');
 const compressed=await cur.V035H1C.gzipCheckpoint(b,{download:false});const decoded=await cur.V035H1C.textFromCheckpoint(compressed.blob);assert.equal(decoded.compressed,true);
 const imported=await cur.V035H1A.importCheckpoint(decoded.text);assert.equal(cur.V035H1A.fingerprint(imported),cur.V035H1A.fingerprint(b));
 console.log(JSON.stringify({status:'PASS',days:90,worldRngAndObservationParity:true,partialOccupation:true,fullyOccupied:true,liberation:true,physicalAudit:true,domainEventParity:true,domainEventTypes:after,gzip:true,saveFormat:b.serialize().version}));
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
