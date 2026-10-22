/* V0.35G build-only patch: a single real settlement labor pool per 3-day cycle.
 * Protect the 169 legacy blocks; modify only generated legacy/036 and 025.
 */
function segment(source,start,end,replacement,what){const a=source.indexOf(start),b=source.indexOf(end,a+start.length);if(a<0||b<0||source.indexOf(start,a+start.length)!==-1)throw Error('35G patch anchor '+what);return source.slice(0,a)+replacement+source.slice(b);}
export function g35Transform(file,source){let s=source;
if(file==='src/legacy/036.js'){
 const implementation=`function prepareConstructionTasks25(v,w){
 clearCycleTasks25(v);convertAllProjects25(v);
 const now=Number(w.calendarOrdinalDay?.()??0),used=new Set();
 // Index eligible real people once, instead of scanning every nation resident for each project.
 const byTile=new Map(),bySettlement=new Map(),people=v.residents||[];
 for(const x of people){if(!x?.alive||x.age<16||x.assignment==='PIONEER'||x.militaryStatus32A==='active')continue;
  const home=w.map.get(Number(x.homeTileId));if(!home||String(home.ownerId)!==String(v.id))continue;
  let local=byTile.get(Number(x.homeTileId));if(!local)byTile.set(Number(x.homeTileId),local=[]);local.push(x);
  const sid=home.settlementId!=null?String(home.settlementId):null;
  if(sid!=null){let group=bySettlement.get(sid);if(!group)bySettlement.set(sid,group=[]);group.push(x);}
 }
 const rows=allBuildProjects25(v).sort((a,b)=>{
  // At most 10 priority points of fairness support for truly stalled ordinary work.
  const weight=x=>projectPriority25(x.type)+(/EMERGENCY|SURVIVAL|RECOVERY|DEFENSE|CRITICAL/i.test(String(x.p.reason||''))?0:Math.min(10,Math.floor(Number(x.p._v35gStallCycles||0)/30))); 
  return weight(b)-weight(a)||(a.p.startDay||0)-(b.p.startDay||0);
 });
 for(const row of rows){const p=row.p,t=w.map.get(p.tileId);
  if(!t||String(t.ownerId)!==String(v.id))continue;
  const remain=Math.max(0,p.totalLabor25-p.laborProgress25);if(remain<=0)continue;
  const sid=t.settlementId!=null?String(t.settlementId):null;
  const local=byTile.get(Number(p.tileId))||[];
  const all=sid!=null?(bySettlement.get(sid)||[]):local;
  let adults=all.filter(x=>!maintenanceBusy25(x)&&!used.has(x.id));
  let reason='PROGRESSED';
  if(!adults.length){reason=all.length?(all.some(maintenanceBusy25)?'MAINTENANCE_ASSIGNED':'OTHER_PROJECT_ASSIGNED'):'NO_SETTLEMENT_WORKERS';}
  else{
   const stressed=v.foodReserveDays()<35||v.settlementReserveDays(p.tileId)<25;
   const fooders=adults.filter(foodWorker25);
   adults.sort((a,b)=>((Number(a.homeTileId)===Number(p.tileId)?0:1)-(Number(b.homeTileId)===Number(p.tileId)?0:1)) || (b.job==='건축가')-(a.job==='건축가')+(stressed?(foodWorker25(a)-foodWorker25(b)):0)+(Number(b.skills?.building||0)-Number(a.skills?.building||0))/100);
   let reserve=adults.length>=3?1:0;
   if(stressed&&fooders.length)reserve=Math.max(reserve,1);
   const usable=Math.max(1,adults.length-reserve),wanted=Math.min(4,usable,Math.max(1,Math.ceil(remain/3)));
   let n=0,remote=0;
   for(const worker of adults){if(n>=wanted)break;
    if(stressed&&foodWorker25(worker)&&fooders.length<=1&&adults.length>1)continue;
    worker._v25CycleTask={kind:'construction',projectKind:row.kind,projectId:p.id,tileId:p.tileId,type:row.type};worker.workTileId=p.tileId;
    used.add(worker.id);n++;if(Number(worker.homeTileId)!==Number(p.tileId))remote++;
   }
   if(n===0)reason='SURVIVAL_LABOR_RESERVE';
   else NS.V035G?.constructionScheduled?.(v,w,p,local.length,remote,n);
  }
  if(reason!=='PROGRESSED')NS.V035G?.constructionBlocked?.(v,w,p,reason,all.length,local.length);
  p._v35gFirstSeenCal=p._v35gFirstSeenCal??now;p._v35gLastCycleCal=now;
 }
}
`;
 s=segment(s,'function prepareConstructionTasks25(v,w){','const startConstruction24=',implementation,'construction tasks');
 // Do not change labor costs, completion, or Person.act; record real progress only.
 const progress='p.laborProgress25=Math.min(p.totalLabor25,p.laborProgress25+eff);';
 // Applied to new construction and both auxiliary project handlers.
 const pieces=s.split(progress);if(pieces.length!==4)throw Error('35G progress anchor '+(pieces.length-1));
 s=pieces[0]+`p._v35gStallCycles=0;NS.V035G?.constructionProgress?.(this,w,p,eff);${progress}`+pieces[1]+`p._v35gStallCycles=0;NS.V035G?.constructionProgress?.(v,w,p,eff);${progress}`+pieces[2]+`p._v35gStallCycles=0;NS.V035G?.constructionProgress?.(v,w,p,eff);${progress}`+pieces[3];
 // Repeated zero-assignment cycles count toward bounded priority boost.
 const stalled='p.stallDays=(p.stallDays||0)+1;continue;';
 if(!s.includes(stalled))throw Error('35G construction stall anchor missing');
 s=s.replace(stalled,'p.stallDays=(p.stallDays||0)+1;continue;');
 }
if(file==='src/legacy/025.js'){
 // Preserve legacy land progress math; add low-cost per-project progress/stall diagnostics.
 const a="if(!workers.length)continue;const avg=workers.reduce((s,x)=>s+(x.skills?.building||0),0)/workers.length;p.progress+=clamp(.35+workers.length*.09+avg/450,.3,1.25);";
 const b="if(!workers.length){p._v35gFirstSeenCal=p._v35gFirstSeenCal??Number(w.calendarOrdinalDay?.()||0);NS.V035G?.landCycle?.(v,w,p,'NO_LOCAL_WORKERS');continue;}const avg=workers.reduce((s,x)=>s+(x.skills?.building||0),0)/workers.length;p.progress+=clamp(.35+workers.length*.09+avg/450,.3,1.25);p._v35gFirstSeenCal=p._v35gFirstSeenCal??Number(w.calendarOrdinalDay?.()||0);NS.V035G?.landCycle?.(v,w,p,'PROGRESSED');";
 if(!s.includes(a))throw Error('35G land progress anchor missing');s=s.replace(a,b);
}
return s;
}
