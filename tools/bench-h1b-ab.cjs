'use strict';
/* Repeatable low-year local micro-A/B. Not a substitute for the user's 60-year save. */
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function engine(file){let s=12345;const math=Object.create(Math);math.random=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296};const e=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){}});
 const c={Math:math,console,Map,Set,WeakMap,JSON,performance,Date:class extends Date{static now(){return 1770000000000;}},Blob,URL,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:e(),body:e(),documentElement:e(),getElementById(){return null},createElement:e,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 for(const m of fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000})}catch(err){if(!/onclick/.test(err.message))throw err;}
 return c.VSim;
}
const versions=[['HF','tests/fixtures/v035H1A-HF-standalone.html'],['H1B','index-standalone.html']];
const runtimes=versions.map(([k,f])=>[k,engine(f)]);const days=Math.max(30,Math.min(360,Number(process.argv[2]||120))),repeat=Math.max(1,Math.min(5,Number(process.argv[3]||2))),measurements=[];
for(let round=0;round<repeat;round++){
 const row={round:round+1};let compare=null;
 for(const [label,N] of (round%2?[...runtimes].reverse():runtimes)){
  const w=N.V035H1A.createWorld();const t=performance.now();for(let d=0;d<days;d++)w.advanceOneDay();const time=performance.now()-t;
  const state={signature:N.V035H1A.fingerprint(w),rng:w.v35h1a.rngState,day:w.calendarOrdinalDay(),people:w.allPeople?.length};
  if(compare&&(state.signature!==compare.signature||state.rng!==compare.rng||state.day!==compare.day))throw Error('H1B state or RNG parity FAILED');compare=state;row[label]=+time.toFixed(3);row.signature=state.signature;
 }
 measurements.push(row);
}
const mean=k=>measurements.reduce((s,x)=>s+x[k],0)/repeat;const hf=mean('HF'),h1b=mean('H1B');console.log(JSON.stringify({status:'PASS',days,repeat,hfMeanMs:+hf.toFixed(3),h1bMeanMs:+h1b.toFixed(3),improvementPct:+((hf-h1b)/hf*100).toFixed(2),measurement:'Node VM low-year 7-nation sim only; not late-game PC ×10 UI/BATCH',runs:measurements},null,2));
