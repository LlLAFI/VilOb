'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
function boot(file,seed=0x6bc8e002){let state=seed,calls=0;const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};
}
const root=path.join(__dirname,'..'),base=boot(path.join(root,'index-F0-baseline.html')),target=boot(path.join(root,'index-F1-baseline.html'));
assert.equal(base.NS.RELEASE_VERSION,'V0.34F0');assert.equal(target.NS.RELEASE_VERSION,'V0.34F1');assert(target.NS.V034F1);
const a=new base.NS.World(19,19),b=new target.NS.World(19,19);
function fingerprint(w){const data=w.serialize();return JSON.stringify({year:data.year,day:data.day,season:data.season,villages:data.villages,map:data.map,war:data.wars,settlements:data.v34b||data.v034b});}
function compare(label){assert.equal(base.calls(),target.calls(),`${label}: simulation RNG calls changed`);const sa=fingerprint(a),sb=fingerprint(b);if(sa!==sb){let i=0;while(i<sa.length&&sa[i]===sb[i])i++;throw Error(`${label}: world mismatch at ${i} baseline=${sa.slice(i,i+180)} candidate=${sb.slice(i,i+180)} lengths ${sa.length}/${sb.length}`);}}
compare('initial');const days=Math.min(360,Math.max(30,Number(process.env.F1_DAYS||90)));for(let d=0;d<days;d++){a.advanceOneDay();b.advanceOneDay();if(d%30===29)compare(`day${d+1}`);}compare('final');
const record=target.NS.V034F1.report(b);assert(record.totals.groups>0);assert.equal(record.version,'V0.34F1');
const consumption=target.NS.V034F0.performanceReport(b).consumption;assert.equal(consumption.unmatched,0);assert.equal(consumption.returnFailed,0);assert(target.NS.V034D3.audit(b).ok);
// Trace start/finish doesn't change the underlying F0 RNG or world state.
target.NS.V034F1.startTrace(b,6);for(let d=0;d<6;d++){a.advanceOneDay();b.advanceOneDay();}compare('trace6days');const trace=target.NS.V034F1.traceLast();assert(trace&&trace.completedDays===6);assert.equal(trace.days[0].offset,1);assert(trace.days.every(x=>Number.isFinite(x.elapsedMs)&&x.elapsedMs>=0));assert(!target.NS.V034F1.traceActive());
const save=b.serialize();assert.equal(save.version,'V0.34F1');const restored=target.NS.World.from(JSON.parse(JSON.stringify(save)));assert.equal(restored.serialize().version,'V0.34F1');assert.equal(target.NS.V034F1.report(restored).totals.groups,target.NS.V034F1.report(b).totals.groups);
const f0save=a.serialize();const migrated=target.NS.World.from(JSON.parse(JSON.stringify(f0save)));assert.equal(migrated.serialize().version,'V0.34F1');assert.equal(migrated.year,b.year);assert.equal(migrated.villages.reduce((x,v)=>x+v.population(),0),b.villages.reduce((x,v)=>x+v.population(),0));assert(target.NS.V034D3.audit(migrated).ok);
// Targeted severe shortage: food truly removed from the shared Settlement stock.
const shock=new target.NS.World(19,19),v=shock.villages.find(v=>v.residents.some(p=>p.alive)),p=v.residents.find(p=>p.alive),membership=target.NS.V034D3.members(v,p.homeTileId);for(const tileId of membership.ids)shock.map.get(tileId).stocks.food=0;
p.metabolism(v,shock,false);const alarm=target.NS.V034F1.report(shock);assert(alarm.totals.partialGroups>=1);assert(alarm.totals.criticalGroups>=1);assert(alarm.rows.some(r=>r.criticalCycles>0));assert(target.NS.V034D3.audit(shock).ok);
// Independent recovery-sensitivity laboratory (same F0 formula, no balance change).
function healthPath(ratio,days){const person={age:30,health:60,hunger:70,energy:65,happiness:60,housingStrainDays:0},nation={hasTech(){return false;}},world={ordinalDay(){return 1;}};for(let i=0;i<days;i++)target.NS.V034F0.survive(person,nation,world,false,.42*ratio,.42,0);return {health:person.health,hunger:person.hunger};}
const full=healthPath(1,180),partial=healthPath(.9,180),zero=healthPath(0,60);assert(full.health>partial.health,'partial ration should affect health');assert(zero.health<partial.health,'zero ration should be harsher');
console.log(JSON.stringify({status:'PASS',days,parity:'F0==F1',rngCalls:target.calls(),foodAudited:true,saveAndF0Import:true,diagnosticGroups:record.totals.groups,severeShortage:alarm.totals.criticalGroups,traceDays:trace.completedDays,recoveryLab:{full,partial,zero}}));
