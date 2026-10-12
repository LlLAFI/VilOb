/* Precise, audited runtime integration points. The C1H legacy sources remain byte-identical.
 * Baseline builds do not use these transforms; hosted and standalone both do.
 */
const hooks = {
 'src/legacy/019.js': [
  ["function maxProjects(v){let n=1;if(v.population()>=25)n++;if(v.population()>=60)n++;if(v.hasTech('ADMINISTRATION'))n++;return Math.min(5,n);}", "function maxProjects(v){return NS.V034D2?.projectCap?.(v)??(1+(v.population()>=25)+(v.population()>=60)+(v.hasTech('ADMINISTRATION')?1:0));}"],
  ["function happinessTarget(p,v,w){", "function happinessTarget(p,v,w){"],
  ["const t=w.map.get(p.homeTileId),pop=t?v.tileResidents(t.id).filter(x=>x.alive).length:0,cap=t?effectiveLocalCapacity(t):0,housing=pop?", "const t=w.map.get(p.homeTileId),shared=NS.V034D2?.housingAt?.(v,w,p.homeTileId),pop=shared?shared.population:(t?v.tileResidents(t.id).filter(x=>x.alive).length:0),cap=shared?shared.capacity:(t?effectiveLocalCapacity(t):0),housing=pop?"],
  ["const pop=this.tileResidents(t.id).filter(x=>x.alive).length,cap=effectiveLocalCapacity(t);s+=(cap-pop)*3;", "const shared=NS.V034D2?.housingAt?.(this,w,t.id),pop=shared?shared.population:this.tileResidents(t.id).filter(x=>x.alive).length,cap=shared?shared.capacity:effectiveLocalCapacity(t);s+=(cap-pop)*3;"],
  ["if(!t||t.ownerId!==this.id||physical(t,type)||pendingAt(this,tileId,type)||pendingAt(this,tileId)||projects.length>=maxProjects(this))return false;const cost=constructionCost(this,type);if(!cost||!reserveAllows(this,cost,type)||!this.payBuild(tileId,cost))return false;",
   "if(!t){NS.V034D2B?.markGate?.(this,w,tileId,'NO_TILE');return false;}if(t.ownerId!==this.id){NS.V034D2B?.markGate?.(this,w,tileId,'FOREIGN_TILE');return false;}if(physical(t,type)){NS.V034D2B?.markGate?.(this,w,tileId,'ALREADY_BUILT');return false;}if(pendingAt(this,tileId,type)||pendingAt(this,tileId)){NS.V034D2B?.markGate?.(this,w,tileId,'SITE_PROJECT_PENDING');return false;}if(projects.length>=maxProjects(this)){NS.V034D2B?.markGate?.(this,w,tileId,'PROJECT_CAP');return false;}const cost=constructionCost(this,type);if(!cost){NS.V034D2B?.markGate?.(this,w,tileId,'NO_COST_DEFINITION');return false;}if(!reserveAllows(this,cost,type)){NS.V034D2B?.markGate?.(this,w,tileId,'STRATEGIC_RESERVE');return false;}if(!this.payBuild(tileId,cost)){NS.V034D2B?.markGate?.(this,w,tileId,'PAYMENT_OR_MATERIAL');return false;}"]
 ],
 'src/legacy/024.js': [["function projectLimit(v){let n=1;if(v.population()>=25)n++;if(v.population()>=60)n++;if(v.hasTech('ADMINISTRATION'))n++;return Math.min(5,n);}","function projectLimit(v){return NS.V034D2?.projectCap?.(v)??(1+(v.population()>=25)+(v.population()>=60)+(v.hasTech('ADMINISTRATION')?1:0));}"]],
 'src/legacy/050.js': [["function maxProjects31G(v){let n=1;if(v.population?.()>=25)n++;if(v.population?.()>=60)n++;if(v.hasTech?.('ADMINISTRATION'))n++;return Math.min(5,n);}", "function maxProjects31G(v){return NS.V034D2?.projectCap?.(v)??(1+(v.population?.()>=25)+(v.population?.()>=60)+(v.hasTech?.('ADMINISTRATION')?1:0));}"]],
 'src/legacy/065.js': [
  ["function housingRowsD3(v,w){", "function housingRowsD3(v,w){if(NS.V034D2?.housingRows)return NS.V034D2.housingRows(v,w);"],
  ["function tryHousingResolveD3(v,w,sourceId,reason='HOUSING32D3'){", "function tryHousingResolveD3(v,w,sourceId,reason='HOUSING32D3'){if(NS.V034D2?.resolveHousing)return NS.V034D2.resolveHousing(v,w,sourceId,reason);"],
 ],
 'src/legacy/069.js': [
  ["function quickHousingE1(v,w){", "function quickHousingE1(v,w){if(NS.V034D2?.quickHousing)return NS.V034D2.quickHousing(v,w);"],
  ["function blockerFromQuickE1(v,w,q){", "function blockerFromQuickE1(v,w,q){if(NS.V034D2?.housingBlocker)return NS.V034D2.housingBlocker(v,w,q);"],
 ],
 'src/legacy/040.js': [
  ["function routeCost29(v,w,a,b){", "function routeCost29(v,w,a,b){if(NS.V034D2?.sameSettlement?.(w,a,b,v.id))return 0;"],
 ],
 'src/legacy/077.js': [["function startCommercial(v,w,x){","function startCommercial(v,w,x){if(NS.V034D2&&NS.V034D2.freeSlots(v)<=0)return false;"]],
 'src/legacy/076.js': [["function startSpec(v,w,x){","function startSpec(v,w,x){if(NS.V034D2&&NS.V034D2.freeSlots(v)<=0)return false;"]],
 'src/legacy/126.js': [["return Math.min(5,n);}","return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}"]],
 'src/legacy/128.js': [["return Math.min(5,n);}","return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}"]],
 'src/legacy/130.js': [["function projectCap(v){return Number(NS.V031G?.maxProjects?.(v)||Math.min(5,1+(v.population?.()>=25)+(v.population?.()>=60)+(v.hasTech?.('ADMINISTRATION')?1:0)));}", "function projectCap(v){return Number(NS.V034D2?.projectCap?.(v)??NS.V031G?.maxProjects?.(v)??1);}"]],
 'src/legacy/131.js': [["return Math.min(5,n);}","return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}"]],
 'src/legacy/018.js': [["const pop=v.tileResidents(t.id).filter(p=>p.alive).length,cap=activeLocalCapacity(t),short=Math.max(0,pop-cap),severity=pop?short/pop:0;","const shared=NS.V034D2A?.housingAt?.(v,w,t.id),pop=shared?shared.population:v.tileResidents(t.id).filter(p=>p.alive).length,cap=shared?shared.activeCapacity:activeLocalCapacity(t),short=Math.max(0,pop-cap),severity=pop?short/pop:0;"],
  ["if(!t)return-Infinity;const pop=this.tileResidents(t.id).filter(x=>x.alive).length,cap=activeLocalCapacity(t);","if(!t)return-Infinity;const shared=NS.V034D2A?.housingAt?.(this,w,t.id),pop=shared?shared.population:this.tileResidents(t.id).filter(x=>x.alive).length,cap=shared?shared.activeCapacity:activeLocalCapacity(t);"]],
 'src/legacy/032.js': [["occ=v.tileResidents(home).filter(p=>p.alive).length/localCapacity22(v,w,home)","occ=(NS.V034D2A?.housingAt?.(v,w,home)?.occupancy??(v.tileResidents(home).filter(p=>p.alive).length/localCapacity22(v,w,home)))"],
  ["const home=p.homeTileId??v.coreTileId,localDays=Math.max(0,v.settlementReserveDays(home)),localPop=v.tileResidents(home).filter(x=>x.alive).length,cap=localCapacity22(v,w,home),occ=localPop/cap;","const home=p.homeTileId??v.coreTileId,localDays=Math.max(0,v.settlementReserveDays(home)),shared=NS.V034D2A?.housingAt?.(v,w,home),localPop=shared?shared.population:v.tileResidents(home).filter(x=>x.alive).length,cap=shared?Math.max(1,shared.capacity):localCapacity22(v,w,home),occ=localPop/cap;"],
  ["if(v.capacity(w)<v.population()*1.02)chance*=.80;","const commonHousing=NS.V034D2A?.housingAt?.(v,w,home);if((commonHousing?commonHousing.capacity:v.capacity(w))<(commonHousing?commonHousing.population:v.population())*1.02)chance*=.80;"]],
 'src/legacy/034.js': [
  ["const home=p.homeTileId??v.coreTileId,localPop=counts.get(home)||1,cap=caps.get(home)||1,occ=localPop/cap;", "const home=p.homeTileId??v.coreTileId,sharedHousing=NS.V034D2A?.housingAt?.(v,w,home),localPop=sharedHousing?sharedHousing.population:(counts.get(home)||1),cap=sharedHousing?Math.max(1,sharedHousing.capacity):(caps.get(home)||1),occ=localPop/cap;"],
  ["localDays=counts.has(home)?reserveAt(home):v.settlementReserveDays(home),occ=localPop/Math.max(1,localCap);", "localDays=counts.has(home)?reserveAt(home):v.settlementReserveDays(home),birthSharedHousing=NS.V034D2A?.housingAt?.(v,w,home),occ=birthSharedHousing?birthSharedHousing.occupancy:localPop/Math.max(1,localCap);"],
  ["if(nationalCap<nationalPop*1.02)annual*=.80;", "if((birthSharedHousing?birthSharedHousing.capacity:nationalCap)<(birthSharedHousing?birthSharedHousing.population:nationalPop)*1.02)annual*=.80;"],
  ["const localDays=v.settlementReserveDays(home),occ=v.tileResidents(home).filter(p=>p.alive).length/localCapacity24(v,w,home),national=v.foodReserveDays();", "const localDays=v.settlementReserveDays(home),sharedHousing=NS.V034D2A?.housingAt?.(v,w,home),occ=sharedHousing?sharedHousing.occupancy:v.tileResidents(home).filter(p=>p.alive).length/localCapacity24(v,w,home),national=v.foodReserveDays();"]
 ],
 'src/legacy/039.js': [
  ["function housingPulse28(v,w){","function housingPulse28(v,w){if(NS.V034D2A?.housingPulse)return NS.V034D2A.housingPulse(v,w);"],
  ["housingStrained=(v.residents||[]).filter(p=>p.alive&&((p.housingStrainDays||0)>20||((rows.find(r=>r.id===p.homeTileId)?.housingShortage||0)>0))).length","housingStrained=(v.residents||[]).filter(p=>p.alive&&(NS.V034D2B?.currentHousingStrain?.(v,w,p)??((p.housingStrainDays||0)>20||((rows.find(r=>r.id===p.homeTileId)?.housingShortage||0)>0)))).length"],
  ["for(const r of rows){if(r.id===src.id||r.cap-r.pop<.75)continue;","for(const r of rows){if(r.id===src.id)continue;if(NS.V034D2?.sameSettlement?.(w,src.id,r.id,this.id)){NS.V034D2B?.countInternalCandidate?.(w);continue;}if(r.cap-r.pop<.75)continue;"],
 ],
 'src/legacy/025.js': [
  ["if(need>remainingSpace(this,t)+1e-6){w.telemetry.record('BUILDING_BLOCKED_SPACE'","if(need>remainingSpace(this,t)+1e-6){NS.V034D2B?.markGate?.(this,w,tileId,'NO_BUILD_SPACE');w.telemetry.record('BUILDING_BLOCKED_SPACE'"]
 ],
 'src/legacy/038.js': [
  ["const t=w.map.get(p.homeTileId),people=ctx.byHome.get(p.homeTileId)||[],pop=people.length;let cap=ctx.effectiveCaps.get(p.homeTileId);if(cap==null){cap=effectiveLocalCapacity27(t);ctx.effectiveCaps.set(p.homeTileId,cap);}const housing=pop?","const t=w.map.get(p.homeTileId),shared=NS.V034D2A?.housingAt?.(v,w,p.homeTileId),people=ctx.byHome.get(p.homeTileId)||[],pop=shared?shared.population:people.length;let cap=shared?shared.capacity:ctx.effectiveCaps.get(p.homeTileId);if(cap==null){cap=effectiveLocalCapacity27(t);ctx.effectiveCaps.set(p.homeTileId,cap);}const housing=pop?"],
  ["const home=w.map.get(this.homeTileId),ctx=sharedVillage27(v,w),people=ctx.byHome.get(this.homeTileId)||[];let activeCap=ctx.activeCaps.get(this.homeTileId);if(activeCap==null){activeCap=housingActiveCapacity27(home);ctx.activeCaps.set(this.homeTileId,activeCap);}const short=Math.max(0,people.length-activeCap),severity=people.length?short/people.length:0;","const home=w.map.get(this.homeTileId),ctx=sharedVillage27(v,w),shared=NS.V034D2A?.housingAt?.(v,w,this.homeTileId),people=ctx.byHome.get(this.homeTileId)||[],population=shared?shared.population:people.length;let activeCap=shared?shared.activeCapacity:ctx.activeCaps.get(this.homeTileId);if(activeCap==null){activeCap=housingActiveCapacity27(home);ctx.activeCaps.set(this.homeTileId,activeCap);}const short=Math.max(0,population-activeCap),severity=population?short/population:0;"],
 ],
};
const d3hooks={
 'src/legacy/040.js':[
  ["function routeCost29(v,w,a,b){","function routeCost29(v,w,a,b){if(NS.V034D3?.sameSettlement?.(w,a,b,v.id))return 0;"],
  ["const cache={sig,rows,bucket,alive,adults,residentsBy,adultsBy,workersByTile:workers,jobsByTile};","NS.V034D3?.harmonizeMarketRows?.(v,w,rows);const cache={sig,rows,bucket,alive,adults,residentsBy,adultsBy,workersByTile:workers,jobsByTile};"],
  ["if(s.id===b.id)continue;const se=ensureTile29(s.t)","if(s.id===b.id||NS.V034D3?.sameSettlement?.(w,b.id,s.id,v.id)){if(s.id!==b.id)NS.V034D3?.noteIgnoredTradePair?.(w);continue;}const se=ensureTile29(s.t)"],
  ["let paid=Math.min(due,Number(e.marketGold||0));","NS.V034D3?.fundMarketGold?.(v,w,row.id,Math.max(0,due-Number(e.marketGold||0)));let paid=Math.min(due,Number(e.marketGold||0));"],
  ["if(cash+1e-9<cost)return 0;const took=v.withdrawAt(s.id,resource,qty)","cash+=NS.V034D3?.fundMarketGold?.(v,w,b.id,cost-cash)||0;if(cash+1e-9<cost)return 0;const took=v.withdrawAt(s.id,resource,qty)"]
 ],
 'src/legacy/068.js':[["const fund=fundMarketD5(buyer,w,bt.id,total,a.urgency,k);","NS.V034D3?.fundMarketGold?.(buyer,w,bt.id,total-Number(be.marketGold||0));const fund=fundMarketD5(buyer,w,bt.id,total,a.urgency,k);"]]
};
const d3aHooks={
 'src/legacy/010.js':[
  ["got=t.harvest('food',.9+this.skills.farming/70,day)*v.harvestMultiplier('food',t);v.depositAt(t.id,'food',got);", "got=NS.V034D3A.harvestAndStore(this,v,w,t,'food',.9+this.skills.farming/70,day);"],
  ["got=t.harvest('food',.5+this.skills.hunting/100,day)*v.harvestMultiplier('food',t);v.depositAt(t.id,'food',got);", "got=NS.V034D3A.harvestAndStore(this,v,w,t,'food',.5+this.skills.hunting/100,day);"],
  ["got=t.harvest('wood',.55+this.skills.building/78,day)*v.harvestMultiplier('wood',t);v.depositAt(t.id,'wood',got);", "got=NS.V034D3A.harvestAndStore(this,v,w,t,'wood',.55+this.skills.building/78,day);"],
  ["got=t.harvest('stone',.42+this.skills.mining/85,day)*v.harvestMultiplier('stone',t);v.depositAt(t.id,'stone',got);", "got=NS.V034D3A.harvestAndStore(this,v,w,t,'stone',.42+this.skills.mining/85,day);"],
 ],
 'src/legacy/040.js':[["const took=v.withdrawAt(s.id,resource,qty),put=v.depositAt(b.id,resource,took);if(put<=0){if(took>0)v.depositAt(s.id,resource,took);return 0;}if(put<took)v.depositAt(s.id,resource,took-put);", "const {took,put}=NS.V034D3A.transferWithReturn(v,s.id,b.id,resource,qty);if(put<=0)return 0;"]],
 'src/legacy/015.js':[["v.withdrawAt(d.id,'food',qty);const put=v.depositAt(rid,'food',qty);if(put<qty)v.depositAt(d.id,'food',qty-put);", "const {put}=NS.V034D3A.transferWithReturn(v,d.id,rid,'food',qty);"]],
 'src/legacy/021.js':[["const took=v.withdrawAt(q.id,'food',qty),put=v.depositAt(rid,'food',took);if(put<took)v.depositAt(q.id,'food',took-put);", "const {took,put}=NS.V034D3A.transferWithReturn(v,q.id,rid,'food',qty);"]],
 'src/legacy/068.js':[["const took=v.withdrawAt(best.d.id,'food',qty),put=v.depositAt(r.id,'food',took);if(put<took)v.depositAt(best.d.id,'food',took-put);", "const {took,put}=NS.V034D3A.transferWithReturn(v,best.d.id,r.id,'food',qty);"]],
 'src/legacy/069.js':[["const took=v.withdrawAt(best.d.id,'food',qty),put=v.depositAt(r.id,'food',took);if(put<took)v.depositAt(best.d.id,'food',took-put);", "const {took,put}=NS.V034D3A.transferWithReturn(v,best.d.id,r.id,'food',qty);"]]
};
const d3a1Hooks={
 'src/legacy/021.js':[["t.stocks.food-=loss;total+=loss;", "t.stocks.food-=loss;total+=loss;NS.V034D3A1?.spoilage?.(w,v,id,loss);"]],
 'src/legacy/029.js':[["v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;", "const _foodBeforeD3A1=NS.V034D3A1?.frontierBefore?.(v,w);v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;NS.V034D3A1?.frontierAfter?.(v,w,_foodBeforeD3A1);"]],
 'src/legacy/031.js':[["v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;", "const _foodBeforeD3A1=NS.V034D3A1?.frontierBefore?.(v,w);v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;NS.V034D3A1?.frontierAfter?.(v,w,_foodBeforeD3A1);"]],
 'src/legacy/099.js':[["v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;", "const _foodBeforeD3A1=NS.V034D3A1?.frontierBefore?.(v,w);v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;NS.V034D3A1?.frontierAfter?.(v,w,_foodBeforeD3A1);"]]
};
const d3a2Hooks={
 'src/legacy/029.js':[
  ["v.food=Math.max(0,v.food-.032*pioneers.length);", "const _d3a2UpkeepBefore=NS.V034D3A2?.frontierBefore?.(v,w,p.sourceTileId);v.food=Math.max(0,v.food-.032*pioneers.length);NS.V034D3A2?.frontierAfter?.(v,w,_d3a2UpkeepBefore,'upkeep',.032*pioneers.length,p.id);"],
  ["else if(r<.14){v.food=Math.max(0,v.food-4);v.wood=Math.max(0,v.wood-2);", "else if(r<.14){const _d3a2AccidentBefore=NS.V034D3A2?.frontierBefore?.(v,w,p.sourceTileId);v.food=Math.max(0,v.food-4);NS.V034D3A2?.frontierAfter?.(v,w,_d3a2AccidentBefore,'accident',4,p.id);v.wood=Math.max(0,v.wood-2);"]
 ]
};
// D3B: late-bound policy hooks; C1H original source remains byte-identical.
const d3bHooks={
 'src/legacy/029.js':[
  ["v.foodReserveDays()<minFood||v.wood<16||v.stone<4", "v.foodReserveDays()<minFood||v.wood<14||v.stone<4"],
  ["const pioneers=adults.slice(0,2),cost={wood:16,stone:4,food:10,", "const pioneers=adults.slice(0,2),cost={wood:14,stone:4,food:10,"],
 ],
 'src/legacy/031.js':[
  ["v.foodReserveDays()<(autonomous?38:22)||v.wood<16||v.stone<4", "v.foodReserveDays()<(autonomous?38:22)||v.wood<14||v.stone<4"],
  ["cost={wood:16+extra*2,stone:4,food:10+extra*3,", "cost={wood:14+extra*2,stone:4,food:10+extra*3,"],
 ],
 'src/legacy/023.js':[
  ["const s=ensureRecovery(v),p=recoveryProfile(v,w),should=p.severe||p.flags>=2;",
   "const s=ensureRecovery(v),p=recoveryProfile(v,w),should=NS.V034D3B?.recoveryShouldEnter?.(v,w,p)??(p.severe||p.flags>=2);"],
  ["const stable=p.inactiveShare<.20&&p.food>42&&p.wood>Math.max(16,p.pop*.4)&&p.cap>=p.pop*.85;",
   "const stable=NS.V034D3B?.recoveryStable?.(v,w,p)??(p.inactiveShare<.20&&p.food>42&&p.wood>Math.max(16,p.pop*.4)&&p.cap>=p.pop*.85);"],
 ],
 'src/legacy/043.js':[
  ["const hard=p.pop<=10||p.starv>=2||(p.pop<=16&&p.hunger>=32)||localHard,enter=hard||p.risk>=2.5;",
   "const hard=p.pop<=10||p.starv>=2||(p.pop<=16&&p.hunger>=32)||localHard,enter=NS.V034D3B?.survivalEmergency?.(v,w,p)??(hard||p.risk>=2.5);"],
  ["const stable=p.risk<1.5&&p.food>=35&&p.hunger<25&&p.health>=72&&p.pop>=15&&p.starv===0&&p.blocked<3&&localStable;",
   "const legacyStable=p.risk<1.5&&p.food>=35&&p.hunger<25&&p.health>=72&&p.pop>=15&&p.starv===0&&p.blocked<3&&localStable,stable=NS.V034D3B?.survivalStable?.(v,w,p,legacyStable)??legacyStable;"],
 ]
};

// D3B1: spatial consolidation tuning in the protected C source. Only compiled
// artifacts are transformed; the C1H legacy source hashes never change.
const d3b1Hooks={
 'src/legacy/154.js':[
  ["const EPS=1e-8,JOIN=1.00,SPLIT=1.15,JOIN_WAIT=90,SPLIT_WAIT=180,REVIEW=90,MAX_TILES=5;",
   "const EPS=1e-8,JOIN=1.24,SPLIT=1.40,JOIN_WAIT=90,SPLIT_WAIT=180,REVIEW=90,MAX_TILES=13;"],
  ["function canJoin(w,a,b){if(!same(a.nationId,b.nationId)||a.tileIds.length+b.tileIds.length>MAX_TILES)return null;",
   "function withinCoreRadiusD3B1(w,ids,core){const c=tile(w,core);return !!c&&ids.every(id=>{const t=tile(w,id);return !!t&&Math.abs(t.x-c.x)+Math.abs(t.y-c.y)<=2;});}\nfunction canJoin(w,a,b){if(!same(a.nationId,b.nationId)||a.tileIds.length+b.tileIds.length>MAX_TILES)return null;"],
  ["const ac=bothReachable(w,aa,a.coreTileId,JOIN),bc=bothReachable(w,aa,b.coreTileId,JOIN);",
   "const ac=withinCoreRadiusD3B1(w,aa,a.coreTileId)&&bothReachable(w,aa,a.coreTileId,JOIN),bc=withinCoreRadiusD3B1(w,aa,b.coreTileId)&&bothReachable(w,aa,b.coreTileId,JOIN);"],
  ["if(bothReachable(w,r.tileIds,r.coreTileId,SPLIT)){delete pendingSplit[r.id];continue;}",
   "if(withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId)&&bothReachable(w,r.tileIds,r.coreTileId,SPLIT)){delete pendingSplit[r.id];continue;}"],
  ["if(r.tileIds.length>MAX_TILES)errors.push({code:'CAP_EXCEEDED',id});",
   "if(r.tileIds.length>MAX_TILES)errors.push({code:'CAP_EXCEEDED',id});if(!withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId))errors.push({code:'RADIUS_EXCEEDED',id});"]
 ]
};
// D3B2: measure the *actual* V24 regional frontier food deduction at the
// physical stock boundary, not an estimated cost or the later upkeep path.
const d3b2Hooks={
 'src/legacy/034.js':[[
  'v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;',
  'const _v034d3b2FoodBefore=NS.V034D3B2?.frontierBefore?.(v,w,c.sourceId);v.wood-=cost.wood;v.stone-=cost.stone;v.food-=cost.food;NS.V034D3B2?.frontierAfter?.(v,w,_v034d3b2FoodBefore,cost.food,projectId);'
 ]]
};
export function d2Transform(src,data){let out=data,used=0;for(const [before,after] of [...(hooks[src]||[]),...(d3hooks[src]||[]),...(d3aHooks[src]||[]),...(d3a1Hooks[src]||[]),...(d3a2Hooks[src]||[]),...(d3bHooks[src]||[]),...(d3b1Hooks[src]||[]),...(d3b2Hooks[src]||[])]){if(before===after)continue;const first=out.indexOf(before);if(first<0||out.indexOf(before,first+before.length)>=0)throw Error('D2 integration anchor must be unique: '+src+' '+before.slice(0,80));out=out.slice(0,first)+after+out.slice(first+before.length);used++;}return {data:out,used};}
export function d2TransformList(){return Object.keys(hooks);}
