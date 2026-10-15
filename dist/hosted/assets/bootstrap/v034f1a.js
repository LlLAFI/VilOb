/* Village Observer V0.34F1A — Food Accounting Reconciliation.
 * Observe *actual* physical legacy-overflow loss; never repeat a debit.
 * Occupied tiles are assigned a canonical physical ledger in D3A observer only.
 * Food, hunger, production, military, territory, AI and RNG rules unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.34F1A',PREVIOUS='V0.34F1',KEY='village-observer-v034f1a';
const OBS=NS.V034D3A,D3=NS.V034D3,BASE=NS.V034D3A2;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const stamp=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
function state(w){const s=OBS.stats(w);if(!s.f1a){s.f1a={startOrdinal:stamp(w),overflowEvents:0,overflowSpent:0,physicalOverflowTiles:0,revision:VERSION};
 // A restored F1 live 30-day bucket contains old and new observations.
 // Do not falsely certify that mixed bucket as a fully reconciled F1A period.
 if(s.live){s.live.f1aMixed=true;for(const r of Object.values(s.live.groups||{}))r.f1aMixed=true;}
 }return s.f1a;}
// This is executed ONLY on the two real legacy setter writes, not on each Person.
function captureOverflow(v,w){if(!w||!v)return null;const snap=[];for(const id of v.territory){const q=D3.stockRaw(w,id,'food');if(q>0)snap.push([Number(id),q]);}return snap;}
function recordOverflow(v,w,before){if(!before?.length||!w||!v)return 0;let spent=0,count=0;
 const x=state(w);for(const [id,was] of before){const now=D3.stockRaw(w,id,'food'),loss=was-now;
  if(loss<=1e-8)continue;
  // existing D3A observedFoodDelta already subtracts otherWithdrawn;
  // distinguish its SOURCE using an extra, non-additive diagnostic field.
  OBS.addMetric(w,v,id,'otherWithdrawn',loss);
  const row=OBS.ensureRow(w,v,id);row.legacyOverflowFoodSpent=n(row.legacyOverflowFoodSpent)+loss;
  spent+=loss;count++;
 }if(spent){x.overflowEvents++;x.overflowSpent+=spent;x.physicalOverflowTiles+=count;}return spent;
}
function enrich(w){const s=OBS.stats(w),start=n(s.f1a?.startOrdinal),rows=BASE.rows(w);
 return rows.map(r=>{
  const lost=n(r.legacyOverflowFoodSpent),era=r.windowEnd<start?'F1_LEGACY':(r.f1aMixed||r.windowStart<start?'MIXED':'F1A');
  // The base D3A window already incorporates otherWithdrawn; therefore DO NOT
  // subtract legacyOverflowFoodSpent again. It is a breakdown, not an added sink.
  const out={...r,legacyOverflowFoodSpent:lost,occupationLedgerAttributions:n(r.occupationLedgerAttributions),accountingEra:era};
  out.residualClass=(r.topologyChanged?'TOPOLOGY_CHANGE':(r.unattributedDelta==null?'NOT_COMPARABLE':Math.abs(n(r.unattributedDelta))<=.01?(n(r.occupationLedgerAttributions)>0?'OCCUPATION_LEDGER_RECONCILED':lost>0?'LEGACY_OVERFLOW_ACCOUNTED':'BALANCED'):'TRUE_UNATTRIBUTED'));
  return out;
 });
}
const esc=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const cols=[...BASE.columns,'legacyOverflowFoodSpent','occupationLedgerAttributions','accountingEra','residualClass'];
function csv(w){return [cols.join(','),...enrich(w).map(r=>cols.map(k=>esc(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(',')).join('\n')].join('\n');}
// Include legacy rows in the download with explicit provenance, but DO NOT
// relabel them as fixed. Filter anomalies from fully new windows separately.
const anomalousCols=['windowStart','windowEnd','nationName','settlementId','tileIds','accountingEra','storageDelta','observedFoodDelta','legacyOverflowFoodSpent','occupationLedgerAttributions','unattributedDelta','residualClass','topologyChanged'];
function anomalies(w,includeLegacy=false){return enrich(w).filter(r=>r.partial!=='ACTIVE'&&Math.abs(n(r.unattributedDelta))>.01&&r.unattributedDelta!=null&&(!r.topologyChanged)&& (includeLegacy||r.accountingEra==='F1A'));}
function anomalyCSV(w){return [anomalousCols.join(','),...anomalies(w).map(r=>anomalousCols.map(k=>esc(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(',')).join('\n')].join('\n');}
function report(w){const rows=enrich(w),newRows=rows.filter(r=>r.accountingEra==='F1A'&&r.partial!=='ACTIVE'&&!r.topologyChanged&&r.unattributedDelta!=null),bad=newRows.filter(r=>Math.abs(n(r.unattributedDelta))>.01);
 const s=state(w);return {version:VERSION,actualOverflowSpent:s.overflowSpent,overflowEvents:s.overflowEvents,physicalOverflowTiles:s.physicalOverflowTiles,occupationLedgerAttributions:rows.reduce((a,r)=>a+n(r.occupationLedgerAttributions),0),legacyPeriods:rows.filter(r=>r.accountingEra!=='F1A').length,observedNewPeriods:newRows.length,newAnomalies:bad.length,newNetResidual:bad.reduce((a,r)=>a+n(r.unattributedDelta),0),maxNewResidual:bad.reduce((a,r)=>Math.max(a,Math.abs(n(r.unattributedDelta))),0),foodFlowColumns:cols.length,notes:['legacyOverflowFoodSpent is an explanatory part of otherWithdrawn; never subtract twice','legacy / mixed buckets are excluded from F1A anomaly success counts','occupation-only transaction ledger identity is canonical physical Settlement; stock access rules unchanged']};}
function download(filename,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const oldAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){state(this);return oldAdvance.apply(this,args);};
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const r=oldSerialize.call(this);r.version=VERSION;r.v034f1a={...state(this)};return r;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브입니다.');const w=oldFrom(d.version===VERSION?{...d,version:PREVIOUS}:d);
 const s=OBS.stats(w);if(d.version===VERSION&&d.v034f1a){s.f1a={...d.v034f1a};}
 else{ // On F1/F0 import, preserve old windows as historical evidence.
  s.f1a={startOrdinal:stamp(w),overflowEvents:0,overflowSpent:0,physicalOverflowTiles:0,revision:VERSION};
  if(s.live){s.live.f1aMixed=true;for(const r of Object.values(s.live.groups||{}))r.f1aMixed=true;}
 }return w;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const r=oldJSON.call(this,w);r.version=VERSION;if(r.worldSummary)r.worldSummary.v034f1aAudit=report(w);return r;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f1')||localStorage.getItem('village-observer-v034f0');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F1A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034F1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportF1Diagnostics(w){const r={...NS.V034F1.report(w),version:VERSION,diagnosticsSourceVersion:'V0.34F1'};download(`village-observer-v034F1A-survival-${w.year}y.json`,JSON.stringify(r,null,2),'application/json');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034F1A-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034F1A-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+anomalyCSV(w));}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const fb=document.getElementById('exportSettlementFoodFlowD3ABtn');if(fb)fb.title='F1A 출납 52열 · 레거시 초과비축 계측 및 점령 장부 통합';}
if(NS.UI){const older=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const res=older.apply(this,args);badge();return res;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-15',title:'F1A — 식량 회계 장부 정합성 복구',summary:'실제 초과비축 차감 계측과 임시 점령 타일의 물리적 Settlement 장부 일원화. 식량·전쟁·인구·RNG 수식은 수정하지 않습니다.',sections:[['레거시 초과비축',['원래 실행되는 국가 식량 setter의 실제 재고 감소분만 otherWithdrawn에 기록합니다.','legacyOverflowFoodSpent는 otherWithdrawn의 설명용 부분집합이며 이중 차감하지 않습니다.','기존 초과비축 차감과 분기별 부패 규칙은 그대로 유지합니다.']],['임시 점령',['실제 소유 타일의 Settlement ID로 출납 관측을 귀속합니다.','적군 점령 타일에 대한 공동 재고 접근 제한은 그대로 유지합니다.','소유권·영토 양도·전투 행동에 영향이 없습니다.']],['저장/검증',['F1/F0 세이브를 불러올 수 있습니다.','구버전 및 혼합 Food Flow 기간은 F1A 교정 구간과 구분합니다.','PC ×10 150년 성능 목표는 별도의 장기 실행으로 평가해야 합니다.']]]});
NS.RELEASE_VERSION=VERSION;badge();
NS.V034F1A=Object.freeze({version:VERSION,captureOverflow,recordOverflow,report,enrich,csv,anomalies,anomalyCSV,columns:cols});
})(window.VSim);
