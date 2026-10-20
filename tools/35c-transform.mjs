/* V0.35C — index-assisted administrative region projection.
 * Preserve the full, state-updating adminModel call; optimize only lookup of its
 * fresh result. Fallback retains the original membership semantics on any
 * unindexed, ambiguous, or unusual model state.
 */
export function c35Transform(file,text){
 if(file!=='src/legacy/064.js')return text;
 const old="function sameInstitutionD2(v,w,a,b){const model=adminModelD2(v,w),regions=model.regions;const x=regions?.find(r=>(r.tiles||[]).includes(Number(a)))||null,y=regions?.find(r=>(r.tiles||[]).includes(Number(b)))||null;return x&&y&&x.code===y.code&&x.institutionalized&&x.officeOperational?x:null;}";
 const newer="function sameInstitutionD2(v,w,a,b){const model=adminModelD2(v,w),regions=model.regions;const pick=id=>{const t=Number(id),index=model.byTile?.[t];if(index&&Array.isArray(regions)){const r=regions.find(row=>row.code===index.regionCode&&Number(row.hubTileId)===Number(index.hubTileId));if(r&&(r.tiles||[]).includes(t))return r;}return regions?.find(r=>(r.tiles||[]).includes(t))||null;};const x=pick(a),y=pick(b);return x&&y&&x.code===y.code&&x.institutionalized&&x.officeOperational?x:null;}";
 if(!text.includes(old))throw Error('35C administrative lookup anchor missing');
 return text.replace(old,newer);
}
