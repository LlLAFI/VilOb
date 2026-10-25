/* H1C2: protected source unchanged. Narrow, audited runtime call-site bridges.
 * Only replace AI decision lookup and one event side-effect call. */
const changes={
 'src/legacy/024.js': [
  ["function lastDecision(w,v,day=w.ordinalDay()){for(let i=(w.telemetry.entries||[]).length-1;i>=0;i--){const e=w.telemetry.entries[i];if((e.ordinalDay||0)<day-1)break;if(e.type==='AI_DECISION'&&e.payload?.villageId===v.id)return e;}return null;}",
   "function lastDecision(w,v,day=w.ordinalDay()){if(NS.V035H1C2?.SimulationState)return NS.V035H1C2.SimulationState.lastDecision(w,v,day);for(let i=(w.telemetry.entries||[]).length-1;i>=0;i--){const e=w.telemetry.entries[i];if((e.ordinalDay||0)<day-1)break;if(e.type==='AI_DECISION'&&e.payload?.villageId===v.id)return e;}return null;}"],
 ],
 'src/legacy/126.js': [
  ["if(type==='WAR_DECLARED33')repairWarTargets(w,true);",
   "if(type==='WAR_DECLARED33'){if(NS.V035H1C2?.DomainEvents)NS.V035H1C2.DomainEvents.legacyWarDeclared(w,payload);else repairWarTargets(w,true);}"],
 ],
 'src/legacy/093.js': [
  ["[...(w.telemetry?.entries||[])].reverse().find(x=>x.type==='AI_DECISION'&&x.payload?.villageId===v.id&&Number(x.ordinalDay)>=Number(w.ordinalDay())-1)",
   "(NS.V035H1C2?.SimulationState?NS.V035H1C2.SimulationState.lastDecision(w,v,w.ordinalDay()):[...(w.telemetry?.entries||[])].reverse().find(x=>x.type==='AI_DECISION'&&x.payload?.villageId===v.id&&Number(x.ordinalDay)>=Number(w.ordinalDay())-1))"],
 ],
};
export function h1c2Transform(path,code){for(const [from,to] of changes[path]||[]){const count=code.split(from).length-1;if(count<1)throw Error('H1C2 protected source call-site missing: '+path+' '+from.slice(0,45));code=code.replaceAll(from,to);}return code;}
export const H1C2_TRANSFORMED_FILES=Object.keys(changes);
