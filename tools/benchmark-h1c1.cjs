'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);const html=fs.readFileSync(path.join(root,file),'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return c.VSim;
}
function omitTiming(x){return JSON.stringify(x,(k,v)=>k==='realTime'||/^(?:elapsed|wall|cpu|profile|perf|memory|heap|duration)/i.test(k)||/(?:Ms|milliseconds)$/i.test(k)?undefined:v);}
(async()=>{
 const aN=boot('tests/fixtures/v035H1C-standalone.html'),bN=boot('index-standalone.html');
 const a=aN.V035H1A.createWorld(),b=bN.V035H1A.createWorld();
 for(let i=0;i<90;i++){a.advanceOneDay();b.advanceOneDay();}
 const score=(N,w)=>{const measurements=[];for(let i=0;i<24;i++){const start=performance.now();w.telemetry.snapshot(w,'MANUAL','H1C1 BENCH');const elapsed=performance.now()-start;if(i>=4)measurements.push(elapsed);}
 measurements.sort((a,b)=>a-b);return {n:measurements.length,medianMs:measurements[measurements.length>>1],meanMs:measurements.reduce((a,b)=>a+b,0)/measurements.length,p95Ms:measurements[Math.ceil(measurements.length*.95)-1]};};
 const baseline=score(aN,a),optimized=score(bN,b);const result={version:'V0.35H1C1',environment:'Node VM controlled 90day world manual snapshot repeated 20x, NOT 60y PC browser',baseline,optimized,medianImprovementPct:Math.round((1-optimized.medianMs/baseline.medianMs)*1000)/10};
 console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
