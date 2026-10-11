
/* V0.34C1F — Trade Intent Hotpath Optimization V1
 * Short lived per-plan read-only memoization. All physical/quote/diplomatic calls remain.
 * The V0.10 road signature is computed once per E4 plan and V0.33E9 semantic
 * trading posts are filtered once per nation per E4 plan. No cache survives a plan.
 */
(function(NS){'use strict';
const VERSION='V0.34C1F',PREVIOUS='V0.34C1E-HF1';
const active=new WeakMap(),stats=new WeakMap();
const now=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const round=n=>Math.round((Number(n)||0)*1000)/1000;
const timeKeys=['partners','opportunity','shortlist','candidates','landCost','tradePath','routeInfo','tradingPosts','roadSignature'];
const freshTimes=()=>Object.fromEntries(timeKeys.map(k=>[k,0]));
const freshCalls=()=>Object.fromEntries(timeKeys.map(k=>[k,0]));
const get=w=>{let s=stats.get(w);if(!s){s={plans:0,postBuilds:0,postHits:0,roadBuilds:0,roadHits:0,history:[],last:null};stats.set(w,s);}return s;};
function beginPlan(w,v){if(!w)return null;const prev=active.get(w)||null,enabled=!!NS.V034C1B?.isActive(w),f={w,v,prev,enabled,started:enabled?now():0,posts:new Map(),roadReady:false,road:null,times:freshTimes(),calls:freshCalls(),builds:0,hits:0,roadBuilds:0,roadHits:0};active.set(w,f);get(w).plans++;return f;}
function endPlan(w,f){if(!f)return;const s=get(w);s.postBuilds+=f.builds;s.postHits+=f.hits;s.roadBuilds+=f.roadBuilds;s.roadHits+=f.roadHits;
 if(f.enabled){const row={year:Number(w.year||0),season:Number(w.season||0),calendarDay:Number(w.calendarOrdinalDay?.()||0),nationId:String(f.v?.id),name:String(f.v?.name||''),totalMs:round(now()-f.started),times:Object.fromEntries(timeKeys.map(k=>[k,round(f.times[k])])),calls:{...f.calls},postBuilds:f.builds,postHits:f.hits,roadBuilds:f.roadBuilds,roadHits:f.roadHits};s.last=row;s.history.push(row);if(s.history.length>56)s.history.shift();}
 if(f.prev)active.set(w,f.prev);else active.delete(w);
}
function time(w,key,fn){const f=active.get(w);if(!f?.enabled)return fn();const t=now();try{return fn();}finally{f.times[key]+=now()-t;f.calls[key]++;}}
function mark(w){const f=active.get(w);return f?.enabled?now():null;}
function endMark(w,k,t){const f=active.get(w);if(f?.enabled&&t!=null){f.times[k]+=now()-t;f.calls[k]++;}}
function roadSignature(w,calc){const f=active.get(w);if(!f)return calc();if(f.roadReady){f.roadHits++;return f.road;}const value=time(w,'roadSignature',calc);f.road=value;f.roadReady=true;f.roadBuilds++;return value;}
const oldPosts=NS.Village.prototype.tradingPosts;
NS.Village.prototype.tradingPosts=function(...args){const w=this._world,f=w&&active.get(w);if(!f)return oldPosts.apply(this,args);if(f.posts.has(this)){f.hits++;return f.posts.get(this).slice();}
 const values=time(w,'tradingPosts',()=>oldPosts.apply(this,args));f.posts.set(this,values.slice());f.builds++;return values;};
function inPlan(w){return !!active.get(w);}
function summarize(w){const s=get(w),enabled=!!NS.V034C1B?.isActive(w),q=s.history.at(-1);return{enabled,hasProfile:!!q,plans:s.plans,postBuilds:s.postBuilds,postHits:s.postHits,roadBuilds:s.roadBuilds,roadHits:s.roadHits,last:q||null,historyCount:s.history.length,notes:'Nested routeInfo/landCost/tradePath/opportunity times must not be added to parent partners or candidates.'};}
NS.V034C1F={version:VERSION,beginPlan,endPlan,time,mark,endMark,roadSignature,inPlan,summarize,history:w=>get(w).history.slice()};
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
const oldSnap=NS.Telemetry.prototype.snapshot;
const fields=['tradeFPlans','tradeFPostBuilds','tradeFPostHits','tradeFRoadBuilds','tradeFRoadHits','tradeFProfileEnabled','tradeFLastPlanMs','tradeFLastPartnersMs','tradeFLastOpportunityMs','tradeFLastShortlistMs','tradeFLastCandidatesMs','tradeFLastRouteInfoMs','tradeFLastLandCostMs','tradeFLastTradePathMs'];
function values(w){const s=summarize(w),q=s.last||{},t=q.times||{};return{tradeFPlans:s.plans,tradeFPostBuilds:s.postBuilds,tradeFPostHits:s.postHits,tradeFRoadBuilds:s.roadBuilds,tradeFRoadHits:s.roadHits,tradeFProfileEnabled:s.enabled?1:0,tradeFLastPlanMs:q.totalMs||0,tradeFLastPartnersMs:t.partners||0,tradeFLastOpportunityMs:t.opportunity||0,tradeFLastShortlistMs:t.shortlist||0,tradeFLastCandidatesMs:t.candidates||0,tradeFLastRouteInfoMs:t.routeInfo||0,tradeFLastLandCostMs:t.landCost||0,tradeFLastTradePathMs:t.tradePath||0};}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=oldSnap.call(this,w,reason,note);if(sn?.global)Object.assign(sn.global,values(w));return sn;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+fields.map(q).join(',');let i=1;for(const snap of this.snapshots||[])for(const row of snap.villages||[]){if(i>=lines.length)break;lines[i++]+=','+fields.map(k=>q(snap.global?.[k])).join(',');}return lines.join('\n');};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary.v034c1fRevision='trade-intent-scoped-posts-and-road-signature-v1';d.worldSummary.v034c1fPerformance=summarize(w);d.worldSummary.v034c1fQuarterHistory=NS.V034C1F.history(w);return d;};
const oldSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem('village-observer-v034c1f',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1f');return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v034C1F-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1F-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);if(check&&!check.ok)throw Error('C1F CSV schema mismatch '+JSON.stringify(check.bad?.slice(0,3)));download(`village-observer-v034C1F-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader,oldWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(){const ret=oldHeader.call(this);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const status=this.q?.('runtimeStatus');if(status)status.textContent='✓ '+VERSION+' · 교역망 반복 조회 최적화';return ret;};
 NS.UI.prototype.renderWorld=function(){const ret=oldWorld.call(this),panel=document.querySelector('.v034c1b-profiler'),w=this.world;if(!panel||!w)return ret;let el=panel.querySelector('.v034c1f-summary');if(!el){el=document.createElement('div');el.className='v034c1f-summary small muted';el.style.cssText='margin-top:4px;font-size:11px;line-height:1.6;';panel.appendChild(el);}const s=summarize(w),q=s.last;el.textContent=q?`C1F 마지막 계획(${q.name}, ${q.year}년 Q${q.season+1}): ${q.totalMs.toFixed(1)}ms · 상대 평가 ${q.times.partners.toFixed(1)}ms · 교역소 재사용 누적 ${s.postHits}회 · 도로정보 재사용 ${s.roadHits}회${s.enabled?'':' · 계측 OFF (지난 결과)'}`:'C1F 교역망 세부 계측 없음 · C1B 정밀 계측을 켜고 다음 분기까지 진행하세요.';return ret;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Trade Intent Hotpath Optimization V1',summary:'V0.32E4 교역망 계획 내에서 교역소 목록과 도로 시그니처의 반복 순회를 없애고, C1B 계측을 활용해 세부 처리시간을 기록합니다. 교역 및 외교 결과는 변경하지 않습니다.',sections:[['최적화',['교역망 계획 1회 동안 국가별 활성 교역소 목록을 단 한 번 조회하고 나머지 호출에 재사용합니다. 반환 배열은 별도 복사하여 기존 호출 계약을 유지합니다.','실제 교역 경로 조회 routeInfo와 D5 assessTrade 호출 및 캐시 갱신은 생략하지 않습니다.','도로 시그니처는 동일 계획 동안 한 번 평가하며 계획 종료 시 임시 자료를 폐기합니다.']],['성능 분석',['C1B 토글 ON 상태에서 partnerRows, opportunity, candidate, routeInfo, tradePath 등의 중첩시간과 호출 횟수를 관찰할 수 있습니다.','Devlog JSON과 Snapshot CSV에 C1F 통계를 추가했습니다.']],['호환성',['HF1의 버전 표시·패치노트·CSV 수정은 유지합니다. 기존 C1E-HF1 및 더 이전 세이브를 지원합니다.','실제 교역, 시장 Gold, 외교, 개척, 전투, AI 점수, 난수 사용량을 변경하지 않습니다.']]]});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('C1F initial header',e);}
})(window.VSim);
