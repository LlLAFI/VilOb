'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
function boot(seed=0x34d3b3,source=html){let rng=seed>>>0,randomCalls=0;const rand=Object.create(Math);rand.random=()=>{randomCalls++;rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
 const make=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const db=new Map(),ctx={console,Math:rand,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{head:make(),body:make(),documentElement:make(),createElement:make,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return {NS:ctx.VSim,ctx,calls:()=>randomCalls};}
function setup(NS){const w=new NS.World(19,19),v=w.villages[0],C=NS.V034C,diamond=[[0,0],[-1,0],[1,0],[0,-1],[0,1],[-2,0],[2,0],[0,-2],[0,2],[-1,-1],[-1,1],[1,-1],[1,1]];let core=null;
 for(let y=2;y<17&&!core;y++)for(let x=2;x<17&&!core;x++)if(diamond.every(([dx,dy])=>w.map.at(x+dx,y+dy)?.ownerId==null))core=w.map.at(x,y);
 assert(core);v.technologies.add('ROADS');C.ensure(w);
 for(const [dx,dy] of diamond){const t=w.map.at(core.x+dx,core.y+dy);t.terrain='plain';t.buildings=(dx===0&&dy===0)?['road','house']:['road'];t.buildingCondition=t.buildings.map(()=>100);t.ownerId=v.id;v.territory.add(t.id);}
 for(let i=0;i<12;i++){w.year=2+i;C.review(w);if(C.byTile(w,core.id)?.tileIds.length===13)break;}
 assert.equal(C.byTile(w,core.id).tileIds.length,13);
 // Representatives live on the grouped tiles; a large remainder lives outside
 // this Settlement, emulating a late-stage nation with small local communities.
 for(let i=0;i<240;i++)v.residents.push({id:'bench-'+i,alive:true,age:i%3?30:9,homeTileId:i<18?core.id:v.coreTileId,job:'무직',assignment:null});
 return {w,v,core,m:C.byTile(w,core.id)};
}

const b2file=process.env.VILOB_B2_BASELINE;
const b3file=process.env.VILOB_B3_BASELINE;
if(!fs.existsSync(b2file)||!fs.existsSync(b3file))throw Error('Provide VILOB_B2_BASELINE and VILOB_B3_BASELINE');
const cases=[];
for(const [name,source] of [['B2',fs.readFileSync(b2file,'utf8')],['B3',fs.readFileSync(b3file,'utf8')],['B3A',html]]){
 const z=boot(0x34d3b3,source),data=setup(z.NS),{v,w,core}=data;
 cases.push({name,...data,read:()=>v.settlementReserveDays(core.id),stock:()=>v.stockAt(core.id,'food'),member:()=>z.NS.V034D3.members(v,core.id)});
}
for(const fn of ['read','stock','member'])for(const c of cases.slice(1)){
 const aa=cases[0][fn](),bb=c[fn]();if(fn==='member')assert.equal(aa.ids.join(','),bb.ids.join(','));else assert(Math.abs(aa-bb)<1e-7);
}
const N=8000;
function run(c){let total=0;for(let i=0;i<N;i++){total+=c.read();total+=c.stock();}return total;}
const durations={B2:[],B3:[],B3A:[]};
for(const c of cases)run(c);
for(let r=0;r<4;r++){for(const c of r%2?[...cases].reverse():cases){const at=performance.now(),sum=run(c);durations[c.name].push(performance.now()-at);assert(Number.isFinite(sum));}}
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
const ms=Object.fromEntries(Object.keys(durations).map(k=>[k,+median(durations[k]).toFixed(2)]));
console.log(JSON.stringify({result:'PASS',type:'three-build-identical-synthetic-hotpath',residents:cases[0].v.residents.length,groupTiles:cases[0].m.tileIds.length,iterations:N,mediansMs:ms,fromB2toB3Speedup:+(ms.B2/ms.B3).toFixed(2),fromB3toB3ARatio:+(ms.B3/ms.B3A).toFixed(2),note:'Not a full-world/day comparison'}));
