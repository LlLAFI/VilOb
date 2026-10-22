/* V0.35F1 — One national housing resolution per seasonal development decision.
 * This is an intentional, user-approved housing AI policy simplification.
 * Build-only transformation; immutable C1H legacy sources remain unchanged.
 * Both profiled and unprofiled 35F development paths receive the same rule.
 */
function replaceOnce(source, needle, replacement, label) {
  const pos=source.indexOf(needle);
  if(pos<0 || source.indexOf(needle,pos+needle.length)>=0)
    throw new Error('35F1 anchor missing or ambiguous: '+label);
  return source.slice(0,pos)+replacement+source.slice(pos+needle.length);
}
export function f135Transform(file,source){
 if(file!=='src/legacy/025.js')return source;
 let out=source;
 const oldHousing="if(x.p.housing>=82&&v.buildHouse(w)){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'housing',score:+x.p.housing.toFixed(1)});return true;}";
 const newHousing="if(x.p.housing>=82&&!housingAttempted35F1){housingAttempted35F1=true;if(v.buildHouse(w)){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'housing',score:+x.p.housing.toFixed(1)});return true;}}";
 // V0.35F contains exactly two development implementations, with distinct
 // bodies. Limit changes to each body rather than unrelated loops in legacy JS.
 const origStart=out.indexOf('function demandDevelopment35FOriginal(v,w){');
 const profileStart=out.indexOf('function demandDevelopment35FProfiled(v,w){');
 const split=out.indexOf('/* ---------- land development ---------- */',profileStart);
 if(profileStart<0||split<profileStart||origStart<split)throw Error('35F1 development function boundaries missing');
 let orig=out.slice(origStart);
 orig=replaceOnce(orig,'for(const x of rows){const t=x.t;if(projectBusy(v,t.id))continue;',
   'let housingAttempted35F1=false;for(const x of rows){const t=x.t;if(projectBusy(v,t.id))continue;','unprofiled loop');
 orig=replaceOnce(orig,oldHousing,newHousing,'unprofiled house');
 let profile=out.slice(profileStart,split);
 profile=replaceOnce(profile,'p.count(\'territoryRows\',rows.length);\n for(const x of rows)',
   'p.count(\'territoryRows\',rows.length);\n let housingAttempted35F1=false;\n for(const x of rows)','profiled loop');
 const prev="if(x.p.housing>=82){p.count('housingEligible');if(measure('housingAttempt',()=>v.buildHouse(w))){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'housing',score:+x.p.housing.toFixed(1)});p.count('housingStarted');return true;}p.count('housingFailed');}";
 const next="if(x.p.housing>=82){p.count('housingEligible');if(!housingAttempted35F1){housingAttempted35F1=true;p.count('housingAttemptStarted35F1');if(measure('housingAttempt',()=>v.buildHouse(w))){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:t.id,demand:'housing',score:+x.p.housing.toFixed(1)});p.count('housingStarted');return true;}p.count('housingFailed');}else{p.count('housingSkippedRepeat35F1');}}";
 profile=replaceOnce(profile,prev,next,'profiled house');
 out=out.slice(0,profileStart)+profile+out.slice(split,origStart)+orig;
 return out;
}
