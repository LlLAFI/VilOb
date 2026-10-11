
/* V0.34C1G — Legacy V30A Annual Diagnostics Hotpath Optimization V1.
   Old diagnostic lifecycle stays intact: only its local pure trade-flow reads are indexed.
   No cache crosses national diagnosis calls, seasonal ticks, or save boundaries. */
(function(NS){'use strict';
const VERSION='V0.34C1G',PREVIOUS='V0.34C1F';
const stats=new WeakMap(),ms=n=>Math.round(Number(n||0)*1000)/1000;
const get=w=>{let s=stats.get(w);if(!s){s={diagRuns:0,b4Runs:0,flowIndexBuilds:0,flowIndexHits:0,flowEntriesScanned:0,flowEventsAccepted:0,flowFallbacks:0,activeSkips:0,delegatedSkips:0,totalDiagMs:0,totalIndexMs:0,totalB4Ms:0,history:[],last:null};stats.set(w,s);}return s;};
const enabled=w=>!!NS.V034C1B?.isActive?.(w);
function record(w,v,c,duration){const s=get(w);s.diagRuns++;s.flowIndexBuilds+=c.indexBuilds;s.flowIndexHits+=c.hits;s.flowEntriesScanned+=c.scanned;s.flowEventsAccepted+=c.accepted;s.flowFallbacks+=c.fallbacks;s.activeSkips+=c.skippedActive;s.delegatedSkips+=c.skippedDelegated;
 if(duration!=null){s.totalDiagMs+=duration;s.totalIndexMs+=c.indexMs;const row={year:w.year,season:w.season,calendarDay:Number(w.calendarOrdinalDay?.()||0),nationId:String(v.id),name:v.name,diagMs:ms(duration),indexMs:ms(c.indexMs),indexBuilds:c.indexBuilds,flowQueries:c.hits,entriesScanned:c.scanned,eventsAccepted:c.accepted,activeSkips:c.skippedActive,delegatedSkips:c.skippedDelegated};s.last=row;s.history.push(row);if(s.history.length>56)s.history.shift();}}
function recordB4(w,v,time){const s=get(w);s.b4Runs++;if(time!=null)s.totalB4Ms+=time;const row=s.history.at(-1);if(time!=null&&row?.calendarDay===w.calendarOrdinalDay()&&row.nationId===String(v.id))row.b4Ms=ms(time);}
function summarize(w){const s=get(w);return{enabled:enabled(w),hasProfile:!!s.last,diagRuns:s.diagRuns,b4Runs:s.b4Runs,flowIndexBuilds:s.flowIndexBuilds,flowIndexHits:s.flowIndexHits,flowEntriesScanned:s.flowEntriesScanned,flowEventsAccepted:s.flowEventsAccepted,flowFallbacks:s.flowFallbacks,activeSkips:s.activeSkips,delegatedSkips:s.delegatedSkips,totalDiagMs:ms(s.totalDiagMs),totalIndexMs:ms(s.totalIndexMs),totalB4Ms:ms(s.totalB4Ms),last:s.last,historyCount:s.history.length};}
NS.V034C1G={version:VERSION,enabled,record,recordB4,summarize,history:w=>get(w).history.slice()};
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
const oldSnap=NS.Telemetry.prototype.snapshot;
const fields=['survivalGDiagRuns','survivalGB4Runs','survivalGFlowIndexBuilds','survivalGFlowIndexHits','survivalGFlowEntriesScanned','survivalGFlowEventsAccepted','survivalGFlowFallbacks','survivalGActiveSkips','survivalGDelegatedSkips','survivalGLastDiagMs','survivalGLastIndexMs','survivalGLastB4Ms'];
function values(w){const s=summarize(w),r=s.last||{};return{survivalGDiagRuns:s.diagRuns,survivalGB4Runs:s.b4Runs,survivalGFlowIndexBuilds:s.flowIndexBuilds,survivalGFlowIndexHits:s.flowIndexHits,survivalGFlowEntriesScanned:s.flowEntriesScanned,survivalGFlowEventsAccepted:s.flowEventsAccepted,survivalGFlowFallbacks:s.flowFallbacks,survivalGActiveSkips:s.activeSkips,survivalGDelegatedSkips:s.delegatedSkips,survivalGLastDiagMs:r.diagMs||0,survivalGLastIndexMs:r.indexMs||0,survivalGLastB4Ms:r.b4Ms||0};}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=oldSnap.call(this,w,reason,note);if(sn?.global)Object.assign(sn.global,values(w));return sn;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+fields.map(q).join(',');let i=1;for(const sn of this.snapshots||[])for(const v of sn.villages||[]){if(i>=lines.length)break;lines[i++]+=','+fields.map(k=>q(sn.global?.[k])).join(',');}return lines.join('\n');};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary.v034c1gRevision='legacy-v30a-scoped-trade-flow-index-v1';d.worldSummary.v034c1gPerformance=summarize(w);d.worldSummary.v034c1gQuarterHistory=NS.V034C1G.history(w);return d;};
const oldSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem('village-observer-v034c1g',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1g');return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v034C1G-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1G-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);if(check&&!check.ok)throw Error('C1G CSV schema mismatch '+JSON.stringify(check.bad?.slice(0,3)));download(`village-observer-v034C1G-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader,oldWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(){const ret=oldHeader.call(this);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const status=this.q?.('runtimeStatus');if(status)status.textContent='✓ '+VERSION+' · 연간 진단 최적화';return ret;};
 NS.UI.prototype.renderWorld=function(){const ret=oldWorld.call(this),panel=document.querySelector('.v034c1b-profiler'),w=this.world;if(!panel||!w)return ret;let el=panel.querySelector('.v034c1g-summary');if(!el){el=document.createElement('div');el.className='v034c1g-summary small muted';el.style.cssText='margin-top:4px;font-size:11px;line-height:1.6;';panel.appendChild(el);}const s=summarize(w),r=s.last;el.textContent=r?`C1G 최근 연간 진단(${r.name}, ${r.year}년 Q${r.season+1}): ${r.diagMs.toFixed(1)}ms · Devlog 인덱스 ${r.indexMs.toFixed(1)}ms · 흐름 조회 누적 ${s.flowIndexHits}회${s.enabled?'':' · 정밀 계측 OFF (과거 기록)'}`:'C1G 연간 진단 세부 계측 없음 · C1B 정밀 계측을 켜고 다음 진단 분기까지 진행하세요.';return ret;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Survival30 / Legacy Diagnostics Hotpath Optimization V1',summary:'V0.30A 연간 고급 시설 진단의 중복 Devlog 조회를 진단 1회짜리 인덱스로 교체해 불필요한 반복 연산을 줄입니다. 기존 생존/Recovery 정책과 시설 판정은 변경하지 않습니다.',sections:[['연간 진단 최적화',['동일한 국가 연간 진단 안에서 타일별 TRADE/DOMESTIC_TRADE29 최근 120일·240일 거래량을 한 번만 구축하고 재사용합니다.','거래량의 날짜/자원/출발지·도착지 필터와 이벤트 순서, 총량·건수 산정은 기존 규칙을 유지합니다.','이미 건설된 시설 및 V0.30B3 Stoneworks 진단으로 위임하는 시설에서 사용하지 않을 흐름 검색은 실행하지 않습니다.']],['계측 및 검증',['C1B 분기 정밀 계측을 ON으로 설정하면 C1G 진단 전체·인덱스 구축 시간과 B4 후처리 시간을 기록합니다.','Devlog와 Snapshot CSV에 C1G 누적 카운터와 진단 실행 시점을 추가합니다.','기존 C1F 교역망 캐시 및 HF1 패치노트/버전 배지/CSV 정렬 수정은 그대로 유지합니다.']],['범위 제한',['연간 진단의 실행 시점, 세이브 로드 직후 재진단, 시설 판정·회계·AI 난수·Survival/Recovery 규칙은 변경하지 않습니다.']]]});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('C1G initial header',e);}
})(window.VSim);

