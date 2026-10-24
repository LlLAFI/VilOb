/* V0.35H1C1 — observation-only stage attribution and snapshot-scoped read caching.
 * No world data, RNG, save schema, snapshot cadence or ledger retention changes.
 */
(function(NS){'use strict';
if(!NS?.Telemetry||!NS?.V034D1||!NS?.V035H1B1||!NS?.V034D3A)return;
const VERSION='V0.35H1C1';
let active=null, lastCache={snapshots:0,prepared:0,preparedHits:0,aggregates:0,aggregateHits:0},started=null;
const reset=()=>{lastCache={snapshots:0,prepared:0,preparedHits:0,aggregates:0,aggregateHits:0};};
const originalD1=NS.V034D1;
// The D1 observer API is frozen; replace its namespace binding, not its functions.
// Every cache exists for only one synchronous snapshot; never carry it into a new day.
NS.V034D1=Object.freeze({...originalD1,
 prepare(w){if(!active||active.world!==w)return originalD1.prepare(w);
  if(!active.prepared){active.prepared=originalD1.prepare(w);lastCache.prepared++;}else lastCache.preparedHits++;
  return active.prepared;},
 all(w,...args){if(!active||active.world!==w)return originalD1.all(w,...args);
  if(!active.aggregates){active.aggregates=originalD1.all(w,...args);lastCache.aggregates++;}else lastCache.aggregateHits++;
  return active.aggregates;}
});
const priorSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){
 if(active)return priorSnapshot.call(this,w,...args); // nested snapshot: no cache lifetime change
 active={world:w,prepared:null,aggregates:null};lastCache.snapshots++;
 try{return priorSnapshot.call(this,w,...args);}finally{active=null;}
};
function start(w){if(!w)throw Error('먼저 세계를 불러오세요.');reset();started={year:w.year,calendarDay:w.calendarOrdinalDay?.(),rngState:w.v35h1a?.rngState,signature:NS.V035H1A?.fingerprint(w)};
 return NS.V035H1B1.startSnapshot(w);}
function ledger(w){const s=NS.V034D3A.stats(w);return {windows:s?.windows?.length||0,completedRows:(s?.windows||[]).reduce((n,p)=>n+(p.rows?.length||0),0),latestWindowRows:s?.windows?.at(-1)?.rows?.length||0,periods:s?.periods||0,liveGroups:Object.keys(s?.live?.groups||{}).length,hasCurrentLedger:!!s?.live};}
function report(w){const snap=NS.V035H1B1.snapshotReport();if(!snap)return null;
 const done=snap.finish||null;
 return {format:'vilob-v035h1c1-observation-v1',version:VERSION,active:!!snap.active,
  observedDays:snap.observedDays??snap.days??0,plannedDays:snap.plannedDays,start:started||snap.start,finish:done,
  snapshot:{calls:snap.calls,totalMs:snap.totalMs,maxMs:snap.maxMs,meanMs:snap.meanMs??(snap.calls?snap.totalMs/snap.calls:0),byReason:snap.byReason,stages:snap.segments},
  cache:{...lastCache},storage:{snapshots:w?.telemetry?.snapshots?.length??null,entries:w?.telemetry?.entries?.length??null,yearlySummaries:w?.telemetry?.yearlySummaries?.length??null,settlementYearly:w?.telemetry?.settlementYearly?.length??null,d3a:w?ledger(w):null},
  notes:['Stage timings are nested inclusive; use exclusiveMs for disjoint attribution. Do not sum inclusiveMs.','D1 read-only caches last only for a single snapshot invocation.','All observation values, history retention rules, storage fields and RNG behavior remain unchanged.']};}
function download(w){const r=report(w);if(!r)throw Error('H1C1 진단을 먼저 실행하세요.');if(typeof document!=='undefined'){
 const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`vilob-v035H1C1-observation-${w?.year||'world'}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);}
 return r;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1b1Panel')||document.getElementById('v035h1cPanel');if(!host)return;
 let panel=document.getElementById('v035h1c1Panel');if(!panel){panel=document.createElement('div');panel.id='v035h1c1Panel';panel.className='panel';panel.style.marginTop='10px';
 panel.innerHTML='<h3>H1C1 · 관측 비용 및 D3A 장부 진단</h3><div class="small muted">180일 동안 기존 Snapshot 타이머와 추가 계층을 분석합니다. 기록 주기와 데이터는 그대로 유지됩니다.</div><div class="button-grid"><button id="v035h1c1Start">H1C1 180일 진단 시작</button><button id="v035h1c1Stop">진단 종료</button><button id="v035h1c1JSON">H1C1 진단 JSON</button></div><div class="small muted" id="v035h1c1Status"></div>';
 host.appendChild(panel);const q=id=>document.getElementById(id);
 q('v035h1c1Start').onclick=()=>{try{start(ui.world);install(ui);}catch(e){q('v035h1c1Status').textContent=e.message;}};
 q('v035h1c1Stop').onclick=()=>{NS.V035H1B1.stopSnapshot();install(ui);};
 q('v035h1c1JSON').onclick=()=>{try{download(ui.world);}catch(e){q('v035h1c1Status').textContent=e.message;}};}
 const status=document.getElementById('v035h1c1Status'),r=report(ui.world);if(status)status.textContent=r?`진단 ${r.active?'진행 중':'종료'} · ${r.observedDays}/${r.plannedDays}일 · Snapshot ${r.snapshot.calls}회 · D1 집계 재사용 ${r.cache.aggregateHits}회`:'시작 전';}
const previousWorld=NS.UI?.prototype?.renderWorld;
if(previousWorld)NS.UI.prototype.renderWorld=function(...args){const out=previousWorld.apply(this,args);install(this);return out;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-25',title:'Observation Hotpath & Memory Optimization V1',summary:'정기 스냅샷 내부 계층 계측 확장 및 단일 스냅샷 범위의 D1 정착지 읽기 전용 조회 중복 제거; 기록·RNG·저장 정책 보존.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const h=NS.UI?.prototype?.renderHeader;if(h)NS.UI.prototype.renderHeader=function(...a){const r=h.apply(this,a);badge();return r;};badge();
NS.V035H1C1=Object.freeze({version:VERSION,start,report,download,ledger,cache:()=>({...lastCache})});
})(window.VSim);
