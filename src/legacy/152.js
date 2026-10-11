
/* V0.34B — Settlement Entity V1.
 * Structural adapter only. Physical Tile/Person/Gold/inventory rules are unchanged.
 * 34B: one claimed tile <-> one active Settlement; 34C will allow tileIds.length>1.
 */
(function(NS){
'use strict';
const VERSION='V0.34B', PREVIOUS='V0.34A', SCHEMA='village-observer-settlement';
const isId=x=>Number.isInteger(Number(x))&&Number(x)>=0;
const owned=x=>x!==null&&x!==undefined;
const same=(a,b)=>String(a)===String(b);
const jsonCopy=o=>JSON.parse(JSON.stringify(o));
const padSeq=n=>'st-'+String(n).padStart(7,'0');
function today(w){return Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??1);}
function newState(){return {schema:SCHEMA,schemaVersion:1,revision:'settlement-entity-v1',nextSettlementSeq:1,settlements:[]};}
function registry(w){return w.v34b;}
function create(w,t,nationId){
 const z=registry(w);if(!z)throw Error('V034B_NO_REGISTRY');
 const seq=z.nextSettlementSeq++;
 const item={schema:SCHEMA,schemaVersion:1,id:padSeq(seq),nationId:Number(nationId),coreTileId:Number(t.id),tileIds:[Number(t.id)],lifecycle:'ACTIVE',createdCalendarDay:today(w)};
 z.settlements.push(item);t.settlementId=item.id;
 if(!w._v34bActive)Object.defineProperty(w,'_v34bActive',{value:new Map(),writable:true,configurable:true,enumerable:false});
 w._v34bActive.set(String(item.id),item);
 return item;
}
function abandon(w,t,oldId){
 const z=registry(w),key=String(t.settlementId??''),r=w._v34bActive?.get(key);
 if(!r){throw Error('V034B_NO_SETTLEMENT_TO_ABANDON tile='+t.id+' old='+oldId+' settlement='+key);}
 if(!same(r.nationId,oldId)||r.tileIds.length!==1||Number(r.tileIds[0])!==Number(t.id))throw Error('V034B_ABANDON_MISMATCH tile='+t.id);
 r.lifecycle='ABANDONED';r.tileIds=[];r.abandonedCalendarDay=today(w);t.settlementId=null;w._v34bActive.delete(key);
}
function changeOwner(w,t,oldOwner,nextOwner){
 if(w._v34cMode && NS.V034C?.changeOwner)return NS.V034C.changeOwner(w,t,oldOwner,nextOwner);
 if(same(oldOwner,nextOwner)||!registry(w))return;
 const prev=owned(oldOwner),next=owned(nextOwner);
 if(prev&&next){const r=w._v34bActive?.get(String(t.settlementId));
  if(!r||r.lifecycle!=='ACTIVE'||r.tileIds.length!==1||r.tileIds[0]!==t.id||!same(r.nationId,oldOwner))throw Error('V034B_CESSION_STATE_INVALID tile='+t.id);
  r.nationId=Number(nextOwner); // retain persistent Settlement ID on direct cession
 }else if(prev){abandon(w,t,oldOwner);}else if(next){
  if(t.settlementId!==null&&t.settlementId!==undefined)throw Error('V034B_CLAIM_ALREADY_LINKED tile='+t.id);
  create(w,t,nextOwner);
 }
}
function watchOwner(w,t){
 if(t._v34bWatchedFor===w)return;
 if(t._v34bWatchedFor)throw Error('V034B_TILE_BOUND_TO_OTHER_WORLD tile='+t.id);
 let current=t.ownerId;
 Object.defineProperty(t,'ownerId',{configurable:true,enumerable:true,get(){return current;},set(value){
  if(same(current,value)) {current=value;return;}
  const old=current;current=value;
  try{changeOwner(w,t,old,value);}catch(e){current=old;throw e;}
 }});
 Object.defineProperty(t,'_v34bWatchedFor',{value:w,configurable:true,enumerable:false});
}
function migrateLegacy(w){
 const z=newState();w.v34b=z;
 for(const t of [...w.map.tiles].sort((a,b)=>a.id-b.id)){
  t.settlementId=null;
  if(owned(t.ownerId))create(w,t,t.ownerId);
 }
 return z;
}
function restoreRegistry(w,raw){
 if(!raw||raw.schema!==SCHEMA||![1,2].includes(raw.schemaVersion)||!Array.isArray(raw.settlements)||!Number.isSafeInteger(raw.nextSettlementSeq)||raw.nextSettlementSeq<1)throw Error('V034B_INVALID_REGISTRY');
 w.v34b=jsonCopy(raw);
 // Serialized tile-side links already travel with original map.serialize(); do not rewrite them on load.
}
function inspect(w,{baseline=true}={}){
 if(w?.v34b?.schemaVersion===2&&NS.V034C?.inspect)return NS.V034C.inspect(w,{baseline});
 const errors=[],warn=[],z=w?.v34b,vs=w?.villages||[],tiles=w?.map?.tiles||[];
 if(!z||z.schema!==SCHEMA||z.schemaVersion!==1||!Array.isArray(z.settlements))return {ok:false,errors:[{code:'REGISTRY_MISSING'}],warnings:[],counts:{}};
 const idIndex=new Map(),seenTile=new Set(),nationMap=new Map(vs.map(v=>[String(v.id),v]));
 let active=0,abandoned=0,maxSeq=0;
 for(const r of z.settlements){
  const id=String(r.id||'');if(idIndex.has(id))errors.push({code:'DUPLICATE_SETTLEMENT_ID',id});idIndex.set(id,r);
  const match=/^st-(\d+)$/.exec(id);if(!match)errors.push({code:'BAD_SETTLEMENT_ID',id});else maxSeq=Math.max(maxSeq,Number(match[1]));
  if(r.schema!==SCHEMA||r.schemaVersion!==1)errors.push({code:'BAD_SETTLEMENT_SCHEMA',id});
  if(r.lifecycle==='ABANDONED'){abandoned++;if(r.tileIds?.length)errors.push({code:'ABANDONED_HAS_TILES',id});continue;}
  if(r.lifecycle!=='ACTIVE'){errors.push({code:'INVALID_LIFECYCLE',id});continue;}active++;
  if(!nationMap.has(String(r.nationId)))errors.push({code:'UNKNOWN_SETTLEMENT_NATION',id,nationId:r.nationId});
  if(!Array.isArray(r.tileIds)||r.tileIds.length!==1){errors.push({code:'B_REQUIRES_SINGLE_TILE',id,tileIds:r.tileIds});continue;}
  const tid=Number(r.tileIds[0]),t=w.map.get(tid);
  if(seenTile.has(tid))errors.push({code:'TILE_CLAIMED_BY_MULTIPLE_SETTLEMENTS',tileId:tid});seenTile.add(tid);
  if(!t||!owned(t.ownerId))errors.push({code:'SETTLEMENT_TILE_NOT_CLAIMED',id,tileId:tid});
  else if(!same(t.ownerId,r.nationId))errors.push({code:'SETTLEMENT_OWNER_MISMATCH',id,tileId:tid});
  if(!t||!same(t.settlementId,id))errors.push({code:'REVERSE_TILE_LINK_MISMATCH',id,tileId:tid});
  if(!same(r.coreTileId,tid))errors.push({code:'B_CORE_TILE_MISMATCH',id,tileId:tid});
 }
 if(!Number.isSafeInteger(z.nextSettlementSeq)||z.nextSettlementSeq<=maxSeq)errors.push({code:'SEQUENCE_REUSE_RISK',next:z.nextSettlementSeq,maxSeq});
 let claimed=0,unclaimed=0;
 for(const t of tiles){if(owned(t.ownerId)){claimed++;const r=idIndex.get(String(t.settlementId||''));if(!r||r.lifecycle!=='ACTIVE'||r.tileIds?.length!==1||Number(r.tileIds[0])!==t.id)errors.push({code:'CLAIMED_TILE_MISSING_SETTLEMENT',tileId:t.id,link:t.settlementId});}
 else {unclaimed++;if(owned(t.settlementId))errors.push({code:'UNCLAIMED_TILE_LINKED',tileId:t.id,link:t.settlementId});}}
 if(active!==claimed)errors.push({code:'CLAIMED_ACTIVE_COUNT_MISMATCH',active,claimed});
 if(baseline&&NS.V034A?.inspect){const a=NS.V034A.inspect(w);for(const e of a.errors||[])errors.push({code:'BASELINE_'+e.code,detail:e});for(const e of a.warnings||[])warn.push(e);}
 return {ok:!errors.length,version:VERSION,calendarOrdinalDay:today(w),counts:{nations:vs.length,tiles:tiles.length,claimedTiles:claimed,unclaimedTiles:unclaimed,activeSettlements:active,abandonedSettlements:abandoned,settlementRecords:z.settlements.length,nextSettlementSeq:z.nextSettlementSeq},errors,warnings:warn};
}
function attach(w,raw,strict=true){
 if(w.v34b&&w._v34bActive){return w;}
 if(raw)restoreRegistry(w,raw);else migrateLegacy(w);
 const map=new Map();for(const r of w.v34b.settlements){if(r.lifecycle==='ACTIVE')map.set(String(r.id),r);}
 Object.defineProperty(w,'_v34bActive',{value:map,configurable:true,writable:true,enumerable:false});
 // Validate pre-watch before touching underlying Tile ownerId descriptors.
 const check=inspect(w);if(!check.ok){delete w.v34b;delete w._v34bActive;throw Error('V034B_MIGRATION_REJECTED '+JSON.stringify(check.errors.slice(0,12)));}
 for(const t of w.map.tiles)watchOwner(w,t);
 return w;
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDay=NS.World.prototype.advanceOneDay;
NS.World.prototype.serialize=function(){attach(this,null);const d=oldSerialize.call(this);d.version=VERSION;d.v34b=jsonCopy(this.v34b);return d;};
// Preserve saved birth-calendar identity; the inherited Person.from migration can
// regenerate an already persisted birthOrdinal24 during nested legacy rehydration.
// Restoring valid source dates prevents a physical fingerprint mismatch on pure import.
function preserveSavedBirthCalendar(w,data){
 const byNation=new Map((data?.villages||[]).map(v=>[String(v.id),v]));
 for(const v of w.villages||[]){const src=byNation.get(String(v.id));if(!src)continue;
  const byPerson=new Map((src.residents||[]).map(p=>[String(p.id),p]));
  for(const p of v.residents||[]){const raw=byPerson.get(String(p.id));if(!raw||!Number.isFinite(raw.birthOrdinal24))continue;
   p.birthOrdinal24=raw.birthOrdinal24;
   for(const k of ['birthYear24','birthQuarter24','birthDay24'])if(Number.isFinite(raw[k]))p[k]=raw[k];
  }
 }
}
NS.World.from=function(data){const b=String(data?.version||'')===VERSION;const w=oldFrom(b?{...data,version:PREVIOUS}:data);preserveSavedBirthCalendar(w,data);return attach(w,b?data.v34b:null);};
NS.World.prototype.advanceOneDay=function(...args){attach(this,null);return oldDay.apply(this,args);};
if(NS.UI){const oldSetWorld=NS.UI.prototype.setWorld,oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.setWorld=function(w,...args){attach(w,null);return oldSetWorld.call(this,w,...args);};NS.UI.prototype.renderHeader=function(){const ret=oldHead.call(this);document.title='Village Observer '+VERSION;const e=document.getElementById('versionBadge');if(e)e.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return ret;};}
const prevSave=NS.SaveSystem;
function dl(name,content,mime='application/json'){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([content],{type:mime}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...prevSave,
 save(w){const s=JSON.stringify(w.serialize());try{localStorage.setItem('village-observer-v034b',s);}catch(e){throw Error('로컬 저장 용량이 부족합니다. 파일로 내보내기를 사용하세요: '+String(e.message||e));}},
 load(){const s=localStorage.getItem('village-observer-v034b');return s?NS.World.from(JSON.parse(s)):prevSave.load?.();},
 export(w){dl('village-observer-v034B-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl('village-observer-v034B-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),v=NS.V032E14?.validateCSV?.(csv);if(v&&!v.ok)throw Error('V034B CSV schema mismatch '+JSON.stringify(v.bad?.slice(0,4)));dl('village-observer-v034B-snapshots-'+w.telemetry.sessionId+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');}
};
const oldToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldToJSON.call(this,w);d.version=VERSION;d.worldSummary.v034bRevision='settlement-entity-v1';const check=inspect(w,{baseline:false});d.worldSummary.v034bSettlementState={...check.counts,registryErrors:check.errors.length};return d;};
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-09',title:'Settlement Entity V1',summary:'독립 Settlement 레지스트리를 도입했습니다. 현 버전은 영유 타일과 Settlement를 1:1로 대응시키고 경제·전투·물류 규칙을 유지합니다.',sections:[['정착지 구조',['World.v34b.settlements[]에 영속 ID, 국가 ID, 중심 타일, 타일 목록, 상태와 생성일을 기록합니다.','정착지에 자원·건물·Gold를 복제하지 않고 타일의 실제 데이터가 계속 권위를 가집니다.']],['영토 이벤트',['개척 및 신규 영유에 새 Settlement를 생성합니다.','영토 양도 시 Settlement ID를 보존한 채 nationId를 바꾸고, 영유 상실 시 역사 기록을 ABANDONED 처리합니다.']],['호환성·검증',['34A/HF2 구세이브를 기존 World.from 복원 후 자동 이관합니다.','VSim.V034B.inspect(world)에서 독립 관계·1:1 대응·이력 ID 재사용을 검사할 수 있습니다.']],['후속 계획',['여러 타일의 물류 1일 접근권 병합은 0.34C에서 다룹니다.']]]});
NS.V034B=Object.freeze({version:VERSION,schema:SCHEMA,attach,inspect,createdCount:w=>w?.v34b?.settlements?.length||0,settlementForTile:(w,id)=>{attach(w,null);const t=w.map.get(Number(id));return w._v34bActive.get(String(t?.settlementId))||null;}});
try{if(window.villageObserver?.world)attach(window.villageObserver.world,null);window.villageObserver?.renderHeader?.();}catch(e){console.warn('V034B initial attach',e);}
})(window.VSim);
