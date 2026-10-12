/* V0.34D3B2 — V24 physical food accounting + build release integrity.
 * Observation-only: no changes to food, Gold, RNG, labor, frontier eligibility.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B2',PREV='V0.34D3B1',KEY='village-observer-v034d3b2';
const D=NS.V034D3,H=NS.V034D3A,A1=NS.V034D3A1,A2=NS.V034D3A2;
const metric=new WeakMap(),eps=1e-7;
function stats(w){let r=metric.get(w);if(!r){r={regionalStarts:0,regionalRequested:0,regionalPhysicalSpent:0,regionalMismatchCount:0,regionalMismatchTotal:0,regionalByCost:{},migrationFromB1:false};metric.set(w,r);}return r;}
function frontierBefore(v,w,sourceId){
 if(!v||!w)return null;
 // Open the 30-calendar-day accounting bucket for *every* existing physical
 // stock owner before a nation-wide food setter may draw across tile stores.
 // A later H.addMetric should never take its opening snapshot after the sink.
 for(const id of v.territory)H.ensureRow(w,v,id);
 return A1.frontierBefore(v,w);
}
function frontierAfter(v,w,before,requested,projectId){
 if(!Array.isArray(before)||!v||!w)return 0;
 const paid=A1.frontierAfter(v,w,before),s=stats(w),wanted=Number(requested)||0;
 s.regionalStarts++;s.regionalRequested+=wanted;s.regionalPhysicalSpent+=paid;
 s.regionalByCost[String(wanted)]=(s.regionalByCost[String(wanted)]||0)+1;
 if(Math.abs(paid-wanted)>eps){s.regionalMismatchCount++;s.regionalMismatchTotal+=paid-wanted;}
 return paid;
}
// Read-only residual classification. These are *not* fictitious accounting
// corrections: unresolved rows remain unresolved in the original 48-column CSV.
function residualAudit(w){
 const totals={comparable:0,mismatched:0,residualSum:0,negativeExact10:0,negativeExact13:0,negativeMultiple10:0,negativeMultiple13:0,otherNegative:0,positive:0,maxAbs:0};
 for(const r of A2.rows(w)){
  if(r.topologyChanged||!Number.isFinite(Number(r.unattributedDelta)))continue;
  const d=Number(r.unattributedDelta);totals.comparable++;
  if(Math.abs(d)<=.01)continue;
  totals.mismatched++;totals.residualSum+=d;totals.maxAbs=Math.max(totals.maxAbs,Math.abs(d));
  if(d>0){totals.positive++;continue;}
  if(Math.abs(d+10)<.01)totals.negativeExact10++;
  else if(Math.abs(d+13)<.01)totals.negativeExact13++;
  else if(d< -10&&Math.abs(d/10-Math.round(d/10))<.001)totals.negativeMultiple10++;
  else if(d< -13&&Math.abs(d/13-Math.round(d/13))<.001)totals.negativeMultiple13++;
  else totals.otherNegative++;
 }
 totals.residualSum=+totals.residualSum.toFixed(6);totals.maxAbs=+totals.maxAbs.toFixed(6);
 return totals;
}
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;d.v034d3b2={revision:'regional-frontier-food-audit-and-release-identity-v1',stats:{...stats(this)}};return d;};
NS.World.from=function(data){
 // Delegate historical versions to B1's existing migration policy.
 const w=prevFrom(data?.version===VERSION?{...data,version:PREV}:data);
 metric.set(w,data.version===VERSION?{...stats(w),...(data.v034d3b2?.stats||{})}:{...stats(w),migrationFromB1:data.version===PREV});
 return w;
};
const priorJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=priorJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d3b2Revision='v24-regional-physical-food-audit-and-release-identity';d.worldSummary.v034d3b2Audit={...stats(w),foodFlowColumns:A2.columns.length,physicalStocksAudited:true,balancePolicyUnchanged:true,residuals:residualAudit(w),residualClassification:'observation-only; historical windows are not retroactively changed'};}return d;};
function download(name,data,type='application/json'){
 const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const x=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b1')||localStorage.getItem('village-observer-v034d3b');return x?NS.World.from(JSON.parse(x)):null;},
 export(w){download(`village-observer-v034D3B2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B2-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B2-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B2-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B2-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B2-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+A2.foodCSV(w),'text/csv;charset=utf-8');}
};
function syncReleaseHeader(){
 if(typeof document==='undefined')return;
 document.title='Village Observer '+VERSION;
 const el=document.getElementById('versionBadge');if(el)el.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';
}
NS.RELEASE_VERSION=VERSION;
if(NS.UI){const prevHead=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const out=prevHead.apply(this,args);syncReleaseHeader();return out;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Food Flow Accounting & Release Integrity',summary:'V24 지역 개척 착공 시 실제로 소비된 식량을 기존 Food Flow 수지에 정확히 한 번 반영하고 좌상단 버전 표시를 V0.34D3B2로 바로잡습니다. 경제·전쟁·개척 밸런스는 그대로 유지됩니다.',sections:[
 ['V24 개척 착공 식량 회계',['2명/3명 지역 개척의 실제 식량 비용 10/13을 물리 타일별 사전·사후 재고 차이로 계측합니다.','기존 Food Flow 48열의 frontierFoodSpent를 이용하며 진행 유지비와 사고비는 다시 계상하지 않습니다.','개척 실패·결제 실패는 식량 차감을 발생시키지 않으므로 신규 착공 계측도 수행되지 않습니다.']],
 ['정확성·진단',['Devlog의 v034d3b2Audit에 지역 개척 착공 횟수·실제 지출량·요청량·불일치를 기록합니다.','기존 D3A2 저장에 남은 과거 누락은 소급하여 임의 수정하지 않습니다.','개척 비용과 무관한 잔차는 추가 원인 조사가 필요하며 자동으로 숨기거나 보정하지 않습니다.']],
 ['릴리스 버전 통일',['Hosted/Standalone의 초기 타이틀과 버전 배지를 빌드 버전으로 설정합니다.','최종 부트스트랩 로딩 직후, 새 세계 및 불러오기 렌더링에서 버전 배지를 재확인합니다.','버전 메타데이터·파일 이름·README·빌드 결과를 V0.34D3B2로 연결합니다.']]
]});
// D3A historically rendered during its own bootstrap, before B/B1 wrappers existed.
// Re-render the *final* wrapped header only after every bootstrap is installed.
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D3B2 initial release header',e);}
syncReleaseHeader();
NS.V034D3B2=Object.freeze({version:VERSION,frontierBefore,frontierAfter,stats,residualAudit,syncReleaseHeader});
})(window.VSim);
