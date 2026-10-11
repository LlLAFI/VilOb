
window.VSim=window.VSim||{};
(function(NS){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const WATER_LABEL={lake:'호수',coast:'연안',sea:'해양',ocean:'대양'};
const WATER_COLORS={lake:'#2f6f87',coast:'#2b7896',sea:'#215f85',ocean:'#183e68'};
const NAV_TECHS=['COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'];

/* ============================================================
   V0.15 · map layers / recovery economy / navigation & water
           balanced resource trade / background trade policy
   ============================================================ */

/* ---------- water classification ---------- */
function classifyWater(map){
 const waters=map.tiles.filter(t=>t.terrain==='water');
 if(!waters.length)return;
 const waterSet=new Set(waters.map(t=>t.id)),seen=new Set();
 for(const start of waters){
  if(seen.has(start.id))continue;
  const comp=[],q=[start.id];seen.add(start.id);let touchesEdge=false;
  while(q.length){const id=q.shift(),t=map.get(id);comp.push(id);if(t.x===0||t.y===0||t.x===map.width-1||t.y===map.height-1)touchesEdge=true;for(const n of map.neighbors4(id))if(n.terrain==='water'&&!seen.has(n.id)){seen.add(n.id);q.push(n.id);}}
  if(!touchesEdge){for(const id of comp)map.get(id).waterType='lake';continue;}
  const compSet=new Set(comp),dist=new Map(),qq=[];
  for(const id of comp){const t=map.get(id);if(map.neighbors4(id).some(n=>n.terrain!=='water')){dist.set(id,1);qq.push(id);}}
  let p=0;while(p<qq.length){const id=qq[p++],d=dist.get(id);for(const n of map.neighbors4(id))if(compSet.has(n.id)&&!dist.has(n.id)){dist.set(n.id,d+1);qq.push(n.id);}}
  for(const id of comp){const d=dist.get(id);map.get(id).waterType=!Number.isFinite(d)?'unclassified':d<=1?'coast':d<=2?'sea':'ocean';}
 }
}
function waterLabel(t){return t?.terrain==='water'?(WATER_LABEL[t.waterType]||'물'):NS.TERRAIN[t?.terrain]?.label||'';}
function navLevel(v){return v?.hasTech?.('OCEAN_NAVIGATION')?3:v?.hasTech?.('SEAFARING')?2:v?.hasTech?.('COASTAL_NAVIGATION')?1:0;}
function waterAllowed(v,t,levelLimit=null){if(!t||t.terrain!=='water')return false;const lvl=Math.min(navLevel(v),levelLimit==null?3:levelLimit),need=t.waterType==='ocean'?3:t.waterType==='sea'?2:1;return lvl>=need;}
function coastalLand(map,t){return !!t&&t.terrain!=='water'&&map.neighbors4(t.id).some(n=>n.terrain==='water');}

/* ---------- technologies and harbor ---------- */
const V15_TECHS={
 COASTAL_NAVIGATION:{id:'COASTAL_NAVIGATION',label:'연안 항해',icon:'🛶',cost:430,req:['CART','SURVEYING'],branch:'교역',desc:'연안과 호수를 따라 안전한 항로를 기록하고 소형 선박을 운용합니다.',effects:['호수·연안 타일 통과 가능','항구 건물 해금','연안 해상 교역·개척 가능'],eureka:'연안 정착지 보유'},
 SEAFARING:{id:'SEAFARING',label:'항해술',icon:'⛵',cost:620,req:['COASTAL_NAVIGATION','LONG_DISTANCE_TRADE'],branch:'교역',desc:'더 큰 범선과 항해 지식을 이용해 육지에서 떨어진 해양을 건넙니다.',effects:['해양 타일 통과 가능','해상 교역·개척 거리 증가'],eureka:'항구 보유 및 교역 8회'},
 OCEAN_NAVIGATION:{id:'OCEAN_NAVIGATION',label:'원양 항해',icon:'🧭',cost:840,req:['SEAFARING','STANDARD_WEIGHTS','SCHOLARSHIP'],branch:'교역',desc:'별과 방향, 장거리 보급 지식을 결합해 대양을 횡단합니다.',effects:['대양 타일 통과 가능','가장 긴 해상 교역·개척 거리'],eureka:'항해술과 항구 2곳 보유'}
};
for(const [id,t] of Object.entries(V15_TECHS))NS.TECH[id]=t;
function insertAfter(after,id){const old=NS.TECH_ORDER.indexOf(id);if(old>=0)NS.TECH_ORDER.splice(old,1);const i=NS.TECH_ORDER.indexOf(after);NS.TECH_ORDER.splice(i>=0?i+1:NS.TECH_ORDER.length,0,id);}
insertAfter('CART','COASTAL_NAVIGATION');insertAfter('LONG_DISTANCE_TRADE','SEAFARING');insertAfter('COMMERCIAL_LAW','OCEAN_NAVIGATION');
NS.BUILDINGS.harbor={label:'항구',icon:'⚓',capacity:0,maint:.0055,storage:{food:45,wood:65,stone:40},desc:'해상 교역과 바다 건너 개척의 출발·도착 거점입니다.'};
if(NS.V08?.BUILD_COSTS)NS.V08.BUILD_COSTS.harbor={wood:36,stone:14,gold:12};
if(NS.V09?.MAINT_BASE)NS.V09.MAINT_BASE.harbor={wood:13,stone:5,labor:.42,priority:70};
if(NS.V011?.constructionDays){NS.V011.constructionDays.harbor=150;NS.V011.constructionDays.schoolhouse=135;}

const eureka14=NS.Village.prototype.checkEurekas;
NS.Village.prototype.checkEurekas=function(w){
 eureka14.call(this,w);
 const coast=[...this.territory].map(id=>w.map.get(id)).some(t=>coastalLand(w.map,t));
 if(coast)this.grantEureka?.('COASTAL_NAVIGATION',w);
 if((this.harbors?.().length||0)>0&&(this.tradeStats?.count||0)>=8)this.grantEureka?.('SEAFARING',w);
 if((this.harbors?.().length||0)>=2)this.grantEureka?.('OCEAN_NAVIGATION',w);
};

/* ---------- active harbor helpers ---------- */
NS.Village.prototype.harbors=function(){return [...this.territory].filter(id=>{const t=this._world?.map.get(id);return t&&t.buildingEfficiency?.('harbor')>0;});};
NS.Village.prototype.navigationLevel=function(){return navLevel(this);};

/* ---------- maritime pathfinding ---------- */
function seaStepCost(t){return t.waterType==='lake'?1.05:t.waterType==='coast'?1.2:t.waterType==='sea'?1.65:2.35;}
function maritimePath(w,v,fromLandId,toLandId,maxSteps=999,levelLimit=null){
 const start=w.map.get(fromLandId),target=w.map.get(toLandId);if(!start||!target||!coastalLand(w.map,start)||!coastalLand(w.map,target)||navLevel(v)<1)return{cost:Infinity,steps:Infinity};
 const targets=new Set(w.map.neighbors4(toLandId).filter(t=>waterAllowed(v,t,levelLimit)).map(t=>t.id));if(!targets.size)return{cost:Infinity,steps:Infinity};
 const dist=new Map(),steps=new Map(),heap=[];
 const push=x=>{heap.push(x);heap.sort((a,b)=>a[0]-b[0]);};
 for(const n of w.map.neighbors4(fromLandId))if(waterAllowed(v,n,levelLimit)){dist.set(n.id,seaStepCost(n));steps.set(n.id,1);push([seaStepCost(n),n.id]);}
 while(heap.length){const[d,id]=heap.shift();if(d!==dist.get(id))continue;const st=steps.get(id)||0;if(targets.has(id))return{cost:d+0.7,steps:st};if(st>=maxSteps)continue;for(const n of w.map.neighbors4(id)){if(!waterAllowed(v,n,levelLimit))continue;const nd=d+seaStepCost(n),ns=st+1;if(nd<(dist.get(n.id)??Infinity)){dist.set(n.id,nd);steps.set(n.id,ns);push([nd,n.id]);}}}
 return{cost:Infinity,steps:Infinity};
}
function commonSeaLevel(a,b){return Math.min(navLevel(a),navLevel(b));}
function maritimeTradeRoute(w,a,b){
 const lvl=commonSeaLevel(a,b),A=a.harbors(),B=b.harbors();if(lvl<1||!A.length||!B.length)return null;
 let best=null,maxSteps=lvl===1?8:lvl===2?18:40;
 for(const x of A)for(const y of B){const p=maritimePath(w,a,x,y,maxSteps,lvl);if(Number.isFinite(p.cost)&&(!best||p.cost<best.cost))best={cost:p.cost,steps:p.steps,aTileId:x,bTileId:y,sourceTileId:x,targetTileId:y,aId:a.id,bId:b.id,mode:'sea'};}
 if(!best)return null;const mult=lvl===1?1.25:lvl===2?1.8:2.7,range=Math.min(a.tradeRange(w),b.tradeRange(w))*mult;best.range=range;best.reachable=best.cost<=range;return best;
}
const route14=NS.World.prototype.routeInfo;
NS.World.prototype.routeInfo=function(a,b){const land=route14.call(this,a,b);if(land.reachable)return land;const sea=maritimeTradeRoute(this,a,b);if(sea&&(sea.reachable||!Number.isFinite(land.cost)||sea.cost<land.cost))return sea;return land;};

/* Same-nation logistics may use a harbor-to-harbor sea leg. */
const internalPath14=NS.Village.prototype.internalPathCost;
NS.Village.prototype.internalPathCost=function(fromId,toId){let land=internalPath14.call(this,fromId,toId);if(Number.isFinite(land))return land;const w=this._world,a=w?.map.get(fromId),b=w?.map.get(toId);if(!w||navLevel(this)<1||a?.buildingEfficiency?.('harbor')<=0||b?.buildingEfficiency?.('harbor')<=0)return land;const max=navLevel(this)===1?8:navLevel(this)===2?18:40,p=maritimePath(w,this,fromId,toId,max);return p.cost;};

/* ---------- maritime expansion across water ---------- */
function maritimeExpansionCandidates(v,w){
 if(navLevel(v)<1||!v.harbors().length)return[];const max=navLevel(v)===1?3:navLevel(v)===2?7:14,found=new Map();
 for(const h of v.harbors()){
  const q=[],seen=new Map();for(const n of w.map.neighbors4(h))if(waterAllowed(v,n)){q.push(n.id);seen.set(n.id,1);}
  let p=0;while(p<q.length){const id=q[p++],d=seen.get(id);for(const n of w.map.neighbors4(id)){
    if(n.terrain==='water'){if(d<max&&waterAllowed(v,n)&&!seen.has(n.id)){seen.set(n.id,d+1);q.push(n.id);}continue;}
    if(n.ownerId!==null||!NS.TERRAIN[n.terrain].passable||v.territory.has(n.id))continue;
    if(w.map.neighbors4(n.id).some(x=>v.territory.has(x.id)))continue;
    const old=found.get(n.id);if(!old||d<old.seaSteps)found.set(n.id,{tile:n,seaSteps:d,harborId:h});
   }}
 }
 const day=w.ordinalDay(),rr=v.resourceRatios(w),need={food:Math.max(0,.45-rr.food),wood:Math.max(0,.38-rr.wood),stone:Math.max(0,.30-rr.stone)};
 return [...found.values()].map(q=>{q.tile.syncResources(day);let score=10-q.seaSteps*3.4+(q.tile.resourceCap.food/1700)*17*(.6+need.food*2)+(q.tile.resourceCap.wood/2350)*14*(.5+need.wood*2)+(q.tile.resourceCap.stone/3350)*10*(.4+need.stone*2);if(q.tile.terrain==='plain')score+=5;if(q.tile.terrain==='grass')score+=3;q.tile._v15MaritimeMeta={seaSteps:q.seaSteps,harborId:q.harborId};return{tile:q.tile,score,adj:0,d:q.seaSteps+1,maritime:true,seaSteps:q.seaSteps,harborId:q.harborId};});
}
const expansion14=NS.Village.prototype.expansionCandidates;
NS.Village.prototype.expansionCandidates=function(w){const land=expansion14.call(this,w),sea=maritimeExpansionCandidates(this,w);return [...land,...sea].sort((a,b)=>b.score-a.score);};
const startExpansion14=NS.Village.prototype.startExpansion;
NS.Village.prototype.startExpansion=function(w){const ok=startExpansion14.call(this,w);if(ok&&this.expansionProject){const t=w.map.get(this.expansionProject.targetTileId),m=t?._v15MaritimeMeta;if(m){this.expansionProject.maritime=true;this.expansionProject.seaSteps=m.seaSteps;this.expansionProject.originHarborId=m.harborId;this.expansionProject.duration=Math.round(this.expansionProject.duration*(1.18+Math.min(.32,m.seaSteps*.035)));w.telemetry.record('MARITIME_EXPANSION_STARTED',w,{village:this.name,targetTileId:t.id,seaSteps:m.seaSteps,duration:this.expansionProject.duration});}}return ok;};
const completeExpansion14=NS.Village.prototype.completeExpansion;
NS.Village.prototype.completeExpansion=function(w,t){const maritime=!!this.expansionProject?.maritime,seaSteps=this.expansionProject?.seaSteps||0;completeExpansion14.call(this,w,t);if(maritime&&t.ownerId===this.id){if(!t.hasPhysicalBuilding?.('harbor'))t.addBuilding('harbor');w.log(`${this.name}이(가) 바다를 건너 (${t.x},${t.y})에 상륙 거점과 항구를 세웠습니다.`,true,'MARITIME_COLONY_ESTABLISHED',{village:this.name,tileId:t.id,seaSteps});}};

/* ---------- build harbors automatically when navigation becomes useful ---------- */
const infra14=NS.Village.prototype.autoInfrastructure;
NS.Village.prototype.autoInfrastructure=function(w){
 if(this.recoveryState?.active){const core=w.map.get(this.coreTileId);if(!core)return false;const activeFarm=[...this.territory].some(id=>w.map.get(id)?.buildingEfficiency?.('farmstead')>0);if(!activeFarm&&!core.hasPhysicalBuilding?.('farmstead'))return this.startConstruction(w,core.id,'farmstead','RECOVERY_FOOD');const cap=this.capacity(w);if(cap<this.population()*.85&&this.houseCount(core.id)<this.houseLimit(core.id))return this.startConstruction(w,core.id,'house','RECOVERY_HOUSING');return false;}
 const done=infra14.call(this,w);if(done)return done;if(navLevel(this)>=1&&this.harbors().length===0){const coast=[...this.territory].map(id=>w.map.get(id)).filter(t=>coastalLand(w.map,t)&&!t.hasPhysicalBuilding?.('harbor')).sort((a,b)=>(this.tileResidents(b.id).length-this.tileResidents(a.id).length));if(coast.length)return this.startConstruction(w,coast[0].id,'harbor','MARITIME_ACCESS');}return false;
};

/* ---------- trade resource balance + maritime deals ---------- */
function endpointFor(route,buyer,seller){if(route.aId===buyer.id)return{buyerTileId:route.aTileId??route.sourceTileId,sellerTileId:route.bTileId??route.targetTileId};return{buyerTileId:route.bTileId??route.targetTileId,sellerTileId:route.aTileId??route.sourceTileId};}
function customResourceDeal(w,buyer,seller,resource,route,harborOnly=false){
 const ep=endpointFor(route,buyer,seller),bt=w.map.get(ep.buyerTileId),st=w.map.get(ep.sellerTileId);if(!bt||!st)return null;if(harborOnly&&(bt.buildingEfficiency?.('harbor')<=0||st.buildingEfficiency?.('harbor')<=0))return null;
 const targets={wood:Math.max(20,buyer.targetWood(w)),stone:Math.max(15,buyer.targetStone(w))},sTargets={wood:Math.max(20,seller.targetWood(w)),stone:Math.max(15,seller.targetStone(w))};
 let need,excess;if(resource==='food'){need=Math.max(0,buyer.population()*.36*45-buyer.food);excess=Math.max(0,seller.food-seller.population()*.36*65);}else{need=Math.max(0,targets[resource]*1.12-buyer[resource]);excess=Math.max(0,seller[resource]-sTargets[resource]*1.06);}
 const localRoom=Math.max(0,buyer.settlementCaps(ep.buyerTileId)[resource]*.90-buyer.stockAt(ep.buyerTileId,resource)),localAvail=Math.max(0,seller.stockAt(ep.sellerTileId,resource)-(resource==='food'?5:3));need=Math.min(need,localRoom);excess=Math.min(excess,localAvail);if(need<1.5||excess<1.5)return null;
 let qty=Math.min(need,excess,buyer.merchantCapacity(),seller.merchantCapacity(),resource==='food'?34:30),base={food:.34,wood:.30,stone:.44}[resource],scarcity=1+Math.min(.55,need/Math.max(1,buyer[resource]+need)*.35),unit=base*scarcity,feeMult=(buyer.tradeFeeMultiplier()+seller.tradeFeeMultiplier())/2,transportUnit=route.cost*.020*feeMult,budget=Math.max(0,buyer.gold-6);qty=Math.min(qty,budget/Math.max(.01,unit+transportUnit));if(qty<1.5)return null;const price=qty*unit,fee=qty*transportUnit+.22*route.cost*feeMult,total=price+fee;if(total>budget+.01)return null;let weight=resource==='wood'?1.85:resource==='stone'?1.48:buyer.foodReserveDays()<35?1.55:.92;return{buyer,seller,resource,qty,price,fee,total,routeCost:route.cost,buyerTileId:ep.buyerTileId,sellerTileId:ep.sellerTileId,score:need*weight+excess*.16,routeMode:route.mode||'land'};
}
const deal14=NS.World.prototype.dealCandidate;
NS.World.prototype.dealCandidate=function(buyer,seller,resource,route){
 if(route?.mode==='sea')return customResourceDeal(this,buyer,seller,resource,route,true);
 let d=deal14.call(this,buyer,seller,resource,route);if(!d&&resource!=='food')d=customResourceDeal(this,buyer,seller,resource,route,false);if(!d)return null;
 const target=resource==='wood'?Math.max(1,buyer.targetWood(this)):resource==='stone'?Math.max(1,buyer.targetStone(this)):1,def=resource==='food'?Math.max(0,35-buyer.foodReserveDays())/35:Math.max(0,target-buyer[resource])/target;if(resource==='wood')d.score*=1.35+Math.min(.8,def);else if(resource==='stone')d.score*=1.18+Math.min(.55,def);else if(buyer.foodReserveDays()>55)d.score*=.78;return d;
};

/* ---------- recovery floor economy ---------- */
function ensureRecovery(v){v.recoveryState=v.recoveryState||{active:false,sinceDay:null,stableSeasons:0,entries:0,manualFood:0,manualWood:0,manualStone:0,salvagedWood:0,salvagedStone:0,dismantled:0,relocations:0};return v.recoveryState;}
function recoveryProfile(v,w){const m=NS.V011?.maintenanceSummary?.(v,w)||{total:0,inactive:0,inactiveShare:0,avg:100},pop=v.population(),cap=Math.max(0,v.capacity(w)),food=v.foodReserveDays(),wood=v.wood,health=v.avgHealth();let flags=0;if(m.total&&m.inactiveShare>=.35)flags++;if(wood<Math.max(5,pop*.22))flags++;if(food<24)flags++;if(pop>2&&cap<pop*.70)flags++;if(health<46)flags++;return{...m,pop,cap,food,wood,health,flags,severe:m.total&&m.inactiveShare>=.65};}
function updateRecovery(v,w,seasonal=false){const s=ensureRecovery(v),p=recoveryProfile(v,w),should=p.severe||p.flags>=2;if(!s.active&&should){s.active=true;s.sinceDay=w.ordinalDay();s.stableSeasons=0;s.entries++;w.log(`${v.name}이(가) 기반시설 붕괴를 막기 위해 생존·복구 체제로 전환했습니다.`,true,'RECOVERY_MODE_ENTER',{village:v.name,inactiveShare:+p.inactiveShare.toFixed(2),foodReserveDays:+p.food.toFixed(1),wood:+p.wood.toFixed(1),population:p.pop});}
 if(s.active){const stable=p.inactiveShare<.20&&p.food>42&&p.wood>Math.max(16,p.pop*.4)&&p.cap>=p.pop*.85;s.stableSeasons=stable?(seasonal?s.stableSeasons+1:s.stableSeasons):0;if(s.stableSeasons>=3){s.active=false;s.sinceDay=null;s.stableSeasons=0;w.log(`${v.name}이(가) 핵심 기반시설을 복구해 정상 발전 체제로 돌아왔습니다.`,true,'RECOVERY_MODE_EXIT',{village:v.name});}}
 return p;
}
function depositSomewhere(v,k,amount){let left=amount;const ids=[v.coreTileId,...[...v.territory].filter(id=>id!==v.coreTileId)];for(const id of ids){if(left<=0)break;left-=v.depositAt(id,k,left);}return amount-left;}
function manualRecoveryGather(v,w){const s=ensureRecovery(v);if(!s.active)return;const adults=v.residents.filter(p=>p.alive&&p.age>=15&&p.assignment!=='PIONEER').length;if(!adults)return;const p=recoveryProfile(v,w),wants={food:p.food<36?adults*.20:0,wood:p.wood<Math.max(22,p.pop*.55)?adults*.18:0,stone:v.stone<Math.max(12,p.pop*.20)?adults*.075:0};for(const [k,want] of Object.entries(wants)){if(want<=0)continue;const tiles=[...v.territory].map(id=>w.map.get(id)).filter(Boolean).sort((a,b)=>(b.ratio?.(k,w.ordinalDay())||0)-(a.ratio?.(k,w.ordinalDay())||0));let left=want,got=0;for(const t of tiles){if(left<=.001)break;const q=t.harvest(k,left,w.ordinalDay());left-=q;got+=q;}if(got>0){const put=depositSomewhere(v,k,got);s[k==='food'?'manualFood':k==='wood'?'manualWood':'manualStone']+=put;if(w.ordinalDay()%30===1)w.telemetry.record('RECOVERY_MANUAL_GATHER',w,{village:v.name,resource:k,qty:+put.toFixed(2),workers:adults});}}}
function recoveryRelocate(v,w){const s=ensureRecovery(v);if(!s.active)return false;const targets=[...v.territory].map(id=>w.map.get(id)).filter(t=>{if(!t?.buildings?.length)return false;const sum=t.buildingConditionSummary?.();return sum?.inactive>0&&v.tileResidents(t.id).filter(p=>p.alive&&p.age>=16).length===0;});if(!targets.length)return false;targets.sort((a,b)=>((a.id===v.coreTileId)?-1:0)-((b.id===v.coreTileId)?-1:0));const sources=[...v.territory].map(id=>({id,adults:v.tileResidents(id).filter(p=>p.alive&&p.age>=16&&p.assignment!=='PIONEER')})).filter(x=>x.adults.length>=2).sort((a,b)=>b.adults.length-a.adults.length);if(!sources.length)return false;const person=sources[0].adults[0],from=person.homeTileId,to=targets[0].id;person.homeTileId=to;person.lastMoveDay=w.ordinalDay();s.relocations++;w.telemetry.record('RECOVERY_LABOR_RELOCATED',w,{village:v.name,person:person.name,fromTileId:from,toTileId:to});return true;}
function salvageOne(v,w){const s=ensureRecovery(v);if(!s.active)return false;let choice=null;for(const id of v.territory){const t=w.map.get(id);if(!t)continue;t.buildingConditionSummary?.();if(t.buildingRuins?.length){choice={t,ruinIndex:0,type:t.buildingRuins[0].building,ruin:true};break;}for(let i=0;i<(t.buildings||[]).length;i++){const type=t.buildings[i],q=t.buildingCondition?.[i]??100;if(q<=0&&!['town_hall','house'].includes(type)){choice={t,index:i,type,ruin:false};break;}}if(choice)break;}
 if(!choice)return false;const cost=NS.V08?.BUILD_COSTS?.[choice.type]||{},wood=Math.round((cost.wood||0)*.30*10)/10,stone=Math.round((cost.stone||0)*.30*10)/10;if(choice.ruin)choice.t.buildingRuins.splice(choice.ruinIndex,1);else{choice.t.buildings.splice(choice.index,1);choice.t.buildingCondition?.splice(choice.index,1);choice.t.buildingAbandonSeasons?.splice(choice.index,1);}const wPut=depositSomewhere(v,'wood',wood),sPut=depositSomewhere(v,'stone',stone);s.salvagedWood+=wPut;s.salvagedStone+=sPut;s.dismantled++;w.log(`${v.name}이(가) (${choice.t.x},${choice.t.y})의 ${NS.BUILDINGS[choice.type]?.label||choice.type} 잔해를 해체해 자재를 회수했습니다.`,false,'BUILDING_DISMANTLED',{village:v.name,tileId:choice.t.id,building:choice.type,wood:+wPut.toFixed(1),stone:+sPut.toFixed(1)});return true;}

/* Recovery slows research rather than allowing collapsed states to tech-rush. */
const knowledge14=NS.Village.prototype.knowledgeMultiplier;
NS.Village.prototype.knowledgeMultiplier=function(){let m=knowledge14.call(this),w=this._world;if(!w)return m;const p=recoveryProfile(this,w);if(p.total&&p.inactiveShare>.25)m*=clamp(1-(p.inactiveShare-.25)*.75,.35,1);if(this.recoveryState?.active)m*=.72;if(this.population()<8)m*=.82;return m;};

/* Daily fallback gathering. */
const daily14=NS.Village.prototype.dailyTick;
NS.Village.prototype.dailyTick=function(w){daily14.call(this,w);updateRecovery(this,w);manualRecoveryGather(this,w);};

/* TRADE becomes a background policy; physical seasonal action still happens. */
const decision14=NS.VillageBrain.prototype.seasonalDecision;
NS.VillageBrain.prototype.seasonalDecision=function(v,w){
 if(v.recoveryState?.active){v.focus='RECOVER';w.telemetry.record('AI_DECISION',w,{village:v.name,villageId:v.id,brain:this.label,choice:'RECOVER',strategyMode:'기반시설 복구',signals:{inactiveBuildingShare:+(NS.V011?.maintenanceSummary?.(v,w)?.inactiveShare||0).toFixed(2),foodReserveDays:+v.foodReserveDays().toFixed(1),wood:+v.wood.toFixed(1)}});return'MAINTAIN';}
 const choice=decision14.call(this,v,w);if(choice!=='TRADE')return choice;v.tradePolicyUntil=Math.max(v.tradePolicyUntil||0,w.ordinalDay()+45);const scores=this.baseScores(v,w),physical=['MAINTAIN','FOOD','HOUSING','SECURITY','EXPAND'].sort((a,b)=>(scores[b]??-999)-(scores[a]??-999))[0]||'MAINTAIN';v.focus=physical;const e=w.telemetry.entries?.at(-1);if(e?.type==='AI_DECISION'&&e.payload?.villageId===v.id){e.payload.strategyChoice='TRADE';e.payload.physicalAction=physical;e.payload.tradePolicyUntil=v.tradePolicyUntil;e.payload.choice=physical;}w.telemetry.record('TRADE_POLICY_BACKGROUND',w,{village:v.name,until:v.tradePolicyUntil,physicalAction:physical});return physical;
};

/* Seasonal recovery actions happen before maintenance inside V0.11. */
const seasonal14=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const p=updateRecovery(this,w,false);if(this.recoveryState?.active){recoveryRelocate(this,w);if(this.wood<Math.max(12,this.population()*.35)||p.inactiveShare>.60)salvageOne(this,w);}seasonal14.call(this,w);updateRecovery(this,w,true);};

/* ---------- migration sanity for separated settlements ---------- */
const migration14=NS.Village.prototype.internalMigration;
NS.Village.prototype.internalMigration=function(w){if(navLevel(this)<1)return migration14.call(this,w);return migration14.call(this,w);};

/* ---------- attach, save, telemetry ---------- */
function ensureV15Nation(v,w){v._world=w;ensureRecovery(v);v.recoveryState.active=!!v.recoveryState.active;return v;}
function attachV15World(w){NS.V014.attachWorld(w);classifyWater(w.map);for(const t of w.map.tiles){if(t.terrain!=='water')delete t.waterType;}for(const v of w.villages||[])ensureV15Nation(v,w);w.tradeRouteCache={};return w;}
const serV14=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=serV14.call(this);d.recoveryState=this.recoveryState||null;return d;};
const serW14=NS.World.prototype.serialize,fromW14=NS.World.from;
NS.World.prototype.serialize=function(){const d=serW14.call(this);d.version='0.15';d.v15={mapLayers:true,recoveryEconomy:true,waterTypes:true,navigation:true,resourceTradeBalance:true,backgroundTradePolicy:true,techCount:NS.TECH_ORDER.length};return d;};
NS.World.from=function(d){if(!['0.8','0.9','0.10','0.11','0.12','0.13','0.14','0.15'].includes(d.version))throw new Error('V0.8~V0.15 세이브만 불러올 수 있습니다.');const source=d.version,w=fromW14(source==='0.15'?{...d,version:'0.14'}:d);if(source==='0.15')for(const v of w.villages){const src=(d.villages||[]).find(x=>x.id===v.id)||{};v.recoveryState=src.recoveryState||v.recoveryState;}return attachV15World(w);};
const snap14=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap14.call(this,w,reason,note);for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;const rs=ensureRecovery(v);r.recoveryMode=rs.active?1:0;r.recoveryManualFood=+rs.manualFood.toFixed(2);r.recoveryManualWood=+rs.manualWood.toFixed(2);r.recoveryManualStone=+rs.manualStone.toFixed(2);r.salvagedWood=+rs.salvagedWood.toFixed(2);r.salvagedStone=+rs.salvagedStone.toFixed(2);r.dismantledBuildings=rs.dismantled;r.navigationLevel=navLevel(v);r.harbors=v.harbors().length;r.tradeFood=(v.tradeHistory||[]).filter(x=>x.resource==='food').length;r.tradeWood=(v.tradeHistory||[]).filter(x=>x.resource==='wood').length;r.tradeStone=(v.tradeHistory||[]).filter(x=>x.resource==='stone').length;}return s;};
NS.Telemetry.prototype.snapshotsCSV=function(){const c=['simTime','ordinalDay','reason','note','village','status','brain','population','avgHealth','avgHappiness','food','foodReserveDays','wood','stone','gold','territoryTiles','technologyCount','researchTarget','totalKnowledge','tradeCount','tradeFood','tradeWood','tradeStone','recoveryMode','recoveryManualFood','recoveryManualWood','recoveryManualStone','salvagedWood','salvagedStone','dismantledBuildings','navigationLevel','harbors','buildingsInactive','buildingConditionAvg','foodCrisisDays'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`,rows=[c.map(esc).join(',')];for(const s of this.snapshots||[])for(const v of s.villages||[])rows.push(c.map(k=>esc(k==='village'?(v.name??''):Object.prototype.hasOwnProperty.call(v,k)?v[k]:k==='simTime'?s.simTime:k==='ordinalDay'?s.ordinalDay:k==='reason'?s.reason:k==='note'?s.note:'')).join(','));return rows.join('\n');};
const json14=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json14.call(this,w);d.version='0.15';d.worldSummary.techCount=NS.TECH_ORDER.length;d.worldSummary.mapLayers='base + population + natural resources + building condition + logistics';d.worldSummary.recoveryModel='manual fallback gathering + labor relocation + salvage + recovery mode';d.worldSummary.waterModel='lake / coast / sea / ocean; water remains unowned';d.worldSummary.navigation='coastal navigation -> seafaring -> ocean navigation; harbors gate maritime trade';d.worldSummary.tradeResourceBalance='food / wood / stone national deficits + endpoint stocks';d.worldSummary.aiModel='strategy trade policy can coexist with physical seasonal action';return d;};
NS.V015={attachWorld:attachV15World,classifyWater,navLevel,waterLabel,maritimePath,recoveryProfile,updateRecovery};

(function(){const KEY15='village-observer-v0-15',fallback=['village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY15,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY15);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v015-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v015-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v015-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){const w=NS.V014.worldFromMapData(JSON.parse(await file.text()));return attachV15World(w);}};})();

/* ---------- UI: analytical map layers ---------- */
function tilePopulation(w,t){return t.ownerId==null?0:(w.villages[t.ownerId]?.tileResidents(t.id).filter(p=>p.alive).length||0);}
function heatColor(n){n=clamp(n,0,1);const r=Math.round(40+215*n),g=Math.round(92+90*(1-n)),b=Math.round(210-145*n);return`rgba(${r},${g},${b},.72)`;}
function redrawBoundariesAndIcons(ui,ctx,g,drawIcons=true){const m=ui.world.map,{cell,ox,oy}=g,cols=NS.NATION_COLORS||['#62a8ff','#74d69c','#ff8b91','#bd9cff'],adminCenters=new Set((ui.world.activeVillages||[]).flatMap(v=>(NS.V030?.adminModel?.(v,ui.world)?.centers||[]).map(c=>Number(c.tileId))));for(const t of m.tiles){const x=ox+t.x*cell,y=oy+t.y*cell;if(t.ownerId!==null){ctx.strokeStyle=(NS.NATION_BORDER_COLORS?.[t.ownerId]||cols[t.ownerId%cols.length]);ctx.lineWidth=Math.max(2,cell*.065);for(const[dx,dy,sx,sy,ex,ey]of[[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){const n=m.at(t.x+dx,t.y+dy);if(!n||n.ownerId!==t.ownerId){ctx.beginPath();ctx.moveTo(x+sx*cell,y+sy*cell);ctx.lineTo(x+ex*cell,y+ey*cell);ctx.stroke();}}}let icon='';if(t.ownerId!==null&&adminCenters.has(Number(t.id)))icon='🏛️';else if(t.ownerId!==null&&t.buildingEfficiency?.('grand_market')>0)icon='🏦';else if(t.ownerId!==null&&t.buildingEfficiency?.('merchant_guild')>0)icon='⚖️';else if(t.ownerId!==null&&t.buildingEfficiency?.('market')>0)icon='🏪';else if(t.ownerId!==null&&t.buildingEfficiency?.('trading_post')>0)icon='⚖️';else if(t.ownerId!==null&&t.buildingEfficiency?.('harbor')>0)icon='⚓';else if(t.ruin)icon='🏚️';if(drawIcons&&icon&&cell>18){ctx.font=`${Math.min(13.2,cell*.33)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#fff';ctx.fillText(icon,x+cell/2,y+cell*.67);}}
 const st=m.get(ui.world.selectedTileId);if(st){const x=ox+st.x*cell,y=oy+st.y*cell;ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(4,cell*.09);ctx.strokeRect(x+2,y+2,cell-4,cell-4);}
}
function drawLayer(ui){const layer=ui.mapLayer||'base',c=ui.q('worldCanvas'),ctx=c.getContext('2d'),g=ui._mapGeom;if(!g)return;const m=ui.world.map,{cell,ox,oy}=g;
 /* Water subclasses are visible in every layer. */
 for(const t of m.tiles)if(t.terrain==='water'){ctx.fillStyle=WATER_COLORS[t.waterType]||WATER_COLORS.coast;ctx.fillRect(ox+t.x*cell,oy+t.y*cell,cell,cell);}
 if(layer==='population'){const vals=m.tiles.map(t=>tilePopulation(ui.world,t)),max=Math.max(1,...vals);for(const t of m.tiles)if(t.terrain!=='water'){const n=tilePopulation(ui.world,t);if(n>0){ctx.fillStyle=heatColor(Math.sqrt(n/max));ctx.fillRect(ox+t.x*cell,oy+t.y*cell,cell,cell);}}}
 else if(layer==='resource'){const k=ui.mapResource||'food';for(const t of m.tiles)if(t.terrain!=='water'){t.syncResources(ui.world.ordinalDay());const cap=t.resourceCap?.[k]||0,n=cap>0?(t.resources?.[k]||0)/cap:0;ctx.fillStyle=k==='food'?`rgba(238,199,83,${.12+.70*n})`:k==='wood'?`rgba(70,190,105,${.12+.72*n})`:`rgba(190,194,203,${.12+.70*n})`;ctx.fillRect(ox+t.x*cell,oy+t.y*cell,cell,cell);}}
 else if(layer==='building'){for(const t of m.tiles)if(t.ownerId!==null){const s=t.buildingConditionSummary?.();if(!s||!s.total)continue;const bad=clamp(1-s.avg/100,0,1),inactive=s.inactive/s.total;ctx.fillStyle=`rgba(${Math.round(245-60*(1-bad))},${Math.round(185*(1-bad))},75,${.20+.62*Math.max(bad,inactive)})`;ctx.fillRect(ox+t.x*cell,oy+t.y*cell,cell,cell);}}
 else if(layer==='logistics'){const rows=(ui.world.telemetry?.entries||[]).slice(-900).filter(e=>e.type==='INTERNAL_LOGISTICS'&&ui.world.ordinalDay()-(e.ordinalDay||0)<=60);ctx.save();ctx.strokeStyle='rgba(100,210,255,.38)';for(const e of rows){const a=m.get(e.payload?.fromTileId),b=m.get(e.payload?.toTileId);if(!a||!b)continue;ctx.lineWidth=Math.max(1,Math.min(5,(e.payload.qty||1)/8));ctx.beginPath();ctx.moveTo(ox+(a.x+.5)*cell,oy+(a.y+.5)*cell);ctx.lineTo(ox+(b.x+.5)*cell,oy+(b.y+.5)*cell);ctx.stroke();}ctx.restore();}
 redrawBoundariesAndIcons(ui,ctx,g,layer!=='base');
 const legend=ui.q('v15LayerLegend');if(legend){const text={base:'지형',population:'타일 인구 밀도',resource:`자연자원 · ${{food:'식량',wood:'목재',stone:'석재'}[ui.mapResource||'food']}`,building:'건물 상태 · 붉을수록 열화',logistics:'최근 60일 내부 물류'}[layer];legend.textContent=text;}
}

if(NS.UI){
 const bind14=NS.UI.prototype.bind,setWorld14=NS.UI.prototype.setWorld,header14=NS.UI.prototype.renderHeader,map14=NS.UI.prototype.renderMap,tile14=NS.UI.prototype.renderTile,codex14=NS.UI.prototype.renderCodex,content14=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.bind=function(){bind14.call(this);this.mapLayer=this.mapLayer||'base';this.mapResource=this.mapResource||'food';const bar=document.querySelector('#view-map .map-toolbar');if(bar&&!document.getElementById('v15LayerSelect')){const sel=document.createElement('select');sel.id='v15LayerSelect';sel.innerHTML='<option value="base">기본 지도</option><option value="population">인구 지도</option><option value="resource">자원 지도</option><option value="building">건물 상태</option><option value="logistics">물류 지도</option>';const res=document.createElement('select');res.id='v15ResourceSelect';res.innerHTML='<option value="food">식량</option><option value="wood">목재</option><option value="stone">석재</option>';const legend=document.createElement('span');legend.id='v15LayerLegend';legend.className='tag';bar.append(sel,res,legend);const sync=()=>{this.mapLayer=sel.value;res.style.display=this.mapLayer==='resource'?'inline-block':'none';this.renderMap();};sel.onchange=sync;res.onchange=()=>{this.mapResource=res.value;this.renderMap();};sync();}}
 NS.UI.prototype.setWorld=function(w){setWorld14.call(this,attachV15World(w));};
 NS.UI.prototype.renderHeader=function(){header14.call(this);this.q('runtimeStatus').textContent='✓ V0.15 지도 레이어 · 사회 복구 · 수역·항해 · 자원 교역 균형';document.title='Village Observer V0.16';const eye=document.querySelector('.eyebrow');if(eye)eye.textContent='Village Observer · V0.16';};
 NS.UI.prototype.renderMap=function(){map14.call(this);drawLayer(this);};
 NS.UI.prototype.renderTile=function(){tile14.call(this);const t=this.world.map.get(this.world.selectedTileId),el=this.q('tileInspector');if(t?.terrain==='water'&&el){el.innerHTML=`<strong>(${t.x},${t.y}) 🌊 ${waterLabel(t)}</strong><br><span class="small muted">수역은 영토로 점령되지 않습니다. 필요한 항해 기술이 있으면 이동·교역·개척 경로로 사용할 수 있습니다.</span>`;}};
 NS.UI.prototype.renderVillageContent=function(){content14.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el||this.sub!=='overview')return;el.querySelector('.v15-recovery')?.remove();const rs=ensureRecovery(v),box=document.createElement('div');box.className='v15-recovery';box.innerHTML=`<strong>${rs.active?'🛠️ 복구 체제':'🧭 발전 상태'}</strong><div class="small ${rs.active?'v15-recovery-on':'muted'}">${rs.active?`수작업 채취·노동 재배치·잔해 회수 우선 · 진입 ${rs.entries}회`:'정상 발전 체제'} · 항해 단계 ${navLevel(v)}/3 · 항구 ${v.harbors().length}곳</div>${rs.active?`<div class="small muted">누적 수작업 🌾 ${rs.manualFood.toFixed(1)} · 🪵 ${rs.manualWood.toFixed(1)} · 🪨 ${rs.manualStone.toFixed(1)} · 해체 ${rs.dismantled}회</div>`:''}`;el.appendChild(box);};
 NS.UI.prototype.renderCodex=function(){codex14.call(this);const el=this.q('codexContent');if(!el)return;const build=el.querySelector('[data-page="build"]');if(build&&!el.dataset.v15BuildTimes){for(const note of build.querySelectorAll('.codex-note'))if(note.textContent.includes('V0.11 건물 상태'))note.innerHTML='<strong>건물 상태</strong><br>상태 70~100%는 효과 100%, 70% 아래는 상태에 비례해 감소하고 0%에서는 비활성화됩니다. 실제 공사기간은 노동력·공사 정체·기술에 따라 기본 공사기간보다 길어질 수 있습니다.';const days=NS.V011?.constructionDays||{};for(const row of build.querySelectorAll('.codex-row')){const strong=row.querySelector('strong'),left=row.children[0];if(!strong||!left)continue;const type=Object.keys(NS.BUILDINGS).find(k=>strong.textContent.includes(NS.BUILDINGS[k]?.label));if(type&&days[type]!=null&&!left.querySelector('.v15-build-time'))left.insertAdjacentHTML('beforeend',`<div class="small v15-build-time">⏱️ 기본 공사기간 ${days[type]}일</div>`);}el.dataset.v15BuildTimes='1';}
  const logi=el.querySelector('[data-page="logi"]');if(logi&&!el.dataset.v15WaterNote){logi.insertAdjacentHTML('beforeend',`<div class="codex-note"><strong>V0.15 수역과 항해</strong><br>물은 <strong>호수 / 연안 / 해양 / 대양</strong>으로 구분되며 영토로 점령되지 않습니다. 연안 항해 → 항해술 → 원양 항해 순으로 더 깊은 수역을 통과할 수 있습니다. 해상 국가간 교역은 양쪽 정착지의 활성 <strong>항구</strong>가 필요합니다.</div><div class="codex-note"><strong>사회 복구</strong><br>기반시설이 대규모 비활성화되면 복구 체제로 전환합니다. 주민은 낮은 효율의 수작업 채취를 수행하고, 노동력을 비활성 시설로 재배치하며, 필요하면 폐허·비활성 시설을 해체해 일부 목재·석재를 회수합니다. 복구 상태에서는 확장보다 핵심 식량·주거 기반을 우선합니다.</div>`);el.dataset.v15WaterNote='1';}
 };
}

if(typeof document!=='undefined'){
 const st=document.createElement('style');st.textContent=`
 #v15LayerSelect,#v15ResourceSelect{min-height:40px;border:1px solid var(--line);border-radius:10px;background:#13243a;color:var(--text);padding:7px 9px}.v15-recovery{margin-top:10px;padding:10px;border:1px solid rgba(91,215,157,.24);border-radius:10px;background:rgba(91,215,157,.06)}.v15-recovery-on{color:#f5ca70}.v15-build-time{color:#b9d7ff;margin-top:3px}@media(max-width:600px){#v15LayerSelect,#v15ResourceSelect{min-height:36px;max-width:135px}}
 `;document.head.appendChild(st);
}

})(window.VSim);

