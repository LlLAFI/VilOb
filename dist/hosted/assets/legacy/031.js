
window.VSim=window.VSim||{};(function(NS){
/* ============================================================
   V0.21 · Frontier Growth
   - population-backed settlement expansion capacity
   - mature settlement sources rather than nation-size slot steps
   - compact / infill-biased frontier candidate scoring
   - two real pioneers remain at new land frontiers
   - frontier maturity + diagnostics telemetry
   ============================================================ */
const clamp21=(v,a,b)=>Math.max(a,Math.min(b,v));
const ensurePerson21=p=>NS.V020.ensurePerson(p);
function ensureNation21(v){
 v.frontierStats21=v.frontierStats21||{starts:0,claims:0,recaptures:0,cancels:0,ruins:0,reinforced:0,matured:0};if(!Number.isFinite(v.frontierStats21.ruins))v.frontierStats21.ruins=0;if(!Number.isFinite(v.frontierStats21.cancels))v.frontierStats21.cancels=0;
 v._v21FrontierCooldown=Number(v._v21FrontierCooldown||0);
 return v;
}
function frontierRules21(v){
 const r={minRemainAdults:1,minSourcePopulation:3,sourceReserve:28,autoDensity:2.50,reinforceDensity:3.25};
 if(NS.AIProfileCompat(v,'territorialExpansion')>.5)Object.assign(r,{minRemainAdults:1,minSourcePopulation:3,sourceReserve:24,autoDensity:2.20});
 else if(NS.AIProfileCompat(v,'resourceSeeking')>.5)Object.assign(r,{minRemainAdults:1,minSourcePopulation:3,sourceReserve:26,autoDensity:2.35});
 else if(NS.AIProfileCompat(v,'urbanConcentration')>.5)Object.assign(r,{minRemainAdults:2,minSourcePopulation:4,sourceReserve:34,autoDensity:3.25,reinforceDensity:3.65});
 else if(NS.AIProfileCompat(v,'survivalPriority')>.5)Object.assign(r,{minRemainAdults:2,minSourcePopulation:4,sourceReserve:34,autoDensity:2.85,reinforceDensity:3.45});
 else if(NS.AIProfileCompat(v,'tradeDiplomacy')>.5)Object.assign(r,{sourceReserve:29,autoDensity:2.45});
 return NS.V033F5A7?.applyFrontierRules?.(v,r)||r;
}
const residentIndexCache21=new WeakMap();
function residentIndex21(v,w){const day=w.ordinalDay(),cached=residentIndexCache21.get(v);if(cached&&cached.day===day&&cached.count===v.residents.length)return cached.map;const map=new Map();for(const p of v.residents)if(p.alive){const id=p.homeTileId;let a=map.get(id);if(!a)map.set(id,a=[]);a.push(p);}residentIndexCache21.set(v,{day,count:v.residents.length,map});return map;}
function invalidateResidentIndex21(v){residentIndexCache21.delete(v);}
function buildingEff21(t,type){
 if(!t||!Array.isArray(t.buildings))return 0;let best=0;
 for(let i=0;i<t.buildings.length;i++)if(t.buildings[i]===type){const q=Array.isArray(t.buildingCondition)?Number(t.buildingCondition[i]??100):100;best=Math.max(best,q>=70?1:clamp21(q/70,0,1));}
 return best;
}
function localCapacity21(t){
 if(!t||!Array.isArray(t.buildings))return 0;let n=0;
 for(let i=0;i<t.buildings.length;i++){const q=Array.isArray(t.buildingCondition)?Number(t.buildingCondition[i]??100):100,e=q>=70?1:clamp21(q/70,0,1);n+=Number(NS.BUILDINGS[t.buildings[i]]?.capacity||0)*e;}
 return n;
}
function projectAtSource21(v,sourceId){return (v.frontierProjects||[]).find(p=>p.sourceTileId===sourceId)||null;}
function frontierReserved21(w,targetId){for(const v of (w.activeVillages||w.villages||[]))if((v.frontierProjects||[]).some(p=>p.targetTileId===targetId))return true;return false;}
function regionalPioneerPool21(v,w,sourceId,rules){
 const src=w.map.get(sourceId),idx=residentIndex21(v,w),rows=[];if(!src)return rows;
 for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const dist=Math.abs(dx)+Math.abs(dy);if(dist>2)continue;const t=w.map.at?.(src.x+dx,src.y+dy);if(!t||t.ownerId!==v.id)continue;const people=idx.get(t.id)||[],avail=people.filter(p=>p.age>=16&&p.age<=60&&p.assignment!=='PIONEER'),keep=t.id===sourceId?rules.minRemainAdults:1,take=Math.max(0,avail.length-keep);if(!take)continue;const ordered=avail.slice().sort((a,b)=>((b.skills?.building||0)+(b.skills?.hunting||0))-((a.skills?.building||0)+(a.skills?.hunting||0)));for(const p of ordered.slice(0,take))rows.push({person:p,homeTileId:t.id,distance:dist});}
 return rows.sort((a,b)=>a.distance-b.distance||(((b.person.skills?.building||0)+(b.person.skills?.hunting||0))-((a.person.skills?.building||0)+(a.person.skills?.hunting||0))));
}
function sourceProfile21(v,w,sourceId){
 const t=w.map.get(sourceId),idx=residentIndex21(v,w),people=idx.get(sourceId)||[],allAdults=people.filter(p=>p.age>=16&&p.age<=60),available=allAdults.filter(p=>p.assignment!=='PIONEER'),reserve=v.settlementReserveDays(sourceId),project=projectAtSource21(v,sourceId),founded=Number(t?.frontierFoundedDay||0),ageOk=sourceId===v.coreTileId||!founded||w.ordinalDay()-founded>=75,rules=frontierRules21(v);
 const shelter=sourceId===v.coreTileId||buildingEff21(t,'outpost')>0||buildingEff21(t,'house')>0||buildingEff21(t,'row_house')>0||buildingEff21(t,'collective_house')>0;
 const mature=!!t&&people.length>=3&&allAdults.length>=2&&reserve>=24&&ageOk&&shelter;
 const pioneerPool=regionalPioneerPool21(v,w,sourceId,rules),surplusAdults=pioneerPool.length;
 return{sourceId,t,people,allAdults,available,pioneerPool,reserve,project,ageOk,shelter,mature,surplusAdults,capacity:localCapacity21(t),rules};
}
function nearbyOwned21(v,w,t,r=2){let owned=0,populated=0,pop=0;const idx=residentIndex21(v,w);for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.abs(dx)+Math.abs(dy)>r||(!dx&&!dy))continue;const q=w.map.at?.(t.x+dx,t.y+dy);if(q?.ownerId===v.id){owned++;const n=(idx.get(q.id)||[]).length;if(n){populated++;pop+=n;}}}return{owned,populated,pop};}
function neutralNeighbors21(v,w,sourceId){return w.map.neighbors4(sourceId).filter(t=>t.ownerId===null&&NS.TERRAIN[t.terrain]?.passable&&!frontierReserved21(w,t.id));}
function frontierDiagnostics21(v,w){
 ensureNation21(v);const d={mature:0,eligible:0,surplusAdults:0,blockedPopulation:0,blockedAdults:0,blockedReserve:0,blockedAge:0,blockedProject:0,blockedNoCandidate:0};
 for(const id of v.territory){const s=sourceProfile21(v,w,id),r=s.rules;if(s.mature)d.mature++;if(s.project){d.blockedProject++;continue;}if(s.people.length<r.minSourcePopulation){d.blockedPopulation++;continue;}if(s.surplusAdults<2){d.blockedAdults++;continue;}if(s.reserve<r.sourceReserve){d.blockedReserve++;continue;}if(!s.ageOk||!s.shelter){d.blockedAge++;continue;}const nn=neutralNeighbors21(v,w,id);if(!nn.length){d.blockedNoCandidate++;continue;}d.eligible++;d.surplusAdults+=s.surplusAdults;}
 return d;
}
function maxFrontierProjects21(v,w=v._world){
 ensureNation21(v);if(!w)return Math.max(0,(v.frontierProjects||[]).length);let capable=0;for(const id of v.territory){const s=sourceProfile21(v,w,id),r=s.rules;if(s.mature&&s.people.length>=r.minSourcePopulation&&(s.surplusAdults>=2||s.project))capable++;}
 return clamp21(Math.max((v.frontierProjects||[]).length,capable),0,8);
}
function localExpansionCandidates21(v,w){
 const rr=v.resourceRatios(w),need={food:Math.max(0,.42-rr.food),wood:Math.max(0,.34-rr.wood),stone:Math.max(0,.28-rr.stone)},day=w.ordinalDay(),rows=[];
 for(const sourceId of v.territory){const s=sourceProfile21(v,w,sourceId);if(s.project||!s.mature||s.people.length<s.rules.minSourcePopulation||s.surplusAdults<2||s.reserve<s.rules.sourceReserve)continue;
  for(const t of neutralNeighbors21(v,w,sourceId)){t.syncResources?.(day);const adj=w.map.ownedNeighborCount(t.id,v.id),near=nearbyOwned21(v,w,t,2),mem=v.expansionMemory?.[t.id],coreDist=w.map.distance(v.coreTileId,t.id);let score=s.people.length*2.4+s.surplusAdults*5.5+adj*27+near.owned*4+near.populated*4;
   if(adj>=2)score+=(adj-1)*18;if(adj===1)score-=Math.max(0,13-near.owned*2.2);score-=Math.max(0,coreDist-5)*.35;
   score+=(Number(t.resourceCap?.food||0)/1700)*17*(.65+need.food*2.0);score+=(Number(t.resourceCap?.wood||0)/2350)*14*(.55+need.wood*2.1);score+=(Number(t.resourceCap?.stone||0)/3350)*12*(.5+need.stone*2.4);
   if(t.ruin)score+=24;if(t.terrain==='mountain')score-=5;
   if(NS.AIProfileCompat(v,'territorialExpansion')>.5){score+=12;if(adj===1)score+=5;}
   if(NS.AIProfileCompat(v,'resourceSeeking')>.5)score+=(Number(t.resourceCap?.wood||0)/2350)*12+(Number(t.resourceCap?.stone||0)/3350)*18;
   if(NS.AIProfileCompat(v,'urbanConcentration')>.5){score+=adj*7+near.populated*3;score-=8;}
   if(NS.AIProfileCompat(v,'survivalPriority')>.5)score+=adj*3;
   if(mem){const age=Math.max(0,day-Number(mem.lastDay||0));score-=Math.max(0,20*Number(mem.failures||0)-age/60);}score+=Math.random()*1.5;
   rows.push({sourceId,tile:t,score,adj,near,source:s,adults:s.pioneerPool.map(x=>x.person)});
  }
 }
 const sea=(v.expansionCandidates?.(w)||[]).filter(q=>q.maritime&&!frontierReserved21(w,q.tile?.id));for(const q of sea){const sourceId=q.harborId??q.tile?._v15MaritimeMeta?.harborId,s=sourceProfile21(v,w,sourceId);if(sourceId==null||!s.mature||s.people.length<s.rules.minSourcePopulation||s.surplusAdults<2||s.reserve<Math.max(34,s.rules.sourceReserve+5)||s.project)continue;rows.push({sourceId,tile:q.tile,score:q.score-12,adj:0,near:{owned:0,populated:0,pop:0},source:s,adults:s.pioneerPool.map(x=>x.person),maritime:true,seaSteps:q.seaSteps,harborId:sourceId});}
 return rows.sort((a,b)=>b.score-a.score);
}
function canStartFrontier21(v,w,autonomous=false){
 ensureNation21(v);if(v.status!=='active'||v.recoveryState?.active)return false;const cap=maxFrontierProjects21(v,w);if((v.frontierProjects||[]).length>=cap)return false;if(w.ordinalDay()<61&&v.territory.size===1)return false;
 if(v.foodReserveDays()<(autonomous?38:22)||v.wood<14||v.stone<4)return false;const density=v.population()/Math.max(1,v.territory.size),rules=frontierRules21(v);if(density<(autonomous?rules.autoDensity:2.0))return false;const rows=localExpansionCandidates21(v,w);if(!rows.length)return false;const pickA2=NS.V033F5A2?.selectAffordableCandidate?.(v,w,rows,{model:'V21_BALANCED_FRONTIER',autonomous});if(NS.V033F5A2&&!pickA2?.candidate)return false;const fq=pickA2?.quote||NS.V033F5A1?.frontierFeasibility?.(v,w,{model:'V21_BALANCED_FRONTIER',candidate:rows[0],autonomous});if(fq&&!fq.ok)return false;return true;
}
function startFrontier21(v,w,autonomous=false){
 if(!canStartFrontier21(v,w,autonomous))return false;const rows=localExpansionCandidates21(v,w),pickA2=NS.V033F5A2?.selectAffordableCandidate?.(v,w,rows,{model:'V21_BALANCED_FRONTIER',autonomous}),c=pickA2?.candidate||rows[0],threshold=autonomous?(46-8*NS.AIProfileCompat(v,'territorialExpansion')-3*NS.AIProfileCompat(v,'resourceSeeking')+8*NS.AIProfileCompat(v,'urbanConcentration')+3*NS.AIProfileCompat(v,'survivalPriority')):32;if(!c||c.score<threshold)return false;
 const adults=c.adults.filter(p=>p.assignment!=='PIONEER').sort((a,b)=>((b.skills?.building||0)+(b.skills?.hunting||0))-((a.skills?.building||0)+(a.skills?.hunting||0)));if(adults.length<2||c.source.surplusAdults<2)return false;const density=v.population()/Math.max(1,v.territory.size),pioneerCount=(c.source.people.length>=7&&c.source.pioneerPool.length>=4&&c.source.surplusAdults>=4&&density>=3.7)?3:2,pioneers=adults.slice(0,pioneerCount),extra=Math.max(0,pioneers.length-2),cost={wood:14+extra*2,stone:4,food:10+extra*3,gold:NS.V033F5A2?.terrainGoldCost?.(c.tile.terrain,pioneers.length)??(6+extra)};if(pioneers.length<2||v.wood<cost.wood||v.stone<cost.stone||v.food<cost.food)return false;const projectId=`fx21-${v.id}-${w.ordinalDay()}-${Math.random().toString(36).slice(2,7)}`;const finance21=NS.V033F5A?.payFrontierFinance?.(v,w,{projectId,sourceTileId:c.sourceId,targetTileId:c.tile.id,cost,pioneers,frontierType:'V21_BALANCED_FRONTIER',recovery:false});if(NS.V033F5A&&!finance21?.ok)return false;
 const _foodBeforeD3A1=NS.V034D3A1?.frontierBefore?.(v,w);v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;NS.V034D3A1?.frontierAfter?.(v,w,_foodBeforeD3A1);if(!NS.V033F5A)v.gold-=cost.gold;for(const p of pioneers){p.assignment='PIONEER';ensurePerson21(p).workTileId=c.sourceId;}invalidateResidentIndex21(v);
 let duration=NS.TERRAIN[c.tile.terrain].duration*.62;if(v.hasTech?.('FRONTIER_LOGISTICS'))duration*=.84;if(v.hasTech?.('ENGINEERING'))duration*=.90;if(c.maritime)duration*=1.22+Math.min(.28,Number(c.seaSteps||0)*.035);if(c.tile.ruin)duration*=.72;duration=Math.max(110,Math.round(duration));
 const pr={id:projectId,sourceTileId:c.sourceId,targetTileId:c.tile.id,startDay:w.ordinalDay(),progress:0,duration,pioneerIds:pioneers.map(p=>p.id),lastRiskCheck:w.ordinalDay(),stallDays:0,events:0,maritime:!!c.maritime,seaSteps:c.seaSteps||0,originHarborId:c.harborId??null,score:+c.score.toFixed(1),v21:true,sourcePopulation:c.source.people.length,sourceAdults:c.source.allAdults.length,adjacentOwned:c.adj,nearbyOwned:c.near.owned};
 v.frontierProjects.push(pr);v.frontierStats21.starts++;
 w.log(`${v.name}의 (${c.source.t?.x},${c.source.t?.y}) 성숙 정착지가 (${c.tile.x},${c.tile.y}) 개척대를 보냈습니다.`,false,'FRONTIER_EXPANSION_STARTED',{village:v.name,sourceTileId:c.sourceId,targetTileId:c.tile.id,terrain:c.tile.terrain,duration,pioneers:pioneers.map(p=>p.name),parallel:v.frontierProjects.length,maxParallel:maxFrontierProjects21(v,w),maritime:!!c.maritime,score:+c.score.toFixed(1),sourcePopulation:c.source.people.length,sourceAdults:c.source.allAdults.length,adjacentOwned:c.adj,nearbyOwned:c.near.owned,model:'V0.21_BALANCED_FRONTIER',goldCost:+Number(cost.gold||0).toFixed(3),terrainGoldModel33F5A2:!!NS.V033F5A2});return true;
}
function reinforceCompletedFrontier21(v,w,p,wasRuin){
 const t=w.map.get(p.targetTileId);if(!t||t.ownerId!==v.id)return;ensureNation21(v);t.frontierFoundedDay=Number(t.frontierFoundedDay||w.ordinalDay());t.frontierSourceTileId=p.sourceTileId;t.frontierMatureDay=Number(t.frontierMatureDay||0);
 const pioneers=(p.pioneerIds||[]).map(id=>v.residents.find(x=>x.id===id&&x.alive)).filter(Boolean);let moved=0;for(const x of pioneers){ensurePerson21(x);if(x.homeTileId!==t.id){x.homeTileId=t.id;moved++;}x.workTileId=t.id;x.assignment=null;x.workAssignmentUntil=w.ordinalDay()+45;x.lastMoveDay=w.ordinalDay();}invalidateResidentIndex21(v);
 const source=w.map.get(p.sourceTileId);if(source){const sp=v.tileResidents(source.id).filter(x=>x.alive).length,foodSurplus=Math.max(0,v.stockAt(source.id,'food')-sp*.36*32),fq=Math.min(10,foodSurplus);if(fq>0){const took=v.withdrawAt(source.id,'food',fq);v.depositAt(t.id,'food',took);}const wq=Math.min(3,Math.max(0,v.stockAt(source.id,'wood')-8));if(wq>0){const took=v.withdrawAt(source.id,'wood',wq);v.depositAt(t.id,'wood',took);}}
 if(wasRuin)v.frontierStats21.recaptures++;else v.frontierStats21.claims++;if(moved){v.frontierStats21.reinforced+=moved;w.telemetry.record('FRONTIER_SETTLERS_ESTABLISHED',w,{village:v.name,tileId:t.id,sourceTileId:p.sourceTileId,settlers:pioneers.map(x=>x.name),residentCount:v.tileResidents(t.id).filter(x=>x.alive).length});}
}
function updateFrontierMaturity21(v,w){
 for(const id of v.territory){if(id===v.coreTileId)continue;const t=w.map.get(id);if(!t)continue;const s=sourceProfile21(v,w,id);if(s.mature&&!t.frontierMatureDay){t.frontierMatureDay=w.ordinalDay();v.frontierStats21.matured++;if(t.frontierFoundedDay)w.telemetry.record('FRONTIER_SETTLEMENT_MATURED',w,{village:v.name,tileId:id,population:s.people.length,adults:s.allAdults.length,reserveDays:+s.reserve.toFixed(1),daysSinceFounded:w.ordinalDay()-t.frontierFoundedDay});}}
}
function reinforceThinFrontiers21(v,w){
 const density=v.population()/Math.max(1,v.territory.size),rules=frontierRules21(v),now=w.ordinalDay();if(density<rules.reinforceDensity||v.foodReserveDays()<55)return 0;let moved=0;
 const targets=[...v.territory].filter(id=>id!==v.coreTileId).map(id=>sourceProfile21(v,w,id)).filter(s=>s.t&&s.people.length===1&&s.reserve>=18&&s.shelter&&!s.project&&now-Number(s.t.frontierLastReinforceDay||-9999)>=180).sort((a,b)=>(Number(a.t.frontierFoundedDay||0)-Number(b.t.frontierFoundedDay||0))||a.people.length-b.people.length);
 for(const target of targets){if(moved>=1)break;const donors=[...v.territory].filter(id=>id!==target.sourceId).map(id=>sourceProfile21(v,w,id)).filter(s=>s.people.length>=7&&s.available.length>=5&&s.reserve>=55&&!s.project).sort((a,b)=>w.map.distance(a.sourceId,target.sourceId)-w.map.distance(b.sourceId,target.sourceId)||b.people.length-a.people.length);if(!donors.length)continue;const donor=donors[0],person=donor.available.filter(p=>now-Number(p.lastMoveDay||-9999)>=360).sort((a,b)=>(b.health||0)-(a.health||0))[0];if(!person)continue;person.homeTileId=target.sourceId;ensurePerson21(person).workTileId=target.sourceId;person.workAssignmentUntil=now+45;person.lastMoveDay=now;target.t.frontierLastReinforceDay=now;v.migrationStats.internal=(v.migrationStats.internal||0)+1;moved++;v.frontierStats21.reinforced++;invalidateResidentIndex21(v);w.telemetry.record('FRONTIER_REINFORCEMENT',w,{village:v.name,person:person.name,fromTileId:donor.sourceId,toTileId:target.sourceId,targetPopulation:2,reason:'CRITICAL_FRONTIER'});}
 return moved;
}
/* Daily structural cache: population/capacity/storage are stable while residents act. */
const rawPopulation21=NS.Village.prototype.population,rawCapacity21=NS.Village.prototype.capacity,rawStorageCaps21=NS.Village.prototype.storageCaps;
NS.Village.prototype.population=function(){const c=this._v21DailyPerf;if(c?.active)return c.population;return rawPopulation21.call(this);};
NS.Village.prototype.capacity=function(w){const c=this._v21DailyPerf;if(c?.active&&c.day===w?.ordinalDay())return c.capacity;return rawCapacity21.call(this,w);};
NS.Village.prototype.storageCaps=function(w){const c=this._v21DailyPerf;if(c?.active&&c.day===w?.ordinalDay())return c.storageCaps;return rawStorageCaps21.call(this,w);};
/* Optimized settlement preservation: one resident count pass instead of repeated full-array scans. */
NS.Village.prototype.maintainSettlements=function(w){
 const counts=new Map();for(const p of this.residents)if(p.alive)counts.set(p.homeTileId,(counts.get(p.homeTileId)||0)+1);const settlers=this.residents.filter(p=>p.alive&&p.age>=16&&p.age<=55&&p.assignment!=='PIONEER');
 for(const id of [...this.territory]){if(id===this.coreTileId)continue;const t=w.map.get(id),here=counts.get(id)||0;if(here){t.unoccupiedDays=0;continue;}let donor=null,donorCount=1;for(const p of settlers){if(p.homeTileId===id)continue;const n=counts.get(p.homeTileId)||0;if(n>donorCount){donor=p;donorCount=n;}}if(donor){const from=donor.homeTileId;donor.homeTileId=id;counts.set(from,Math.max(0,(counts.get(from)||0)-1));counts.set(id,1);t.unoccupiedDays=0;invalidateResidentIndex21(this);w.log(`${this.name}의 ${donor.name}이(가) 빈 정착지로 이동해 거점을 유지합니다.`,false,'SETTLEMENT_REPOPULATED',{village:this.name,tileId:id,person:donor.name});}else{t.unoccupiedDays=Number(t.unoccupiedDays||0)+1;if(t.unoccupiedDays===1)w.telemetry?.record?.('SETTLEMENT_VACANCY_GRACE_B3',w,{village:this.name,tileId:id,graceCalendarDays:90});if(t.unoccupiedDays<30)continue;this.territory.delete(id);t.ownerId=null;t.buildings=[];const vacantOrdinal=t.unoccupiedDays;t.unoccupiedDays=0;const bs=NS.V030B3?.ensureNation?.(this,w);if(bs)bs.vacantGraceAbandons=Number(bs.vacantGraceAbandons||0)+1;w.log(`${this.name}은 약 90일 동안 재정착하지 못해 (${t.x},${t.y}) 거점을 포기했습니다.`,true,'OUTPOST_ABANDONED',{village:this.name,tileId:id,vacantOrdinalDays:vacantOrdinal,vacancyGraceB3:true});}}
 this.pruneDisconnectedTerritory(w);
};

const startExpansion20=NS.Village.prototype.startExpansion,daily20=NS.Village.prototype.dailyTick,seasonal20=NS.Village.prototype.seasonalTick,baseScores20=NS.VillageBrain.prototype.baseScores,maint20=NS.Village.prototype.processBuildingMaintenance;
NS.Village.prototype.startExpansion=function(w){const ok=startFrontier21(this,w,false);if(ok&&this._v20SeasonalContext)this.expansionProject={v20Proxy:true,startDay:w.ordinalDay()};return ok;};
NS.Village.prototype.dailyTick=function(w){
 ensureNation21(this);const before=(this.frontierProjects||[]).map(p=>({p:{...p,pioneerIds:[...(p.pioneerIds||[])]},wasRuin:!!w.map.get(p.targetTileId)?.ruin})),day=w.ordinalDay();this._v21DailyPerf={active:true,day,population:rawPopulation21.call(this),capacity:rawCapacity21.call(this,w),storageCaps:rawStorageCaps21.call(this,w)};try{daily20.call(this,w);}finally{this._v21DailyPerf.active=false;}
 for(const b of before){const still=(this.frontierProjects||[]).some(q=>q.id===b.p.id),t=w.map.get(b.p.targetTileId);if(!still&&t?.ownerId===this.id&&this.territory.has(t.id))reinforceCompletedFrontier21(this,w,b.p,b.wasRuin);else if(!still&&t?.ownerId!==this.id)this.frontierStats21.cancels++;}
};
NS.Village.prototype.seasonalTick=function(w){
 ensureNation21(this);const saved=this._v20FrontierCooldown;this._v20FrontierCooldown=Number.MAX_SAFE_INTEGER;try{seasonal20.call(this,w);}finally{this._v20FrontierCooldown=saved;}
 reinforceThinFrontiers21(this,w);updateFrontierMaturity21(this,w);const now=w.ordinalDay();if(now<this._v21FrontierCooldown)return;const d=frontierDiagnostics21(this,w),cap=maxFrontierProjects21(this,w),open=Math.max(0,cap-(this.frontierProjects||[]).length);if(!open||!d.eligible)return;
 const density=this.population()/Math.max(1,this.territory.size),base=NS.AIProfileCompat(this,'territorialExpansion')>.5?.62:NS.AIProfileCompat(this,'resourceSeeking')>.5?.48:NS.AIProfileCompat(this,'urbanConcentration')>.5?.18:NS.AIProfileCompat(this,'survivalPriority')>.5?.24:NS.AIProfileCompat(this,'tradeDiplomacy')>.5?.31:.38,densityFactor=clamp21(density/3.0,.62,1.30),sourceFactor=clamp21(1+(d.eligible-1)*.10,1,1.38),chance=clamp21(base*densityFactor*sourceFactor,.08,.70),attempts=Math.min(open,d.eligible>=4?2:1);
 let started=0;for(let i=0;i<attempts;i++)if(Math.random()<chance&&startFrontier21(this,w,true))started++;if(started)this._v21FrontierCooldown=now+20;
};
NS.VillageBrain.prototype.baseScores=function(v,w){const s=baseScores20.call(this,v,w);ensureNation21(v);const d=frontierDiagnostics21(v,w),can=canStartFrontier21(v,w,false),top=can?localExpansionCandidates21(v,w)[0]:null;if(!can||!top)s.EXPAND=-150;else{const density=v.population()/Math.max(1,v.territory.size),pressure=Math.max(0,density-2.4)*4+d.eligible*2.5;s.EXPAND=Math.max(s.EXPAND,15+pressure+(NS.AIProfileCompat(v,'territorialExpansion')>.5?14:NS.AIProfileCompat(v,'resourceSeeking')>.5?7:NS.AIProfileCompat(v,'urbanConcentration')>.5?-7:NS.AIProfileCompat(v,'survivalPriority')>.5?-3:NS.AIProfileCompat(v,'tradeDiplomacy')>.5?1:0));}return s;};
NS.Village.prototype.processBuildingMaintenance=function(w){const before=new Set(this.territory),start=(w.telemetry?.entries||[]).length,r=maint20.call(this,w);for(const id of before)if(!this.territory.has(id)){const recent=(w.telemetry?.entries||[]).slice(start).find(e=>e.type==='OUTPOST_RUINED'&&e.payload?.tileId===id&&e.payload?.village===this.name);if(recent){ensureNation21(this).frontierStats21.ruins++;recent.payload.frontierModel='V0.21';}}return r;};

/* ---------- V0.21 telemetry / save ---------- */
const villageSer20=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSer20.call(this);ensureNation21(this);d.frontierStats21=this.frontierStats21;d._v21FrontierCooldown=this._v21FrontierCooldown;return d;};
const worldSer20=NS.World.prototype.serialize,worldFrom20=NS.World.from;
function attachV21World(w){NS.V020.attachWorld(w);for(const v of w.villages){v._world=w;ensureNation21(v);}return w;}
NS.World.prototype.serialize=function(){const d=worldSer20.call(this);d.version='0.21';d.v21={frontierGrowth:true,matureSettlementSources:true,populationBackedExpansion:true,compactFrontierScoring:true,twoSettlerFrontiers:true,regionalPioneerPools:true,criticalOnlyReinforcement:true,frontierDiagnostics:true,revision:'frontier-balance-performance',adaptiveSnapshots:true};return d;};
NS.World.from=function(d){if(d.version==='0.21'){const w=worldFrom20({...d,version:'0.20'});for(const v of w.villages){const src=(d.villages||[]).find(x=>x.id===v.id)||{};v.frontierStats21=src.frontierStats21||{starts:0,claims:0,recaptures:0,cancels:0,ruins:0,reinforced:0,matured:0};v._v21FrontierCooldown=src._v21FrontierCooldown||0;}return attachV21World(w);}return attachV21World(worldFrom20(d));};
const snap20=NS.Telemetry.prototype.snapshot;
function autoSnapshotDue21(w){const d=w.ordinalDay(),y=w.year||1;if(y<=10)return d%5===0;if(y<=30)return d%15===0;return d%30===0;}
function compactSnapshots21(t,now){if(now-Number(t._v21LastSnapshotCompact||0)<120)return;t._v21LastSnapshotCompact=now;const recent=now-1200,mid=now-3600;t.snapshots=(t.snapshots||[]).filter(s=>{if(s.reason!=='AUTO_5_DAY')return true;const d=Number(s.ordinalDay||0);if(d>=recent)return true;if(d>=mid)return d%30===0;return d%120===0;});}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){if(reason==='AUTO_5_DAY'&&!autoSnapshotDue21(w))return null;const s=snap20.call(this,w,reason,note);if(!s)return s;for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;const d=frontierDiagnostics21(v,w),st=ensureNation21(v).frontierStats21;r.frontierProjectCap=maxFrontierProjects21(v,w);r.matureFrontierSettlements=d.mature;r.eligibleFrontierSettlements=d.eligible;r.frontierSurplusAdults=d.surplusAdults;r.frontierBlockedPopulation=d.blockedPopulation;r.frontierBlockedAdults=d.blockedAdults;r.frontierBlockedReserve=d.blockedReserve;r.frontierBlockedAge=d.blockedAge;r.frontierBlockedProject=d.blockedProject;r.frontierBlockedNoCandidate=d.blockedNoCandidate;r.frontierStarts21=st.starts;r.frontierClaims21=st.claims;r.frontierRecaptures21=st.recaptures;r.frontierCancels21=st.cancels;r.frontierRuins21=st.ruins;r.frontierReinforcedSettlers21=st.reinforced;r.avgPopulationPerTerritory=+(v.population()/Math.max(1,v.territory.size)).toFixed(3);}compactSnapshots21(this,s.ordinalDay);return s;};
const csv20=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const extra=['matureFrontierSettlements','eligibleFrontierSettlements','frontierSurplusAdults','frontierBlockedPopulation','frontierBlockedAdults','frontierBlockedReserve','frontierBlockedAge','frontierBlockedProject','frontierBlockedNoCandidate','frontierStarts21','frontierClaims21','frontierRecaptures21','frontierCancels21','frontierRuins21','frontierReinforcedSettlers21','avgPopulationPerTerritory'],base=csv20.call(this),lines=base.split('\n');if(!lines.length)return base;const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k])).join(',');}return lines.join('\n');};
const json20=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json20.call(this,w);d.version='0.21';d.worldSummary.frontierModel='mature populated settlements launch population-backed local frontier projects; compact/infill expansion is favored';d.worldSummary.frontierSettlementModel='new land frontiers retain two or three real pioneers; nearby mature settlements may pool surplus adults; frontier settlements must mature before becoming expansion sources';d.worldSummary.frontierDiagnostics='snapshot fields expose mature/eligible sources, surplus adults, blockers, starts/claims/recaptures and population density';d.worldSummary.frontierBalance='regional surplus-adult pioneer pools + disposition-specific retention; critical-only reinforcement with long mover cooldown';d.worldSummary.performance='daily structural population/capacity/storage cache; duplicate maintenance removed; settlement preservation uses one-pass resident counts';d.worldSummary.devlogPolicy='AUTO snapshots: 5d through year 10, 15d through year 30, 30d thereafter; old snapshots compact to monthly/annual tiers';d.worldSummary.snapshotCount=(this.snapshots||[]).length;return d;};
NS.V021={attachWorld:attachV21World,ensureNation:ensureNation21,sourceProfile:sourceProfile21,frontierDiagnostics:frontierDiagnostics21,maxFrontierProjects:maxFrontierProjects21,startFrontier:startFrontier21,candidates:localExpansionCandidates21,frontierRules:frontierRules21,revision:'frontier-balance-performance'};

(function(){const KEY='village-observer-v0-21',fallback=['village-observer-v0-20','village-observer-v0-19','village-observer-v0-18','village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v021-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v021-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v021-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attachV21World(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();

if(NS.UI){const setWorld20=NS.UI.prototype.setWorld,header20=NS.UI.prototype.renderHeader,content20=NS.UI.prototype.renderVillageContent;NS.UI.prototype.setWorld=function(w){return setWorld20.call(this,attachV21World(w));};NS.UI.prototype.renderHeader=function(){header20.call(this);this.q('runtimeStatus').textContent='✓ V0.21 Frontier Growth · 확장 밸런스 보강 · 성능/Devlog 최적화';document.title='Village Observer V0.21';const eye=document.querySelector('.eyebrow');if(eye)eye.textContent='Village Observer · V0.21';};NS.UI.prototype.renderVillageContent=function(){content20.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el||this.sub!=='overview')return;const d=frontierDiagnostics21(v,this.world),card=el.querySelector('.v20-frontier');if(card){const big=card.querySelector('.big'),small=card.querySelector('.small');if(big)big.textContent=`${v.frontierProjects.length}/${maxFrontierProjects21(v,this.world)}`;if(small)small.textContent=`성숙 ${d.mature} · 출발가능 ${d.eligible} · 잉여성인 ${d.surplusAdults}`;}if(!el.querySelector('.v21-frontier-health')){const grid=el.querySelector('.grid');if(grid)grid.insertAdjacentHTML('beforeend',`<div class="info v21-frontier-health">🌱 개척 기반<div class="big">${d.mature}/${d.eligible}</div><div class="small muted">성숙 정착지 / 지금 출발 가능</div></div>`);}};}
})(window.VSim);

