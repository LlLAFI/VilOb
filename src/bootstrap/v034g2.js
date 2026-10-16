/* V0.34G2 Settlement Logistics V2 — unified same-nation food relief.
 * A Settlement owns exactly one food demand and one physical pool. Inter-Settlement
 * delivery chooses a legal reachable tile pair using the real route cost. No RNG.
 * Legacy V27/V28/E2 food relief is retained only as a pre-bootstrap fallback.
 */
(function(NS){'use strict';
const VERSION='V0.34G2',PREVIOUS='V0.34G1B',KEY='village-observer-v034g2';
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b);
const cal=w=>num(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
const n5=x=>+num(x).toFixed(5);
const diag=new WeakMap();
function stats(w){let s=diag.get(w);if(!s){s={pulses:0,nationPulses:0,settlementReads:0,receivers:0,donorCandidates:0,skippedSameSettlement:0,routePairsChecked:0,routePairsReachable:0,routeCacheHits:0,blocked:{},shipments:0,quantity:0,returned:0,failedReturns:0,invalidEndpoints:0,physicalMismatch:0,foodDemand:0,hiddenLegacyShortages:0,retainedRoutes:[],lastDay:-1};diag.set(w,s);}return s;}
const block=(s,k)=>s.blocked[k]=(s.blocked[k]||0)+1;
function tileOK(w,v,tid){const t=w.map?.get(Number(tid));return !!(t&&same(t.ownerId,v.id)&&!(t.v33OccupierId!=null&&!same(t.v33OccupierId,v.id)));}
function groups(v,w){
 const g=new Map(),byTile=new Map(),territory=Array.from(v.territory||[],Number).sort((a,b)=>a-b);
 for(const id of territory){if(!tileOK(w,v,id))continue;const t=w.map.get(id),sid=t.settlementId!=null?String(t.settlementId):'tile:'+id;
  let x=g.get(sid);if(!x){x={sid,ids:[],anchor:id,pop:0,adults:0,tileAdults:new Map(),severe:0,critical:0,hunger:0,need:0,stock:0,days:0,avgHunger:0,room:0};g.set(sid,x);}
  x.ids.push(id);byTile.set(id,x);x.stock+=num(NS.V034D3?.stockRaw?.(w,id,'food')??t.stocks?.food);
  x.room+=Math.max(0,num(NS.V034D3?.physicalCap?.(v,id,'food'))-num(NS.V034D3?.stockRaw?.(w,id,'food')??t.stocks?.food));
 }
 for(const p of v.residents||[]){if(p.alive===false)continue;const x=byTile.get(Number(p.homeTileId));if(!x)continue;
  x.pop++;x.need+=num(NS.V034F0?.needFor?.(p)??(num(p.age)<15?.30:.42));x.hunger+=num(p.hunger);
  if(num(p.hunger)>=85)x.severe++;if(num(p.hunger)>=95)x.critical++;
  if(num(p.age)>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'){x.adults++;const tid=Number(p.homeTileId);x.tileAdults.set(tid,(x.tileAdults.get(tid)||0)+1);}
 }
 for(const x of g.values()){x.avgHunger=x.pop?x.hunger/x.pop:0;x.days=x.pop?x.stock/Math.max(.12,x.need):999;}
 return [...g.values()].filter(x=>x.pop>0).sort((a,b)=>a.anchor-b.anchor);
}
const demandUrgent=x=>x.days<(x.pop>=4?18:10)||x.critical>0||x.severe>0||x.avgHunger>=58;
const donorOK=(x,floor)=>x.days>floor&&x.stock>Math.max(8,x.need*floor);
const manhattan=(w,a,b)=>{const x=w.map.get(a),y=w.map.get(b);return Math.abs(num(x?.x)-num(y?.x))+Math.abs(num(x?.y)-num(y?.y));};
function routeCost(v,w,from,to){
 const first=v.internalPathCost?.(from,to);let cost=first==null?Infinity:Number(first);
 if(!Number.isFinite(cost)){const raw=w.map.tradePathCost?.([from],[to],new Set([v.id]));cost=raw==null?Infinity:Number(raw);}
 return Number.isFinite(cost)&&cost>=0?cost:Infinity;
}
// Cache only within the CURRENT relay day. Roads, ownership, occupation and
// topology can change between pulses; stale routes are not silently reused.
function bestPair(v,w,d,r,routeCache,s){
 let best=null;
 const candidates=[];for(const a of d.ids)for(const b of r.ids){if(!tileOK(w,v,a)||!tileOK(w,v,b))continue;candidates.push({a,b,md:manhattan(w,a,b)});}
 candidates.sort((p,q)=>p.md-q.md||p.a-q.a||p.b-q.b);
 for(const {a,b} of candidates){const key=a+'>'+b;let cost=routeCache.get(key);
  if(cost===undefined){cost=routeCost(v,w,a,b);routeCache.set(key,cost);s.routePairsChecked++;}else s.routeCacheHits++;
  if(!Number.isFinite(cost))continue;s.routePairsReachable++;
  const regular=v.internalLogisticsCapacity?.(a,b,'food',false);
  // Preserve E2's emergency-capacity fallback, ONLY for two distinct Settlements.
  // Prevent D3_SHARED_POOL_NO_SHIPMENT from ever becoming a positive shipment.
  const carrier=Math.max(1,(d.tileAdults?.get(a)||0)+(r.tileAdults?.get(b)||0)),fallback=Math.max(2,carrier*2.8/(1+cost*.08));
  const cap=Math.max(0,num(regular?.capacity),fallback);
  if(cap<.5)continue;
  if(!best||cost<best.cost-1e-9||(Math.abs(cost-best.cost)<1e-9&&(cap>best.cap+1e-9||Math.abs(cap-best.cap)<1e-9&&(a<best.from||a===best.from&&b<best.to))))best={from:a,to:b,cost,cap};
 }
 return best;
}
function relay(w){
 if(!w||num(w._v24Subday??2)<2)return;const s=stats(w),now=cal(w);s.pulses++;s.lastDay=now;
 for(const v of w.activeVillages||[]){v.v32e1=v.v32e1||{};v.v32e2=v.v32e2||{};v.v32d5=v.v32d5||{};
  const e=v.v32e1;if(now-num(e.lastFoodRelayCal??-99999)<3)continue;e.lastFoodRelayCal=now;s.nationPulses++;
  const state=groups(v,w),cache=new Map();e.foodDonorIndexBuilds=num(e.foodDonorIndexBuilds)+1;s.settlementReads+=state.length;
  const receivers=state.filter(demandUrgent).sort((a,b)=>b.critical-a.critical||b.severe-a.severe||a.days-b.days||a.anchor-b.anchor);
  s.receivers+=receivers.length;s.foodDemand+=receivers.reduce((a,x)=>a+x.need,0);
  // Original E2 caps urgency processing at four destinations per nation and pulse.
  for(const r of receivers.slice(0,4)){
   const crisis=r.critical>0||r.severe>0||r.days<8||r.avgHunger>=72;
   const floor=crisis?24:40;
   const donors=state.filter(d=>d.sid!==r.sid&&donorOK(d,floor)&&d.stock-d.need*floor>=.5);
   s.skippedSameSettlement++; // intentionally exclude the requesting Settlement
   if(!donors.length){block(s,'DONOR_RESERVE');continue;}
   const remembered=e.recentFoodDonor?.['settlement:'+r.sid];
   const shortlist=donors.map(d=>({d,md:Math.min(...d.ids.flatMap(a=>r.ids.map(b=>manhattan(w,a,b))))})).sort((a,b)=>(a.d.sid===remembered?-100:0)+a.md*2.6-(b.d.sid===remembered?-100:0)-b.md*2.6||b.d.days-a.d.days||a.d.anchor-b.d.anchor).slice(0,5).map(x=>x.d);
   v.v32e2.foodCandidateShortlists=num(v.v32e2.foodCandidateShortlists)+1;
   let best=null,routeSeen=false,capacitySeen=false;
   for(const d of shortlist){s.donorCandidates++;const pair=bestPair(v,w,d,r,cache,s);if(!pair)continue;routeSeen=true;if(pair.cap<.5)continue;capacitySeen=true;
    const surplus=Math.max(0,d.stock-d.need*floor);
    const score=pair.cost*2.4-d.days*.10-d.stock*.002-(d.sid===remembered?.8:0);
    if(!best||score<best.score||score===best.score&&d.anchor<best.d.anchor)best={...pair,d,score,surplus};
   }
   if(!best){block(s,!routeSeen?'NO_ROUTE':!capacitySeen?'CAPACITY':'NO_STOCK');continue;}
   const target=crisis?38:30;
   const need=Math.max(0,r.need*target-r.stock);
   const qty=Math.min(need,best.surplus,best.cap*(r.critical>0?2:1.35),r.room);
   if(qty<.5){block(s,r.room<.5?'STORAGE':'CAPACITY');continue;}
   // Physical withdrawals / deposits use D3's existing conserved Settlement pool.
   const initial=num(v.stockAt?.(best.from,'food'))+num(v.stockAt?.(best.to,'food'));
   const took=num(v.withdrawAt(best.from,'food',qty));
   const put=num(v.depositAt(best.to,'food',took));
   const rejected=Math.max(0,took-put);
   if(rejected>1e-9){const restored=num(v.depositAt(best.from,'food',rejected));s.returned+=restored;if(restored+1e-7<rejected){s.failedReturns++;block(s,'RETURN_FAILED');}}
   if(put<=0){block(s,'STORAGE');continue;}
   const final=num(v.stockAt?.(best.from,'food'))+num(v.stockAt?.(best.to,'food'));
   if(Math.abs(final-initial)>1e-6){s.physicalMismatch++;block(s,'CONSERVATION');}
   e.recentFoodDonor=e.recentFoodDonor||{};e.recentFoodDonor['settlement:'+r.sid]=best.d.sid;
   v.logisticsStats=v.logisticsStats||{};v.logisticsStats.moves=num(v.logisticsStats.moves)+1;v.logisticsStats.foodMoved=num(v.logisticsStats.foodMoved)+put;
   v.v32d5.foodRelayMoves=num(v.v32d5.foodRelayMoves)+1;v.v32d5.foodRelayQty=num(v.v32d5.foodRelayQty)+put;
   s.shipments++;s.quantity+=put;
   s.retainedRoutes.push({day:now,nation:v.name,fromSettlementId:best.d.sid,toSettlementId:r.sid,fromTileId:best.from,toTileId:best.to,cost:n5(best.cost),qty:n5(put),donorCycles:n5(best.d.days),receiverCycles:n5(r.days)});
   if(s.retainedRoutes.length>300)s.retainedRoutes.shift();
   w.telemetry?.record?.('NATIONAL_FOOD_RELAY32D5',w,{village:v.name,villageId:v.id,fromSettlementId:best.d.sid,toSettlementId:r.sid,fromTileId:best.from,toTileId:best.to,qty:+put.toFixed(2),routeCost:+best.cost.toFixed(2),receiverDaysBefore:+r.days.toFixed(1),donorDaysBefore:+best.d.days.toFixed(1),severeHunger:r.severe,criticalHunger:r.critical,model:'V0.34G2_SETTLEMENT_ROUTE'});
  }
 }
}
function summary(w){const s=stats(w);return{...s,quantity:n5(s.quantity),returned:n5(s.returned),retainedRoutes:s.retainedRoutes.length,transportRule:'same-nation unified food relief (V27/V28/E2 replaced)',demandBasis:'F0 age-weighted demand per 3-day work cycle',endpointChoice:'minimum actual passable route cost among Settlement member tile pairs',cadence:'3-day work cycle / before consumption',internalShipmentForbidden:true,conservationErrors:s.physicalMismatch+s.failedReturns};}
const HEAD=['day','nation','fromSettlementId','toSettlementId','fromTileId','toTileId','cost','qty','donorCycles','receiverCycles'];
const csv=w=>[HEAD.join(','),...stats(w).retainedRoutes.map(r=>HEAD.map(k=>'"'+String(r[k]??'').replace(/"/g,'""')+'"').join(','))].join('\n');
function download(name,contents,mime){const url=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const sav=NS.SaveSystem;
NS.SaveSystem={...sav,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g1b')||localStorage.getItem('village-observer-v034g1a')||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034G2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034G2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportG2Routes(w){download(`village-observer-v034G2-relay-routes-${w.telemetry?.sessionId||'session'}.csv`,'\ufeff'+csv(w),'text/csv;charset=utf-8');}
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g2={policy:'Settlement-level unified food relief',schema:'G1B-compatible',notes:'G2 audit counters are transient'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const json=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=json.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g2=summary(w);return j;};
if(NS.UI){const header=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const x=header.apply(this,args);document.title='Village Observer '+VERSION;const label=document.getElementById('versionBadge');if(label)label.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const near=document.getElementById('exportLogisticsAuditG1Btn');if(near&&!document.getElementById('exportG2RelayBtn')){const b=document.createElement('button');b.id='exportG2RelayBtn';b.textContent='G2 정착지 배송 CSV';b.title='정착지 간 실제 배송 경로·식량량 (최대 최근 300건)';b.addEventListener('click',()=>NS.SaveSystem.exportG2Routes(this.world));near.insertAdjacentElement('afterend',b);}return x;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'정착지 단위 통합 식량 구호 V2',summary:'V27·V28·E2의 타일별 식량 구호를 정착지 공동 재고·연령별 수요로 통합하고, 실제 통행 가능한 타일 쌍을 통해 배송합니다.',sections:[['정착지 기준 판단',['F0/F2의 실제 연령별 3일 작업주기 식량 수요와 D3의 물리 공동 식량 재고를 정착지마다 한 번 집계합니다.','동일 정착지 내부 수송은 후보에서 제외하며, 국가 내 서로 다른 정착지 간에만 긴급 보급합니다.']],['물리 배송 경로',['양쪽 정착지의 점령되지 않은 소속 타일의 실제 경로비를 비교해 가장 저렴한 출발·도착 타일 쌍을 선택합니다.','기존 용량·재고 출고·도착지 저장 공간·잔량 원상복구·식량 보존식은 유지합니다.']],['검증 및 범위',['G2는 기존 구호를 대체해 3일 작업주기 직전에 한 번 실행됩니다. 배송 CSV 및 DEVLOG worldSummary.v034g2를 추가합니다.','기존 V27·V28·E2 식량 구호는 G2 단일 루틴으로 대체합니다. 국내 상업 거래, 국제 교역, F3 신진대사, 군사 이동, 정착지 병합 범위는 변경하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034G2=Object.freeze({version:VERSION,relay,groups,bestPair,summary,csv});
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);
