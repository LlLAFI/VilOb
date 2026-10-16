'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
const F3=process.env.G1_BASELINE_HTML||path.join(root,'index-G1-baseline.html');
const G1=path.join(root,'index-standalone.html');
function boot(file,seed=0x223355aa){let state=seed,calls=0;
 const rng=Object.create(Math);rng.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const storage=new Map(),ctx={Math:rng,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:50000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return{NS:ctx.VSim,calls:()=>calls,storage};
}
function run(file,days){const x=boot(file),w=new x.NS.World(19,19);for(let i=0;i<days;i++)w.advanceOneDay();
 const snap={date:[w.year,w.season,w.day],population:w.villages.map(v=>v.population()),food:w.villages.map(v=>+v.foodReserveDays().toFixed(6)),health:w.villages.map(v=>+(v.residents.filter(p=>p.alive).reduce((s,p)=>s+p.health,0)/Math.max(1,v.population())).toFixed(7)),happiness:w.villages.map(v=>+(v.residents.filter(p=>p.alive).reduce((s,p)=>s+p.happiness,0)/Math.max(1,v.population())).toFixed(7)),stocks:w.villages.map(v=>[...v.territory].reduce((s,id)=>s+x.NS.V034D3.stockRaw(w,id,'food'),0).toFixed(6)),territory:w.villages.map(v=>v.territory.size),rngCalls:x.calls()};
 const diag=x.NS.V034F2.diagnostics(w),physical=x.NS.V034D3.audit(w);assert(physical.ok,JSON.stringify(physical.errors));assert.equal(diag.duplicateMetabolismRequests,0);assert.equal(diag.missingHomes,0);return{x,w,snap,diag,digest:crypto.createHash('sha256').update(JSON.stringify(snap)).digest('hex')};
}
function isolatedAudit(){const {NS}=boot(G1);const cells=new Map(),v={id:0,name:'테스트국가'};for(let y=1;y<=3;y++)for(let x=1;x<=3;x++)cells.set(y*10+x,{id:y*10+x,x,y,ownerId:0,settlementId:'A'});
 cells.set(24,{id:24,x:4,y:2,ownerId:0,settlementId:'B'});
 v.territory=new Set(cells.keys()); const w={map:{get:id=>cells.get(Number(id))},calendarOrdinalDay:()=>19};
 const states=[...cells.values()].map(t=>({id:t.id,pop:t.id===24?5:10,stock:t.id===24?250:90,days:(t.id===24?250/1.8:25),severe:0,critical:0,adults:4,hunger:0}));
 NS.V034G1.observeFoodIndex(v,w,states);const s=NS.V034G1.summary(w);
 assert.equal(s.indexPulses,1);assert.equal(s.duplicateTileRows,8);assert(s.hiddenShortageTiles>=9);assert(s.falseDonorTiles>=9);assert.equal(s.duplicateDonorCandidates,8);
 const gs=NS.V034G1.group(v,w,states);assert.equal(gs.get('A').settlementDays,90/(90*.36));
 NS.V034G1.observePair(v,w,states[0],states[1],{capacity:0,reason:'D3_SHARED_POOL_NO_SHIPMENT'},{cost:2,cap:5});
 assert.equal(NS.V034G1.summary(w).sameSettlementFallbackPairs,1);
 NS.V034G1.observeShipment(v,w,states[0].id,states[1].id,3,2);assert.equal(NS.V034G1.summary(w).sameSettlementShipments,1);
 const geometry=NS.V034G1.endpointGeometry(w,v,24,11);assert.equal(geometry.base,4);assert.equal(geometry.best,1);assert.equal(geometry.bestTo,23);assert.equal(NS.V034G1.csv(w).split('\n').length,4); // header, one multi-tile group, pair, shipment
 const serialize=new NS.World(19,19).serialize();assert.equal(serialize.version,'V0.34G1A');assert.equal(NS.World.from(JSON.parse(JSON.stringify(serialize))).serialize().version,'V0.34G1A');
 const legacy={...serialize,version:'V0.34G1'};delete legacy.v034g1;assert.equal(NS.World.from(JSON.parse(JSON.stringify(legacy))).serialize().version,'V0.34G1A');
 // G1A index sampling on a real 3x3 multi-tile synthetic state.
 const tiles=new Map(),residents=[];
 for(let y=1;y<=3;y++)for(let x=1;x<=3;x++){
  const id=y*10+x;tiles.set(id,{id,x,y,ownerId:0,settlementId:'S-A'});
  for(let i=0;i<10;i++)residents.push({alive:true,homeTileId:id,hunger:18});
 }
 tiles.set(24,{id:24,x:4,y:2,ownerId:0,settlementId:'S-B'});
 for(let i=0;i<5;i++)residents.push({alive:true,homeTileId:24,hunger:18});
 const state={id:0,name:'통제국',territory:new Set(tiles.keys()),residents,stockAt:(id)=>id===24?250:90};
 const world2={activeVillages:[state],villages:[state],map:{get:id=>tiles.get(Number(id))},calendarOrdinalDay:()=>24};
 NS.V034G1A.sample(world2);
 const sample=NS.V034G1A.summary(world2);
 assert.equal(sample.sampleDays,1);assert.equal(sample.multiTileSamples,1);
 assert.equal(sample.hiddenShortageSettlements,1);assert.equal(sample.falseDonorSettlements,1);
 assert.equal(sample.duplicateDonorTiles,8);
 assert(NS.V034G1A.csv(world2).includes('S-A'));
 // G1A independently samples and catches an actual telemetry event.
 const world=new NS.World(19,19);for(let i=0;i<6;i++)world.advanceOneDay();
 const before=NS.V034G1A.summary(world);assert(before.sampleDays>=1);
 const nation=world.villages[0],fromTileId=Number([...nation.territory][0]);
 world.telemetry.record('NATIONAL_FOOD_RELAY32D5',world,{village:nation.name,villageId:nation.id,fromTileId,toTileId:fromTileId,qty:1.25,routeCost:1});
 const after=NS.V034G1A.summary(world);assert.equal(after.shipments,1);assert.equal(after.sameSettlementShipments,1);assert(NS.V034G1A.csv(world).includes('SHIPMENT'));
 return {legacy:s,liveObservation:after,multiTileSample:sample};
}
const fixture=isolatedAudit();
const results=[];for(const days of (process.env.G1_DAYS||'30').split(',').map(Number)){const b=run(F3,days),g=run(G1,days);assert.equal(JSON.stringify(g.snap),JSON.stringify(b.snap),'F3/G1 world+RNG '+days+'d');assert.equal(g.digest,b.digest);const summary=g.x.NS.V034G1A.summary(g.w);assert(summary.sampleDays>0);results.push({days,digest:g.digest,pop:g.snap.population.reduce((a,b)=>a+b,0),rngCalls:g.snap.rngCalls,cycles:g.diag.completedCycles,auditPulses:summary.sampleDays,rows:summary.retainedRows});}
console.log(JSON.stringify({status:'PASS',fixture,parity:results},null,2));
