/* Stage probes at explicitly audited bootstrap boundaries; optional snapshot profiler only. */
const stages={
 'v034d1a.js':'D1A_SETTLEMENT_LABOR',
 'v034d2.js':'D2_HOUSING_AUDIT',
 'v034d3b.js':'D3B_ECONOMIC_OBSERVATION',
 'v034h4c.js':'H4_OBSERVATION_STACK',
 'v035f1.js':'35F_OBSERVATION_STACK',
 'v035h1b1a.js':'35H_OBSERVATION_STACK'
};
export const H1C1_STAGES=Object.freeze({...stages});
function replaceOnce(source,needle,replacement,name){
 if(source.split(needle).length!==2)throw Error('H1C1 audited D1 observation anchor changed: '+name+' '+needle.slice(0,50));
 return source.replace(needle,replacement);
}
export function h1c1Transform(name,source){
 if(name==='v034d1.js'){
  source=replaceOnce(source,'function all(w){const prep=prepare(w);return activeRecords(w).map(r=>aggregate(w,r.id,prep)).filter(Boolean);}',
   'function all(w,prepared){const prep=prepared?.world===w?prepared:(NS.V034D1?.prepare?.(w)??prepare(w));return activeRecords(w).map(r=>aggregate(w,r.id,prep)).filter(Boolean);}',name);
  source=replaceOnce(source,'if(s){const rows=all(w),x=audit(w,rows);Object.assign(s.global',
   'if(s){const rows=NS.V034D1.all(w),x=audit(w,rows);Object.assign(s.global',name);
 }
 if(name==='v034d1a.js')source=replaceOnce(source,'function all(w){const prep=prepare(w);return NS.V034D1.all(w).map(r=>({...r,labor:calc(w,r,prep)}));}',
  'function all(w){const prep=prepare(w);return NS.V034D1.all(w,prep).map(r=>({...r,labor:calc(w,r,prep)}));}',name);
 const id=stages[name];if(!id)return source;
 if(!source.includes('})(window.VSim);'))throw Error('H1C1 stage insertion missing bootstrap IIFE '+name);
 return source+`\n;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('${id}',args[0],old,this,args):old.apply(this,args);};})(window.VSim);\n`;
}
