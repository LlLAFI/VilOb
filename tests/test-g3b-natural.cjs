'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..');let state=0x12789acb;
const math=Object.create(Math);math.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
const el=()=>({style:{},setAttribute(){},parentNode:null,innerHTML:'',textContent:'',appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
const ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const m of fs.readFileSync(path.join(root,'index-standalone.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:60000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim,w=new NS.World(19,19),days=Number(process.env.G3B_DAYS||360),start=performance.now();
const checkpoints=[];
for(let i=1;i<=days;i++){
 w.advanceOneDay();
 if(i%90===0||i===days){const s=NS.V034G3B.summary(w,{details:true}),audit=NS.V034C.inspect(w),food=NS.V034G2A.summary(w);
  assert(audit.ok,JSON.stringify(audit.errors));assert(NS.V034D3.audit(w).ok);assert.equal(food.conservationErrors,0);assert.equal(food.reserveViolations,0);assert.equal(NS.V034F2.diagnostics(w).duplicateMetabolismRequests,0);
  // Any new merger must be gated by actual bidirectional 1.00. Source C canJoin has that condition.
  assert.equal(s.joinLimit,1);
  checkpoints.push({day:i,pop:w.allPeople.length,settlements:audit.counts.activeSettlements,merges:s.joinAcceptedWithinOneDay,rejected:s.joinRejectedOverOneDay,overOneDay:s.overOneDaySettlements,pathSweeps:NS.V034G3.summary(w).pathSweeps});
 }
}
const dev=w.telemetry.toJSON(w);assert.equal(dev.worldSummary.v034g3b.joinLimit,1);
console.log(JSON.stringify({result:'PASS',days,elapsedMs:+(performance.now()-start).toFixed(1),checkpoints,errors:0}));
