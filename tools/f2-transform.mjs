// F2 migration of *two* legacy starvation entry points. Source manifest stays immutable.
// This is not a new model path: F2's single daily population pulse owns starvation.
export function f2Transform(path, source){
  if(path==='src/legacy/034.js'){
    const a='function dailyDemography24(w){';
    if(!source.includes(a))throw Error('F2 demographic pulse anchor unavailable');
    source=source.replace(a,a+'\n if(NS.V034F2?.enabled)NS.V034F2.dailyStarvation(w);');
    const b='const reserveAt=id=>{const n=Math.max(1,counts.get(id)||0);return Math.max(0,Number(v.stockAt?.(id,\'food\')||0)/(n*.36));};';
    if(!source.includes(b))throw Error('F2 birth local reserve anchor unavailable');
    source=source.replace(b,'const reserveAt=id=>NS.V034F2?.enabled?v.settlementReserveDays(id):Math.max(0,Number(v.stockAt?.(id,\'food\')||0)/(Math.max(1,counts.get(id)||0)*.36));');
  }
  if(path==='src/legacy/036.js'){
    const a='function starvation25(p,v,w){if(!p.alive)return false;';
    if(!source.includes(a))throw Error('F2 starvation25 anchor unavailable');
    source=source.replace(a,a+'if(NS.V034F2?.enabled)return false;');
  }
  if(path==='src/legacy/045.js'){
    const a="NS.Person.prototype.act=function(v,w){if(this.alive&&Number(this.hunger||0)>=100){";
    if(!source.includes(a))throw Error('F2 old starvation sentinel anchor unavailable');
    source=source.replace(a,"NS.Person.prototype.act=function(v,w){if(!NS.V034F2?.enabled&&this.alive&&Number(this.hunger||0)>=100){");
  }
  return source;
}
