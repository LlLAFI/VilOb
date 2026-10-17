// V0.34G3B — compiled legacy 154 only, no source block modifications.
const once=(s,a,b,tag)=>{const n=s.split(a).length-1;if(n!==1)throw Error('G3B anchor '+tag+': '+n);return s.replace(a,b);};
export function g3bTransform(file,src){
 if(file!=='src/legacy/154.js')return src;
 let s=src;
 s=once(s,
  'const ac=withinCoreRadiusD3B1(w,aa,a.coreTileId)&&bothReachable(w,aa,a.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,a.coreTileId,"join"):JOIN),bc=withinCoreRadiusD3B1(w,aa,b.coreTileId)&&bothReachable(w,aa,b.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,b.coreTileId,"join"):JOIN);',
  'const ar=withinCoreRadiusD3B1(w,aa,a.coreTileId),br=withinCoreRadiusD3B1(w,aa,b.coreTileId);const ac=ar&&bothReachable(w,aa,a.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,a.coreTileId,"join"):JOIN),bc=br&&bothReachable(w,aa,b.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,b.coreTileId,"join"):JOIN);if(NS.V034G3B?.config?.enabled)NS.V034G3B.onCandidate(w,{ar,br,ac,bc});', 'join-probe');
 s=once(s,
  'function merge(w,winner,loser){const next=winner.tileIds.concat(loser.tileIds);',
  'function merge(w,winner,loser){if(NS.V034G3B?.config?.enabled)NS.V034G3B.onMerge(w,winner,loser);const next=winner.tileIds.concat(loser.tileIds);','merge-observation');
 return s;
}
