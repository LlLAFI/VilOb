/* V0.34G3 — Settlement Evolution + crisis-aware physical food relief.
 * Spatial geometry: Euclidean circle AND bidirectional real traversable path.
 * Relief: only imminent starvation may reach a guarded lower floor (18 cycles).
 * No new food / no relaxed transport conservation / no RNG.
 */
(function(NS){'use strict';
const VERSION='V0.34G3',PREV='V0.34G2A',KEY='village-observer-v034g3',EPS=1e-8;
const config={spatialEnabled:true,foodEnabled:true};
const same=(a,b)=>String(a)===String(b), num=x=>Number.isFinite(Number(x))?Number(x):0;
let observationDepth=0;
function observe(read){observationDepth++;try{return read();}finally{observationDepth--;}}
const metrics=new WeakMap(),snap=w=>{let m=metrics.get(w);if(!m){m={policies:0,pathSweeps:0,expandedTier3:0,expandedTier4:0,reliefPlans:0,imminentPlans:0,imminentRejected:0,emergencyQty:0,emergencyShipments:0};metrics.set(w,m);}return m;};
// Stable maximum footprint grows with actual developed population and buildings.
// The tier is derived from current physical settlements; mergers may use pooled
// prospective population, so expansion beyond old 13 tiles becomes attainable.
function policy(w,ids,core){
 const c=w.map.get(Number(core));if(!c)return {radius:0,cap:0,join:0,split:0,tier:0};
 const allowed=new Set(ids.map(Number));let built=0,pop=0;
 for(const id of allowed){const t=w.map.get(id);if(!t||!same(t.ownerId,c.ownerId))continue;built+=(t.buildings||[]).filter(b=>b!=='road'&&b!=='outpost').length;}
 const v=w.villages?.find(v=>same(v.id,c.ownerId));
 if(v){for(const p of v.residents||[]){if(p.alive!==false&&allowed.has(Number(p.homeTileId)))pop++;}}
 const computedTier=pop>=30&&built>=6?4:pop>=12&&built>=2?3:2;
 const record=w.v34b?.settlements?.find(r=>r.lifecycle==='ACTIVE'&&r.coreTileId===Number(core)&&same(r.nationId,c.ownerId));
 const tier=Math.max(computedTier,num(record?.v034g3MaxTier||2));
 if(!observationDepth){const m=snap(w);m.policies++;if(tier===3)m.expandedTier3++;if(tier===4)m.expandedTier4++;}
 const radius=tier,cap=tier===4?49:tier===3?29:13;
 // Conservative travel windows: roads contribute 0.62 each while terrain is
 // authoritative. Both constraints expand; circle is never implied by path.
 const join=tier===4?4.34:tier===3?3.10:1.24;
 return {radius,cap,join,split:join+(tier===2?.16:.35),tier,pop,built};
}
function promote(w,r){const p=policy(w,r.tileIds,r.coreTileId);r.v034g3MaxTier=Math.max(num(r.v034g3MaxTier||2),p.tier);}
function withinRadius(w,ids,core){const p=policy(w,ids,core),c=w.map.get(Number(core));if(!c||ids.length>p.cap)return false;
 return ids.every(id=>{const t=w.map.get(Number(id));return !!t&&(t.x-c.x)**2+(t.y-c.y)**2<=p.radius*p.radius+EPS;});}
function maximumJoinCap(w,a,b){const ids=a.tileIds.concat(b.tileIds);return Math.max(policy(w,ids,a.coreTileId).cap,policy(w,ids,b.coreTileId).cap);}
const pathLimit=(w,ids,core,phase)=>policy(w,ids,core)[phase]??Infinity;
// Two bounded Dijkstra sweeps instead of up to 2*N separate shortest paths.
// In reverse sweep, the cost of the original edge u->v is paid on v.
function bothReachable(w,ids,core,limit){const allow=new Set(ids.map(Number)),source=Number(core);if(!allow.has(source))return false;
 const info=new Map();for(const id of allow){const t=w.map.get(id);if(!t||!NS.TERRAIN?.[t.terrain]?.passable)return false;
  const i=t.buildings?.indexOf('road')??-1,v=w.villages?.find(v=>same(v.id,t.ownerId)),road=i>=0&&num(t.buildingCondition?.[i]??100)>=25&&!!v?.hasTech?.('ROADS');
  info.set(id,num(NS.TERRAIN[t.terrain].tradeCost||1)*(road?.62:1));}
 function sweep(reverse){const best=new Map([[source,0]]),todo=[[0,source]];while(todo.length){todo.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const [d,u]=todo.shift();if(d>limit+EPS)return false;if(d>best.get(u)+EPS)continue;
  for(const e of w.map.neighbors4(u)){const v=e.id;if(!allow.has(v))continue;const cost=reverse?info.get(u):info.get(v),nd=d+cost;if(nd>limit+EPS||nd>=((best.get(v)??Infinity)-EPS))continue;best.set(v,nd);todo.push([nd,v]);}}
 return best.size===allow.size;}
 if(!observationDepth)snap(w).pathSweeps+=2;return sweep(false)&&sweep(true);
}
function candidateExtension(v,w,c){const t=c?.tile||w?.map?.get?.(Number(c?.targetTileId??c?.tileId));
 if(!t||t.ownerId!=null||!v?.hasTech?.('ROADS')||!NS.V034C)return null;
 let best=null;for(const n of w.map.neighbors4(t.id)){
  if(!same(n.ownerId,v.id))continue;
  const r=NS.V034C.byTile(w,n.id);if(!r||r.lifecycle!=='ACTIVE')continue;
  const ids=[...r.tileIds,t.id],p=policyProjected(w,ids,r.coreTileId,v.id);
  const center=w.map.get(r.coreTileId);if(!center||ids.length>p.cap||(t.x-center.x)**2+(t.y-center.y)**2>p.radius*p.radius+EPS)continue;
  const allow=new Set(r.tileIds),out=NS.V034C.path(w,center.id,n.id,allow,p.join),back=NS.V034C.path(w,n.id,center.id,allow,p.join);
  const roadStep=num(NS.TERRAIN?.[t.terrain]?.tradeCost||1)*.62;
  const roadIndex=n.buildings?.indexOf('road')??-1,nroad=roadIndex>=0&&num(n.buildingCondition?.[roadIndex]??100)>=25;
  const backStep=num(NS.TERRAIN?.[n.terrain]?.tradeCost||1)*(nroad?.62:1);
  if(out+roadStep>p.join+EPS||back+backStep>p.join+EPS)continue;
  const row={settlementId:r.id,coreTileId:r.coreTileId,sourceTileId:n.id,targetTileId:t.id,tilesAfter:ids.length,projectedOut:+(out+roadStep).toFixed(3),projectedReturn:+(back+backStep).toFixed(3),g3Radius:p.radius};
  if(!best||r.tileIds.length>best.tilesAfter-1||r.tileIds.length===best.tilesAfter-1&&String(r.id)<String(best.settlementId))best=row;
 }
 return best;
}
function policyProjected(w,ids,core,nationId){ // target is unowned during scoring; inherit projected nation only for population grouping
 const p=policy(w,ids.filter(id=>w.map.get(id)?.ownerId!=null),core);
 return p;
}
function nationalFoodCycles(state){const sum=state.reduce((s,x)=>s+x.stock,0),need=state.reduce((s,x)=>s+x.need,0);return sum/Math.max(.12,need);}
function reliefPlan(w,r,state,baseline){const m=snap(w);m.reliefPlans++;if(!config.foodEnabled)return {...baseline,mode:'STANDARD'};
 // Hunger95 + almost no food, or sustained extreme hunger + imminent depletion.
 // The national 20-cycle test protects other citizens from a cascading crisis.
 const imminent=(r.critical>0&&r.days<3)||(r.severe>0&&r.days<1.5);
 const nationalCycles=nationalFoodCycles(state),hasDonor=state.some(x=>x.sid!==r.sid&&x.severe===0&&x.critical===0&&x.stock>Math.max(8,x.need*18));
 if(imminent&&nationalCycles>=20&&hasDonor){m.imminentPlans++;return {floor:18,target:24,mode:'IMMINENT'};}
 if(imminent)m.imminentRejected++;
 return {...baseline,mode:'STANDARD'};
}
function receiverRank(r){if(!config.foodEnabled)return 0;
 return r.critical>0&&r.days<3?3:r.severe>0&&r.days<1.5?2:r.critical>0?1:0;}
function onDelivery(w,mode,qty){if(mode==='IMMINENT'){const m=snap(w);m.emergencyShipments++;m.emergencyQty+=qty;}}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g3={revision:'circle-and-travel-cost-plus-imminent-relief',spatial:'derived from physical population/buildings',emergency:'18-cycle donor lower floor only for imminent crisis'};return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){return observe(()=>{const d=oldJSON.call(this,w);d.version=VERSION;
 const m={...snap(w)};d.worldSummary=d.worldSummary||{};
 const tierCounts={R2:0,R3:0,R4:0,over13Tiles:0,maxTiles:0};
 for(const r of w.v34b?.settlements||[]){if(r.lifecycle!=='ACTIVE'||!r.tileIds?.length)continue;
  const p=policy(w,r.tileIds,r.coreTileId);tierCounts['R'+p.tier]=(tierCounts['R'+p.tier]||0)+1;
  if(r.tileIds.length>13)tierCounts.over13Tiles++;tierCounts.maxTiles=Math.max(tierCounts.maxTiles,r.tileIds.length);}
 d.worldSummary.v034g3={...m,activeGrowthTiers:tierCounts,geometry:'Euclidean radius AND bidirectional owned-tile path',growth:'R2/13 -> R3/29 -> R4/49; population+buildings',food:'priority imminent crisis; 18-cycle donor safeguard with >=20 national cycles',g2aSummaryRetained:true};return d;});};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const text=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g2a')||localStorage.getItem('village-observer-v034g2')||localStorage.getItem('village-observer-v034g1b');return text?NS.World.from(JSON.parse(text)):null;},
 export(w){download(`village-observer-v034G3-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034G3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download(`village-observer-v034G3-relay-routes-${w.telemetry?.sessionId||'session'}.csv`,'\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};
NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
function download(file,contents,mime='application/json'){const url=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=url;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const result=old.apply(this,a);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const x=document.getElementById('exportG2RelayBtn');if(x){x.textContent='G3 구호 배송 CSV';x.title='정착지별 식량 구호 및 일반·긴급 보호 기준 (최근 300건)';}return result;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'정착지 원형 확장과 기아 임박 구호 안정화',summary:'정착지 병합·분할은 유클리드 원형 반경 및 실제 왕복 경로를 함께 충족해야 하고, 실제 기아 임박 시 안전 조건하에서 구호 우선순위를 높입니다.',sections:[['성장하는 공간 구조',['기본 반경 2·최대 13타일, 인구 12명·건물 2개 이상 반경 3·29타일, 인구 30명·건물 6개 이상 반경 4·49타일.','유클리드 반경 AND 실제 왕복 통행 경로비를 동시에 적용하며, 도로·지형·소유권을 보존합니다.']],['비상 구호',['기존 24/40 작업주기 보호 기준을 유지하며 기아가 임박한 정착지만 18주기 하한을 검토합니다.','국가 비축 20주기 이상, 안전한 공급원 존재 시에만 하한 완화하며 공급원 자신이 심각한 Hunger 상태이면 제외합니다.']],['회귀 검사',['기존 물류·D3 식량 재고 보존과 3일 작업주기·국제 교역/전쟁/신진대사 규칙을 유지합니다.','공간과 식량 변경을 별도로 켜고 끌 수 있어 개발 회귀 원인을 구분할 수 있습니다.']]]});
NS.V034G3=Object.freeze({version:VERSION,config,policy,observe,promote,withinRadius,maximumJoinCap,pathLimit,bothReachable,candidateExtension,reliefPlan,receiverRank,onDelivery,summary:w=>({...snap(w)})});
})(window.VSim);
