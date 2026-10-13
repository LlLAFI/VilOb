/* V0.34D3B3A — export-only performance and accounting regression diagnostics.
 * No daily scans, simulation RNG, finance, pathing, military state, or inventory mutations.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B3A',PREVIOUS='V0.34D3B3',KEY='village-observer-v034d3b3a';
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const FLOW=NS.V034D3A2,FOOD_COLUMNS=['windowStart','windowEnd','partial','nationName','nationId','settlementId','tileIds','population','openingFood','closingFood','storageDelta','harvestStored','otherDeposited','mealReceived','otherWithdrawn','foodSpoiled','frontierFoodSpent','observedFoodDelta','unattributedDelta','residualClass','topologyChanged'];
function category(v){if(v>0)return 'POSITIVE_UNEXPLAINED';
 const x=-v;
 if(Math.abs(x-2.8)<.011)return 'NEGATIVE_2_8_CANDIDATE';
 if(Math.abs(x-4.2)<.011)return 'NEGATIVE_4_2_CANDIDATE';
 if(Math.abs(x-1.4)<.011)return 'NEGATIVE_1_4_CANDIDATE';
 if(Math.abs(x-.9)<.011)return 'NEGATIVE_0_9_CANDIDATE';
 if(Math.abs(x-10)<.011||Math.abs(x-13)<.011)return 'FRONTIER_AMOUNT_CANDIDATE';
 return 'NEGATIVE_OTHER_UNEXPLAINED';
}
// The underlying Food Flow rows are constructed only at user export/report time.
// Never claim that a numerical resemblance establishes the origin of a debit.
function foodAnomalies(w,limit=Infinity){const result=[],topRows=[],counts={},nationCounts={};let compared=0,skippedTopology=0,skippedPartial=0,totalResidual=0;
 for(const r of FLOW.rows(w)){
  if(r.partial==='ACTIVE'){skippedPartial++;continue;}
  if(r.topologyChanged||r.unattributedDelta==null||!Number.isFinite(Number(r.unattributedDelta))){skippedTopology++;continue;}
  compared++;const delta=Number(r.unattributedDelta);
  if(Math.abs(delta)<=.01)continue;
  const cls=category(delta);counts[cls]=(counts[cls]||0)+1;nationCounts[r.nationName||'?']=(nationCounts[r.nationName||'?']||0)+1;totalResidual+=delta;
  const item={...r,residualClass:cls};
  if(result.length<limit)result.push(item);
  topRows.push(item);if(topRows.length>15){topRows.sort((a,b)=>Math.abs(b.unattributedDelta)-Math.abs(a.unattributedDelta));topRows.pop();}
 }
 const top=topRows.sort((a,b)=>Math.abs(b.unattributedDelta)-Math.abs(a.unattributedDelta)).map(x=>({start:x.windowStart,settlementId:x.settlementId,nation:x.nationName,residual:+n(x.unattributedDelta).toFixed(4),category:x.residualClass}));
 return {compared,mismatched:Object.values(counts).reduce((a,b)=>a+b,0),skippedTopology,skippedPartial,netResidual:+totalResidual.toFixed(6),categories:counts,nations:nationCounts,top,rows:Number.isFinite(limit)?result.slice(0,limit):result};
}
function anomalyCSV(w){const a=foodAnomalies(w);const lines=[FOOD_COLUMNS.join(',')];for(const r of a.rows)lines.push(FOOD_COLUMNS.map(k=>esc(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(','));return lines.join('\n');}
function formationDiagnostics(w){const entries=w?.telemetry?.entries||[],perDay=new Map(),pairCount=new Map(),eventsByType={},top=[];let updates=0,duplicates=0,repeatControl=0;
 for(const e of entries){if(!['FORMATION_TARGET_CHANGED32D','FORMATION_CONTROL_OWNER_CHANGED33G1','FORMATION_TARGET_WRITE_BLOCKED33G1A','POSTWAR_WITHDRAWAL_MOVE33A'].includes(e.type))continue;
  eventsByType[e.type]=(eventsByType[e.type]||0)+1;
  const p=e.payload||{},day=String(e.calendarOrdinalDay24??e.ordinalDay??''),fid=String(p.formationId??'');
  if(e.type==='FORMATION_TARGET_CHANGED32D'){
   updates++;const key=[day,fid,p.fromTarget,p.toTarget,p.reason].join('|');
   if(perDay.has(key)){duplicates++;const value=(pairCount.get(key)||1)+1;pairCount.set(key,value);}
   else{perDay.set(key,1);pairCount.set(key,1);}
  }
  if(e.type==='FORMATION_CONTROL_OWNER_CHANGED33G1'&&((p.from==='POSTWAR_WITHDRAWAL'&&p.to==='PEACETIME')||(p.from==='PEACETIME'&&p.to==='POSTWAR_WITHDRAWAL')))repeatControl++;
 }
 for(const [key,count] of pairCount)if(count>1)top.push({key,count});top.sort((a,b)=>b.count-a.count);
 return {retainedWindowEvents:entries.length,eventsByType,formationTargetUpdates:updates,repeatedIdenticalTargetEvents:duplicates,postwarPeacetimeControlTransitions:repeatControl,topRepeated:top.slice(0,15),scope:'retained detail events only; no assumptions about discarded/aggregated historical detail'};
}
function download(name,body,mime='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const s=oldSerialize.call(this);s.version=VERSION;return s;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('잘못된 저장 파일입니다.');if(data.version===VERSION)return oldFrom({...data,version:PREVIOUS});return oldFrom(data);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const obj=oldJSON.call(this,w);obj.version=VERSION;
 if(obj.worldSummary){const a=foodAnomalies(w,0);obj.worldSummary.v034d3b3aRevision='read-only-residual-csv-and-formation-event-audit';obj.worldSummary.v034d3b3aAudit={food:{compared:a.compared,mismatched:a.mismatched,netResidual:a.netResidual,categories:a.categories,nations:a.nations,top:a.top},formation:formationDiagnostics(w),balanceUnchanged:true,legacySourceUnchanged:true,fullFoodFlowColumns:FLOW.columns.length};}
 return obj;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b3')||localStorage.getItem('village-observer-v034d3b2');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034D3B3A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3B3A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3B3A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3B3A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B3A-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B3A-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B3A-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+FLOW.foodCSV(w));},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034D3B3A-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+anomalyCSV(w));}
};
function syncHeader(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const before=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const res=before.apply(this,args);syncHeader();
 if(typeof document!=='undefined'&&!document.getElementById('exportFoodAnomaliesB3ABtn')){const near=document.getElementById('exportSettlementFoodFlowD3ABtn');if(near){const b=document.createElement('button');b.id='exportFoodAnomaliesB3ABtn';b.textContent='식량 이상 구간 CSV';b.title='미설명 식량 잔차가 ±0.01 초과인 종료된 30일 구간만 출력 · 실제 재고/회계 값 변경 없음';b.addEventListener('click',()=>{try{NS.SaveSystem.exportFoodAnomaliesCSV(this.world);}catch(e){console.error(e);alert(e.message);}});near.insertAdjacentElement('afterend',b);}}
 return res;};}
syncHeader();
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-13',title:'Performance & Food Flow Regression Audit',summary:'장기 자연주행의 미설명 식량 잔차만 경량 CSV로 출력하고, 전후 Formation 목표 반복 이벤트를 진단합니다. B3 최적화와 기존 경제·전쟁·식량 규칙은 변경하지 않습니다.',sections:[
 ['Food Flow 감사',['기존 48열 전체 Food Flow CSV는 유지합니다.','별도 식량 이상 구간 CSV는 종료된 30일 구간의 미설명 잔차 절댓값이 0.01을 초과하는 행만 출력합니다.','-0.9, -1.4, -2.8, -4.2 등의 수치 패턴은 원인 추정용 분류일 뿐 실제 차감 원인으로 확정하지 않습니다.']],
 ['군사 Formation 감사',['최근 상세 Devlog의 같은 날짜·Formation·목표 변경 중복 횟수 및 전후 철수↔평시 제어권 변동을 보고합니다.','전쟁·후퇴·Formation 이동, 제어권 우선순위와 실제 대상 설정은 수정하지 않습니다.']],
 ['검증 범위',['B2·B3·B3A 동일 상태 성능 및 짧은 결정론 회귀를 지원합니다.','C1H 보호 소스 169개와 Snapshot V2 1,683열, Food Flow 48열 유지.','전체 PC 75년 자연주행 성능 회귀율은 별도 통제 실험이 필요합니다.']]
]});
NS.RELEASE_VERSION=VERSION;
NS.V034D3B3A=Object.freeze({version:VERSION,foodAnomalies,anomalyCSV,formationDiagnostics,columns:FOOD_COLUMNS});
})(window.VSim);
