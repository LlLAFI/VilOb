'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
function boot(seed=0x34d3b3,source=html){let rng=seed>>>0,randomCalls=0;const rand=Object.create(Math);rand.random=()=>{randomCalls++;rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
 const make=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const db=new Map(),ctx={console,Math:rand,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{head:make(),body:make(),documentElement:make(),createElement:make,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return {NS:ctx.VSim,ctx,calls:()=>randomCalls};}
function setup(NS){const w=new NS.World(19,19),v=w.villages[0],C=NS.V034C,diamond=[[0,0],[-1,0],[1,0],[0,-1],[0,1],[-2,0],[2,0],[0,-2],[0,2],[-1,-1],[-1,1],[1,-1],[1,1]];let core=null;
 for(let y=2;y<17&&!core;y++)for(let x=2;x<17&&!core;x++)if(diamond.every(([dx,dy])=>w.map.at(x+dx,y+dy)?.ownerId==null))core=w.map.at(x,y);
 assert(core);v.technologies.add('ROADS');C.ensure(w);
 for(const [dx,dy] of diamond){const t=w.map.at(core.x+dx,core.y+dy);t.terrain='plain';t.buildings=(dx===0&&dy===0)?['road','house']:['road'];t.buildingCondition=t.buildings.map(()=>100);t.ownerId=v.id;v.territory.add(t.id);}
 for(let i=0;i<12;i++){w.year=2+i;C.review(w);if(C.byTile(w,core.id)?.tileIds.length===13)break;}
 assert.equal(C.byTile(w,core.id).tileIds.length,13);
 // Representatives live on the grouped tiles; a large remainder lives outside
 // this Settlement, emulating a late-stage nation with small local communities.
 for(let i=0;i<240;i++)v.residents.push({id:'bench-'+i,alive:true,age:i%3?30:9,homeTileId:i<18?core.id:v.coreTileId,job:'무직',assignment:null});
 return {w,v,core,m:C.byTile(w,core.id)};
}
function oldMembers(v,id){const w=v?._world,t=w?.map?.get(Number(id)),eq=(a,b)=>String(a)===String(b);if(!t||!eq(t.ownerId,v.id))return null;const sid=t.settlementId;if(sid==null)return null;const rec=w._v34bActive?.get(String(sid))||(w.v34b?.settlements||[]).find(r=>eq(r.id,sid)&&r.lifecycle==='ACTIVE');if(!rec||!eq(rec.nationId,v.id)||rec.lifecycle!=='ACTIVE')return null;const ids=(rec.tileIds||[]).map(Number).filter(tid=>{const x=w.map.get(tid);return x&&eq(x.ownerId,v.id)&&eq(x.settlementId,sid)&&!(x.v33OccupierId!=null&&!eq(x.v33OccupierId,v.id));});if(!ids.includes(Number(id)))return null;return {sid,ids,core:Number(rec.coreTileId)};}
function priorDays(v,id){const m=oldMembers(v,id);if(!m||m.ids.length<2)return null;const set=new Set(m.ids),people=(v.residents||[]).filter(p=>p.alive!==false&&set.has(Number(p.homeTileId)));if(!people.length)return 999;const demand=people.reduce((n,p)=>n+(Number(p.age)<15?.30:.42),0),food=m.ids.reduce((n,tid)=>n+Math.max(0,Number(v._world.map.get(tid)?.stocks?.food)||0),0);return food/Math.max(.12,demand);}
const {NS,ctx}=boot(),{w,v,core,m}=setup(NS),D=NS.V034D3;
assert.equal(NS.RELEASE_VERSION,'V0.34D3B3B');assert.equal(NS.V034D3B3.samplingEnabled(),false);assert.equal(ctx.document.title,'Village Observer V0.34D3B3B');
const ref=oldMembers(v,core.id),next=D.members(v,core.id);assert.deepEqual([...next.ids],[...ref.ids]);
assert(Math.abs(priorDays(v,core.id)-v.settlementReserveDays(core.id))<1e-10,'reserve denominator matches original');
// In-place occupation invalidates the physical pool WITHOUT changing the
// Settlement record or its tileIds array. Vacating instantly restores it.
const other=m.tileIds.find(id=>id!==core.id),t=w.map.get(other);t.stocks.food=17;
const before=v.stockAt(core.id,'food');t.v33OccupierId=1;
assert(!D.members(v,core.id).ids.includes(other));assert(Math.abs(v.stockAt(core.id,'food')-(before-17))<1e-8);
t.v33OccupierId=null;assert(D.members(v,core.id).ids.includes(other));assert(Math.abs(v.stockAt(core.id,'food')-before)<1e-8);
// Changing settlement record contents with no calendar advance is detected.
const original=m.tileIds;m.tileIds=[...original].filter(id=>id!==other);t.settlementId=null;
assert.equal(D.members(v,core.id).ids.length,12);m.tileIds=original;t.settlementId=m.id;
assert.equal(D.members(v,core.id).ids.length,13);
// V26 invalidation on migration changes the reserve denominator immediately.
const resident=v.residents.find(p=>p.id==='bench-0'),prior=v.settlementReserveDays(core.id);resident.homeTileId=v.coreTileId;
assert(Math.abs(priorDays(v,core.id)-v.settlementReserveDays(core.id))<1e-10);assert.notEqual(prior,v.settlementReserveDays(core.id));
// Sampled B3 profiler never records unless explicitly enabled.
assert.equal(NS.V034D3B3.stats(w).dayAdvances,0);
const synthetic=v.residents.filter(p=>String(p.id).startsWith('bench-'));v.residents=v.residents.filter(p=>!String(p.id).startsWith('bench-'));
const clean=JSON.parse(JSON.stringify(w.serialize()));assert.equal(clean.version,'V0.34D3B3B');const reload=NS.World.from(clean);assert.equal(reload.serialize().version,'V0.34D3B3B');assert(NS.V034D3.audit(reload).ok);
const older={...clean,version:'V0.34D3B2'};delete older.v034d3b3;const migrated=NS.World.from(older);assert.equal(migrated.serialize().version,'V0.34D3B3B');
v.residents.push(...synthetic);
console.log(JSON.stringify({result:'PASS',version:'V0.34D3B3B',groupTiles:m.tileIds.length,syntheticResidents:v.residents.length,occupierInvalidation:true,migrationInvalidation:true,saveB2Import:true,releaseNotes:NS.PATCH_NOTES[0].version}));
