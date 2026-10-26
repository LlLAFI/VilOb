/* V0.35H1C5 — audited Snapshot hotpath transformation.
 * F5 attach(w) already invokes updateMonetary(w,false) before returning.
 * The immediately adjacent second invocation performs a redundant O(world) read
 * without any intervening mutations. Keep the first call and the full attach chain.
 * Optional F5A attach-stage profiler only measures the real, unchanged callback.
 */
const MONETARY_OLD="NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){attach(w);updateMonetary(w,false);const s=snapPrev.call(this,w,reason,note);";
const MONETARY_NEW="NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){attach(w);const s=snapPrev.call(this,w,reason,note);";
const F5A_OLD="NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){attach(w);const s=snapPrev.call(this,w,reason,note);";
const F5A_NEW="NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const probe=NS.V035H1B1?.measureStage;if(probe)probe('C5_F5A_ATTACH',w,attach,null,[w]);else attach(w);const s=snapPrev.call(this,w,reason,note);";
function audited(source,oldLine,newLine,label){if(source.split(oldLine).length!==2)throw Error('H1C5 audited snapshot anchor changed: '+label);return source.replace(oldLine,newLine);}
export function h1c5Transform(path,source){
 if(path==='src/legacy/119.js')return audited(source,MONETARY_OLD,MONETARY_NEW,'F5 duplicate monetary refresh');
 if(path==='src/legacy/122.js')return audited(source,F5A_OLD,F5A_NEW,'F5A attach timing');
 return source;
}
