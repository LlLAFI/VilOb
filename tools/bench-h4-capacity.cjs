'use strict';
// Controlled D3 shared-settlement capacity-only microbenchmark.
// It is NOT a late-game SIM/BATCH or 150-year speed benchmark.
const fs=require('fs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
const root=path.resolve(__dirname,'..');
function boot(html){let seed=0x453812;const m=Object.create(Math);m.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
 const e=()=>({style:{},dataset:{},innerHTML:'',textContent:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return []},classList:{add(){},remove(){},toggle(){}}});
 const c={Math:m,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},alert(){},confirm(){return false},localStorage:{getItem(){return null},setItem(){}},document:{head:e(),body:e(),documentElement:e(),createElement:e,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 for(const x of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(x[1].trim())try{new vm.Script(x[1]).runInContext(c,{timeout:50000});}catch(ex){if(!/onclick/.test(ex.message))throw ex;}
 return c.VSim;
}
function prepare(NS){const w=new NS.World(19,19),v=w.activeVillages[0],core=w.map.get(v.coreTileId),rec=(w.v34b?.settlements||[]).find(x=>x.tileIds?.includes(core.id)&&x.lifecycle==='ACTIVE');if(!rec)throw Error('Missing core');
 // Assign 14 additional physical owned tiles to the same recorded settlement.
 for(const t of w.map.tiles){if(rec.tileIds.length>=15)break;if(t.ownerId!=null||t.terrain==='water')continue;t.ownerId=v.id;t.settlementId=rec.id;v.territory.add(t.id);rec.tileIds.push(t.id);}
 if(rec.tileIds.length!==15)throw Error('Missing members: '+rec.tileIds.length);
 return{w,v,core};
}
const before=boot(fs.readFileSync(path.join(root,'tests/baselines/index-H3.html'),'utf8'));
const after=boot(fs.readFileSync(path.join(root,'index-standalone.html'),'utf8'));
const a=prepare(before),b=prepare(after),keys=['food','wood','stone','iron_ore','iron','tools'];
let calls=15000;
function cycle(o){let last;const start=performance.now();for(let j=0;j<calls;j++)last=o.v.settlementCaps(o.core.id);return {ms:performance.now()-start,last:Object.fromEntries(keys.map(k=>[k,last[k]]))};}
for(let i=0;i<500;i++){a.v.settlementCaps(a.core.id);b.v.settlementCaps(b.core.id);}
const x=cycle(a),y=cycle(b);
if(JSON.stringify(x.last)!==JSON.stringify(y.last))throw Error('Capacity parity FAIL '+JSON.stringify({a:x.last,b:y.last}));
console.log(JSON.stringify({scope:'D3 settlementCaps only, synthetic 15-tile group',iterations:calls,H3ms:+x.ms.toFixed(2),H4ms:+y.ms.toFixed(2),speedup:+(x.ms/y.ms).toFixed(2),sameCaps:true}));
