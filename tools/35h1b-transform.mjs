/* H1B: replace two post-action civilian census allocations with one ordered pass.
 * Called only on the protected legacy Village.dailyTick source during builds.
 * Keep the original predicates, world ordinal lookup and arithmetic exact.
 */
export function h1bTransform(path,src){
 if(path!=='src/legacy/008.js')return src;
 const needle="const working=this.residents.filter(p=>p.alive&&p.age>=16&&p.assignment!=='PIONEER'&&(w.ordinalDay()-(p.lastMoveDay||-9999)>180)).length,merchants=this.residents.filter(p=>p.alive&&p.job==='상인'&&p.assignment!=='PIONEER').length;";
 if(!src.includes(needle))throw Error('H1B daily civilian census source anchor missing');
 return src.replace(needle,"let working=0,merchants=0;for(const p of this.residents){if(p.alive&&p.age>=16&&p.assignment!=='PIONEER'&&(w.ordinalDay()-(p.lastMoveDay||-9999)>180))working++;if(p.alive&&p.job==='상인'&&p.assignment!=='PIONEER')merchants++;}");
}
