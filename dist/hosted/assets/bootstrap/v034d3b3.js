/* V0.34D3B3 — hot-path optimization + behavior-preserving diagnostics.
 * D3 member lookups & food accounting batching are implemented in the two
 * unprotected bootstraps v034d3.js / v034d3a.js, not in legacy source blocks.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B3',PREVIOUS='V0.34D3B2',KEY='village-observer-v034d3b3';
const stats=new WeakMap();
function performanceStats(w){let r=stats.get(w);if(!r){r={dayAdvances:0,totalAdvanceMs:0,lastAdvanceMs:0,maxAdvanceMs:0};stats.set(w,r);}return r;}
// Explicitly optional sampling, OFF by default, so everyday simulation has
// no extra timers. The ordinary V26 profiler remains the performance baseline.
let sample=false;
const previousAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){if(!sample)return previousAdvance.apply(this,args);const t=performance.now();try{return previousAdvance.apply(this,args);}finally{const ms=performance.now()-t,s=performanceStats(this);s.dayAdvances++;s.totalAdvanceMs+=ms;s.lastAdvanceMs=ms;s.maxAdvanceMs=Math.max(s.maxAdvanceMs,ms);}};
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 Village Observer 저장 파일입니다.');const old={...d,version:d.version===VERSION?PREVIOUS:d.version};if(!['V0.34D3B3',PREVIOUS,'V0.34D3B1','V0.34D3B','V0.34D3A2','V0.34D3A1','V0.34D3A'].includes(d.version))throw Error('D3B3 또는 호환되는 D3 계열 저장 파일만 지원합니다.');return prevFrom(old);};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevToJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d3b3Revision='hotpath-membership-foodflow-batching-v1';d.worldSummary.v034d3b3Performance={samplingEnabled:sample,...performanceStats(w),legacySourceUnchanged:true,simulationBalanceUnchanged:true};}return d;};
function download(name,body,mime='application/json'){const u=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const str=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b2')||localStorage.getItem('village-observer-v034d3b1')||localStorage.getItem('village-observer-v034d3b');return str?NS.World.from(JSON.parse(str)):null;},
 export(w){download(`village-observer-v034D3B3-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B3-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B3-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B3-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B3-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B3-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');}
};
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const ret=prev.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}return ret;};}
if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Performance Regression Optimization V1',summary:'다중 타일 정착지의 물리 멤버십 배열 재생성 및 국가 전체 주민 재탐색을 줄이고, 식량 계측을 거래 단위로 묶어 후반부 성능을 개선합니다. 경제·AI·군사·식량 수치는 변경하지 않습니다.',sections:[
 ['Settlement Hot Path',['동일 Settlement 구성 타일 조회를 재사용하되 실제 소유권·점령 상태는 매 호출 검증합니다. 합병·분할 후에는 즉시 새 배열을 사용합니다.','식량 비축일 분모는 기존 V26 살아있는 주민 인덱스를 활용하여 해당 Settlement 거주자만 순회합니다.']],
 ['Food Flow 계측',['수확 한 건의 7개 회계 항목과 입고 한 건의 3~4개 항목을 한 번의 실제 정착지 행 조회로 기록합니다.','회계 수치·CSV 48열·미설명 잔차 처리 규칙과 개척비 지출을 유지합니다.']],
 ['범위·검증',['C1H 레거시 원본 169개 파일의 해시와 모든 밸런스 상수 유지.','성능 샘플링은 기본 OFF이며 명시적으로 켜는 경우에만 고해상도 시간을 측정합니다.','B2 저장 파일을 불러올 수 있고 PC/모바일 Hosted/Standalone 빌드를 유지합니다.']]
]});
NS.RELEASE_VERSION=VERSION;
NS.V034D3B3=Object.freeze({version:VERSION,samplingEnabled:()=>sample,setSampling:v=>{sample=!!v;},stats:performanceStats});
})(window.VSim);
