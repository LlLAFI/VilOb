'use strict';
// Validate 35B's exact same-institution reduction without changing logistics results.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function load(filename){
 let rng=0x13579bdf;const math=Object.create(Math);math.random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
 const c={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 for(const m of fs.readFileSync(path.join(root,filename),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e;}
 return c.VSim;
}
const A=load('tests/baselines/index-35A.html'), B=load('index-standalone.html');
assert.equal(A.RELEASE_VERSION,'V0.35A');assert.equal(B.RELEASE_VERSION,'V0.35B');
const serialized=JSON.parse(JSON.stringify(new A.World(19,19).serialize()));
assert.equal(B.World.from(serialized).serialize().version,'V0.35B');
function exercise(NS){
 const w=NS.World.from(JSON.parse(JSON.stringify(serialized))),v=w.activeVillages[0],ids=[...v.territory];
 assert(ids.length>0,'nation must have territory');
 const a=ids[0],b=ids[ids.length>1?1:0];let calls=0;const original=NS.V032D.adminModel;
 NS.V032D.adminModel=function(...args){calls++;return original.apply(this,args);};
 const output=v.internalLogisticsCapacity(a,b,'food',false);NS.V032D.adminModel=original;
 return {calls,output:JSON.parse(JSON.stringify(output)),admin:JSON.stringify(v.v32dAdmin)};
}
const a=exercise(A),b=exercise(B);
assert.equal(a.calls,2,'35A must call admin model twice in this path');
assert.equal(b.calls,1,'35B must call admin model exactly once in this path');
assert.deepEqual(a.output,b.output,'logistics result must not change');
assert.deepEqual(a.admin,b.admin,'administrative changes must not differ');
assert.equal(B.TECH_ORDER.length,43);
assert.equal(B.V035B.reportDetail(),null,'admin detail MUST be off by default');
const orig=B.V032D.adminModel;
B.V035B.startDetail();assert.notEqual(B.V032D.adminModel,orig);
B.V035B.stopDetail();assert.equal(B.V032D.adminModel,orig);
assert.equal(B.V035B.reportDetail().active,false);
console.log(JSON.stringify({status:'PASS',release:B.RELEASE_VERSION,baselineCalls:a.calls,optimizedCalls:b.calls,logisticsEqual:true,administrationEqual:true,optionalProbeRestored:true}));
