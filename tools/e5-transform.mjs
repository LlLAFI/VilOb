/* V0.34E-rc5 safe, scope-local computation reuse.
 * Every optimization is inside a single synchronous job decision. No state
 * caching crosses workers, days, construction, or snapshots. No RNG moved.
 */
export function e5Transform(file, source) {
 if(file==='src/legacy/034.js'){
  const before='NS.World.prototype.advanceOneDay=function(){ensureWorld24(this);dailyDemography24(this);if(this._v24Subday<2){this._v24Subday++;if(this.selectedPersonId&&!this.selectedPerson)this.selectedPersonId=this.selectedVillage?.residents[0]?.id||null;return;}this._v24MacroStart={year:this.year,season:this.season,day:this.day};try{advance23.call(this);}finally{this._v24Subday=0;this._v24MacroStart=null;}};';
  const after=`NS.World.prototype.advanceOneDay=function(){ensureWorld24(this);const trace=NS.V034E?.profiling?.traceSegmentActive;if(trace)trace('calendar.demography',()=>dailyDemography24(this));else dailyDemography24(this);if(this._v24Subday<2){this._v24Subday++;if(this.selectedPersonId&&!this.selectedPerson)this.selectedPersonId=this.selectedVillage?.residents[0]?.id||null;return;}this._v24MacroStart={year:this.year,season:this.season,day:this.day};try{if(trace)trace('macro.legacyCore',()=>advance23.call(this));else advance23.call(this);}finally{this._v24Subday=0;this._v24MacroStart=null;}};`;
  if(!source.includes(before))throw Error('RC5 calendar stage transform anchor missing');
  return source.replace(before,after);
 }
 if(file!=='src/legacy/040.js')return source;
 const replace=(oldText,newText,tag)=>{if(!source.includes(oldText))throw Error('RC5 labor transform anchor missing: '+tag);source=source.replace(oldText,newText);};
 // Best-open construction candidate scan: the set is constant throughout one
 // synchronous job decision. A linear .some() per tile is unnecessary.
 replace("function bestOpenTile29(v,w,p,index,job){const home=Number(p.homeTileId),rows=[...index.cache.rows.values()];", "function bestOpenTile29(v,w,p,index,job){const home=Number(p.homeTileId),rows=[...index.cache.rows.values()],constructionTiles29=job==='건축가'?new Set((v.constructionProjects||[]).map(q=>Number(q.tileId))):null;", 'bestOpen-head');
 replace("((v.constructionProjects||[]).some(q=>Number(q.tileId)===r.id)?35:0)", "(constructionTiles29.has(r.id)?35:0)", 'construction-job');
 // The same tile lookup appeared twice inside every stable job-review gate.
 replace("invalid=!validFacility||!JOBS29.includes(old)||!w.map.get(this.homeTileId)||w.map.get(this.homeTileId)?.ownerId!==v.id,", "invalid=!validFacility||!JOBS29.includes(old)||w.map.get(this.homeTileId)?.ownerId!==v.id,", 'validity-tile');
 return source;
}
