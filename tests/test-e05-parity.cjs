'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let state=0x4c7b1401,calls=0;const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};const el=()=>({style:{},innerHTML:'',appendChild(){},insertAdjacentElement(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},classList:{add(){},remove(){}}});const ctx={console,Math:rand,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,Blob,URL,requestAnimationFrame(){},setTimeout(){},clearTimeout(){},alert(){},confirm(){return false},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){}}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const match of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}return {NS:ctx.VSim,calls:()=>calls};}
const A=boot(path.join(root,'tests/fixtures/v034Erc4h-index.html'));
const B=boot(path.join(root,'index-standalone.html'));
const w1=new A.NS.World(19,19),w2=new B.NS.World(19,19);
w1.year=61;w2.year=61;
function state(w){return JSON.stringify({date:[w.year,w.ordinalDay()],nation:w.villages.map(v=>[v.id,v.food,v.wood,v.stone,v.gold,[...v.territory].sort((a,b)=>a-b),(v.residents||[]).map(p=>[p.id,p.alive,p.hunger,p.health,p.job,p.homeTileId]),v.v32d3Housing,v.v32d3Expansion,v.frontierProjects,v.aiPlan]),tile:w.map.tiles.map(t=>[t.ownerId,t.stocks,t.resources,t.buildings]),war:w.wars?.map(x=>[x.id,x.status,x.endedCal])});}
for(let d=1;d<=150;d++){w1.advanceOneDay();w2.advanceOneDay();if(d%15===0){assert.equal(state(w2),state(w1),'state mismatch day '+d);assert.equal(B.calls(),A.calls(),'RNG mismatch day '+d);for(let i=0;i<w1.villages.length;i++){const x=A.NS.V032D3.updateExpansion(w1.villages[i],w1,false);const y=B.NS.V032D3.updateExpansion(w2.villages[i],w2,false);assert.equal(JSON.stringify(y),JSON.stringify(x),'expansion mismatch day '+d+' nation '+i);}}}
for(let i=0;i<w1.villages.length;i++){const a=A.NS.V032D3.updateExpansion(w1.villages[i],w1,false),b=B.NS.V032D3.updateExpansion(w2.villages[i],w2,false);assert.equal(JSON.stringify(a),JSON.stringify(b));}
const snapshotsBefore=[w1.telemetry.snapshots.length,w2.telemetry.snapshots.length];const snapA=w1.telemetry.snapshot(w1,'MANUAL','parity'),snapB=w2.telemetry.snapshot(w2,'MANUAL','parity');
assert.equal(JSON.stringify(snapB?.villages),JSON.stringify(snapA?.villages));assert.equal(state(w1),state(w2));assert.equal(B.calls(),A.calls());
// Repeated same-day capture exercises F5/F5A shallow attach parity.
for(let i=0;i<3;i++){
 const a=w1.telemetry.snapshot(w1,'MANUAL','e04 repeat '+i);
 const b=w2.telemetry.snapshot(w2,'MANUAL','e04 repeat '+i);
 assert.equal(JSON.stringify(b.villages),JSON.stringify(a.villages),'Snapshot nation rows diverged '+i);
 assert.equal(JSON.stringify(w2.villages.map(v=>[v.v32d3Housing,v.v32d3Expansion,v.gold])),JSON.stringify(w1.villages.map(v=>[v.v32d3Housing,v.v32d3Expansion,v.gold])),'state after repeated Snapshot diverged');
 assert.equal(B.calls(),A.calls(),'RNG after repeated snapshot diverged');
}
const fromE02=B.NS.World.from(JSON.parse(JSON.stringify(w1.serialize())));assert.equal(fromE02.serialize().version,'V0.34E-rc5','RC4h save upgrade failed');
console.log(JSON.stringify({status:'PASS',baseline:'V0.34E-rc4h',candidate:'V0.34E-rc5',days:150,checkpoints:10,manualSnapshotParity:true,snapshotsBefore,rng:A.calls(),snapshotStateSplitApi:typeof B.NS.V032D3.advanceSnapshotState==='function'}));
