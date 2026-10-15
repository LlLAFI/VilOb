/* Village Observer V0.34F2 — Unified Person Lifecycle V1.
 * Three-day work cycle: all work and production -> one physical Settlement
 * ration -> exactly one individual metabolism per living Person.
 * Every calendar day: one common starvation-grace check in dailyDemography24.
 * Health/Hunger formula calibration explicitly deferred to F3.
 */
(function(NS){'use strict';
const VERSION='V0.34F2',PREVIOUS='V0.34F1A1',KEY='village-observer-v034f2';
const D3=NS.V034D3,oldMetabolism=NS.Person.prototype.metabolism,oldAct=NS.Person.prototype.act,oldDaily=NS.Village.prototype.dailyTick;
const previousDays=NS.Village.prototype.foodReserveDays,previousCritical=NS.Village.prototype.criticalFoodReserveDays,previousSettlement=NS.Village.prototype.settlementReserveDays;
const n=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b),clamp=x=>Math.max(0,Math.min(100,n(x)));
const currentWorlds=new WeakMap();
const summary=new WeakMap();
function missingHome(w){diagnostics(w).missingHomes++;}
function diagnostics(w){let d=summary.get(w);if(!d){d={completedCycles:0,aliveProcessed:0,duplicateMetabolismRequests:0,workCalls:0,fallbackMetabolism:0,woundedMetabolism:0,dailyStarvationChecks:0,graceStarts:0,graceDeaths:0,missingHomes:0};summary.set(w,d);}return d;}
function cal(w){return n(w?.calendarOrdinalDay?.()??(w?.ordinalDay?.()||0)*3);}
function need(p){return NS.V034F0.needFor(p);}
function housingAt(v,w,tid){return NS.V034D2?.housingAt?.(v,w,Number(tid))||null;}
// One physical stock numerator, one total real Person demand denominator.
// The raw source is never read twice, even in a multi-tile Settlement.
function reserveGroups(v){const w=v._world,groups=new Map();if(!w)return null;
 for(const id of v.territory||[]){const t=w.map.get(Number(id));if(!t||!eq(t.ownerId,v.id))continue;
  const sid=String(t.settlementId??('tile-'+id));let g=groups.get(sid);if(!g){g={food:0,need:0,pop:0};groups.set(sid,g);}
  if(t.v33OccupierId==null||eq(t.v33OccupierId,v.id))g.food+=n(D3.stockRaw(w,id,'food'));
 }
 for(const p of v.residents||[]){if(!p.alive)continue;const tid=Number(p.homeTileId),t=w.map.get(tid);if(!t||!eq(t.ownerId,v.id))continue;
  const sid=String(t.settlementId??('tile-'+tid)),g=groups.get(sid);if(g){g.need+=need(p);g.pop++;}
 }
 return groups;
}
NS.Village.prototype.foodReserveDays=function(){const g=reserveGroups(this);if(!g)return previousDays.call(this);let food=0,needAll=0;for(const x of g.values()){food+=x.food;needAll+=x.need;}return needAll>0?food/needAll:0;};
NS.Village.prototype.criticalFoodReserveDays=function(){const g=reserveGroups(this);if(!g)return previousCritical.call(this);let min=Infinity;for(const x of g.values())if(x.need>0)min=Math.min(min,x.food/x.need);return Number.isFinite(min)?min:0;};
NS.Village.prototype.settlementReserveDays=function(id){const w=this._world;if(!w)return previousSettlement.call(this,id);const t=w.map.get(Number(id));if(!t||!eq(t.ownerId,this.id))return 0;const m=D3.members(this,id),ids=m?.ids||[Number(id)];let food=0,want=0;const allowed=new Set(ids.map(Number));
 for(const tid of ids)food+=n(D3.stockRaw(w,tid,'food'));
 for(const p of this.residents||[])if(p.alive&&allowed.has(Number(p.homeTileId)))want+=need(p);
 return want>0?food/want:999;
};
// Collect work signals while preserving all legacy work, industry and construction.
NS.Person.prototype.metabolism=function(v,w,worked=true){const context=currentWorlds.get(w);if(!context||!eq(context.v.id,v.id))return oldMetabolism.call(this,v,w,worked);
 const d=diagnostics(w);if(context.worked.has(this)){d.duplicateMetabolismRequests++;return;}
 context.worked.set(this,!!worked);
};
NS.Person.prototype.act=function(v,w){const context=currentWorlds.get(w);if(context&&eq(context.v.id,v.id)&&this.alive){diagnostics(w).workCalls++;
  if(this.militaryStatus32A==='wounded'){this.currentAction='전상 회복 중';context.worked.set(this,false);return;}
 }
 return oldAct.call(this,v,w);
};
NS.Village.prototype.dailyTick=function(w){if(currentWorlds.has(w))throw Error('F2 nested Village dailyTick');
 const context={v:this,worked:new Map()},d=diagnostics(w);currentWorlds.set(w,context);let result;
 try{result=oldDaily.call(this,w);}finally{currentWorlds.delete(w);}
 // The entire economy/work cycle has completed. F0 prepares one pooled ration per
 // physical Settlement and applies its existing survival formula once per person.
 for(const p of this.residents||[]){if(!p.alive)continue;
  let worked=context.worked.get(p);if(worked===undefined){worked=false;d.fallbackMetabolism++;}
  oldMetabolism.call(p,this,w,worked);
  if(p.militaryStatus32A==='wounded'){p.energy=clamp(p.energy+2);p.health=clamp(p.health+.05);d.woundedMetabolism++;}
  d.aliveProcessed++;
 }
 d.completedCycles++;return result;
};
function kill(v,w,p,held){
 if(!p.alive)return;
 // Reuse canonical non-battle equipment return before filtering the dead roster.
 if(p.militaryEquipment33I1?.weaponId||p.militaryEquipment33I1?.armorId)NS.V033I1?.returnEquipment?.(v,w,p,'NONCOMBAT_DEATH');
 p.alive=false;p._v30b3Hunger100SinceCal=null;
 const st=NS.V022?.ensureNation?.(v)?.demographyStats22||v.demographyStats22;
 if(st){st.starvationDeaths=n(st.starvationDeaths)+1;if(p.age<=14)st.childDeaths=n(st.childDeaths)+1;}
 const bs=NS.V030B3?.ensureNation?.(v,w);if(bs)bs.starvationDeathsAfterGrace=n(bs.starvationDeathsAfterGrace)+1;
 w.log(`${v.name}의 ${p.name}이(가) 장기간의 극심한 굶주림으로 세상을 떠났습니다.`,true,'DEATH_STARVATION',{village:v.name,person:p.name,age:p.age,health:+n(p.health).toFixed(1),hunger:100,homeTileId:p.homeTileId,calendarDate:w.timestamp(),criticalHungerCalendarDays:held,demographyModel:'F2_UNIFIED_DAILY_12D_GRACE'});
}
function dailyStarvation(w){const today=cal(w),d=diagnostics(w);for(const v of w.activeVillages||[]){const b=NS.V030B3?.ensureNation?.(v,w);
 for(const p of v.residents||[]){if(!p.alive)continue;d.dailyStarvationChecks++;
  if(n(p.hunger)<95){p._v30b3Hunger100SinceCal=null;continue;}
  if(n(p.hunger)<100)continue;
  const start=Number(p._v30b3Hunger100SinceCal);
  if(p._v30b3Hunger100SinceCal==null||p._v30b3Hunger100SinceCal===''||!Number.isFinite(start)||start<=0){p._v30b3Hunger100SinceCal=today;d.graceStarts++;if(b)b.starvationGraceEntries=n(b.starvationGraceEntries)+1;
   w.telemetry?.record?.('STARVATION_CRITICAL_ENTER_B3',w,{village:v.name,person:p.name,age:p.age,homeTileId:p.homeTileId,hunger:100,graceCalendarDays:12,owner:'V0.34F2_DAILY'});
  }else if(today-start>=12){kill(v,w,p,today-start);d.graceDeaths++;}
 }
 }}
// Minimal persistence: daily starvation streak is already serialized per Person;
// diagnostic counters are observation-only and are allowed to reset on import.
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const x=serialize.call(this);x.version=VERSION;x.v034f2={model:'UNIFIED_LIFECYCLE_V1',calendarStarvation:true,settlementRationAfterWork:true};return x;};
NS.World.from=function(x){if(!x||typeof x!=='object')throw Error('잘못된 세이브');return from(x.version===VERSION?{...x,version:PREVIOUS}:x);};
const originalJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=originalJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034f2={model:'UNIFIED_LIFECYCLE_V1',...diagnostics(w)};return j;};
const prevSave=NS.SaveSystem;
NS.SaveSystem={...prevSave,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f1a1')||localStorage.getItem('village-observer-v034f1a');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){return download(`village-observer-v034F2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){return download(`village-observer-v034F2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');}};
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const prevRender=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=prevRender.apply(this,args);mark();return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-15',title:'Person Lifecycle V1 — 작업·배급·생존 판정 통합',summary:'작업 후 공동 배급, 모든 살아 있는 Person의 1회 신진대사 및 달력일 기아 판정을 통합합니다. F3 건강/Happiness 재조정은 유보합니다.',sections:[['공동 신진대사',['3일 작업주기에서 모든 직업의 작업과 생산이 끝난 다음 Settlement 공동 배급을 1회 확정합니다.','전상자·산업 노동자·Pioneer 등 정상/우회 경로 모두 같은 배급과 신진대사를 통과합니다.']],['기아·주거·비축',['12달력일 기아 사망 유예를 Person.act가 아닌 일일 인구 처리에서 판정합니다.','주거 수용량은 D2의 실제 건물 상태별 효율을 사용합니다.','국가/Settlement 식량 비축일을 물리 식량 1회 집계·실제 Person 수요 기준으로 일치시킵니다.']],['검증·범위',['기존 Food Flow 보존식과 Snapshot CSV 1683열 유지.','Hunger·Health·Happiness 변화식 대폭 수정은 차기 F3에서 논의합니다.','모델 실행 순서 변경이므로 F1A1과 RNG/인구 동일성은 요구하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034F2=Object.freeze({version:VERSION,enabled:true,dailyStarvation,housingAt,missingHome,reserveGroups,diagnostics});
mark();try{window.villageObserver?.renderHeader?.();}catch(e){}
})(window.VSim);
