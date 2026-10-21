#!/usr/bin/env node
/* Focused V0.17 market production-ledger scan, synthetic stress ONLY.
 * This microbenchmark does not predict 90-year browser or full SIM performance.
 */
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),{performance}=require('perf_hooks');
const root=path.resolve(__dirname,'..');
function load(file){let seed=0x13579abc;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
 const ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const a of fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(a[1].trim())try{new vm.Script(a[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return{ns:ctx.VSim,seed};}
const baseline=load('tests/baselines/index-35C.html'),base=JSON.parse(JSON.stringify(new baseline.ns.World(19,19).serialize()));
function run(file){const engine=load(file),ns=engine.ns,w=ns.World.from(JSON.parse(JSON.stringify(base))),v=w.activeVillages[0],t=w.map.get(v.coreTileId),today=w.ordinalDay();t.v30Economy=t.v30Economy||{};t.v30Economy.productionDaily=Array.from({length:360},(_,i)=>({day:today-(i%150),food:(i%7)*.43,wood:(i%11)*.37,stone:(i%5)*.59}));
 t.marketState={prices:{food:.32,wood:.35,stone:.49},tradeVolume:{food:0,wood:0,stone:0},lastDay:today-30};
 const n=420;let total=0;const keys=['food','wood','stone'];const begin=performance.now();for(let i=0;i<n;i++){t.marketState.lastDay=today-30;total+=ns.V017.marketPrice(v,t,keys[i%3],w);}return{ms:performance.now()-begin,checksum:total,prices:{...t.marketState.prices}};}
const a='tests/baselines/index-35C.html',b='index-standalone.html',items=[];
for(let i=0;i<5;i++)for(const v of i%2?[b,a]:[a,b])items.push({run:i+1,variant:v===a?'35C':'35D',...run(v)});
const median=x=>{let a=x.sort((x,y)=>x-y);return a[Math.floor(a.length/2)];};
const ap=median(items.filter(x=>x.variant==='35C').map(x=>x.ms)),bp=median(items.filter(x=>x.variant==='35D').map(x=>x.ms));
const checks=items.map(x=>Number(x.checksum.toFixed(10))),same=checks.every(x=>x===checks[0]);
const r={source:'synthetic 360-entry productionDaily, 420 forced market updates per trial; NOT game-wide or late-year benchmark',baselineMedianMs:ap,candidateMedianMs:bp,changePercent:+((ap-bp)/ap*100).toFixed(2),numericIdentity:same,rows:items.map(({ms,...x})=>({...x,ms:+ms.toFixed(3)}))};console.log(JSON.stringify(r,null,2));if(!same)process.exitCode=2;
