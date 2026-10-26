/* V0.35H1C6 — audited timing scope around original F5A attach.
   Preserves the original H1C5 attach invocation, event order, RNG and world mutations.
   The runtime wrapper records nested attachWorld leaf stages only while this F5A
   snapshot scope is active. All protected source files remain untouched. */
const OLD="const probe=NS.V035H1B1?.measureStage;if(probe)probe('C5_F5A_ATTACH',w,attach,null,[w]);else attach(w);";
const NEW="const c6=NS.V035H1C6;if(c6)c6.runAttach(w,attach);else {const probe=NS.V035H1B1?.measureStage;if(probe)probe('C5_F5A_ATTACH',w,attach,null,[w]);else attach(w);}";
export function h1c6Transform(path,source){
 if(path!=='src/legacy/122.js')return source;
 if(source.split(OLD).length!==2)throw Error('H1C6 guarded F5A attach anchor mismatch');
 return source.replace(OLD,NEW);
}
