'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file,seed=0x4ab1221d){let state=seed,calls=0;
 const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};
}
const scenarios=[['F1A1',path.join(root,'index-F1A1-baseline.html')],['F2',path.join(root,'index-standalone.html')]];
for(const [label,file] of scenarios){const {NS,calls}=boot(file,0x11ffcc44);const w=new NS.World(19,19);const days=Number(process.env.F2_BENCH_DAYS||60);let total=0;for(let i=0;i<days;i++){const t=performance.now();w.advanceOneDay();total+=performance.now()-t;}console.log(JSON.stringify({anomalies:NS.V034F1A.report(w).newAnomalies,version:label,days,wallMs:+total.toFixed(1),msDay:+(total/days).toFixed(2),population:w.villages.reduce((n,v)=>n+v.population(),0),rngCalls:calls()}));}
