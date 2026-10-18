'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path'),{performance}=require('perf_hooks');
const root=path.resolve(__dirname,'..');let seed=0x12345678;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const elt=()=>({style:{},dataset:{},setAttribute(){},parentNode:null,innerHTML:'',textContent:'',appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
const ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const match of fs.readFileSync(path.join(root,'index-standalone.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim,G=NS.V034G4A;
assert.equal(NS.RELEASE_VERSION,'V0.34G4A');
assert.equal(NS.TECH_ORDER.length,39);
assert(G.verify().ok,JSON.stringify(G.verify()));
assert.equal(NS.V034F0.needFor({age:10}),.28);
assert.equal(NS.V034F0.needFor({age:30}),.39);
assert(Math.abs(NS.V034F0.needFor({age:30,job:'경비'})-.39*1.09)<1e-10);
assert.equal(G.hungerGain(6,1),6);
assert(Math.abs(G.hungerGain(6,0)-5.1)<1e-8);
assert(Math.abs(G.hungerGain(6,.5)-5.55)<1e-8);
assert.equal(G.reliefFactor(70),1);
assert(Math.abs(G.reliefFactor(85)-1.05)<1e-8);
assert(Math.abs(G.reliefFactor(100)-1.10)<1e-8);
// Validate preservation of physical rules and days-long famine gate via actual new world.
const world=new NS.World(19,19);
const orig=JSON.parse(JSON.stringify(world.serialize()));
assert.equal(orig.version,'V0.34G4A');
const restored=NS.World.from(orig);
assert.equal(restored.serialize().version,'V0.34G4A');
for(let i=1;i<=180;i++){restored.advanceOneDay();if(i%30===0){
 const a=G.audit(restored);assert(a.integrity.ok,JSON.stringify(a.integrity));
 for(const key of ['physical','settlement','conservation','reserveViolations','metabolismDuplicates','missingHomes'])assert.equal(a.failures[key],0,key+' day='+i);
 assert(NS.V034D3.audit(restored).ok);
}}
const g3b={...orig,version:'V0.34G3B'};delete g3b.v034g4a;delete g3b.v034g4;
assert.equal(NS.World.from(g3b).serialize().version,'V0.34G4A');
const result=restored.telemetry.toJSON(restored);
assert.equal(result.version,'V0.34G4A');
assert.equal(result.worldSummary.techCount,39);
assert(result.worldSummary.v034g4a);
assert.equal(NS.V034G3B.joinLimit,1);
console.log(JSON.stringify({result:'PASS',version:NS.RELEASE_VERSION,techCount:NS.TECH_ORDER.length,nutrition:G.config,naturalDays:180,physical:'PASS',save:'PASS'}));
