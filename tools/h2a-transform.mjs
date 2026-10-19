// V0.34H2A: repair only the C Settlement core-detachment/review path.
// Protected 169 legacy blocks remain byte-identical on disk.
export function h2aTransform(source,input){
 let s=input;
 if(source==='src/legacy/154.js'){
  const prev='function disconnect(w,r){\n // Immediate physical connectivity partition on ownership changes. No remote magic linkage.\n const cc=components(w,r.tileIds);if(cc.length<=1)return;';
  const next='function disconnect(w,r){\n // When a multi-tile Settlement loses its core (e.g. abandoned outpost),\n // rebase the core on a real surviving tile BEFORE connectivity/review.\n // Otherwise the delayed access split recreates a phantom unowned core.\n if(r.tileIds.length&&!r.tileIds.includes(Number(r.coreTileId))){r.coreTileId=Math.min(...r.tileIds);clearCache(w);}\n const cc=components(w,r.tileIds);if(cc.length<=1)return;';
  if(!s.includes(prev))throw Error('H2A C-disconnect source anchor missing');
  s=s.replace(prev,next);
  const prevReview="for(const r of [...active(w).values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)))){\n  if(r.tileIds.length<=1)";
  // Review defensive invariant; the ordinary owner-change path does the primary fix.
  const prevReview2="for(const r of [...active(w).values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)))){\n  if(r.tileIds.length<=1)";
  if(s.includes(prevReview2)){
   s=s.replace(prevReview2, "for(const r of [...active(w).values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)))){\n  if(r.tileIds.length&&!r.tileIds.includes(Number(r.coreTileId))){r.coreTileId=Math.min(...r.tileIds);clearCache(w);}\n  if(r.tileIds.length<=1)");
  }
 }
 if(source==='src/bootstrap/v034g5.js'){
  const before="NS.RELEASE_VERSION==='V0.34H1'||NS.RELEASE_VERSION==='V0.34H2'";
  if(!s.includes(before))throw Error('H2A G5 release recognition anchor missing');
  s=s.replace(before,before+"||NS.RELEASE_VERSION==='V0.34H2A'");
 }
 return s;
}
