'use strict';
/* Tests the *generated* opt-in AND unprofiled legacy functions with controlled
 * high-housing demand. Verifies repeat-suppression and unaffected storage and
 * commerce checks even when housing construction fails. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const file=fs.readFileSync(path.join(root,'dist/hosted/assets/legacy/025.js'),'utf8');
const old=fs.readFileSync(path.join(root,'tests/baselines/index-35F.html'),'utf8');
function extract(source,name){const marker=`function ${name}(`,pos=source.indexOf(marker);assert(pos>=0,`missing ${name}`);const body=source.indexOf('{',pos);let n=0;for(let j=body;j<source.length;j++){if(source[j]==='{')n++;if(source[j]==='}'&&!--n)return source.slice(pos,j+1);}throw Error('unterminated '+name);}
// The baseline HTML stores the same function script inline.
function run(source,name,{size=55,successHouse=false,successStorage=false,successCommerce=false,busyFirst=false}={}){
 const m={house:0,storage:0,commerce:0,events:0,busy:0,counters:{},states:[]},ids=Array.from({length:size},(_,i)=>i+1);
 const tiles=new Map(ids.map(id=>[id,{id,hasBuilding:()=>false}]));
 const w={map:{get:id=>tiles.get(id)},ordinalDay:()=>0,telemetry:{record(){m.events++;}}};
 const v={status:'active',territory:new Set(ids),tradeHistory:[],buildHouse(){m.house++;return successHouse;},startConstruction(_w,_id,type){if(type==='warehouse'){m.storage++;return successStorage;}if(type==='trading_post'){m.commerce++;return successCommerce;}throw Error('unexpected '+type);},hasTech:()=>true};
 const p={isMeasuring:()=>true,measure(_name,fn){return fn()},count(k){m.counters[k]=(m.counters[k]||0)+1;}};
 const ctx={NS:{V035F:p},settlementPressure:()=>({housing:96,storage:95,commerce:92}),projectBusy(_v,id){m.busy++;return busyFirst&&id===ids[0];},remainingSpace:()=>100,buildingFootprint:()=>1,tradeVolumeIndex35D:()=>null};
 const fn=vm.runInNewContext('('+extract(source,name)+')',ctx);const action=fn(v,w);return{...m,action};
}
for(const name of ['demandDevelopment35FOriginal','demandDevelopment35FProfiled']){
 const isProfile=name.includes('Profiled');
 const stress=run(file,name);assert.equal(stress.house,1);assert.equal(stress.storage,55);assert.equal(stress.commerce,55);assert.equal(stress.action,false);
 if(isProfile){assert.equal(stress.counters.housingAttemptStarted35F1,1);assert.equal(stress.counters.housingSkippedRepeat35F1,54);assert.equal(stress.counters.housingEligible,55);assert.equal(stress.counters.storageAttempt,55);}
 const win=run(file,name,{successHouse:true});assert.equal(win.house,1);assert.equal(win.storage,0);assert.equal(win.action,true);assert.equal(win.events,1);
 const warehouse=run(file,name,{successStorage:true});assert.equal(warehouse.house,1);assert.equal(warehouse.storage,1);assert.equal(warehouse.commerce,0);assert.equal(warehouse.events,1);
 const commerce=run(file,name,{successCommerce:true});assert.equal(commerce.house,1);assert.equal(commerce.storage,1);assert.equal(commerce.commerce,1);assert.equal(commerce.events,1);
 const busy=run(file,name,{busyFirst:true});assert.equal(busy.house,1);assert.equal(busy.storage,54);assert.equal(busy.commerce,54);
}
// Confirm baseline made a global housing call for each eligible tile.
const baseline=run(old,'demandDevelopment35FOriginal');assert.equal(baseline.house,55);assert.equal(baseline.storage,55);assert.equal(baseline.commerce,55);
const transformedBase=fs.readFileSync(path.join(root,'src/legacy/025.js'),'utf8');assert(!transformedBase.includes('housingAttempted35F1'),'protected block unexpectedly modified');
const site=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');assert(site.includes('V0.35G'));assert(site.includes('v035f1.js')||site.includes('Housing construction decision simplification'));
console.log(JSON.stringify({status:'PASS',baselineHouseAttempts:baseline.house,candidateHouseAttempts:1,candidateStorageAttempts:55,profileAndUnprofiledAgree:true,protectedLegacyUntouched:true}));
