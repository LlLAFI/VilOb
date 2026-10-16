/* F3 unit / deterministic natural-run / F2 migration validation. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(seed=0x2a93f142){let state=seed,calls=0;
 const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const match of fs.readFileSync(path.join(root,'index-standalone.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){
  if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 }
 assert.equal(ctx.VSim.RELEASE_VERSION,'V0.34F3');assert(ctx.VSim.V034F2.enabled&&ctx.VSim.V034F3.enabled);
 return {NS:ctx.VSim,calls:()=>calls};
}
const {NS}=boot();const f=NS.V034F3;
// Health shortfall versus cumulative Hunger: max, not sum. Continuous at 60/80.
for(const [ratio,hunger,expected] of [[1,0,0],[0,100,1],[0.5,100,.65],[1,80,.325],[1,100,.65],[.3,60,.7],[1,60,0]])assert(Math.abs(f.nutritionLoss(ratio,hunger)-expected)<1e-9);
assert(f.nutritionLoss(1,79)<f.nutritionLoss(1,80));assert(f.nutritionLoss(1,80)<f.nutritionLoss(1,81));
// Health=0 must not alias the missing-value default: higher impairment, no instant kill.
assert.equal(f.illnessHealthFactor(30),1);assert.equal(f.illnessHealthFactor(null),1);assert(Math.abs(f.illnessHealthFactor(0)-1.36)<1e-12);
assert(f.illnessHealthFactor(0)>f.illnessHealthFactor(1));
// One convergence step, including food/housing/festival within the single target.
const p={health:70,hunger:50,energy:75,happiness:65,housingStrainDays:0,homeTileId:123};
const village={festivalState:null},clock={ordinalDay:()=>10};
let target=f.happinessTarget(p,village,clock,1,0);assert(target>=15&&target<=95);
const prior=p.happiness;f.updateHappiness(p,village,clock,1,0);
assert(Math.abs(p.happiness-(prior+(target-prior)*.016))<1e-10);assert.equal(p.happinessTarget,target);
assert(f.happinessTarget(p,village,clock,.5,0)<target);
assert(f.happinessTarget(p,village,clock,1,1)<target);
village.festivalState={tileId:123,until:15};assert.equal(f.happinessTarget(p,village,clock,1,0),target+8);
village.festivalState={tileId:567,until:15};assert.equal(f.happinessTarget(p,village,clock,1,0),target+3);
village.festivalState=null;
// End-to-end survival: an already weak person must be able to gain Health
// when nourished, and chronic Hunger cannot cause double nutrition penalty.
const sim=new NS.World(19,19),v=sim.villages.find(x=>x.residents.some(p=>p.alive));assert(v);
const actor=v.residents.find(x=>x.alive);actor.health=0;actor.hunger=0;actor.energy=80;actor.happiness=50;
NS.V034F0.survive(actor,v,sim,false,.42,.42,0);
assert(actor.alive);assert(actor.health>0,'Health zero can recover without instant death');
assert(Number.isFinite(actor.happiness)&&actor.happiness>=0&&actor.happiness<=100);
// Save and migration on an initial world to avoid repeating the expensive full
// mature-world serialization for each deterministic repetition.
const stored=sim.serialize();assert.equal(stored.version,'V0.34F3');
assert(stored.v034f2&&stored.v034f3);
assert.equal(NS.World.from(JSON.parse(JSON.stringify(stored))).serialize().version,'V0.34F3');
const f2save={...stored,version:'V0.34F2'};delete f2save.v034f3;
assert.equal(NS.World.from(JSON.parse(JSON.stringify(f2save))).serialize().version,'V0.34F3');
// Long-run reproduction under same F3 runtime, same seed, same RNG order.
function run(days){const {NS,calls}=boot(0x5aa7b9de);const w=new NS.World(19,19);for(let i=0;i<days;i++){w.advanceOneDay();if((i+1)%30===0){assert(NS.V034D3.audit(w).ok,'physical stock audit '+(i+1));}}
 const d=NS.V034F2.diagnostics(w);assert.equal(d.duplicateMetabolismRequests,0);assert.equal(d.missingHomes,0);assert(d.aliveProcessed>0&&d.completedCycles>0);
 const summary={date:[w.year,w.season,w.day],people:w.villages.map(v=>v.population()),food:w.villages.map(v=>Number(v.foodReserveDays().toFixed(7))),health:w.villages.map(v=>Number((v.residents.filter(p=>p.alive).reduce((s,p)=>s+p.health,0)/Math.max(1,v.population())).toFixed(7))),happiness:w.villages.map(v=>Number((v.residents.filter(p=>p.alive).reduce((s,p)=>s+p.happiness,0)/Math.max(1,v.population())).toFixed(7))),rngCalls:calls()};
 assert.equal(NS.V034F1A1.columns.length,52);assert.equal(NS.V034D0.schema.columnCount,1683);
 return {digest:crypto.createHash('sha256').update(JSON.stringify(summary)).digest('hex'),summary,cycles:d.completedCycles,alive:d.aliveProcessed};
}
const days=Math.max(3,Number(process.env.F3_DAYS||3)),first=run(days),second=run(days);
assert.equal(first.digest,second.digest,'F3 deterministic same-seed repeats');
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,days,digest:first.digest,cycles:first.cycles,alive:first.alive,final:first.summary,healthZeroFactor:f.illnessHealthFactor(0)}));
