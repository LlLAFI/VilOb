
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const REV32E1='late-sim-performance-housing-relay-ui-stability';
const REV32E2='mobile-late-sim-relay-shortlist-housing-churn-fix';
const CAL=w=>Number(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
const NOW=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function ensureE1(v){
 v.v32e1=v.v32e1||{};const s=v.v32e1;
 s.housingBlocker=s.housingBlocker||'NONE';s.lastHousingQuickCal=Number(s.lastHousingQuickCal??-99999);s.lastHousingResolveCal=Number(s.lastHousingResolveCal??-99999);s.housingResolverRuns=Number(s.housingResolverRuns||0);s.housingResolverActions=Number(s.housingResolverActions||0);s.housingContextBuilds=Number(s.housingContextBuilds||0);s.housingContextHits=Number(s.housingContextHits||0);
 s.lastFoodRelayCal=Number(s.lastFoodRelayCal??-99999);s.foodDonorIndexBuilds=Number(s.foodDonorIndexBuilds||0);s.foodRouteCacheHits=Number(s.foodRouteCacheHits||0);s.foodRouteChecks=Number(s.foodRouteChecks||0);s.recentFoodDonor=s.recentFoodDonor||{};
 return s;
}
function ensureE2(v){
 v.v32e2=v.v32e2||{};const s=v.v32e2;
 s.foodCandidateShortlists=Number(s.foodCandidateShortlists||0);s.foodPairCacheHits=Number(s.foodPairCacheHits||0);s.foodExpensiveChecks=Number(s.foodExpensiveChecks||0);s.foodRememberedHits=Number(s.foodRememberedHits||0);s.foodMildSkipped=Number(s.foodMildSkipped||0);s.housingNormalSkipped=Number(s.housingNormalSkipped||0);return s;
}
function perfAdd(w,k,n){w._v32e1Perf=w._v32e1Perf||{};w._v32e1Perf[k]=Number(w._v32e1Perf[k]||0)+Number(n||0);}
function effectiveHousingCapE1(t){
 if(!t)return 0;if(NS.V011?.effectiveLocalCapacity)return Math.max(.1,Number(NS.V011.effectiveLocalCapacity(t)||0));let n=0;
 for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i],cond=Number(t.buildingCondition?.[i]??100),eff=cond>=70?1:clamp(cond/70,0,1);n+=Number(NS.BUILDINGS?.[b]?.capacity||0)*eff;}
 return Math.max(.1,n);
}
function quickHousingE1(v,w){if(NS.V034D2?.quickHousing)return NS.V034D2.quickHousing(v,w);
 const byHome=NS.V026?.ensureResidentIndex?.(v)?.byHome,rows=[];let max=0,short=0;for(const id0 of v.territory||[]){const id=Number(id0),t=w.map.get(id);if(!t)continue;const ps=byHome?.get(id)||(v.tileResidents?.(id)||[]),pop=ps.length,adults=ps.reduce((n,p)=>n+(p.alive&&p.age>=16&&p.assignment!=='PIONEER'?1:0),0),cap=effectiveHousingCapE1(t),free=Math.max(0,cap-pop),occupancy=pop/cap,housingShortage=Math.max(0,pop-cap);if(pop>0){max=Math.max(max,occupancy);short+=housingShortage;}rows.push({id,t,pop,adults,cap,free,occupancy,housingShortage});}
 const bad=rows.filter(r=>r.pop>0&&(r.occupancy>=1.12||r.housingShortage>=1));const pressure=bad.length>0,active=max>=1.18||short>=3,severe=max>=1.35||short>=8;
 return{rows,bad,max,short,pressure,active,severe};
}
function maxProjectCapE1(v){return Math.max(1,Number(NS.V031G?.maxProjects?.(v)||1));}
function pendingHousingE1(v){return[...(v.constructionProjects||[]).filter(p=>p?.type==='house'),...(v.buildingUpgradeProjects||[]).filter(p=>['row_house','collective_house','collective_housing'].includes(p?.to))];}
function marketGoldNationE1(v,w){let n=0;for(const id of v.territory||[])n+=Number(w.map.get(Number(id))?.v29Economy?.marketGold||0);return n;}
function blockerFromQuickE1(v,w,q){if(NS.V034D2?.housingBlocker)return NS.V034D2.housingBlocker(v,w,q);
 if(!q.bad.length)return'NONE';if(q.rows.some(r=>r.free>=1))return'RELOCATION';const hp=pendingHousingE1(v);if(hp.length)return'HOUSING_PROJECT_QUEUE';
 const cost=NS.V08?.effectiveCost?.(v,'house')||NS.V08?.BUILD_COSTS?.house||{wood:14,stone:4,gold:0};if(Number(v.wood||0)+1e-9<Number(cost.wood||0)||Number(v.stone||0)+1e-9<Number(cost.stone||0))return'MATERIAL_PAYMENT';
 const goldNeed=Number(cost.gold||0);if(goldNeed>0&&marketGoldNationE1(v,w)+Math.max(0,Number(v.gold||0)-4)+1e-9<goldNeed)return'MATERIAL_PAYMENT';if((v.constructionProjects||[]).length>=maxProjectCapE1(v))return'PROJECT_CAP';
 const foot=Number(NS.V017?.buildingFootprint?.('house')||1),buildable=q.rows.filter(r=>Number(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-9>=foot&&!((v.constructionProjects||[]).some(p=>Number(p.tileId)===r.id)));
 if(buildable.length){const withAdults=buildable.some(r=>Number(r.adults||0)>0);return withAdults?'READY_FOR_HOUSING':'NO_BUILDERS';}
 if(q.rows.some(r=>Number(NS.V017?.accessiblePotential?.(v,r.t)??0)>Number(r.t?.developedBuildSpace||0)+.05))return'LAND_DEVELOPMENT';return'SPACE_CAP';
}
function syncQuickHousingE1(v,w,q,emit=true){
 const s=ensureE1(v),old=s.housingBlocker,b=blockerFromQuickE1(v,w,q);s.housingBlocker=b;if(v.v32d5)v.v32d5.housingBlocker=b;
 w._v32e1HousingCrisis=w._v32e1HousingCrisis||new Map();w._v32e1HousingCrisis.set(Number(v.id),q);
 if(emit&&old!==b)w.telemetry?.record?.('HOUSING_BLOCKER_CHANGED32E1',w,{village:v.name,villageId:v.id,from:old,to:b,maxOccupancy:+q.max.toFixed(3),shortage:+q.short.toFixed(2),projects:(v.constructionProjects||[]).length,projectCap:maxProjectCapE1(v)});
 return b;
}

/* One forced V0.28 urban summary is shared by every D3 housing query in the same E1 resolver pass. */
const urbanSummaryBase=NS.V028?.urbanSummary;
if(urbanSummaryBase)NS.V028.urbanSummary=function(v,w,force=false){
 const c=w?._v32e1HousingContext;if(c&&Number(c.villageId)===Number(v?.id)){
  const s=ensureE1(v);if(c.summary){c.hits++;s.housingContextHits++;perfAdd(w,'housingContextHits',1);return c.summary;}
  const x=urbanSummaryBase.call(this,v,w,true);c.summary=x;c.builds++;s.housingContextBuilds++;perfAdd(w,'housingContextBuilds',1);return x;
 }
 return urbanSummaryBase.call(this,v,w,force);
};
function runHousingResolverE1(w){
 const t0=NOW(),now=CAL(w);for(const v of w.activeVillages||[]){const s=ensureE1(v),prior=w._v32e1HousingCrisis?.get?.(Number(v.id)),quickCadence=prior?.active?15:30;if(now-s.lastHousingQuickCal<quickCadence)continue;s.lastHousingQuickCal=now;const q=quickHousingE1(v,w);syncQuickHousingE1(v,w,q,true);const cadence=q.active?15:30;if(!q.pressure){ensureE2(v).housingNormalSkipped++;continue;}if(now-s.lastHousingResolveCal<cadence)continue;s.lastHousingResolveCal=now;s.housingResolverRuns++;
  const ctx={villageId:v.id,summary:null,builds:0,hits:0};w._v32e1HousingContext=ctx;w._v32e1HousingBypass=true;let acted=false;try{acted=!!NS.V032D3?.housingPulse?.(v,w,true);}finally{w._v32e1HousingBypass=false;w._v32e1HousingContext=null;}
  if(acted){s.housingResolverActions++;v.v28Stats=v.v28Stats||{};v.v28Stats.housingActions=Number(v.v28Stats.housingActions||0)+1;v.v28Stats.lastHousingCalendar=now;if(v.v32d5)v.v32d5.housingPriorityActions=Number(v.v32d5.housingPriorityActions||0)+1;const fresh=quickHousingE1(v,w);syncQuickHousingE1(v,w,fresh,true);}
 }
 perfAdd(w,'housing',NOW()-t0);
}

/* Food relay: group residents once, keep a donor index, and cache route costs for short windows. */
function foodIndexE1(v,w){
 const t0=NOW(),byHome=NS.V026?.ensureResidentIndex?.(v)?.byHome,states=[];for(const id0 of v.territory||[]){const id=Number(id0),ps=byHome?.get(id)||(v.tileResidents?.(id)||[]);if(!ps.length)continue;let severe=0,critical=0,adults=0,hunger=0;for(const p of ps){const h=Number(p.hunger||0);hunger+=h;if(h>=85)severe++;if(h>=95)critical++;if(p.age>=16&&p.assignment!=='PIONEER')adults++;}const pop=ps.length,stock=Number(v.stockAt?.(id,'food')||0),days=stock/Math.max(.12,pop*.36);states.push({id,pop,stock,days,severe,critical,adults,hunger,avgHunger:hunger/pop});}
 const donors24=states.filter(d=>d.days>24&&d.stock>Math.max(8,d.pop*.36*24)).sort((a,b)=>b.days-a.days||b.stock-a.stock),donors30=donors24.filter(d=>d.days>30&&d.stock>Math.max(8,d.pop*.36*30));ensureE1(v).foodDonorIndexBuilds++;perfAdd(w,'foodDonorIndexBuilds',1);perfAdd(w,'foodIndex',NOW()-t0);NS.V034G1?.observeFoodIndex?.(v,w,states,donors24,donors30);return{states,donors24,donors30};
}
function routeFoodE1(v,w,from,to){
 const now=CAL(w);v._v32e1FoodRouteCache=v._v32e1FoodRouteCache||new Map();const key=`${from}>${to}`,old=v._v32e1FoodRouteCache.get(key),s=ensureE1(v);if(old&&now-Number(old.cal||0)<=30){s.foodRouteCacheHits++;perfAdd(w,'foodRouteCacheHits',1);return old.cost;}
 s.foodRouteChecks++;perfAdd(w,'foodRouteChecks',1);let cost=Number(v.internalPathCost?.(from,to));if(!Number.isFinite(cost)){const roads=new Set([v.id]);cost=Number(w.map.tradePathCost?.([from],[to],roads));}v._v32e1FoodRouteCache.set(key,{cal:now,cost});if(v._v32e1FoodRouteCache.size>180){const first=v._v32e1FoodRouteCache.keys().next().value;v._v32e1FoodRouteCache.delete(first);}return cost;
}
function foodPairE2(v,w,d,r){
 const now=CAL(w),e=ensureE2(v);v._v32e2FoodPairCache=v._v32e2FoodPairCache||new Map();const key=`${d.id}>${r.id}`,old=v._v32e2FoodPairCache.get(key);
 if(old&&now-Number(old.cal||0)<=18){e.foodPairCacheHits++;perfAdd(w,'foodPairCacheHits',1);return old;}
 e.foodExpensiveChecks++;perfAdd(w,'foodExpensiveChecks',1);const t0=NOW(),cost=routeFoodE1(v,w,d.id,r.id);if(!Number.isFinite(cost)){const z={cal:now,cost:Infinity,cap:0};v._v32e2FoodPairCache.set(key,z);perfAdd(w,'foodPairMs',NOW()-t0);return z;}
 const regular=v.internalLogisticsCapacity?.(d.id,r.id,'food',false),carrier=Math.max(1,d.adults+r.adults),fallback=Math.max(2,carrier*2.8/(1+cost*.08)),cap=Math.max(Number(regular?.capacity||0),fallback),z={cal:now,cost,cap};NS.V034G1?.observePair?.(v,w,d,r,regular,z);NS.V034G1A?.observePair?.(v,w,d,r,regular,z);v._v32e2FoodPairCache.set(key,z);perfAdd(w,'foodPairMs',NOW()-t0);
 if(v._v32e2FoodPairCache.size>160){const first=v._v32e2FoodPairCache.keys().next().value;v._v32e2FoodPairCache.delete(first);}return z;
}
function cheapFoodCandidatesE2(v,w,donors,r,remembered,limit=5){
 const e=ensureE2(v);e.foodCandidateShortlists++;perfAdd(w,'foodCandidateShortlists',1);const rows=donors.map(d=>{const md=Number(w.map.distance?.(d.id,r.id)??99),surplus=Math.max(0,d.stock-d.pop*.36*24),score=md*2.6-Math.min(120,d.days)*.035-Math.min(300,surplus)*.003-(d.id===remembered?6:0);return{d,score};}).sort((a,b)=>a.score-b.score);return rows.slice(0,Math.max(1,limit)).map(x=>x.d);
}
function foodBlockE1(v,key){v.v32d5=v.v32d5||{};v.v32d5.foodRelayBlocked=v.v32d5.foodRelayBlocked||{};v.v32d5.foodRelayBlocked[key]=Number(v.v32d5.foodRelayBlocked[key]||0)+1;}
function nationalFoodRelayE1(w){
 const t0=NOW(),now=CAL(w);for(const v of w.activeVillages||[]){const s=ensureE1(v),e=ensureE2(v);if(now-s.lastFoodRelayCal<6)continue;s.lastFoodRelayCal=now;const idx=foodIndexE1(v,w),receivers=[];for(const x of idx.states){const urgent=x.days<6||x.critical>0||x.severe>=2||(x.severe>0&&x.days<12);if(urgent)receivers.push(x);else if(x.severe>0)e.foodMildSkipped++;}receivers.sort((a,b)=>b.critical-a.critical||b.severe-a.severe||a.days-b.days);if(!receivers.length)continue;
  for(const r of receivers.slice(0,4)){const floor=(r.critical>0||r.days<2)?24:30,donors=(floor===24?idx.donors24:idx.donors30).filter(d=>d.id!==r.id),remembered=Number(s.recentFoodDonor[r.id]);if(!donors.length){foodBlockE1(v,'DONOR_RESERVE');continue;}let best=null,routeSeen=false,capacitySeen=false;
   const rememberedDonor=Number.isFinite(remembered)?donors.find(d=>Number(d.id)===remembered):null;
   if(rememberedDonor){const surplus=Math.max(0,rememberedDonor.stock-rememberedDonor.pop*.36*floor);if(surplus>=.5){const pair=foodPairE2(v,w,rememberedDonor,r);if(Number.isFinite(pair.cost)){routeSeen=true;if(pair.cap>=.5){capacitySeen=true;if(pair.cost<=5||r.critical>0||r.days<2){best={d:rememberedDonor,cost:pair.cost,cap:pair.cap,surplus,score:-999};e.foodRememberedHits++;}}}}}
   if(!best){const shortlist=cheapFoodCandidatesE2(v,w,donors,r,remembered,5);for(const d of shortlist){const surplus=Math.max(0,d.stock-d.pop*.36*floor);if(surplus<.5)continue;const pair=foodPairE2(v,w,d,r);if(!Number.isFinite(pair.cost))continue;routeSeen=true;if(pair.cap<.5)continue;capacitySeen=true;const score=pair.cost*2.4-d.days*.10-d.stock*.002-(d.id===remembered?.8:0);if(!best||score<best.score)best={d,cost:pair.cost,cap:pair.cap,surplus,score};}}
   if(!best){foodBlockE1(v,!routeSeen?'NO_ROUTE':!capacitySeen?'CAPACITY':'NO_STOCK');continue;}const target=(r.critical>0||r.avgHunger>=76)?32:24,need=Math.max(0,r.pop*.36*target-r.stock),qty=Math.min(need,best.surplus,best.cap*(r.critical>0?2:1.35));if(qty<.5){foodBlockE1(v,'CAPACITY');continue;}const {took,put}=NS.V034D3A.transferWithReturn(v,best.d.id,r.id,'food',qty);if(put<=0){foodBlockE1(v,'STORAGE');continue;}s.recentFoodDonor[r.id]=best.d.id;NS.V034G1?.observeShipment?.(v,w,best.d.id,r.id,put,best.cost);v.logisticsStats=v.logisticsStats||{};v.logisticsStats.moves=Number(v.logisticsStats.moves||0)+1;v.logisticsStats.foodMoved=Number(v.logisticsStats.foodMoved||0)+put;v.v32d5=v.v32d5||{};v.v32d5.foodRelayMoves=Number(v.v32d5.foodRelayMoves||0)+1;v.v32d5.foodRelayQty=Number(v.v32d5.foodRelayQty||0)+put;w.telemetry?.record?.('NATIONAL_FOOD_RELAY32D5',w,{village:v.name,villageId:v.id,fromTileId:best.d.id,toTileId:r.id,qty:+put.toFixed(2),routeCost:+best.cost.toFixed(2),receiverDaysBefore:+r.days.toFixed(1),donorDaysBefore:+best.d.days.toFixed(1),severeHunger:r.severe,criticalHunger:r.critical,model:'V0.32E2_SHORTLIST_LAST_MILE'});}
 }
 perfAdd(w,'foodRelay',NOW()-t0);
}

function attachE1(w,src=null){
 w=NS.V032D5?.attachWorld?.(w,src)||w;if(!w)return w;w._v32e1HousingManaged=true;w._v32e1FoodRelayManaged=true;w._v32e1HousingCrisis=new Map();
 for(const v of w.villages||[]){v._world=w;const old=src?.villages?.find?.(x=>Number(x.id)===Number(v.id))?.v32e1;if(old)v.v32e1=old;ensureE1(v);syncQuickHousingE1(v,w,quickHousingE1(v,w),false);}
 return w;
}
function attachE2(w,src=null){w=attachE1(w,src);if(!w)return w;for(const v of w.villages||[]){const old=src?.villages?.find?.(x=>Number(x.id)===Number(v.id))?.v32e2;if(old)v.v32e2=old;ensureE2(v);}return w;}

/* D5 cadence remains the base; legacy D5 housing/relay are suppressed by E1 flags and replaced here. */
const advanceD5=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(){const r=advanceD5.call(this);runHousingResolverE1(this);if(!NS.V034G2?.relay)nationalFoodRelayE1(this);return r;};

/* Telemetry */
const snapD5=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snapD5.call(this,w,reason,note);if(!s)return s;let runs=0,actions=0,ctxBuild=0,ctxHit=0,idxBuild=0,routeHit=0,routeChecks=0,shortlists=0,pairHits=0,expensive=0,rememberedHits=0,mildSkipped=0,housingSkipped=0;
 for(const row of s.villages||[]){const v=w.villages.find(x=>Number(x.id)===Number(row.id));if(!v)continue;const e=ensureE1(v),e2=ensureE2(v);Object.assign(row,{housingBlocker32E1:e.housingBlocker,housingResolverRuns32E1:e.housingResolverRuns,housingResolverActions32E1:e.housingResolverActions,housingContextBuilds32E1:e.housingContextBuilds,housingContextHits32E1:e.housingContextHits,foodDonorIndexBuilds32E1:e.foodDonorIndexBuilds,foodRouteCacheHits32E1:e.foodRouteCacheHits,foodRouteChecks32E1:e.foodRouteChecks,foodCandidateShortlists32E2:e2.foodCandidateShortlists,foodPairCacheHits32E2:e2.foodPairCacheHits,foodExpensiveChecks32E2:e2.foodExpensiveChecks,foodRememberedHits32E2:e2.foodRememberedHits,foodMildSkipped32E2:e2.foodMildSkipped,housingNormalSkipped32E2:e2.housingNormalSkipped});runs+=e.housingResolverRuns;actions+=e.housingResolverActions;ctxBuild+=e.housingContextBuilds;ctxHit+=e.housingContextHits;idxBuild+=e.foodDonorIndexBuilds;routeHit+=e.foodRouteCacheHits;routeChecks+=e.foodRouteChecks;shortlists+=e2.foodCandidateShortlists;pairHits+=e2.foodPairCacheHits;expensive+=e2.foodExpensiveChecks;rememberedHits+=e2.foodRememberedHits;mildSkipped+=e2.foodMildSkipped;housingSkipped+=e2.housingNormalSkipped;}
 const p=w._v32e1Perf||{};Object.assign(s.global,{housingResolverRuns32E1:runs,housingResolverActions32E1:actions,housingContextBuilds32E1:ctxBuild,housingContextHits32E1:ctxHit,foodDonorIndexBuilds32E1:idxBuild,foodRouteCacheHits32E1:routeHit,foodRouteChecks32E1:routeChecks,foodCandidateShortlists32E2:shortlists,foodPairCacheHits32E2:pairHits,foodExpensiveChecks32E2:expensive,foodRememberedHits32E2:rememberedHits,foodMildSkipped32E2:mildSkipped,housingNormalSkipped32E2:housingSkipped,perfHousing32E1:+Number(p.housing||0).toFixed(2),perfFoodRelay32E1:+Number(p.foodRelay||0).toFixed(2),perfFoodIndex32E1:+Number(p.foodIndex||0).toFixed(2),perfFoodPair32E2:+Number(p.foodPairMs||0).toFixed(2)});w._v32e1Perf={};const ys=(this.yearlySummaries||[]).find(x=>Number(x.year)===Number(w.year));if(ys){Object.assign(ys.global,s.global);for(const n of ys.nations||[]){const rr=s.villages.find(x=>Number(x.id)===Number(n.id));if(rr)Object.assign(n,rr);}}return s;
};
const csvD5=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csvD5.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['housingBlocker32E1','housingResolverRuns32E1','housingResolverActions32E1','housingContextBuilds32E1','housingContextHits32E1','foodDonorIndexBuilds32E1','foodRouteCacheHits32E1','foodRouteChecks32E1','foodCandidateShortlists32E2','foodPairCacheHits32E2','foodExpensiveChecks32E2','foodRememberedHits32E2','foodMildSkipped32E2','housingNormalSkipped32E2','perfHousing32E1','perfFoodRelay32E1','perfFoodIndex32E1','perfFoodPair32E2'],q=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>q(v[k]??s.global?.[k])).join(',');}return lines.join('\n');};
const jsonD5=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonD5.call(this,w);d.version='0.32E2';Object.assign(d.worldSummary,{v32E1Revision:REV32E1,v32E2Revision:REV32E2,housingResolver32E2:'normal occupancy no longer triggers D3 resolver; E2 only escalates when actual overcrowding/shortage crosses the existing bad-row threshold',foodRelay32E2:'remembered donor fast path + cheap map-distance shortlist (max 5) + route/capacity pair cache; mild single-person hunger no longer triggers nationwide search by itself',performance32E2:'mobile-first relay search reduction while preserving conserved stock movement and D5 trade behavior'});return d;};

/* Persistence */
const villageSerD5=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSerD5.call(this);d.v32e1=JSON.parse(JSON.stringify(ensureE1(this)));d.v32e2=JSON.parse(JSON.stringify(ensureE2(this)));return d;};
const worldSerD5=NS.World.prototype.serialize,worldFromD5=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSerD5.call(this);d.version='0.32E2';d.v32e1={revision:REV32E1,housingResolver:true,cachedFoodRelay:true,tradeBoardDomPreserved:true,combat:false};d.v32e2={revision:REV32E2,foodShortlist:true,pairCapacityCache:true,housingNormalChurnFix:true,combat:false};return d;};
NS.World.from=function(d){if(d?.version==='0.32E2'||d?.version==='0.32E1'){const w=worldFromD5({...d,version:'0.32D5'});return attachE2(w,d);}return attachE2(worldFromD5(d),d);};

/* Preserve the quote-board control nodes while the rest of the live trade tab refreshes. */
function mergeBoardE1(oldBoard,newBoard,ui){
 if(!oldBoard||!newBoard)return;const oldSel=oldBoard.querySelector('#v32d5Partner'),newSel=newBoard.querySelector('#v32d5Partner');if(oldSel&&newSel){const a=[...oldSel.options].map(x=>x.value+'|'+x.textContent).join('~'),b=[...newSel.options].map(x=>x.value+'|'+x.textContent).join('~');if(a!==b&&document.activeElement!==oldSel)oldSel.innerHTML=newSel.innerHTML;oldSel.value=String(ui.v32d5TradePartnerId??newSel.value);oldSel.onchange=()=>{ui.v32d5TradePartnerId=Number(oldSel.value);ui.renderVillageContent();};}
 const os=oldBoard.querySelector('.v32d5-summary'),ns=newBoard.querySelector('.v32d5-summary');if(os&&ns)os.innerHTML=ns.innerHTML;const od=[...oldBoard.querySelectorAll(':scope > details')],nd=[...newBoard.querySelectorAll(':scope > details')];for(let i=0;i<Math.min(od.length,nd.length);i++){const was=od[i].open,osum=od[i].querySelector(':scope > summary'),nsum=nd[i].querySelector(':scope > summary'),og=od[i].querySelector('.v32d5-quote-grid'),ng=nd[i].querySelector('.v32d5-quote-grid');if(osum&&nsum)osum.innerHTML=nsum.innerHTML;if(og&&ng)og.innerHTML=ng.innerHTML;od[i].open=was;}const of=oldBoard.querySelector('.v32d5-funnel'),nf=newBoard.querySelector('.v32d5-funnel');if(of&&nf)of.innerHTML=nf.innerHTML;
}
if(NS.UI){const headD5=NS.UI.prototype.renderHeader,contentD5=NS.UI.prototype.renderVillageContent,setWorldD5=NS.UI.prototype.setWorld;
 NS.UI.prototype.setWorld=function(w){return setWorldD5.call(this,attachE2(w));};
 NS.UI.prototype.renderHeader=function(){headD5.call(this);document.title='Village Observer V0.32E2';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32E2</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32E2 모바일 성능 안정화 · Food Relay shortlist/pair cache · Housing churn 억제';};
 NS.UI.prototype.renderVillageContent=function(){
  const real=this.q('villageContent'),oldBoard=this.sub==='trade'?real?.querySelector('.v32d5-board'):null;if(!oldBoard){contentD5.call(this);const v=this.world.selectedNation,root=this.q('villageContent');if(v&&root&&this.sub==='economy'&&!root.querySelector('.v32e1-perf-note')){const e=ensureE1(v),e2=ensureE2(v);root.insertAdjacentHTML('beforeend',`<div class="v32e1-perf-note small muted">⚙️ E2 Housing resolver ${e.housingResolverRuns}회 / 행동 ${e.housingResolverActions}회 · 정상포화 skip ${e2.housingNormalSkipped} · Food shortlist ${e2.foodCandidateShortlists} · remembered ${e2.foodRememberedHits} · pair cache ${e2.foodPairCacheHits}</div>`);}return;}
  const shadow=document.createElement('div'),q0=this.q.bind(this);this.q=id=>id==='villageContent'?shadow:q0(id);try{contentD5.call(this);}finally{this.q=q0;}const newBoard=shadow.querySelector('.v32d5-board');if(newBoard)mergeBoardE1(oldBoard,newBoard,this);
  const before=[],after=[];let seen=false;for(const n of [...shadow.childNodes]){if(n===newBoard){seen=true;continue;}(seen?after:before).push(n);}for(const n of [...real.childNodes])if(n!==oldBoard)real.removeChild(n);for(const n of before)real.insertBefore(n,oldBoard);for(const n of after)real.appendChild(n);
 };
}

/* Patch notes and save-system surface. */
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32E2'))NS.PATCH_NOTES.unshift({version:'V0.32E2',date:'2026-09-27',title:'모바일 후기 성능 안정화 2차',summary:'E1 첫 모바일 주행에서 60년대부터 확인된 국가 식량 relay의 전국 donor 경로탐색 폭증과 정상 점유 정착지의 불필요한 주거 relocation을 줄입니다.',sections:[['Food Relay shortlist',['최근 성공 donor가 여전히 유효하면 전국 후보 평가 없이 즉시 재사용합니다.','재탐색 시 cheap map-distance·surplus 점수로 최대 5개 donor만 추린 뒤 실제 route/capacity를 계산합니다.','route와 internal logistics capacity를 함께 짧게 캐시하여 같은 donor-receiver 쌍의 비싼 계산을 반복하지 않습니다.','Hunger 85+ 1명이 있어도 현지 비축이 충분한 경우에는 곧바로 전국 relay를 호출하지 않습니다.']],['Housing churn',['점유율 98~100%의 정상 포화 상태는 E resolver를 더 이상 깨우지 않습니다.','기존 bad-row 기준(실제 부족 또는 의미 있는 과밀)에 들어온 경우에만 D3 relocation/upgrade 해결 경로를 실행합니다.']],['관측',['shortlist 횟수, pair-cache hit, expensive pair check, remembered-donor hit, mild receiver skip을 CSV/JSON에 추가합니다.']]]});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32E1'))NS.PATCH_NOTES.unshift({version:'V0.32E1',date:'2026-09-27',title:'후기 성능 안정화 1차',summary:'D5 장기주행에서 확인된 Y90~94 주거 연산 폭증과 후기 food relay 경로탐색 비용을 줄이고 국제 호가판의 실시간 UI 초기화 버그를 수정합니다.',sections:[['0순위 버그',['국제 호가판의 상대국 select와 수입/수출 details DOM을 tick마다 재생성하지 않아 열림/선택 상태가 유지됩니다.']],['Housing Resolver',['V0.28/D3/D5의 중복 주거 pulse를 E1 단일 cadence로 통합합니다.','15일 저비용 압력검사 후 심각한 경우 15일, 일반 주거압력은 30일 간격으로 D3의 실제 relocation/upgrade/house/land 경로를 사용합니다.','한 resolver pass 안에서는 강제 urban summary를 공유하여 생활권/주거 계산 중복을 줄입니다.']],['Food Relay',['Person을 Settlement별로 한 번만 그룹화하고 donor index를 재사용합니다.','최근 성공 donor와 짧은 TTL route cache를 우선 사용하되 실제 stock 이동·donor reserve·capacity 규칙은 유지합니다.']],['성능 관측',['Housing resolver/context와 Food donor/route cache의 실행·hit·시간을 snapshot/CSV/JSON에 추가합니다.']]]});
(function(){const KEY='village-observer-v0-32e2',fallback=['village-observer-v0-32e1','village-observer-v0-32d5','village-observer-v0-32d4','village-observer-v0-32d3','village-observer-v0-32d2','village-observer-v0-32d1','village-observer-v0-32d','village-observer-v0-32c2','village-observer-v0-32c1a','village-observer-v0-32c1','village-observer-v0-32b','village-observer-v0-32a','village-observer-v0-31i'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v032E2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v032E2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v032E2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){const data=JSON.parse(await file.text()),w=NS.V019.worldFromMapData(data);return attachE2(NS.V032D5?.attachWorld?.(w)||w);}};})();
NS.V032E1={revision:REV32E1,attachWorld:attachE1,quickHousing:quickHousingE1,runHousingResolver:runHousingResolverE1,nationalFoodRelay:nationalFoodRelayE1};
NS.V032E2={revision:REV32E2,attachWorld:attachE2,quickHousing:quickHousingE1,runHousingResolver:runHousingResolverE1,nationalFoodRelay:nationalFoodRelayE1};
try{const ui=window.villageObserver;if(ui){ui.world=attachE2(ui.world);ui.renderHeader?.();ui.render?.();}}catch(e){console.error('V0.32E2 startup attach failed',e);}
})(window.VSim);
