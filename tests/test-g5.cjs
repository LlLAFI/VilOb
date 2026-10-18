'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..');
let seed=0x12345678;const randomMath=Object.create(Math);randomMath.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const elt=()=>({style:{},dataset:{},setAttribute(){},parentNode:null,innerHTML:'',textContent:'',appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
const ctx={Math:randomMath,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
const html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim,G=NS.V034G5;
assert.equal(NS.RELEASE_VERSION,'V0.34G5');assert.equal(NS.TECH_ORDER.length,43);assert(G.verify().ok,JSON.stringify(G.verify()));
for(const k of Object.keys(G.techs))assert(NS.TECH[k]&&NS.TECH_ORDER.includes(k));
const farmer={alive:true,age:26,job:'농부',assignment:null},gatherer={...farmer,job:'채집꾼'},miner={...farmer,job:'광부'},other={...farmer,job:'철공'};
const owned=new Set(),nation={hasTech:k=>owned.has(k)};
assert.equal(G.workerMultiplier(farmer,nation,'food',null,1.08),1.08);owned.add('INTENSIVE_FARMING');
assert(Math.abs(G.workerMultiplier(farmer,nation,'food',null,1.08)-1.20)<1e-9);
assert.equal(G.workerMultiplier(gatherer,nation,'food',null,1.08),1.08);assert.equal(G.workerMultiplier({...farmer,age:12},nation,'food',null,1.08),1.08);
assert.equal(G.workerMultiplier(farmer,nation,'stone',null,1.12),1.12);
owned.add('MINING_TECHNIQUES');assert(Math.abs(G.workerMultiplier(miner,nation,'stone',null,1.12)-1.24)<1e-9);
assert.equal(G.workerMultiplier(other,nation,'stone',null,1.12),1.12);
assert(Math.abs(G.oreMultiplier(nation,1.10)-1.22)<1e-9);owned.add('SYSTEMATIC_RESEARCH');assert.equal(G.scholarMultiplier(nation),1.35);owned.add('FIELD_REORGANIZATION');assert.equal(G.regroupDays(nation,20),17);assert.equal(G.postBattleDays(nation,7),6);assert.equal(G.regroupDays({hasTech:()=>false},20),20);
const src=html;
assert(src.includes("desired=(.52+Number(this.skills?.mining||0)/120)*(NS.V034G5?.oreMultiplier?.(v,factor)??factor)"),'iron mine tech on conserved storage bound path');
assert(src.includes("this.knowledgeYield()*(NS.V034G5?.scholarMultiplier?.(v)??1.20)"),'academy knowledge additive');
assert(src.includes("NS.V034G5?.workerMultiplier?.(p,v,k,t,baseMul)"),'D3A conserved generic harvest');
assert(src.includes("NS.V034G5?.postBattleDays?.(x.v,recoveryDays)"),'coalition recovery duration');
assert(src.includes("NS.V034G5?.postBattleDays?.(winner,recoveryDays)"),'war recovery duration');
assert(src.includes("afterBattle&&v.hasTech?.('FIELD_REORGANIZATION')?1.20:1"),'only postcombat morale');
const w=new NS.World(19,19);let save=JSON.parse(JSON.stringify(w.serialize()));assert.equal(save.version,'V0.34G5');
let load=NS.World.from(save);assert.equal(load.serialize().version,'V0.34G5');
const old=JSON.parse(JSON.stringify(save));old.version='V0.34G4A1';delete old.v034g5;load=NS.World.from(old);assert.equal(load.serialize().version,'V0.34G5');
const duration=Number(process.env.G5_DAYS||180);for(let d=1;d<=duration;d++){load.advanceOneDay();if(d%30===0){const audit=G.audit(load);assert(audit.integrity.ok,JSON.stringify(audit.integrity));for(const key of ['physical','settlement','conservation','reserveViolations','metabolismDuplicates','missingHomes'])assert.equal(audit.failures[key],0,key+' day '+d);assert(NS.V034D3.audit(load).ok);}}

// Exercise real D3A physical stock path, not just the bonus helper. Reset the same
// physical stock and natural stock for equal-work controlled comparisons.
const testNation=load.activeVillages[0],tile=load.map.get(Number(testNation.coreTileId));
const tune=(kind)=>{tile.lastResourceDay=load.ordinalDay();tile.resources[kind]=1000;tile.resourceCap[kind]=Math.max(1000,Number(tile.resourceCap[kind]||0));tile.stocks[kind]=0;};
const actualFarmer={...farmer}, actualMiner={...miner}, naturalD3=NS.V034D3A.harvestAndStore;
testNation.technologies.delete('INTENSIVE_FARMING');tune('food');const oldFood=naturalD3(actualFarmer,testNation,load,tile,'food',1,load.ordinalDay());
testNation.technologies.add('INTENSIVE_FARMING');tune('food');const newFood=naturalD3(actualFarmer,testNation,load,tile,'food',1,load.ordinalDay());
assert(Math.abs((newFood-oldFood)-.12)<1e-8,JSON.stringify({oldFood,newFood}));
testNation.technologies.delete('MINING_TECHNIQUES');tune('stone');const oldStone=naturalD3(actualMiner,testNation,load,tile,'stone',1,load.ordinalDay());
testNation.technologies.add('MINING_TECHNIQUES');tune('stone');const newStone=naturalD3(actualMiner,testNation,load,tile,'stone',1,load.ordinalDay());
assert(Math.abs((newStone-oldStone)-.12)<1e-8,JSON.stringify({oldStone,newStone}));
// Execute the actual 31I iron-mine work action twice with identical geological stock.
testNation.technologies.add('IRON_MINING');tile.buildings.push('iron_mine');tile.buildingCondition.push(100);
tile.resourceCap.iron_ore=1000;tile.resources.iron_ore=1000;tile.stocks.iron_ore=0;tile.stocks.tools=0;
const fakeOreMiner=Object.create(NS.Person.prototype);Object.assign(fakeOreMiner,{alive:true,age:25,assignment:null,job:'광부',workBuildingType29:'iron_mine',workTileId:tile.id,homeTileId:tile.id,skills:{mining:50},metabolism(){},knowledgeYield(){return 0;}});
testNation.technologies.delete('MINING_TECHNIQUES');NS.Person.prototype.act.call(fakeOreMiner,testNation,load);const oreOld=Number(testNation.stockAt(tile.id,'iron_ore')||0);
tile.resources.iron_ore=1000;tile.stocks.iron_ore=0;testNation.technologies.add('MINING_TECHNIQUES');NS.Person.prototype.act.call(fakeOreMiner,testNation,load);const oreNew=Number(testNation.stockAt(tile.id,'iron_ore')||0);
assert(oreNew>oreOld+0.08&&oreNew<oreOld+0.18,JSON.stringify({oreOld,oreNew}));
// Scholar must use the existing real Person Knowledge gain path when the school is built.
testNation.technologies.add('ACADEMY');tile.buildings.push('schoolhouse');tile.buildingCondition.push(100);
const fakeScholar=Object.create(NS.Person.prototype);Object.assign(fakeScholar,{alive:true,age:25,assignment:null,job:'학자',currentAction:'',metabolism(){},knowledgeYield(){return .058;}});
testNation.technologies.delete('SYSTEMATIC_RESEARCH');
let scienceBefore=Number(testNation.totalKnowledge||0);NS.Person.prototype.act.call(fakeScholar,testNation,load);const oldScience=Number(testNation.totalKnowledge||0)-scienceBefore;
testNation.technologies.add('SYSTEMATIC_RESEARCH');scienceBefore=Number(testNation.totalKnowledge||0);NS.Person.prototype.act.call(fakeScholar,testNation,load);const newScience=Number(testNation.totalKnowledge||0)-scienceBefore;
assert(newScience>oldScience*1.10,JSON.stringify({oldScience,newScience}));
// Preserve new-tech ownership through the real save/migration chain.
const techSaved=JSON.parse(JSON.stringify(load.serialize()));const techReload=NS.World.from(techSaved);
assert(techReload.villages.find(x=>String(x.id)===String(testNation.id)).hasTech('INTENSIVE_FARMING'));

const report=load.telemetry.toJSON(load);assert.equal(report.version,'V0.34G5');assert.equal(report.worldSummary.techCount,43);
assert.equal(NS.V034G3B.joinLimit,1);assert.equal(NS.V034F0.needFor({age:30}),.39);assert.equal(NS.V034F0.needFor({age:10}),.28);
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,technologies:43,workerBonuses:'PASS',academy:'PASS',oreStorageGuard:'PASS',formationTimers:'PASS',naturalDays:duration,saveMigration:'PASS',audits:'PASS'}));
