/* Precise, audited runtime integration points. The C1H legacy sources remain byte-identical.
 * Baseline builds do not use these transforms; hosted and standalone both do.
 */
const hooks = {
 'src/legacy/019.js': [
  ["function maxProjects(v){let n=1;if(v.population()>=25)n++;if(v.population()>=60)n++;if(v.hasTech('ADMINISTRATION'))n++;return Math.min(5,n);}", "function maxProjects(v){return NS.V034D2?.projectCap?.(v)??(1+(v.population()>=25)+(v.population()>=60)+(v.hasTech('ADMINISTRATION')?1:0));}"],
  ["function happinessTarget(p,v,w){", "function happinessTarget(p,v,w){"],
  ["const t=w.map.get(p.homeTileId),pop=t?v.tileResidents(t.id).filter(x=>x.alive).length:0,cap=t?effectiveLocalCapacity(t):0,housing=pop?", "const t=w.map.get(p.homeTileId),shared=NS.V034D2?.housingAt?.(v,w,p.homeTileId),pop=shared?shared.population:(t?v.tileResidents(t.id).filter(x=>x.alive).length:0),cap=shared?shared.capacity:(t?effectiveLocalCapacity(t):0),housing=pop?"],
  ["const pop=this.tileResidents(t.id).filter(x=>x.alive).length,cap=effectiveLocalCapacity(t);s+=(cap-pop)*3;", "const shared=NS.V034D2?.housingAt?.(this,w,t.id),pop=shared?shared.population:this.tileResidents(t.id).filter(x=>x.alive).length,cap=shared?shared.capacity:effectiveLocalCapacity(t);s+=(cap-pop)*3;"]
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
 'src/legacy/032.js': [["occ=v.tileResidents(home).filter(p=>p.alive).length/localCapacity22(v,w,home)","occ=(NS.V034D2?.housingAt?.(v,w,home)?.occupancy??(v.tileResidents(home).filter(p=>p.alive).length/localCapacity22(v,w,home)))"]],
 'src/legacy/039.js': [
  ["housingShortage:Math.max(0,pop-cap)});","housingShortage:Math.max(0,(NS.V034D2?.housingAt?.(v,w,id)?.shortage??(pop-cap)))});"],
  ["const isHome=Number(p.homeTileId)===Number(t.id);if(!isHome&&r.cap-r.pop<.75)return-Infinity;", "const shared=NS.V034D2?.housingAt?.(v,w,t.id),isHome=Number(p.homeTileId)===Number(t.id);if(!isHome&&(shared?shared.capacity-shared.population:r.cap-r.pop)<.75)return-Infinity;"],
  ["for(const r of rows){if(r.id===src.id||r.cap-r.pop<.75)continue;", "for(const r of rows){if(r.id===src.id||NS.V034D2?.sameSettlement?.(w,src.id,r.id,this.id)||r.cap-r.pop<.75)continue;"],
 ],
 'src/legacy/126.js': [["return Math.min(5,n);}","return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}"]],
 'src/legacy/128.js': [["return Math.min(5,n);}","return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}"]],
 'src/legacy/130.js': [["function projectCap(v){return Number(NS.V031G?.maxProjects?.(v)||Math.min(5,1+(v.population?.()>=25)+(v.population?.()>=60)+(v.hasTech?.('ADMINISTRATION')?1:0)));}", "function projectCap(v){return Number(NS.V034D2?.projectCap?.(v)??NS.V031G?.maxProjects?.(v)??1);}"]],
 'src/legacy/131.js': [["return Math.min(5,n);}","return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}"]]
};
export function d2Transform(src,data){let out=data,used=0;for(const [before,after] of hooks[src]||[]){if(before===after)continue;const first=out.indexOf(before);if(first<0||out.indexOf(before,first+before.length)>=0)throw Error('D2 integration anchor must be unique: '+src+' '+before.slice(0,80));out=out.slice(0,first)+after+out.slice(first+before.length);used++;}return {data:out,used};}
export function d2TransformList(){return Object.keys(hooks);}
