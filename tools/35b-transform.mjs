/* V0.35B: replace one exact D2 administration helper body after protected-source transforms.
   One adminModel call per sameInstitution query, instead of two.  No long-lived cache.
   Keep original array.find/includes semantics and preserve returned row identity. */
export function b35Transform(file,text){
 if(file!=='src/legacy/064.js')return text;
 const before="function sameInstitutionD2(v,w,a,b){const x=regionForTileD2(v,w,a),y=regionForTileD2(v,w,b);return x&&y&&x.code===y.code&&x.institutionalized&&x.officeOperational?x:null;}";
 const after="function sameInstitutionD2(v,w,a,b){const model=adminModelD2(v,w),regions=model.regions;const x=regions?.find(r=>(r.tiles||[]).includes(Number(a)))||null,y=regions?.find(r=>(r.tiles||[]).includes(Number(b)))||null;return x&&y&&x.code===y.code&&x.institutionalized&&x.officeOperational?x:null;}";
 if(!text.includes(before))throw new Error('35B D2 one-call administrative lookup anchor missing');
 return text.replace(before,after);
}
