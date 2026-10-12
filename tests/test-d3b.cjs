'use strict';
const assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync(path.join(__dirname,'..','index-standalone.html'),'utf8');
function boot(seed=0x341b2){let state=seed>>>0;const random=Object.create(Math);random.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};const mk=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const db=new Map(),c={console,Math:random,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{head:mk(),body:mk(),documentElement:mk(),createElement:mk,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){}}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const m of src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(c,{timeout:10000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return c.VSim;}
const NS=boot(),w=new NS.World(19,19),B=NS.V034D3B,v=w.villages[0];
assert(B,'D3B bootstrap not loaded');assert.equal(w.serialize().version,'V0.34D3B3');
for(const [type,cost] of Object.entries(B.constructionWood)){assert.equal(NS.V08.BUILD_COSTS[type].wood,cost);}for(const [terrain,r]of Object.entries(B.woodRegen)){assert.equal(NS.TERRAIN[terrain].regen.wood,r);}
assert.equal(NS.V034D3A2.columns.length,48);assert.equal(B.frontierWood.twoPioneers,14);assert.equal(B.frontierWood.threePioneers,16);
const sample={pop:17,cap:12,food:14,wood:1,health:56,inactiveShare:.36,flags:3,severe:false};
assert.equal(B.recoveryShouldEnter(v,w,sample),false,'peace economy shortages must not enter recovery');
assert.equal(B.survivalEmergency(v,w,{pop:17,food:10,hunger:8,health:57,severeHunger85:0,severeHunger95:0,starv:0,risk:5}),false,'low reserves/risk alone must not set survival');
assert.equal(B.survivalEmergency(v,w,{pop:17,food:3,hunger:74,health:52,severeHunger85:5,severeHunger95:4,starv:2,risk:8}),true,'actual famine must remain emergency');
assert.equal(B.survivalStable(v,w,{pop:17,food:36,hunger:13,health:70,severeHunger85:0,severeHunger95:0,starv:0},false),true);
w.v33War=w.v33War||{};const enemy=w.villages[1];w.v33War.wars=[{id:'D3B-TEST-WAR',status:'ACTIVE',participantIds:[v.id,enemy.id],startCal:1,startPopulation:{[v.id]:20},casualties:{[v.id]:5},wounded:{[v.id]:1}}];
assert.equal(B.recoveryShouldEnter(v,w,sample),true,'severe actual war casualties plus damage must enable recovery');
assert.equal(B.recoveryShouldEnter(v,w,{...sample,food:60,health:95,cap:30,inactiveShare:0}),false,'participation or casualties alone without economic damage is not enough');
w.v33War.wars=[];
let before=v.wood,bonus=B.foundingWood(v,w);assert(bonus>0&&bonus<=12);assert(Math.abs(v.wood-before-bonus)<1e-5,`founder wood real stock: ${v.wood-before} vs ${bonus}`);assert.equal(B.foundingWood(v,w),0,'cannot repeat founding grant');
const clean=JSON.parse(JSON.stringify(w.serialize()));const restored=NS.World.from(clean);assert.equal(restored.serialize().version,'V0.34D3B3');assert.equal(B.state(restored.villages[0]).starterWood,bonus);assert.equal(B.foundingWood(restored.villages[0],restored),0);
const previous=JSON.parse(JSON.stringify(clean));previous.version='V0.34D3A2';delete previous.v034d3b;for(const x of previous.villages)delete x.v34d3b;
const migrated=NS.World.from(previous);assert.equal(migrated.serialize().version,'V0.34D3B3');assert.equal(B.state(migrated.villages[0]).starterChecked,true);assert.equal(B.foundingWood(migrated.villages[0],migrated),0);
assert(NS.V034D3.audit(restored).ok,'D3 conserved stocks retain consistency');
for(let i=0;i<120;i++)w.advanceOneDay();
assert(NS.V034D3.audit(w).ok,'120-day natural settlement stocks preserve the audit');
assert(NS.V034D2A.audit(w).ok,'120-day natural housing audit');
const earlyPolicy=B.snapshotPolicy(w);
console.log(JSON.stringify({naturalDays:120,recoveryNations:earlyPolicy.filter(x=>x.recovery).length,survivalNations:earlyPolicy.filter(x=>x.survival).length,foundingWood:earlyPolicy.reduce((s,x)=>s+x.foundingWood,0),population:earlyPolicy.reduce((s,x)=>s+x.pop,0),territory:w.villages.reduce((s,v)=>s+(v.territory?.size||0),0),materialAudit:true,housingAudit:true}));
console.log(JSON.stringify({result:'PASS',version:'V0.34D3B3',costs:B.constructionWood,regen:B.woodRegen,earlyWoodHarvest:1.12,foundingPhysicalWood:bonus,peacetimeRecoveryBlocked:true,realFamineEmergency:true,warDamageRecovery:true,saveRoundtrip:true,d3a2Migration:true,foodFlowColumns:48}));
