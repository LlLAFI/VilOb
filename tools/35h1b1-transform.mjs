/* H1B1 read-only nation id lookups inside 27 historical snapshot enrichment blocks.
 * Only transforms an exact id-comparison expression, preserving find-first semantics.
 */
const layers={'src/legacy/108.js':'E4_AND_EARLIER','src/legacy/114.js':'F_PREP_AND_WAR','src/legacy/115.js':'F1_SETTLEMENT','src/legacy/118.js':'F4_FINANCE','src/legacy/119.js':'F5_MONETARY','src/legacy/122.js':'F5A_FRONTIER'};
const exact='w.villages.find(x=>Number(x.id)===Number(row.id))';
export function h1b1Transform(path,source){
 if(!/^src\/legacy\/\d{3}\.js$/.test(path)||!source.includes('NS.Telemetry.prototype.snapshot=function'))return source;
 const transformed=source.replaceAll(exact,'(NS.V035H1B1?.lookupVillage?.(w,row.id)??w.villages.find(x=>Number(x.id)===Number(row.id)))');
 if(!layers[path])return transformed;
 return transformed+`\n;(function(NS){'use strict';if(!NS?.Telemetry?.prototype?.snapshot)return;const prior=NS.Telemetry.prototype.snapshot;NS.Telemetry.prototype.snapshot=function(...args){const api=NS.V035H1B1;if(!api?.measureStage)return prior.apply(this,args);return api.measureStage('${layers[path]}',args[0],prior,this,args);};})(window.VSim);\n`; 
}
