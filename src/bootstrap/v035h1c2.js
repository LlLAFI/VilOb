/* V0.35H1C2 — Simulation State / Domain Event / Observation boundary V1.
 * Legacy Telemetry is still produced exactly as before; game-critical effects
 * must not be disabled by observation or diagnostic lifecycle settings.
 */
(function(NS){'use strict';
if(!NS?.World||!NS?.Telemetry||!NS?.V033F5A4)return;
const VERSION='V0.35H1C2',KEY='v35h1c2',SCHEMA=1;
const memory=new WeakMap();
const counters={decisionsCaptured:0,stateHits:0,legacyHydrations:0,legacyLogLookups:0,domainWarDeclarations:0};
function ensure(w){if(!w)return null;if(!w[KEY]||typeof w[KEY]!=='object')w[KEY]={schema:SCHEMA,aiLast:{}};
 if(!w[KEY].aiLast||typeof w[KEY].aiLast!=='object')w[KEY].aiLast={};return w[KEY];}
function originalDecision(w,id,day){const es=w?.telemetry?.entries||[];counters.legacyLogLookups++;
 for(let i=es.length-1;i>=0;i--){const e=es[i];if((e.ordinalDay||0)<day-1)break;if(e.type==='AI_DECISION'&&e.payload?.villageId===id)return e;}return null;}
function lastDecision(w,v,day=w.ordinalDay()){
 if(!w||!v)return null;const id=String(v.id),state=ensure(w);let cache=memory.get(w);if(!cache){cache=new Map();memory.set(w,cache);}
 let e=cache.get(id);if(e&&Number(e.ordinalDay)>=day-1&&Number(e.ordinalDay)<=day){counters.stateHits++;return e;}
 const saved=state.aiLast[id];if(saved&&Number(saved.ordinalDay)>=day-1&&Number(saved.ordinalDay)<=day){
  // Try to rebind to the actual historical record so legacy observation wrappers
  // that mutate e.payload still change the same original telemetry entry.
  e=originalDecision(w,v.id,day);
  if(!e)e={ordinalDay:saved.ordinalDay,type:'AI_DECISION',payload:saved.payload};
  cache.set(id,e);counters.stateHits++;return e;
 }
 // Legacy H1C1 saves have no SimulationState. Hydrate exactly once when needed.
 e=originalDecision(w,v.id,day);if(e){state.aiLast[id]={ordinalDay:e.ordinalDay,payload:e.payload};cache.set(id,e);counters.legacyHydrations++;return e;}
 cache.delete(id);return null;
}
function capture(type,w,payload,t){if(type!=='AI_DECISION'||!w||!payload||payload.villageId==null)return;
 const es=t?.entries||[],e=es[es.length-1];if(!e||e.type!==type||e.payload!==payload)return;
 const state=ensure(w),id=String(payload.villageId);state.aiLast[id]={ordinalDay:e.ordinalDay,payload:e.payload};
 let cache=memory.get(w);if(!cache){cache=new Map();memory.set(w,cache);}cache.set(id,e);counters.decisionsCaptured++;
}
// Attach to the *outermost* record wrapper. Preserve all original callbacks,
// payload mutation, event order and return value. Observation stays enabled.
const previousRecord=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){const r=previousRecord.call(this,type,w,payload);capture(type,w,payload,this);return r;};
const previousSerialize=NS.World.prototype.serialize;
NS.World.prototype.serialize=function(...args){const data=previousSerialize.apply(this,args),state=ensure(this);
 // Copy the slim, authoritative recent AI decision state. No runtime WeakMap,
 // profiling counters, or observation toggles enter checkpoint data.
 data[KEY]={schema:SCHEMA,aiLast:state.aiLast};return data;};
const previousFrom=NS.World.from;
NS.World.from=function(data,...args){const world=previousFrom.call(this,data,...args);if(world){const source=data?.[KEY];if(source?.schema===SCHEMA&&source.aiLast){world[KEY]={schema:SCHEMA,aiLast:source.aiLast};}else ensure(world);}return world;};
const DomainEvents=Object.freeze({
 legacyWarDeclared(w,payload){counters.domainWarDeclarations++;
  // Migrated call-site from protected legacy/126; retain its exact former
  // point in Telemetry.record call chain. Not yet a standalone event bus.
  return NS.V033F5A4.repairWarTargets(w,true);},
 classifiedTypes:Object.freeze(['WAR_DECLARED33','WAR_ENDED33','TILE_OCCUPIED33','TILE_LIBERATED33'])
});
const SimulationState=Object.freeze({lastDecision,get(w){return ensure(w);},schema:SCHEMA});
const Observer=Object.freeze({name:'Observation Telemetry',snapshot(w){return w?.telemetry?.snapshots||[];},events(w){return w?.telemetry?.entries||[];},lifecycle:'ACTIVE',disableSupported:false});
const Diagnostics=Object.freeze({name:'Diagnostic Trace',enabled:false,mode:'RESERVE',stats(){return {...counters};}});
const inventory=Object.freeze({
 format:'vilob-telemetry-lifecycle-v1',version:VERSION,
 categories:['SIMULATION_STATE','DOMAIN_EVENT','OBSERVATION_TELEMETRY','DIAGNOSTIC_TRACE'],
 simulationState:['AI last decision / scores / fallback state (v35h1c2.aiLast)','AI plans and memory','formation, occupation and war state','recent event-derived gameplay state'],
 domainEvent:['WAR_DECLARED33: target invariant bridge migrated','WAR_ENDED33: legacy side effects pending audit','TILE_OCCUPIED33/TILE_LIBERATED33: legacy side effects pending audit'],
 observation:['telemetry.entries — keep for backward-compatible Devlog and legacy lookups','telemetry.snapshots / yearlySummaries / settlementYearly','D3A food 30-day windows / 1683-column CSV'],
 diagnostics:['35A/35C/35D profilers: reserve','H1C1 snapshot stage profiler: active only during session','H1C gzip storage report: on demand'],
 safety:'No historical Telemetry.record or snapshot producer disabled. Domain-event adapter still forwards through legacy record timing; further decoupling requires dependency parity tests.'
});
function report(w){return {...inventory,at:{year:w?.year,calendarDay:w?.ordinalDay?.(),recordCount:w?.telemetry?.entries?.length,snapshots:w?.telemetry?.snapshots?.length,stateNations:Object.keys(ensure(w)?.aiLast||{}).length},metrics:{...counters}};}
function download(w){const result=report(w);if(typeof document!=='undefined'){
 const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='vilob-v035H1C2-telemetry-lifecycle.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}return result;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1c1Panel')||document.getElementById('v035h1cPanel');if(!host||document.getElementById('v035h1c2Panel'))return;
 const panel=document.createElement('div');panel.className='panel';panel.id='v035h1c2Panel';panel.style.marginTop='10px';panel.innerHTML='<h3>H1C2 · 게임 상태 / 관측 데이터 분리</h3><div class="small muted">AI 결정 상태와 전쟁 필수 처리는 관측 기록과 구별됩니다. 기존 Devlog·Snapshot은 계속 유지합니다.</div><div class="button-grid"><button id="v035h1c2Report">텔레메트리 수명주기 진단 JSON</button></div>';
 host.appendChild(panel);const b=document.getElementById('v035h1c2Report');if(b)b.onclick=()=>download(ui.world);}
const originalRender=NS.UI?.prototype?.renderWorld;if(originalRender)NS.UI.prototype.renderWorld=function(...args){const value=originalRender.apply(this,args);install(this);return value;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-25',title:'Simulation State & Observation Separation V1',summary:'AI 결정 상태 저장 및 게임 사건/관측/진단 분류. 기존 AI 로그·스냅샷·전쟁 처리·RNG 보존. 안전한 구형 콜사이트만 변환.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const oldHeader=NS.UI?.prototype?.renderHeader;if(oldHeader)NS.UI.prototype.renderHeader=function(...args){const r=oldHeader.apply(this,args);badge();return r;};badge();
NS.V035H1C2=Object.freeze({version:VERSION,SimulationState,DomainEvents,Observer,Diagnostics,inventory,report,download});
})(window.VSim);
