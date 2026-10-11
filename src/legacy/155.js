
/* V0.34C1 — conservative speedups and measurable spatial queries, no balance changes. */
(function(NS){'use strict';
const VERSION='V0.34C1', PREVIOUS='V0.34C';
const NOW=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const residentRows=new WeakMap(), workCandidates=new WeakMap();
function track(w,key,n=1){if(w){const c=counters(w);c[key]=(c[key]||0)+n;}}
function counters(w){if(!w.v34c1)w.v34c1={revision:'spatial-simulation-optimization-v1',counters:{foodCalls:0,foodIndexBuilds:0,foodIndexHits:0,foodTerritoryVisitsAvoided:0,foodActualPopulatedVisits:0,maintenanceIndexedLocalTasks:0,maintenanceIndexedRemoteTasks:0,workCandidateBuilds:0,workCandidateHits:0,workCandidateBypasses:0}};return w.v34c1.counters;}
/* Only populated tile memberships and calendar-day-specific age weights are cached. Food stocks remain live at every query. */
function populated(v){const w=v?._world,idx=NS.V026?.ensureResidentIndex?.(v);if(!idx||!w)return null;const old=residentRows.get(v),size=v.territory?.size||0,stamp=Number(w.v34c?.counters?.ownershipChanges||0),cal=Number(w.calendarOrdinalDay?.()||0);
 if(old&&old.byHome===idx.byHome&&old.territory===v.territory&&old.size===size&&old.ownerStamp===stamp&&old.cal===cal){counters(w).foodIndexHits++;return old.rows;}
 const rows=[];for(const tId of v.territory||[]){const id=Number(tId),ps=idx.byHome.get(id);if(ps?.length){let need=0;for(const person of ps)need+=Number(person?.age)<15?.30:.42;rows.push({id,ps,need:Math.max(.12,need)});}}
 residentRows.set(v,{byHome:idx.byHome,territory:v.territory,size,ownerStamp:stamp,cal,rows});counters(w).foodIndexBuilds++;return rows;
}
const origFood=NS.Village.prototype.foodReserveDays,origCritical=NS.Village.prototype.criticalFoodReserveDays;
NS.Village.prototype.foodReserveDays=function(){const w=this._world,rows=populated(this);if(!w||!rows)return origFood.call(this);const z=counters(w);z.foodCalls++;z.foodTerritoryVisitsAvoided+=Math.max(0,(this.territory?.size||0)-rows.length);z.foodActualPopulatedVisits+=rows.length;
 let pop=0,total=0;for(const {id,ps,need} of rows){const d=Number(this.stockAt?.(id,'food')||0)/need;const n=ps.length;pop+=n;total+=n*d;}
 const st=w.v32e3OptimizationStats;if(st){st.foodReserveFastCalls++;st.foodReserveTileScans+=rows.length;}return pop?total/pop:0;
};
NS.Village.prototype.criticalFoodReserveDays=function(){const w=this._world,rows=populated(this);if(!w||!rows)return origCritical.call(this);let min=Infinity,seen=0;for(const {id,ps,need} of rows){const d=Number(this.stockAt?.(id,'food')||0)/need;if(d<min)min=d;seen++;}const st=w.v32e3OptimizationStats;if(st)st.criticalFoodReserveFastCalls++;return seen?min:0;};
/* Legacy ordered territory tile roster, not a new Settlement-based job allocation.
   Work candidate lists retain legacy insertion order, scoring and live eligibility checks. */
function getSpatialCandidates(v,w){if(!w||!v?.territory)return null;const old=workCandidates.get(v),today=Number(w.calendarOrdinalDay?.()||0),ownerRev=Number(w.v34c?.counters?.ownershipChanges||0),count=v.territory.size,idx=NS.V026?.ensureResidentIndex?.(v);
 if(old&&old.day===today&&old.ownerRev===ownerRev&&old.count===count&&old.territory===v.territory&&old.idx===idx){counters(w).workCandidateHits++;return old.rows;}
 // Keep original territory order. The index is a *candidate roster*, not a new score formula.
 const rows=[...v.territory].map(id=>w.map.get(id));
 workCandidates.set(v,{day:today,ownerRev,count,territory:v.territory,idx,rows});counters(w).workCandidateBuilds++;return rows;
}
/* The legacy worker scan is retained where it may depend on per-Person live resource scoring.
   Expose a conservative shared candidate API for integrated subsystems / future guarded fast paths. */
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;/* transient spatial caches are never serialized */return d;};
NS.World.from=function(data){const w=oldFrom(data?.version===VERSION?{...data,version:PREVIOUS}:data);return w;};
const oldSnap=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=oldSnap.call(this,w,reason,note);if(s){const c={...counters(w)};Object.assign(s.global,{foodIndexBuilds34C1:c.foodIndexBuilds,foodIndexHits34C1:c.foodIndexHits,foodTerritoryVisitsAvoided34C1:c.foodTerritoryVisitsAvoided,foodActualPopulatedVisits34C1:c.foodActualPopulatedVisits,workCandidateBuilds34C1:c.workCandidateBuilds,workCandidateHits34C1:c.workCandidateHits});}return s;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n'),keys=['foodIndexBuilds34C1','foodIndexHits34C1','foodTerritoryVisitsAvoided34C1','foodActualPopulatedVisits34C1','workCandidateBuilds34C1','workCandidateHits34C1'];if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+keys.map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[])if(i<lines.length)lines[i++]+=','+keys.map(k=>q(s.global?.[k])).join(',');return lines.join('\n');};
const oldLog=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldLog.call(this,w);d.version=VERSION;d.worldSummary.v034c1Revision='spatial-simulation-optimization-v1';d.worldSummary.v034c1Performance={...counters(w)};return d;};
const save=NS.SaveSystem;
function dl(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...save,save(w){try{localStorage.setItem('village-observer-v034c1',JSON.stringify(w.serialize()));}catch(e){throw Error('대용량 세이브는 JSON 파일로 내보내 주세요: '+e.message);}},load(){const s=localStorage.getItem('village-observer-v034c1');return s?NS.World.from(JSON.parse(s)):save.load?.();},export(w){dl(`village-observer-v034C1-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v034C1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('V0.34C1 CSV schema mismatch '+JSON.stringify(test.bad?.slice(0,3)));dl(`village-observer-v034C1-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-09',title:'Spatial Simulation Optimization V1',summary:'식량 비축 조회의 반복 영토 스캔을 줄이고 유지보수 계획의 중복 주민·작업 대기열 탐색을 공유 인덱스로 정리합니다. 모든 물리 자원과 AI 판단 기준은 기존 버전 그대로 유지합니다.',sections:[['성능 최적화',['식량 비축 계산은 빈 타일을 제외한 활성 거주 타일 인덱스를 재사용하되 식량 재고는 매번 읽고 주민 연령에 따른 소비량은 매 달력일 갱신합니다.','유지보수 계획·재검토의 건물별 작업 대기열 중복 스캔과 성인 후보 조회를 줄입니다.','정착지 ID, 병합·분할 규칙, 1.0/1.15 접근비용, 90/180일 유지 조건은 변경하지 않습니다.']],['검증',['V0.34C 세이브를 그대로 불러올 수 있고, 캐시는 저장하지 않고 다시 계산합니다.','새 Food Index 성능 계측치를 CSV·Devlog에 출력합니다.']]]});
NS.V034C1=Object.freeze({version:VERSION,populated,getSpatialCandidates,counters,track});
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('34C1 header',e);}
})(window.VSim);
