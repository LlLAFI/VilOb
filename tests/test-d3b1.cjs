'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
function boot(seed=0x341b2){let state=seed>>>0;const random=Object.create(Math);random.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};const mk=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const db=new Map(),c={console,Math:random,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{head:mk(),body:mk(),documentElement:mk(),createElement:mk,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){}}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const m of src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(c,{timeout:10000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return c.VSim;}
const NS=boot(),w=new NS.World(19,19),v=w.villages[0],C=NS.V034C,B1=NS.V034D3B1;
assert.equal(w.serialize().version,'V0.34D3B1');assert.equal(C.constants.JOIN,1.24);assert.equal(C.constants.SPLIT,1.4);assert.equal(C.constants.MAX_TILES,13);assert.equal(B1.policy.RADIUS,2);
const radius=[[0,0],[-1,0],[1,0],[0,-1],[0,1],[-2,0],[2,0],[0,-2],[0,2],[-1,-1],[-1,1],[1,-1],[1,1]];
let center=null;
for(let y=2;y<17&&!center;y++)for(let x=2;x<17&&!center;x++){
 const arr=radius.map(([dx,dy])=>w.map.at(x+dx,y+dy));if(arr.every(t=>t?.ownerId==null))center=w.map.at(x,y);
}
assert(center,'unowned 13-tile footprint available');
v.technologies.add('ROADS');
C.ensure(w);const targetIds=[];
for(const [dx,dy] of radius){const t=w.map.at(center.x+dx,center.y+dy);t.terrain='plain';t.buildings=(dx===0&&dy===0)?['road','house']:['road'];t.buildingCondition=t.buildings.map(()=>100);t.ownerId=v.id;v.territory.add(t.id);targetIds.push(t.id);}
let counter=0;
for(let i=0;i<12;i++){
 w.year=i+2; C.review(w);counter++;
 const r=C.byTile(w,center.id);
 if(r?.tileIds?.length===13)break;
}
const centerRecord=C.byTile(w,center.id);
assert.equal(centerRecord.tileIds.length,13,`road-joined radius2 diamond must reach 13, got ${centerRecord.tileIds.length}`);
assert.deepEqual([...centerRecord.tileIds].sort((a,b)=>a-b),[...targetIds].sort((a,b)=>a-b));
assert.equal(C.inspect(w).ok,true,JSON.stringify(C.inspect(w).errors));
assert.equal(C.path(w,center.id,w.map.at(center.x+2,center.y).id,new Set(centerRecord.tileIds),2),1.24);
// The same 2-step path must not work without both physical road segments.
const mid=w.map.at(center.x+1,center.y),outer=w.map.at(center.x+2,center.y);
const before=C.path(w,center.id,outer.id,new Set(centerRecord.tileIds),1.24);
outer.buildingCondition[0]=10;
const after=C.path(w,center.id,outer.id,new Set(centerRecord.tileIds),1.24);
assert.equal(before,1.24);assert.equal(after,Infinity);
outer.buildingCondition[0]=100;
// A straight distance-three extension is disallowed even when the entire road is intact.
let beyond=w.map.at(center.x+3,center.y);assert(beyond);assert.equal(Math.abs(beyond.x-center.x)+Math.abs(beyond.y-center.y),3);
const rA={id:'ra',nationId:v.id,coreTileId:center.id,tileIds:[...targetIds]},rB={id:'rb',nationId:v.id,coreTileId:beyond.id,tileIds:[beyond.id]};
beyond.terrain='plain';beyond.buildings=['road'];beyond.buildingCondition=[100];beyond.ownerId=v.id;v.territory.add(beyond.id);
assert.equal(C.canJoin(w,rA,rB),null,'no merge beyond 13/Manhattan two');
beyond.ownerId=null;v.territory.delete(beyond.id);const clean=JSON.parse(JSON.stringify(w.serialize())),copy=NS.World.from(clean);assert.equal(copy.serialize().version,'V0.34D3B1');assert.equal(copy.v34b.schemaVersion,2);
const tBreak=copy.map.get(outer.id);tBreak.buildingCondition[tBreak.buildings.indexOf('road')]=0;
const preSplit=C.byTile(copy,center.id).tileIds.length;copy.year+=1;C.review(copy);
assert.equal(C.byTile(copy,center.id).tileIds.length,preSplit,'access loss must respect split grace window');
copy.year+=1;C.review(copy);
assert(C.byTile(copy,center.id).tileIds.length<preSplit,'access loss after >180 days must split');
assert(C.inspect(copy).ok,JSON.stringify(C.inspect(copy).errors));
const legacy=JSON.parse(JSON.stringify(new NS.World(19,19).serialize()));legacy.version='V0.34D3B';delete legacy.v034d3b1;const migrated=NS.World.from(legacy);assert.equal(migrated.serialize().version,'V0.34D3B1');
// Positive, bounded score preference for eventual road-connected extension.
const w2=new NS.World(19,19),v2=w2.villages[0],c2=w2.map.get(v2.coreTileId),t2=w2.map.neighbors4(c2.id).find(t=>t.ownerId===null&&NS.TERRAIN[t.terrain]?.passable);
assert(t2,'neutral, passable frontier neighbor');
assert.equal(B1.candidateExtension(v2,w2,{tile:t2}),null,'pre-road tech: no compact road reward');
v2.technologies.add('ROADS');
assert(B1.candidateExtension(v2,w2,{tile:t2})?.settlementId,'road tech enables feasible candidate reward');
// A physically inaccessible target must never receive an extension bonus.
const foreign=w2.map.neighbors4(c2.id).find(t=>t.ownerId!=null&&t.ownerId!==v2.id);
if(foreign)assert.equal(B1.candidateExtension(v2,w2,{tile:foreign}),null);
console.log(JSON.stringify({result:'PASS',version:'V0.34D3B1',cap:13,roadJoin:1.24,roadSplit:1.4,roadDiamondTiles:centerRecord.tileIds.length,mergeReviews:counter,legacySaveImport:true,withinCoreRadius2:true,roadIntegrityCheck:true,expansionPreference:true}));
