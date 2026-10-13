'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
const silent=fs.readFileSync(path.join(__dirname,'fixtures','v034D3B3A-index.html'),'utf8');
function boot(source){let rng=0x34343634;const rand=Object.create(Math);rand.random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};const make=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const ctx={console,Math:rand,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem(){return null},setItem(){}},document:{head:make(),body:make(),documentElement:make(),createElement:make,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return ctx.VSim;}
const N=25000,R=7,types=[['B3B',html],['B3A',silent]];const cases=types.map(([name,s])=>{const NS=boot(s),w=new NS.World(19,19),v=w.villages[0],tid=v.coreTileId;return{name,v,w,tid}});
function run(c){let sum=0;for(let i=0;i<N;i++)sum+=c.v.withdrawAt(c.tid,'food',1e-9);return sum;}
// exact physical pool, large enough for run, no starvation in benchmark
for(const c of cases){const t=c.w.map.get(c.tid);t.stocks.food=1000;}
for(const c of cases)run(c);
const times={};for(const c of cases)times[c.name]=[];
for(let r=0;r<R;r++)for(const c of r%2?cases.slice().reverse():cases){const s=performance.now();const x=run(c);times[c.name].push(performance.now()-s);}
const median=x=>[...x].sort((a,b)=>a-b)[Math.floor(x.length/2)];
console.log(JSON.stringify({N,times,medians:Object.fromEntries(cases.map(c=>[c.name,median(times[c.name])])),note:'25k food withdrawals B3A vs B3B; result correctness separately tested.'}));
