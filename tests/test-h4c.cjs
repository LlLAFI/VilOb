'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),vm=require('vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');const html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
const element=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
const c={Math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:element(),body:element(),documentElement:element(),createElement:element,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
for(const x of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(x[1].trim())try{new vm.Script(x[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=c.VSim;assert.equal(NS.RELEASE_VERSION,'V0.35H1C1');
const w=new NS.World(19,19),v=w.activeVillages[0],core=w.map.get(v.coreTileId);
const adj=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>w.map.at(core.x+dx,core.y+dy)).find(x=>x&&x.ownerId==null&&NS.TERRAIN[x.terrain]?.passable);assert(adj,'nearby claimable tile required');
adj.ownerId=v.id;adj.buildings=['outpost'];adj.settlementId=null;v.territory.add(adj.id);adj.stocks.stone=0;
// Source has an old physical stockpile larger than its current capacity.
const max=NS.V034D3.physicalCap(v,core.id,'stone');core.stocks.stone=max+65;
const recipientMax=NS.V034D3.physicalCap(v,adj.id,'stone');assert(recipientMax>0);
const before=core.stocks.stone+adj.stocks.stone;
assert.equal(v.depositAt(core.id,'stone',7),0,'over-cap source must reject ordinary inflow');
const s=NS.V034H4C.redistribute(w,{force:true});const moved=before-(core.stocks.stone);assert(moved>0&&moved<=recipientMax+1e-7,'actual bounded shipment required');assert(moved<=v.internalLogisticsCapacity(core.id,adj.id,'stone',false).capacity+1e-6);
assert(Math.abs(core.stocks.stone+adj.stocks.stone-before)<1e-6,'physical total preserved');assert(s.shipments===1);assert(s.physicalMismatch===0);assert(s.failedReturns===0);
// No additional shipment to the same now-full recipient beyond real capacity.
const before2=core.stocks.stone+adj.stocks.stone;NS.V034H4C.redistribute(w,{force:false});assert(Math.abs(before2-core.stocks.stone-adj.stocks.stone)<1e-6);
// New ordinary deposits stop when cap is full even if the local tile is empty.
const extra=core.stocks.stone-max;assert(extra>=0);assert.equal(v.depositAt(core.id,'stone',5),0);
// Conserve an already-owned refund in an explicit D3A return scope. User-facing
// deposits still require capacity and cannot impersonate a RETURN transaction.
const snap=core.stocks.stone;const took=v.withdrawAt(core.id,'stone',1);assert.equal(took,1);NS.V034H4C.withReturn(v,()=>{const got=v.depositAt(core.id,'stone',1);assert.equal(got,1);});assert.equal(core.stocks.stone,snap);
// Joined Settlement: one member has a free physical storage tile, but the
// entire shared stone pool is over limit; no additional stone may be deposited.
const settlement=NS.V034C.byTile(w,core.id);
assert(settlement,'core must have a registry record');
settlement.tileIds.push(adj.id);adj.settlementId=settlement.id;
const combinedCap=NS.V034D3.physicalCap(v,core.id,'stone')+NS.V034D3.physicalCap(v,adj.id,'stone');
core.stocks.stone=combinedCap+10;adj.stocks.stone=0;
assert.equal(v.depositAt(adj.id,'stone',3),0,'shared Settlement cap prevents filling a locally empty tile');
assert.equal(adj.stocks.stone,0,'rejected deposit does not create stock');
// All 4 neutral/water perimeter directions are now considered, with no foreign
// nation edge re-drawing (that remains owned by H4A/B renderer).
const edges=[];const gfx={save(){},restore(){},rect(){},clip(){},beginPath(){},moveTo(x,y){this._pt=[x,y]},lineTo(x,y){edges.push([this._pt,[x,y]])},stroke(){assert.equal(this.strokeStyle,'#000000');assert(Math.abs(this.lineWidth-1.61)<1e-6);}};
const map={width:3,height:2,tiles:[{x:0,y:0,ownerId:0},{x:1,y:0,ownerId:null},{x:2,y:0,ownerId:1},{x:0,y:1,ownerId:null},{x:1,y:1,ownerId:null},{x:2,y:1,ownerId:1}],at(x,y){return this.tiles.find(t=>t.x===x&&t.y===y)}};
const ui={world:{map},_mapGeom:{cell:20,ox:0,oy:0},h1BoundaryMode:'all',q:()=>({getContext:()=>gfx})};NS.V034H4C.strokeNeutralBorders(ui);assert(edges.length>=3,'neutral and water outline must be drawn');ui.h1BoundaryMode='selected';const n0=edges.length;NS.V034H4C.strokeNeutralBorders(ui);assert.equal(edges.length,n0,'selected mode unchanged');
const fresh=new NS.World(19,19);const serialized=fresh.serialize();assert.equal(serialized.version,'V0.35H1B1A');assert(NS.World.from(JSON.parse(JSON.stringify(serialized))),'H4C save roundtrip');
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,fromTile:core.id,toTile:adj.id,moved,sourceExcessBefore:65,unchangedTotal:before,neutralBorderEdges:edges.length,saveVersion:serialized.version,blockedDeposits:s.blockedDeposits}));
