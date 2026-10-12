/* Village Observer V0.34D3B — Early Economic Balance & War-Scale Recovery Policy V1.
 * Adds no resources during ordinary simulation. One-time founding wood is a physical
 * opening endowment for NEW worlds only. Original 169 legacy blocks are untouched.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B', PREVIOUS='V0.34D3A2', KEY='village-observer-v034d3b';
const WOOD_REGEN=Object.freeze({plain:.016,grass:.036,forest:.280,rock:.008,mountain:.015,water:0});
const BASE_COSTS=Object.freeze({house:15,farmstead:10,quarry:14,expansion:24});
const FRONTIER_WOOD=Object.freeze({twoPioneers:14,threePioneers:16});
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const now=w=>n(w?.calendarOrdinalDay?.()??(w?.ordinalDay?.()*3));
function state(v){return v._v34d3b||(v._v34d3b={starterChecked:false,starterWood:0,woodWorkerMoves:0,lastWoodLaborCal:-100000,decisions:0});}
function warsFor(v,w){return (w?.v33War?.wars||[]).filter(war=>{
 const ids=Array.isArray(war.participantIds)&&war.participantIds.length?war.participantIds:[war.attackerId,war.defenderId,...(war.sideAIds||[]),...(war.sideBIds||[])];
 return ids.some(id=>n(id)===n(v.id));
});}
function warDamage(v,w){
 const wars=warsFor(v,w),cal=now(w),pop=Math.max(1,n(v.population?.())),territory=Math.max(1,v.territory?.size||1);
 let casualties=0,wounded=0,active=false,recent=false,referencePop=pop;
 for(const war of wars){const end=n(war.endCal||cal),isActive=war.status==='ACTIVE';if(!isActive&&(cal-end>1080||end>cal))continue;
  recent=true;active=active||isActive;
  casualties+=n(war.casualties?.[v.id]);wounded+=n(war.wounded?.[v.id]);
  referencePop=Math.max(referencePop,n(war.startPopulation?.[v.id]));
 }
 let occupied=0,coreOccupied=false;
 for(const id of v.territory||[]){const t=w?.map?.get?.(id);if(t?.v33OccupierId!=null&&n(t.v33OccupierId)!==n(v.id)){occupied++;if(n(id)===n(v.coreTileId))coreOccupied=true;}}
 const lossShare=(casualties+wounded*.4)/Math.max(1,referencePop),occupiedShare=occupied/territory;
 return{active,recent,casualties,wounded,referencePop,lossShare,occupied,occupiedShare,coreOccupied};
}
// RECOVERY represents genuine war destruction, not two ordinary market shortages.
// A non-war catastrophic famine is handled by the separate emergency survival mode.
function recoveryShouldEnter(v,w,p){
 if(v?.status!=='active')return false;
 const damage=warDamage(v,w);
 if(!damage.recent&&!damage.coreOccupied&&!damage.occupied)return false;
 const food=n(p.food),health=n(p.health),inactive=n(p.inactiveShare),housing=n(p.cap)<n(p.pop)*.70;
 const collapse=food<18||health<48||inactive>=.30||housing;
 const majorLoss=damage.lossShare>=.15&&damage.casualties>=2;
 const majorOccupation=damage.coreOccupied||damage.occupiedShare>=.28;
 return (majorLoss&&collapse)||(majorOccupation&&(collapse||damage.occupiedShare>=.50))||
   (damage.active&&damage.lossShare>=.22&&food<25)||(damage.active&&inactive>=.65&&food<22);
}
function recoveryStable(v,w,p){
 const d=warDamage(v,w);
 // Do not instantly "recover" while the state is being devastated by occupation.
 if(d.active&&(d.coreOccupied||d.occupiedShare>=.28))return false;
 return n(p.food)>=24&&n(p.health)>=50&&n(p.inactiveShare)<.35&&
  n(p.cap)>=n(p.pop)*.78 && n(p.wood)>=Math.max(6,n(p.pop)*.10);
}
// The old B2 rule entered national Survival from small population/risk alone.
// Keep national emergency for *actual* starvation or catastrophic war collapse;
// local hunger mitigation, shipments and ordinary economic decisions remain active.
function survivalEmergency(v,w,p){
 const pop=Math.max(1,n(p.pop)),hunger=n(p.hunger),food=n(p.food),severe=n(p.severeHunger85),critical=n(p.severeHunger95),starv=n(p.starv),war=warDamage(v,w);
 const starvation= (starv>=2&&(food<22||hunger>=25))||
   (critical>=Math.max(2,Math.ceil(pop*.055))&&food<18)||
   (severe>=Math.max(3,Math.ceil(pop*.12))&&food<12)||
   (food<6&&hunger>=35)||(pop<=6&&food<12&&hunger>=30);
 const warCollapse=war.recent&&war.lossShare>=.23&&food<14&&hunger>=27;
 return !!(starvation||warCollapse);
}
function survivalStable(v,w,p,oldStable){
 if(oldStable)return true;
 return n(p.food)>=24&&n(p.hunger)<24&&n(p.health)>=62&&n(p.severeHunger95)===0&&
 n(p.severeHunger85)<=Math.max(1,Math.floor(n(p.pop)*.02))&&n(p.starv)===0&&n(p.pop)>=7;
}
// One-time founding grant is put into *real tile storage*. Imported worlds do not
// receive it; returned quantity is the actual accepted quantity, never a promise.
function foundingWood(v,w){
 const s=state(v);if(s.starterChecked)return 0;
 s.starterChecked=true;
 if(w.year!==1||n(w.ordinalDay?.())>3||v.status!=='active')return 0;
 let left=12,put=0;
 for(const id of [v.coreTileId,...(v.territory||[])]){
  if(left<=0)break;const q=Math.max(0,n(v.depositAt?.(id,'wood',left)));put+=q;left-=q;
 }
 s.starterWood=put;return put;
}
function woodLaborPulse(v,w){
 const s=state(v),cal=now(w);if(v.status!=='active'||cal-s.lastWoodLaborCal<90)return 0;
 s.lastWoodLaborCal=cal;s.decisions++;
 if(v.recoveryState?.active||v.v30b2?.survival?.active||warDamage(v,w).active)return 0;
 const pop=n(v.population?.()),reserve=Math.max(1,n(v.targetWood?.(w)));
 if(pop<12||n(v.wood)>=Math.min(28,reserve*.60))return 0;
 const existing=(v.residents||[]).filter(x=>x.alive&&x.age>=16&&x.job==='목수'&&x.assignment!=='PIONEER').length;
 const goal=Math.min(3,Math.max(1,Math.ceil(pop/30)));
 if(existing>=goal)return 0;
 // Actual civilians are reassigned, never created. Prefer unemployed adults; only
 // release surplus non-food occupations if the normal unemployed pool is empty.
 const counts={};for(const p of v.residents||[])if(p.alive)counts[p.job]=(counts[p.job]||0)+1;
 const foodDays=n(v.foodReserveDays?.());
 const eligible=p=>{
  if(!p.alive||p.age<16||p.age>62||p.assignment||p.militaryStatus32A==='active')return false;
  if(p.job==='무직')return true;
  if(p.job==='경비')return (counts['경비']||0)>Math.max(1,Math.ceil(pop/30));
  if(p.job==='상인')return (counts['상인']||0)>1;
  if(p.job==='건축가')return (counts['건축가']||0)>1&&!(v.constructionProjects||[]).length;
  if((p.job==='채집꾼'||p.job==='사냥꾼')&&foodDays>40)return (counts[p.job]||0)>1;
  return false;
 };
 const rank=p=>({'무직':0,'경비':1,'상인':2,'건축가':3,'채집꾼':4,'사냥꾼':5}[p.job]??9);
 const candidates=(v.residents||[]).filter(eligible).sort((a,b)=>rank(a)-rank(b)||n(b.skills?.building)-n(a.skills?.building)||String(a.id).localeCompare(String(b.id)));
 if(!candidates.length)return 0;
 let placed=0;
 const sites=[...(v.territory||[])].map(id=>w.map.get(id)).filter(t=>t&&NS.TERRAIN[t.terrain]?.passable)
  .sort((a,b)=>((b.terrain==='forest')-(a.terrain==='forest'))||n(b.resources?.wood)-n(a.resources?.wood));
 for(const person of candidates.slice(0,goal-existing)){
  const dest=sites.find(t=>n(w.map.distance?.(person.homeTileId,t.id))<=3)||w.map.get(person.homeTileId);
  if(!dest)continue;
  person.job='목수';person.workTileId=dest.id;person.workBuildingIndex29=null;person.workBuildingType29=null;
  person._v29NextJobReviewCal=cal+120;placed++;
 }
 if(placed){v._v29LaborForceDirty=true;s.woodWorkerMoves+=placed;}
 return placed;
}
// Late-bound economics. Legacy cost paths use the shared registry; no independent
// 0.8-era auto-build code is activated or retroactively re-priced.
for(const [k,val] of Object.entries(WOOD_REGEN)){
 if(NS.TERRAIN?.[k])NS.TERRAIN[k].regen.wood=val;
 if(NS.V010?.WOOD_REGEN)NS.V010.WOOD_REGEN[k]=val;
}
for(const [type,wood] of Object.entries(BASE_COSTS)){
 if(NS.V08?.BUILD_COSTS?.[type])NS.V08.BUILD_COSTS[type].wood=wood;
}
const oldHarvest=NS.Village.prototype.harvestMultiplier;
NS.Village.prototype.harvestMultiplier=function(kind,t){let multiplier=oldHarvest.call(this,kind,t);
 if(kind==='wood')multiplier*=n(this._world?.year)<=25?1.12:1.04;
 return multiplier;
};
const oldDaily=NS.Village.prototype.dailyTick;
NS.Village.prototype.dailyTick=function(w){foundingWood(this,w);return oldDaily.call(this,w);};
// Keep just enough *existing* timber for a real first frontier rather than
// spending the last 14 units on discretionary early infrastructure. Housing,
// food, quarry and sawmill remain exempt and still pay normal physical costs.
const oldConstruction=NS.Village.prototype.startConstruction;
if(oldConstruction)NS.Village.prototype.startConstruction=function(w,tileId,type,...rest){
 if(n(w?.year)<=12&&this.status==='active'&&!this.recoveryState?.active&&!(this.v30b2?.survival?.active)&&
    (this.territory?.size||0)<=2&&!['house','farmstead','ancient_farm','sawmill','quarry','row_house','collective_house'].includes(type)){
  const hasForest=[...(this.territory||[])].some(id=>w.map.get(id)?.terrain==='forest');
  if(!hasForest){const cost=NS.V08?.effectiveCost?.(this,type)||NS.V08?.BUILD_COSTS?.[type]||{};
   if(n(this.wood)>=14&&n(this.wood)-n(cost.wood)<14)return false;
  }
 }
 return oldConstruction.call(this,w,tileId,type,...rest);
};
const oldSeason=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){woodLaborPulse(this,w);return oldSeason.call(this,w);};
const oldVSerialize=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=oldVSerialize.call(this);d.v34d3b={...state(this)};return d;};
const oldWSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldWSerialize.call(this);d.version=VERSION;d.v034d3b={policy:'war-scale-recovery-and-founding-economic-balance-v1'};return d;};
NS.World.from=function(d){if(!d||![VERSION,PREVIOUS,'V0.34D3A1','V0.34D3A'].includes(d.version))throw Error('V0.34D3B/D3A2/D3A1/D3A 저장 파일만 지원합니다.');
 const w=oldFrom({...d,version:d.version===VERSION?PREVIOUS:d.version});
 for(const v of w.villages||[]){const raw=(d.villages||[]).find(x=>n(x.id)===n(v.id))?.v34d3b;
  v._v34d3b=raw?{...state(v),...raw}:{...state(v),starterChecked:true};
 }
 return w;
};
function snapshotPolicy(w){return (w.villages||[]).map(v=>{
 const x=state(v),d=warDamage(v,w),sur=v.v30b2?.survival||{},rec=v.recoveryState||{};
 return{id:v.id,name:v.name,recovery:!!rec.active,survival:!!sur.active,warRecent:d.recent,warActive:d.active,warLossShare:+d.lossShare.toFixed(4),occupied:d.occupied,foundingWood:x.starterWood,woodLaborReassignments:x.woodWorkerMoves,
  wood:+n(v.wood).toFixed(2),foodDays:+n(v.foodReserveDays?.()).toFixed(2),pop:n(v.population?.())};
 });}
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=oldSnapshot.call(this,w,...args);if(s){const profile=snapshotPolicy(w);for(const row of s.villages||[]){const p=profile.find(x=>n(x.id)===n(row.id));if(p)Object.assign(row,{d3bWarScaleRecovery:p.recovery?1:0,d3bSurvivalEmergency:p.survival?1:0,d3bWarLossShare:p.warLossShare,d3bFoundingWood:p.foundingWood,d3bWoodLaborMoves:p.woodLaborReassignments});}if(s.global)Object.assign(s.global,{d3bRecoveryNations:profile.filter(x=>x.recovery).length,d3bEmergencyNations:profile.filter(x=>x.survival).length});}return s;};
const oldToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldToJSON.call(this,w);d.version=VERSION;
 if(d.worldSummary){d.worldSummary.v034d3bRevision='early-economic-balance-war-scale-recovery-v1';d.worldSummary.v034d3bBalance={woodRegen:WOOD_REGEN,baseConstructionWood:BASE_COSTS,activeFrontierWood:FRONTIER_WOOD,woodHarvestBoostEarly:1.12,woodHarvestBoostLate:1.04,firstFrontierTimberReserve:14,founderWoodBonus:12,foodConsumptionUnchanged:true,warAndRealStarvationOnly:true,nations:snapshotPolicy(w)};}
 return d;};
function download(name,body,mime='application/json'){const u=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const txt=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3a2');return txt?NS.World.from(JSON.parse(txt)):null;},
 export(w){download(`village-observer-v034D3B-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const r=oldHeader.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}return r;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Early Economic Balance & Recovery Policy V1',summary:'평시의 정상적인 경제성장을 위해 초기 목재 경제와 기초 건설비를 조정하고, 국가 차원의 복구·생존 체제는 중대한 전쟁 피해나 실제 기아 위기에서 발동합니다.',sections:[
 ['초반 경제',['목재 자연회복: 평야 0.016, 초지 0.036, 숲 0.280 / 3일 주기. 암지·산은 유지.','실제 채취 생산량: 목재 +12%(1~25년), 이후 +4%.','최초 건국 시 목재 12를 실제 저장고에 1회만 지급하며, 기존 저장 파일에는 지급하지 않습니다.','목재 부족 시 무직자 및 여유 비식량 노동자를 정규 벌목 노동자로 제한적으로 재배치하고, 초기 비필수 공사는 첫 개척 목재 최소 14를 남깁니다.']],
 ['기초 건설비',['주택 목재 18→15, 경작지 12→10, 채석장 16→14, 구형 일반 개척 단가 28→24, 실제 V20/V21 개척 2명 16→14·3명 18→16.','다른 자재·Gold·식량 비용, AI 개척 확률과 물리 건설 노동·개척민·보급·사고 비용은 유지.']],
 ['평시와 위기',['일시적 저재고·저인구·주거부족의 조합만으로 국가 Recovery·Survival을 발동하지 않습니다.','국가 Recovery는 실제 전쟁 피해와 주요 기반 악화가 동시에 있는 경우에 발동합니다.','전쟁이 없더라도 실제 심각한 기아·인구붕괴 시 생존모드 안전장치는 작동합니다.','지역 식량 물류·시세·일반 AI 경제 행동은 유지합니다.']],
 ['호환성·관측',['기존 169개 레거시 블록 보존, Github Pages/단일 HTML 동시 지원.','D3A2 저장 이식 및 D3A2 48열 Food Flow와 1683열 Snapshot V2 유지.','연간 snapshot/Devlog에 평시·전쟁위기 진단과 실제 목재 배치를 추가합니다.']]
]});
NS.V034D3B=Object.freeze({version:VERSION,woodRegen:WOOD_REGEN,constructionWood:BASE_COSTS,frontierWood:FRONTIER_WOOD,warDamage,recoveryShouldEnter,recoveryStable,survivalEmergency,survivalStable,foundingWood,woodLaborPulse,state,snapshotPolicy});
})(window.VSim);
