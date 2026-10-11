/* Village Observer V0.34D2B — civilian Settlement consistency & housing diagnostics.
 * All per-attempt counters are observational; no extra payments, work or RNG.
 * Physical military movement, building sites and settlement economy remain unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.34D2B',PREVIOUS='V0.34D2A',SAVE_KEY='village-observer-v034d2b';
const attemptsByWorld=new WeakMap(), inProgress=new WeakMap();
const count={attempted:0,succeeded:0,rejected:0};
function get(w){let a=attemptsByWorld.get(w);if(!a){a={total:0,accepted:0,rejected:0,sameSettlementCandidatesSkipped:0,byType:{},byBlocker:{},last:[]};attemptsByWorld.set(w,a);}return a;}
function countInternalCandidate(w){if(w)get(w).sameSettlementCandidatesSkipped++;}
// Current housing strain is a Settlement-wide active capacity deficit, not an
// old cumulative housingStrainDays that may take weeks to recover after moving.
function currentHousingStrain(v,w,p){if(!p||p.alive===false)return false;const h=NS.V034D2A?.housingAt?.(v,w,p.homeTileId);return h? h.activeShortage>1e-7:false;}
function housingStatus(v,w){let currentlyStrained=0,residualHistory=0,historyDuringAdequateHousing=0;for(const p of v.residents||[]){if(p.alive===false)continue;const current=currentHousingStrain(v,w,p);if(current)currentlyStrained++;if(Number(p.housingStrainDays||0)>20){residualHistory++;if(!current)historyDuringAdequateHousing++;}}return {currentlyStrained,residualHistory,historyDuringAdequateHousing};}
// A legacy construction gate can directly report why it rejected a real start.
// This marker exists only while a tracked real attempt is on the call stack.
function markGate(v,w,tid,reason){const a=inProgress.get(v);if(a&&a.w===w&&Number(a.tid)===Number(tid))a.gate=reason;}
function detect(v,w,tid,kind,gate){if(gate)return gate;const t=w.map?.get?.(Number(tid));if(!t)return'NO_TILE';if(String(t.ownerId)!==String(v.id))return'FOREIGN_TILE';if(NS.V034D2?.freeSlots?.(v)<=0)return'PROJECT_CAP';
 const queued=[...(v.constructionProjects||[]),...(v.landDevelopmentProjects||[]),...(v.buildingUpgradeProjects||[]),...(v.specializationProjects||[])].some(p=>Number(p.tileId??p.targetTileId)===Number(tid));if(queued)return'SITE_PROJECT_PENDING';
 if(kind==='HOUSE'&&NS.V017?.remainingSpace&&NS.V017?.buildingFootprint&&Number(NS.V017.remainingSpace(v,t))+1e-6<Number(NS.V017.buildingFootprint('house')))return'NO_BUILD_SPACE';
 return kind==='HOUSE'?'UNRESOLVED_UPSTREAM_GATE':kind+'_UNRESOLVED_GATE';
}
function classify(v,w,tid,kind,reason,old,call){const track=kind==='HOUSE'?reason.includes('SETTLEMENT'):reason.includes('SETTLEMENT')&&(reason.includes('HOUSING')||reason.includes('D2')||reason.includes('V28_URBAN'));
 if(!track)return old();
 const before=inProgress.get(v),scope={w,tid,kind,reason,gate:null};inProgress.set(v,scope);let result;
 try{result=old();}finally{if(before)inProgress.set(v,before);else inProgress.delete(v);}
 const ok=Boolean(result),code=ok?'STARTED':detect(v,w,tid,kind,scope.gate),diag=get(w),type=diag.byType[kind]||(diag.byType[kind]={attempts:0,started:0,rejected:0});
 type.attempts++;diag.total++;count.attempted++;if(ok){type.started++;diag.accepted++;count.succeeded++;}else{type.rejected++;diag.rejected++;count.rejected++;diag.byBlocker[code]=(diag.byBlocker[code]||0)+1;}
 diag.last.push({calendarDay:Number(w.calendarOrdinalDay?.()??0),nationId:v.id,tileId:Number(tid),kind,result:code,reason});if(diag.last.length>36)diag.last.shift();return result;
}
// The previously installed D2A/D2/legacy methods are called exactly once.
for(const [method,kind] of [['startConstruction','HOUSE'],['startHousingUpgrade','UPGRADE'],['startLandDevelopment','LAND']]){
 const prev=NS.Village.prototype[method];if(typeof prev!=='function')continue;
 NS.Village.prototype[method]=function(w,tid,...args){const type=method==='startConstruction'?args[0]:null,why=String(args[method==='startConstruction'?1:method==='startHousingUpgrade'?1:0]||'');if(method==='startConstruction'&&type!=='house')return prev.call(this,w,tid,...args);return classify(this,w,tid,kind,why,()=>prev.call(this,w,tid,...args));};
}
function audit(w){const base=NS.V034D2A.audit(w),errors=[...base.errors],housing=NS.V034D2.contextAll(w),housingStrainByNation=[],byNation=new Map((w.villages||[]).map(v=>[String(v.id),{pop:0,strained:0}]));
 for(const h of housing){const nation=(w.villages||[]).find(v=>String(v.id)===String(h.nationId));if(!nation){errors.push('MISSING_NATION:'+h.nationId);continue;}const sum=byNation.get(String(h.nationId));sum.pop+=h.population;}
 for(const v of w.villages||[]){const s=housingStatus(v,w),nation=byNation.get(String(v.id));if(nation.pop!==v.residents.filter(p=>p.alive!==false).length)errors.push('PERSON_TOTAL:'+v.id);if(s.currentlyStrained>nation.pop)errors.push('STRAIN_OVERFLOW:'+v.id);nation.strained=s.currentlyStrained;housingStrainByNation.push({nationId:v.id,nationName:v.name,...s});}
 return {ok:errors.length===0,errors,people:base.people,settlements:base.settlements,capacity:base.capacity,capacityMismatchCount:base.capacityMismatchCount,housingCurrentStrained:[...byNation.entries()].map(([nationId,x])=>({nationId,...x})),housingStrainByNation,projectCap:base.ok};
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this);out.version=VERSION;out.v034d2b={revision:'civilian-settlement-consistency-diagnostics-v1'};return out;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error('V0.34D2B 저장 파일만 지원합니다.');return oldFrom({...data,version:PREVIOUS});};
function download(name,body,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(SAVE_KEY);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034D2B-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D2B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D2B-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D2B-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const a=audit(w);if(!a.ok)throw Error('D2B 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D2B-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){const a=audit(w);if(!a.ok)throw Error('D2B 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D2B-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));}
};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const result=prevJSON.call(this,w);result.version=VERSION;if(result.worldSummary){result.worldSummary.v034d2bRevision='civilian-settlement-consistency-and-housing-rejections';result.worldSummary.v034d2bAudit=audit(w);result.worldSummary.v034d2bHousingDiagnostics={...get(w)};}return result;};
if(NS.UI){const prevHeader=NS.UI.prototype.renderHeader,prevTile=NS.UI.prototype.renderTile;
 NS.UI.prototype.renderHeader=function(...args){const result=prevHeader.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementHousingD2Btn');if(btn)btn.title='D2B Settlement 공동 주거 11열 CSV';}return result;};
 NS.UI.prototype.renderTile=function(...args){const result=prevTile.apply(this,args),root=this.q?.('tileInspector'),label=root?.querySelector?.('.v034d2-housing');if(label)label.innerHTML=label.innerHTML.replace('D2A 통합 생활권','D2B 통합 생활권');return result;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Civilian Settlement Consistency & Housing Diagnostics',summary:'같은 Settlement의 불필요한 민간 이동을 막고, 실효 공동 주거 압박과 과거 누적 스트레스를 구분하며 주택·토지정비 착공의 실제 거절 게이트를 누적 추적합니다.',sections:[['생활권 일관성',['V0.28 내부 이주 후보에서 같은 Settlement의 타일 간 이동을 제외합니다.','V0.27 실제 일일 주거 스트레스·행복도도 공동 Settlement 주거 수용량을 사용합니다.','같은 Settlement 소속 타일을 별도 이주 목적지로 평가하지 않으며, 다른 Settlement 간 이주 매력도는 기존 규칙을 유지합니다.']],['집계·진단',['V0.28 주거 압박 통계는 공동 활성 수용량 부족 여부를 계산합니다. 기존 누적 스트레스는 D2B 진단에 따로 표시합니다.','공동 주거 건설·토지정비·개축 시도에 대해 착공 성공과 실패 원인(확인 가능한 실제 하위 게이트 포함)을 유형별로 누적합니다.','원인을 검증할 수 없는 차단은 UNRESOLVED로 보존하며 추정치를 확정 원인으로 꾸미지 않습니다.']],['기존 규칙',['건설 슬롯 3~11, 기존 Gold·자재·노동 소모와 기술 및 시장·물류 규칙을 보존합니다.','Snapshot CSV V2 1,683열, D1A Settlement CSV 48열, Housing CSV 11열을 유지합니다.']]]});
NS.V034D2B=Object.freeze({version:VERSION,audit,currentHousingStrain,housingStatus,attempts:w=>get(w),markGate,countInternalCandidate,count});
if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D2B header',e);}
})(window.VSim);
