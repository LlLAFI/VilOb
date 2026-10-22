'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.resolve(__dirname,'../index-standalone.html'),'utf8');
let seed=54321;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const storage=new Map(),elt=()=>({style:{},dataset:{},textContent:'',innerHTML:'',addEventListener(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return []},appendChild(){},classList:{add(){},remove(){},toggle(){}}});
const ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,ArrayBuffer,Uint8Array,TextEncoder,TextDecoder,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},alert(){},confirm(){return false},localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
let count=0;for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim()){count++;try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e;}}
const NS=ctx.VSim;assert.equal(count,218);assert.equal(NS.RELEASE_VERSION,'V0.35G1');const g5=NS.V034H2A.verify();assert(g5.tests.techCount&&g5.tests.newTechs,'H2A inherited tech integrity must hold; old G5 release-version comparison is not current-version aware');
const w=new NS.World(19,19),v=w.activeVillages[0];NS.V034C.ensure(w);
const original=w.serialize(),unowned=w.map.tiles.filter(t=>t.ownerId==null&&NS.TERRAIN[t.terrain]?.passable);
let pair=null;for(const a of unowned){const b=w.map.neighbors4(a.id).find(b=>b.ownerId==null&&NS.TERRAIN[b.terrain]?.passable);if(b){pair=[a,b];break;}}
assert(pair,'Need two passable neighboring neutral tiles');
for(const t of pair){v.territory.add(t.id);t.ownerId=v.id;}
const [a,b]=pair,ar=NS.V034C.byTile(w,a.id),br=NS.V034C.byTile(w,b.id);
// Emulate an active merged multi-tile outpost with a non-national core.
ar.tileIds=[a.id,b.id];b.settlementId=ar.id;
br.tileIds=[];br.lifecycle='MERGED';br.mergedIntoId=ar.id;w._v34bActive.delete(br.id);
assert.equal(ar.coreTileId,a.id);
v.territory.delete(a.id);a.ownerId=null;
assert.equal(a.settlementId,null,'abandoned core tile link detached');
assert.equal(ar.coreTileId,b.id,'surviving claimed tile becomes Settlement core immediately');
assert.deepEqual(Array.from(ar.tileIds),[b.id]);
assert(NS.V034C.inspect(w).ok,'core-loss must preserve Settlement registry invariants');
// Simulate delayed (three-quarter) connectivity reviews without world tick.
for(let k=0;k<3;k++){w.v34c.pendingSplit[ar.id]=w.calendarOrdinalDay()-180;NS.V034C.review(w);}
assert.equal(a.settlementId,null,'the old core must never reappear as ghost after split review');
assert(NS.V034C.inspect(w).ok,'Settlement registry invariant must remain intact');
// Construct the exact H2 bad-save class (unowned tile whose ACTIVE Settlement still lists it).
const dirty=JSON.parse(JSON.stringify(w.serialize()));dirty.version='V0.34H2';
const ta=dirty.map.tiles.find(t=>t.id===a.id);ta.ownerId=null;ta.settlementId='st-0000241';
const originalStone=Number(ta.stocks?.stone||0);
dirty.v34b.settlements.push({schema:'village-observer-settlement',schemaVersion:2,id:'st-0000241',nationId:v.id,coreTileId:a.id,tileIds:[a.id],lifecycle:'ACTIVE',createdCalendarDay:5});
dirty.v34b.nextSettlementSeq=Math.max(dirty.v34b.nextSettlementSeq,242);
const prepared=NS.V034H2A.repairImport(dirty);assert.equal(prepared.repairs.length,1);assert.equal(prepared.repairs[0].action,'DETACH_AND_RETIRE');
assert.equal(ta.settlementId,'st-0000241','original import source must remain untouched');
const corrected=NS.World.from(dirty);assert(NS.V034C.inspect(corrected).ok,'H2 orphan-link legacy save accepted after targeted repair');
assert.equal(corrected.map.get(a.id).settlementId,null);
assert.equal(Number(corrected.map.get(a.id).stocks?.stone||0),originalStone,'no physical stock creation/removal');
assert.equal(corrected._h2aRepairedGhosts.length,1);
assert.equal(corrected.serialize().version,'V0.35G1');
NS.SaveSystem.save(corrected);assert(storage.has('village-observer-v035g1'));
assert.equal(NS.SaveSystem.load().serialize().version,'V0.35G1');
assert.equal(NS.V034H2A.repairImport(original).repairs.length,0,'clean saves stay untouched');
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,ghost:'blocked',coreRebased:true,legacyOrphanRepaired:1,unchangedPhysicalStock:true,scriptCount:count}));
