'use strict';
// H4B real legacy disconnect reproduction: retained neutral stone -> re-owned site smaller cap.
// This isolates an actual source path; it does not claim provenance for every historical world tile.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'../index-standalone.html'),'utf8');
const node=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
const c={Math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:node(),body:node(),documentElement:node(),createElement:node,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
for(const block of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(block[1].trim())try{new vm.Script(block[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=c.VSim,w=new NS.World(19,19),v=w.activeVillages[0],core=w.map.get(v.coreTileId);
const t=w.map.tiles.find(x=>x.ownerId==null&&NS.TERRAIN[x.terrain]?.passable&&w.map.distance(core.id,x.id)>5);
assert(t,'expected unowned passable isolated tile');
t.ownerId=v.id;t.buildings=['outpost'];t.stocks.stone=341.51;v.territory.add(t.id);
assert.equal(v.territory.has(t.id),true);v.pruneDisconnectedTerritory(w);
assert.equal(t.ownerId,null,'disconnect should remove ownership');assert.equal(t.buildings.length,0,'disconnect removes buildings');
assert.equal(t.stocks.stone,341.51,'historic physical stock is retained after disconnection');assert.equal(v.territory.has(t.id),false);
// Reclaim the retained neutral tile as a new outpost in the controlled fixture.
t.ownerId=v.id;t.buildings=['outpost'];v.territory.add(t.id);
const capacity=NS.V034D3.physicalCap(v,t.id,'stone');
assert(capacity>0 && capacity<341.51,'reclaimed outpost has a smaller stone capacity');
assert.equal(t.stocks.stone,341.51,'the re-claim did not mint or delete existing stone');
const excess=t.stocks.stone-capacity;
assert(excess>200);
console.log(JSON.stringify({status:'PASS',path:'pruneDisconnectedTerritory + physical recapture fixture',tileId:t.id,persistedStone:t.stocks.stone,newCapacity:capacity,overCapacity:excess,claim:'possible cause, not per-tile proof'}));
