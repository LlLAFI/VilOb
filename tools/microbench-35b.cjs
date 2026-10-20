#!/usr/bin/env node
/* Isolated administrative logistics repeated-call test. NOT 90-year SIM/BATCH. */
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),{performance}=require('perf_hooks');
const root=path.join(__dirname,'..');
function init(file, saved=null, stress=true){let r=0x9fae239;const math=Object.create(Math);math.random=()=>{r^=r<<13;r^=r>>>17;r^=r<<5;return (r>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
 const ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null;},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 const NS=ctx.VSim,w=saved?NS.World.from(JSON.parse(JSON.stringify(saved))):new NS.World(19,19),v=w.activeVillages[0];
 // Deliberately increase administrative topology size to stress D2 administrative model.
 if(stress)for(const tile of w.map.tiles){if(!NS.TERRAIN[tile.terrain]?.passable)continue;tile.ownerId=v.id;v.territory.add(tile.id);}
 const ids=[...v.territory];return{NS,w,v,from:ids[0],to:ids[ids.length-1]};}
const sameSave=JSON.parse(JSON.stringify(init('tests/baselines/index-35A.html',null,false).w.serialize()));
function trial(file){const {NS,v,from,to}=init(file,sameSave);const warm=8,n=96;for(let i=0;i<warm;i++)v.internalLogisticsCapacity(from,to,'stone',false);
 const t=performance.now();let checksum=0;for(let i=0;i<n;i++){const x=v.internalLogisticsCapacity(from,to,'stone',false);checksum+=Number(x.cost||0)+Number(x.capacity||0);}return {ms:performance.now()-t,n,checksum};}
const baseline='tests/baselines/index-35A.html',candidate='index-standalone.html',rows=[];
for(let i=0;i<3;i++){for(const v of i%2?[candidate,baseline]:[baseline,candidate])rows.push({run:i+1,variant:v===baseline?'baseline':'candidate',...trial(v)});}
const median=a=>[...a].sort((x,y)=>x-y)[1];const a=median(rows.filter(x=>x.variant==='baseline').map(x=>x.ms)),b=median(rows.filter(x=>x.variant==='candidate').map(x=>x.ms));
console.log(JSON.stringify({benchmark:'synthetic stressed administrative logistics, NOT late-year saved simulation',callsPerRun:96,runs:3,baselineMedianMs:+a.toFixed(3),candidateMedianMs:+b.toFixed(3),changePercent:+((a-b)/a*100).toFixed(2),rows:rows.map(({variant,run,ms,checksum})=>({variant,run,ms:+ms.toFixed(3),checksum:+checksum.toFixed(5)}))},null,2));
