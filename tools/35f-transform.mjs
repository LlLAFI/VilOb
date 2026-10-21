/* 35F - transform generated legacy only; protected original blocks untouched.
   The unprofiled demandDevelopment body is kept verbatim, so the diagnostic
   implementation is never on the production hotpath unless the user opts in. */
function once(s,a,b,why){const p=s.indexOf(a);if(p<0||s.indexOf(a,p+a.length)>=0)throw Error('35F anchor '+why);return s.slice(0,p)+b+s.slice(p+a.length);}
export function f35Transform(file,src){let s=src;
 if(file==='src/legacy/025.js'){
  const begin='function demandDevelopment35DImpl35EImpl(v,w){';
  s=once(s,begin,'function demandDevelopment35DImpl35EImpl(v,w){const f=NS.V035F;return f?.isMeasuring?.()?demandDevelopment35FProfiled(v,w):demandDevelopment35FOriginal(v,w);}\nfunction demandDevelopment35FOriginal(v,w){','demand original');
  const anchor='/* ---------- land development ---------- */';
  // Preserve evaluation order, comparison operators and early-return behavior.
  // All probes execute only in the opt-in profiled branch.
  const profiled=`function demandDevelopment35FProfiled(v,w){
 const p=NS.V035F,measure=(key,fn)=>p.measure(key,fn);if(v.status!=='active')return false;
 return measure('development',()=>{
 const tradeIndex=measure('tradeIndex',()=>v.territory.size>=3&&(v.tradeHistory||[]).length>=8?tradeVolumeIndex35D(v,w):null);
 const rows=measure('rowsBuild',()=>[...v.territory].map(id=>w.map.get(id)).filter(Boolean).map(t=>({t,p:settlementPressure(v,t,w,tradeIndex)})));
 measure('rowsSort',()=>rows.sort((a,b)=>Math.max(b.p.housing,b.p.storage,b.p.commerce)-Math.max(a.p.housing,a.p.storage,a.p.commerce)));
 p.count('territoryRows',rows.length);
 for(const x of rows){const t=x.t;p.count('candidateVisits');
  if(measure('projectBusy',()=>projectBusy(v,t.id))){p.count('busySkipped');continue;}
  if(x.p.housing>=82){p.count('housingEligible');if(measure('housingAttempt',()=>v.buildHouse(w))){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'housing',score:+x.p.housing.toFixed(1)});p.count('housingStarted');return true;}p.count('housingFailed');}
  if(x.p.storage>=84){p.count('storageScoreEligible');if(measure('storageRequirements',()=>!t.hasBuilding('warehouse')&&remainingSpace(v,t)>=buildingFootprint('warehouse'))){p.count('storageAttempt');if(measure('storageConstruction',()=>v.startConstruction(w,t.id,'warehouse','STORAGE_DEMAND'))){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'storage',score:+x.p.storage.toFixed(1)});p.count('storageStarted');return true;}p.count('storageFailed');}}
  if(x.p.commerce>=76){p.count('commerceScoreEligible');if(measure('commerceRequirements',()=>v.hasTech('BARTER')&&!t.hasBuilding('trading_post')&&remainingSpace(v,t)>=buildingFootprint('trading_post'))){p.count('commerceAttempt');if(measure('commerceConstruction',()=>v.startConstruction(w,t.id,'trading_post','COMMERCE_DEMAND'))){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'commerce',score:+x.p.commerce.toFixed(1)});p.count('commerceStarted');return true;}p.count('commerceFailed');}}
 }
 return false;
 });
}
`;
  s=once(s,anchor,profiled+anchor,'profiled function insert');
  // Independent nested policy timings (via transforms in 051/059 below).
 }
 if(file==='src/legacy/051.js'||file==='src/legacy/059.js'){
  const name=file.endsWith('051.js')?'shouldReserve31H':'shouldReserve32C1',metric=file.endsWith('051.js')?'industryReserve31H':'militaryReserve32C1';
  s=once(s,`function ${name}(v,w){`,`function ${name}(v,w){const f=NS.V035F;return f?.isMeasuringDevelopment?.()?f.measure('${metric}',()=>${name}35FOriginal(v,w)):${name}35FOriginal(v,w);}\nfunction ${name}35FOriginal(v,w){`,name);
 }
 return s;
}
