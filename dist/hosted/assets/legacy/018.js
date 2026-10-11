
window.VSim=window.VSim||{};
(function(NS){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const STOCK=['food','wood','stone'];
const ACTIVE=NS.V09?.activeCondition||35;
const MAINT=NS.V09?.MAINT_BASE||{};
const MAINT_RATE=.02;
const TRADE_DAYS=180;

/* ============================================================
   V0.10 · smarter national AI / timber economy / balance codex
   Version policy remains 0.10 -> 0.11 -> ... ; never auto 1.0.
   ============================================================ */

/* ---------- slower natural wood recovery ---------- */
const WOOD_REGEN={plain:.012,grass:.028,forest:.22,rock:.008,mountain:.015,water:0};
for(const [k,v] of Object.entries(WOOD_REGEN))if(NS.TERRAIN[k])NS.TERRAIN[k].regen.wood=v;

/* ---------- building / settlement helpers ---------- */
function threshold(type){return ['town_hall','house','outpost'].includes(type)?15:(type==='road'?25:ACTIVE);}
function conds(t){if(!t)return[];if(!Array.isArray(t.buildingCondition))t.buildingCondition=[];while(t.buildingCondition.length<(t.buildings||[]).length)t.buildingCondition.push(100);if(t.buildingCondition.length>t.buildings.length)t.buildingCondition.length=t.buildings.length;return t.buildingCondition;}
function buildingActiveAt(t,i){return (conds(t)[i]??100)>=threshold(t.buildings[i]);}
function physical(t,type){return !!t?.buildings?.includes(type);}
function activeLocalCapacity(t){if(!t)return 0;let n=0;conds(t);for(let i=0;i<t.buildings.length;i++)if(buildingActiveAt(t,i))n+=NS.BUILDINGS[t.buildings[i]]?.capacity||0;return n;}
function tileMaintenance(t){let wood=0,stone=0,labor=0;if(!t)return{wood,stone,labor};for(const b of t.buildings||[]){const m=MAINT[b]||{wood:10,stone:3,labor:.3};wood+=(m.wood||0)*MAINT_RATE/4;stone+=(m.stone||0)*MAINT_RATE/4;labor+=m.labor||0;}return{wood,stone,labor};}
function maintenanceSummary(v,w){let total=0,inactive=0,sum=0;for(const id of v.territory){const t=w.map.get(id);if(!t)continue;conds(t);for(let i=0;i<t.buildings.length;i++){total++;sum+=t.buildingCondition[i]??100;if(!buildingActiveAt(t,i))inactive++;}}return{total,inactive,active:total-inactive,avg:total?sum/total:100,inactiveShare:total?inactive/total:0};}

/* ---------- housing strain from inactive / insufficient housing ---------- */
const metabolism09=NS.Person.prototype.metabolism;
NS.Person.prototype.metabolism=function(v,w,worked=true){
 metabolism09.call(this,v,w,worked);
 const t=w.map.get(this.homeTileId);if(!t||t.ownerId!==v.id)return;
 const shared=NS.V034D2A?.housingAt?.(v,w,t.id),pop=shared?shared.population:v.tileResidents(t.id).filter(p=>p.alive).length,cap=shared?shared.activeCapacity:activeLocalCapacity(t),short=Math.max(0,pop-cap),severity=pop?short/pop:0;
 if(severity>0){
  this.housingStrainDays=(this.housingStrainDays||0)+1;
  if(this.housingStrainDays>20){this.energy=clamp(this.energy-.035-.11*severity,0,100);this.happiness=clamp(this.happiness-.015-.045*severity,0,100);}
  if(this.housingStrainDays>45)this.health=clamp(this.health-.01-.035*severity,0,100);
 }else this.housingStrainDays=Math.max(0,(this.housingStrainDays||0)-2);
};
NS.Village.prototype.settlementAttractiveness=function(w,t,p){
 if(!t)return-Infinity;const shared=NS.V034D2A?.housingAt?.(this,w,t.id),pop=shared?shared.population:this.tileResidents(t.id).filter(x=>x.alive).length,cap=shared?shared.activeCapacity:activeLocalCapacity(t);if(cap<=pop)return -120-(pop-cap)*18;
 t.syncResources(w.ordinalDay());let s=(cap-pop)*5-w.map.distance(this.coreTileId,t.id)*1.1;
 if(pop<=1&&t.id!==this.coreTileId)s+=15;if((p?.housingStrainDays||0)>30)s+=8;
 if(p?.job==='농부'||p?.job==='채집꾼'||p?.job==='사냥꾼')s+=t.ratio('food',w.ordinalDay())*18;
 if(p?.job==='목수')s+=t.ratio('wood',w.ordinalDay())*18;if(p?.job==='광부')s+=(t.ratio('stone',w.ordinalDay())+t.ratio('gold',w.ordinalDay()))*11;
 if(t.id===this.coreTileId)s+=4;return s;
};


/* Road-level wording in the technology UI/codex. */
if(NS.TECH.ROADS)NS.TECH.ROADS.effects=['도로 건설 해금','활성 도로가 Lv.1 흙길이 됨','도로 타일 경로비 ×0.78'];
if(NS.TECH.ENGINEERING)NS.TECH.ENGINEERING.effects=['도로 목재·석재 건설비 -25% 추가','기존 활성 도로 자동 Lv.2 석재도로','도로 타일 경로비 ×0.62','암지·산악 개척 기간 -15%'];
if(NS.TECH.URBANIZATION)NS.TECH.URBANIZATION.effects=['타일당 주택 한도 6 → 8','창고 저장량 +15%','기존 활성 도로 자동 Lv.3 간선도로','도로 타일 경로비 ×0.48'];

/* ---------- road levels: only physical active roads count ---------- */
function roadLevel(v){return v?.hasTech?.('ROADS')?1:0;}
function roadFactor(level){return level>=1?.62:1;}
function activeRoad(t){if(!t)return false;conds(t);for(let i=0;i<t.buildings.length;i++)if(t.buildings[i]==='road'&&buildingActiveAt(t,i))return true;return false;}
NS.Village.prototype.roadLevel=function(){return roadLevel(this);};
NS.Village.prototype.roadLabel=function(){return['도로 없음','Lv.1 흙길','Lv.2 석재도로','Lv.3 간선도로'][roadLevel(this)];};

function pathSearch(w,sourceIds,targetIds,ownerId=null){
 const targets=new Set(targetIds),dist=new Map(),heap=[];
 const push=item=>{heap.push(item);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p][0]<=item[0])break;heap[i]=heap[p];i=p;}heap[i]=item;};
 const pop=()=>{if(!heap.length)return null;const root=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let l=i*2+1,r=l+1;if(l>=heap.length)break;let c=r<heap.length&&heap[r][0]<heap[l][0]?r:l;if(heap[c][0]>=last[0])break;heap[i]=heap[c];i=c;}heap[i]=last;}return root;};
 for(const id of sourceIds){dist.set(id,0);push([0,id,id]);}
 while(heap.length){const [d,id,origin]=pop();if(d!==dist.get(id))continue;if(targets.has(id))return{cost:d,sourceId:origin,targetId:id};
  for(const n of w.map.neighbors4(id)){if(!NS.TERRAIN[n.terrain].passable)continue;if(ownerId!=null&&n.ownerId!==ownerId)continue;let step=NS.TERRAIN[n.terrain].tradeCost;
   if(activeRoad(n)&&n.ownerId!=null){const owner=w.villages[n.ownerId];step*=roadFactor(roadLevel(owner));}
   const nd=d+step;if(nd<(dist.get(n.id)??Infinity)){dist.set(n.id,nd);push([nd,n.id,origin]);}
  }
 }
 return{cost:Infinity,sourceId:null,targetId:null};
}
function roadSignature(w){return w.activeVillages.map(v=>`${v.id}:${roadLevel(v)}:${[...v.territory].filter(id=>activeRoad(w.map.get(id))).join('.')}`).join('|');}
NS.World.prototype.routeInfo=function(a,b){
 const A=a.tradingPosts(),B=b.tradingPosts(),range=Math.min(a.tradeRange(this),b.tradeRange(this));
 if(!A.length||!B.length)return{reachable:false,cost:Infinity,range,aId:a.id,bId:b.id,aTileId:null,bTileId:null,sourceTileId:null,targetTileId:null};
 let minMan=Infinity,minPair=[null,null];for(const x of A)for(const y of B){const md=this.map.distance(x,y);if(md<minMan){minMan=md;minPair=[x,y];}}
 if(minMan*.48>range)return{reachable:false,cost:minMan,range,aId:a.id,bId:b.id,aTileId:minPair[0],bTileId:minPair[1],sourceTileId:minPair[0],targetTileId:minPair[1],lowerBoundOnly:true};
 const key=[a.id,b.id].sort((x,y)=>x-y).join('-'),sig=`${a.id}:${A.join('.')}|${b.id}:${B.join('.')}|${roadSignature(this)}`,day=this.ordinalDay();this.tradeRouteCache=this.tradeRouteCache||{};const cached=this.tradeRouteCache[key];
 if(cached&&cached.sig===sig&&day-cached.day<20){const info={...cached.info,range};info.reachable=Number.isFinite(info.cost)&&info.cost<=range;return info;}
 const p=pathSearch(this,A,B,null),info={cost:p.cost,aTileId:p.sourceId,bTileId:p.targetId,aId:a.id,bId:b.id,range,reachable:Number.isFinite(p.cost)&&p.cost<=range,sourceTileId:p.sourceId,targetTileId:p.targetId};this.tradeRouteCache[key]={day,sig,info:{...info}};return info;
};
NS.Village.prototype.internalPathCost=function(fromId,toId){const w=this._world;if(!w)return Infinity;const bucket=Math.floor(w.ordinalDay()/5);if(!w._v10InternalPathCache||w._v10InternalPathCache.bucket!==bucket)w._v10InternalPathCache={bucket,map:new Map()};const a=Math.min(fromId,toId),b=Math.max(fromId,toId),key=`${this.id}:${a}:${b}:${roadLevel(this)}`;if(w._v10InternalPathCache.map.has(key))return w._v10InternalPathCache.map.get(key);const cost=pathSearch(w,[fromId],[toId],this.id).cost;w._v10InternalPathCache.map.set(key,cost);return cost;};
NS.Village.prototype.internalLogisticsCapacity=function(fromId,toId,resource='food',construction=false){
 const cost=this.internalPathCost(fromId,toId);if(!Number.isFinite(cost))return{cost,capacity:0};let base={food:14,wood:12,stone:10}[resource]||10;
 if(this.hasTech('CART'))base+={food:8,wood:6,stone:5}[resource]||0;if(this.hasTech('ADMINISTRATION'))base*=1.25;let penalty=this.hasTech('ADMINISTRATION')?.075:.10;
 let eff=1/(1+Math.max(0,cost-1)*penalty),srcPop=Math.max(1,this.tileResidents(fromId).length);eff*=clamp(.75+srcPop*.05,.8,1.35);if(construction)base*=1.45;return{cost,capacity:Math.max(1.5,base*eff)};
};

/* ---------- internal stock balancing: food + wood ---------- */
NS.World.prototype.processInternalLogistics=function(){
 for(const v of this.activeVillages){const occupied=[...v.territory].filter(id=>v.tileResidents(id).some(p=>p.alive));if(occupied.length<2)continue;
  for(const rid of occupied){const rdays=v.settlementReserveDays(rid);if(rdays>=24)continue;const donorRows=occupied.filter(id=>id!==rid&&v.settlementReserveDays(id)>55).map(id=>({id,...v.internalLogisticsCapacity(id,rid,'food',false),days:v.settlementReserveDays(id)})).filter(x=>x.capacity>0).sort((a,b)=>(b.days-a.days)||a.cost-b.cost);if(!donorRows.length)continue;
   const q=donorRows[0],donor=v.stockAt(q.id,'food'),needPop=v.tileResidents(rid).length,need=Math.max(0,needPop*.36*38-v.stockAt(rid,'food')),surplus=Math.max(0,donor-v.tileResidents(q.id).length*.36*45),qty=Math.min(q.capacity,need,surplus);if(qty<1)continue;v.withdrawAt(q.id,'food',qty);const put=v.depositAt(rid,'food',qty);if(put<qty)v.depositAt(q.id,'food',qty-put);v.logisticsStats.moves++;v.logisticsStats.foodMoved=(v.logisticsStats.foodMoved||0)+put;if(put>=3)this.telemetry.record('INTERNAL_LOGISTICS',this,{village:v.name,resource:'food',qty:+put.toFixed(1),fromTileId:q.id,toTileId:rid,routeCost:+q.cost.toFixed(2),capacity:+q.capacity.toFixed(2)});
  }
  /* Wood is slower-moving than food; rebalance roughly every 15 days. */
  if(Math.floor(this.ordinalDay()/5)%3!==0)continue;
  const caps=id=>v.settlementCaps(id),ratio=id=>v.stockAt(id,'wood')/Math.max(1,caps(id).wood),nationalTarget=v.targetWood(this),exportMode=v.wood>nationalTarget*1.25;
  const receivers=occupied.filter(id=>ratio(id)<.30||(exportMode&&this.map.get(id).hasBuilding('trading_post')&&ratio(id)<.55)).sort((a,b)=>ratio(a)-ratio(b));
  for(const rid of receivers){const targetRatio=this.map.get(rid).hasBuilding('trading_post')&&exportMode?.58:.45,need=Math.max(0,caps(rid).wood*targetRatio-v.stockAt(rid,'wood'));if(need<2)continue;
   const donors=occupied.filter(id=>id!==rid&&ratio(id)>.68).map(id=>{const q=v.internalLogisticsCapacity(id,rid,'wood',false),surplus=Math.max(0,v.stockAt(id,'wood')-caps(id).wood*.55);return{id,...q,surplus,score:surplus-Math.max(0,q.cost)*2};}).filter(x=>x.capacity>0&&x.surplus>1.5).sort((a,b)=>b.score-a.score);if(!donors.length)continue;const q=donors[0],qty=Math.min(need,q.surplus,q.capacity);if(qty<1.5)continue;v.withdrawAt(q.id,'wood',qty);const put=v.depositAt(rid,'wood',qty);if(put<qty)v.depositAt(q.id,'wood',qty-put);v.logisticsStats.moves++;v.logisticsStats.woodMoved=(v.logisticsStats.woodMoved||0)+put;if(put>=2)this.telemetry.record('INTERNAL_LOGISTICS',this,{village:v.name,resource:'wood',qty:+put.toFixed(1),fromTileId:q.id,toTileId:rid,routeCost:+q.cost.toFixed(2),capacity:+q.capacity.toFixed(2),reason:exportMode&&this.map.get(rid).hasBuilding('trading_post')?'EXPORT_STAGING':'STOCK_BALANCE'});
  }
 }
};

/* Construction and maintenance use the new road-level capacities too. */
function planResource(v,w,targetId,k,need){let left=need,plan=[];const local=Math.min(left,v.stockAt(targetId,k));if(local>0){plan.push([targetId,local,0]);left-=local;}const donors=[...v.territory].filter(id=>id!==targetId&&v.stockAt(id,k)>0).map(id=>({id,...v.internalLogisticsCapacity(id,targetId,k,true),stock:v.stockAt(id,k)})).filter(x=>x.capacity>0).sort((a,b)=>a.cost-b.cost);for(const q of donors){if(left<=1e-9)break;const n=Math.min(left,q.stock,q.capacity);if(n>0){plan.push([q.id,n,q.cost]);left-=n;}}return{ok:left<=1e-6,plan,missing:left};}
NS.Village.prototype.payBuild=function(tileId,cost){const w=this._world;if(!w||!this.territory.has(tileId)||this.gold+1e-9<(cost.gold||0))return false;const plans={};for(const k of STOCK){const need=cost[k]||0;if(!need)continue;const p=planResource(this,w,tileId,k,need);if(!p.ok)return false;plans[k]=p;}this.gold-=cost.gold||0;for(const [k,p] of Object.entries(plans))for(const [id,q] of p.plan){const took=this.withdrawAt(id,k,q);if(id!==tileId&&took>0){this.logisticsStats.moves++;const stat=k==='food'?'foodMoved':k==='wood'?'woodMoved':'stoneMoved';this.logisticsStats[stat]=(this.logisticsStats[stat]||0)+took;}}return true;};

/* ---------- timber-aware foreign trade ---------- */
const deal09=NS.World.prototype.dealCandidate;
NS.World.prototype.dealCandidate=function(buyer,seller,resource,route){
 if(resource!=='wood')return deal09.call(this,buyer,seller,resource,route);
 if(!route.reachable||this.reverseTradeBlocked?.(buyer,seller,resource,60))return null;const ep=this.tradeEndpoints(route,buyer,seller);if(ep.buyerTileId==null||ep.sellerTileId==null)return null;
 const bt=this.map.get(ep.buyerTileId),st=this.map.get(ep.sellerTileId);if(!bt||!st||bt.ownerId!==buyer.id||st.ownerId!==seller.id||!bt.hasBuilding('trading_post')||!st.hasBuilding('trading_post'))return null;
 const bc=buyer.settlementCaps(bt.id),sc=seller.settlementCaps(st.id),br=buyer.resourceRatios(this).wood,sr=seller.resourceRatios(this).wood,bTarget=buyer.targetWood(this),sTarget=seller.targetWood(this);
 const desired=bTarget*(br<.22?1.30:br<.40?1.18:1.05),nationalNeed=Math.max(0,desired-buyer.wood),localRoom=Math.max(0,bc.wood*.88-buyer.stockAt(bt.id,'wood')),need=Math.min(nationalNeed,localRoom);
 const floor=sTarget*(sr>.60?.88:sr>.40?1.0:1.15),nationalExcess=Math.max(0,seller.wood-floor),localExcess=Math.max(0,seller.stockAt(st.id,'wood')-sc.wood*.32),excess=Math.min(nationalExcess,localExcess);
 if(need<=1.5||excess<=1.5)return null;let qty=Math.min(need,excess,buyer.merchantCapacity(),seller.merchantCapacity(),32),unit=.28*(1+Math.min(.38,nationalNeed/Math.max(1,bTarget)*.22)),feeMult=(buyer.tradeFeeMultiplier()+seller.tradeFeeMultiplier())/2,transportUnit=route.cost*.018*feeMult,budget=Math.max(0,buyer.gold-6);qty=Math.min(qty,budget/Math.max(.01,unit+transportUnit));if(qty<1.5)return null;const price=qty*unit,fee=qty*transportUnit+.2*route.cost*feeMult,total=price+fee;if(total>budget+.001)return null;
 const richness=Math.max(0,sr-br),score=need*1.65+excess*.18+richness*28+(br<.20?12:0);return{buyer,seller,resource,qty,price,fee,total,routeCost:route.cost,buyerTileId:ep.buyerTileId,sellerTileId:ep.sellerTileId,score};
};
const tradePressure09=NS.Village.prototype.tradePressure;
NS.Village.prototype.tradePressure=function(w){const base=tradePressure09.call(this,w),tw=this.targetWood(w),woodNeed=Math.max(0,tw*1.20-this.wood)/Math.max(1,tw),rr=this.resourceRatios(w),woodStructural=rr.wood<.25?Math.max(0,.25-rr.wood)*2.2:0;return clamp(Math.max(base,woodNeed+woodStructural),0,1.6);};

/* ---------- smarter utility AI with state + anti-loop memory ---------- */
function ensureAI(v){v.aiMemory=v.aiMemory||{lastAction:null,streak:0,decisions:0};return v.aiMemory;}
NS.Village.prototype.strategicProfile=function(w){
 const stress=this.foodStressProfile(),avg=this.foodReserveDays(),pop=this.population(),cap=Math.max(1,this.capacity(w)),occ=pop/cap,tw=Math.max(1,this.targetWood(w)),ts=Math.max(1,this.targetStone(w)),woodStock=this.wood/tw,stoneStock=this.stone/ts,rr=this.resourceRatios(w),maint=maintenanceSummary(this,w),front=this.expansionCandidates(w).length,settlers=this.availableSettlers().length,density=pop/Math.max(1,this.territory.size),stagnantYears=Math.max(0,(w.ordinalDay()-(this.lastExpansionClaimDay||w.ordinalDay()))/120),access=this.tradingPosts().length?this.tradeAccess(w):{reachable:0};
 const woodDef=clamp(1-woodStock,0,1.5),stoneDef=clamp(1-stoneStock,0,1.5),foodUrgency=clamp(stress.score+Math.max(0,25-avg)/35,0,1.5),housingUrgency=clamp((occ-.80)/.35,0,1.5),maintenanceUrgency=clamp(maint.inactiveShare*1.5+Math.max(0,82-maint.avg)/70,0,1.5);
 let mode='균형 발전';if(foodUrgency>.55)mode='식량 안정';else if(maintenanceUrgency>.55)mode='기반시설 복구';else if(housingUrgency>.55)mode='주거 확충';else if((woodDef>.35||stoneDef>.45)&&access.reachable>0)mode='자원 교역';else if(front&&settlers>=2&&density>4.2&&stress.stressedShare<.20)mode='영토 확장';else if(NS.AIProfileCompat(this,'tradeDiplomacy')>.5&&access.reachable>0)mode='교역 성장';
 return{stress,avg,pop,occ,woodStock,stoneStock,woodDef,stoneDef,rr,maint,front,settlers,density,stagnantYears,reachable:access.reachable,foodUrgency,housingUrgency,maintenanceUrgency,mode};
};
NS.VillageBrain.prototype.baseScores=function(v,w){
 const x=v.strategicProfile(w),avgRel=v.averageVillageRelation(),tradeP=v.tradePressure(w),hostile=Object.values(v.relations||{}).filter(n=>n<-20).length;
 let s={
  MAINTAIN:17+x.maintenanceUrgency*48+(x.occ<.65?5:0),
  FOOD:12+x.foodUrgency*72+Math.max(0,.20-x.rr.food)*30,
  HOUSING:10+x.housingUrgency*74,
  TRADE:9+tradeP*22+x.woodDef*35+x.stoneDef*18+x.foodUrgency*13+x.reachable*2.5+Math.max(0,avgRel)*.035,
  SECURITY:10+v.threat*1.3+hostile*6,
  EXPAND:10+Math.max(0,x.density-4.0)*2.7+Math.min(6,x.front)+Math.min(26,Math.max(0,x.stagnantYears-4)*1.25)
 };
 s.EXPAND+=Math.max(0,.18-x.rr.food)*20+Math.max(0,.14-x.rr.wood)*12+Math.max(0,.11-x.rr.stone)*10;
 if(x.stress.stressedShare>.20)s.EXPAND-=8+(x.stress.stressedShare-.20)*55;if(x.stress.criticalShare>.12)s.EXPAND-=12+(x.stress.criticalShare-.12)*70;if(x.avg<20)s.EXPAND-=18;if(x.maint.inactiveShare>.20)s.EXPAND-=x.maint.inactiveShare*30;
 if(NS.AIProfileCompat(v,'survivalPriority')>.5){s.FOOD+=5;s.MAINTAIN+=4;s.EXPAND-=4;}else if(NS.AIProfileCompat(v,'tradeDiplomacy')>.5){s.TRADE+=7;s.EXPAND-=2;}else if(NS.AIProfileCompat(v,'territorialExpansion')>.5){s.EXPAND+=11;s.SECURITY+=2;}
 if(v.expansionProject||x.front===0||x.pop<9||x.settlers<2||x.pop<=v.territory.size+5)s.EXPAND=-140;if(v.tradingPosts().length===0)s.TRADE=-110;
 for(const k in s)s[k]+=(this.mods[k]||0);v._v10LastProfile=x;return s;
};
NS.VillageBrain.prototype.seasonalDecision=function(v,w){
 const base=this.baseScores(v,w),x=v._v10LastProfile||v.strategicProfile(w),mem=ensureAI(v),scored=Object.entries(base).map(([action,score])=>{let repeatPenalty=0;if(action===mem.lastAction&&mem.streak>=4){let urgency=0;if(action==='FOOD')urgency=Math.min(1,x.foodUrgency);else if(action==='TRADE')urgency=Math.min(1,v.tradePressure(w));else if(action==='MAINTAIN')urgency=Math.min(1,x.maintenanceUrgency);else if(action==='HOUSING')urgency=Math.min(1,x.housingUrgency);repeatPenalty=Math.min(14,(mem.streak-3)*1.5)*(1-urgency*.75);}const noise=Math.random()*3.2;return{action,score:+score.toFixed(2),repeatPenalty:+repeatPenalty.toFixed(2),noise:+noise.toFixed(2),final:+(score-repeatPenalty+noise).toFixed(2)};}).sort((a,b)=>b.final-a.final),choice=scored[0].action;
 if(mem.lastAction===choice)mem.streak++;else{mem.lastAction=choice;mem.streak=1;}mem.decisions++;mem.lastDecisionDay=w.ordinalDay();v.focus=choice;
 w.telemetry.record('AI_DECISION',w,{village:v.name,villageId:v.id,brain:this.label,choice,strategyMode:x.mode,scores:scored,signals:{foodReserveDays:+x.avg.toFixed(1),foodStress:+x.stress.score.toFixed(2),woodStockRatio:+x.woodStock.toFixed(2),stoneStockRatio:+x.stoneStock.toFixed(2),housingOccupancy:+x.occ.toFixed(2),inactiveBuildingShare:+x.maint.inactiveShare.toFixed(2),reachableTradeNations:x.reachable,stagnantYears:+x.stagnantYears.toFixed(1)},territory:v.territory.size,gold:+v.gold.toFixed(1),technologyCount:v.technologies.size,researchTarget:v.researchTarget});return choice;
};

/* ---------- save AI memory ---------- */
function ensureV10Nation(v,w){v._world=w;ensureAI(v);for(const p of v.residents||[])if(!Number.isFinite(p.housingStrainDays))p.housingStrainDays=0;}

/* ---------- telemetry ---------- */
const snapshot09=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snapshot09.call(this,w,reason,note);for(const r of s.villages){const v=w.villages.find(q=>q.id===r.id);if(!v)continue;const p=v.strategicProfile(w);r.aiStrategyMode=p.mode;r.woodStockTarget=+v.targetWood(w).toFixed(1);r.woodStockRatio=+p.woodStock.toFixed(3);r.roadLevel=roadLevel(v);r.roadTiles=[...v.territory].filter(id=>activeRoad(w.map.get(id))).length;r.housingStrainedResidents=v.residents.filter(x=>x.alive&&(x.housingStrainDays||0)>20).length;}return s;};
const toJSON09=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=toJSON09.call(this,w);d.version='0.10';d.worldSummary.woodRegen='reduced; timber-rich trade encouraged';d.worldSummary.aiModel='multi-signal utility + policy streak memory';d.worldSummary.roadModel='physical active roads only; 3 levels';return d;};

/* ---------- serialization / migration ---------- */
function attachV10World(w){NS.V09.attachWorld(w);w.map._worldRef=w;for(const v of w.villages)ensureV10Nation(v,w);w.tradeRouteCache={};return w;}
NS.V010={attachWorld:attachV10World,WOOD_REGEN,roadLevel,roadFactor,tileMaintenance,maintenanceSummary,activeLocalCapacity,tradeLineDays:TRADE_DAYS};
const serializeV09=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=serializeV09.call(this);d.aiMemory=this.aiMemory||{lastAction:null,streak:0,decisions:0};return d;};
const serializeW09=NS.World.prototype.serialize,fromW09=NS.World.from;
NS.World.prototype.serialize=function(){const d=serializeW09.call(this);d.version='0.10';d.v10={woodRegen:WOOD_REGEN,roadLevels:3,ai:'multi-signal-memory',codex:true};return d;};
NS.World.from=function(d){if(!['0.8','0.9','0.10'].includes(d.version))throw new Error('V0.8~V0.10 세이브만 불러올 수 있습니다.');const source=d.version,w=fromW09(source==='0.10'?{...d,version:'0.9'}:d);if(source==='0.10')for(let i=0;i<w.villages.length;i++)w.villages[i].aiMemory=d.villages?.[i]?.aiMemory||w.villages[i].aiMemory;return attachV10World(w);};

/* ---------- save / export ---------- */
(function(){const KEY10='village-observer-v0-10',KEY9='village-observer-v0-9',KEY8='village-observer-v0-8';function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY10,JSON.stringify(w.serialize()));},load(){const r=localStorage.getItem(KEY10)||localStorage.getItem(KEY9)||localStorage.getItem(KEY8);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v010-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v010-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v010-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));}};})();

/* ---------- encyclopedia ---------- */
function fmtCost(c){const p=[];if(c.food)p.push(`🌾 ${c.food}`);if(c.wood)p.push(`🪵 ${c.wood}`);if(c.stone)p.push(`🪨 ${c.stone}`);if(c.gold)p.push(`🪙 ${c.gold}`);return p.join(' · ')||'없음';}
function codexHTML(){
 const costs=NS.V08.BUILD_COSTS,effectText=k=>{const b=NS.BUILDINGS[k]||{},parts=[];if(b.capacity)parts.push(`수용 ${b.capacity}명`);const st=b.storage||{},ss=['food','wood','stone'].filter(x=>st[x]).map(x=>`${{food:'🌾',wood:'🪵',stone:'🪨'}[x]} +${st[x]}`);if(ss.length)parts.push(`저장 ${ss.join(' ')}`);if(k==='farmstead')parts.push('식량 자연회복 ×1.35 · 식량 채취 ×1.10');if(k==='quarry')parts.push('채석 기술 보유 시 암지·산 석재 채취 ×1.22');if(k==='trading_post')parts.push('국가간 교역 노드');if(k==='palisade')parts.push('국가 방어점수 +5');if(k==='road')parts.push('도로 등급에 따라 경로비 감소');return parts.join(' · ')||'직접 생산 효과 없음';},buildingRows=Object.keys(costs).filter(k=>k!=='expansion').map(k=>{const b=NS.BUILDINGS[k],m=MAINT[k]||{wood:10,stone:3,labor:.3};return`<div class="codex-row"><div><strong>${b?.icon||''} ${b?.label||k}</strong><div class="small muted">건설 ${fmtCost(costs[k])}</div><div class="small muted">${effectText(k)}</div></div><div class="small">분기 유지 🪵 ${(m.wood*MAINT_RATE/4).toFixed(2)} · 🪨 ${(m.stone*MAINT_RATE/4).toFixed(2)} · 노동 ${m.labor.toFixed(2)}</div></div>`;}).join('');
 const terrainRows=Object.entries(NS.TERRAIN).filter(([,t])=>t.passable).map(([id,t])=>`<div class="codex-row"><div><strong>${t.label}</strong><div class="small muted">경로비 ${t.tradeCost}</div></div><div class="small">자연회복/일 🌾 ${t.regen.food} · 🪵 ${t.regen.wood} · 🪨 ${t.regen.stone}<br><span class="muted">연간 목재 +${(t.regen.wood*120).toFixed(1)}</span></div></div>`).join('');
 const techRows=NS.TECH_ORDER.map(id=>{const t=NS.TECH[id];return`<div class="codex-row"><div><strong>${t.icon||''} ${t.label}</strong><div class="small muted">${t.branch} · ${t.cost} Knowledge</div></div><div class="small">${(t.effects||[]).join(' · ')}</div></div>`;}).join('');
 return`<div class="codex-tabs"><button class="active" data-codex="build">건물</button><button data-codex="prod">생산·자원</button><button data-codex="logi">물류·도로</button><button data-codex="techs">기술</button></div>
 <div class="codex-page" data-page="build"><h3>건설·유지 비용</h3>${buildingRows}<div class="codex-row"><div><strong>⛺ 새 정착지</strong></div><div class="small">${fmtCost(costs.expansion)} · 지형별 기본 190~360일</div></div></div>
 <div class="codex-page" data-page="prod" hidden><h3>주민 생산 공식</h3><div class="codex-note">성인 식량 소비 0.36/일 · 아동 0.25/일<br>농부: 0.9 + 농업기술/70 · 채집/사냥: 약 0.5 + 사냥기술/100 · 목수: 0.55 + 건축기술/78 · 광부: 석재 0.42 + 채굴기술/85<br>실제 생산량은 타일 잔존자원과 기술·건물 배율의 영향을 받습니다.</div><h3>지형 자연회복</h3>${terrainRows}</div>
 <div class="codex-page" data-page="logi" hidden><h3>내부 물류</h3><div class="codex-note">5일마다 식량을, 약 15일마다 목재를 재분배합니다. 거리·지형·도로·공급 정착지 인구가 1회 운송량에 영향을 줍니다. 운송 시간은 아직 0일입니다.</div><h3>도로 등급</h3><div class="codex-row"><strong>Lv.1 흙길</strong><span class="small">도로 기술 · 경로비 ×0.78</span></div><div class="codex-row"><strong>Lv.2 석재도로</strong><span class="small">공학 · 경로비 ×0.62</span></div><div class="codex-row"><strong>Lv.3 간선도로</strong><span class="small">도시화 · 경로비 ×0.48</span></div><div class="codex-note">도로 보정은 이제 실제로 활성 상태인 🛣️ 도로 건물이 있는 타일에만 적용됩니다.</div></div>
 <div class="codex-page" data-page="techs" hidden><h3>기술 목록</h3>${techRows}</div>`;
}

/* ---------- UI ---------- */
if(NS.UI){
 const map09=NS.UI.prototype.renderMap,view09=NS.UI.prototype.renderViews,village09=NS.UI.prototype.renderVillageContent,world09=NS.UI.prototype.renderWorld;
 NS.UI.prototype.setWorld=function(w){this.stop();this.world=attachV10World(w);this.render();};
 NS.UI.prototype.renderHeader=function(){this.q('timeLabel').textContent=this.world.timestamp();this.q('worldMood').textContent=` · ${this.world.activeVillages.length}개 국가`;this.q('playBtn').textContent=this.world.running?'⏸':'▶';document.querySelectorAll('.speed').forEach(b=>b.classList.toggle('active',+b.dataset.speed===this.world.speed));this.q('runtimeStatus').textContent='✓ V0.10 고도화 AI · 목재 경제 · 3단계 도로 · 밸런스 백과';this.q('runtimeStatus').style.color='#5bd79d';};
 NS.UI.prototype.renderViews=function(){view09.call(this);if(this.view==='codex')this.renderCodex();};
 NS.UI.prototype.renderCodex=function(){const el=this.q('codexContent');if(!el)return;el.innerHTML=codexHTML();el.querySelectorAll('[data-codex]').forEach(b=>b.onclick=()=>{el.querySelectorAll('[data-codex]').forEach(x=>x.classList.toggle('active',x===b));el.querySelectorAll('[data-page]').forEach(p=>p.hidden=p.dataset.page!==b.dataset.codex);});};
 NS.UI.prototype.renderVillageContent=function(){village09.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v)return;if(this.sub==='overview'){const g=el.querySelector('.grid');if(g&&!g.querySelector('.v10-total-food'))g.insertAdjacentHTML('beforeend',`<div class="info v10-total-food">🌾 총 식량<div class="big">${v.food.toFixed(0)}</div><div class="small muted">평균 ${v.foodReserveDays().toFixed(1)}일 · 최저 ${v.criticalFoodReserveDays().toFixed(1)}일</div></div>`);const p=v.strategicProfile(this.world);el.insertAdjacentHTML('beforeend',`<div class="v10-ai-box"><strong>🧭 AI 판단</strong><div class="small muted">현재 전략: ${p.mode} · 목재 목표대비 ${(p.woodStock*100).toFixed(0)}% · 비활성 건물 ${(p.maint.inactiveShare*100).toFixed(0)}%</div></div>`);}};
 NS.UI.prototype.settlementCard=function(v,id){const t=this.world.map.get(id),s=t.stocks||(t.stocks={food:0,wood:0,stone:0}),c=NS.V06.capsForTile(t),n=v.tileResidents(id).filter(p=>p.alive).length,arr=conds(t),inactive=arr.filter((q,i)=>q<threshold(t.buildings[i])).length,avg=arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:100,maint=tileMaintenance(t),cap=activeLocalCapacity(t),road=activeRoad(t)?` · 🛣️ ${v.roadLabel()}`:'';
  const buildings=(t.buildings||[]).map((b,i)=>{const off=!buildingActiveAt(t,i),q=arr[i]??100;return`<span class="building ${off?'v10-building-off':''}" title="상태 ${q.toFixed(0)}%">${NS.BUILDINGS[b]?.icon||''} ${NS.BUILDINGS[b]?.label||b}${off?` ${q.toFixed(0)}%`:''}</span>`;}).join('');
  return`<div class="settlement-card ${this.world.selectedTileId===id?'v07-card-selected':''}"><strong>${id===v.coreTileId?'🏛️':'🏠'} (${t.x},${t.y}) ${NS.TERRAIN[t.terrain].label}${road}</strong><div class="small muted">주민 ${n}명 · 활성 주거 ${cap}명 · 식량 ${v.settlementReserveDays(id).toFixed(1)}일 · 주택 ${v.houseCount(id)}/${v.houseLimit(id)}</div><div class="small ${inactive?'v10-warn':'muted'}">🔧 건물 상태 ${avg.toFixed(0)}%${inactive?` · 비활성 ${inactive}`:''}</div><div class="small muted">분기 유지: 🪵 ${maint.wood.toFixed(2)} · 🪨 ${maint.stone.toFixed(2)} · 노동 ${maint.labor.toFixed(2)}</div><div class="buildings">${buildings||'<span class="muted small">건물 없음</span>'}</div>${['food','wood','stone'].map(k=>`<div class="stock">${{food:'🌾',wood:'🪵',stone:'🪨'}[k]}<div class="bar"><span style="width:${clamp(s[k]/Math.max(1,c[k])*100,0,100)}%"></span></div><span>${s[k].toFixed(0)}/${c[k]}</span></div>`).join('')}</div>`;
 };
 NS.UI.prototype.renderMap=function(){const saved=this.world.recentTrades||[];this.world.recentTrades=[];map09.call(this);this.world.recentTrades=saved;const g=this._mapGeom;if(!g)return;const c=this.q('worldCanvas'),ctx=c.getContext('2d'),m=this.world.map,{cell,ox,oy}=g;
  /* physical roads and links */
  ctx.save();ctx.lineCap='round';for(const v of this.world.activeVillages){const lvl=roadLevel(v),roads=[...v.territory].map(id=>m.get(id)).filter(activeRoad);if(!roads.length)continue;ctx.strokeStyle=lvl===3?'#d9cdb0':lvl===2?'#b9aa8e':'#947b5b';ctx.lineWidth=Math.max(1.35,cell*(lvl===3?.063:lvl===2?.050:.037));for(const t of roads)for(const n of m.neighbors4(t.id)){if(n.ownerId===v.id&&activeRoad(n)&&n.id>t.id){ctx.beginPath();ctx.moveTo(ox+(t.x+.5)*cell,oy+(t.y+.5)*cell);ctx.lineTo(ox+(n.x+.5)*cell,oy+(n.y+.5)*cell);ctx.stroke();}}for(const t of roads){if(cell<17)continue;const x=ox+t.x*cell,y=oy+t.y*cell,tagW=cell*.34,tagH=cell*.19,tagX=x+cell*.055,tagY=y+cell*.745;ctx.fillStyle='rgba(8,14,20,.78)';ctx.fillRect(tagX,tagY,tagW,tagH);ctx.fillStyle='#f2e6cb';ctx.font=`700 ${cell*.125}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(`R${lvl}`,tagX+tagW*.5,tagY+tagH*.53);}}
  ctx.restore();
  /* one dashed line per route, preventing overlaps from becoming solid */
  const groups=new Map(),now=this.world.ordinalDay();for(const tr of saved){const age=now-tr.day;if(age>TRADE_DAYS)continue;const a=Math.min(tr.sellerTileId,tr.buyerTileId),b=Math.max(tr.sellerTileId,tr.buyerTileId),key=`${a}-${b}`,row=groups.get(key)||{a,b,count:0,last:tr.day};row.count++;row.last=Math.max(row.last,tr.day);groups.set(key,row);}for(const q of groups.values()){const a=m.get(q.a),b=m.get(q.b);if(!a||!b)continue;const age=now-q.last,alpha=clamp(1-age/TRADE_DAYS,.20,1);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle='#ffd56d';ctx.setLineDash([Math.max(7,cell*.18),Math.max(6,cell*.14)]);ctx.lineDashOffset=0;ctx.lineWidth=Math.max(1.8,Math.min(3.5,1.6+Math.log2(q.count+1)*.45));ctx.beginPath();ctx.moveTo(ox+(a.x+.5)*cell,oy+(a.y+.5)*cell);ctx.lineTo(ox+(b.x+.5)*cell,oy+(b.y+.5)*cell);ctx.stroke();ctx.restore();}
  const st=m.get(this.world.selectedTileId);if(st){const x=ox+st.x*cell,y=oy+st.y*cell;ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(5,cell*.105);ctx.strokeRect(x+2,y+2,cell-4,cell-4);ctx.strokeStyle='#6fc3ff';ctx.lineWidth=Math.max(2,cell*.04);ctx.strokeRect(x+6,y+6,cell-12,cell-12);ctx.restore();}
 };
 NS.UI.prototype.renderWorld=function(){world09.call(this);};
}

if(typeof document!=='undefined'){
 const st=document.createElement('style');st.textContent=`
 .bottom-nav{grid-template-columns:repeat(5,1fr)}
 .v10-warn,.v10-building-off{color:#ffd36f!important;border-color:#b58a35!important;background:rgba(181,138,53,.10)!important}
 .v10-ai-box,.codex-note{margin-top:10px;padding:10px;border:1px solid rgba(120,190,255,.22);border-radius:10px;background:rgba(60,120,180,.07)}
 .codex-tabs{display:flex;gap:5px;overflow:auto;margin-bottom:10px}.codex-tabs button{white-space:nowrap}.codex-tabs button.active{background:#24466d}
 .codex-row{display:grid;grid-template-columns:minmax(130px,.8fr) minmax(190px,1.2fr);gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)}
 .codex-row:last-child{border-bottom:0}.codex-page h3{margin-top:14px}
 @media(max-width:600px){.codex-row{grid-template-columns:1fr}.bottom-nav button{font-size:16px}.bottom-nav button span{font-size:9px}}
 `;document.head.appendChild(st);
}

})(window.VSim);

