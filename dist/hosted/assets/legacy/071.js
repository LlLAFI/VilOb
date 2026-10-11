
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV32E4='strategic-trade-network-v1-route-intent-physical-build';
const RES32E4=['food','wood','stone','iron_ore','iron','tools'];
const cal32E4=w=>Number(NS.V024?.calendarOrdinal?.(w)??((w?.ordinalDay?.()||0)*3));
function stats32E4(w){
 w.v32e4TradeStats=w.v32e4TradeStats||{};const s=w.v32e4TradeStats;
 for(const [k,v] of Object.entries({plannerRuns:0,candidateEvaluations:0,routeChecks:0,intents:0,strategicStarts:0,spacePreps:0,completed:0,partnersUnlocked:0,routeCostSavedEst:0,blockedProject:0,blockedFinance:0,blockedMaterials:0,blockedSpace:0,blockedOther:0,expired:0}))if(!Number.isFinite(Number(s[k])))s[k]=v;
 return s;
}
function state32E4(v){
 v.v32e4TradeNetwork=v.v32e4TradeNetwork||{};const s=v.v32e4TradeNetwork;
 s.intent=s.intent||null;s.lastPlanCal=Number(s.lastPlanCal??-99999);s.lastCompleted=s.lastCompleted||null;
 s.routeBlockers=s.routeBlockers||{NO_ROUTE_MARKET:0,NO_ROUTE_RANGE:0,NO_ROUTE_PATH:0};return s;
}
function routeReason32E4(route){
 if(route?.reachable)return'OK';
 if(route?.sourceTileId==null||route?.targetTileId==null)return'NO_ROUTE_MARKET';
 if(Number.isFinite(Number(route?.contactLevel))&&Number(route.contactLevel)<2)return'NO_ROUTE_MARKET';
 if(!Number.isFinite(Number(route?.cost)))return'NO_ROUTE_PATH';
 if(Number(route.cost)>Number(route.range||0))return'NO_ROUTE_RANGE';
 return'NO_ROUTE_PATH';
}
function pendingTP32E4(v,id){return(v.constructionProjects||[]).some(p=>Number(p.tileId)===Number(id)&&p.type==='trading_post'&&!p.v17Marker);}
function busyTile32E4(v,id){return[...(v.constructionProjects||[]).filter(p=>!p?.v17Marker),...(v.landDevelopmentProjects||[]),...(v.buildingUpgradeProjects||[]),...(v.specializationProjects||[])].some(p=>Number(p.tileId??p.targetTileId)===Number(id));}
function tpTiles32E4(v,w){return[...new Set((v.tradingPosts?.()||[]).map(Number))].filter(id=>w.map.get(id)?.ownerId===v.id);}
function marketGold32E4(v,w){let n=0;for(const id of v.territory||[])n+=Number(w.map.get(Number(id))?.v29Economy?.marketGold||0);return n;}
function canBuy32E4(v,k){if(k==='iron_ore')return!!v.hasTech?.('IRON_MINING');if(k==='iron')return!!v.hasTech?.('SMELTING');if(k==='tools')return!!v.hasTech?.('IRONWORKING');return true;}
function partnerOpportunity32E4(v,o,w){
 let score=0,calls=0;const assess=NS.V032D5?.assessTrade;if(!assess)return{score:0,calls:0};
 for(const [buyer,seller] of [[v,o],[o,v]])for(const k of RES32E4){
  if(!canBuy32E4(buyer,k))continue;let a=null;
  try{a=assess(w,buyer,seller,k,false);calls++;}catch{}
  if(!a||!String(a.reason||'').startsWith('NO_ROUTE'))continue;
  const p=a.plan||{},q=Math.max(0,Math.min(Number(p.need||0),Number(p.surplus||0),Number(p.max||999)));if(q<=.2)continue;
  const weight=k==='food'?1:k==='wood'||k==='stone'?1.1:.8;score+=Math.min(18,q)*weight*(1+Math.min(1.2,Number(a.urgency||0))*.45);
 }
 return{score,calls};
}
function roadOwners32E4(w){return new Set((w.activeVillages||[]).filter(v=>v.hasTech?.('ROADS')).map(v=>v.id));}
function landCost32E4(w,A,B,roads){if(!A?.length||!B?.length)return Infinity;const calc=()=>Number(w.map.tradePathCost?.(A,B,roads));return NS.V034C1F?.time(w,'landCost',()=>NS.V034C1F.time(w,'tradePath',calc))??calc();}
function remainingSpace32E4(v,t){const x=NS.V017?.remainingSpace?.(v,t);return Number.isFinite(Number(x))?Number(x):999;}
function potentialSpace32E4(v,t){const x=NS.V017?.accessiblePotential?.(v,t);return Number.isFinite(Number(x))?Number(x):remainingSpace32E4(v,t);}
function footprint32E4(){return Number(NS.V017?.buildingFootprint?.('trading_post')||1);}
function candidateShortlist32E4(v,w,partners,ownPosts){
 const foreignPosts=partners.flatMap(r=>r.posts),foot=footprint32E4(),rows=[];
 for(const id0 of v.territory||[]){
  const id=Number(id0),t=w.map.get(id);if(!t||t.ownerId!==v.id||!NS.TERRAIN?.[t.terrain]?.passable||t.hasBuilding?.('trading_post')||pendingTP32E4(v,id))continue;
  const pop=(v.tileResidents?.(id)||[]).filter(p=>p.alive).length;if(pop<3)continue;
  const potential=potentialSpace32E4(v,t);if(potential+1e-9<foot)continue;
  let foreignD=99;for(const q of foreignPosts)foreignD=Math.min(foreignD,Number(w.map.distance(id,q)||99));
  let ownD=0;if(ownPosts.length){ownD=99;for(const q of ownPosts)ownD=Math.min(ownD,Number(w.map.distance(id,q)||99));}
  const space=remainingSpace32E4(v,t),cheap=pop*6+Math.min(12,ownD)*3-Math.min(30,foreignD)*1.5+(space>=foot?6:0);
  rows.push({id,t,pop,space,potential,cheap,foreignD,ownD});
 }
 rows.sort((a,b)=>b.cheap-a.cheap||b.pop-a.pop||a.foreignD-b.foreignD);return rows.slice(0,6);
}
function partnerRows32E4(v,w){
 const own=tpTiles32E4(v,w),roads=roadOwners32E4(w),rows=[],blockers={NO_ROUTE_MARKET:0,NO_ROUTE_RANGE:0,NO_ROUTE_PATH:0};
 for(const o of w.activeVillages||[]){
  if(o.id===v.id)continue;const posts=tpTiles32E4(o,w),route=NS.V034C1F?.time(w,'routeInfo',()=>w.routeInfo?.(v,o))||{},reason=routeReason32E4(route);
  if(blockers[reason]!=null)blockers[reason]++;
  const currentLand=landCost32E4(w,own,posts,roads),op=NS.V034C1F?.time(w,'opportunity',()=>partnerOpportunity32E4(v,o,w))??partnerOpportunity32E4(v,o,w);
  rows.push({o,posts,route,reason,currentLand,opportunity:op.score,assessCalls:op.calls,range:Math.min(Number(v.tradeRange?.(w)||0),Number(o.tradeRange?.(w)||0))});
 }
 return{rows,own,roads,blockers};
}
function plan32E4(v,w){
 const s=state32E4(v),st=stats32E4(w),now=cal32E4(w);st.plannerRuns++;s.lastPlanCal=now;
 if(v.status!=='active'||!v.hasTech?.('BARTER')){s.routeBlockers={NO_ROUTE_MARKET:0,NO_ROUTE_RANGE:0,NO_ROUTE_PATH:0};return null;}
 const fScope=NS.V034C1F?.beginPlan(w,v);try{
 const pr=NS.V034C1F?.time(w,'partners',()=>partnerRows32E4(v,w))??partnerRows32E4(v,w);s.routeBlockers=pr.blockers;st.routeChecks+=pr.rows.length+pr.rows.reduce((a,r)=>a+Number(r.assessCalls||0),0);
 const candidates=NS.V034C1F?.time(w,'shortlist',()=>candidateShortlist32E4(v,w,pr.rows,pr.own))??candidateShortlist32E4(v,w,pr.rows,pr.own);if(!candidates.length)return null;let best=null;const candidateStart=NS.V034C1F?.mark(w);
 for(const c of candidates){
  st.candidateEvaluations++;let newPartners=0,costSaved=0,opp=0;const targets=[];
  for(const r of pr.rows){
   if(!r.posts.length)continue;const candCost=landCost32E4(w,[c.id],r.posts,pr.roads);st.routeChecks++;if(!Number.isFinite(candCost))continue;
   const canUnlock=(r.reason==='NO_ROUTE_RANGE'||r.reason==='NO_ROUTE_PATH'||pr.own.length===0)&&candCost<=r.range+1e-9;
   if(canUnlock){newPartners++;opp+=Number(r.opportunity||0);targets.push(r.o.name);}
   if(r.route?.reachable&&Number.isFinite(r.currentLand)&&candCost+.25<r.currentLand)costSaved+=r.currentLand-candCost;
  }
  const restore=pr.own.length===0?1:0,tradeBias=(NS.AIProfileCompat(v,'tradeDiplomacy')>.5?18:0)+(w.ordinalDay?.()<=Number(v.tradePolicyUntil||0)?12:0);
  const score=restore*180+newPartners*135+Math.min(20,costSaved)*8+Math.min(45,opp)*2.2+c.pop*1.3+Math.min(12,c.ownD)*1.5+tradeBias;
  const useful=restore||newPartners>0||costSaved>=2||(opp>=7&&costSaved>=.8);if(!useful)continue;
  const row={tileId:c.id,score,newPartners,costSaved,opportunity:opp,targetNames:targets.slice(0,4),reason:restore?'RESTORE_NODE':newPartners>0&&costSaved>0?'NEW_PARTNER_AND_ROUTE':newPartners>0?'NEW_PARTNER':'ROUTE_COST',space:c.space,potential:c.potential,pop:c.pop,baselineReachable:pr.rows.filter(r=>r.route?.reachable).length};
  if(!best||row.score>best.score)best=row;
 }
 NS.V034C1F?.endMark(w,'candidates',candidateStart);
 if(!best)return null;const threshold=(NS.AIProfileCompat(v,'tradeDiplomacy')>.5||w.ordinalDay?.()<=Number(v.tradePolicyUntil||0))?28:42;if(best.score<threshold)return null;
 s.intent={...best,createdCal:now,updatedCal:now,expiresCal:now+720,status:'PLANNED',blocker:'NONE'};st.intents++;
 w.telemetry?.record?.('TRADE_NETWORK_INTENT32E4',w,{village:v.name,villageId:v.id,tileId:best.tileId,reason:best.reason,score:+best.score.toFixed(1),newPartners:best.newPartners,routeCostSavedEst:+best.costSaved.toFixed(2),opportunity:+best.opportunity.toFixed(1),targetPartners:best.targetNames});
 return s.intent;
 }finally{NS.V034C1F?.endPlan(w,fScope);}
}
function countBlock32E4(w,b){const st=stats32E4(w);if(b==='PROJECT_CAP')st.blockedProject++;else if(b==='FINANCE')st.blockedFinance++;else if(b==='MATERIALS')st.blockedMaterials++;else if(b==='SPACE'||b==='SPACE_PREP')st.blockedSpace++;else st.blockedOther++;NS.V032E6?.countTradeBlock?.(w,b);}
function completeIntent32E4(v,w,intent){
 const s=state32E4(v),st=stats32E4(w),now=cal32E4(w),reachable=(w.activeVillages||[]).filter(o=>o.id!==v.id&&w.routeInfo?.(v,o)?.reachable).length,unlocked=Math.max(0,reachable-Number(intent.baselineReachable||0));
 st.completed++;st.partnersUnlocked+=unlocked;st.routeCostSavedEst+=Math.max(0,Number(intent.costSaved||0));
 s.lastCompleted={tileId:intent.tileId,completedCal:now,unlocked,routeCostSavedEst:Number(intent.costSaved||0),reason:intent.reason,targetNames:intent.targetNames||[]};s.intent=null;
 w.telemetry?.record?.('TRADE_NETWORK_COMPLETED32E4',w,{village:v.name,villageId:v.id,tileId:intent.tileId,partnersUnlocked:unlocked,routeCostSavedEst:+Number(intent.costSaved||0).toFixed(2),reason:intent.reason});
}
function buildMaterialAvailable32E4(v,w,targetId,k){
 let total=0;const admin=v.v32dAdmin,oldSaved=Number(admin?.logisticsSavedCost32D2||0);
 try{
  for(const id0 of v.territory||[]){
   const id=Number(id0),stock=Math.max(0,Number(v.stockAt?.(id,k)||0));if(stock<=0)continue;
   if(id===Number(targetId)){total+=stock;continue;}
   const q=v.internalLogisticsCapacity?.(id,Number(targetId),k,true);if(!q||!Number.isFinite(Number(q.cost))||Number(q.capacity||0)<=0)continue;
   total+=Math.min(stock,Math.max(0,Number(q.capacity||0)));
  }
 }finally{if(admin)admin.logisticsSavedCost32D2=oldSaved;}
 return total;
}
function diagnose32E4(v,w,intent){
 const t=w.map.get(Number(intent.tileId));if(!t||t.ownerId!==v.id)return'INVALID_TILE';if(!v.hasTech?.('BARTER'))return'TECH';if(pendingTP32E4(v,t.id))return'BUILDING';
 const foot=footprint32E4(),space=remainingSpace32E4(v,t),potential=potentialSpace32E4(v,t);if(space+1e-9<foot)return potential+1e-9>=foot?'SPACE_PREP':'SPACE';if(busyTile32E4(v,t.id))return'TILE_BUSY';
 const cap=Number(NS.V031G?.maxProjects?.(v)||1);if((v.constructionProjects||[]).length>=cap)return'PROJECT_CAP';
 const cost=NS.V08?.effectiveCost?.(v,'trading_post')||NS.V08?.BUILD_COSTS?.trading_post||{};
 for(const k of ['wood','stone'])if(buildMaterialAvailable32E4(v,w,t.id,k)+1e-9<Number(cost[k]||0))return'MATERIALS';
 const goldAvail=marketGold32E4(v,w)+Math.max(0,Number(v.gold||0)-4);if(goldAvail+1e-9<Number(cost.gold||0))return'FINANCE';return'READY';
}
function advanceIntent32E4(v,w,source='SEASON'){
 const s=state32E4(v),st=stats32E4(w),now=cal32E4(w);let i=s.intent;
 if(i){
  const t=w.map.get(Number(i.tileId));if(t?.hasBuilding?.('trading_post')){completeIntent32E4(v,w,i);i=null;}
  else if(now>Number(i.expiresCal||0)){st.expired++;w.telemetry?.record?.('TRADE_NETWORK_INTENT_EXPIRED32E4',w,{village:v.name,villageId:v.id,tileId:i.tileId,blocker:i.blocker||'NONE'});s.intent=null;i=null;}
 }
 if(!i){if(now-Number(s.lastPlanCal||-99999)<90)return false;i=plan32E4(v,w);if(!i)return false;}
 if(pendingTP32E4(v,i.tileId)){i.status='BUILDING';i.blocker='NONE';return false;}
 let b=diagnose32E4(v,w,i);
 if(b==='SPACE_PREP'){
  const t=w.map.get(Number(i.tileId));if(!busyTile32E4(v,t.id)&&v.startLandDevelopment?.(w,t.id,'V32E4_TRADE_NETWORK_SPACE')){i.status='SPACE_PREP';i.blocker='SPACE_PREP';i.updatedCal=now;st.spacePreps++;countBlock32E4(w,'SPACE_PREP');w.telemetry?.record?.('TRADE_NETWORK_SPACE_PREP32E4',w,{village:v.name,villageId:v.id,tileId:t.id,potential:+potentialSpace32E4(v,t).toFixed(2)});return true;}b='SPACE';
 }
 if(b!=='READY'){
  if(i.blocker!==b)w.telemetry?.record?.('TRADE_NETWORK_BLOCKED32E4',w,{village:v.name,villageId:v.id,tileId:i.tileId,from:i.blocker||'NONE',to:b,source});
  i.status='BLOCKED';i.blocker=b;i.updatedCal=now;countBlock32E4(w,b);return false;
 }
 const ok=!!v.startConstruction?.(w,Number(i.tileId),'trading_post','V32E4_STRATEGIC_TRADE_POST');
 if(ok){i.status='BUILDING';i.blocker='NONE';i.updatedCal=now;st.strategicStarts++;w.telemetry?.record?.('TRADE_POST_STRATEGIC_STARTED32E4',w,{village:v.name,villageId:v.id,tileId:i.tileId,reason:i.reason,score:+Number(i.score||0).toFixed(1),newPartners:Number(i.newPartners||0),routeCostSavedEst:+Number(i.costSaved||0).toFixed(2),targetPartners:i.targetNames||[],source});return true;}
 const detail=NS.V032E6?.classifyTradeGate?.(v,w,i)||'PAYMENT_OR_STRATEGIC_GATE';i.status='BLOCKED';i.blocker=detail;i.updatedCal=now;countBlock32E4(w,detail);w.telemetry?.record?.('TRADE_NETWORK_BLOCKED32E4',w,{village:v.name,villageId:v.id,tileId:i.tileId,from:'READY',to:detail,legacyBlocker:'PAYMENT_OR_STRATEGIC_GATE',source});return false;
}

/* Strategic intent gets first chance at a quarterly construction slot. */
const seasonE3=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const _t=NS._e9Now?NS._e9Now():0;try{if(this.status==='active')advanceIntent32E4(this,w,'SEASON_PRE');}catch(e){console.error('E4 trade planner failed',e);}if(NS._e9PerfAdd)NS._e9PerfAdd(w,'tradePlanner',NS._e9Now()-_t);return seasonE3.call(this,w);};

/* ---------- telemetry ---------- */
const snapE3=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snapE3.call(this,w,reason,note);if(!s)return s;const x=stats32E4(w),g={tradePlannerRuns32E4:Number(x.plannerRuns||0),tradeCandidateEvaluations32E4:Number(x.candidateEvaluations||0),tradePlannerRouteChecks32E4:Number(x.routeChecks||0),tradeNetworkIntents32E4:Number(x.intents||0),tradePostStrategicStarts32E4:Number(x.strategicStarts||0),tradeNetworkCompleted32E4:Number(x.completed||0),tradePartnersUnlocked32E4:Number(x.partnersUnlocked||0),tradeRouteCostSavedEst32E4:+Number(x.routeCostSavedEst||0).toFixed(2),tradeIntentBlockedProject32E4:Number(x.blockedProject||0),tradeIntentBlockedFinance32E4:Number(x.blockedFinance||0),tradeIntentBlockedMaterials32E4:Number(x.blockedMaterials||0),tradeIntentBlockedSpace32E4:Number(x.blockedSpace||0),tradeIntentBlockedOther32E4:Number(x.blockedOther||0)};
 Object.assign(s.global,g);
 for(const r of s.villages||[]){const v=w.villages.find(q=>q.id===r.id);if(!v)continue;const z=state32E4(v),i=z.intent;r.tradeIntentStatus32E4=i?.status||'NONE';r.tradeIntentBlocker32E4=i?.blocker||'NONE';r.tradeIntentTargetTile32E4=i?.tileId??null;r.tradeIntentNewPartners32E4=Number(i?.newPartners||0);r.tradeIntentRouteSaving32E4=+Number(i?.costSaved||0).toFixed(2);r.tradeRouteMarketBlocks32E4=Number(z.routeBlockers?.NO_ROUTE_MARKET||0);r.tradeRouteRangeBlocks32E4=Number(z.routeBlockers?.NO_ROUTE_RANGE||0);r.tradeRoutePathBlocks32E4=Number(z.routeBlockers?.NO_ROUTE_PATH||0);}
 const ys=(this.yearlySummaries||[]).find(q=>Number(q.year)===Number(w.year));if(ys)Object.assign(ys.global,g);return s;
};
const csvE3=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){
 const base=csvE3.call(this),lines=base.split('\n');if(!lines.length)return base;
 const globalKeys=['tradePlannerRuns32E4','tradeCandidateEvaluations32E4','tradePlannerRouteChecks32E4','tradeNetworkIntents32E4','tradePostStrategicStarts32E4','tradeNetworkCompleted32E4','tradePartnersUnlocked32E4','tradeRouteCostSavedEst32E4','tradeIntentBlockedProject32E4','tradeIntentBlockedFinance32E4','tradeIntentBlockedMaterials32E4','tradeIntentBlockedSpace32E4','tradeIntentBlockedOther32E4'],rowKeys=['tradeIntentStatus32E4','tradeIntentBlocker32E4','tradeIntentTargetTile32E4','tradeIntentNewPartners32E4','tradeIntentRouteSaving32E4','tradeRouteMarketBlocks32E4','tradeRouteRangeBlocks32E4','tradeRoutePathBlocks32E4'],all=[...globalKeys,...rowKeys],q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
 lines[0]+=','+all.map(q).join(',');let n=1;for(const s of this.snapshots||[])for(const r of s.villages||[]){if(n>=lines.length)break;lines[n++]+=','+[...globalKeys.map(k=>s.global?.[k]),...rowKeys.map(k=>r?.[k])].map(q).join(',');}return lines.join('\n');
};
const jsonE3=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonE3.call(this,w);d.version='0.32E4';Object.assign(d.worldSummary,{v32E4Revision:REV32E4,routeBlocker32E4:'route endpoints use null checks so tile 0 is valid; NO_ROUTE resolves to MARKET/RANGE/PATH with contact-aware semantics',strategicTradePlanner32E4:'quarterly low-frequency planner evaluates at most six populated owned candidate settlements and estimates partner unlocks / land-route cost savings before creating a persistent Trading Post intent',tradeNetworkIntent32E4:'blocked strategic Trading Post plans persist up to 720 calendar days and retry before ordinary seasonal construction; build-space preparation may start when accessible potential exists',physicalTradeBuild32E4:'approved intents use the existing conserved startConstruction/payBuild path and therefore consume real materials, Gold/funding, project capacity and labor; no synthetic route node is created',performancePolicy32E4:'planner records integer operation counters; no per-candidate performance.now timer is used'});return d;};

/* ---------- persistence ---------- */
function attachE4(w,src=null){w=NS.V032E3?.attachWorld?.(w,src)||w;if(!w)return w;w.v32e4TradeStats={...stats32E4(w),...(src?.v32e4TradeStats||w.v32e4TradeStats||{})};for(const v of w.villages||[]){v._world=w;state32E4(v);}return w;}
const villageSerE3=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSerE3.call(this);d.v32e4TradeNetwork=this.v32e4TradeNetwork||null;return d;};
const serE3=NS.World.prototype.serialize,fromE3=NS.World.from;
NS.World.prototype.serialize=function(){const d=serE3.call(this);d.version='0.32E4';d.v32e4={revision:REV32E4,strategicTradeNetwork:true,routeBlockerCleanup:true,persistentTradeIntent:true,combat:false};d.v32e4TradeStats={...stats32E4(this)};return d;};
NS.World.from=function(d){if(d?.version==='0.32E4'){const w=fromE3({...d,version:'0.32E3'});return attachE4(w,d);}return attachE4(fromE3(d),d);};

/* ---------- UI / patch notes ---------- */
if(NS.UI){
 const setWorldE3=NS.UI.prototype.setWorld,headerE3=NS.UI.prototype.renderHeader,contentE3=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.setWorld=function(w){return setWorldE3.call(this,attachE4(w));};
 NS.UI.prototype.renderHeader=function(){headerE3.call(this);document.title='Village Observer V0.32E4';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32E4</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32E4 Strategic Trade Network V1 · route blocker cleanup · persistent Trading Post intent';};
 NS.UI.prototype.renderVillageContent=function(){contentE3.call(this);if(this.sub!=='economy')return;const root=this.q('villageContent'),v=this.world?.selectedVillage;if(!root||!v)return;const s=state32E4(v),i=s.intent,t=i?this.world.map.get(Number(i.tileId)):null,blk=s.routeBlockers||{},last=s.lastCompleted;const target=i&&t?`(${t.x},${t.y})`:i?`#${i.tileId}`:'—',partners=i?.targetNames?.length?i.targetNames.join(', '):'—',body=i?`<div class="v32e4-grid"><span>상태 <b>${i.status}</b></span><span>목표 <b>${target}</b></span><span>근거 <b>${i.reason}</b></span><span>예상 신규 상대 <b>+${Number(i.newPartners||0)}</b></span><span>예상 route 절감 <b>${Number(i.costSaved||0).toFixed(2)}</b></span><span>blocker <b>${i.blocker||'NONE'}</b></span></div><div class="small muted">대상 상대국: ${partners}</div>`:`<div class="small muted">현재 유지 중인 전략 교역소 건설 intent가 없습니다.${last?` · 최근 완료 tile #${last.tileId}, 신규 상대 +${last.unlocked}`:''}</div>`;const inner=`<strong>🌐 E4 전략 교역망 계획</strong>${body}<div class="small muted" style="margin-top:6px">현재 route blocker · MARKET ${Number(blk.NO_ROUTE_MARKET||0)} · RANGE ${Number(blk.NO_ROUTE_RANGE||0)} · PATH ${Number(blk.NO_ROUTE_PATH||0)}</div>`;let box=root.querySelector('.v32e4-trade-plan');if(box)box.innerHTML=inner;else root.insertAdjacentHTML('beforeend',`<div class="v32e4-trade-plan">${inner}</div>`);};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32E4'))NS.PATCH_NOTES.unshift({version:'V0.32E4',date:'2026-09-27',title:'Strategic Trade Network V1',summary:'TRADE를 선호하는 국가가 단순 정책 점수에 머무르지 않고, 실제 Trading Post 후보가 교역 상대와 route cost를 얼마나 개선하는지 평가해 물리적 건설 intent로 연결합니다.',sections:[['0순위 교역 endpoint 버그',['tileId 0 교역소를 falsy로 취급하던 D5 route/quote 판정을 null-check로 수정합니다.','NO_ROUTE의 모호한 fallback을 신규 관측에서는 MARKET / RANGE / PATH로 정리하고 market-contact 부족도 MARKET으로 분리합니다.']],['전략 교역망 Planner',['분기마다 최대 6개의 실제 거주 Settlement 후보만 평가해 planner 비용을 제한합니다.','기존 Trading Post와 외국 교역소 사이의 물리적 land-route를 기준으로 신규 교역 상대 개방, route cost 절감, 현재 막힌 수입·수출 기회를 함께 점수화합니다.','교역외교형 또는 현재 TRADE policy 상태는 전략 교역망 투자 점수에 보너스를 받지만, 다른 AI도 충분한 물리적 이득이 있으면 건설할 수 있습니다.']],['Persistent Infrastructure Intent',['선정된 Trading Post 목표는 최대 720 calendar days 유지됩니다.','프로젝트 슬롯·자금·자재·공간 때문에 즉시 건설하지 못해도 다음 분기에 같은 목표를 재시도합니다.','자재 진단은 대상 타일까지 실제 건설 물류로 도달 가능한 wood/stone을 합산하며, 진단 자체가 행정 물류 누적 통계를 증가시키지 않도록 복구합니다.','현재 공간은 부족하지만 개발 가능한 여유가 있으면 실제 토지정비부터 시작합니다.']],['Physical build',['교역소는 기존 startConstruction/payBuild 경로를 사용하므로 실제 목재·석재·Gold/시장자금·프로젝트 슬롯·건설 노동을 소비합니다.','가상의 교역 노드나 즉시 완공 보너스를 만들지 않습니다.']],['관측·성능',['국가 경제 탭에 목표 위치·근거·예상 신규 상대·route 절감·현재 blocker를 표시합니다.','planner run/candidate/route-check와 intent/start/completion/blocker를 operation counter로 기록하며 후보별 고빈도 timer는 추가하지 않습니다.']]]});
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`.v32e4-trade-plan{margin:12px 0;padding:11px;border:1px solid rgba(110,210,175,.30);border-radius:12px;background:rgba(75,170,135,.07)}.v32e4-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin:8px 0}.v32e4-grid span{padding:5px 7px;border-radius:8px;background:rgba(255,255,255,.04);font-size:11px}@media(max-width:760px){.v32e4-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(st);}
(function(){
 const KEY='village-observer-v0-32e4',fallback=['village-observer-v0-32e3','village-observer-v0-32e2','village-observer-v0-32e1','village-observer-v0-32d5','village-observer-v0-32d4','village-observer-v0-32d3','village-observer-v0-32d2','village-observer-v0-32d1','village-observer-v0-32d','village-observer-v0-32c2'];
 function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v032E4-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v032E4-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v032E4-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){const data=JSON.parse(await file.text()),w=NS.V019.worldFromMapData(data);return attachE4(NS.V032E3?.attachWorld?.(w)||w);}};
})();
NS.V032E4={revision:REV32E4,attachWorld:attachE4,plan:plan32E4,advanceIntent:advanceIntent32E4,routeReason:routeReason32E4,diagnose:diagnose32E4,buildMaterialAvailable:buildMaterialAvailable32E4};
try{const ui=window.villageObserver;if(ui){ui.world=attachE4(ui.world);ui.renderHeader?.();ui.render?.();}}catch(e){console.error('V0.32E4 startup attach failed',e);}
})(window.VSim);
