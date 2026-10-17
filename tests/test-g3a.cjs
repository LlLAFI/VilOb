'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..');
function boot(filename){let rng=0x1a23acdd,calls=0;const math=Object.create(Math);math.random=()=>{calls++;rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
 const element=()=>({style:{},setAttribute(){},innerHTML:'',textContent:'',parentNode:null,appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const store=new Map();const context={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{head:element(),body:element(),documentElement:element(),createElement:element,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 context.window=context;context.addEventListener=()=>{};vm.createContext(context);
 const html=fs.readFileSync(filename,'utf8');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(context,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:context.VSim,calls:()=>calls,reset:()=>{rng=0x1a23acdd;calls=0;}};
}
const prior=boot(path.join(root,'tests/fixtures-for-g3a-baseline.html'));
const newer=boot(path.join(root,'index-standalone.html'));
const A=newer.NS,B=prior.NS;
assert.equal(A.RELEASE_VERSION,'V0.34G3A');assert.equal(A.V034G3.version,'V0.34G3');
for(const [label,NS] of [['G3A',A],['G3',B]]){
 const world=new NS.World(19,19);
 if(label==='G3A'){
  const integrity=NS.V034G3A.verify(world);assert(integrity.ok,JSON.stringify(integrity));
  const before=NS.V034G3.summary(world);const r1=world.telemetry.toJSON(world);const mid=NS.V034G3.summary(world);const r2=world.telemetry.toJSON(world);const after=NS.V034G3.summary(world);
  assert.deepEqual(before,mid,'Devlog read must not mutate G3 policy counters');assert.deepEqual(before,after,'Repeated Devlog must be read-only');
  assert.equal(r1.version,'V0.34G3A');assert.equal(r2.version,'V0.34G3A');
  const original=JSON.stringify(world.serialize());const reads=NS.V034G3A.audit(world);assert.equal(reads.integrity.ok,true);assert.deepEqual(after,NS.V034G3.summary(world),'G3A.audit must be read-only');const afterAudit=world.serialize();const preAudit=JSON.parse(original);const changed=Object.keys(afterAudit).filter(k=>JSON.stringify(afterAudit[k])!==JSON.stringify(preAudit[k]));if(changed.length)console.log('READ_SIDE_EFFECT_KEYS',changed.map(k=>[k,JSON.stringify(preAudit[k]).length,JSON.stringify(afterAudit[k]).length]));
  const oldSave={...world.serialize(),version:'V0.34G3'};delete oldSave.v034g3a;
  assert.equal(NS.World.from(JSON.parse(JSON.stringify(oldSave))).serialize().version,'V0.34G3A');
 }
}
// Use one identical serialized starting world. Independent fresh-world constructors
// consume time/seed bootstrap values and are not a valid parity baseline.
const days=Number(process.env.G3A_PARITY_DAYS||90);
prior.reset();const fixtureWorld=new B.World(19,19),fixture=JSON.stringify(fixtureWorld.serialize());
function simulate(runner,days){runner.reset();const w=runner.NS.World.from(JSON.parse(fixture));for(let day=0;day<days;day++)w.advanceOneDay();return w;}
const first=simulate(prior,days),priorCalls=prior.calls();
const second=simulate(newer,days),newerCalls=newer.calls();
function canonical(w){const d=w.serialize();return JSON.stringify({year:d.year,season:d.season,day:d.day,map:d.map,villages:d.villages,war:d.wars,settlements:d.v34b,frontier:d.frontierProjects,latestEvent:d.events?.[0]?.code});}
const a=JSON.parse(canonical(first)),b=JSON.parse(canonical(second));const keys=Object.keys(a).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));assert.deepEqual(keys,[],'G3/G3A semantic differences: '+JSON.stringify(keys));
assert.equal(priorCalls,newerCalls,'G3A must preserve RNG draws from identical starting save');
const g3a=second.telemetry.toJSON(second);const score=A.V034G3.summary(second);second.telemetry.toJSON(second);assert.deepEqual(score,A.V034G3.summary(second));
console.log(JSON.stringify({result:'PASS',days,rngCalls:newerCalls,population:second.allPeople.length,settlements:g3a.worldSummary.v034cSettlementState?.counts?.activeSettlements,integrity:A.V034G3A.verify(second).ok,telemetryPure:true,worldParity:true}));
