// V0.34G3: transform C1H *compiled output only*, preserve protected source SHA.
const once=(s,a,b,tag)=>{const n=s.split(a).length-1;if(n!==1)throw Error('G3 anchor '+tag+' expected once, got '+n);return s.replace(a,b);};
export function g3Transform(file,src){
 if(file!=='src/legacy/154.js')return src;
 let s=src;
 s=once(s,
  'function withinCoreRadiusD3B1(w,ids,core){const c=tile(w,core);return !!c&&ids.every(id=>{const t=tile(w,id);return !!t&&Math.abs(t.x-c.x)+Math.abs(t.y-c.y)<=2;});}',
  'function withinCoreRadiusD3B1(w,ids,core){if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.withinRadius(w,ids,core);const c=tile(w,core);return !!c&&ids.every(id=>{const t=tile(w,id);return !!t&&Math.abs(t.x-c.x)+Math.abs(t.y-c.y)<=2;});}', 'radius');
 s=once(s,
  'function canJoin(w,a,b){if(!same(a.nationId,b.nationId)||a.tileIds.length+b.tileIds.length>MAX_TILES)return null;',
  'function canJoin(w,a,b){if(!same(a.nationId,b.nationId)||(NS.V034G3?.config?.spatialEnabled? a.tileIds.length+b.tileIds.length>NS.V034G3.maximumJoinCap(w,a,b):a.tileIds.length+b.tileIds.length>MAX_TILES))return null;', 'join-cap');
 s=once(s,
  'const ac=withinCoreRadiusD3B1(w,aa,a.coreTileId)&&bothReachable(w,aa,a.coreTileId,JOIN),bc=withinCoreRadiusD3B1(w,aa,b.coreTileId)&&bothReachable(w,aa,b.coreTileId,JOIN);',
  'const ac=withinCoreRadiusD3B1(w,aa,a.coreTileId)&&bothReachable(w,aa,a.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,a.coreTileId,"join"):JOIN),bc=withinCoreRadiusD3B1(w,aa,b.coreTileId)&&bothReachable(w,aa,b.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,b.coreTileId,"join"):JOIN);','join-route');
 s=once(s,
  'if(r.tileIds.length<=1){delete pendingSplit[r.id];continue;}',
  'if(NS.V034G3?.config?.spatialEnabled)NS.V034G3.promote(w,r);if(r.tileIds.length<=1){delete pendingSplit[r.id];continue;}', 'growth-latch');
 s=once(s,
  'if(withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId)&&bothReachable(w,r.tileIds,r.coreTileId,SPLIT)){delete pendingSplit[r.id];continue;}',
  'if(withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId)&&bothReachable(w,r.tileIds,r.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,r.tileIds,r.coreTileId,"split"):SPLIT)){delete pendingSplit[r.id];continue;}', 'split-route');
 s=once(s,
  "if(r.tileIds.length>MAX_TILES)errors.push({code:'CAP_EXCEEDED',id});if(!withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId))errors.push({code:'RADIUS_EXCEEDED',id});",
  "if(r.tileIds.length>(NS.V034G3?.config?.spatialEnabled?NS.V034G3.policy(w,r.tileIds,r.coreTileId).cap:MAX_TILES))errors.push({code:'CAP_EXCEEDED',id});if(!withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId))errors.push({code:'RADIUS_EXCEEDED',id});", 'inspect');
 s=once(s,
  'function bothReachable(w,ids,core,limit){const allow=new Set(ids);if(!allow.has(Number(core)))return false;',
  'function bothReachable(w,ids,core,limit){if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.bothReachable(w,ids,core,limit);const allow=new Set(ids);if(!allow.has(Number(core)))return false;', 'path-fastpath');
 return s;
}
