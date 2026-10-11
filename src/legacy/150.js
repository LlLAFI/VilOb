
/* V0.33I3C-HF2 — only extinction inventory and instant command-vacancy lifecycle. */
(function(NS){
'use strict';
const VERSION='V0.33I3C-HF2',DATE='2026-10-09';
const ITEMS=NS.V033I1?.equipmentRegistry||{};
const tracked=(id)=>id!=='improvised_club'&&!!ITEMS[id];
const qty=n=>Math.max(0,Math.floor(Number(n)||0));
const idkey=id=>String(Number(id));
const state=(v)=>NS.V033I1.ensureNation(v);
const sourceStats=v=>state(v).stats;
const statsKeys=['ruinHeldByItem','ruinTransferredOutByItem','ruinAcquiredByItem'];
function initStats(v){const s=sourceStats(v);for(const k of statsKeys){s[k]=s[k]&&typeof s[k]==='object'?s[k]:{};for(const id of Object.keys(ITEMS))if(tracked(id))s[k][id]=qty(s[k][id]);}return s;}
function add(stat,id,n){if(!tracked(id)||!n)return;stat[id]=qty(stat[id])+n;}
function sub(stat,id,n){if(!tracked(id)||!n)return;stat[id]=Math.max(0,qty(stat[id])-n);}
function cacheIndex(w){if(!(w._v33i3ch2RuinIds instanceof Set))w._v33i3ch2RuinIds=new Set((w.map?.tiles||[]).filter(t=>Array.isArray(t.ruinEquipment33I3CH2)&&t.ruinEquipment33I3CH2.length).map(t=>t.id));return w._v33i3ch2RuinIds;}
function hold(t,nationId,items){if(!t)return 0;const lots=t.ruinEquipment33I3CH2||(t.ruinEquipment33I3CH2=[]);let row=lots.find(x=>Number(x.nationId)===Number(nationId));if(!row){row={nationId:Number(nationId),items:{}};lots.push(row);}let sum=0;for(const[id,n0]of Object.entries(items||{})){const n=qty(n0);if(!tracked(id)||!n)continue;add(row.items,id,n);sum+=n;}return sum;}
function summaryItems(items){return Object.entries(items).filter(([id,n])=>tracked(id)&&qty(n)>0).map(([id,n])=>`${id}:${qty(n)}`).join('|');}
function record(w,code,payload){w.telemetry?.record?.(code,w,payload);}
function fallbackTile(v,w){const b=v.v30b2||{};const id=Number(b.lastLivingTileId);if(Number.isInteger(id)&&w.map.get(id))return id;return Number(v.coreTileId);}
function archive(v,w){
 if(!v||v.status!=='active')return 0;
 const s=state(v),st=initStats(v),fallback=fallbackTile(v,w),groups=new Map(),itemTotals={},pending=w.v33i1a1EquipmentRecovery;
 const group=(tileId,id,n0)=>{const n=qty(n0),tile=w.map.get(Number(tileId))||w.map.get(fallback);if(!tracked(id)||!n||!tile)return;const key=tile.id,items=groups.get(key)||{};add(items,id,n);groups.set(key,items);add(itemTotals,id,n);add(st.ruinHeldByItem,id,n);};
 // Existing physical inventories, including remote supply depots, become physical caches on their original tiles.
 for(const [k,items] of Object.entries(s.inventories||{})){const t=w.map.get(Number(k)),dest=t?Number(k):fallback;for(const[id,n]of Object.entries(items||{}))group(dest,id,n);}s.inventories={};
 // Remaining equipment carried by an already-deceased Person is not allowed to vanish when the nation is removed.
 for(const p of v.residents||[]){const eq=p.militaryEquipment33I1;if(!eq)continue;const loc=Number.isInteger(Number(p.homeTileId))?Number(p.homeTileId):fallback;for(const slot of ['weaponId','armorId']){if(eq[slot]){group(loc,eq[slot],1);eq[slot]=null;}}}
 // Recovered battlefield items may be attached to a now-defunct Formation. Keep their material identity.
 const z=pending;if(z){for(const [k,c]of Object.entries(z.caches||{})){if(Number(c.nationId)!==Number(v.id))continue;const f=(NS.V033D?.ensureFormations?.(v,w)||[]).find(x=>String(x.id)===String(c.formationId));const tile=w.map.get(Number(f?.tileId))?.id??fallback;for(const[id,n]of Object.entries(c.items||{}))group(tile,id,n);delete z.caches[k];}
  const keep=[];for(const rec of z.pending||[]){if(Number(rec.nationId)===Number(v.id))group(rec.tileId,rec.itemId,1);else keep.push(rec);}z.pending=keep;
 }
 // Unfinished work orders are not completed equipment; release reserved real materials before losing the territory.
 for(const o of s.workOrders||[]){for(const[k,n]of Object.entries(o.reserved||{})){if(Number(n)>0)v.depositAt?.(Number(o.tileId),k,Number(n));}st.ordersCancelled=Number(st.ordersCancelled||0)+1;}
 s.workOrders=[];
 let total=0;for(const [tileId,items] of groups){const tile=w.map.get(tileId),n=hold(tile,v.id,items);total+=n;if(n){cacheIndex(w).add(tileId);record(w,'MILITARY_EQUIPMENT_RUIN_STASHED33I3CH2',{village:v.name,villageId:v.id,tileId,items,n,composition:summaryItems(items)});}}
 if(total)record(w,'MILITARY_EQUIPMENT_EXTINCTION_SETTLED33I3CH2',{village:v.name,villageId:v.id,total,sites:groups.size,items:itemTotals,keptPhysically:true,officialBattleLossAdded:0});
 return total;
}
const abandonPrev=NS.World.prototype.abandonVillage;
NS.World.prototype.abandonVillage=function(v,...args){if(v?.status==='active')archive(v,this);return abandonPrev.call(this,v,...args);};
function recoverClaimed(w){
 let got=0;
 for(const tileId of [...cacheIndex(w)]){const t=w.map?.get?.(tileId),lots=t?.ruinEquipment33I3CH2;if(!Array.isArray(lots)||!lots.length){cacheIndex(w).delete(tileId);continue;}if(t.ownerId==null)continue;
  const receiver=(w.villages||[]).find(v=>Number(v.id)===Number(t.ownerId)&&v.status==='active'&&v.territory?.has(t.id));if(!receiver)continue;
  const recvState=state(receiver),recvStats=initStats(receiver),remaining=[];
  for(const lot of lots){const origin=(w.villages||[]).find(v=>Number(v.id)===Number(lot.nationId));if(!origin){remaining.push(lot);continue;}const srcStats=initStats(origin);let count=0;
   for(const [itemId,n0] of Object.entries(lot.items||{})){
    const n=qty(n0);if(!tracked(itemId)||!n)continue;
    // Transfer provenance, never manufacture items. Inventory may exceed supply capacity like other forced returns.
    const candidates=[...receiver.territory].filter(x=>NS.V033I1.capacityAt(receiver,w,x)>0);candidates.sort((a,b)=>w.map.distance(Number(a),t.id)-w.map.distance(Number(b),t.id));const supplyTile=candidates[0]??t.id;const inv=recvState.inventories[idkey(supplyTile)]||(recvState.inventories[idkey(supplyTile)]={});add(inv,itemId,n);
    sub(srcStats.ruinHeldByItem,itemId,n);add(srcStats.ruinTransferredOutByItem,itemId,n);add(recvStats.ruinAcquiredByItem,itemId,n);count+=n;
   }
   if(count){got+=count;record(w,'MILITARY_EQUIPMENT_RUIN_RECOVERED33I3CH2',{tileId:t.id,sourceNation:origin.name,sourceNationId:origin.id,recoveringNation:receiver.name,recoveringNationId:receiver.id,items:lot.items,total:count,physicalRecovery:true});}
  }
  if(remaining.length)t.ruinEquipment33I3CH2=remaining;else{delete t.ruinEquipment33I3CH2;cacheIndex(w).delete(t.id);}
 }
 return got;
}
// Converts inventory belonging to already-extinct nations on import of older I3C saves.
function migrateOldRuins(w){let total=0;for(const v of w.villages||[]){initStats(v);if(v.status!=='extinct')continue;const s=state(v),st=initStats(v),fallback=fallbackTile(v,w);let n=0;
 for(const[k,items]of Object.entries(s.inventories||{}))for(const[id,q]of Object.entries(items||{}))if(tracked(id)&&qty(q)){
  const tile=w.map.get(Number(k))||w.map.get(fallback);if(tile){hold(tile,v.id,{[id]:q});add(st.ruinHeldByItem,id,qty(q));n+=qty(q);}
 }
 s.inventories={};
 const z=w.v33i1a1EquipmentRecovery;if(z){for(const [key,c] of Object.entries(z.caches||{})){if(Number(c.nationId)!==Number(v.id))continue;const t=w.map.get(fallback);if(t){hold(t,v.id,c.items);for(const[id,q]of Object.entries(c.items||{}))if(tracked(id)){add(st.ruinHeldByItem,id,qty(q));n+=qty(q);}}delete z.caches[key];}
 const pending=[];for(const rec of z.pending||[]){if(Number(rec.nationId)!==Number(v.id)){pending.push(rec);continue;}const t=w.map.get(Number(rec.tileId))||w.map.get(fallback);if(t&&tracked(rec.itemId)){hold(t,v.id,{[rec.itemId]:1});add(st.ruinHeldByItem,rec.itemId,1);n++;}}z.pending=pending;}
 for(const p of v.residents||[]){const eq=p.militaryEquipment33I1;if(!eq)continue;const tile=w.map.get(Number(p.homeTileId))||w.map.get(fallback);if(tile)for(const slot of ['weaponId','armorId'])if(tracked(eq[slot])){hold(tile,v.id,{[eq[slot]]:1});add(st.ruinHeldByItem,eq[slot],1);n++;eq[slot]=null;}}
 s.workOrders=[];
 if(n){total+=n;record(w,'MILITARY_EQUIPMENT_EXTINCT_SAVE_MIGRATED33I3CH2',{village:v.name,villageId:v.id,total:n,mode:'EXISTING_PHYSICAL_STOCK_ONLY'});}
 }
 return total;
}
const fromPrev=NS.World.from;
NS.World.from=function(d){const src=d?.version===VERSION?{...d,version:'0.33I3C'}:d;const w=fromPrev(src);migrateOldRuins(w);recoverClaimed(w);return w;};
// Commander casualty reaction is after the casualty event has mutated Person status, before the next combat stage.
const events=new Set(['WAR_WOUNDED33','WAR_DEATH33','OCCUPATION_ATTRITION_DEATH33E5','OCCUPATION_ATTRITION_WOUNDED33E5','DEATH_STARVATION','DEATH_ILLNESS','DEATH_OLD_AGE','DEATH_EXPANSION']);
function immediateLoss(w,code,payload){const personId=payload?.personId;if(personId==null&&!payload?.person)return 0;const villageId=payload?.villageId;const vs=villageId!=null?(w.villages||[]).filter(v=>Number(v.id)===Number(villageId)):(w.villages||[]).filter(v=>v.name===payload?.village);let n=0;
 for(const v of vs){const fs=NS.V033D?.ensureFormations?.(v,w)||[],person=(v.residents||[]).find(p=>personId!=null?String(p.id)===String(personId):String(p.name)===String(payload.person)&&(!p.alive||p.militaryStatus32A!=='active')&&fs.some(f=>String(f.commanderPersonId??'')===String(p.id)));if(!person||person.alive&&person.militaryStatus32A==='active')continue;const casualtyId=String(person.id);
  for(const f of fs){if(String(f.commanderPersonId??'')!==casualtyId)continue;const st=NS.V033E1.ensureState(w).stats;st.commanderLosses=Number(st.commanderLosses||0)+1;f.commanderPersonId=null;f.commanderScoreAtAppointment=null;const now=Number(w.calendarOrdinalDay?.()??0);f.v33e1CommanderVacantUntilCal=Math.max(Number(f.v33e1CommanderVacantUntilCal||0),now+30);const reason=!person.alive||person.militaryStatus32A==='dead'?'DEAD':'WOUNDED';record(w,'FORMATION_COMMANDER_LOST33E1',{village:v.name,villageId:v.id,formationId:f.id,person:person.name,personId:casualtyId,reason,immediate33I3CH2:true,sourceEvent:code});n++;
  }
 }
 return n;
}
const recordPrev=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload,...rest){const r=recordPrev.call(this,type,w,payload,...rest);if(w&&events.has(type))immediateLoss(w,type,payload);return r;};
const dayPrev=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const r=dayPrev.apply(this,args);recoverClaimed(this);return r;};
const serializePrev=NS.World.prototype.serialize;
NS.World.prototype.serialize=function(){const d=serializePrev.call(this);d.version=VERSION;d.v33i3ch2={revision:'ruin-equipment-and-immediate-commander-lifecycle',ruinEquipment:1,commandLossOnCasualty:1};return d;};
const jsonPrev=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonPrev.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{},{v33I3CH2Revision:'ruin-equipment-and-immediate-commander-lifecycle',equipmentExtinction33I3CH2:'Physical equipment stock, field recovery cache and pending battle gear are archived on actual tiles when a nation becomes extinct; provenance remains conserved.',equipmentRuinRecovery33I3CH2:'Actual reclaiming nation receives physical items and matched cross-nation ledger transfer, including for imported old saves.',commanderLossImmediate33I3CH2:'A Person combat death/wound immediately invalidates commander assignment and emits the loss event on the casualty date; 30 calendar-day vacancy guard is preserved.',foodRecoveryUnchanged33I3CH2:true,combatFormulaUnchanged33I3CH2:true});return d;};
const snapPrev=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=snapPrev.call(this,w,...args);if(!s)return s;let ruin=0,archived=0,reclaimed=0;for(const v of w.villages||[]){const st=initStats(v);archived+=Object.values(st.ruinHeldByItem).reduce((n,q)=>n+qty(q),0);reclaimed+=Object.values(st.ruinTransferredOutByItem).reduce((n,q)=>n+qty(q),0);}
 for(const t of w.map?.tiles||[])for(const lot of t.ruinEquipment33I3CH2||[])for(const n of Object.values(lot.items||{}))ruin+=qty(n);
 s.global.equipmentRuinItems33I3CH2=ruin;s.global.equipmentRuinLedgerHeld33I3CH2=archived;s.global.equipmentRuinRecovered33I3CH2=reclaimed;s.global.equipmentRuinLedgerMismatch33I3CH2=Math.abs(ruin-archived);
 for(const r of s.villages||[]){const v=(w.villages||[]).find(x=>Number(x.id)===Number(r.id));if(!v)continue;const st=initStats(v);r.equipmentRuinHeld33I3CH2=Object.values(st.ruinHeldByItem).reduce((n,q)=>n+qty(q),0);r.equipmentRuinTransferredOut33I3CH2=Object.values(st.ruinTransferredOutByItem).reduce((n,q)=>n+qty(q),0);r.equipmentRuinAcquired33I3CH2=Object.values(st.ruinAcquiredByItem).reduce((n,q)=>n+qty(q),0);}
 return s;};
const csvPrev=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csvPrev.call(this),lines=base.split('\n');if(!lines.length)return base;const G=['equipmentRuinItems33I3CH2','equipmentRuinLedgerHeld33I3CH2','equipmentRuinRecovered33I3CH2','equipmentRuinLedgerMismatch33I3CH2'],R=['equipmentRuinHeld33I3CH2','equipmentRuinTransferredOut33I3CH2','equipmentRuinAcquired33I3CH2'],q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+[...G,...R].map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const r of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+[...G.map(k=>s.global?.[k]),...R.map(k=>r[k])].map(q).join(',');}return lines.join('\n');};
// Version badge and export filenames only; all combat and normal economic logic is inherited.
const oldSave=NS.SaveSystem;
function dl(name,text,mime='application/json'){const blob=new Blob([text],{type:mime}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
NS.SaveSystem={...oldSave,save(w){localStorage.setItem('village-observer-v0-33i3ch2',JSON.stringify(w.serialize()));},load(){const raw=localStorage.getItem('village-observer-v0-33i3ch2');return raw?NS.World.from(JSON.parse(raw)):oldSave.load?.();},export(w){dl(`village-observer-v033I3C-HF2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v033I3C-HF2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('HF2 CSV schema mismatch '+JSON.stringify(test.bad.slice(0,5)));dl(`village-observer-v033I3C-HF2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const st=this.q?.('runtimeStatus');if(st)st.textContent='✓ '+VERSION+' · 폐허 장비 / 지휘관 사건 시점';return r;};const oldTile=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const r=oldTile.apply(this,args);const t=this.world?.map?.get(this.world?.selectedTileId),root=this.q?.('tileInspector');if(!t||!root)return r;root.querySelectorAll('.v33i3ch2-ruin').forEach(x=>x.remove());const lots=t.ruinEquipment33I3CH2||[],parts=lots.map(x=>summaryItems(x.items)).filter(Boolean);if(parts.length){const el=document.createElement('div');el.className='v33i3ch2-ruin small';el.textContent='📦 폐허 장비 잔존 · '+parts.join(' / ');root.appendChild(el);}return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:DATE,title:'Ruin Equipment + Immediate Commander Loss Hotfix',summary:'멸망국의 실물 군사장비를 실제 타일의 폐허 재고로 이전하고, 재영유 시 보존적으로 정산합니다. 지휘관의 전사·부상은 해당 전투일에 즉시 상실 기록을 남깁니다. 식량·Recovery·전투 수식은 변경하지 않습니다.',sections:[['멸망국 장비',['국가 멸망 시 창고·Person 잔여장비·Formation 회수 캐시·미정산 장비를 원래 위치 또는 마지막 거주 타일에 기록합니다.','폐허 잔존품은 원장에 별도 항목으로 남으며 전투 유실이나 legacy 결손으로 위장하지 않습니다.','타국이 타일을 영유하면 현물 재고와 두 국가의 출처 원장을 함께 정산합니다.']],['지휘관 이벤트',['WAR_DEATH/WAR_WOUNDED 등 사상자 처리 직후 해당 지휘관 배속을 즉시 해제합니다.','FORMATION_COMMANDER_LOST33E1은 사상일에 1회 기록하며 기존 30일 공석 대기를 보존합니다.']],['범위',['식량·생존·Recovery 로직과 I3C 전투력·사상자율·장비 회수 확률을 변경하지 않습니다.']]]});
NS.V033I3CH2={version:VERSION,archive,initStats,recoverClaimed,migrateOldRuins,immediateLoss};
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('HF2 header',e);}
})(window.VSim);
