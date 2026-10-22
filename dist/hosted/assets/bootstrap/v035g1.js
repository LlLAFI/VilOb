/* Village Observer V0.35G1 — Abstract baseline construction + real architect dispatch */
(function(NS){'use strict';
const VERSION='V0.35G1',PREVIOUS='V0.35G',KEY='village-observer-v035g1';
const BASE_DAILY=.25,LAND_PER_TICK=.55,LOCAL_PER_ADULT=.05,LOCAL_MAX=.25,ARCH_MULT=2.5,REVIEW_DAYS=30;
const TYPES=[['constructionProjects','construction'],['buildingUpgradeProjects','upgrade'],['specializationProjects','specialization'],['landDevelopmentProjects','land']];
const num=x=>Number.isFinite(Number(x))?Number(x):0;
function state(v){const s=v.v35g1||(v.v35g1={});for(const k of ['baselineCycles','baselineEffective','architectEffectiveExtra','architectWorkCycles','architectTravelDays','architectDispatches','architectReturns','architectInvalidations','landCycles','completionReleases','blockedControlCycles'])s[k]=num(s[k]);return s;}
function projectRows(v,w){const rows=[];for(const [key,kind] of TYPES)for(const p of v[key]||[]){if(p.v17Marker)continue;const t=w.map.get(Number(p.tileId));if(!t||String(t.ownerId)!==String(v.id)||p.v33e5f1ControlPaused||p.v33e5fOccupationPaused)continue;rows.push({p,kind,t,key});}return rows;}
function adultCounts(v,w){const counts=new Map();for(const p of v.residents||[]){if(!p.alive||p.age<16||p.assignment==='PIONEER'||p.militaryStatus32A==='active')continue;const t=w.map.get(Number(p.homeTileId));if(!t||String(t.ownerId)!==String(v.id))continue;const k=t.settlementId==null?'tile:'+t.id:String(t.settlementId);counts.set(k,(counts.get(k)||0)+1);}return counts;}
function localFactor(v,w,t){let cache=v._v35g1LocalCache;const now=num(w.calendarOrdinalDay?.());if(!cache||now-cache.day>=30||now<cache.day){cache={day:now,counts:adultCounts(v,w)};v._v35g1LocalCache=cache;}const k=t.settlementId==null?'tile:'+t.id:String(t.settlementId);return 1+Math.min(LOCAL_MAX,LOCAL_PER_ADULT*(cache.counts.get(k)||0));}
function freeArchitect(p){return p?.alive&&p.age>=16&&p.job==='건축가'&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'&&!(p.v25MaintenanceQueue||[]).length&&!p.v35g1Dispatch;}
function release(p,v){if(!p.v35g1Dispatch)return;delete p.v35g1Dispatch;delete p._v25CycleTask;p.workTileId=p.homeTileId;state(v).architectReturns++;}
function startReturn(p,v,d,now){if(!d||d.phase==='RETURN')return;d.phase='RETURN';d.remaining=Math.max(0,num(d.backCost));d.lastCal=now;state(v).completionReleases++;}
function verify(p,v,w,lookup,now){const d=p.v35g1Dispatch;if(!d)return;
 if(!p.alive||p.age<16||p.job!=='건축가'||p.assignment==='PIONEER'||p.militaryStatus32A==='active'||(p.v25MaintenanceQueue||[]).length){release(p,v);state(v).architectInvalidations++;return;}
 const row=lookup.get(d.kind+':'+d.projectId),owner=row&&String(row.t.ownerId)===String(v.id);
 if(!owner){startReturn(p,v,d,now);if(!num(d.remaining))release(p,v);return;}
 // Occupation pauses the work but preserves real architect; travel/return are unchanged.
 if(row.p.v33e5f1ControlPaused||row.p.v33e5fOccupationPaused)d.paused=true;else d.paused=false;
}
function dispatch(v,w,rows,lookup,now){const people=v.residents||[],ready=people.filter(freeArchitect);if(!ready.length)return;
 const claimed=new Set(people.map(p=>p.v35g1Dispatch).filter(Boolean).filter(d=>d.phase!=='RETURN').map(d=>d.kind+':'+d.projectId));
 const todo=rows.filter(r=>!claimed.has(r.kind+':'+r.p.id)).sort((a,b)=>{
  const priority=x=>x.kind==='construction'?(x.p.type==='house'?120:x.p.type==='road'?65:90):x.kind==='land'?70:85;
  const remain=x=>x.kind==='land'?Math.max(0,num(x.p.duration)-num(x.p.progress)):Math.max(0,num(x.p.totalLabor25)-num(x.p.laborProgress25));
  return priority(b)-priority(a)||remain(b)-remain(a)||num(a.p.startDay)-num(b.p.startDay);
 });
 for(const row of todo){if(!ready.length)break;
  // Physical distance pre-shortlist, detailed real path only for a handful of candidates.
  const shortlist=ready.map(p=>({p,straight:Number(w.map.distance?.(p.homeTileId,row.p.tileId)??Math.abs(Number(p.homeTileId)-Number(row.p.tileId)))})).sort((a,b)=>a.straight-b.straight||String(a.p.id).localeCompare(String(b.p.id))).slice(0,5);
  let best=null;
  for(const c of shortlist){const home=w.map.get(Number(c.p.homeTileId));if(!home||String(home.ownerId)!==String(v.id))continue;
   const same=home.settlementId!=null&&home.settlementId===row.t.settlementId;
   const cost=same?0:Number(v.internalPathCost?.(c.p.homeTileId,row.p.tileId)??c.straight);
   if(!Number.isFinite(cost)||cost<0)continue;
   const remaining=row.kind==='land'?Math.max(0,num(row.p.duration)-num(row.p.progress))/Math.max(.01,LAND_PER_TICK):Math.max(0,num(row.p.totalLabor25)-num(row.p.laborProgress25))/Math.max(.01,BASE_DAILY*3);
   if(remaining<Math.max(9,2*cost+3))continue; // avoid dispatching for almost-complete work
   if(!best||cost<best.cost)best={p:c.p,cost};
  }
  if(!best)continue;
  const {p,cost}=best;p.v35g1Dispatch={projectId:String(row.p.id),kind:row.kind,tileId:Number(row.p.tileId),phase:cost>0?'OUT':'WORK',remaining:cost,backCost:cost,lastCal:now,paused:false};
  if(cost===0)p.workTileId=row.p.tileId;state(v).architectDispatches++;claimed.add(row.kind+':'+row.p.id);ready.splice(ready.indexOf(p),1);
 }
}
function prepare(v,w){const now=num(w.calendarOrdinalDay?.()),rows=projectRows(v,w),lookup=new Map(rows.map(r=>[r.kind+':'+r.p.id,r]));
 const s=state(v);for(const p of v.residents||[]){if(!p.v35g1Dispatch)continue;verify(p,v,w,lookup,now);const d=p.v35g1Dispatch;if(!d)continue;
  const elapsed=Math.min(3,Math.max(0,now-num(d.lastCal)));
  if(d.phase==='OUT'||d.phase==='RETURN'){
   const moved=Math.min(elapsed,num(d.remaining));d.remaining=Math.max(0,num(d.remaining)-moved);s.architectTravelDays+=moved;
   if(d.remaining<=1e-9){if(d.phase==='RETURN'){release(p,v);continue;}d.phase='WORK';p.workTileId=d.tileId;}
  }
  d.lastCal=now;
 }
 if(!Number.isFinite(v._v35g1LastReview)||now-v._v35g1LastReview>=REVIEW_DAYS||now<v._v35g1LastReview){dispatch(v,w,rows,lookup,now);v._v35g1LastReview=now;}
 // Build one indexed lookup per cycle; no Person rescans for each construction project.
 const idx=new Map();
 for(const p of v.residents||[]){const d=p.v35g1Dispatch;if(!d)continue;
  p._v25CycleTask={kind:'construction',projectKind:d.kind,projectId:d.projectId,tileId:d.tileId,type:d.phase==='WORK'?'ARCHITECT_WORK':'ARCHITECT_TRAVEL'};
  if(d.phase==='WORK'&&!d.paused&&p.alive)idx.set(d.kind+':'+d.projectId,p);
 }
 v._v35g1CycleArchitectIndex=idx;
}
function actualArchitect(v,p,kind){const key=kind+':'+String(p.id),candidate=v._v35g1CycleArchitectIndex?.get(key);if(candidate?.alive&&candidate.v35g1Dispatch?.phase==='WORK'&&!candidate.v35g1Dispatch.paused&&!(candidate.v25MaintenanceQueue||[]).length)return candidate;
 // Fallback for first-cycle tests / save restoration before first scheduled labor plan.
 if(!v._v35g1CycleArchitectIndex)for(const x of v.residents||[])if(x.alive&&x.v35g1Dispatch?.phase==='WORK'&&x.v35g1Dispatch.kind===kind&&x.v35g1Dispatch.projectId===String(p.id)&&!x.v35g1Dispatch.paused)return x;return null;}
function record(v,w,p,base,kind,architect){const s=state(v);s.baselineCycles++;s.baselineEffective+=base;s.architectEffectiveExtra+=architect?base*(ARCH_MULT-1):0;
 if(architect)s.architectWorkCycles++;
 p._v35gLastReason=architect?'G1_ARCHITECT_2_5X':'G1_BASELINE';p._v35gLastWorkers=architect?1:0;p._v35gLastRemoteWorkers=architect&&architect.homeTileId!==p.tileId?1:0;
 p._v35gFirstSeenCal=p._v35gFirstSeenCal??num(w.calendarOrdinalDay?.());p._v35gLastProgressCalendarDay=num(w.calendarOrdinalDay?.());p._v35gStallCycles=0;
}
function work(v,w,p,kind){const t=w.map.get(Number(p.tileId));if(!t||String(t.ownerId)!==String(v.id)||p.v33e5f1ControlPaused||p.v33e5fOccupationPaused){state(v).blockedControlCycles++;return 0;}
 const architect=actualArchitect(v,p,kind),base=3*BASE_DAILY*localFactor(v,w,t),eff=base*(architect?ARCH_MULT:1);
 record(v,w,p,base,kind,architect);
 // Virtual work is not Person labor; keep existing laborStats25.construction counters honest.
 return eff;
}
function landWork(v,w,p){const t=w.map.get(Number(p.tileId));if(!t||String(t.ownerId)!==String(v.id)||p.v33e5f1ControlPaused||p.v33e5fOccupationPaused)return 0;
 const architect=actualArchitect(v,p,'land'),base=LAND_PER_TICK*localFactor(v,w,t),eff=base*(architect?ARCH_MULT:1);
 record(v,w,p,base,'land',architect);state(v).landCycles++;return eff;
}
function report(w){const live=[];for(const v of w.villages||[]){for(const p of v.residents||[])if(p.v35g1Dispatch)live.push({nation:v.name,person:p.name,personId:p.id,...p.v35g1Dispatch});}
 return {format:'vilob-v035g1-construction-v1',version:VERSION,day:num(w.calendarOrdinalDay?.()),constants:{baseDaily:BASE_DAILY,landPerTick:LAND_PER_TICK,localPerAdult:LOCAL_PER_ADULT,localMax:LOCAL_MAX,architectMultiplier:ARCH_MULT,reviewDays:REVIEW_DAYS},nations:(w.villages||[]).map(v=>({id:v.id,name:v.name,stats:{...state(v)}})),activeDispatches:live};}
const priorFrom=NS.World.from,priorSer=NS.World.prototype.serialize,priorVSer=NS.Village.prototype.serialize,priorTele=NS.Telemetry.prototype.toJSON,priorSave=NS.SaveSystem;
NS.Village.prototype.serialize=function(...args){const d=priorVSer.apply(this,args);d.v35g1=this.v35g1||null;d._v35g1LastReview=num(this._v35g1LastReview)||null;return d;};
NS.World.prototype.serialize=function(...args){const d=priorSer.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(d,...args){const g1=d?.version===VERSION,w=priorFrom.call(this,g1?{...d,version:PREVIOUS}:d,...args);if(g1)for(const sv of d.villages||[]){const v=w.villages.find(x=>String(x.id)===String(sv.id));if(v){if(sv.v35g1)v.v35g1=sv.v35g1;if(sv._v35g1LastReview!=null)v._v35g1LastReview=sv._v35g1LastReview;}}return w;};
NS.Telemetry.prototype.toJSON=function(...args){const d=priorTele.apply(this,args);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v35g1Construction=report(args[0]||NS._currentWorld||{villages:[],map:{get:()=>null}});return d;};
function dl(name,content,mime='application/json'){if(typeof document==='undefined')return;const u=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('로컬 저장 공간 부족: JSON 파일로 저장해 주세요. '+e.message);}},
 load(){const r=localStorage.getItem(KEY);return r?NS.World.from(JSON.parse(r)):priorSave.load?.();},
 export(w){dl(`village-observer-v035G1-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v035G1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 export35G1Construction(w){dl(`vilob-v035G1-construction-${w.year}y.json`,JSON.stringify(report(w),null,2));}
};
const badge=()=>{if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const e=document.getElementById('versionBadge');if(e){e.textContent='Village Observer · '+VERSION;e.dataset.runtimeVersion=VERSION;}};
if(NS.UI){const h=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const r=h.apply(this,a);badge();return r;};const rr=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...a){const r=rr.apply(this,a);if(typeof document==='undefined')return r;const panel=document.getElementById('v035gConstructionExports');if(panel&&!document.getElementById('v035g1ConstructionExport')){const b=document.createElement('button');b.id='v035g1ConstructionExport';b.textContent='35G1 추상 건설·건축가 JSON';b.addEventListener('click',()=>NS.SaveSystem.export35G1Construction(this.world));panel.appendChild(b);}badge();return r;};
 const codex=NS.UI.prototype.renderCodex;NS.UI.prototype.renderCodex=function(...a){const r=codex.apply(this,a);const root=this.q?.('codexContent');for(const x of root?.querySelectorAll?.('.v25-labor-note')||[])x.innerHTML='<strong>V0.35G1 추상 건설</strong><br>일반 공사는 실제 Person 배정 없이 기본 속도로 진행합니다. Settlement 성인 인구 보정은 최대 +25%, 실제 건축가를 파견하면 현장 작업 중 ×2.5가 적용됩니다. 분기 유지보수 노동은 실제 Person으로 처리하며 별도입니다.';return r;};
}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-22',title:'Construction Abstraction + Architect Dispatch V1',summary:'모든 유효 공사가 무인력 기본 속도로 진행되며, 실제 건축가 파견은 현장 근무 중 건설력을 ×2.5 가속합니다.',sections:[['건설 모델',['신축·개축·고도화에 하루 0.25 진척 단위의 기본 건설력을 적용합니다.','Settlement 성인 인구 한 명당 +5%, 최대 +25%의 지역 보정이 적용됩니다.','토지정비는 기존 기간 단위를 유지하고 작업 주기당 0.55 진척 기본값을 적용합니다.']],['건축가 파견',['실제 건축가를 30일마다 공사 현장에 파견합니다.','다른 Settlement의 경우 실제 경로 이동 후 현장 작업 중 ×2.5 가속이 적용되며, 완공 후 귀환합니다.','유지보수 중인 건축가·현역 군인·개척자는 파견하지 않으며 다른 생산 활동과 이중 수행하지 않습니다.']],['회계·호환',['건설 자원·Gold·슬롯·점령 중단 및 기존 기술 효과는 유지됩니다.','V0.35G 세이브 가져오기를 지원하며 G1 별도 저장 키를 사용합니다.','실제 Person 노동 통계와 가상 건설 진척 계측을 분리하고 진단 JSON을 제공합니다.']]]});
NS.V035G1=Object.freeze({version:VERSION,prepare,work,landWork,report,localFactor,constants:{BASE_DAILY,LAND_PER_TICK,ARCH_MULT,REVIEW_DAYS}});badge();
})(window.VSim);
