'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const ROOT=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(ROOT,'index-standalone.html'),'utf8');
function boot(seed=0x340d3b2){let state=seed>>>0,calls=0;const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};const make=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const db=new Map();const c={console,Math:rand,Map,Set,WeakMap,WeakSet,JSON,TextDecoder,TextEncoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,Date:class extends Date{static now(){return 1760200000000;}},performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{head:make(),body:make(),documentElement:make(),createElement:make,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const m of src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){try{new vm.Script(m[1]).runInContext(c,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}}return {NS:c.VSim,ctx:c,rng:()=>calls};}
const near=(a,b,m='')=>assert(Math.abs(a-b)<1e-6,`${m}: ${a} != ${b}`);
const z=boot(),NS=z.NS,A=NS.V034D3B2,H=NS.V034D3A,D=NS.V034D3;
assert(A);assert.equal(NS.RELEASE_VERSION,'V0.34D3B3A');
assert.equal(NS.V034D3A2.columns.length,48);
assert.equal(new Set(NS.V034D3A2.columns).size,48);
assert(src.includes('id="versionBadge"')&&src.includes('>Village Observer · V0.34D3B3A</button>'));
assert.equal(z.ctx.document.title,'Village Observer V0.34D3B3A');
function fixture(forceThree){const b=boot(0x123451+forceThree),N=b.NS,w=new N.World(19,19),v=w.villages[0],t=w.map.get(v.coreTileId);w.year=15;
 // All inputs are stocked in existing physical storage, without synthetic receipts.
 for(const k of ['food','wood','stone']){t.stocks[k]=Math.min(N.V034D3.physicalCap(v,t.id,k)*.7,k==='food'?240:k==='wood'?180:80);}
 // Existing Persons remain physical settlers; only the fixture's age/assignments are controlled.
 for(let i=0;i<v.residents.length;i++){const p=v.residents[i];p.age=(!forceThree&&i>=4)?9:28;p.hunger=0;p.health=100;p.assignment=null;p.militaryStatus32A=null;p.militaryActive32B=false;}
 v.gold=Math.max(300,v.gold);v.technologies.add('ROADS');
 // Ensure a valid adjacent future claim; the natural world typically provides several.
 for(const q of w.map.neighbors4(t.id)){if(q.ownerId==null){q.terrain='plain';}}
 const persons=v.residents.filter(p=>p.alive!==false&&p.age>=18).length;
 if(forceThree&&persons<4)throw Error('fixture lacks adult pioneers');
 const before={food:v.food,wood:v.wood,stone:v.stone,gold:v.gold};
 const ok=N.V024.startRegionalFrontier(v,w,false);
 const delta=before.food-v.food;
 const stats=N.V034D3B2.stats(w),flow=N.V034D3A.stats(w);
 return {N,w,v,ok,delta,stats,flow,projects:v.frontierProjects||[],old:before};
}
for(const type of [false,true]){
 const x=fixture(type);
 if(!x.ok){console.error('FRONTIER FIXTURE FAILED',JSON.stringify({type,year:x.w.year,pop:x.v.population(),wood:x.v.wood,food:x.v.food,stone:x.v.stone,gold:x.v.gold,frontier:x.v.frontierProjects.length,core:x.v.coreTileId,ex:x.N.V024.regionalCandidates(x.v,x.w).length}));}
 assert(x.ok,'natural V24 regional frontier should start');
 const count=x.projects.at(-1).pioneerIds.length,expected=10+(count===3?3:0);
 near(x.delta,expected,'actual V24 food cost');
 near(x.stats.regionalPhysicalSpent,expected,'B2 measured V24 food');
 near(x.flow.total.frontierFoodSpent,expected,'D3A observed food debit');
 assert.equal(x.stats.regionalStarts,1);assert.equal(x.stats.regionalMismatchCount,0);
 let row=x.flow.live.groups[Object.keys(x.flow.live.groups).find(k=>x.flow.live.groups[k].nationId===String(x.v.id))];assert(row);near(row.frontierFoodSpent,expected);
 assert.equal(x.N.V034D3.audit(x.w).ok,true);
 // Close the exact 30-day interval without an additional physical food movement.
 // No artificial observer credit is allowed to hide a residual.
 const now=x.w.calendarOrdinalDay();x.w.calendarOrdinalDay=()=>now+31;
 x.N.V034D3A.addMetric(x.w,x.v,x.v.coreTileId,'harvestRequested',0.001);
 const closed=x.N.V034D3A.stats(x.w).windows.at(-1),observed=closed.rows.find(r=>r.nationId===String(x.v.id)&&!r.topologyChanged);
 assert(observed,'V24 food debit must have a stable accounting settlement');
 near(observed.unattributedDelta,0,'closed V24 food balance');
 delete x.w.calendarOrdinalDay;
 const save=JSON.parse(JSON.stringify(x.w.serialize()));assert.equal(save.version,'V0.34D3B3A');const back=x.N.World.from(save);
 near(x.N.V034D3B2.stats(back).regionalPhysicalSpent,expected);
 assert.equal(back.serialize().version,'V0.34D3B3A');
 const debug=back.telemetry.toJSON(back);assert.equal(debug.version,'V0.34D3B3A');assert.equal(debug.worldSummary.v034d3b2Audit.regionalStarts,1);
 console.log(JSON.stringify({result:'PASS',kind:count+'-pioneer',cost:expected,physicalSpent:x.stats.regionalPhysicalSpent,mode:'real-V24-start',roundtrip:true}));
}
const w=new NS.World(19,19);let old=JSON.parse(JSON.stringify(w.serialize()));old.version='V0.34D3B1';delete old.v034d3b2;
const migrated=NS.World.from(old);assert.equal(migrated.serialize().version,'V0.34D3B3A');assert(A.stats(migrated).migrationFromB1);
console.log(JSON.stringify({result:'PASS',version:'V0.34D3B3A',saveMigration:true,initialVersion:true,csvColumns:48,releaseNotes:NS.PATCH_NOTES[0].version}));
