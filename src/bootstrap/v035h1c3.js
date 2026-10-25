/* V0.35H1C3 — Occupied physical/accessibility audit, domain event adapters,
 * and profiler-only leaf probes for E/F Snapshot hotpaths.
 * Source game rules, event timing, RNG, logging and retention stay unchanged.
 */
(function(NS){'use strict';
if(!NS?.V034D3||!NS?.V035H1C2||!NS?.V035H1B1)return;
const VERSION='V0.35H1C3';
const count={WAR_DECLARED33:0,WAR_ENDED33:0,TILE_OCCUPIED33:0,TILE_LIBERATED33:0};
// Installed by SHA-preserving build transforms in legacy/125 and legacy/114.
// Explicit dispatch can be used independently of an observation record. Existing
// record call-sites still use handle() at the exact historical position.
const handlers=Object.freeze({...NS.__H1C3DomainHandlers});
delete NS.__H1C3DomainHandlers;
const DomainEvents=Object.freeze({
 types:Object.freeze(Object.keys(count)),
 handle(type,w,payload,fallback){if(Object.prototype.hasOwnProperty.call(count,type))count[type]++;
  return typeof fallback==='function'?fallback(w,payload):handlers[type]?.(w,payload);},
 dispatch(type,w,payload){if(typeof handlers[type]!=='function')throw Error('Unknown H1C3 game event: '+type);
  count[type]++;const out=handlers[type](w,payload);
  // Declaration formerly had a second, later invariant-repair callback in
  // legacy/126. Explicit event dispatch must execute it too, exactly once.
  if(type==='WAR_DECLARED33')NS.V035H1C2.DomainEvents.legacyWarDeclared(w,payload);
  return out;},
 report(){return {...count,registered:Object.keys(handlers)};},
 // Observation producers remain enabled: only explicitly tested event paths
 // have been migrated, and future mutation call-sites must dispatch explicitly.
 observationIndependentComplete:false
});
function measureCall(stage,w,fn,that,args){const meter=NS.V035H1B1?.measureStage;
 return meter?meter(stage,w,fn,that,args):fn.apply(that,args);}
function report(w){const a=NS.V034D3.audit(w);
 const prev=NS.V035H1C2.report(w);
 return {format:'vilob-v035h1c3-integrity-v1',version:VERSION,
  runtimeVersion:VERSION,saveFormatVersion:'V0.35H1B1A',
  at:{year:w?.year,ordinalDay:w?.ordinalDay?.(),calendarOrdinalDay:w?.calendarOrdinalDay?.()},
  d3:{ok:a.ok,errors:a.errors,warnings:a.warnings,
   physical:a.h1c3?.physical,accessible:a.h1c3?.accessible,
   occupiedMemberTiles:a.h1c3?.occupiedMemberTiles,fullyBlockedSettlements:a.h1c3?.fullyBlockedSettlements,poolChecks:a.h1c3?.poolChecks},
  domainEvents:DomainEvents.report(),simulationState:prev.metrics,
  observation:{snapshotCount:w?.telemetry?.snapshots?.length||0,retentionUnchanged:true,csvColumns:1683},
  notes:['Physical stocks include hostile-occupied owned tiles; accessible pool excludes them.',
   'Legacy record() producers remain enabled; the DomainEvents bridge retains old callback timing.',
   'E/F leaf times appear only when an H1B1/H1C1 snapshot profiler session is active.']};}
function download(w){const data=report(w);
 if(typeof document!=='undefined'){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download='vilob-v035H1C3-integrity.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);
 }return data;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1c2Panel')||document.getElementById('v035h1c1Panel');
 if(!host||document.getElementById('v035h1c3Panel'))return;
 const node=document.createElement('div');node.id='v035h1c3Panel';node.className='panel';node.style.marginTop='10px';
 node.innerHTML='<h3>H1C3 · 점령 재고 / 게임 사건 무결성</h3><div class="small muted">물리 재고와 민간 접근 재고를 분리 검증하고 사건 경계 상태를 진단합니다.</div><div class="button-grid"><button id="v035h1c3Report">H1C3 무결성 진단 JSON</button></div>';
 host.appendChild(node);const btn=document.getElementById('v035h1c3Report');if(btn)btn.onclick=()=>download(ui.world);}
const previousUI=NS.UI?.prototype?.renderWorld;
if(previousUI)NS.UI.prototype.renderWorld=function(...args){const out=previousUI.apply(this,args);install(this);return out;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=oldJSON.call(this,w);
 out.version=VERSION;out.runtimeVersion=VERSION;out.saveFormatVersion='V0.35H1B1A';
 if(out.worldSummary){out.worldSummary.runtimeVersion=VERSION;out.worldSummary.saveFormatVersion='V0.35H1B1A';}
 return out;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))
 NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-25',title:'Domain Integrity & Observation Hotpath V1',summary:'점령 타일 물리 재고/민간 접근 재고 감사 분리, DomainEvents 종전·점령·해방 연결 확대, E4/F5 하위 병목 프로파일링 및 진단 날짜·버전 명확화.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const prevHeader=NS.UI?.prototype?.renderHeader;if(prevHeader)NS.UI.prototype.renderHeader=function(...args){const value=prevHeader.apply(this,args);badge();return value;};badge();
NS.V035H1C3=Object.freeze({version:VERSION,DomainEvents,measureCall,report,download});
})(window.VSim);
