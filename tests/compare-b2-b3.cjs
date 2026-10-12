'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
function boot(seed=0x34d3b3,source=html){let rng=seed>>>0,randomCalls=0;const rand=Object.create(Math);rand.random=()=>{randomCalls++;rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
 const make=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const db=new Map(),ctx={console,Math:rand,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{head:make(),body:make(),documentElement:make(),createElement:make,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return {NS:ctx.VSim,ctx,calls:()=>randomCalls};}

const baseline=process.env.VILOB_B2_BASELINE;
if(!baseline||!fs.existsSync(baseline)){console.log('Provide VILOB_B2_BASELINE=<B2 standalone html>');process.exit(0);}
const old=boot(0x124a6bfd,fs.readFileSync(baseline,'utf8')),next=boot(0x124a6bfd,html);
const a=new old.NS.World(19,19),b=new next.NS.World(19,19);
function digest(w){const vs=w.villages.map(v=>({pop:v.population(),food:+v.food.toFixed(6),wood:+v.wood.toFixed(6),stone:+v.stone.toFixed(6),gold:+v.gold.toFixed(6),territory:v.territory.size,buildings:[...v.territory].reduce((t,id)=>t+(w.map.get(id)?.buildings?.length||0),0)}));return {year:w.year,ordinalDay:w.ordinalDay(),nations:vs,worldFood:vs.reduce((s,v)=>s+v.food,0),settlements:w.v34b?.settlements?.filter(r=>r.lifecycle==='ACTIVE').length};}
const checkpoints=[];
for(let day=1;day<=18;day++){
 a.advanceOneDay();b.advanceOneDay();
 if(day%6===0){const aa=digest(a),bb=digest(b),same=JSON.stringify(aa)===JSON.stringify(bb),rng=old.calls()===next.calls();
 checkpoints.push({day,same,rng,pop:aa.nations.reduce((x,v)=>x+v.pop,0)});
 if(!same||!rng){console.error('BASE',JSON.stringify(aa));console.error('NEXT',JSON.stringify(bb));break;}
 }
}
assert(checkpoints.every(c=>c.same&&c.rng),'B2/B3 diverged in 18-day matched-seed run');
console.log(JSON.stringify({result:'PASS',durationDays:18,matchingCheckpoints:checkpoints.length,last:checkpoints.at(-1),randomCalls:old.calls(),baselineVersion:'V0.34D3B2',optimizedVersion:'V0.34D3B3'}));
