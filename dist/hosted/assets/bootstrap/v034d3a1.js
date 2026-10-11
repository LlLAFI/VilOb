/* Village Observer V0.34D3A1 — real calendar month + audited direct food sinks. */
(function(NS){'use strict';
const VERSION='V0.34D3A1',PREVIOUS='V0.34D3A',KEY='village-observer-v034d3a1';
const H=NS.V034D3A,D=NS.V034D3,num=x=>Number.isFinite(Number(x))?Number(x):0;
const stats=new WeakMap();
function note(w,k,x){let z=stats.get(w);if(!z){z={spoilageCalls:0,frontierStarts:0,frontierPhysicalSpent:0,spoilagePhysicalSpent:0,convertedD3ASave:false};stats.set(w,z);}z[k]=(z[k]||0)+x;return z;}
function spoilage(w,v,id,amount){if(amount>0){H.stats(w);/* Incur a direct physical sink at its owning tile, without withdrawals. */
  H.addMetric(w,v,id,'foodSpoiled',amount);note(w,'spoilageCalls',1);note(w,'spoilagePhysicalSpent',amount);}}
function frontierBefore(v,w){return [...v.territory].map(id=>({id,stock:D.stockRaw(w,id,'food')}));}
function frontierAfter(v,w,before){let total=0;for(const r of before||[]){const after=D.stockRaw(w,r.id,'food'),spent=r.stock-after;if(spent>1e-7){H.addMetric(w,v,r.id,'frontierFoodSpent',spent);total+=spent;}}
  if(total>1e-7){note(w,'frontierStarts',1);note(w,'frontierPhysicalSpent',total);}return total;}
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;d.v034d3a1={revision:'calendar-food-audit-v1',directSinkStats:stats.get(this)||{},periodCalendarDays:30,originalD3AWindowsMigrated:false};return d;};
NS.World.from=function(data){if(data?.version!==VERSION&&data?.version!==PREVIOUS)throw Error(VERSION+' 또는 V0.34D3A 저장 파일만 지원합니다.');const fromPrevious=data.version===PREVIOUS;const w=prevFrom({...data,version:PREVIOUS});const s=H.stats(w);if(fromPrevious){/* 90-calendar-day legacy observations cannot be losslessly split into 30-day periods. */s.windows=[];s.live=null;s.lastBucket=null;s.startedOrdinal=num(w.calendarOrdinalDay());s.periods=0;note(w,'convertedD3ASave',1);}else{stats.set(w,data.v034d3a1?.directSinkStats||{});}return w;};
function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const d=localStorage.getItem(KEY);return d?NS.World.from(JSON.parse(d)):null;},
 export(w){download(`village-observer-v034D3A1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3A1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3A1-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3A1-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3A1-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3A1-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3A1-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+H.foodCSV(w));}};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d3a1Revision='actual-calendar-30day-food-sinks-and-topology-audit';d.worldSummary.v034d3a1Audit={...(stats.get(w)||{}),periodCalendarDays:30,foodFlowColumns:H.columns.length,uniqueFoodFlowColumns:new Set(H.columns).size,d3Audit:D.audit(w).ok,d2aAudit:NS.V034D2A.audit(w).ok};}return d;};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const out=oldHead.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementFoodFlowD3ABtn');if(btn){btn.textContent='Food Flow 30일 CSV';btn.title='D3A1 실제 달력 30일 식량 수지 · 직접 부패/개척 비용 · '+H.columns.length+'개 고유 열';}}return out;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Food Flow Calendar & Audit Hotfix',summary:'식량 수지를 실제 30달력일 단위로 집계하고, 중복 CSV 열을 제거하며 부패와 개척 식량 비용을 실제 물리 차감 기준으로 기록합니다. Settlement 구성 변경은 미설명 손실로 오판하지 않습니다.',sections:[['달력·CSV',['기존 30 경제주기(약 90달력일) 집계를 실제 30달력일로 수정했습니다.','중복된 harvestRequested CSV 열을 제거하고 부패 및 개척 식량비 열을 추가했습니다.']],['직접 식량 차감',['창고 식량 부패는 물리 타일별 실제 감소량을 별도 집계합니다.','개척 비용은 실제 식량 재고 차감을 비용 타일에 계측합니다.','Settlement 합병·분할이 포함된 관측 창의 미설명 수지는 판정 보류로 표시합니다.']],['밸런스 유지',['자연회복·농업 효율·식량 소비·부패율·개척 비용 수치는 변경하지 않습니다.']]]});
NS.V034D3A1=Object.freeze({version:VERSION,spoilage,frontierBefore,frontierAfter,stats:w=>stats.get(w)||{},audit:w=>({ok:D.audit(w).ok&&NS.V034D2A.audit(w).ok,calendar30:true,uniqueColumns:new Set(H.columns).size===H.columns.length})});
})(window.VSim);
