/* V0.34D3B1 — Road-Connected Settlement Radius 2 / compact frontier preference.
   C1H protected code is transformed only at verified build anchors.
   No changes to road speed, military paths, physical stock flows or jobs. */
window.VSim=window.VSim||{};
(function(NS){'use strict';
const VERSION='V0.34D3B1',PREV='V0.34D3B',KEY='village-observer-v034d3b1';
const RADIUS=2,CAP=13,JOIN=1.24,SPLIT=1.40,PRIORITY=14;
const n=x=>Number(x||0),same=(a,b)=>String(a)===String(b);
const manhattan=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function isRoad(w,v,t){const i=t?.buildings?.indexOf('road')??-1;return i>=0&&n(t.buildingCondition?.[i]??100)>=25&&!!v?.hasTech?.('ROADS');}
function step(w,v,t,plannedRoad=false){const terrain=NS.TERRAIN?.[t?.terrain];if(!terrain?.passable)return Infinity;return n(terrain.tradeCost||1)*((plannedRoad||isRoad(w,v,t))?.62:1);}
function candidateExtension(v,w,c){
 if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.candidateExtension(v,w,c);
 // Potential road on a *neutral* target is only a score estimate; no road is
 // constructed for free. Actual C mergers still require physical roads.
 const t=c?.tile||w?.map?.get?.(n(c?.targetTileId??c?.tileId));
 if(!t||t.ownerId!=null||!v?.hasTech?.('ROADS')||!NS.V034C)return null;
 let best=null;
 for(const adj of w.map.neighbors4(t.id)){
  if(!same(adj.ownerId,v.id))continue;
  const r=NS.V034C.byTile(w,adj.id);if(!r||r.lifecycle!=='ACTIVE'||r.tileIds.length>=CAP)continue;
  const core=w.map.get(r.coreTileId);if(!core||manhattan(core,t)>RADIUS)continue;
  const allowed=new Set(r.tileIds);
  const outward=NS.V034C.path(w,core.id,adj.id,allowed,JOIN),returning=NS.V034C.path(w,adj.id,core.id,allowed,JOIN);
  const targetStep=step(w,v,t,true),backStep=step(w,v,adj);
  if(outward+targetStep>JOIN+1e-8||returning+backStep>JOIN+1e-8)continue;
  const row={settlementId:r.id,coreTileId:r.coreTileId,sourceTileId:adj.id,targetTileId:t.id,tilesAfter:r.tileIds.length+1,
   projectedOut:+(outward+targetStep).toFixed(3),projectedReturn:+(returning+backStep).toFixed(3)};
  if(!best||r.tileIds.length>best.tilesAfter-1||r.tileIds.length===best.tilesAfter-1&&String(r.id)<String(best.settlementId))best=row;
 }
 return best;
}
const previousPick=NS.V033F5A2?.selectAffordableCandidate;
if(previousPick)NS.V033F5A2.selectAffordableCandidate=function(v,w,rows,opts={}){
 // Only reorder plausible compact additions. Keep all fiscal/food/pioneer
 // feasibility and profile behavior in the inherited selector.
 let adjusted=null;
 for(const row of rows||[]){const ext=candidateExtension(v,w,row);if(!ext){if(adjusted)adjusted.push(row);continue;}
  if(!adjusted)adjusted=(rows||[]).slice(0,(rows||[]).indexOf(row));
  adjusted.push({...row,score:n(row.score)+PRIORITY,v034d3b1Extension:ext});
 }
 if(adjusted){adjusted.sort((a,b)=>n(b.score)-n(a.score));return previousPick.call(this,v,w,adjusted,opts);}
 return previousPick.call(this,v,w,rows,opts);
};
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;d.v034d3b1={revision:'road-radius-two-and-compact-frontier-v1',join:JOIN,split:SPLIT,maxTiles:CAP,range:RADIUS};return d;};
NS.World.from=function(d){if(d?.version===VERSION)return prevFrom({...d,version:PREV});return prevFrom(d);};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevToJSON.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{},
 {v034d3b1Revision:'road-connected-settlement-radius-two-and-compact-frontier',v034d3b1Policy:{maxTiles:CAP,coreManhattanRadius:RADIUS,joinCost:JOIN,splitCost:SPLIT,roadFactor:0.62,compactFrontierScoreBonus:PRIORITY,physicalRoadsRequired:true,landedFrontierRoadsNotFree:true}});return d;};
function download(name,text,mime='application/json'){const url=URL.createObjectURL(new Blob([text],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const txt=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b')||localStorage.getItem('village-observer-v034d3a2');return txt?NS.World.from(JSON.parse(txt)):null;},
 export(w){download(`village-observer-v034D3B1-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B1-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B1-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B1-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B1-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B1-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');}
};
if(NS.UI){const before=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=before.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}return r;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Road-Connected Settlement Radius 2',summary:'도로로 연결된 평지 기준으로 중심 정착지에서 최대 2칸·13타일까지 통합하고, 기존 Settlement와 연결할 수 있는 개척 후보에 제한적인 우선순위를 부여합니다.',sections:[
 ['도로 통합 범위',['병합 접근비 1.00→1.24, 분할 완충 1.15→1.40, 최대 구성 5→13타일.','중심에서 맨해튼 거리 2칸 이내만 통합할 수 있습니다. 중심 포함 1+4+8=13타일의 마름모가 최댓값입니다.','실제 물리 도로(ROADS 기술, 도로 상태 25 이상)를 통해 접근비 1.24 이하가 충족되어야 합니다. 도로 계수 0.62와 군사/교역 이동 규칙은 그대로입니다.']],
 ['개척 연속성',['기존 Settlement에 추가 가능한 인접 타일은 물리 도로 완공 이후 통합될 수 있으므로, 사전 개척 후보 평가에 최대 +14점만 부여합니다.','가상 도로·자원·노동·영토를 생성하지 않습니다. 실제 개척 인원, 비용, 식량 게이트 및 국가별 AIProfile 차이는 기존대로 유지합니다.']],
 ['검증·호환성',['기존 V0.34D3B 저장을 새로운 설정에서 불러오며 기존 영토·인구·자원을 유지합니다.','B1 저장은 Settlement 최대 13타일·중심 반경 2칸을 검증합니다. 이전 버전 세이브는 각 버전 기준을 사용합니다.','기존 식량·Gold 회계, 공동 물자·주거 모델은 변경하지 않습니다.']]
]});
NS.V034D3B1=Object.freeze({version:VERSION,policy:{CAP,RADIUS,JOIN,SPLIT,PRIORITY},candidateExtension});
})(window.VSim);
