'use strict';
// Exact G1A two-number calibration and G1->G1A save compatibility.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
let rng=17;const rand=Object.create(Math);rand.random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
const storage=new Map();const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},textContent:'',innerHTML:''});
const ctx={console,Math:rand,Map,Set,WeakMap,JSON,Date,Blob,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,performance:require('node:perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''},URL};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim,Engine=NS.V035G1A;
assert.equal(NS.RELEASE_VERSION,'V0.35H0');assert.equal(Engine,NS.V035G1);assert.equal(NS.TECH_ORDER.length,43);
assert.deepEqual(JSON.parse(JSON.stringify(Engine.report({villages:[],calendarOrdinalDay:()=>0}).constants)),{baseDaily:0.8,landPerTick:0.55,localPerAdult:0.05,localMax:0.25,architectMultiplier:3,reviewDays:30});
assert.equal(Engine.constants.BASE_DAILY,.8);assert.equal(Engine.constants.ARCH_MULT,3);
const w=new NS.World(19,19),v=w.activeVillages[0],tile=w.map.get(v.coreTileId);
const project={id:'g1a-construction-test',tileId:tile.id,type:'house',totalLabor25:200,laborProgress25:0};
function mini(adults,arch=false){const arr=Array.from({length:adults},(_,i)=>({id:`adult${i}`,alive:true,age:25,assignment:null,militaryStatus32A:null,job:'일반',homeTileId:tile.id}));if(arch){const a={id:'architect',alive:true,age:30,job:'건축가',homeTileId:tile.id,v35g1Dispatch:{phase:'WORK',kind:'construction',projectId:project.id,paused:false}};arr.push(a);}
 return {id:v.id,residents:arr};}
const approx=(n,want)=>assert(Math.abs(n-want)<1e-9,`${n} != ${want}`);
const empty=mini(0),five=mini(5),six=mini(6),arch=mini(4,true);
approx(Engine.work(empty,w,project,'construction'),2.4);
approx(Engine.work(five,w,project,'construction'),3.0);
approx(Engine.work(six,w,project,'construction'),3.0);
approx(Engine.work(arch,w,project,'construction'),9.0);
assert.equal(project._v35gLastReason,'G1A_ARCHITECT_3_0X');
const land={id:'g1a-land',tileId:tile.id,duration:80,progress:0};
approx(Engine.landWork(empty,w,land),0.55);
const landArch=mini(0,true);landArch.residents[0].v35g1Dispatch.kind='land';landArch.residents[0].v35g1Dispatch.projectId=land.id;
approx(Engine.landWork(landArch,w,land),1.7325);
// Old G1 states include construction progress and architect dispatches: neither may be silently dropped.
const before=JSON.parse(JSON.stringify(w.serialize()));before.version='V0.35G1';
const sourceVillage=before.villages.find(x=>String(x.id)===String(v.id));
sourceVillage.v35g1={baselineCycles:100,baselineEffective:75,architectEffectiveExtra:28,architectDispatches:4,architectReturns:3};
sourceVillage._v35g1LastReview=60;
const imported=NS.World.from(before),iv=imported.villages.find(x=>String(x.id)===String(v.id));
assert.equal(iv.v35g1.baselineCycles,100);assert.equal(iv.v35g1.architectEffectiveExtra,28);assert.equal(iv._v35g1LastReview,60);
assert.equal(imported.serialize().version,'V0.35H0');
const after=JSON.parse(JSON.stringify(imported.serialize())),reload=NS.World.from(after);
assert.equal(reload.serialize().version,'V0.35H0');assert.equal(reload.villages.find(x=>String(x.id)===String(v.id)).v35g1.baselineCycles,100);
storage.set('village-observer-v035g1',JSON.stringify(before));assert.equal(NS.SaveSystem.load().serialize().version,'V0.35H0');
NS.SaveSystem.save(reload);assert(storage.has('village-observer-v035h0'));assert.equal(NS.SaveSystem.load().serialize().version,'V0.35H0');
assert.equal(reload.telemetry.toJSON(reload).worldSummary.v35g1Construction.constants.architectMultiplier,3);
assert.equal(NS.PATCH_NOTES[0].version,'V0.35H0');assert(NS.PATCH_NOTES.some(x=>x.version==='V0.35G1'));
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,baseWithoutAdults:2.4,baseWithCap:3,withArchitect:9,landBase:0.55,landArchitect:1.7325,oldG1Save:'PASS',localFallback:'PASS',newSaveKey:'PASS',tech:NS.TECH_ORDER.length}));
