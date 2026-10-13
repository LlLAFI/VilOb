/* D2: shared housing, work access, unified project slots, same-seed determinism, save. */
const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
function create(seed=0x7284ea10){let n=seed>>>0,calls=0;const M=Object.create(Math);M.random=()=>{calls++;n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296;};const el=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const storage=new Map();const c={console,Math:M,Date:class FixedDate extends Date{static now(){return 1760101000000;}},Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:el(),documentElement:el(),body:el(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:el}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries())try{new vm.Script(m[1],{filename:'script-'+i}).runInContext(c,{timeout:12000});}catch(e){if(!/onclick/.test(e.message))throw e;}return{c,NS:c.VSim,rng:()=>calls,reset(x){n=x>>>0;calls=0;}};}
const a=create(),NS=a.NS,D=NS.V034D2;assert.equal(D.version,'V0.34D2');assert.equal(NS.V034D2A.version,'V0.34D2A');assert.equal(NS.V034D2B.version,'V0.34D2B');
const mock=(pop,tech=[])=>({population:()=>pop,hasTech:x=>tech.includes(x)});
assert.equal(D.projectCap(mock(0)),3);assert.equal(D.projectCap(mock(25)),4);assert.equal(D.projectCap(mock(60)),5);
assert.equal(D.projectCap(mock(60,['ADMINISTRATION'])),7);
assert.equal(D.projectCap(mock(60,['ADMINISTRATION','ENGINEERING'])),9);
assert.equal(D.projectCap(mock(60,['ADMINISTRATION','ENGINEERING','URBANIZATION'])),11);
const w=new NS.World(19,19);assert.equal(w.serialize().version,'V0.34D3B3A');
const init=D.audit(w);assert(init.ok,init.errors.join('|'));assert(NS.V034D2A.audit(w).ok,NS.V034D2A.audit(w).errors.join('|'));assert.equal(init.housingCapacity,NS.V034D1.all(w).reduce((sum,x)=>sum+x.housing.capacity,0));assert.equal(init.people,w.villages.reduce((a,v)=>a+v.residents.filter(p=>p.alive!==false).length,0));
// Founding Town Hall capacity (4) and four Houses (3 each) must be recognized.
for(const nation of w.villages){const tile=w.map.get(nation.coreTileId);assert.equal(NS.V034D2A.capAt(tile),NS.V011.effectiveLocalCapacity(tile));}
// Cache invalidates immediately when a Person dies or returns on the same simulation day.
const initialNation=w.villages[0],home=initialNation.coreTileId,person=initialNation.residents.find(p=>p.homeTileId===home&&p.alive!==false);
const oldCount=NS.V034D2A.housingAt(initialNation,w,home).population;
person.alive=false;assert.equal(NS.V034D2A.housingAt(initialNation,w,home).population,oldCount-1);person.alive=true;assert.equal(NS.V034D2A.housingAt(initialNation,w,home).population,oldCount);
const beforeRng=a.rng(),beforeStable=JSON.stringify(w.villages.map(v=>v.residents.map(p=>[p.id,p.homeTileId,p.job,p.workTileId])));
for(const v of w.villages)D.context(v,w);D.audit(w);D.csv(w);
assert.equal(a.rng(),beforeRng,'D2 observation consumed simulation RNG');
assert.equal(JSON.stringify(w.villages.map(v=>v.residents.map(p=>[p.id,p.homeTileId,p.job,p.workTileId]))),beforeStable,'D2 observer mutated Person state');
const r=NS.V034D1.all(w).find(x=>x.tiles>=1),v=w.villages.find(v=>String(v.id)===String(r.nationId)),t0=w.map.get(r.tileIds[0]);
const neighbor=w.map.neighbors4(t0.id).find(t=>t.ownerId===null&&NS.TERRAIN[t.terrain]?.passable);assert(neighbor,'fixture requires adjacent unowned tile');
neighbor.ownerId=v.id;v.territory.add(neighbor.id);neighbor.settlementId=r.settlementId;
const sr=w.v34b.settlements.find(x=>String(x.id)===String(r.settlementId));sr.tileIds=[...new Set([...sr.tileIds.map(Number),neighbor.id])];
neighbor.buildings=['collective_house','collective_house','collective_house'];neighbor.buildingCondition=[100,100,100];
assert(D.sameSettlement(w,t0.id,neighbor.id,v.id),'same group');
const x=D.housingAt(v,w,t0.id);assert(x.tileIds.length>=2);assert(x.capacity>=24);assert.equal(x.population,v.tileResidents(t0.id).filter(p=>p.alive).length+(v.tileResidents(neighbor.id)||[]).filter(p=>p.alive).length);
assert.equal(D.resolveHousing(v,w,t0.id,'TEST'),false,'shared housing must suppress redundant construction');
assert.equal(NS.V029.routeCost(v,w,t0.id,neighbor.id),0,'intra-settlement work cost');
assert.equal(D.projectCount(v),0,'the housing observer must not build');
// D2A: canonical physical capacity includes Town Hall and per-index deterioration.
const A2=NS.V034D2A;
assert.equal(A2.capAt(t0),NS.V011.effectiveLocalCapacity(t0));

const preBuildings=neighbor.buildings.slice(),preCondition=neighbor.buildingCondition.slice();
neighbor.buildings=['house','house','town_hall','outpost'];neighbor.buildingCondition=[100,0,100,100];
const corrected=A2.capAt(neighbor);
assert.equal(corrected,3+4+3,'deteriorated house must not inherit healthy house efficiency');
assert.equal(NS.V034D1.aggregate(w,sr.id).housing.capacity,D.housingAt(v,w,t0.id).capacity);

neighbor.buildingCondition[0]=0;
assert.equal(D.housingAt(v,w,t0.id).capacity,NS.V034D1.aggregate(w,sr.id).housing.capacity,'same-day building condition invalidation');
neighbor.buildings=preBuildings;neighbor.buildingCondition=preCondition;

assert.equal(A2.blocker(v,w,D.quickHousing(v,w)),'NONE','no shared housing need');
// Synthetic pending projects of all categories count toward the same national limit.
v.constructionProjects=[{type:'house',tileId:t0.id},{type:'farmstead',tileId:neighbor.id}];
v.landDevelopmentProjects=[{tileId:neighbor.id}];v.buildingUpgradeProjects=[{tileId:neighbor.id}];v.specializationProjects=[];
assert.equal(D.projectCount(v),4);assert.equal(D.freeSlots(v),Math.max(0,D.projectCap(v)-4));
while(D.projectCount(v)<D.projectCap(v))v.constructionProjects.push({type:'test',tileId:neighbor.id});
assert.equal(D.freeSlots(v),0);assert.equal(v.startConstruction(w,t0.id,'house','TEST_CAP'),false);assert.equal(v.startLandDevelopment(w,t0.id,'TEST_CAP'),false);
v.constructionProjects=[];v.landDevelopmentProjects=[];v.buildingUpgradeProjects=[];
// The synthetic fixture bypasses the game's legitimate claim/merge invalidation pathways.
// Save/load is validated on an untouched, canonical D2 world instead.
const wClean=new NS.World(19,19);assert(D.audit(wClean).ok);
NS.SaveSystem.save(wClean);const restored=NS.SaveSystem.load();assert.equal(restored.serialize().version,'V0.34D3B3A');assert(D.audit(restored).ok,D.audit(restored).errors.join('|'));
// A natural deterministic run (no forced fixture) must repeat in D2 itself.
const A=create(0x1782aab4),B=create(0x1782aab4);let wa=new A.NS.World(19,19),wb=new B.NS.World(19,19);A.reset(0x24813601);B.reset(0x24813601);for(let i=0;i<120;i++){wa.advanceOneDay();wb.advanceOneDay();}
const state=z=>{const s=JSON.parse(JSON.stringify(z.serialize()));delete s.telemetry;return JSON.stringify(s);};
// Profiling measurements and timer samples are hardware/time dependent; remove only those.
const physical=z=>{const o=JSON.parse(state(z));if(o.v32e12Stats)delete o.v32e12Stats.perf;if(o.v32e14Stats)delete o.v32e14Stats.perf;if(o.v32fStats)delete o.v32fStats.perfMilitaryReadinessMs;if(o.v34c?.counters){delete o.v34c.counters.totalReviewMs;delete o.v34c.counters.maxReviewMs;}return JSON.stringify(o);};
assert.equal(physical(wa),physical(wb),'same-seed physical state changed');
assert.equal(A.rng(),B.rng());assert(A.NS.V034D2.audit(wa).ok,A.NS.V034D2.audit(wa).errors.join('|'));
const raw=A.NS.V034D1A.csv(wa).split('\n')[0];assert.equal(raw.split(',').length,48);assert.equal(A.NS.V034D0.csvV2(wa.telemetry.snapshotsCSV()).split('\n')[0].split(',').length,1683);
assert(A.NS.V034D2A.audit(wa).ok,A.NS.V034D2A.audit(wa).errors.join('|'));const report=A.NS.V034D2.audit(wa);console.log(JSON.stringify({result:'PASS',version:'V0.34D3',civilianSettlementUnits:report.settlements,people:report.people,sharedHousing:true,zeroWorkAccess:true,unifiedSlots:11,currentVersionSave:true,deterministicDays:120,legacySettlementColumns:48,snapshotColumns:1683}));
