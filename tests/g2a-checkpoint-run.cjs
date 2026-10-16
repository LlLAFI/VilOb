'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file=path.join(root,'index-standalone.html'),seed=0x19a34d){
 let rngState=seed,calls=0;const math=Object.create(Math);math.random=()=>{calls++;rngState^=rngState<<13;rngState^=rngState>>>17;rngState^=rngState<<5;return(rngState>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const storage=new Map(),ctx={Math:math,console,Map,Set,WeakMap,WeakSet,JSON,Date,performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:50000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls,reset:(seed)=>{rngState=seed;calls=0;}};
}
const fp=process.argv[2]||require('node:path').join(__dirname,'..','index-standalone.html');
const {NS,calls,reset}=boot(fp);
if(process.argv[3]==='makeSave'){require('node:fs').writeFileSync(process.argv[4],JSON.stringify(new NS.World(19,19).serialize()));process.stdout.write('SAVE_CREATED');process.exit(0);}
const world=NS.World.from(JSON.parse(require('node:fs').readFileSync(process.argv[3],'utf8')));
reset(0x3ab1459);
const checkpoints=[];
for(let i=1;i<=180;i++){
 world.advanceOneDay();
 if([30,90,180].includes(i)){
 const persons=[];
 for(const v of world.villages)for(const p of v.residents||[])persons.push([p.id,p.homeTileId,p.alive,p.age,p.hunger,p.health,p.happiness].map(x=>typeof x==='number'?+x.toFixed(8):x));
 persons.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));
 const stocks=[];
 for(let t=0;t<361;t++){const x=world.map.get(t);if(x?.ownerId!=null)stocks.push([t,x.ownerId,...['food','wood','stone','iron_ore','iron','tools'].map(k=>+Number(x.stocks?.[k]||0).toFixed(8))]);}
 checkpoints.push({days:i,rng:calls(),persons,stocks,settlements:world.villages.map(v=>[v.id,v.population(),v.territory.size])});
 }
}
process.stdout.write(JSON.stringify(checkpoints));
