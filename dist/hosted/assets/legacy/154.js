
/* V0.34C — Multi-Tile Settlement V1 / Spatial Index V1.
   Tile remains the sole authority for markets, buildings, jobs, population and goods.
   No Person behavioural/physical economy rules are changed. */
(function(NS){'use strict';
const VERSION='V0.34C',PREV='V0.34B-HF1',SCHEMA='village-observer-settlement';
const EPS=1e-8,JOIN=1.24,SPLIT=1.40,JOIN_WAIT=90,SPLIT_WAIT=180,REVIEW=90,MAX_TILES=13;
const owned=x=>x!==null&&x!==undefined, same=(a,b)=>String(a)===String(b);
const day=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
const active=w=>w?._v34bActive;
const record=(w,id)=>active(w)?.get(String(id))||null;
const tile=(w,id)=>w.map.get(Number(id));
function counters(w){const z=w.v34c;if(!z)throw Error('C_STATE_MISSING');return z.counters;}
function ensure(w){
 if(!w)return w;
 NS.V034B.attach(w,null);
 if(w._v34cMode)return w;
 const z=w.v34b;
 if(z.schemaVersion===1){z.schemaVersion=2;z.revision='multi-tile-settlement-v1';for(const r of z.settlements)r.schemaVersion=2;}
 if(!w.v34c)w.v34c={revision:'spatial-index-v1',lastReviewCal:day(w),pendingJoin:{},pendingSplit:{},counters:{reviews:0,merges:0,splits:0,ownershipChanges:0,cacheBuilds:0,cacheHits:0,candidatesTested:0,totalReviewMs:0,maxReviewMs:0}};
 Object.defineProperty(w,'_v34cMode',{value:true,writable:true,configurable:true,enumerable:false});
 Object.defineProperty(w,'_v34cCache',{value:{stamp:-1,byId:new Map()},writable:true,configurable:true,enumerable:false});
 if(w.v34c.lastReviewCal==null)w.v34c.lastReviewCal=day(w);
 return w;
}
function clearCache(w){if(w._v34cCache){w._v34cCache.stamp=-1;w._v34cCache.byId.clear();}}
function step(w,dest){const t=tile(w,dest);if(!t||!NS.TERRAIN[t.terrain]?.passable)return Infinity;
 // Same terrain/physical-road factor as 33D1B; no new abstract teleport route.
 const i=t.buildings?.indexOf('road')??-1,owner=w.villages.find(v=>same(v.id,t.ownerId));
 const road=i>=0&&Number(t.buildingCondition?.[i]??100)>=25&&!!owner?.hasTech?.('ROADS');
 return NS.V034G4?.spatialStep?.(w,t)??(Number(NS.TERRAIN[t.terrain].tradeCost||1)*(road?0.62:1));
}
function path(w,from,to,allowed,limit=Infinity){from=Number(from);to=Number(to);if(from===to)return 0;
 const dist=new Map([[from,0]]),pending=[[0,from]];
 while(pending.length){pending.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const [cost,id]=pending.shift();if(cost>limit+EPS)return Infinity;if(cost>dist.get(id)+EPS)continue;if(id===to)return cost;
 for(const n of w.map.neighbors4(id)){if(!allowed.has(n.id))continue;const next=cost+step(w,n.id);if(next>limit+EPS||next>=((dist.get(n.id)??Infinity)-EPS))continue;dist.set(n.id,next);pending.push([next,n.id]);}}
 return Infinity;
}
function bothReachable(w,ids,core,limit){if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.bothReachable(w,ids,core,limit);const allow=new Set(ids);if(!allow.has(Number(core)))return false;
 for(const id of ids){if(path(w,core,id,allow,limit)>limit+EPS||path(w,id,core,allow,limit)>limit+EPS)return false;}
 return true;
}
function components(w,ids){const allowed=new Set(ids.map(Number)),left=new Set(allowed),out=[];
 while(left.size){const root=Math.min(...left),seen=[root],q=[root];left.delete(root);while(q.length){const id=q.shift();for(const n of w.map.neighbors4(id)){if(!left.has(n.id))continue;left.delete(n.id);seen.push(n.id);q.push(n.id);}}
 out.push(seen.sort((a,b)=>a-b));}
 return out;
}
function issue(w,ids,nationId,core=ids[0]){
 const z=w.v34b,seq=z.nextSettlementSeq++,id='st-'+String(seq).padStart(7,'0');
 const r={schema:SCHEMA,schemaVersion:2,id,nationId:Number(nationId),coreTileId:Number(core),tileIds:[...ids].map(Number).sort((a,b)=>a-b),lifecycle:'ACTIVE',createdCalendarDay:day(w)};
 z.settlements.push(r);active(w).set(id,r);for(const tid of ids)tile(w,tid).settlementId=id;clearCache(w);return r;
}
function retire(w,r,toId=null){r.lifecycle=toId?'MERGED':'ABANDONED';if(toId){r.mergedIntoId=toId;r.mergedCalendarDay=day(w);}else r.abandonedCalendarDay=day(w);
 r.tileIds=[];active(w).delete(r.id);clearCache(w);}
function replaceGroup(w,r,ids){r.tileIds=[...ids].sort((a,b)=>a-b);for(const id of ids)tile(w,id).settlementId=r.id;clearCache(w);}
function disconnect(w,r){
 // Immediate physical connectivity partition on ownership changes. No remote magic linkage.
 const cc=components(w,r.tileIds);if(cc.length<=1)return;
 const keep=cc.find(c=>c.includes(Number(r.coreTileId)))||cc[0];replaceGroup(w,r,keep);r.coreTileId=keep.includes(Number(r.coreTileId))?r.coreTileId:keep[0];
 for(const c of cc){if(c===keep)continue;issue(w,c,r.nationId,c[0]);counters(w).splits++;}
}
function changeOwner(w,t,oldOwner,nextOwner){
 if(same(oldOwner,nextOwner))return;
 ensure(w);const z=counters(w);z.ownershipChanges++;
 const prev=owned(oldOwner),next=owned(nextOwner),r=record(w,t.settlementId);
 if(prev&&(!r||r.lifecycle!=='ACTIVE'||!same(r.nationId,oldOwner)||!r.tileIds.includes(t.id)))throw Error('C_OWNERSHIP_OLD_LINK '+t.id);
 if(!prev&&owned(t.settlementId))throw Error('C_UNOWNED_LINK '+t.id);
 if(!prev&&next){issue(w,[t.id],nextOwner);return;}
 if(!prev&&!next)return;
 // Retain core Settlement identity for a directly ceded core; other cases split off the ceded tile.
 if(prev&&next&&r.tileIds.length===1){r.nationId=Number(nextOwner);return;}
 if(prev&&next&&Number(r.coreTileId)===Number(t.id)){
  const leftovers=r.tileIds.filter(id=>id!==t.id);for(const group of components(w,leftovers))issue(w,group,oldOwner,group[0]);
  replaceGroup(w,r,[t.id]);r.nationId=Number(nextOwner);z.splits++;return;
 }
 r.tileIds=r.tileIds.filter(id=>id!==t.id);t.settlementId=null;
 if(!r.tileIds.length)retire(w,r);else disconnect(w,r);
 if(next)issue(w,[t.id],nextOwner);
 z.splits++;clearCache(w);
}
function developed(w,t){const v=w.villages.find(v=>same(v.id,t.ownerId));return !!(v?.tileResidents?.(t.id)?.length||t.buildings?.some(x=>!['road','outpost'].includes(x)));}
function groupsAdjacent(w,a,b){for(const id of a.tileIds)for(const n of w.map.neighbors4(id))if(same(n.settlementId,b.id))return true;return false;}
function coreScore(w,r){const t=tile(w,r.coreTileId),v=w.villages.find(v=>same(v.id,r.nationId));const pop=v?.tileResidents?.(r.coreTileId)?.length||0;
 return (t.id===Number(v?.coreTileId)?100000:0)+pop*3+(t.buildings?.length||0)*5+(day(w)-Number(r.createdCalendarDay||day(w)))*0.0001;
}
function withinCoreRadiusD3B1(w,ids,core){if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.withinRadius(w,ids,core);const c=tile(w,core);return !!c&&ids.every(id=>{const t=tile(w,id);return !!t&&Math.abs(t.x-c.x)+Math.abs(t.y-c.y)<=2;});}
function canJoin(w,a,b){if(!same(a.nationId,b.nationId)||(NS.V034G3?.config?.spatialEnabled? a.tileIds.length+b.tileIds.length>NS.V034G3.maximumJoinCap(w,a,b):a.tileIds.length+b.tileIds.length>MAX_TILES))return null;
 if(!groupsAdjacent(w,a,b))return null;
 const aa=a.tileIds.concat(b.tileIds);if(!aa.some(id=>developed(w,tile(w,id))))return null;
 const ar=withinCoreRadiusD3B1(w,aa,a.coreTileId),br=withinCoreRadiusD3B1(w,aa,b.coreTileId);const ac=ar&&bothReachable(w,aa,a.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,a.coreTileId,"join"):JOIN),bc=br&&bothReachable(w,aa,b.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,aa,b.coreTileId,"join"):JOIN);if(NS.V034G3B?.config?.enabled)NS.V034G3B.onCandidate(w,{ar,br,ac,bc});
 if(!ac&&!bc)return null;
 if(ac&&!bc)return [a,b];if(bc&&!ac)return [b,a];return coreScore(w,a)>=coreScore(w,b)?[a,b]:[b,a];
}
function merge(w,winner,loser){if(NS.V034G3B?.config?.enabled)NS.V034G3B.onMerge(w,winner,loser);const next=winner.tileIds.concat(loser.tileIds);replaceGroup(w,winner,next);retire(w,loser,winner.id);counters(w).merges++;
 w.telemetry?.record?.('SETTLEMENT_MERGED34C',w,{settlementId:winner.id,absorbedId:loser.id,nationId:winner.nationId,coreTileId:winner.coreTileId,tileIds:next});
}
function reevaluate(w){ensure(w);const start=performance.now(),z=w.v34c,c=counters(w),now=day(w);c.reviews++;
 const pendingSplit=z.pendingSplit||{},pendingJoin=z.pendingJoin||{};
 for(const r of [...active(w).values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)))){
  if(NS.V034G3?.config?.spatialEnabled)NS.V034G3.promote(w,r);if(r.tileIds.length<=1){delete pendingSplit[r.id];continue;}
  if(withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId)&&bothReachable(w,r.tileIds,r.coreTileId,NS.V034G3?.config?.spatialEnabled?NS.V034G3.pathLimit(w,r.tileIds,r.coreTileId,"split"):SPLIT)){delete pendingSplit[r.id];continue;}
  if(pendingSplit[r.id]===undefined){pendingSplit[r.id]=now;continue;}
  if(now-pendingSplit[r.id]<SPLIT_WAIT)continue;
  // Access degradation: each survivor is independently physical. No resource duplication.
  const ids=[...r.tileIds];replaceGroup(w,r,[r.coreTileId]);
  for(const tid of ids){if(tid===r.coreTileId)continue;issue(w,[tid],r.nationId,tid);c.splits++;}
  delete pendingSplit[r.id];w.telemetry?.record?.('SETTLEMENT_SPLIT34C',w,{settlementId:r.id,nationId:r.nationId,previousTileIds:ids,reason:'ACCESS_TIMEOUT'});
 }
 const candidates=new Set();
 for(const t of w.map.tiles){if(!owned(t.ownerId))continue;const a=record(w,t.settlementId);if(!a)continue;
  for(const n of w.map.neighbors4(t.id)){if(!same(n.ownerId,t.ownerId)||n.settlementId===t.settlementId)continue;
   const b=record(w,n.settlementId);if(!b)continue;
   const k=[a.id,b.id].sort().join('|');candidates.add(k);}
 }
 const nextPending={};for(const k of [...candidates].sort()){
  const [aId,bId]=k.split('|'),a=record(w,aId),b=record(w,bId);if(!a||!b)continue;
  c.candidatesTested++;const order=canJoin(w,a,b);if(!order)continue;
  const first=Object.prototype.hasOwnProperty.call(pendingJoin,k)?pendingJoin[k]:now;
  if(now-first<JOIN_WAIT){nextPending[k]=first;continue;}
  merge(w,...order);
 }
 z.pendingJoin=nextPending;z.pendingSplit=pendingSplit;z.lastReviewCal=now;
 const ms=performance.now()-start;c.totalReviewMs+=ms;c.maxReviewMs=Math.max(c.maxReviewMs,ms);
 return {elapsedMs:ms,active:active(w).size,merges:c.merges,splits:c.splits};
}
function cachedAggregate(w,id){ensure(w);const r=record(w,id);if(!r)return null;
 const d=day(w),c=w._v34cCache;
 if(c.stamp!==d){c.stamp=d;c.byId.clear();}
 if(c.byId.has(r.id)){counters(w).cacheHits++;return c.byId.get(r.id);}
 const v=w.villages.find(v=>same(v.id,r.nationId)),ids=r.tileIds,set=new Set(ids);
 const byHome=NS.V026?.ensureResidentIndex?.(v)?.byHome;
 const pop=byHome?[...set].reduce((n,id)=>n+(byHome.get(id)?.length||0),0):(v?.residents||[]).filter(p=>p.alive&&set.has(Number(p.homeTileId))).length;
 let buildings=0,food=0,wood=0,stone=0,marketGold=0;
 for(const tid of ids){const t=tile(w,tid);buildings+=t.buildings?.length||0;food+=Number(t.stocks?.food||0);wood+=Number(t.stocks?.wood||0);stone+=Number(t.stocks?.stone||0);marketGold+=Number(t.v29Economy?.marketGold||0);}
 const a={settlementId:r.id,nationId:r.nationId,coreTileId:r.coreTileId,tiles:ids.length,population:pop,buildings,food,wood,stone,marketGold};
 c.byId.set(r.id,a);counters(w).cacheBuilds++;return a;
}
function inspect(w,{baseline=false}={}){const errors=[],warnings=[],z=w?.v34b,vs=w?.villages||[],tiles=w?.map?.tiles||[];
 if(!z||z.schema!==SCHEMA||z.schemaVersion!==2)return {ok:false,errors:[{code:'C_SCHEMA_MISSING'}],warnings,counts:{}};
 const byId=new Map(),seen=new Set(),nations=new Set(vs.map(v=>String(v.id)));
 let a=0,merged=0,abandoned=0,multi=0,maxSize=0;
 for(const r of z.settlements||[]){const id=String(r.id||'');if(byId.has(id))errors.push({code:'DUPLICATE_ID',id});byId.set(id,r);
  if(r.schemaVersion!==2)errors.push({code:'INVALID_RECORD_SCHEMA',id});
  if(r.lifecycle==='MERGED'){merged++;if(r.tileIds?.length||!r.mergedIntoId)errors.push({code:'BROKEN_MERGE_HISTORY',id});continue;}
  if(r.lifecycle==='ABANDONED'){abandoned++;if(r.tileIds?.length)errors.push({code:'ABANDONED_HAS_TILES',id});continue;}
  if(r.lifecycle!=='ACTIVE'){errors.push({code:'UNKNOWN_LIFECYCLE',id});continue;}a++;
  if(!nations.has(String(r.nationId)))errors.push({code:'INVALID_NATION',id});
  if(!Array.isArray(r.tileIds)||!r.tileIds.length){errors.push({code:'ACTIVE_EMPTY',id});continue;}
  maxSize=Math.max(maxSize,r.tileIds.length);if(r.tileIds.length>1)multi++;
  if(r.tileIds.length>(NS.V034G3?.config?.spatialEnabled?NS.V034G3.policy(w,r.tileIds,r.coreTileId).cap:MAX_TILES))errors.push({code:'CAP_EXCEEDED',id});if(!withinCoreRadiusD3B1(w,r.tileIds,r.coreTileId))errors.push({code:'RADIUS_EXCEEDED',id});
  if(!r.tileIds.includes(Number(r.coreTileId)))errors.push({code:'CORE_NOT_MEMBER',id});
  if(components(w,r.tileIds).length>1)errors.push({code:'DISCONNECTED',id});
  for(const tid of r.tileIds){const t=tile(w,tid);if(seen.has(tid))errors.push({code:'MULTIPLE_SETTLEMENTS',tileId:tid});seen.add(tid);
   if(!t||!same(t.ownerId,r.nationId)||!same(t.settlementId,id))errors.push({code:'TILE_LINK_MISMATCH',id,tileId:tid,owner:t?.ownerId,link:t?.settlementId});}
 }
 for(const r of z.settlements||[])if(r.lifecycle==='MERGED'&&!byId.has(String(r.mergedIntoId)))errors.push({code:'MERGE_TARGET_MISSING',id:r.id});
 let claimed=0,unclaimed=0;for(const t of tiles){if(owned(t.ownerId)){claimed++;if(!seen.has(t.id))errors.push({code:'CLAIMED_WITHOUT_SETTLEMENT',tileId:t.id});}else{unclaimed++;if(owned(t.settlementId))errors.push({code:'UNOWNED_WITH_LINK',tileId:t.id});}}
 const maxSeq=Math.max(0,...[...byId.keys()].map(id=>Number(id.slice(3))||0));if(!Number.isSafeInteger(z.nextSettlementSeq)||z.nextSettlementSeq<=maxSeq)errors.push({code:'BAD_SEQUENCE'});
 if(baseline&&NS.V034A?.inspect){const s=NS.V034A.inspect(w);for(const x of s.errors||[])errors.push({code:'BASE_'+x.code});}
 return {ok:!errors.length,version:VERSION,calendarOrdinalDay:day(w),errors,warnings,counts:{nations:vs.length,tiles:tiles.length,claimedTiles:claimed,unclaimedTiles:unclaimed,activeSettlements:a,multiTileSettlements:multi,mergedSettlements:merged,abandonedSettlements:abandoned,settlementRecords:z.settlements.length,maxSettlementTiles:maxSize,nextSettlementSeq:z.nextSettlementSeq}};
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDay=NS.World.prototype.advanceOneDay;
NS.World.prototype.serialize=function(){ensure(this);const d=oldSerialize.call(this);d.version=VERSION;d.v34c=JSON.parse(JSON.stringify(this.v34c));return d;};
NS.World.from=function(data){const converted=data?.version===VERSION?{...data,version:PREV}:data;
 const w=oldFrom(converted);if(data?.version===VERSION&&data?.v34c)w.v34c=JSON.parse(JSON.stringify(data.v34c));return ensure(w);};
NS.World.prototype.advanceOneDay=function(...args){ensure(this);const result=oldDay.apply(this,args);const d=day(this);
 if(d-this.v34c.lastReviewCal>=REVIEW)reevaluate(this);
 return result;};
// Snapshot is observation only: do not mutate world economics or person decisions.
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){ensure(w);const s=oldSnapshot.call(this,w,reason,note);if(s){const q=inspect(w);Object.assign(s.global,{activeSettlements34C:q.counts.activeSettlements,multiTileSettlements34C:q.counts.multiTileSettlements,mergedSettlements34C:q.counts.mergedSettlements,settlementErrors34C:q.errors.length,settlementReviews34C:w.v34c.counters.reviews,settlementMerges34C:w.v34c.counters.merges,settlementSplits34C:w.v34c.counters.splits,settlementReviewMs34C:+w.v34c.counters.totalReviewMs.toFixed(3),settlementCacheBuilds34C:w.v34c.counters.cacheBuilds,settlementCacheHits34C:w.v34c.counters.cacheHits});}return s;};
const csvBefore=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=csvBefore.call(this).split('\n'),keys=['activeSettlements34C','multiTileSettlements34C','mergedSettlements34C','settlementErrors34C','settlementReviews34C','settlementMerges34C','settlementSplits34C','settlementReviewMs34C','settlementCacheBuilds34C','settlementCacheHits34C'];
 if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+keys.map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const row of s.villages||[])if(i<lines.length)lines[i++]+=','+keys.map(k=>q(s.global?.[k])).join(',');return lines.join('\n');};
const jsonBefore=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){ensure(w);const d=jsonBefore.call(this,w);d.version=VERSION;d.worldSummary.v034cRevision='multi-tile-settlement-spatial-index-v1';d.worldSummary.v034cSettlementState=inspect(w);d.worldSummary.v034cPerformance={...counters(w)};return d;};
const saveBefore=NS.SaveSystem;
function dl(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...saveBefore,save(w){ensure(w);try{localStorage.setItem('village-observer-v034c',JSON.stringify(w.serialize()));}catch(e){throw Error('대용량 세이브는 JSON 파일로 내보내 주세요: '+e.message);}},load(){const s=localStorage.getItem('village-observer-v034c');return s?NS.World.from(JSON.parse(s)):saveBefore.load?.();},export(w){dl(`village-observer-v034C-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v034C-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),q=NS.V032E14?.validateCSV?.(csv);if(q&&!q.ok)throw Error('V0.34C CSV schema mismatch '+JSON.stringify(q.bad?.slice(0,3)));dl(`village-observer-v034C-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}};
if(NS.UI){const oldSet=NS.UI.prototype.setWorld,oldHead=NS.UI.prototype.renderHeader,oldTile=NS.UI.prototype.renderTile,oldMap=NS.UI.prototype.renderMap;
 NS.UI.prototype.setWorld=function(w,...a){ensure(w);return oldSet.call(this,w,...a);};
 NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
 NS.UI.prototype.renderTile=function(...a){const r=oldTile.apply(this,a),w=this.world,t=w?.map?.get(w.selectedTileId),root=this.q('tileInspector');if(!t||!root||t.ownerId==null)return r;ensure(w);
  const s=record(w,t.settlementId),sum=s&&cachedAggregate(w,s.id);if(!s||!sum)return r;
  const allow=new Set(s.tileIds),out=path(w,s.coreTileId,t.id,allow,100),back=path(w,t.id,s.coreTileId,allow,100);
  let box=root.querySelector('.v34c-settlement-tile');if(!box){box=document.createElement('div');box.className='v34c-settlement-tile';root.appendChild(box);}
  box.innerHTML=`<strong>🏘️ 실제 Settlement ${s.id}</strong><div class="small muted">중심 타일 #${s.coreTileId} · 구성 ${s.tileIds.length}타일 · 전체 인구 ${sum.population}명 · 건물 ${sum.buildings}개<br>중심지 접근 ${out.toFixed(2)} / 귀환 ${back.toFixed(2)}일 환산 · 타일 #${s.tileIds.join(', #')}</div>`;
  return r;};
 NS.UI.prototype.renderMap=function(...a){const r=oldMap.apply(this,a);if(!this._v34cMapLayer)return r;
  const w=this.world,g=this._mapGeom,c=this.q('worldCanvas');if(!w||!g||!c)return r;
  const ctx=c.getContext('2d'),{cell,ox,oy}=g;ctx.save();ctx.lineWidth=Math.max(1,cell*.075);ctx.strokeStyle='rgba(255,242,170,0.85)';
  for(const t of w.map.tiles){if(t.ownerId==null)continue;const x=ox+t.x*cell,y=oy+t.y*cell;
   const n=w.map.at(t.x+1,t.y),d=w.map.at(t.x,t.y+1);
   if(n&&same(n.ownerId,t.ownerId)&&n.settlementId!==t.settlementId){ctx.beginPath();ctx.moveTo(x+cell,y);ctx.lineTo(x+cell,y+cell);ctx.stroke();}
   if(d&&same(d.ownerId,t.ownerId)&&d.settlementId!==t.settlementId){ctx.beginPath();ctx.moveTo(x,y+cell);ctx.lineTo(x+cell,y+cell);ctx.stroke();}
   const s=record(w,t.settlementId);if(s&&s.coreTileId===t.id){ctx.fillStyle='#fff7ba';ctx.beginPath();ctx.arc(x+cell*.5,y+cell*.5,Math.max(1.8,cell*.095),0,Math.PI*2);ctx.fill();}
  }ctx.restore();return r;};
 const install=()=>{const toolbar=document.querySelector('#view-map .map-toolbar');if(!toolbar||toolbar.querySelector('#v34cBoundaryToggle'))return;
  const b=document.createElement('button');b.id='v34cBoundaryToggle';b.textContent='정착지 경계: 끔';b.onclick=()=>{const ui=window.villageObserver;if(!ui)return;ui._v34cMapLayer=!ui._v34cMapLayer;b.textContent='정착지 경계: '+(ui._v34cMapLayer?'켬':'끔');ui.renderMap?.();};toolbar.appendChild(b);};install();
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-09',title:'Multi-Tile Settlement + Spatial Index V1',summary:'인접 타일을 동일 국가의 실제 Settlement로 병합하고, 영토 변경 시 분할하며, 지역 캐시·경계 시각화·성능 계측을 추가합니다.',sections:[['공간 통합',['동일 국가의 물리적으로 접한 타일 중 중심지 왕복 접근비용 각각 1.0 이하인 묶음만 병합합니다.','90일 지속 조건으로 병합, 1.15 초과 상태 180일 지속 시 분리합니다. 최대 5타일, 국가 영토 혼합 금지입니다.']],['물리 규칙 보존',['Person의 고유 ID·거주·근무 및 기존 시장·자원·건물·Gold 소유권은 타일에 그대로 남습니다.','전쟁 점령은 Settlement 소속을 바꾸지 않으며 영구 양도와 영유 상실만 즉시 분할·소속 변경합니다.']],['성능·검사',['소유권 변경 시 관련 Settlement만 수정하고 병합 판정은 분기 간격으로 수행합니다.','Settlement 단위 읽기 전용 인구/건물/재고 집계 캐시, CSV 성능 지표와 선택형 정착지 경계 레이어를 추가합니다.']]]});
NS.V034C=Object.freeze({version:VERSION,ensure,inspect,changeOwner,review:reevaluate,path,canJoin,aggregate:cachedAggregate,byTile:(w,id)=>{ensure(w);return record(w,tile(w,id)?.settlementId);},constants:{JOIN,SPLIT,JOIN_WAIT,SPLIT_WAIT,REVIEW,MAX_TILES}});
try{if(window.villageObserver?.world)ensure(window.villageObserver.world);window.villageObserver?.renderHeader?.();}catch(e){console.warn('V0.34C boot',e);}
})(window.VSim);
