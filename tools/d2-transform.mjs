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
export function d2Transform(src,data){let out=data,used=0;for(const [before,after] of [...(hooks[src]||[]),...(d3hooks[src]||[])]){if(before===after)continue;const first=out.indexOf(before);if(first<0||out.indexOf(before,first+before.length)>=0)throw Error('D2 integration anchor must be unique: '+src+' '+before.slice(0,80));out=out.slice(0,first)+after+out.slice(first+before.length);used++;}return {data:out,used};}
export function d2TransformList(){return Object.keys(hooks);}
