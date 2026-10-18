// G5 patches compiled views only; protected legacy sources remain immutable.
function once(s,a,b,label){const n=s.split(a).length-1;if(n!==1)throw Error(`G5 ${label}: expected one anchor, got ${n}`);return s.replace(a,b);}
export function g5Transform(file,source){let s=source;
 if(file==='src/bootstrap/v034d3a.js'){
  s=once(s,'mul=Math.max(0,num(v.harvestMultiplier(k,t))),made=raw*mul;',
   'baseMul=Math.max(0,num(v.harvestMultiplier(k,t))),mul=Math.max(0,num(NS.V034G5?.workerMultiplier?.(p,v,k,t,baseMul)??baseMul)),made=raw*mul;', 'conserved-farmer-stone-yield');
 }
 if(file==='src/legacy/053.js'){
  s=once(s,'desired=(.52+Number(this.skills?.mining||0)/120)*factor,available=',
   "desired=(.52+Number(this.skills?.mining||0)/120)*(NS.V034G5?.oreMultiplier?.(v,factor)??factor),available=", 'ore-miner-storage-bounded-yield');
 }
 if(file==='src/legacy/022.js'){
  s=once(s,"v.gainKnowledge(this.knowledgeYield()*1.20,w,'학자');",
   "v.gainKnowledge(this.knowledgeYield()*(NS.V034G5?.scholarMultiplier?.(v)??1.20),w,'학자');", 'scholar-additive-academy');
 }
 if(file==='src/legacy/087.js'){
  s=once(s,"const rate=(f.status==='REGROUPING'||f.status==='RETREATING')?0.45:0.06,cur=Number(f.v33c1BattleMorale||0),step=rate*dt;",
   "const cur=Number(f.v33c1BattleMorale||0),afterBattle=(cur<0||['REGROUPING','RETREATING','POST_BATTLE_RECOVERY'].includes(f.status)),rate=((f.status==='REGROUPING'||f.status==='RETREATING')?0.45:0.06)*(afterBattle&&v.hasTech?.('FIELD_REORGANIZATION')?1.20:1),step=rate*dt;", 'formation-morale-not-garrison');
  s=once(s,'f.v33c1RegroupDays=d;f.v33cRegroupUntilCal=now+d;',
   'f.v33c1RegroupDays=NS.V034G5?.regroupDays?.(v,d)??d;f.v33cRegroupUntilCal=now+f.v33c1RegroupDays;', 'regroup-start-only');
  // Preserve accurate telemetry of the actual days, including commander timing that was already applied.
  s=once(s,'regroupDays:d,regroupUntilCal:f.v33cRegroupUntilCal',
   'regroupDays:f.v33c1RegroupDays,regroupUntilCal:f.v33cRegroupUntilCal', 'regroup-log');
  s=once(s,'regroupDays:d,severity:Number(f.v33c3RecoverySeverity||0)',
   'regroupDays:f.v33c1RegroupDays,severity:Number(f.v33c3RecoverySeverity||0)', 'deep-regroup-log');
  s=once(s,'f.v33c1PostBattleUntilCal=Math.max(Number(f.v33c1PostBattleUntilCal||0),now+recoveryDays);',
   'f.v33c1PostBattleUntilCal=Math.max(Number(f.v33c1PostBattleUntilCal||0),now+(NS.V034G5?.postBattleDays?.(winner,recoveryDays)??recoveryDays));', 'single-war-winner-recovery');
 }
 if(file==='src/legacy/095.js'){
  s=once(s,'f.v33c1PostBattleUntilCal=Math.max(Number(f.v33c1PostBattleUntilCal||0),now+recoveryDays);',
   'f.v33c1PostBattleUntilCal=Math.max(Number(f.v33c1PostBattleUntilCal||0),now+(NS.V034G5?.postBattleDays?.(x.v,recoveryDays)??recoveryDays));', 'coalition-winner-recovery');
 }
 return s;
}
