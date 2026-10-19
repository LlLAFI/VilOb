/* V0.34H2A — Settlement core abandonment & legacy ghost-link hotfix.
 * No Person, AI, RNG, combat, market, resource, construction or research
 * balancing changes. Event-free read-only validation when worlds are sound.
 */
(function(NS){'use strict';
const VERSION='V0.34H2A',PREV='V0.34H2',KEY='village-observer-v034h2a';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
const owned=x=>x!==null&&x!==undefined;
const same=(a,b)=>String(a)===String(b);
function targetedRepair(source){
 const tiles=source?.map?.tiles,records=source?.v34b?.settlements;
 if(!Array.isArray(tiles)||!Array.isArray(records)||source.v34b.schemaVersion!==2)return{data:source,repairs:[]};
 // IMPORTANT: H1/H2 saved-world import runs through V034B strict registry
 // validation before bootstrap post-load hooks. Repair serialized orphan links
 // here only when the original owner was already null and the linked ACTIVE
 // record itself lists the same tile. Never change a physical stock or owner.
 const byId=new Map(records.filter(r=>r?.lifecycle==='ACTIVE').map(r=>[String(r.id),r]));
 const candidates=[];
 for(const t of tiles){if(owned(t.ownerId)||!owned(t.settlementId))continue;
  const r=byId.get(String(t.settlementId));
  if(r?.tileIds?.some(id=>Number(id)===Number(t.id)))candidates.push([Number(t.id),String(r.id)]);
 }
 if(!candidates.length)return{data:source,repairs:[]};
 const data={...source,map:{...source.map,tiles:tiles.slice()},v34b:{...source.v34b,settlements:records.slice()}},idx=new Map(),repaired=[];
 const tileById=new Map(tiles.map(t=>[Number(t.id),t]));
 for(const [id,sid] of candidates){
  const j=records.findIndex(r=>String(r.id)===sid);if(j<0)continue;
  if(!idx.has(j)){data.v34b.settlements[j]={...records[j],tileIds:[...records[j].tileIds]};idx.set(j,true);}
  const r=data.v34b.settlements[j],tIndex=tiles.findIndex(t=>Number(t.id)===id);if(tIndex<0)continue;
  const t=tiles[tIndex];if(owned(t.ownerId)||!same(t.settlementId,sid))continue;
  data.map.tiles[tIndex]={...t,settlementId:null};
  r.tileIds=r.tileIds.filter(x=>Number(x)!==id);
  if(!r.tileIds.length){r.lifecycle='ABANDONED';r.abandonedCalendarDay=Number(source?.calendarOrdinalDay24??source?.day??0);}
  else if(!r.tileIds.includes(Number(r.coreTileId))){r.coreTileId=Math.min(...r.tileIds);}
  repaired.push({tileId:id,settlementId:sid,action:r.tileIds.length?'DETACH_AND_REBASE':'DETACH_AND_RETIRE'});
 }
 return{data,repairs:repaired};
}
NS.World.prototype.serialize=function(...args){const data=oldSerialize.apply(this,args);data.version=VERSION;data.v034h2a={revision:'settlement-core-abandonment-hotfix',savedLegacyGhostRepairs:this._h2aRepairedGhosts||[]};return data;};
NS.World.from=function(data,...args){const candidate=String(data?.version||'');const incoming=candidate===VERSION?{...data,version:PREV}:data;
 const {data:prepared,repairs}=targetedRepair(incoming),w=oldFrom.call(this,prepared,...args);
 const existing=Array.isArray(data?.v034h2a?.savedLegacyGhostRepairs)?data.v034h2a.savedLegacyGhostRepairs:[];
 if(repairs.length||existing.length){Object.defineProperty(w,'_h2aRepairedGhosts',{configurable:true,enumerable:false,writable:true,value:[...existing,...repairs]});}
 return w;
};
NS.Telemetry.prototype.toJSON=function(...args){const result=oldJSON.apply(this,args);result.version=VERSION;
 result.worldSummary.v034h2aRevision='settlement-core-abandonment-hotfix';
 result.worldSummary.v034h2aLegacyGhostRepairs=args[0]?._h2aRepairedGhosts?.length||0;
 return result;
};
const dl=(name,text,mime='application/json')=>{const url=URL.createObjectURL(new Blob([text],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},
 load(){const raw=localStorage.getItem(KEY);return raw?NS.World.from(JSON.parse(raw)):oldSave.load?.();},
 export(w){dl(`village-observer-v034H2A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v034H2A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));}
};
NS.RELEASE_VERSION=VERSION;
const refresh=()=>{const b=document.getElementById('versionBadge');if(b){b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';b.setAttribute('data-runtime-version',VERSION);}document.title='Village Observer '+VERSION;};
if(NS.UI){const before=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const result=before.apply(this,args);refresh();return result;};}
NS.V034H2A=Object.freeze({version:VERSION,repairImport:targetedRepair,verify:()=>NS.V034G5.verify(window.villageObserver?.world)});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-19',title:'정착지 중심타일 포기/재연결 핫픽스',summary:'정착지 핵심 타일 포기 뒤 이전 중심점이 다시 중립지에 연결되는 문제를 수정합니다. 기존 H2 세이브의 특정 고아 연결은 물리 재고·Gold 변경 없이 불러올 때 복구합니다.',sections:[['정착지 등록부',['타일 소유권 해제 때 생존 정착지의 중심점을 즉시 재선정합니다.','이후 분기 분할 검사에서 포기된 옛 중심지가 재생성되지 않도록 합니다.']],['세이브 복구',['H2 저장파일 중 중립 타일에 ACTIVE Settlement 링크가 남은 명백한 고아 연결만 검사 후 제거합니다.','원래 타일 소유권과 물리 재고·국고·시장·주민은 변경하지 않습니다.']],['범위',['G5 43개 기술과 H1 지도·H2 국가 UI를 그대로 유지합니다.','별도 석재 저장 용량 경고 및 AI·밸런스는 수정하지 않습니다.']]]});
try{refresh();}catch(e){console.warn('H2A status',e);}
})(window.VSim);
