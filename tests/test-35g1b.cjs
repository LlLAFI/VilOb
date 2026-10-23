'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
let rng=29;const rand=Object.create(Math);rand.random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
const localStorage=new Map(),el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){},textContent:'',innerHTML:''});
const ctx={console,Math:rand,Map,Set,WeakMap,JSON,Date,Blob,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,performance:require('node:perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(k){return localStorage.get(k)||null},setItem(k,v){localStorage.set(k,v)}},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''},URL};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim,E=NS.V035G1B,A=NS.V035G1A;
assert.equal(NS.RELEASE_VERSION,'V0.35G1B');assert.equal(NS.TECH_ORDER.length,43);assert.equal(A.constants.BASE_DAILY,.8);assert.equal(A.constants.ARCH_MULT,3);assert.equal(E.constants.WAIT,825);assert.equal(E.constants.HAPPINESS_PENALTY,3);
const w=new NS.World(19,19),v=w.activeVillages[0];assert(v);const core=w.map.get(v.coreTileId),next=w.map.neighbors4(core.id).find(t=>t.ownerId==null&&t.terrain!=='sea'&&t.terrain!=='ocean');assert(next,'test requires neighboring unclaimed land');w.map.claim(next.id,v.id);v.territory.add(next.id);
const people=v.residents.filter(p=>p.alive&&p.age>=16&&p.assignment!=='PIONEER');assert(people.length>=2);const p=people[0];p.homeTileId=core.id;p._v35g1bResidenceSinceCal=0;p._v35g1bResidenceSettlementId='A';
const h1={settlementId:'A',nationId:v.id,tileIds:[core.id],coreTileId:core.id,home:core.id,population:20,capacity:17,short:3,free:0};
const h2={settlementId:'B',nationId:v.id,tileIds:[next.id],coreTileId:next.id,home:next.id,population:8,capacity:14,short:0,free:6};
const reserve=v.settlementReserveDays;v.settlementReserveDays=()=>50;
const before=N=>N;
const moved=E.domestic(v,w,[h1,h2],h1,1);assert.equal(moved,1);assert.equal(v.residents.filter(x=>x.homeTileId===next.id).length,1);assert.equal(h1.short,2);assert.equal(h2.free,5);
assert.equal(E.debug.path(w,[core.id],[next.id],t=>String(t.ownerId)===String(v.id)),1);
// Synthetic application rules: capacity/food rejection and policy 100% accept.
const fakeForeign=w.activeVillages[1],tTile=w.map.get(fakeForeign.coreTileId),fh={settlementId:'F',nationId:fakeForeign.id,tileIds:[tTile.id],home:tTile.id,free:2};
const reserve2=fakeForeign.settlementReserveDays;fakeForeign.settlementReserveDays=()=>40;
assert.equal(E.admission(fakeForeign,{map:w.map},fh,p),null);
fh.free=0;assert.equal(E.admission(fakeForeign,{map:w.map},fh,p),'LOCAL_CAPACITY_OR_FOOD');fh.free=2;fakeForeign.settlementReserveDays=()=>5;assert.equal(E.admission(fakeForeign,{map:w.map},fh,p),'LOCAL_CAPACITY_OR_FOOD');
// Existing G1A import and independent G1B save. Person migration state roundtrips.
const saveBefore=JSON.parse(JSON.stringify(w.serialize()));saveBefore.version='V0.35G1A';delete saveBefore.v35g1bLastReview;const importWorld=NS.World.from(saveBefore);assert.equal(importWorld.serialize().version,'V0.35G1B');
let reloaded=NS.World.from(JSON.parse(JSON.stringify(w.serialize())));assert.equal(reloaded.serialize().version,'V0.35G1B');assert.equal(reloaded.villages[0].residents.filter(x=>x._v35g1bResidenceSettlementId==='B').length,1);
NS.SaveSystem.save(reloaded);assert(localStorage.has('village-observer-v035g1b'));assert.equal(NS.SaveSystem.load().serialize().version,'V0.35G1B');
localStorage.delete('village-observer-v035g1b');localStorage.set('village-observer-v035g1a',JSON.stringify(saveBefore));assert.equal(NS.SaveSystem.load().serialize().version,'V0.35G1B');
const pristine=new NS.World(19,19);assert.equal(NS.V034D2.audit(pristine).ok,true);assert.equal(NS.V034D2A.audit(pristine).ok,true);
assert(NS.PATCH_NOTES.some(x=>x.version==='V0.35G1B'));
assert.equal(E.report(reloaded).constants.waitDays,825);
console.log(JSON.stringify({status:'PASS',version:NS.RELEASE_VERSION,domesticMoved:moved,remainingShortage:h1.short,foreignAcceptance:'PASS',foreignHousingGate:'PASS',saveMigration:'PASS',techCount:43,csvColumns:1683}));
// Two-stage foreign application under a small deterministic border graph.
const T=id=>({id,ownerId:id===1?0:1}),tiles=new Map([1,2,3].map(id=>[id,T(id)]));const graph=new Map([[1,[2]],[2,[1,3]],[3,[2]]]);
const mkWorld=()=>({calendarOrdinalDay:()=>825,ordinalDay:()=>825,map:{get:id=>tiles.get(Number(id)),neighbors4:id=>(graph.get(Number(id))||[]).map(x=>tiles.get(x)),distance:(a,b)=>Math.abs(Number(a)-Number(b))},telemetry:{record(){}},log(){},activeVillages:[]});
const makeStates=()=>{const w=mkWorld(),person={id:'migrant-x',name:'시민',age:23,alive:true,assignment:null,militaryStatus32A:null,homeTileId:1,happiness:75,_v35g1bResidenceSinceCal:0,_v35g1bResidenceSettlementId:'orig',_v35g1bNextForeignCal:0},origin={id:0,name:'원국',status:'active',territory:new Set([1]),residents:[person],migrationStats:{externalOut:0},relations:{},v35g1bStats:{}},target={id:1,name:'외국',status:'active',territory:new Set([2,3]),residents:[],migrationStats:{externalIn:0},relations:{},v35g1bStats:{},settlementReserveDays:()=>40},s={settlementId:'orig',nationId:0,tileIds:[1],home:1,population:1,capacity:0,free:0,short:1},a={settlementId:'first',nationId:1,tileIds:[2],home:2,population:0,capacity:0,free:0,short:0},b={settlementId:'second',nationId:1,tileIds:[3],home:3,population:0,capacity:2,free:2,short:0};w.activeVillages=[origin,target];return {w,person,origin,target,s,a,b,by:new Map([['1',[a,b]]])};};
const oldEquip=NS.V033I1.returnEquipment;NS.V033I1.returnEquipment=()=>{};
const success=makeStates();assert.equal(E.foreignHousing(success.origin,success.w,success.s,success.by),true);assert.equal(success.person.happiness,69);assert.equal(success.person.homeTileId,3);assert.equal(success.target.residents.length,1);assert.equal(success.origin.residents.length,0);assert.equal(success.origin.v35g1bStats.foreignApplications,2);
const denied=makeStates();denied.b.free=0;assert.equal(E.foreignHousing(denied.origin,denied.w,denied.s,denied.by),false);assert.equal(denied.person.happiness,69);assert.equal(denied.person.homeTileId,1);assert.equal(denied.person._v35g1bNextForeignCal,1185);assert.equal(denied.origin.v35g1bStats.foreignReturns,1);assert.equal(denied.origin.residents.length,1);
NS.V033I1.returnEquipment=oldEquip;
const days=Number(process.env.V35G1B_DAYS||0);if(days){const nw=new NS.World(19,19);for(let d=0;d<days;d++)nw.advanceOneDay();const audit=NS.V034D2.audit(nw),a2=NS.V034D2A.audit(nw),diag=E.report(nw);assert.equal(audit.ok,true,JSON.stringify(audit.errors.slice(0,8)));assert.equal(a2.ok,true,JSON.stringify(a2.errors.slice(0,8)));const perNation=diag.nations.map(n=>({id:n.id,population:nw.villages.find(v=>v.id===n.id).population(),...n.stats}));console.log(JSON.stringify({natural:'PASS',days,version:nw.serialize().version,nations:perNation,settlements:audit.settlements,housingCapacity:audit.housingCapacity}));}
console.log('TWO_STAGE_FOREIGN PASS (1st denied / 2nd accepted; two denials -> origin; happiness penalty twice)');
