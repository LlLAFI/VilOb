/* Village Observer V0.34F1A1 — CSV Export and Local Parity Stabilization.
 * Absolutely no Person, food, AI, military or RNG changes.
 * Correct 52-column Food Flow / 13-column Anomaly CSV row assembly.
 */
(function(NS){'use strict';
const VERSION='V0.34F1A1',PREVIOUS='V0.34F1A',KEY='village-observer-v034f1a1';
const A=NS.V034F1A;
if(!A||!NS.World||!NS.SaveSystem)throw Error('F1A baseline missing');
const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const ROW_COLUMNS=A.columns;
const ANOMALY_COLUMNS=['windowStart','windowEnd','nationName','settlementId','tileIds','accountingEra','storageDelta','observedFoodDelta','legacyOverflowFoodSpent','occupationLedgerAttributions','unattributedDelta','residualClass','topologyChanged'];
function asCSV(columns,rows){const lines=[columns.join(',')];for(const r of rows){lines.push(columns.map(k=>quote(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(','));}return lines.join('\r\n')+'\r\n';}
function foodCSV(w){return asCSV(ROW_COLUMNS,A.enrich(w));}
function anomaliesCSV(w){return asCSV(ANOMALY_COLUMNS,A.anomalies(w));}
function download(name,data,mime='text/csv;charset=utf-8'){
 const url=URL.createObjectURL(new Blob([data],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=prevSerialize.call(this);data.version=VERSION;return data;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('잘못된 세이브입니다.');return prevFrom(data.version===VERSION?{...data,version:PREVIOUS}:data);};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const data=prevToJSON.call(this,w);data.version=VERSION;if(data.worldSummary?.v034f1aAudit)data.worldSummary.v034f1aAudit={...data.worldSummary.v034f1aAudit,version:VERSION};return data;};
const beforeSave=NS.SaveSystem;
NS.SaveSystem={...beforeSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f1a')||localStorage.getItem('village-observer-v034f1')||localStorage.getItem('village-observer-v034f0');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F1A1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034F1A1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034F1A1-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+foodCSV(w));},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034F1A1-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+anomaliesCSV(w));}
};
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const el=document.getElementById('exportSettlementFoodFlowD3ABtn');if(el)el.title='F1A1 정상 52열 CSV · F1A 식량 회계 규칙 유지';}
if(NS.UI){const prevRender=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=prevRender.apply(this,args);mark();return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-15',title:'F1A1 — Food Flow CSV 출력 정상화',summary:'Food Flow 52열·이상 CSV 13열의 문자 단위 줄바꿈 회귀를 수정. F1A 식량 출납·전쟁·신진대사·RNG는 보존.',sections:[['CSV 수정',['헤더 1행과 데이터 1건당 1행을 보장합니다.','값의 쉼표·큰따옴표·줄바꿈은 RFC 4180 방식으로 이스케이프하고 CRLF를 사용합니다.','이전 F1A Food Flow 계산 및 이상 판정 기준은 변경하지 않습니다.']],['로컬 세이브 검증',['큰 세이브를 서버에 제출할 필요 없이 PC 브라우저에서 F1↔F1A1 비교 도구를 실행할 수 있습니다.','구버전 F1·F1A·F0 세이브 로드를 유지합니다.','동일 세이브와 통제된 난수로 30~180일 결과를 비교하며 150년 성능 달성과는 별개입니다.']]]});
NS.RELEASE_VERSION=VERSION;mark();
NS.V034F1A1=Object.freeze({version:VERSION,csv:foodCSV,anomalyCSV:anomaliesCSV,serializeCSV:asCSV,columns:ROW_COLUMNS,anomalyColumns:ANOMALY_COLUMNS});
})(window.VSim);
