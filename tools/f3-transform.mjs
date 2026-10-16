// V0.34F3: surgical integration with immutable legacy source and F0 runtime.
// Every anchor must match exactly once, so upstream changes fail loudly.
export function f3Transform(path, source){
 const replaceOnce=(before,after,label)=>{
  const at=source.indexOf(before);
  if(at<0||source.indexOf(before,at+before.length)>=0)throw Error('F3 '+label+' anchor missing or ambiguous: '+path);
  source=source.slice(0,at)+after+source.slice(at+before.length);
 };
 if(path==='src/bootstrap/v034f0.js'){
  replaceOnce(
   " let delta=(82-num(p.health))*.002-(1-ratio)*1.0;\n if(p.hunger>80)delta-=.65;",
   " let delta=(82-num(p.health))*.002-NS.V034F3.nutritionLoss(ratio,p.hunger);",
   'nutrition');
  replaceOnce(
   "if(p.housingStrainDays>20){p.energy=clamp(p.energy-.035-.11*housingStress);p.happiness=clamp(p.happiness-.015-.045*housingStress);}",
   "if(p.housingStrainDays>20){p.energy=clamp(p.energy-.035-.11*housingStress);}",
   'housing penalty');
  replaceOnce(
   " p.happiness=clamp(num(p.happiness)+(65-num(p.happiness))*.0025-(1-ratio)*.18);\n const target=clamp(52+(50-p.hunger)*.18+(p.health-60)*.10+(p.energy-55)*.07-8*housingStress,15,90);\n p.happinessTarget=target;p.happiness=clamp(p.happiness+(target-p.happiness)*.014);\n const festival=v.festivalState;\n if(festival&&num(festival.until)>=w.ordinalDay?.()){const ft=clamp(target+(Number(p.homeTileId)===Number(festival.tileId)?8:3),0,95);\n  p.happinessTarget=ft;p.happiness=clamp(p.happiness+(ft-p.happiness)*.012);}",
   " NS.V034F3.updateHappiness(p,v,w,ratio,housingStress);",
   'single happiness target');
 }
 if(path==='src/legacy/034.js'){
  replaceOnce("illness*=1+Math.max(0,30-Number(p.health||30))*.012;",
   "illness*=NS.V034F3.illnessHealthFactor(p.health);", 'health zero');
 }
 return source;
}
