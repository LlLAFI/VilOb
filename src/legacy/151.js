
/* V0.34A — Structural Audit & Baseline. Read-only, opt-in structural inspector.
 * No active simulation loops, Person rules, resource transfer, or construction changes.
 */
(function(NS){
'use strict';
const VERSION='V0.34A',PREVIOUS='V0.33I3C-HF2';
const isObject=x=>x!==null&&typeof x==='object';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const sumMap=o=>Object.values(o||{}).reduce((s,n)=>s+(finite(Number(n))?Math.max(0,Number(n)):0),0);
function inspect(w){
 const errors=[],warnings=[],ids=new Set(),personIds=new Set(),ownerIndex=new Map(),territoryIndex=new Map();
 const vs=w?.villages||[],tiles=w?.map?.tiles||[];
 if(!w?.map||!Array.isArray(tiles)||!Array.isArray(vs))return {ok:false,errors:[{code:'WORLD_INVALID'}],warnings:[],counts:{}};
 const byId=new Map();
 for(const v of vs){
  if(byId.has(String(v.id)))errors.push({code:'DUPLICATE_NATION_ID',nation:v.id});
  byId.set(String(v.id),v);territoryIndex.set(String(v.id),new Set(v.territory||[]));
 }
 for(const t of tiles){
  if(ids.has(t.id))errors.push({code:'DUPLICATE_TILE_ID',tileId:t.id});
  ids.add(t.id);
  if(t.ownerId!==null&&t.ownerId!==undefined){
   const v=byId.get(String(t.ownerId));
   if(!v)errors.push({code:'OWNER_UNKNOWN',tileId:t.id,ownerId:t.ownerId});
   else if(!territoryIndex.get(String(v.id)).has(t.id))errors.push({code:'OWNER_TERRITORY_MISMATCH',tileId:t.id,ownerId:v.id});
   ownerIndex.set(t.id,t.ownerId);
  }
  for(const key of ['food','wood','stone','iron_ore','iron','tools']){
   const val=t.stocks?.[key];if(val!==undefined&&(!finite(Number(val))||Number(val)<-0.00001))errors.push({code:'INVALID_TILE_STOCK',tileId:t.id,key,val});
  }
  for(const lot of t.ruinEquipment33I3CH2||[]){
   if(!byId.has(String(lot.nationId)))warnings.push({code:'RUIN_SOURCE_UNKNOWN',tileId:t.id,nationId:lot.nationId});
   for(const [item,n] of Object.entries(lot.items||{}))if(!Number.isInteger(n)||n<0)errors.push({code:'INVALID_RUIN_ITEM',tileId:t.id,item,n});
  }
 }
 for(const v of vs){
  for(const id of v.territory||[]){
   const t=w.map.get(id);
   if(!t)errors.push({code:'TERRITORY_TILE_MISSING',nationId:v.id,tileId:id});
   else if(String(t.ownerId)!==String(v.id))errors.push({code:'TERRITORY_OWNER_MISMATCH',nationId:v.id,tileId:id,ownerId:t.ownerId});
  }
  if(v.status==='active'&&!w.map.get(v.coreTileId))errors.push({code:'CORE_TILE_MISSING',nationId:v.id,coreTileId:v.coreTileId});
  for(const p of v.residents||[]){
   if(personIds.has(String(p.id)))errors.push({code:'DUPLICATE_PERSON_ID',personId:p.id});
   personIds.add(String(p.id));
   if(p.alive){
    if(String(p.villageId)!==String(v.id))errors.push({code:'PERSON_NATION_MISMATCH',nationId:v.id,personId:p.id,claimedNation:p.villageId});
    if(p.homeTileId===null||p.homeTileId===undefined||!w.map.get(p.homeTileId))errors.push({code:'INVALID_HOME_TILE',nationId:v.id,personId:p.id,homeTileId:p.homeTileId});
    if(p.workTileId!==null&&p.workTileId!==undefined&&!w.map.get(p.workTileId))errors.push({code:'INVALID_WORK_TILE',nationId:v.id,personId:p.id,workTileId:p.workTileId});
   }
  }
 }
 const held=vs.reduce((n,v)=>n+sumMap(v.v33i1Equipment?.stats?.ruinHeldByItem),0);
 let items=0;
 for(const t of tiles)for(const lot of t.ruinEquipment33I3CH2||[])items+=sumMap(lot.items);
 if(held!==items)errors.push({code:'RUIN_LEDGER_MISMATCH',held,items});
 return {ok:errors.length===0,version:VERSION,calendarOrdinalDay:typeof w.calendarOrdinalDay==='function'?w.calendarOrdinalDay():null,
  counts:{nations:vs.length,tiles:tiles.length,claimedTiles:ownerIndex.size,territoryEntries:[...territoryIndex.values()].reduce((n,s)=>n+s.size,0),persons:personIds.size,alivePersons:vs.reduce((n,v)=>n+(v.residents||[]).filter(p=>p.alive).length,0),ruinEquipmentItems:items,ruinLedgerHeld:held},errors,warnings};
}
// V0.34B proposal only; not attached to real world objects in this version.
const futureSettlementSchema=Object.freeze({schema:'village-observer-settlement',schemaVersion:1,id:'stable opaque ID',nationId:'Nation (Village) ID',coreTileId:'physical anchor tile',tileIds:'contiguous physical tile IDs',lifecycle:'ACTIVE | ABANDONED',physicalInventoryPolicy:'Tile is authoritative',personHomePolicy:'homeTileId remains physical',ownerPolicy:'Tile.ownerId remains national ownership'});
const previousFrom=NS.World.from;
NS.World.from=function(data){const mapped=data?.version===VERSION?{...data,version:PREVIOUS}:data;return previousFrom(mapped);};
const previousSerialize=NS.World.prototype.serialize;
NS.World.prototype.serialize=function(){const data=previousSerialize.call(this);data.version=VERSION;data.v034a={revision:'structural-audit-baseline',schemaChange:false,simulationRulesUnchanged:true};return data;};
const previousExport=NS.SaveSystem;
function download(name,text,mime='application/json'){const blob=new Blob([text],{type:mime}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
NS.SaveSystem={...previousExport,
 save(w){localStorage.setItem('village-observer-v034a',JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem('village-observer-v034a');return raw?NS.World.from(JSON.parse(raw)):previousExport.load?.();},
 export(w){download('village-observer-v034A-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034A-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),v=NS.V032E14?.validateCSV?.(csv);if(v&&!v.ok)throw Error('V034A CSV schema mismatch '+JSON.stringify(v.bad?.slice(0,4)));download('village-observer-v034A-snapshots-'+w.telemetry.sessionId+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');}
};
const previousJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const data=previousJSON.call(this,w);data.version=VERSION;data.worldSummary.v034aRevision='structural-audit-baseline';return data;};
if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const ret=old.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return ret;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-09',title:'Structural Audit & Baseline',summary:'V0.33I3C-HF2의 게임 규칙을 그대로 유지하면서 정착지 구조 전환에 필요한 저장 호환성·불변조건·재현성 기준을 확정했습니다.',sections:[['구조 감사',['Nation(Village), Tile, Person의 현재 소유권과 물리적 참조 관계를 문서화했습니다.','개발자용 읽기 전용 검증 함수 VSim.V034A.inspect(world)를 제공합니다. 이 함수는 자동 실행되지 않습니다.']],['호환성',['V0.33I3C-HF2 세이브를 직접 불러오고, V0.34A 세이브를 버전 브리지로 정상 복원합니다.','Settlement 독립 엔티티와 다중 타일 병합은 V0.34B/C에서 진행합니다.']],['변경하지 않은 것',['AI·경제·식량·Recovery·전투·장비·군사 이동·물류 및 렌더링 주기에는 개입하지 않습니다.']]]});
NS.V034A=Object.freeze({version:VERSION,baseVersion:PREVIOUS,inspect,futureSettlementSchema});
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('34A header',e);}
})(window.VSim);
