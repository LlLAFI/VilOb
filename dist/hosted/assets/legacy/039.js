
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV28='urbanization-migration-housing-food-access';
const PATCH28='P1';
const clamp28=(v,a,b)=>Math.max(a,Math.min(b,v));
const calDay28=w=>Number(w?.calendarOrdinalDay?.()??w?.ordinalDay?.()??0);
const HOUSING28=new Set(['house','row_house','collective_house']);
const SERVICE_WEIGHT28={town_hall:5,market:6,grand_market:12,trading_post:4,merchant_guild:8,schoolhouse:4,harbor:5,warehouse:2,storehouse:1,road:2,stoneworks:2,deep_quarry:1,quarry:1};

/* V0.28 Patch 1 — building presentation.
   Internal IDs remain stable for save compatibility. The era prefix describes the
   building generation itself, not the nation's current technology era. */
const BUILDING_PRESENTATION28={
 town_hall:{label:'고대 회관',era:'ancient',eraLabel:'고대'},
 house:{label:'고대 주택',era:'ancient',eraLabel:'고대',housingUnits:3,scaleLabel:'소규모 가옥군',desc:'소규모 가옥군 · 3주거단위 · 수용 3. 하나의 Building은 현실의 단독주택 1채가 아니라 하나의 주거 개발 단위를 나타냅니다.'},
 warehouse:{label:'고대 창고',era:'ancient',eraLabel:'고대'},
 trading_post:{label:'고대 교역소',era:'ancient',eraLabel:'고대'},
 outpost:{label:'고대 개척 거점',era:'ancient',eraLabel:'고대'},
 palisade:{label:'고대 방책',era:'ancient',eraLabel:'고대'},
 granary:{label:'고대 곡물창고',era:'ancient',eraLabel:'고대'},
 market:{label:'고대 시장',era:'ancient',eraLabel:'고대'},
 quarry:{label:'고대 채석장',era:'ancient',eraLabel:'고대'},
 road:{label:'고대 도로',era:'ancient',eraLabel:'고대'},
 farmstead:{label:'고대 경작지',era:'ancient',eraLabel:'고대'},
 schoolhouse:{label:'고대 학당',era:'ancient',eraLabel:'고대'},
 harbor:{label:'고대 항구',era:'ancient',eraLabel:'고대'},
 row_house:{label:'고대 연립주거',era:'ancient',eraLabel:'고대',housingUnits:5,scaleLabel:'밀집 가옥군',desc:'밀집 가옥군 · 5주거단위 · 수용 5. 기존 고대 주택 개발 단위를 더 높은 밀도로 개축한 주거군입니다.'},
 collective_house:{label:'고대 집합주거',era:'ancient',eraLabel:'고대',housingUnits:8,scaleLabel:'대형 주거군',desc:'대형 주거군 · 8주거단위 · 수용 8. 여러 가구와 가옥이 결합된 고밀도 주거 개발 단위입니다.'},
 merchant_guild:{label:'고대 상단 회관',era:'ancient',eraLabel:'고대'},
 grand_market:{label:'고대 대시장',era:'ancient',eraLabel:'고대'},
 deep_quarry:{label:'고대 전문 채석장',era:'ancient',eraLabel:'고대'},
 stoneworks:{label:'고대 석재 가공장',era:'ancient',eraLabel:'고대'}
};
for(const [id,meta] of Object.entries(BUILDING_PRESENTATION28))if(NS.BUILDINGS?.[id])Object.assign(NS.BUILDINGS[id],meta);
if(NS.BUILDINGS?.storehouse)Object.assign(NS.BUILDINGS.storehouse,{label:'고대 창고',era:'ancient',eraLabel:'고대',desc:'구형 내부 ID(storehouse)를 사용하는 고대 창고입니다. 사용자 표시명은 warehouse와 동일하게 통일합니다.'});

/* Technology saturation is common in the late V0.28 world. The legacy gainKnowledge
   path re-ran settlement-wide compatibility work for every Person action even after all
   technologies were complete. Keep Knowledge accumulation, but bypass that dead research path. */
const gainKnowledgeBeforePatch28=NS.Village.prototype.gainKnowledge;
NS.Village.prototype.gainKnowledge=function(amount,w,source='생활'){
 if(this.status==='active'&&this.technologies?.size>=Number(NS.TECH_ORDER?.length||0)&&Number(NS.TECH_ORDER?.length||0)>0){
  const tc=this.technologies.size;if(this._v28KnowledgeMulCount!==tc){let m=1;if(this.technologies.has('RECORD_KEEPING'))m*=1.15;if(this.technologies.has('SCHOLARSHIP'))m*=1.32;if(this.technologies.has('EDUCATION'))m*=1.15;this._v28KnowledgeMul=m;this._v28KnowledgeMulCount=tc;}
  const n=Number(amount||0)*Number(this._v28KnowledgeMul||1);this.totalKnowledge=Number(this.totalKnowledge||0)+n;this.knowledgeBySource=this.knowledgeBySource||{};this.knowledgeBySource[source]=Number(this.knowledgeBySource[source]||0)+n;this.researchTarget=null;return;
 }
 return gainKnowledgeBeforePatch28.call(this,amount,w,source);
};
function rank28(score,pop){if(pop>=60&&score>=72)return'도시';if(pop>=28&&score>=55)return'소도시';if(pop>=10&&score>=32)return'마을';return'촌락';}
function condEff28(q){q=Number(q??100);return q>=70?1:clamp28(q/70,0,1);}
function housingCap28(t){let n=0;if(!t)return 0;for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i];if(!HOUSING28.has(b)&&b!=='town_hall'&&b!=='outpost')continue;n+=(NS.BUILDINGS?.[b]?.capacity||0)*condEff28(t.buildingCondition?.[i]??100);}return n;}
function service28(t){let n=0;for(let i=0;i<(t?.buildings||[]).length;i++){const b=t.buildings[i],q=condEff28(t.buildingCondition?.[i]??100);n+=(SERVICE_WEIGHT28[b]||0)*q;}return n;}
function gini28(arr){const a=arr.filter(x=>x>=0).sort((x,y)=>x-y),n=a.length;if(!n)return 0;const sum=a.reduce((x,y)=>x+y,0);if(sum<=0)return 0;let weighted=0;for(let i=0;i<n;i++)weighted+=(i+1)*a[i];return clamp28((2*weighted)/(n*sum)-(n+1)/n,0,1);}
function entropy28(arr){const total=arr.reduce((a,b)=>a+b,0),n=arr.filter(x=>x>0).length;if(total<=0||n<=1)return 0;let h=0;for(const x of arr)if(x>0){const p=x/total;h-=p*Math.log(p);}return clamp28(h/Math.log(n),0,1);}
function ensureStats28(v){return v.v28Stats||(v.v28Stats={migrationMoves:0,housingActions:0,foodMoves:0,foodMoved:0,foodBlocked:0,lastMigrationCalendar:-99999,lastHousingCalendar:-99999,lastFoodCalendar:-99999});}
function busy28(v,id){return [...(v.constructionProjects||[]),...(v.landDevelopmentProjects||[]),...(v.buildingUpgradeProjects||[])].some(p=>Number(p.tileId)===Number(id));}
function foodState28(v,w,id){const ps=v.tileResidents(id).filter(p=>p.alive),pop=ps.length;if(!pop)return null;const stock=Number(v.stockAt?.(id,'food')||0),daily=Math.max(.18,pop*.36),days=stock/daily;let high=0,severe=0,sum=0;for(const p of ps){const h=Number(p.hunger||0);sum+=h;if(h>=68)high++;if(h>=84)severe++;}return{id,pop,stock,daily,days,avgHunger:sum/pop,high,severe,ps};}
function commutePairs28(v){const m=new Map();for(const p of v.residents||[]){if(!p.alive||p.age<15)continue;const a=Number(p.homeTileId),b=Number(p.workTileId??a);if(a===b||!Number.isFinite(a)||!Number.isFinite(b))continue;const k=`${Math.min(a,b)}:${Math.max(a,b)}`;m.set(k,(m.get(k)||0)+1);}return m;}
function settlementRows28(v,w,force=false){
 const bucket=Math.floor(calDay28(w)/5),epoch=Number(v._v26ResidentEpoch||0),sig=`${bucket}:${epoch}:${v.territory?.size||0}`;if(!force&&v._v28Rows?.sig===sig)return v._v28Rows.rows;
 const workersBy=new Map(),inBy=new Map(),outBy=new Map();for(const p of v.residents||[]){if(!p.alive||p.age<15)continue;const h=Number(p.homeTileId),work=Number(p.workTileId??h);workersBy.set(work,(workersBy.get(work)||0)+1);if(work!==h){inBy.set(work,(inBy.get(work)||0)+1);outBy.set(h,(outBy.get(h)||0)+1);}}
 const rows=[];for(const id of v.territory||[]){const t=w.map.get(id);if(!t)continue;const ps=v.tileResidents(id).filter(p=>p.alive),pop=ps.length,cap=housingCap28(t),workers=workersBy.get(id)||0,commutersIn=inBy.get(id)||0,commutersOut=outBy.get(id)||0,svc=service28(t),occupancy=pop/Math.max(1,cap),food=foodState28(v,w,id),road=(t.buildings||[]).includes('road')?1:0;
  let urbanity=Math.min(34,Math.log2(pop+1)*7)+Math.min(18,Math.log2(workers+1)*4)+Math.min(16,commutersIn*1.5)+Math.min(24,svc)+Math.min(8,occupancy*6)+(id===v.coreTileId?5:0)+(road?2:0);urbanity=clamp28(urbanity,0,100);
  rows.push({id,t,pop,cap,workers,commutersIn,commutersOut,service:svc,occupancy,foodDays:food?.days??999,avgHunger:food?.avgHunger??0,highHunger:food?.high??0,severeHunger:food?.severe??0,urbanity,rank:rank28(urbanity,pop),housingShortage:Math.max(0,pop-cap)});
 }
 v._v28Rows={sig,rows};return rows;
}
function lifeZones28(v,w,rows){
 /* Patch 1: hub-anchored zones. V0.28 original used transitive connected components,
    so A↔B↔C↔D chains could eventually merge most of a nation into one life zone.
    Every member now needs a direct spatial/commuting relationship with its hub. */
 const pairs=commutePairs28(v),eligible=rows.filter(r=>r.pop>0&&(r.urbanity>=31||r.commutersIn+r.commutersOut>=2));if(!eligible.length)return[];
 const flow=(a,b)=>pairs.get(`${Math.min(a.id,b.id)}:${Math.max(a.id,b.id)}`)||0;
 const hubScore=r=>r.urbanity+Math.log2(r.pop+1)*6+r.commutersIn*1.4+r.service*.25+(r.id===v.coreTileId?5:0);
 const ordered=[...eligible].sort((a,b)=>hubScore(b)-hubScore(a)),hubs=[];
 for(const r of ordered){const absorbed=hubs.some(h=>flow(r,h)>=4||(w.map.distance(r.id,h.id)<=2&&r.urbanity>=44&&h.urbanity>=48));if(!absorbed&&(r.urbanity>=42||r.pop>=10||r.commutersIn+r.commutersOut>=3))hubs.push(r);}
 if(!hubs.length)hubs.push(ordered[0]);
 const groups=new Map(hubs.map(h=>[h.id,[]]));
 for(const r of eligible){let best=null;for(const h of hubs){const d=w.map.distance(r.id,h.id),f=flow(r,h);if(r.id!==h.id&&f<1&&d>2&&!(d<=3&&r.urbanity>=42))continue;if(d>5&&f<3)continue;const score=(r.id===h.id?1000:0)+f*18-d*5+h.urbanity*.15+(h.id===v.coreTileId?2:0);if(!best||score>best.score)best={h,score};}
  if(!best){const h=r;hubs.push(h);groups.set(h.id,[r]);}else groups.get(best.h.id).push(r);
 }
 const zones=[];for(const h of hubs){const members=groups.get(h.id)||[];if(!members.length)continue;const pop=members.reduce((s,x)=>s+x.pop,0),workers=members.reduce((s,x)=>s+x.workers,0);zones.push({id:`z-${v.id}-${zones.length+1}`,population:pop,workers,settlements:members.length,hubTileId:h.id,hubRank:h.rank||'촌락',members:members.map(x=>x.id),model:'hub-anchored'});}
 return zones.sort((a,b)=>b.population-a.population||b.settlements-a.settlements);
}
function urbanSummary28(v,w,force=false){
 const bucket=Math.floor(calDay28(w)/5),epoch=Number(v._v26ResidentEpoch||0),sig=`${bucket}:${epoch}:${v.territory?.size||0}`;if(!force&&v._v28Summary?.sig===sig)return v._v28Summary.data;const rows=settlementRows28(v,w,force),occupied=rows.filter(r=>r.pop>0),pops=occupied.map(r=>r.pop),total=Math.max(1,pops.reduce((a,b)=>a+b,0)),sorted=[...pops].sort((a,b)=>b-a),commuters=(v.residents||[]).filter(p=>p.alive&&p.age>=15&&Number(p.workTileId??p.homeTileId)!==Number(p.homeTileId)).length,adults=Math.max(1,(v.residents||[]).filter(p=>p.alive&&p.age>=15).length),urbanRows=occupied.filter(r=>r.urbanity>=48),urbanPop=urbanRows.reduce((a,b)=>a+b.pop,0),zones=lifeZones28(v,w,rows),housingStrained=(v.residents||[]).filter(p=>p.alive&&(NS.V034D2B?.currentHousingStrain?.(v,w,p)??((p.housingStrainDays||0)>20||((rows.find(r=>r.id===p.homeTileId)?.housingShortage||0)>0)))).length,foodStressed=occupied.filter(r=>r.foodDays<18||r.avgHunger>=55).reduce((a,b)=>a+b.pop,0),severe=(v.residents||[]).filter(p=>p.alive&&Number(p.hunger||0)>=84).length,cities=occupied.filter(r=>r.rank==='도시').length,towns=occupied.filter(r=>r.rank==='소도시').length;
 const data={rows,occupied,zones,population:total,largestSettlementPop:sorted[0]||0,top1Share:(sorted[0]||0)/total,top3Share:sorted.slice(0,3).reduce((a,b)=>a+b,0)/total,popGini:gini28(pops),entropy:entropy28(pops),concentration:1-entropy28(pops),commuters,commuterShare:commuters/adults,urbanPopulation:urbanPop,urbanPopulationShare:urbanPop/total,cities,towns,lifeZones:zones.length,largestLifeZonePop:zones[0]?.population||0,largestLifeZoneSettlements:zones[0]?.settlements||0,housingStrained,housingStrainShare:housingStrained/total,foodStressed,foodStressShare:foodStressed/total,severeHunger:severe,hub:occupied.length?[...occupied].sort((a,b)=>b.urbanity-a.urbanity||b.pop-a.pop)[0]:null};
 v._v28Summary={sig,data};return data;
}
function socialAnchor28(v,p,tileId){let n=0;for(const id of [p.motherId,p.fatherId]){const q=(v.residents||[]).find(x=>x.alive&&x.id===id);if(q&&Number(q.homeTileId)===Number(tileId))n+=4;}for(const [id,val] of Object.entries(p.relations||{})){if(Number(val)<25)continue;const q=(v.residents||[]).find(x=>x.alive&&x.id===id);if(q&&Number(q.homeTileId)===Number(tileId))n+=Math.min(2.5,Number(val)/35);}return Math.min(10,n);}
function jobFit28(p,t,w){let s=0;const b=new Set(t?.buildings||[]),day=w.ordinalDay?.()||0;if(['농부','채집꾼','사냥꾼'].includes(p.job))s+=(t.ratio?.('food',day)||0)*18+(b.has('farmstead')?8:0);else if(p.job==='목수')s+=(t.ratio?.('wood',day)||0)*18;else if(p.job==='광부')s+=((t.ratio?.('stone',day)||0)+(t.ratio?.('gold',day)||0))*10+(b.has('quarry')||b.has('deep_quarry')?10:0);else if(p.job==='상인')s+=(b.has('market')?8:0)+(b.has('grand_market')?14:0)+(b.has('trading_post')?8:0)+(b.has('merchant_guild')?12:0)+(b.has('harbor')?6:0);else if(p.job==='건축가')s+=service28(t)*.45;return s;}
function attractiveness28(v,w,t,p){
 if(!t||t.ownerId!==v.id)return-Infinity;const rows=settlementRows28(v,w),r=rows.find(x=>x.id===t.id);if(!r)return-Infinity;const isHome=Number(p.homeTileId)===Number(t.id);if(!isHome&&r.cap-r.pop<.75)return-Infinity;let s=(r.cap-r.pop)*3.2+jobFit28(p,t,w)+r.service*.7+Math.min(14,r.commutersIn*.9)+Math.min(10,r.urbanity*.10)+(r.foodDays>=35?8:r.foodDays>=18?4:r.foodDays<8?-22:0)+(t.buildings||[]).includes('road')*4+socialAnchor28(v,p,t.id)-w.map.distance(v.coreTileId,t.id)*.25;
 if(NS.AIProfileCompat(v,'urbanConcentration')>.5)s+=r.urbanity*.17+(t.id===v.coreTileId?8:0);else if(NS.AIProfileCompat(v,'tradeDiplomacy')>.5)s+=r.service*.35+((t.buildings||[]).some(b=>['market','grand_market','trading_post','merchant_guild','harbor'].includes(b))?8:0);else if(NS.AIProfileCompat(v,'survivalPriority')>.5)s+=(r.foodDays>=40?7:0)+(r.cap-r.pop)*1.2;else if(NS.AIProfileCompat(v,'territorialExpansion')>.5)s+=(t.id===v.coreTileId?-5:3);else if(NS.AIProfileCompat(v,'resourceSeeking')>.5)s+=((t.ratio?.('wood',w.ordinalDay())||0)+(t.ratio?.('stone',w.ordinalDay())||0))*7;
 if(r.housingShortage>0)s-=18;if(r.severeHunger>0)s-=15;return s;
}
const attractiveness27=NS.Village.prototype.settlementAttractiveness;
NS.Village.prototype.settlementAttractiveness=function(w,t,p){const s=attractiveness28(this,w,t,p);return Number.isFinite(s)?s:attractiveness27.call(this,w,t,p);};

NS.Village.prototype.internalMigration=function(w){
 if(this.territory.size<2||this.population()<Math.max(8,this.territory.size+2))return false;
 const stats=ensureStats28(this),nowLegacy=Number(w.ordinalDay?.()||0),nowCal=calDay28(w),rows=settlementRows28(this,w,true),byId=new Map(rows.map(r=>[r.id,r]));let moves=0,maxMoves=Math.min(5,1+Math.floor(this.population()/300));if(NS.AIProfileCompat(this,'urbanConcentration')>.5)maxMoves=Math.min(7,maxMoves+1);
 const urbanist=NS.AIProfileCompat(this,'urbanConcentration')>.5,cooldownCal=urbanist?360:540,legacyGap=urbanist?120:160,baseThreshold=urbanist?8.5:10.5;
 for(let step=0;step<maxMoves;step++){
  const candidates=(this.residents||[]).filter(p=>{if(!p.alive||p.age<16||p.assignment==='PIONEER')return false;const src=byId.get(Number(p.homeTileId));if(!src||src.pop<=1)return false;const urgent=src.housingShortage>0||src.foodDays<7||src.severeHunger>0||src.avgHunger>=72,lastCal=Number(p._v28LastUrbanMoveCalendar??-99999),lastLegacy=Number(p.lastMoveDay??-9999);return urgent||((nowCal-lastCal)>=cooldownCal&&(nowLegacy-lastLegacy)>legacyGap);});
  if(!candidates.length)break;let best=null;
  for(const p of candidates){const src=w.map.get(p.homeTileId),srcRow=byId.get(Number(p.homeTileId));if(!src||!srcRow)continue;const srcScore=attractiveness28(this,w,src,p),lastCal=Number(p._v28LastUrbanMoveCalendar??-99999);
   for(const r of rows){if(r.id===src.id)continue;if(NS.V034D2?.sameSettlement?.(w,src.id,r.id,this.id)){NS.V034D2B?.countInternalCandidate?.(w);continue;}if(r.cap-r.pop<.75)continue;const d=w.map.distance(src.id,r.id),reverse=Number(p._v28PreviousHomeTileId)===Number(r.id)&&(nowCal-lastCal)<1080,destScore=attractiveness28(this,w,r.t,p);let diff=destScore-srcScore-Math.max(0,d-1)*.9-(reverse?10:0);if(srcRow.housingShortage>0||srcRow.foodDays<7||srcRow.severeHunger>0)diff+=4;if(!best||diff>best.diff)best={p,src,dest:r.t,diff,distance:d,reverse};}}
  if(!best||!Number.isFinite(best.diff)||best.diff<baseThreshold)break;
  const from=Number(best.p.homeTileId);best.p.homeTileId=best.dest.id;best.p.lastMoveDay=nowLegacy;best.p._v28PreviousHomeTileId=from;best.p._v28LastUrbanMoveCalendar=nowCal;best.p._v28LastUrbanScoreGain=best.diff;
  this.migrationStats.internal=(this.migrationStats.internal||0)+1;stats.migrationMoves++;moves++;const a=w.map.get(from);w.log(`${this.name}의 ${best.p.name}이(가) 생활 여건을 따라 (${a?.x},${a?.y})에서 (${best.dest.x},${best.dest.y}) 정착지로 이주했습니다.`,false,'INTERNAL_MIGRATION',{village:this.name,person:best.p.name,fromTileId:from,toTileId:best.dest.id,scoreGain:+best.diff.toFixed(1),distance:best.distance,reversePenalty:best.reverse,model:'V0.28_P1_STABLE_MIGRATION'});
  const rr=byId.get(from),dr=byId.get(best.dest.id);if(rr)rr.pop=Math.max(0,rr.pop-1);if(dr)dr.pop++;
  this._v26ResidentEpoch=Number(this._v26ResidentEpoch||0)+1;this._v26ResidentIndex=null;this._v27Shared=null;this._v28Rows=null;this._v28Summary=null;
 }
 stats.lastMigrationCalendar=nowCal;return moves>0;
};

function housingPulse28(v,w){if(NS.V034D2A?.housingPulse)return NS.V034D2A.housingPulse(v,w);
 const stats=ensureStats28(v),now=calDay28(w);if(now-stats.lastHousingCalendar<30)return false;stats.lastHousingCalendar=now;const rows=settlementRows28(v,w,true).filter(r=>r.pop>0).sort((a,b)=>{const pa=(a.housingShortage*20+Math.max(0,a.occupancy-.82)*55+a.urbanity*.30)*(NS.AIProfileCompat(v,'urbanConcentration')>.5?1.18:1),pb=(b.housingShortage*20+Math.max(0,b.occupancy-.82)*55+b.urbanity*.30)*(NS.AIProfileCompat(v,'urbanConcentration')>.5?1.18:1);return pb-pa;});let attempts=NS.AIProfileCompat(v,'urbanConcentration')>.5?2:1;
 for(const r of rows){if(attempts<=0)break;const occTrigger=NS.AIProfileCompat(v,'urbanConcentration')>.5?.90:.96;if(r.occupancy<occTrigger&&r.housingShortage<=0)continue;if(busy28(v,r.id))continue;let acted=false;for(let i=0;i<(r.t.buildings||[]).length&&!acted;i++){const b=r.t.buildings[i];if(b==='house'&&v.hasTech?.('URBAN_PLANNING'))acted=!!v.startHousingUpgrade?.(w,r.id,i,'V28_URBAN_DENSITY');else if(b==='row_house'&&v.hasTech?.('URBANIZATION'))acted=!!v.startHousingUpgrade?.(w,r.id,i,'V28_URBAN_DENSITY');}
  if(!acted&&v.startConstruction)acted=!!v.startConstruction(w,r.id,'house','V28_HOUSING_PRESSURE');if(!acted&&v.startLandDevelopment)acted=!!v.startLandDevelopment(w,r.id,'V28_URBAN_LAND');if(acted){stats.housingActions++;attempts--;w.telemetry.record('URBAN_HOUSING_ACTION',w,{village:v.name,tileId:r.id,population:r.pop,housingCapacity:+r.cap.toFixed(1),occupancy:+r.occupancy.toFixed(3),urbanity:+r.urbanity.toFixed(1),rank:r.rank});}}
 if(stats.housingActions){v._v28Rows=null;v._v28Summary=null;}return attempts<(NS.AIProfileCompat(v,'urbanConcentration')>.5?2:1);
}
function urbanFoodRelief28(w){
 if(Number(w._v24Subday||0)<2)return;const now=calDay28(w);if(w._v28FoodDay===now)return;w._v28FoodDay=now;
 for(const v of w.activeVillages||[]){const stats=ensureStats28(v),rows=settlementRows28(v,w),urban=new Map(rows.map(r=>[r.id,r.urbanity])),states=rows.filter(r=>r.pop>0).map(r=>foodState28(v,w,r.id)).filter(Boolean),receivers=states.filter(r=>r.days<12||r.severe>0||r.avgHunger>=64).sort((a,b)=>(b.severe-a.severe)||(a.days-b.days)||(b.avgHunger-a.avgHunger));
  for(const r of receivers){const target=r.severe>0||r.avgHunger>=76?46:34,need0=Math.max(0,r.daily*target-r.stock);let need=need0;if(need<.5)continue;const destTile=w.map.get(r.id),isHub=(urban.get(r.id)||0)>=48||(destTile?.buildings||[]).some(b=>['market','grand_market','trading_post','merchant_guild'].includes(b)),road=destTile?.buildings?.includes('road'),mult=clamp28(1.7+(isHub?.8:0)+(road?.45:0)+Math.min(1.0,r.pop/60),1.7,4.0),donors=[];
   for(const d of states){if(d.id===r.id||d.days<42)continue;const surplus=Math.max(0,d.stock-d.daily*36);if(surplus<.5)continue;const q=v.internalLogisticsCapacity?.(d.id,r.id,'food',false);if(!q||!Number.isFinite(q.cost)||q.capacity<=0)continue;donors.push({d,cost:q.cost,capacity:q.capacity,surplus,score:q.cost*3-d.days*.06});}donors.sort((a,b)=>a.score-b.score);let moved=0,used=0;
   for(const q of donors){if(need<.5||used>=6)break;const qty=Math.min(need,q.surplus,q.capacity*mult);if(qty<.5)continue;const took=v.withdrawAt(q.d.id,'food',qty),put=v.depositAt(r.id,'food',took);if(put<took)v.depositAt(q.d.id,'food',took-put);if(put<=0)continue;q.d.stock-=put;q.d.days=q.d.stock/q.d.daily;r.stock+=put;r.days=r.stock/r.daily;need-=put;moved+=put;used++;v.logisticsStats.moves++;v.logisticsStats.foodMoved=(v.logisticsStats.foodMoved||0)+put;stats.foodMoved+=put;if(put>=2)w.telemetry.record('INTERNAL_LOGISTICS',w,{village:v.name,resource:'food',qty:+put.toFixed(1),fromTileId:q.d.id,toTileId:r.id,routeCost:+q.cost.toFixed(2),capacity:+(q.capacity*mult).toFixed(2),reason:'V28_URBAN_FOOD_ACCESS',urbanity:+(urban.get(r.id)||0).toFixed(1),population:r.pop,localFoodDaysBefore:+((r.stock-put)/r.daily).toFixed(1),severeHunger:r.severe});}
   if(moved>0){stats.foodMoves++;stats.lastFoodCalendar=now;}else if((r.severe>0||r.days<6)&&need0>1){v._v28BlockedFood=v._v28BlockedFood||{};if(now-Number(v._v28BlockedFood[r.id]||-99999)>=30){v._v28BlockedFood[r.id]=now;stats.foodBlocked++;w.telemetry.record('V28_FOOD_ACCESS_BLOCKED',w,{village:v.name,tileId:r.id,population:r.pop,foodDays:+r.days.toFixed(1),avgHunger:+r.avgHunger.toFixed(1),severeHunger:r.severe,donors:donors.length});}}}
 }
}
function migrationPulse28(w){const now=calDay28(w);if(w._v28MigrationDay===now||now%30!==0)return;w._v28MigrationDay=now;for(const v of w.activeVillages||[])v.internalMigration(w);}
function developmentPulse28(w){if(w?._v32e1HousingManaged)return;const now=calDay28(w);if(w._v28HousingDay===now||now%30!==0)return;w._v28HousingDay=now;for(const v of w.activeVillages||[])housingPulse28(v,w);}
const advance27=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(){if(NS.V034G2?.relay)NS.V034G2.relay(this);else urbanFoodRelief28(this);const x=advance27.call(this);migrationPulse28(this);developmentPulse28(this);return x;};

/* ---------- V0.28 telemetry ---------- */
const snap27=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snap27.call(this,w,reason,note);if(!s)return s;let worldUrban=0,worldComm=0,worldHousing=0,worldFood=0,largest=0,adults=0;
 for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;const u=urbanSummary28(v,w,true),st=ensureStats28(v);Object.assign(r,{largestSettlementPop28:u.largestSettlementPop,top1SettlementShare28:+u.top1Share.toFixed(4),top3SettlementShare28:+u.top3Share.toFixed(4),settlementPopGini28:+u.popGini.toFixed(4),settlementEntropy28:+u.entropy.toFixed(4),settlementConcentration28:+u.concentration.toFixed(4),commuters28:u.commuters,commuterShare28:+u.commuterShare.toFixed(4),urbanPopulation28:u.urbanPopulation,urbanPopulationShare28:+u.urbanPopulationShare.toFixed(4),towns28:u.towns,cities28:u.cities,lifeZones28:u.lifeZones,largestLifeZonePop28:u.largestLifeZonePop,largestLifeZoneSettlements28:u.largestLifeZoneSettlements,housingStrainedResidents28:u.housingStrained,housingStrainShare28:+u.housingStrainShare.toFixed(4),foodStressedResidents28:u.foodStressed,foodStressShare28:+u.foodStressShare.toFixed(4),severeHungerResidents28:u.severeHunger,urbanMigrationMoves28:Number(st.migrationMoves||0),urbanHousingActions28:Number(st.housingActions||0),urbanFoodMoves28:Number(st.foodMoves||0),urbanFoodMoved28:+Number(st.foodMoved||0).toFixed(1),urbanFoodBlocked28:Number(st.foodBlocked||0)});worldUrban+=u.urbanPopulation;worldComm+=u.commuters;worldHousing+=u.housingStrained;worldFood+=u.foodStressed;largest=Math.max(largest,u.largestSettlementPop);adults+=(v.residents||[]).filter(p=>p.alive&&p.age>=15).length;}
 const pop=Math.max(1,w.allPeople.length);Object.assign(s.global,{urbanPopulation28:worldUrban,urbanPopulationShare28:+(worldUrban/pop).toFixed(4),commuters28:worldComm,commuterShare28:+(worldComm/Math.max(1,adults)).toFixed(4),housingStrainedResidents28:worldHousing,housingStrainShare28:+(worldHousing/pop).toFixed(4),foodStressedResidents28:worldFood,foodStressShare28:+(worldFood/pop).toFixed(4),largestSettlementPop28:largest});return s;
};
const csv27=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csv27.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['largestSettlementPop28','top1SettlementShare28','top3SettlementShare28','settlementPopGini28','settlementEntropy28','settlementConcentration28','commuters28','commuterShare28','urbanPopulation28','urbanPopulationShare28','towns28','cities28','lifeZones28','largestLifeZonePop28','largestLifeZoneSettlements28','housingStrainedResidents28','housingStrainShare28','foodStressedResidents28','foodStressShare28','severeHungerResidents28','urbanMigrationMoves28','urbanHousingActions28','urbanFoodMoves28','urbanFoodMoved28','urbanFoodBlocked28'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k]??s.global?.[k])).join(',');}return lines.join('\n');};
const json27=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json27.call(this,w);d.version='0.28';d.worldSummary.v28Revision=REV28;d.worldSummary.v28Patch=PATCH28;d.worldSummary.urbanization='emergent settlement urbanity from population, jobs, commuting, services, housing and access; labels are observational, not administrative';d.worldSummary.internalMigration='P1: Person moves use longer settlement inertia, movement friction and a three-year reverse-move penalty; emergency housing/food moves remain possible';d.worldSummary.lifeZones='P1: hub-anchored functional zones; each member needs a direct spatial/commuting relationship with its hub, preventing transitive nation-wide percolation';d.worldSummary.urbanHousing='housing pressure accelerates real house construction, land development and house -> row house -> collective housing upgrades';d.worldSummary.urbanFoodAccess='V0.27 physical stock transfers retained; high-density/high-hunger settlements receive broader last-mile donor search and blocked-route diagnostics';d.worldSummary.urbanMetrics='top-settlement share, settlement Gini/entropy, commuting, housing strain, food stress and life-zone metrics exported';d.worldSummary.buildingPresentation='P1: stable internal IDs with ancient-era display names; housing is interpreted as residential development groups (4/8/16 units)';d.worldSummary.performancePatch='P1: saturated-tech Knowledge fast path removes redundant settlement-wide research compatibility work from every Person action';d.worldSummary.logisticsLogging='P1: INTERNAL_LOGISTICS entries are aggregated by route into short observation windows and detailed route logs are retained for the latest 5 calendar years; physical move totals remain in logistics counters';d.worldSummary.logisticsDetailWindowYears=5;return d;};

/* ---------- Patch 1 logistics log compaction ---------- */
const recordBeforePatch28=NS.Telemetry.prototype.record;
function flushLogisticsAgg28(t,w,force=false){const a=t._v28LogisticsAgg;if(!a)return;const current=Math.floor(calDay28(w)/10);for(const [key,row] of Object.entries(a.rows||{})){if(!force&&row.bucket>=current)continue;recordBeforePatch28.call(t,'INTERNAL_LOGISTICS',w,{...row.payload,qty:+row.qty.toFixed(1),moveCount:row.moves,aggregated:true,aggregationWindowDays:10,firstCalendarDay:row.firstDay,lastCalendarDay:row.lastDay});delete a.rows[key];}}
NS.Telemetry.prototype.record=function(type,w,payload={}){if(type!=='INTERNAL_LOGISTICS')return recordBeforePatch28.call(this,type,w,payload);this._v28LogisticsAgg=this._v28LogisticsAgg||{rows:{}};flushLogisticsAgg28(this,w,false);const day=calDay28(w),bucket=Math.floor(day/10),key=[bucket,payload.village||'',payload.resource||'',payload.fromTileId??'',payload.toTileId??'',payload.reason||''].join('|'),rows=this._v28LogisticsAgg.rows,row=rows[key]||(rows[key]={bucket,firstDay:day,lastDay:day,moves:0,qty:0,payload:{...payload}});row.lastDay=day;row.moves++;row.qty+=Number(payload.qty||0);row.payload={...row.payload,...payload};return row;};
function compactLogisticsHistory28(t,w){const now=calDay28(w);if(now-Number(t._v28LastLogisticsCompact||0)<120)return;t._v28LastLogisticsCompact=now;const cutoff=now-1800;t.entries=(t.entries||[]).filter(e=>{if(e.type!=='INTERNAL_LOGISTICS')return true;const d=Number(e.calendarOrdinalDay24??((e.ordinalDay||0)*3));return d>=cutoff;});}
const snapshotBeforePatch28=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){flushLogisticsAgg28(this,w,false);compactLogisticsHistory28(this,w);return snapshotBeforePatch28.call(this,w,reason,note);};
const jsonBeforeLogFlush28=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){flushLogisticsAgg28(this,w,true);return jsonBeforeLogFlush28.call(this,w);};

/* ---------- UI ---------- */
if(NS.UI){
 const header27=NS.UI.prototype.renderHeader,card27=NS.UI.prototype.settlementCard,content27=NS.UI.prototype.renderVillageContent,setWorld27=NS.UI.prototype.setWorld;
 NS.UI.prototype.renderHeader=function(){header27.call(this);const el=this.q('runtimeStatus');if(el)el.textContent=el.textContent.replace('V0.27 Person 최적화','V0.28 도시화 V1 · Patch 1');document.title='Village Observer V0.28 P1';const e=document.querySelector('.eyebrow');if(e)e.textContent='Village Observer · V0.28 P1';ensurePatchNotesUI28();};
 NS.UI.prototype.setWorld=function(w){return setWorld27.call(this,attachV28World(w));};
 NS.UI.prototype.settlementCard=function(v,id){let html=card27.call(this,v,id);const u=urbanSummary28(v,this.world),r=u.rows.find(x=>x.id===id);if(!r)return html;const line=`<div class="v28-urban-line small"><strong>${r.rank}</strong> · 도시성 ${r.urbanity.toFixed(0)} · 근무 ${r.workers} · 유입통근 ${r.commutersIn} / 유출 ${r.commutersOut} · 주거 ${(r.occupancy*100).toFixed(0)}% · 식량 ${Number.isFinite(r.foodDays)?r.foodDays.toFixed(1):'∞'}일</div>`;return html.replace('<div class="buildings">',line+'<div class="buildings">');};
 NS.UI.prototype.renderVillageContent=function(){content27.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el)return;
  if(this.sub==='overview'&&!el.querySelector('.v28-urban-box')){const u=urbanSummary28(v,this.world,true),hub=u.hub,ht=hub?this.world.map.get(hub.id):null,box=document.createElement('div');box.className='v28-urban-box';box.innerHTML=`<strong>🏙️ V0.28 도시화·생활권</strong><div class="v28-urban-grid"><span>최대 정착지 <b>${u.largestSettlementPop}</b>명</span><span>상위 3곳 <b>${(u.top3Share*100).toFixed(1)}%</b></span><span>인구 Gini <b>${u.popGini.toFixed(3)}</b></span><span>통근 <b>${u.commuters}</b>명 (${(u.commuterShare*100).toFixed(1)}%)</span><span>소도시/도시 <b>${u.towns}/${u.cities}</b></span><span>생활권 <b>${u.lifeZones}</b>개</span><span>주거 압박 <b>${u.housingStrained}</b>명</span><span>식량 스트레스 <b>${u.foodStressed}</b>명</span></div><div class="small muted">${hub?`최대 중심지: (${ht?.x},${ht?.y}) ${hub.rank} · 도시성 ${hub.urbanity.toFixed(0)} · P1 생활권은 중심지 직접 연결을 요구하는 비행정 단위입니다.`:'아직 뚜렷한 중심지가 없습니다.'}</div>`;el.appendChild(box);}
  if(this.sub==='settlements'){const detail=el.querySelector('.v17-settlement-detail'),id=Number(this.selectedSettlementDetailId??this.world.selectedTileId),t=v.territory.has(id)?this.world.map.get(id):null;if(detail&&t&&!detail.querySelector('.v28-detail-kpis')){const u=urbanSummary28(v,this.world,true),r=u.rows.find(x=>x.id===id),people=v.tileResidents(id).filter(p=>p.alive);if(r){const happy=people.length?people.reduce((a,p)=>a+Number(p.happiness||0),0)/people.length:0,conds=(t.buildingCondition||[]).map(Number).filter(Number.isFinite),cond=conds.length?conds.reduce((a,b)=>a+b,0)/conds.length:100,box=document.createElement('div');box.className='v28-detail-kpis';const summaryCard=el.querySelector(`[data-v17-settlement="${id}"]`),maintText=[...(summaryCard?.querySelectorAll('.small')||[])].map(x=>x.textContent.trim()).find(x=>x.startsWith('분기 유지:'))||'분기 유지 정보 없음';box.innerHTML=`<div><span>🏙️ 등급</span><strong>${r.rank}</strong><small>도시성 ${r.urbanity.toFixed(0)}</small></div><div><span>🏠 주거</span><strong>${r.pop}/${r.cap.toFixed(0)}</strong><small>점유 ${(r.occupancy*100).toFixed(0)}%</small></div><div><span>🙂 행복</span><strong>${happy.toFixed(1)}</strong><small>거주민 평균</small></div><div><span>🔧 건물 상태</span><strong>${cond.toFixed(0)}%</strong><small>평균 condition</small></div><div><span>💼 근무</span><strong>${r.workers}</strong><small>현지 근무자</small></div><div><span>↔️ 통근</span><strong>${r.commutersIn}/${r.commutersOut}</strong><small>유입 / 유출</small></div><div><span>🌾 식량</span><strong>${Number.isFinite(r.foodDays)?r.foodDays.toFixed(1):'∞'}일</strong><small>평균 Hunger ${r.avgHunger.toFixed(1)}</small></div><div class="v28-kpi-wide"><span>🧰 유지관리</span><strong>${maintText.replace('분기 유지:','').trim()}</strong><small>요약 카드와 동일한 분기 필요량</small></div>`;const head=detail.querySelector('.section-head');head?.insertAdjacentElement('afterend',box);}}}
 };
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`.v28-urban-line{margin:7px 0 3px;padding:6px 8px;border-left:3px solid var(--nation-color,#6fa8dc);background:rgba(255,255,255,.035);border-radius:5px}.v28-urban-box{margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:13px;background:#0d1b2c}.v28-urban-grid{display:grid;grid-template-columns:repeat(4,minmax(110px,1fr));gap:7px;margin:9px 0}.v28-urban-grid span{padding:7px 8px;background:rgba(255,255,255,.035);border-radius:8px}@media(max-width:720px){.v28-urban-grid{grid-template-columns:repeat(2,1fr)}}.v28-detail-kpis{display:grid;grid-template-columns:repeat(4,minmax(110px,1fr));gap:7px;margin:8px 0 12px}.v28-detail-kpis>div{display:flex;flex-direction:column;gap:2px;padding:8px 9px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.035)}.v28-detail-kpis span,.v28-detail-kpis small{font-size:10px;color:var(--muted)}.v28-detail-kpis strong{font-size:15px}.v28-kpi-wide{grid-column:span 2}.version-badge{min-height:32px;padding:5px 8px;border-radius:999px;background:rgba(105,173,255,.08);border:1px solid rgba(105,173,255,.38);cursor:pointer;line-height:1.15;text-align:left}.version-badge:hover,.version-badge:focus-visible{background:rgba(105,173,255,.16);outline:2px solid var(--accent);outline-offset:2px}.patch-notes-card{width:min(680px,100%);padding:18px 18px 20px}.patch-notes-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-right:42px}.patch-notes-intro{margin:7px 0 12px;line-height:1.55}.patch-notes-list{display:flex;flex-direction:column;gap:8px}.patch-note-entry{border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.025);overflow:hidden}.patch-note-entry summary{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:46px;padding:10px 12px;cursor:pointer;list-style:none}.patch-note-entry summary::-webkit-details-marker{display:none}.patch-note-entry summary small{color:var(--muted);white-space:nowrap}.patch-note-body{padding:0 13px 13px;border-top:1px solid var(--line);line-height:1.55}.patch-note-body p{margin:10px 0}.patch-note-body h3{margin:12px 0 5px}.patch-note-body ul{margin:5px 0 0;padding-left:20px}.patch-note-body li+li{margin-top:4px}@media(max-width:720px){.v28-detail-kpis{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.version-badge{min-height:40px;max-width:190px;white-space:normal}.patch-notes-modal{padding:8px;align-items:flex-end}.patch-notes-card{width:100%;max-height:88vh;border-radius:16px 16px 10px 10px;padding:16px 12px calc(18px + env(safe-area-inset-bottom))}.patch-note-entry summary{min-height:52px;padding:11px 10px;align-items:flex-start}.patch-note-entry summary span{line-height:1.35}.patch-notes-head{padding-right:44px}.v28-kpi-wide{grid-column:1/-1}}`;document.head.appendChild(st);}

/* ---------- Patch notes / version badge ---------- */
const PATCH_NOTES28=[
 {
  version:'V0.28 P1',date:'2026-09-24',title:'도시화 장기주행 보완 패치',summary:'V0.28 장기주행에서 확인된 이주·생활권·성능·로그 문제를 보완하고, 건물 세대명과 관찰 UI를 정리했습니다.',
  sections:[
   ['신규',['게임 상단 버전 배지에서 패치노트를 바로 열 수 있습니다.','건물 표시명에 건축 세대를 적용했습니다. 예: 고대 주택·고대 시장·고대 교역소.','주거는 단독 건물 1채가 아니라 주거 개발 단위로 해석합니다: 고대 주택 4 → 고대 연립주거 8 → 고대 집합주거 16 주거단위.']],
   ['수정',['도로 R1/R2/R3 표시는 지도 셀 크기에 비례해 확대·축소되며, 지나치게 축소된 지도에서는 숨겨집니다.','반복 이주와 A→B→A 역이주를 억제하는 정착 관성을 강화했습니다.','생활권이 징검다리 연결만으로 국가 전체까지 합쳐지는 현상을 줄이고 중심지 직접 연결 방식으로 바꿨습니다.','Settlement 상세에서 요약 카드의 도시성·주거·행복·건물상태·통근·분기 유지관리 정보를 빠짐없이 확인할 수 있습니다.','건물 표시명은 카드·상세·백과·공사/개축 표시에서 같은 NS.BUILDINGS 명칭을 사용하도록 통일했습니다.']],
   ['성능·관측',['모든 기술 연구 완료 뒤 반복되던 불필요한 연구 호환 경로를 우회했습니다.','내부 물류 상세 로그를 10일 단위로 묶고 최근 5년 상세만 유지해 devlog 증가를 줄였습니다.']]
  ]
 },
 {
  version:'V0.28',date:'2026-09-24',title:'후기 정착구조·도시화 V1',summary:'실제 Person의 이주·통근·주거·식량 접근을 통해 Settlement가 스스로 촌락·마을·소도시·도시와 생활권으로 분화하는 버전입니다.',
  sections:[
   ['핵심',['Person 기반 국내이주 V2와 실제 homeTileId 이동','인구·일자리·통근·서비스·주거·접근성에서 계산되는 관찰용 도시성/등급','통근과 인접 중심지를 바탕으로 한 비행정 생활권','주거압박에 따른 주택 건설·토지개발·주택→연립→집합 고밀도화','V0.27 실물 재고 이동을 유지한 도시 식량 접근성 보강']]
  ]
 }
];
NS.PATCH_NOTES=PATCH_NOTES28;
function patchNotesHTML28(){return `<div class="patch-notes-head"><div><div class="small muted">Village Observer</div><h2>패치 노트</h2></div><span class="tag">${PATCH_NOTES28[0].version}</span></div><div class="small muted patch-notes-intro">README는 상세 기술 문서로 유지하며, 이 화면은 README의 핵심 변경점을 짧게 요약한 인게임 패치노트입니다.</div><div class="patch-notes-list">${PATCH_NOTES28.map((n,i)=>`<details class="patch-note-entry" ${i===0?'open':''}><summary><span><strong>${n.version}</strong> · ${n.title}</span><small>${n.date}</small></summary><div class="patch-note-body"><p>${n.summary}</p>${n.sections.map(([label,items])=>`<section><h3>${label}</h3><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul></section>`).join('')}</div></details>`).join('')}</div>`;}
function ensurePatchNotesUI28(){
 if(typeof document==='undefined')return;
 let modal=document.getElementById('patchNotesModal');
 if(!modal){modal=document.createElement('div');modal.id='patchNotesModal';modal.className='modal patch-notes-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','patchNotesTitle');modal.innerHTML=`<div class="modal-card patch-notes-card"><button type="button" class="modal-close" id="patchNotesClose" aria-label="패치노트 닫기">✕</button><div id="patchNotesBody"></div></div>`;document.body.appendChild(modal);}
 const body=document.getElementById('patchNotesBody');if(body&&!body.dataset.ready){body.innerHTML=patchNotesHTML28().replace('<h2>패치 노트</h2>','<h2 id="patchNotesTitle">패치 노트</h2>');body.dataset.ready='1';}
 const badge=document.getElementById('versionBadge')||document.querySelector('.version-badge');
 const close=document.getElementById('patchNotesClose');
 const open=()=>{modal.classList.add('open');badge?.setAttribute('aria-expanded','true');requestAnimationFrame(()=>close?.focus());};
 const shut=()=>{modal.classList.remove('open');badge?.setAttribute('aria-expanded','false');badge?.focus();};
 if(badge&&!badge.dataset.patchBound){badge.dataset.patchBound='1';badge.setAttribute('aria-expanded','false');badge.onclick=open;}
 if(close&&!close.dataset.patchBound){close.dataset.patchBound='1';close.onclick=shut;}
 if(!modal.dataset.patchBound){modal.dataset.patchBound='1';modal.addEventListener('click',e=>{if(e.target===modal)shut();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))shut();});}
}

/* ---------- save/load compatibility ---------- */
function attachV28World(w){NS.V027.attachWorld(w);for(const v of w.villages||[]){v._world=w;ensureStats28(v);v._v28Rows=null;v._v28Summary=null;}return w;}
const ser27=NS.World.prototype.serialize,from27=NS.World.from;
NS.World.prototype.serialize=function(){flushLogisticsAgg28(this.telemetry,this,true);const d=ser27.call(this);d.version='0.28';d.v28={revision:REV28,patch:PATCH28,emergentUrbanity:true,personMigration:true,stableMigration:true,lifeZones:true,hubAnchoredLifeZones:true,urbanHousing:true,urbanFoodAccess:true,eraBuildingLabels:true,groupedHousingPresentation:true,aggregatedLogisticsLogs:true};d.v28Nations=(this.villages||[]).map(v=>({id:v.id,stats:{...ensureStats28(v)}}));return d;};
NS.World.from=function(d){if(d.version==='0.28'){const w=from27({...d,version:'0.27'});attachV28World(w);for(const x of d.v28Nations||[]){const v=w.villages.find(q=>q.id===x.id);if(v)v.v28Stats={...ensureStats28(v),...(x.stats||{})};}return w;}return attachV28World(from27(d));};
NS.V028={attachWorld:attachV28World,revision:REV28,patch:PATCH28,buildingPresentation:BUILDING_PRESENTATION28,urbanSummary:urbanSummary28,settlementRows:settlementRows28,lifeZones:lifeZones28,urbanFoodRelief:urbanFoodRelief28,housingPulse:housingPulse28,flushLogisticsLogs:flushLogisticsAgg28};
(function(){const KEY='village-observer-v0-28',fallback=['village-observer-v0-27','village-observer-v0-26','village-observer-v0-25','village-observer-v0-24','village-observer-v0-23','village-observer-v0-22','village-observer-v0-21','village-observer-v0-20','village-observer-v0-19','village-observer-v0-18','village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v028-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v028-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v028-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attachV28World(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
})(window.VSim);
