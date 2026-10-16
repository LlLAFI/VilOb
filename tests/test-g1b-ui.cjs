'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index-standalone.html'),'utf8');
const element=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},insertAdjacentElement(){},classList:{toggle(){}}});
const ctx={console,Math,Set,Map,WeakMap,WeakSet,Date,JSON,Blob,URL,ArrayBuffer,Uint8Array,TextEncoder,TextDecoder,structuredClone,performance:require('node:perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:element(),body:element(),documentElement:element(),createElement:element,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){}},alert(){},confirm(){return false}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim;assert.equal(NS.RELEASE_VERSION,'V0.34G1B');
const t1={id:11,x:1,y:1,buildings:['house','road'],buildingCondition:[88,91]},t2={id:12,x:2,y:1,buildings:['house','warehouse'],buildingCondition:[93,100]};
const w={map:{get(id){return id===11?t1:id===12?t2:null;}}};
const stock={food:60,wood:100,stone:7,iron_ore:10,iron:1,tools:3},capacity={food:150,wood:250,stone:40,iron_ore:90,iron:20,tools:15};
const v={stockAt(id,k){assert.equal(id,11);return stock[k];},settlementCaps(id){assert.equal(id,11);return capacity;}};
const g={settlementId:'S-TEST',coreTileId:11,tileIds:[11,12],population:8,capacity:12,shortage:0};
const d=NS.V034G1B.groupData(v,w,g,{count:8,health:600,happiness:520,age:150,hunger:200,severe:0,critical:0,jobs:new Map([['농부',6]])});
assert.equal(d.stock.food,60);assert.equal(d.stock.wood,100);assert.equal(d.capacity.iron_ore,90);assert.equal(d.counts.get('house'),2);assert.equal(d.ids.length,2);assert.equal(d.people.count,8);
const serialized=new NS.World(19,19).serialize();assert.equal(serialized.version,'V0.34G1B');
assert.equal(NS.World.from(JSON.parse(JSON.stringify(serialized))).serialize().version,'V0.34G1B');
const prior={...serialized,version:'V0.34G1A'};assert.equal(NS.World.from(prior).serialize().version,'V0.34G1B');
console.log(JSON.stringify({result:'PASS',settlementPhysicalTiles:2,sharedFood:d.stock.food,sharedWood:d.stock.wood,ironOreCapacity:d.capacity.iron_ore,houseCount:d.counts.get('house'),saveMigration:'G1A↔G1B OK'}));
