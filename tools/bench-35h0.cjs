'use strict';
// Synthetic path-only benchmark, not proof of 62-year whole-SIM improvement.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
const nullElem=()=>({style:{},dataset:{},classList:{add(){},remove(){}},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return []},textContent:''});
const ctx={console,Math,Map,Set,JSON,Date,WeakMap,performance,Blob,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},URL,document:{head:nullElem(),body:nullElem(),documentElement:nullElem(),getElementById(){return null},createElement:nullElem,querySelector(){return null},querySelectorAll(){return []},addEventListener(){}}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:90000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const api=ctx.VSim.V035H0,W=19,H=19;
const tiles=Array.from({length:W*H},(_,id)=>({id,ownerId:id%W<10?0:1,v33OccupierId:null,v33OccupationOperation:null}));
const world={map:{get:id=>tiles[id],neighbors4:id=>{const x=id%W,y=Math.floor(id/W),a=[];if(x>0)a.push(tiles[id-1]);if(x<W-1)a.push(tiles[id+1]);if(y>0)a.push(tiles[id-W]);if(y<H-1)a.push(tiles[id+W]);return a;}}};
const origins=Array.from({length:12},(_,i)=>({settlementId:`s${i}`,tileIds:[W*(i+2)+2,W*(i+2)+3]}));
const targets=Array.from({length:70},(_,i)=>({settlementId:`d${i}`,tileIds:[W*(i%H)+((i*7)%W)]}));
const pairs=[];for(const origin of origins)for(const t of targets)pairs.push([origin,t]);
function direct(){let sum=0;for(const [a,b] of pairs)sum+=api.debug.path(world,a.tileIds,b.tileIds,t=>t.ownerId===0)?0:0;}
// Compare exact distance results in each measurement and exclude score/AI overhead.
const refer=(a,b)=>api.debug.path(world,a.tileIds,b.tileIds,t=>t.ownerId===0&&t.v33OccupierId==null&&!t.v33OccupationOperation);
const fast=(a,b)=>api.debug.ownedPath(world,a,b,[0]);
let baseline=[],optimized=[];for(let k=0;k<7;k++){
 let t0=performance.now(),old=[];for(const [a,b] of pairs)old.push(refer(a,b));let t1=performance.now();baseline.push(t1-t0);
 t0=performance.now();let answer;api.debug.routeContext(world,()=>{answer=pairs.map(([a,b])=>fast(a,b));});t1=performance.now();optimized.push(t1-t0);
 assert.deepEqual(answer,old);
}
function med(a){return [...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];}
const report={format:'vilob-v035h0-benchmark',topology:'synthetic 19x19; 12 sources x 70 targets; country-0 passable only',queriesPerRound:pairs.length,rounds:7,baselineBfsMedianMs:+med(baseline).toFixed(3),optimizedScopedMedianMs:+med(optimized).toFixed(3),relativeSpeedup:+(med(baseline)/med(optimized)).toFixed(2),...api.routeReport(world),note:'Isolated path queries ONLY. Does not measure real 62-year world or 10x SIM/BATCH.'};
console.log(JSON.stringify(report));
