/* H1C4 read-only source transforms for stage boundary probes. No protected
 * source file is edited; transforms only wrap existing Snapshot call chain.
 */
const stages={
 'src/legacy/099.js':'C4_PRE_E4_099',
 'src/legacy/105.js':'C4_PRE_E4_105',
 'src/legacy/108.js':'C4_E4_108',
 'src/legacy/112.js':'C4_E4_TO_F_112',
 'src/legacy/115.js':'C4_F1_115',
 'src/legacy/119.js':'C4_F5_119',
 'src/legacy/122.js':'C4_F5A_122'
};
export const H1C4_STAGES=Object.freeze({...stages});
export function h1c4Transform(path,src){const name=stages[path];if(!name)return src;
 return src+`\n;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(typeof old!=='function')return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('${name}',args[0],old,this,args):old.apply(this,args);};})(window.VSim);\n`;
}
