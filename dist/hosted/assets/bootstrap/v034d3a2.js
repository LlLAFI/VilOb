/* Village Observer V0.34D3A2 — physical frontier food upkeep and supply-accident audit.
 * Only observation changes: no material, Gold, AI, or RNG mutations.
 */
(function(NS){'use strict';
const VERSION='V0.34D3A2',PREVIOUS='V0.34D3A1',KEY='village-observer-v034d3a2';
const H=NS.V034D3A,D=NS.V034D3;
const keys=['frontierFoodUpkeep','frontierFoodAccident'];
const map=new WeakMap();
const n=x=>Number.isFinite(Number(x))?Number(x):0;
function stats(w){let s=map.get(w);if(!s){s={upkeepEvents:0,accidentEvents:0,upkeepPhysicalSpent:0,accidentPhysicalSpent:0,upkeepRequested:0,accidentRequested:0,otherSaveMigrated:false};map.set(w,s);}return s;}
function ensure(w){const s=H.stats(w);s.total=s.total||{};for(const k of [...keys,'frontierFoodSpent'])if(!Number.isFinite(s.total[k]))s.total[k]=0;return s;}
function frontierBefore(v,w,sourceTileId){
 if(!v||!w)return null;
 ensure(w);
 // Open the calendar bucket BEFORE the physical mutation, even for an otherwise idle tile.
 const target=Number.isFinite(Number(sourceTileId))?Number(sourceTileId):Number(v.coreTileId);
 if(w.map.get(target))H.ensureRow(w,v,target);
 return [...v.territory].map(id=>({id:Number(id),stock:D.stockRaw(w,id,'food')}));
}
function frontierAfter(v,w,before,kind,requested,projectId){
 if(!Array.isArray(before)||!w||!v)return 0;
 const m=kind==='accident'?'frontierFoodAccident':'frontierFoodUpkeep';
 const x=stats(w),t=Math.max(0,n(requested));
 x[kind==='accident'?'accidentEvents':'upkeepEvents']++;
 x[kind==='accident'?'accidentRequested':'upkeepRequested']+=t;
 let total=0;
 // Record real tile withdrawals, never charge a forecast as though it was spent.
 for(const it of before){const used=it.stock-D.stockRaw(w,it.id,'food');if(used>1e-8){
  H.addMetric(w,v,it.id,m,used);
  // Preserve the legacy D3A1 observed-food equation: charge this sink once.
  H.addMetric(w,v,it.id,'frontierFoodSpent',used);
  total+=used;
 }}
 x[kind==='accident'?'accidentPhysicalSpent':'upkeepPhysicalSpent']+=total;
 return total;
}
function columns(){return [...H.columns.slice(0,H.columns.indexOf('frontierFoodSpent')+1),...keys,...H.columns.slice(H.columns.indexOf('frontierFoodSpent')+1)];}
const cols=columns();
function rows(w){ensure(w);return H.rows(w).map(r=>({...r,frontierFoodUpkeep:n(r.frontierFoodUpkeep),frontierFoodAccident:n(r.frontierFoodAccident)}));}
const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
function foodCSV(w){return [cols.join(','),...rows(w).map(r=>cols.map(k=>esc(k==='tileIds'?r.tileIds.join('|'):r[k])).join(','))].join('\n');}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this);out.version=VERSION;out.v034d3a2={revision:'frontier-food-physical-upkeep-accident-v1',stats:stats(this),columns:cols.length};return out;};
NS.World.from=function(data){if(data?.version!==VERSION&&data?.version!==PREVIOUS&&data?.version!=='V0.34D3A')throw Error(VERSION+' 또는 D3A1/D3A 저장 파일만 지원합니다.');
 const migrated=data.version!==VERSION;
 const w=oldFrom({...data,version:data.version==='V0.34D3A'?'V0.34D3A':PREVIOUS});
 map.set(w,migrated?{...stats(w),otherSaveMigrated:true}:(data.v034d3a2?.stats||stats(w)));
 ensure(w);return w;};
function download(name,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const txt=localStorage.getItem(KEY);return txt?NS.World.from(JSON.parse(txt)):null;},
 export(w){download(`village-observer-v034D3A2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3A2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3A2-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3A2-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3A2-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3A2-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3A2-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+foodCSV(w));}
};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJSON.call(this,w);d.version=VERSION;const f=d.worldSummary?.v034d3aFoodFlow;if(f){f.total={...f.total,frontierFoodUpkeep:n(ensure(w).total.frontierFoodUpkeep),frontierFoodAccident:n(ensure(w).total.frontierFoodAccident)};
  f.latestPeriods=(f.latestPeriods||[]).map(win=>({...win,rows:win.rows.map(r=>({...r,frontierFoodUpkeep:n(r.frontierFoodUpkeep),frontierFoodAccident:n(r.frontierFoodAccident)}))}));}
 if(d.worldSummary){d.worldSummary.v034d3a2Revision='physical-frontier-food-sink-audit';d.worldSummary.v034d3a2Audit={...stats(w),foodFlowColumns:cols.length,uniqueFoodFlowColumns:new Set(cols).size,frontierFoodSpentTotal:n(ensure(w).total.frontierFoodSpent),frontierFoodUpkeep:n(ensure(w).total.frontierFoodUpkeep),frontierFoodAccident:n(ensure(w).total.frontierFoodAccident),previousFrontierStartCost:n(NS.V034D3A1.stats(w).frontierPhysicalSpent),stockAudit:D.audit(w).ok};}
 return d;};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const o=oldHeader.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementFoodFlowD3ABtn');if(btn){btn.textContent='Food Flow 30일 CSV';btn.title='D3A2 개척 유지·사고 식량 회계 포함 · '+cols.length+'개 고유 열';}}return o;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Frontier Food Accounting Hotfix',summary:'개척 진행 중 식량 유지비와 보급 사고의 실제 재고 감소량을 30달력일 Food Flow 수지에 포함합니다. 개척 정책·식량 밸런스는 변경하지 않습니다.',sections:[['식량 수지',['V0.20 개척 유지비의 실제 물리 재고 감소량을 추적합니다.','V0.20 보급 사고의 추가 식량 소모를 별도로 기록합니다.','기존 개척 착공 비용·부패 비용과 중복 합산하지 않습니다.']],['호환성·검증',['Food Flow CSV 48개 고유 열. 기존 4개 CSV는 변경하지 않습니다.','기존 D3A1/D3A 저장은 수동 JSON 불러오기 경로로 지원합니다.','식량 생산·소비·개척 사고 확률과 난수 사용은 변경하지 않습니다.']]]});
NS.V034D3A2=Object.freeze({version:VERSION,frontierBefore,frontierAfter,foodCSV,columns:cols,rows,stats,audit:w=>({ok:D.audit(w).ok,upkeep:n(ensure(w).total.frontierFoodUpkeep),accidents:n(ensure(w).total.frontierFoodAccident),columns:cols.length,unique:new Set(cols).size})});
})(window.VSim);
