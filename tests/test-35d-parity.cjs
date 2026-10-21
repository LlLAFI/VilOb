'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{performance}=require('perf_hooks');
function load(file){let seed=0x427abcde;const m=Object.create(Math);m.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},classList:{add(){},remove(){},toggle(){}}});
 const c={Math:m,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 const html=fs.readFileSync(file,'utf8');for(const a of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(a[1].trim())try{new vm.Script(a[1]).runInContext(c,{timeout:120000})}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {ns:c.VSim,setSeed(x){seed=x;},getSeed(){return seed>>>0;}};
}
const root=path.join(__dirname,'..'),A=load(path.join(root,'tests/baselines/index-35C.html')),B=load(path.join(root,'index-standalone.html'));
const base=JSON.parse(JSON.stringify(new A.ns.World(19,19).serialize()));
const keys=['year','quarter','day','map','villages','persons','people','v34b','v34c','v33e','v33f5','v33g','v29Nations'];
const canonical=(value,key)=>{const x=JSON.parse(JSON.stringify(value??null));if(key==='v34c'&&x?.counters){delete x.counters.totalReviewMs;delete x.counters.maxReviewMs;}return JSON.stringify(x);};
function run(engine,profile,stress){engine.setSeed(0x1234beef);const w=engine.ns.World.from(JSON.parse(JSON.stringify(base)));engine.setSeed(0x56781234);
 if(stress){for(const v of w.activeVillages){const ids=[...v.territory];if(ids.length<2)continue;v.tradeHistory=Array.from({length:240},(_,i)=>({day:w.ordinalDay()-i%160,buyerTileId:ids[i%ids.length],sellerTileId:ids[(i+1)%ids.length],qty:(i%9+1)*.17}));}}
 if(profile)engine.ns.V035D.start(w);
 const days=Number(process.env.V35D_PARITY_DAYS||91);for(let i=0;i<days;i++)w.advanceOneDay();const profileResult=profile?engine.ns.V035D.stop():null;
 return{save:JSON.parse(JSON.stringify(w.serialize())),rng:engine.getSeed(),profileResult};}
for(const stress of [false,true]){
 const a=run(A,false,stress),b=run(B,false,stress),p=run(B,true,stress);
 for(const k of keys){assert.equal(canonical(a.save[k],k),canonical(b.save[k],k),`35C→35D unprofiled ${k} stress=${stress}`);assert.equal(canonical(a.save[k],k),canonical(p.save[k],k),`35C→35D profiled ${k} stress=${stress}`);}
 assert.equal(a.rng,b.rng,`RNG without profile stress=${stress}`);assert.equal(a.rng,p.rng,`RNG with profile stress=${stress}`);
 assert(p.profileResult.observedDays>0);if(Number(process.env.V35D_PARITY_DAYS||91)>=90)assert(p.profileResult.metrics.demandDevelopment.calls>0);
 console.log(JSON.stringify({status:'PASS',stress,days:Number(process.env.V35D_PARITY_DAYS||91),keys:keys.length,rngEqual:true,diagnosticCalls:p.profileResult.metrics.demandDevelopment.calls}));
}
