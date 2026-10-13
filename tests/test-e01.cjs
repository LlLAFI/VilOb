'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const base=path.join(__dirname,'fixtures/v034D3B3B-index.html'),candidate=path.join(__dirname,'../index-standalone.html');
function boot(file){let state=2367913,calls=0;const math=Object.create(Math);math.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};const e=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const store=new Map();const ctx={console,Math:math,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1791885600000;}},performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:{head:e(),body:e(),documentElement:e(),createElement:e,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const s of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(!s[1].trim())continue;try{new vm.Script(s[1]).runInContext(ctx,{timeout:20000});}catch(err){if(!/onclick/.test(err.message))throw err;}}return{NS:ctx.VSim,calls:()=>calls,ctx};}
const A=boot(base),B=boot(candidate);const wA=new A.NS.World(19,19),wB=new B.NS.World(19,19);
assert.equal(B.NS.RELEASE_VERSION,'V0.34E-rc1');
assert.equal(B.ctx.document.title,'Village Observer V0.34E-rc1');
const P=B.NS.V034E.profiling,origin=B.NS.Person.prototype.metabolism,worldOriginal=B.NS.World.prototype.advanceOneDay;
assert.equal(P.status().active,false);
P.start(wB,5);assert.notEqual(B.NS.Person.prototype.metabolism,origin);
for(let i=1;i<=15;i++){wA.advanceOneDay();wB.advanceOneDay();if(i===5){const r=P.last();assert(r);assert.equal(r.days,5);assert(r.totalWorldMs>0);assert(r.rows.some(x=>x.name==='person.metabolism'&&x.calls>0));assert.equal(P.status().active,false);assert.equal(B.NS.Person.prototype.metabolism,origin);assert.equal(B.NS.World.prototype.advanceOneDay,worldOriginal);}}
const stable=w=>({year:w.year,day:w.ordinalDay(),nations:w.villages.map(v=>({pop:v.population(),food:v.food,wood:v.wood,stone:v.stone,gold:v.gold,territory:[...v.territory].sort((a,b)=>a-b)}))});
assert.equal(JSON.stringify(stable(wA)),JSON.stringify(stable(wB)));
assert.equal(A.calls(),B.calls());
assert.equal(wB.serialize().version,'V0.34E-rc1');
const migrated=B.NS.World.from(JSON.parse(JSON.stringify(wA.serialize())));
assert.equal(migrated.serialize().version,'V0.34E-rc1');
const restored=B.NS.World.from(JSON.parse(JSON.stringify(wB.serialize())));
assert.equal(restored.serialize().version,'V0.34E-rc1');
assert.equal(B.NS.V034D3.audit(restored).ok,true);
assert.equal(B.NS.V034D3A2.columns.length,48);
P.start(wB,10);wB.advanceOneDay();const interrupted=P.stop();assert.equal(interrupted.days,1);assert.equal(P.status().active,false);assert.equal(B.NS.Person.prototype.metabolism,origin);
console.log(JSON.stringify({result:'PASS',version:'V0.34E-rc1',sameSimulation15Days:true,rngCalls:A.calls(),instrumentationRestored:true,sampleDays:5,legacySaveImport:true,foodColumns:48}));
