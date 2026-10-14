'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},querySelector(){return null},querySelectorAll(){return []},classList:{add(){},remove(){}},value:''});
const ctx={Math,console,Map,Set,WeakMap,WeakSet,JSON,Date,performance,TextEncoder,TextDecoder,Blob,URL,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},alert(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const w=new ctx.VSim.World(19,19);ctx.VSim.V034E.profiling.start(w,6);for(let i=0;i<6;i++)w.advanceOneDay();
const result=ctx.VSim.V034E.profiling.last();const names=new Set(result.rows.map(x=>x.name));assert(names.has('calendar.demography'),'calendar profiler stage missing');assert(names.has('macro.legacyCore'),'macro profiler stage missing');assert.equal(result.days,6);
assert.equal(ctx.VSim.V034E.profiling.traceSegmentActive,null);
console.log(JSON.stringify({result:'PASS',days:result.days,demography:result.rows.find(x=>x.name==='calendar.demography')?.calls,macro:result.rows.find(x=>x.name==='macro.legacyCore')?.calls}));
