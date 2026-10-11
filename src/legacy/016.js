
window.VSim=window.VSim||{};
(function(NS){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const STOCK=['food','wood','stone'];
const ACTIVE_CONDITION=35;
const DETAIL_DAYS=50*120;
const TRADE_LINE_DAYS=180;

/* ============================================================
   V0.9 · sustainable infrastructure + expansion AI + long logs
   Version policy: 0.9 -> 0.10 -> 0.11 ... (never auto-promote to 1.0)
   ============================================================ */

/* ---------- building maintenance: no Gold upkeep ---------- */
for(const b of Object.values(NS.BUILDINGS||{}))if(b)b.maint=0;
NS.Village.prototype.maintenanceGold=function(){return 0;};

const MAINT_BASE={
 town_hall:{wood:30,stone:15,labor:.50,priority:100,protected:true},
 house:{wood:18,stone:6,labor:.18,priority:95,protected:true},
 outpost:{wood:16,stone:4,labor:.25,priority:92,protected:true},
 granary:{wood:20,stone:8,labor:.30,priority:82},farmstead:{wood:12,stone:2,labor:.25,priority:80},
 warehouse:{wood:30,stone:16,labor:.40,priority:78},storehouse:{wood:30,stone:16,labor:.40,priority:78},
 palisade:{wood:18,stone:8,labor:.20,priority:66},road:{wood:4,stone:6,labor:.08,priority:62},quarry:{wood:16,stone:6,labor:.45,priority:58},
 trading_post:{wood:24,stone:10,labor:.45,priority:45},market:{wood:28,stone:12,labor:.55,priority:40}
};
const MAINT_ANNUAL_RATE=.02; // build-equivalent material per year

function syncBuildingCondition(t){
 if(!t)return [];
 if(!Array.isArray(t.buildingCondition))t.buildingCondition=[];if(!Array.isArray(t.buildingAbandonSeasons))t.buildingAbandonSeasons=[];
 while(t.buildingCondition.length<t.buildings.length)t.buildingCondition.push(100);while(t.buildingAbandonSeasons.length<t.buildings.length)t.buildingAbandonSeasons.push(0);
 if(t.buildingCondition.length>t.buildings.length)t.buildingCondition.length=t.buildings.length;if(t.buildingAbandonSeasons.length>t.buildings.length)t.buildingAbandonSeasons.length=t.buildings.length;
 for(let i=0;i<t.buildingCondition.length;i++)if(!Number.isFinite(t.buildingCondition[i]))t.buildingCondition[i]=100;
 return t.buildingCondition;
}
function activeThreshold(type){return ['town_hall','house','outpost'].includes(type)?15:(type==='road'?25:ACTIVE_CONDITION);}
function activeAt(t,i){syncBuildingCondition(t);return (t.buildingCondition[i]??100)>=activeThreshold(t.buildings[i]);}
function physicalHas(t,type){return !!t?.buildings?.includes(type);}
function activeCountOnTile(t,type=null){if(!t)return 0;syncBuildingCondition(t);let n=0;for(let i=0;i<t.buildings.length;i++)if(activeAt(t,i)&&(!type||t.buildings[i]===type))n++;return n;}
function activeCapacity(t){if(!t)return 0;syncBuildingCondition(t);let n=0;for(let i=0;i<t.buildings.length;i++)if(activeAt(t,i))n+=NS.BUILDINGS[t.buildings[i]]?.capacity||0;return n;}
function effectiveCaps(t){let c={food:45,wood:30,stone:25};if(!t)return c;syncBuildingCondition(t);for(let i=0;i<t.buildings.length;i++){if(!activeAt(t,i))continue;const b=t.buildings[i],s=NS.BUILDINGS[b]?.storage||{};for(const k of STOCK){let q=s[k]||0;if(b==='warehouse'&&t._v08UrbanStorage)q*=1.15;c[k]+=q;}}return c;}

const tileAdd08=NS.Tile.prototype.addBuilding;
NS.Tile.prototype.addBuilding=function(type){const ok=tileAdd08.call(this,type);if(ok){syncBuildingCondition(this);this.buildingCondition[this.buildings.length-1]=100;this.buildingAbandonSeasons[this.buildings.length-1]=0;}return ok;};
NS.Tile.prototype.hasBuilding=function(type){syncBuildingCondition(this);for(let i=0;i<this.buildings.length;i++)if(this.buildings[i]===type&&activeAt(this,i))return true;return false;};
NS.Tile.prototype.hasPhysicalBuilding=function(type){return physicalHas(this,type);};
NS.Tile.prototype.buildingConditionSummary=function(){syncBuildingCondition(this);if(!this.buildings.length)return{avg:100,inactive:0,total:0};const avg=this.buildingCondition.reduce((a,b)=>a+b,0)/this.buildingCondition.length;return{avg,inactive:this.buildingCondition.filter(x=>x<ACTIVE_CONDITION).length,total:this.buildings.length};};

NS.V06.capsForTile=effectiveCaps;NS.settlementCaps=effectiveCaps;if(NS.V08)NS.V08.capsForTile=effectiveCaps;
NS.Village.prototype.settlementCaps=function(tileId){return effectiveCaps(this._world?.map.get(tileId));};
NS.Village.prototype.storageCaps=function(){let c={food:0,wood:0,stone:0};for(const id of this.territory){const q=effectiveCaps(this._world?.map.get(id));for(const k of STOCK)c[k]+=q[k];}return c;};
NS.Village.prototype.depositAt=function(tileId,k,amount){const t=this._world?.map.get(tileId);if(!t)return 0;t.stocks=t.stocks||{food:0,wood:0,stone:0};const cap=effectiveCaps(t)[k],room=Math.max(0,cap-(t.stocks[k]||0)),put=Math.min(room,Math.max(0,amount));t.stocks[k]=(t.stocks[k]||0)+put;return put;};
NS.Village.prototype.capacity=function(w){let n=0;for(const id of this.territory)n+=activeCapacity(w.map.get(id));return n;};
NS.Village.prototype.buildingCount=function(w,type){let n=0;for(const id of this.territory)n+=activeCountOnTile(w.map.get(id),type);return n;};
NS.Village.prototype.warehouseCount=function(){return [...this.territory].reduce((a,id)=>a+activeCountOnTile(this._world?.map.get(id),'warehouse'),0);};

function maintenanceStats(v,w){let total=0,active=0,inactive=0,avg=0;for(const id of v.territory){const t=w.map.get(id);if(!t)continue;syncBuildingCondition(t);for(const q of t.buildingCondition){total++;avg+=q;if(q>=ACTIVE_CONDITION)active++;else inactive++;}}return{total,active,inactive,avg:total?avg/total:100};}
function routeWithdraw(v,w,targetId,k,need,routeUse){
 let left=need,got=0;const local=Math.min(left,v.stockAt(targetId,k));if(local>0){got+=v.withdrawAt(targetId,k,local);left-=local;}
 if(left<=1e-9)return got;
 const donors=[...v.territory].filter(id=>id!==targetId&&v.stockAt(id,k)>0).map(id=>{const q=v.internalLogisticsCapacity(id,targetId,k,false);return{id,...q};}).filter(x=>x.capacity>0&&Number.isFinite(x.cost)).sort((a,b)=>a.cost-b.cost);
 for(const d of donors){if(left<=1e-9)break;const key=`${d.id}>${targetId}:${k}`,used=routeUse[key]||0,cap=Math.max(0,d.capacity-used);if(cap<=0)continue;const q=Math.min(left,v.stockAt(d.id,k),cap);if(q<=0)continue;const took=v.withdrawAt(d.id,k,q);routeUse[key]=used+took;got+=took;left-=took;if(took>0){v.logisticsStats.moves++;v.logisticsStats[k==='wood'?'woodMoved':k==='stone'?'stoneMoved':'foodMoved']=(v.logisticsStats[k==='wood'?'woodMoved':k==='stone'?'stoneMoved':'foodMoved']||0)+took;}}
 return got;
}
function ensureMaintenance(v){v.maintenanceStats=v.maintenanceStats||{seasons:0,woodSpent:0,stoneSpent:0,laborShortageSeasons:0,resourceShortageSeasons:0,inactiveEvents:0,restoredEvents:0,collapsed:0};return v.maintenanceStats;}
NS.Village.prototype.processBuildingMaintenance=function(w){
 const ms=ensureMaintenance(this),routeUse={};ms.seasons++;
 for(const id of [...this.territory]){const t=w.map.get(id);if(!t||!t.buildings?.length)continue;syncBuildingCondition(t);
  const adults=this.tileResidents(id).filter(p=>p.alive&&p.age>=16&&p.assignment!=='PIONEER').length,teens=this.tileResidents(id).filter(p=>p.alive&&p.age>=13&&p.age<16).length;
  let laborBudget=adults*1.0+teens*.18;const order=t.buildings.map((b,i)=>({b,i,m:MAINT_BASE[b]||{wood:10,stone:3,labor:.30,priority:50}})).sort((a,b)=>(b.m.priority||50)-(a.m.priority||50)||(t.buildingCondition[a.i]-t.buildingCondition[b.i]));
  let laborShort=false,resourceShort=false;
  for(const row of order){const {b,i,m}=row,old=t.buildingCondition[i]??100,was=activeAt(t,i),laborNeed=m.labor||.3,laborGot=Math.min(laborNeed,laborBudget);laborBudget-=laborGot;const laborRatio=laborNeed?laborGot/laborNeed:1,woodNeed=(m.wood||0)*MAINT_ANNUAL_RATE/4,stoneNeed=(m.stone||0)*MAINT_ANNUAL_RATE/4,woodGot=woodNeed?routeWithdraw(this,w,id,'wood',woodNeed,routeUse):0,stoneGot=stoneNeed?routeWithdraw(this,w,id,'stone',stoneNeed,routeUse):0,resourceRatio=Math.min(woodNeed?woodGot/woodNeed:1,stoneNeed?stoneGot/stoneNeed:1),ratio=clamp(Math.min(laborRatio,resourceRatio),0,1);ms.woodSpent+=woodGot;ms.stoneSpent+=stoneGot;if(laborRatio<.75)laborShort=true;if(resourceRatio<.75)resourceShort=true;
   let next=old;if(ratio>=.92)next=Math.min(100,old+(old<activeThreshold(b)?7:2));else next=Math.max(0,old-(1+3*(1-ratio)));t.buildingCondition[i]=next;if(next<=0)t.buildingAbandonSeasons[i]=(t.buildingAbandonSeasons[i]||0)+1;else t.buildingAbandonSeasons[i]=0;const now=activeAt(t,i);
   if(was&&!now){ms.inactiveEvents++;w.telemetry.record('BUILDING_INACTIVE',w,{village:this.name,tileId:id,building:b,condition:+next.toFixed(1),laborRatio:+laborRatio.toFixed(2),resourceRatio:+resourceRatio.toFixed(2)});}
   if(!was&&now){ms.restoredEvents++;w.telemetry.record('BUILDING_RESTORED',w,{village:this.name,tileId:id,building:b,condition:+next.toFixed(1)});}
  }
  if(laborShort)ms.laborShortageSeasons++;if(resourceShort)ms.resourceShortageSeasons++;
  for(let i=t.buildings.length-1;i>=0;i--){const b=t.buildings[i];if((t.buildingAbandonSeasons[i]||0)>=12&&!MAINT_BASE[b]?.protected){t.buildings.splice(i,1);t.buildingCondition.splice(i,1);t.buildingAbandonSeasons.splice(i,1);ms.collapsed++;w.log(`${this.name}의 (${t.x},${t.y}) ${NS.BUILDINGS[b]?.label||b}이(가) 장기간 유지되지 못해 붕괴했습니다.`,true,'BUILDING_COLLAPSED',{village:this.name,tileId:id,building:b});}}
 }
};
/* Avoid building duplicates merely because an existing structure is temporarily inactive. */
NS.Village.prototype.developSettlements=function(w){
 for(const id of this.territory){const t=w.map.get(id),pop=this.tileResidents(id).length;if(!t||!pop)continue;const cap=activeCapacity(t);
  if(pop>=Math.max(2,cap-1)&&this.houseCount(id)<this.houseLimit(id)&&!this.expansionProject){const cost=NS.V08.effectiveCost(this,'house');if(this.payBuild(id,cost)){t.addBuilding('house');w.log(`${this.name}의 ${this.settlementLabel(id)}에 주택이 건설되었습니다.`,false,'BUILDING_BUILT',{nation:this.name,tileId:id,building:'house',cost,houseCount:this.houseCount(id),houseLimit:this.houseLimit(id)});}}
  const c=effectiveCaps(t),nearFull=Math.max((t.stocks?.food||0)/Math.max(1,c.food),(t.stocks?.wood||0)/Math.max(1,c.wood),(t.stocks?.stone||0)/Math.max(1,c.stone))>.78;
  if(nearFull&&!physicalHas(t,'warehouse')){const cost=NS.V08.effectiveCost(this,'warehouse');if(this.payBuild(id,cost)){t.addBuilding('warehouse');w.log(`${this.name}의 ${this.settlementLabel(id)}에 창고가 건설되었습니다.`,false,'BUILDING_BUILT',{nation:this.name,tileId:id,building:'warehouse',cost});}}
  if(id!==this.coreTileId&&pop>=3&&this.hasTech('BARTER')&&!physicalHas(t,'trading_post')){const cost=NS.V08.effectiveCost(this,'trading_post');if(this.payBuild(id,cost)){t.addBuilding('trading_post');w.log(`${this.name}의 ${this.settlementLabel(id)}에 교역소가 문을 열었습니다.`,true,'BUILDING_BUILT',{nation:this.name,tileId:id,building:'trading_post',cost});}}
 }
};
NS.Village.prototype.autoInfrastructure=function(w){const core=w.map.get(this.coreTileId),build=(tile,type)=>{if(!tile||physicalHas(tile,type))return false;const cost=NS.V08.effectiveCost(this,type);if(!this.payBuild(tile.id,cost))return false;tile.addBuilding(type);w.log(`${this.name}이(가) (${tile.x},${tile.y})에 ${NS.BUILDINGS[type].label}을(를) 건설했습니다.`,false,'BUILDING_BUILT',{village:this.name,tileId:tile.id,building:type,cost});return true;};if(this.hasTech('AGRICULTURE')){const t=[...this.territory].map(id=>w.map.get(id)).find(t=>['plain','grass'].includes(t.terrain)&&!physicalHas(t,'farmstead'));if(t&&build(t,'farmstead'))return;}if(this.hasTech('GRANARY')&&this.food>this.storageCaps(w).food*.55)if(build(core,'granary'))return;if(this.hasTech('MARKET'))if(build(core,'market'))return;if(this.hasTech('QUARRY')){const t=[...this.territory].map(id=>w.map.get(id)).find(t=>['rock','mountain'].includes(t.terrain)&&!physicalHas(t,'quarry'));if(t&&build(t,'quarry'))return;}if(this.hasTech('ROADS')&&this.territory.size>1){const t=[...this.territory].map(id=>w.map.get(id)).find(t=>t.id!==this.coreTileId&&!physicalHas(t,'road'));if(t)build(t,'road');}};

/* Active building capacity also governs housing choices and births. */
NS.Village.prototype.buildHouse=function(w){const tiles=[...this.territory].map(id=>w.map.get(id)).filter(t=>t&&this.houseCount(t.id)<this.houseLimit(t.id));if(!tiles.length)return false;tiles.sort((a,b)=>this.tileResidents(b.id).length/Math.max(1,activeCapacity(b))-this.tileResidents(a.id).length/Math.max(1,activeCapacity(a)));const t=tiles[0],cost=NS.V08.effectiveCost(this,'house');if(!this.payBuild(t.id,cost))return false;t.addBuilding('house');w.log(`${this.name}의 ${this.settlementLabel(t.id)}에 새 주택이 건설되었습니다.`,false,'BUILDING_BUILT',{nation:this.name,tileId:t.id,building:'house',cost,houseCount:this.houseCount(t.id),houseLimit:this.houseLimit(t.id)});return true;};
NS.Village.prototype.yearlyTick=function(w){this.residents.filter(p=>p.alive).forEach(p=>p.ageOneYear(w,this));this.residents=this.residents.filter(p=>p.alive);const men=this.residents.filter(p=>p.alive&&p.sex==='남'&&p.age>=18&&p.age<=50);if(!men.length)return;const now=w.ordinalDay(),women=this.residents.filter(p=>p.alive&&p.sex==='여'&&p.age>=18&&p.age<=40&&(p.birthCooldownUntilDay||-9999)<=now).sort(()=>Math.random()-.5);for(const mother of women){if(this.capacity(w)<=this.population())break;let home=mother.homeTileId??this.bestBirthTile(w),localCap=activeCapacity(w.map.get(home)),localPop=this.tileResidents(home).length;if(localPop>=localCap)home=this.bestBirthTile(w);const localDays=this.settlementReserveDays(home),fd=this.foodReserveDays();let chance=fd>50?.17:fd>30?.12:fd>18?.06:.015;if(localDays<18)chance*=.35;if(mother.health<55)chance*=.55;if(mother.happiness<45)chance*=.70;if(this.hasTech('SANITATION'))chance*=1.05;if(Math.random()>=chance)continue;const father=men[Math.floor(Math.random()*men.length)],b=new NS.Person(this.id,`baby-${now}-${Math.random()}`,{age:0,job:'아이',health:91,hunger:14,energy:80,homeTileId:home,familyName:father?.familyName||mother.familyName,motherId:mother.id,fatherId:father?.id||null});b.currentAction='가족의 보호를 받고 있음';this.residents.push(b);mother.birthCooldownUntilDay=now+200;w.log(`${this.name}의 (${w.map.get(home).x},${w.map.get(home).y}) 정착지에서 ${b.name}이(가) 태어났습니다.`,true,'BIRTH',{village:this.name,person:b.name,homeTileId:home,mother:mother.name,father:father?.name||null});}};

/* ---------- expansion AI: population-weighted food stress ---------- */
NS.Village.prototype.foodStressProfile=function(){let pop=0,weighted=0,stressed=0,critical=0,low=0;for(const id of this.territory){const n=this.tileResidents(id).length;if(!n)continue;const d=this.settlementReserveDays(id);pop+=n;if(d<10){weighted+=n;critical+=n;stressed+=n;low+=n;}else if(d<22){weighted+=n*.60;stressed+=n;low+=n;}else if(d<35){weighted+=n*.25;low+=n;}}return{population:pop,score:pop?weighted/pop:0,criticalShare:pop?critical/pop:0,stressedShare:pop?stressed/pop:0,lowShare:pop?low/pop:0};};
function ensureV09Nation(v,w){v._world=w;ensureMaintenance(v);if(!Number.isFinite(v.lastExpansionClaimDay))v.lastExpansionClaimDay=w.ordinalDay();for(const id of v.territory)syncBuildingCondition(w.map.get(id));}
const complete08=NS.Village.prototype.completeExpansion;
NS.Village.prototype.completeExpansion=function(w,t){const before=this.territory.size,r=complete08.call(this,w,t);if(this.territory.size>before)this.lastExpansionClaimDay=w.ordinalDay();return r;};
NS.VillageBrain.prototype.baseScores=function(v,w){const stress=v.foodStressProfile(),avg=v.foodReserveDays(),pop=v.population(),occ=pop/Math.max(1,v.capacity(w)),avgRel=v.averageVillageRelation(),rr=v.resourceRatios(w),front=v.expansionCandidates(w).length,settlers=v.availableSettlers().length,tradeP=v.tradePressure(w),density=pop/Math.max(1,v.territory.size),stagnantYears=Math.max(0,(w.ordinalDay()-(v.lastExpansionClaimDay||w.ordinalDay()))/120);let s={MAINTAIN:24,FOOD:15+stress.score*82+Math.max(0,28-avg)*.55,HOUSING:11+Math.max(0,occ-.86)*90,TRADE:10+tradeP*35+Math.max(0,avgRel)*.04,SECURITY:12+v.threat*1.3,EXPAND:9};const pressure=Math.max(0,.18-rr.food)*28+Math.max(0,.13-rr.wood)*14+Math.max(0,.11-rr.stone)*12;s.EXPAND+=pressure+Math.max(0,density-4.8)*1.65+Math.min(5,front);if(stagnantYears>5&&density>3.2)s.EXPAND+=Math.min(22,(stagnantYears-5)*1.25);if(NS.AIProfileCompat(v,'survivalPriority')>.5){s.FOOD+=7;s.MAINTAIN+=4;s.EXPAND-=8;}if(NS.AIProfileCompat(v,'tradeDiplomacy')>.5){s.TRADE+=9;s.EXPAND-=3;}if(NS.AIProfileCompat(v,'territorialExpansion')>.5){s.EXPAND+=16;s.SECURITY+=2;}if(stress.stressedShare>.20)s.EXPAND-=10+(stress.stressedShare-.20)*65;if(stress.criticalShare>.15)s.EXPAND-=18+(stress.criticalShare-.15)*80;if(avg<20)s.EXPAND-=20;if(stress.score>.35)s.TRADE+=12;if(v.expansionProject||front===0||pop<9||settlers<2||pop<=v.territory.size+5)s.EXPAND=-130;if(v.tradingPosts().length===0)s.TRADE=-100;for(const k in s)s[k]+=(this.mods[k]||0);return s;};

/* Maintenance is seasonal, after policy/development decisions. */
const seasonal08=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){seasonal08.call(this,w);this.processBuildingMaintenance(w);};

/* ---------- long-session telemetry ---------- */
function ensureTelemetry09(t){t.yearlySummaries=t.yearlySummaries||[];t.yearlyEventCounts=t.yearlyEventCounts||{};t.archivedManualNotes=t.archivedManualNotes||[];if(!Number.isFinite(t.nextEntryId)){let m=0;for(const e of t.entries||[])m=Math.max(m,Number(e.id)||0);t.nextEntryId=m+1;}}
function compactYear(s,counts){return{year:Math.max(1,Math.floor(((s.ordinalDay||1)-1)/120)+1),simTime:s.simTime,ordinalDay:s.ordinalDay,global:{population:s.global.population,territoryTiles:s.global.territoryTiles,totalGold:s.global.totalGold,avgHealth:s.global.avgHealth,avgHappiness:s.global.avgHappiness,tradeCount:s.global.tradeCount,totalKnowledge:s.global.totalKnowledge},eventCounts:{...(counts||{})},nations:(s.villages||[]).map(v=>({id:v.id,name:v.name,population:v.population,territoryTiles:v.territoryTiles,gold:v.gold,foodReserveDays:v.foodReserveDays,avgHealth:v.avgHealth,technologyCount:v.technologyCount,tradeCount:v.tradeCount,settlements:v.settlements,houses:v.houses}))};}
NS.Telemetry.prototype.record=function(type,w,payload={}){ensureTelemetry09(this);const y=w.year||Math.max(1,Math.floor((w.ordinalDay()-1)/120)+1);this.yearlyEventCounts[y]=this.yearlyEventCounts[y]||{};this.yearlyEventCounts[y][type]=(this.yearlyEventCounts[y][type]||0)+1;const e={id:this.nextEntryId++,realTime:new Date().toISOString(),simTime:w.timestamp(),ordinalDay:w.ordinalDay(),type,payload};this.entries.push(e);if(type==='MANUAL_NOTE')this.archivedManualNotes.push(e);const cutoff=w.ordinalDay()-DETAIL_DAYS;if(this.entries.length>16000||((this.entries[0]?.ordinalDay||0)<cutoff-120))this.entries=this.entries.filter(x=>(x.ordinalDay||0)>=cutoff||x.type==='MANUAL_NOTE');return e;};
const snapshot08=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){ensureTelemetry09(this);const s=snapshot08.call(this,w,reason,note);const y=w.year||Math.max(1,Math.floor((s.ordinalDay-1)/120)+1),summary=compactYear(s,this.yearlyEventCounts[y]);const idx=this.yearlySummaries.findIndex(x=>x.year===y);if(idx>=0)this.yearlySummaries[idx]=summary;else this.yearlySummaries.push(summary);this.yearlySummaries.sort((a,b)=>a.year-b.year);const cutoff=w.ordinalDay()-DETAIL_DAYS;this.snapshots=this.snapshots.filter(x=>(x.ordinalDay||0)>=cutoff||x.reason==='MANUAL');return s;};
const teleSerialize08=NS.Telemetry.prototype.serialize;
NS.Telemetry.prototype.serialize=function(){const d=teleSerialize08.call(this);d.yearlySummaries=this.yearlySummaries||[];d.yearlyEventCounts=this.yearlyEventCounts||{};d.archivedManualNotes=this.archivedManualNotes||[];d.nextEntryId=this.nextEntryId||1;d.detailWindowYears=50;return d;};
const toJSON08=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){ensureTelemetry09(this);const d=toJSON08.call(this,w);d.version='0.9';d.worldSummary.detailWindowYears=50;d.worldSummary.yearlySummaryCount=this.yearlySummaries.length;d.worldSummary.buildingMaintenance='seasonal local labor + wood/stone; no Gold upkeep';d.worldSummary.expansionFoodModel='population-weighted settlement stress';d.yearlySummaries=this.yearlySummaries;d.archivedManualNotes=this.archivedManualNotes;return d;};

/* ---------- telemetry fields ---------- */
const snapshot09base=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snapshot09base.call(this,w,reason,note);for(const r of s.villages){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;const bs=maintenanceStats(v,w),fs=v.foodStressProfile();r.buildingsTotal=bs.total;r.buildingsInactive=bs.inactive;r.buildingConditionAvg=+bs.avg.toFixed(1);r.maintenanceWoodSpent=+(v.maintenanceStats?.woodSpent||0).toFixed(2);r.maintenanceStoneSpent=+(v.maintenanceStats?.stoneSpent||0).toFixed(2);r.foodStressScore=+fs.score.toFixed(3);r.foodStressedPopulationShare=+fs.stressedShare.toFixed(3);r.lastExpansionClaimDay=v.lastExpansionClaimDay||0;}return s;};

/* ---------- V0.9 attach / save migration ---------- */
function attachV09World(w,sourceTelemetry=null){NS.V08.attachWorld(w);for(const t of w.map.tiles)syncBuildingCondition(t);for(const v of w.villages)ensureV09Nation(v,w);if(sourceTelemetry){w.telemetry.yearlySummaries=sourceTelemetry.yearlySummaries||w.telemetry.yearlySummaries||[];w.telemetry.yearlyEventCounts=sourceTelemetry.yearlyEventCounts||w.telemetry.yearlyEventCounts||{};w.telemetry.archivedManualNotes=sourceTelemetry.archivedManualNotes||w.telemetry.archivedManualNotes||[];w.telemetry.nextEntryId=sourceTelemetry.nextEntryId||w.telemetry.nextEntryId;}ensureTelemetry09(w.telemetry);const cutoff=w.ordinalDay()-DETAIL_DAYS;w.telemetry.entries=(w.telemetry.entries||[]).filter(e=>(e.ordinalDay||0)>=cutoff||e.type==='MANUAL_NOTE');w.telemetry.snapshots=(w.telemetry.snapshots||[]).filter(s=>(s.ordinalDay||0)>=cutoff||s.reason==='MANUAL');return w;}
NS.V09={attachWorld:attachV09World,MAINT_BASE,activeCondition:ACTIVE_CONDITION,detailYears:50,tradeLineDays:TRADE_LINE_DAYS};
const villageSerialize08=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSerialize08.call(this);d.maintenanceStats=this.maintenanceStats||{};d.lastExpansionClaimDay=this.lastExpansionClaimDay||0;return d;};
const worldSerialize08=NS.World.prototype.serialize,worldFrom08=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSerialize08.call(this);d.version='0.9';d.v09={buildingMaintenance:'material-labor-condition',detailWindowYears:50,tradeLineDays:180};return d;};
NS.World.from=function(d){if(!['0.8','0.9'].includes(d.version))throw new Error('V0.8 또는 V0.9 세이브만 불러올 수 있습니다.');const source=d.version,srcTele=d.telemetry||{},w=worldFrom08({...d,version:'0.8'});if(source==='0.9')for(let i=0;i<w.villages.length;i++){const src=d.villages?.[i]||{};w.villages[i].maintenanceStats=src.maintenanceStats||w.villages[i].maintenanceStats;w.villages[i].lastExpansionClaimDay=src.lastExpansionClaimDay||w.ordinalDay();}return attachV09World(w,srcTele);};

/* ---------- Save/export ---------- */
(function(){const KEY9='village-observer-v0-9',KEY8='village-observer-v0-8';function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY9,JSON.stringify(w.serialize()));},load(){const r=localStorage.getItem(KEY9)||localStorage.getItem(KEY8);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v09-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v09-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v09-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));}};})();

/* ---------- UI ---------- */
if(NS.UI){
 const renderHeader08=NS.UI.prototype.renderHeader,renderMap08=NS.UI.prototype.renderMap,settlementCard08=NS.UI.prototype.settlementCard,renderWorld08=NS.UI.prototype.renderWorld,renderVillage08=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.setWorld=function(w){this.stop();this.world=attachV09World(w);this.render();};
 NS.UI.prototype.renderHeader=function(){renderHeader08.call(this);this.q('runtimeStatus').textContent='✓ V0.9 확장 AI · 건물 유지 · 장기 로그 · 교역선 개선';};
 NS.UI.prototype.renderMap=function(){renderMap08.call(this);};
 NS.UI.prototype.settlementCard=function(v,id){const html=settlementCard08.call(this,v,id),t=this.world.map.get(id),s=t?.buildingConditionSummary?.()||{avg:100,inactive:0};return html.replace('</div>',`<div class="small ${s.inactive?'v09-warn':'muted'}">🔧 건물 상태 ${s.avg.toFixed(0)}%${s.inactive?` · 비활성 ${s.inactive}`:''}</div></div>`);};
 NS.UI.prototype.renderVillageContent=function(){renderVillage08.call(this);if(this.sub!=='economy')return;const v=this.world.selectedNation,el=this.q('villageContent');if(!v)return;const b=maintenanceStats(v,this.world),fs=v.foodStressProfile(),d=document.createElement('div');d.className='v09-maint';d.innerHTML=`<strong>🔧 건물 유지관리</strong><div class="small muted">활성 ${b.active}/${b.total} · 비활성 ${b.inactive} · 평균 상태 ${b.avg.toFixed(0)}%</div><div class="small muted">누적 유지 자원: 목재 ${(v.maintenanceStats?.woodSpent||0).toFixed(1)} · 석재 ${(v.maintenanceStats?.stoneSpent||0).toFixed(1)} · Gold 0</div><div class="small muted">식량난 인구 비율 ${(fs.stressedShare*100).toFixed(0)}% · 확장 AI는 이제 최악의 정착지 1곳이 아니라 이 비율을 사용합니다.</div>`;el.appendChild(d);};
 NS.UI.prototype.renderWorld=function(){renderWorld08.call(this);document.querySelectorAll('.v09-lognote').forEach(x=>x.remove());const el=this.q('devLogPreview');if(el){const p=document.createElement('div');p.className='v09-lognote';p.innerHTML=`<strong>장기 로그</strong> · 상세 최근 50년 / 연간 요약 ${(this.world.telemetry.yearlySummaries||[]).length}년 보존`;el.parentElement?.insertBefore(p,el);}};
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent='.v09-maint,.v09-lognote{margin-top:12px;padding:10px;border:1px solid rgba(120,190,255,.22);border-radius:10px;background:rgba(60,120,180,.07)}.v09-warn{color:#ffd36f}';document.head.appendChild(st);}

})(window.VSim);

