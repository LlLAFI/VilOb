'use strict';
// V0.35C opt-in profile, protected source and state-safe administrative projection.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{performance}=require('perf_hooks');
function load(file){let seed=0x17fea45;const m=Object.create(Math);m.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
 const c={Math:m,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);let html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e;}return {ns:c.VSim,context:c,getSeed:()=>seed>>>0,setSeed:n=>seed=n};}
const root=path.join(__dirname,'..'),A=load(path.join(root,'tests/baselines/index-35B.html')),B=load(path.join(root,'tests/baselines/index-35C.html'));
assert.equal(A.ns.RELEASE_VERSION,'V0.35B');assert.equal(B.ns.RELEASE_VERSION,'V0.35C');assert(B.ns.V035C);
assert.equal(B.ns.V035C.isActive(),false);assert.equal(B.ns.V035C.report(),null);
const src=JSON.parse(JSON.stringify(new A.ns.World(19,19).serialize()));const w=B.ns.World.from(src);
assert.equal(w.serialize().version,'V0.35C');assert.equal(B.ns.TECH_ORDER.length,43);
const v=w.activeVillages[0],a=v.coreTileId,b=a;const native=B.ns.V032D.adminModel;let count=0;B.ns.V032D.adminModel=function(...args){count++;return native.apply(this,args);};
const output=v.internalLogisticsCapacity(a,b,'food',false);B.ns.V032D.adminModel=native;assert.equal(count,1);assert(output&&typeof output==='object');
const before=[B.ns.World.prototype.advanceOneDay,B.ns.Village.prototype.internalLogisticsCapacity,B.ns.V032D.adminModel];
B.ns.V035C.start(w);assert(B.ns.V035C.isActive());assert.equal(B.ns.V035C.report().quarterCount,0);
for(let d=0;d<91;d++)w.advanceOneDay();
const current=B.ns.V035C.report();assert(current.observedDays===91);assert(current.quarterCount>=1,'at least one quarterly layer must be measured');assert(current.adminModel.totalCalls>0);
assert(current.seasonal.stages.length>5);
const final=B.ns.V035C.stop();assert(!B.ns.V035C.isActive());assert.equal(final.active,false);
const after=[B.ns.World.prototype.advanceOneDay,B.ns.Village.prototype.internalLogisticsCapacity,B.ns.V032D.adminModel];assert(before.every((v,i)=>after[i]===v),'all wrapped methods must restore');
const frozen=JSON.stringify(final);w.advanceOneDay();assert.equal(JSON.stringify(B.ns.V035C.report()),frozen,'disabled profile is frozen');
assert(!Object.keys(w.serialize()).some(k=>k.startsWith('v035c')),'35C diagnosis must not enter saves');
console.log(JSON.stringify({status:'PASS',version:B.ns.RELEASE_VERSION,days:91,quarters:final.quarterCount,adminCalls:final.adminModel.totalCalls,stageCount:final.seasonal.stages.length,methodRestorations:true}));
