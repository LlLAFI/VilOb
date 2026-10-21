#!/usr/bin/env node
/* V0.35A portable repeatable 35E ↔ 35F Node VM benchmark.
 * An actual user's save stays on their own computer; none is uploaded.
 * IMPORTANT: Node World.advanceOneDay measurements are NOT browser ×10 SIM/BATCH.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..'),argv=process.argv.slice(2);
function option(name,def){const i=argv.indexOf('--'+name);return i>=0?argv[i+1]:def;}
const savePath=option('save',null),days=Math.max(1,Math.min(360,Number(option('days',30))||30)),warmup=Math.max(0,Math.min(60,Number(option('warmup',3))||0)),runs=Math.max(1,Math.min(12,Number(option('runs',3))||3));
const seed=Number(option('seed',20261020))>>>0,profile=argv.includes('--profile'),output=option('output',null);
const saved=savePath?JSON.parse(fs.readFileSync(path.resolve(savePath),'utf8')):null;
const sources={baseline:fs.readFileSync(path.join(root,'tests/baselines/index-35E.html'),'utf8'),candidate:fs.readFileSync(path.join(root,'index-standalone.html'),'utf8')};
function launch(html){let rng=seed||1,calls=0;
 const math=Object.create(Math);math.random=()=>{calls++;rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;};
 const elt=()=>({style:{},dataset:{},innerHTML:'',textContent:'',appendChild(){},insertAdjacentElement(){},addEventListener(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
 const ctx={Math:math,console,performance,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1792560000000;}},Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};
 vm.createContext(ctx);for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,reseed(x){rng=x>>>0;calls=0;},calls(){return calls;}};
}
function digest(w){const canonical={time:[w.year,w.quarter,w.day],tiles:w.map.tiles.map(t=>[t.id,t.ownerId,t.settlementId,t.v33OccupierId,t.stocks,t.resources,t.buildings,t.buildingCondition,t.developedBuildSpace]),nations:w.villages.map(v=>({id:v.id,status:v.status,gold:v.gold,territory:[...v.territory].sort((a,b)=>a-b),residents:v.residents.map(p=>[p.id,p.alive,p.age,p.sex,p.homeTileId,p.workTileId,p.job,p.health,p.hunger,p.happiness,p.gold29,p.weapon33I,p.armor33I]),tech:[...(v.technologies||[])].sort(),formations:v.v33dFormations||v.fieldFormations||null})),wars:w.wars?.map(x=>[x.id,x.status,x.endedCal,x.winnerSide])};return crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');}
function trial(version,i,instrument=false){const e=launch(sources[version]);e.reseed(seed);const w=saved?e.NS.World.from(JSON.parse(JSON.stringify(saved))):new e.NS.World(19,19);e.reseed(seed^0x514c2487);
 for(let j=0;j<warmup;j++)w.advanceOneDay();const startDigest=digest(w);e.reseed(seed^0x31415926);const year=w.year;
 if(instrument)e.NS.V035F.start(w);
 const before=performance.now();for(let j=0;j<days;j++)w.advanceOneDay();const elapsed=performance.now()-before;
 const profiled=instrument?e.NS.V035F.stop():null;
 return {run:i,variant:version,fromYear:year,days,elapsedMs:+elapsed.toFixed(3),msPerDay:+(elapsed/days).toFixed(4),startDigest,endDigest:digest(w),rngCalls:e.calls(),profile:profiled};
}
const results=[];for(let i=1;i<=runs;i++){const order=i%2?["baseline","candidate"]:["candidate","baseline"];for(const kind of order)results.push(trial(kind,i));}
const med=xs=>{const a=[...xs].sort((x,y)=>x-y);return(a[Math.floor((a.length-1)/2)]+a[Math.floor(a.length/2)])/2;};
const peers=Array.from({length:runs},(_,i)=>results.filter(r=>r.run===i+1)),equal=peers.every(([a,b])=>a.startDigest===b.startDigest&&a.endDigest===b.endDigest&&a.rngCalls===b.rngCalls);
const baselineMedian=med(results.filter(r=>r.variant==='baseline').map(r=>r.msPerDay)),candidateMedian=med(results.filter(r=>r.variant==='candidate').map(r=>r.msPerDay));
let measuredProfile=null;if(profile){const x=trial('candidate','profile',true),y=trial('baseline','profile',false);if(x.startDigest!==y.startDigest||x.endDigest!==y.endDigest||x.rngCalls!==y.rngCalls)throw Error('Profiled state/RNG mismatch');measuredProfile=x.profile;}
const report={format:'vilob-35f-ab-benchmark-v1',source:'Node VM / World.advanceOneDay only; not browser Wall, Render, or 10x SIM/BATCH',baseline:'V0.35E',candidate:'V0.35F',save:savePath?{source:'local file',filename:path.basename(savePath),version:saved?.version||null}:{source:'synthetic fresh 19x19 world',version:'V0.35F'},days,warmup,runs,seed,baselineMedianMsPerDay:baselineMedian,candidateMedianMsPerDay:candidateMedian,unprofiledChangePercent:+((baselineMedian-candidateMedian)/Math.max(.001,baselineMedian)*100).toFixed(2),matchedStartEndStateAndRng:equal,rows:results.map(({profile,...r})=>r),instrumentedProfile:measuredProfile};
const outputText=JSON.stringify(report,null,2);if(output)fs.writeFileSync(path.resolve(output),outputText+'\n');else console.log(outputText);
if(!equal)process.exitCode=2;
