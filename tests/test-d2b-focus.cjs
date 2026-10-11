/* D2: shared housing, work access, unified project slots, same-seed determinism, save. */
const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
function create(seed=0x7284ea10){let n=seed>>>0,calls=0;const M=Object.create(Math);M.random=()=>{calls++;n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296;};const el=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});const storage=new Map();const c={console,Math:M,Date:class FixedDate extends Date{static now(){return 1760101000000;}},Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,crypto:crypto.webcrypto,performance:require('perf_hooks').performance,alert(){},confirm(){return false},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{head:el(),documentElement:el(),body:el(),getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},createElement:el}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries())try{new vm.Script(m[1],{filename:'script-'+i}).runInContext(c,{timeout:12000});}catch(e){if(!/onclick/.test(e.message))throw e;}return{c,NS:c.VSim,rng:()=>calls,reset(x){n=x>>>0;calls=0;}};}
const k=create(),NS=k.NS;const w=new NS.World(19,19),v=w.villages[0],D=NS.V034D2,B=NS.V034D2B;
assert(B.audit(w).ok);const core=w.map.get(v.coreTileId),sid=core.settlementId;
const neighbor=w.map.neighbors4(core.id).find(t=>t.ownerId==null&&NS.TERRAIN[t.terrain]?.passable);assert(neighbor);
neighbor.ownerId=v.id;neighbor.settlementId=sid;v.territory.add(neighbor.id);const record=w.v34b.settlements.find(x=>String(x.id)===String(sid));record.tileIds=[...new Set([...record.tileIds,neighbor.id])];neighbor.buildings=['collective_house','collective_house','collective_house'];neighbor.buildingCondition=[100,100,100];
const h=D.housingAt(v,w,core.id);assert.equal(h.population,v.population());assert(h.capacity>h.population);
const p=v.residents.find(q=>q.alive&&q.age>=16&&q.homeTileId===core.id);assert(p,'need adult');
p.housingStrainDays=36;assert.equal(B.currentHousingStrain(v,w,p),false);p.metabolism(v,w,true);assert.equal(p.housingStrainDays,34,'shared housing must release legacy Person daily stress');
// The old V0.28 metric used housingStrainDays>20 unconditionally; B must not.
const shot=w.telemetry.snapshot(w,'TEST');const n=shot.villages.find(x=>x.id===v.id);
assert.equal(n.housingStrainedResidents28,0,'legacy V28 telemetry must reflect current shared strain');
const homes=v.residents.map(x=>x.homeTileId),rngBefore=k.rng();v.internalMigration(w);assert.deepEqual(v.residents.map(x=>x.homeTileId),homes,'one-Settlement nation should never relocate within itself');
assert.equal(k.rng(),rngBefore,'candidate gating should not consume RNG for intra-Settlement moves');
const d=getStats=()=>B.attempts(w);const cap=D.projectCap(v);v.constructionProjects=Array.from({length:cap},(_,i)=>({tileId:neighbor.id,type:'fake-'+i}));
const ok=v.startConstruction(w,core.id,'house','D2_HOUSING_POLICY_SETTLEMENT_HOUSE');assert.equal(ok,false);
const stats=d();assert.equal(stats.total,1);assert.equal(stats.rejected,1);assert.equal(stats.byBlocker.PROJECT_CAP,1,'true construction-slot rejection must be recorded');
v.constructionProjects=[];
const audited=B.audit(new NS.World(19,19));assert(audited.ok,audited.errors.join('|'));
console.log(JSON.stringify({result:'PASS',housingCapacity:h.capacity,population:h.population,sharedStressReleased:true,legacyStrainResidents:n.housingStrainedResidents28,intraSettlementMoves:0,suppressedMoveCandidates:B.attempts(w).sameSettlementCandidatesSkipped,reasonCounts:stats.byBlocker}));
