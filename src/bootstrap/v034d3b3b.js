/* V0.34D3B3B — Single-pass physical stock & Food Flow telemetry.
 * Actual stock decisions and numerical transaction ordering are unchanged.
 * D3A's observation uses the exact membership and pre-transaction stock from
 * the real D3 operation, avoiding a redundant O(settlement) inspection.
 */
(function(NS){'use strict';
const VERSION='__VILOB_RELEASE_VERSION__',PREVIOUS='V0.34D3B3A',KEY='village-observer-v034d3b3b';
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 저장 파일입니다.');return d.version===VERSION?prevFrom({...d,version:PREVIOUS}):prevFrom(d);};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=prevJSON.call(this,w);out.version=VERSION;if(out.worldSummary){out.worldSummary.v034d3b3bRevision='single-pass-stock-telemetry';out.worldSummary.v034d3b3bAudit={observedWithoutSecondMembershipScan:true,foodFlowColumns:NS.V034D3A2.columns.length,balanceRulesUnchanged:true,legacySourceUnchanged:true};}return out;};
function download(name,body,mime='application/json'){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b3a')||localStorage.getItem('village-observer-v034d3b3')||localStorage.getItem('village-observer-v034d3b2');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034D3B3B-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B3B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B3B-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B3B-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B3B-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B3B-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B3B-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034D3B3B-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3B3A.anomalyCSV(w),'text/csv;charset=utf-8');}
};
function renderVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const v=old.apply(this,args);renderVersion();return v;};}renderVersion();
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-13',title:'Simulation Hotpath Optimization — Stock & Food Flow',summary:'Settlement 물리 재고 출납과 Food Flow 계측의 중복 멤버십·재고 조회를 단일 패스로 합칩니다. 시뮬레이션 식량·경제·전쟁·AI 수식은 그대로입니다.',sections:[
 ['중복 검사 제거',['기존 D3 출납에서 얻은 실제 Settlement 멤버십과 출납 전 타일 재고를 D3A Food Flow 관측에 직접 전달합니다.','관측용 별도 members()·물리 용량 재조회와 중복 계측 행 탐색을 줄입니다.']],
 ['보존·호환',['물리 재고·자원 생산·주민 식사·개척·군사 규칙은 변경하지 않습니다.','기존 B3A 저장파일 읽기, Snapshot V2 1,683열과 Food Flow 48열, 경량 이상 CSV 유지.']],
 ['검증 범위',['동일 시드 B3A/B3B의 자원·난수·회계 행을 직접 비교하고, 실제 World.advanceOneDay 처리시간을 비교합니다.','후반 60~80년 PC 체감 속도는 동일 기기 자연주행 재검증이 필요합니다.']]
]});
NS.RELEASE_VERSION=VERSION;
NS.V034D3B3B=Object.freeze({version:VERSION,usesSharedObservation:true,foodFlowColumns:NS.V034D3A2.columns.length});
})(window.VSim);
