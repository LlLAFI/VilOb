'use strict';
// H4C vs 35A, including opt-in profiler, MUST preserve RNG and canonical simulation state.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path'),{performance}=require('perf_hooks');
function run(file){let seed=0x12abc345;const m=Object.create(Math);m.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},classList:{add(){},remove(){},toggle(){}}});
 const c={Math:m,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 const html=fs.readFileSync(file,'utf8');for(const a of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(a[1].trim())try{new vm.Script(a[1]).runInContext(c,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {ns:c.VSim,seed(x){seed=x;},getSeed(){return seed>>>0;}};
}
const A=run(path.join(__dirname,'baselines/index-H4C.html')),B=run(path.join(__dirname,'../index-standalone.html'));
const original=JSON.parse(JSON.stringify(new A.ns.World(19,19).serialize()));
function simulation(env,profile){env.seed(0x1234beef);const w=env.ns.World.from(JSON.parse(JSON.stringify(original)));env.seed(0x24681357);if(profile)env.ns.V035A.start(w);
 const n=Number(process.env.V35A_PARITY_DAYS||30);for(let i=0;i<n;i++)w.advanceOneDay();if(profile)env.ns.V035A.stop();const result=JSON.parse(JSON.stringify(w.serialize()));return {result,rng:env.getSeed()};}
const a=simulation(A,false),b=simulation(B,false),p=simulation(B,true);
const keys=['year','quarter','day','map','villages','persons','people','v34b','v34c','v33e','v33f5','v33g','v29Nations'];
// Timers/telemetry/version are intentionally excluded. NO balances, identities, territories or Person states are excluded.
for(const k of keys){assert.equal(JSON.stringify(a.result[k]),JSON.stringify(b.result[k]),'unprofiled state mismatch: '+k);assert.equal(JSON.stringify(a.result[k]),JSON.stringify(p.result[k]),'profiled state mismatch: '+k);}
assert.equal(a.rng,b.rng,'unprofiled RNG mismatch');assert.equal(a.rng,p.rng,'profiled RNG mismatch');
assert.equal(A.ns.RELEASE_VERSION,'V0.34H4C');assert.equal(B.ns.RELEASE_VERSION,'V0.35A');
console.log(JSON.stringify({status:'PASS',days:Number(process.env.V35A_PARITY_DAYS||30),checked:keys.length,versions:[A.ns.RELEASE_VERSION,B.ns.RELEASE_VERSION],profiledAndUnprofiledRngEqual:true}));
