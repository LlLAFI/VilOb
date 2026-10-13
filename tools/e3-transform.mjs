/* V0.34E-rc3 selected, source-audited legacy optimizations.
 * Release build only: immutable C1H source fixtures remain unchanged.
 */
export function e3Transform(file,source){
 if(file!=='src/legacy/065.js') return source;
 const once=(a,b,label)=>{if(!source.includes(a))throw Error('E03 '+label+' anchor missing');source=source.replace(a,b);};
 // Split simulation-mutating D3 observer state advance from row construction;
 // preserve original invocation position *after* inherited Snapshot capture.
 once('const snapD2=NS.Telemetry.prototype.snapshot;',`// A snapshot still schedules this legacy state transition, in exactly the
// inherited order; it is now named separately so subsequent releases can
// migrate it to the simulation scheduler with explicit regression coverage.
function advanceSnapshotStateD3(v,w){
 return {housing:updateHousingStateD3(v,w,false),expansion:updateExpansionStateD3(v,w,false)};
}
const snapD2=NS.Telemetry.prototype.snapshot;`,'state advance');
 once('const h=updateHousingStateD3(v,w,false),e=updateExpansionStateD3(v,w,false),fr=formationRowsD3(v,w)',
 'const state=advanceSnapshotStateD3(v,w),h=state.housing,e=state.expansion,fr=formationRowsD3(v,w)','snapshot read split');
 // Precalculate canonical eligible Person/home counts once per call; instead of
 // repeating unchanged resident/owner lookups for every frontier source tile.
 const begin=source.indexOf('function regionalEligibilityD3(v,w){');
 const end=source.indexOf('\nfunction expansionDiagD3(v,w){',begin);
 if(begin<0||end<0)throw Error('E03 eligibility function anchor missing');
 const replacement=`function regionalEligibilityD3(v,w){
 const radius=v.hasTech?.('FRONTIER_LOGISTICS')?5:v.hasTech?.('ROADS')?4:3,out={eligibleSources:0,candidateTiles:0,maxPool:0,blockedProject:0,blockedPopulation:0,blockedPioneer:0,blockedReserve:0,blockedAge:0,blockedNoCandidate:0};
 const eligible=[];const living=[];const residentHomeCounts=new Map();
 for(const p of v.residents||[]){
  if(p.alive){living.push(p);const home=Number(p.homeTileId);residentHomeCounts.set(home,(residentHomeCounts.get(home)||0)+1);}
  if(!p.alive||p.age<16||p.age>60||p.assignment==='PIONEER')continue;
  const tile=w.map.get(p.homeTileId);if(tile&&tile.ownerId===v.id)eligible.push({p,tile});
 }
 // Do not replace tileResidents() with residentHomeCounts: this function is the
 // simulation's authoritative tile-local resident index, which can differ from
 // homeTileId while migration/movement is in progress.
 const sourceProjects=new Set((v.frontierProjects||[]).map(p=>Number(p.sourceTileId)));
 for(const sourceId of v.territory||[]){const s=w.map.get(sourceId),pop=(v.tileResidents?.(sourceId)||[]).filter(p=>p.alive).length;
  if(!s||(sourceId!==v.coreTileId&&!shelterD3(s))||pop<1){out.blockedPopulation++;continue;}
  const founded=Number(s.frontierFoundedDay||0);if(sourceId!==v.coreTileId&&founded&&Number(w.ordinalDay?.()||0)-founded<55){out.blockedAge++;continue;}
  if(sourceProjects.has(Number(sourceId))){out.blockedProject++;continue;}
  const homes=new Map();for(const {p,tile} of eligible){if(w.map.distance(sourceId,tile.id)>radius)continue;const a=homes.get(tile.id)||[];a.push(p);homes.set(tile.id,a);}
  let pool=0;for(const[home,ps]of homes){const resident=(v.tileResidents?.(home)||[]).filter(p=>p.alive).length,keep=Number(home)===Number(v.coreTileId)?2:(resident<=1?1:0);pool+=Math.max(0,ps.length-keep);}
  out.maxPool=Math.max(out.maxPool,pool);let regionalPop=0;for(const p of living)if(w.map.distance(sourceId,p.homeTileId)<=3)regionalPop++;
  if(pool<2||regionalPop<7){out.blockedPioneer++;continue;}
  const reserve=Math.max(Number(v.settlementReserveDays?.(sourceId)||0),Number(v.foodReserveDays?.()||0)*.55);if(reserve<20){out.blockedReserve++;continue;}
  let cand=0;for(const t of w.map.neighbors4(sourceId)){if(t.ownerId===null&&NS.TERRAIN?.[t.terrain]?.passable&&!frontierReservedD3(w,t.id))cand++;}
  if(!cand){out.blockedNoCandidate++;continue;}out.eligibleSources++;out.candidateTiles+=cand;
 }
 return out;
}`;
 source=source.slice(0,begin)+replacement+source.slice(end);
 // Keep simulation/observation helper accessible for explicit test assertions.
 once('NS.V032D3={revision:REV32D3,attachWorld:attachD3,','NS.V032D3={revision:REV32D3,attachWorld:attachD3,advanceSnapshotState:advanceSnapshotStateD3,','export state hook');
 return source;
}
