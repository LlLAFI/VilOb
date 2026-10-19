'use strict';
// Deterministic parity of H2/H2A after loading the SAME H0 save. Render-only changes
// may modify version/diagnostic wall-clock metadata but not actual simulation state.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path'),{performance}=require('perf_hooks');
const h0=path.resolve(__dirname,'baselines/index-H2.html'),h1=path.resolve(__dirname,'../index-standalone.html');
function engine(source){let seed=0x12345;const m=Object.create(Math);m.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const elt=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},appendChild(){},classList:{toggle(){},add(){},remove(){}}});
 const ctx={Math:m,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},alert(){},confirm(){return false},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 const html=fs.readFileSync(source,'utf8');for(const x of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(x[1].trim())try{new vm.Script(x[1]).runInContext(ctx,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,reseed(n=0x11223344){seed=n;}};
}
const A=engine(h0),B=engine(h1),raw=JSON.parse(JSON.stringify(new A.NS.World(19,19).serialize()));
function run(env){env.reseed(0x99887766);const w=env.NS.World.from(JSON.parse(JSON.stringify(raw)));env.reseed();for(let i=0;i<30;i++)w.advanceOneDay();return JSON.parse(JSON.stringify(w.serialize()));}
const a=run(A),b=run(B);delete a.version;delete b.version;
// Ignore timing-only instrumentation and volatile log timestamps. All physical state must match.
const keys=['year','quarter','day','map','villages','persons','people','v34b','v34c','v33e','v33f5','v33g','v29Nations'];
const mismatches=[];for(const key of keys)if(JSON.stringify(a[key])!==JSON.stringify(b[key]))mismatches.push(key);
if(mismatches.length){const diffs=[];const rec=(x,y,path)=>{if(diffs.length>20)return;if(JSON.stringify(x)===JSON.stringify(y))return;if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))rec(x[k],y[k],path+'.'+k);}else diffs.push([path,x,y]);};rec(a.villages,b.villages,'villages');console.log('DIFF',JSON.stringify(diffs).slice(0,4500));}assert.deepEqual(mismatches,[],'H2 vs H2A simulation discrepancy: '+mismatches.join(','));
console.log(JSON.stringify({status:'PASS',days:30,startingSave:'H2',h0:A.NS.RELEASE_VERSION,h1:B.NS.RELEASE_VERSION,checked:keys.length,nonParityFields:mismatches}));
