#!/usr/bin/env node
/* B3B vs E-rc1 repeatable simulation-only benchmark. Browser Wall/Render are
 * deliberately NOT claimed: this measures World.advanceOneDay in Node VM. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
const args=process.argv.slice(2);
function arg(key,def){const pos=args.indexOf(key);return pos>=0?args[pos+1]:def;}
const days=Math.max(1,Math.min(360,Number(arg('--days',15))||15));
const runs=Math.max(1,Math.min(10,Number(arg('--runs',3))||3));
const warmup=Math.max(0,Math.min(30,Number(arg('--warmup',0))||0));
const seed=Number(arg('--seed','20261013'))>>>0;
const savePath=arg('--save',null);
const profile=args.includes('--profile');
const baseFile=path.resolve(arg('--baseline',path.join(root,'tests/fixtures/v034D3B3B-index.html')));
const newFile=path.resolve(arg('--candidate',path.join(root,'index-standalone.html')));
const outputFile=arg('--output',null);
const baseline=fs.readFileSync(baseFile,'utf8'),candidate=fs.readFileSync(newFile,'utf8');
const save=savePath?JSON.parse(fs.readFileSync(savePath,'utf8')):null;
function boot(source){let state=seed||1,calls=0;
 const math=Object.create(Math);math.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const element=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const store=new Map();const ctx={console,Math:math,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1791885600000;}},performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:{head:element(),body:element(),documentElement:element(),createElement:element,getElementById(){return null;},querySelector(){return null;},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(!m[1].trim())continue;try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}}
 return {NS:ctx.VSim,calls:()=>calls};
}
function digest(w){ // semantic simulation fields only, excludes time, telemetry and export version
 const num=n=>Number.isFinite(Number(n))?Number(n):null;
 return crypto.createHash('sha256').update(JSON.stringify({
  year:w.year,ordinal:w.ordinalDay(),
  tiles:w.map.tiles.map(t=>[t.id,t.ownerId,t.settlementId,t.v33OccupierId,t.stocks,t.resources,t.buildings,t.buildingCondition,t.developedBuildSpace]),
  nations:w.villages.map(v=>({id:v.id,gold:num(v.gold),food:num(v.food),wood:num(v.wood),stone:num(v.stone),territory:[...v.territory].sort((a,b)=>a-b),
   residents:v.residents.map(p=>[p.id,p.alive,p.age,p.sex,p.homeTileId,p.workTileId,p.job,p.health,p.hunger,p.happiness,p.gold29,p.assignment,p.weapon33I,p.armor33I]),
   tech:[...(v.technologies||[])].sort(),formations:v.v33dFormations||v.fieldFormations||null})),
  wars:w.wars?.map(x=>[x.id,x.status,x.endedCal,x.winnerSide])
 })).digest('hex');
}
function trial(source,label,id){const runner=boot(source);const w=save?runner.NS.World.from(save):new runner.NS.World(19,19);
 for(let i=0;i<warmup;i++)w.advanceOneDay();
 const startRandom=runner.calls(),initial=digest(w);let sample=null;
 if(profile&&label==='candidate'&&runner.NS.V034E?.profiling)runner.NS.V034E.profiling.start(w,days);
 const begin=performance.now();for(let i=0;i<days;i++)w.advanceOneDay();const simMs=performance.now()-begin;
 if(profile&&label==='candidate')sample=runner.NS.V034E.profiling.last();
 return {run:id,label,days,simMs:+simMs.toFixed(3),msPerDay:+(simMs/days).toFixed(3),rngCalls:runner.calls()-startRandom,totalRngCalls:runner.calls(),initialDigest:initial,finalDigest:digest(w),startYear:save?.year||1,pop:w.villages.reduce((n,v)=>n+v.residents.filter(p=>p.alive).length,0),sample};
}
const rows=[];
for(let i=0;i<runs;i++){const first=i%2===0?[['baseline',baseline],['candidate',candidate]]:[['candidate',candidate],['baseline',baseline]];for(const [label,src] of first)rows.push(trial(src,label,i+1));}
const median=xs=>{const a=[...xs].sort((x,y)=>x-y);return a[Math.floor(a.length/2)];};
const A=rows.filter(x=>x.label==='baseline'),B=rows.filter(x=>x.label==='candidate');
const equivalent=rows.every((v)=>{const peer=rows.find(x=>x.run===v.run&&x.label!==v.label);return peer&&peer.initialDigest===v.initialDigest&&peer.finalDigest===v.finalDigest&&peer.rngCalls===v.rngCalls;});
const a=median(A.map(x=>x.msPerDay)),b=median(B.map(x=>x.msPerDay));
const report={format:'vilob-sim-ab-v1',saveFile:savePath?path.basename(savePath):null,hasRealSave:!!save,source:'Node VM World.advanceOneDay (does not measure browser Wall or Render)',days,runs,warmup,seed,baseline:'V0.34D3B3B',candidate:'V0.34E-rc1',baselineMedianMsDay:a,candidateMedianMsDay:b,changePercent:+((a-b)/a*100).toFixed(2),semanticStateAndRngMatch:equivalent,results:rows.map(({sample,...rest})=>rest),profile:profile?B.at(-1)?.sample:null};
const output=JSON.stringify(report,null,2);if(outputFile)fs.writeFileSync(outputFile,output+'\n');console.log(output);
if(!equivalent)process.exitCode=2;
