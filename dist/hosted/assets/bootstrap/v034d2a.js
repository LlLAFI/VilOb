/* Village Observer V0.34D2A · Housing Capacity & Shared Living Consistency.
 * Read-only capacity, shared Person housing strain and birth occupancy, actual
 * settlement-safe construction diagnostics. Does not pool physical goods.
 */
(function(NS){'use strict';
const VERSION='V0.34D2A',PREVIOUS='V0.34D2',KEY='village-observer-v034d2a';
const N=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b);
const counters={cacheHits:0,cacheMisses:0,houseReviewCalls:0,houseAttempts:0,houseStarts:0,houseRejected:0,houseSuppressed:0,legacyHousingPulseDelegations:0};
const cached=new WeakMap(),recentAttempts=new WeakMap();
function capAt(t){if(!t)return 0;let sum=0;for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i],cap=N(NS.BUILDINGS?.[b]?.capacity);if(cap<=0)continue;const condition=N(t.buildingCondition?.[i]??100);sum+=cap*(condition>=70?1:Math.max(0,Math.min(1,condition/70)));}return sum;}
// Legacy V0.10's *active* capacity is a different metric from effective capacity.
function activeCapAt(t){if(!t)return 0;let sum=0;for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i],cap=N(NS.BUILDINGS?.[b]?.capacity);if(cap<=0)continue;const threshold=['town_hall','house','outpost'].includes(b)?15:N(NS.V09?.activeCondition||35);if(N(t.buildingCondition?.[i]??100)>=threshold)sum+=cap;}return sum;}
function housingFingerprint(w,s){let key='';for(const tid of s.tileIds){const t=w.map.get(Number(tid));if(!t){key+='!'+tid;continue;}key+='|'+tid+'/'+String(t.ownerId)+'/'+String(t.settlementId)+'/'+(t.buildings||[]).join('.')+'/'+(t.buildingCondition||[]).map(x=>N(x).toFixed(5)).join('.');}return key;}
// V0.26 hooks homeTileId and alive to _v26ResidentEpoch. A length check also catches births.
// Real structure changes are detected even on the same day, without persisting caches.
function cachedHousing(v,w,tid,compute){const s=NS.V034D2.record(w,tid);if(!s)return null;
 const day=N(w.calendarOrdinalDay?.()??w.ordinalDay?.()),epoch=N(v._v26ResidentEpoch),length=v.residents?.length||0,signature=housingFingerprint(w,s),token=`${day}:${epoch}:${length}:${s.tileIds.join('.')}:${signature}`;
 let byId=cached.get(w);if(!byId){byId=new Map();cached.set(w,byId);}
 const k=String(v.id)+':'+String(s.id),entry=byId.get(k);
 if(entry?.token===token){counters.cacheHits++;return entry.h;}
 counters.cacheMisses++;
 const base=compute();if(!base)return null;
 let active=0;for(const id of s.tileIds)active+=activeCapAt(w.map.get(Number(id)));
 const h={...base,activeCapacity:active,activeShortage:Math.max(0,base.population-active),activeOccupancy:base.population/Math.max(.1,active)};
 if(byId.size>256)byId.clear();byId.set(k,{token,h});return h;
}
function housingAt(v,w,tid){return NS.V034D2.housingAt(v,w,tid);}
function independentPhysicalCap(t){let sum=0;for(const [i,type] of (t?.buildings||[]).entries()){const def=NS.BUILDINGS?.[type];if(!(Number(def?.capacity)>0))continue;const condition=t.buildingCondition?.[i]??100;sum+=Number(def.capacity)*Math.min(1,Math.max(0,Number(condition)/70));}return sum;}
function audit(w){const errors=[],rows=NS.V034D2.contextAll(w),canonical=NS.V034D1.all(w),reference=new Map(canonical.map(r=>[String(r.settlementId),r]));let physicalCapacity=0,activeCapacity=0;
 for(const h of rows){const r=reference.get(String(h.settlementId));if(!r){errors.push('MISSING_D1:'+h.settlementId);continue;}
  const physical=h.tileIds.reduce((n,id)=>n+independentPhysicalCap(w.map.get(Number(id))),0);
  const localActive=h.tileIds.reduce((n,id)=>n+activeCapAt(w.map.get(Number(id))),0);
  physicalCapacity+=physical;activeCapacity+=localActive;
  if(Math.abs(physical-h.capacity)>1e-7)errors.push('PHYSICAL_CAP:'+h.settlementId+':'+physical+':'+h.capacity);
  if(Math.abs(r.housing.capacity-h.capacity)>1e-7)errors.push('D1_CROSS_CAP:'+h.settlementId+':'+r.housing.capacity+':'+h.capacity);
  const v=w.villages.find(v=>eq(v.id,h.nationId)),byHome=h.tileIds.reduce((n,id)=>n+(v?.tileResidents(Number(id))||[]).filter(p=>p.alive!==false).length,0);
  if(byHome!==h.population)errors.push('PERSON_HOME:'+h.settlementId);
  const actual=housingAt(v,w,h.tileIds[0]);if(Math.abs(N(actual?.activeCapacity)-localActive)>1e-7)errors.push('ACTIVE_CAP:'+h.settlementId);
 }
 const d2=NS.V034D2.audit(w);if(!d2.ok)errors.push(...d2.errors.map(x=>'D2:'+x));
 return {ok:errors.length===0,errors,settlements:rows.length,people:rows.reduce((a,h)=>a+h.population,0),capacity:rows.reduce((a,h)=>a+h.capacity,0),physicalCapacity,activeCapacity,capacityMismatchCount:errors.filter(x=>x.includes('CAP')).length,cacheHits:counters.cacheHits,cacheMisses:counters.cacheMisses};
}
function refusal(v,w,h,phase){if(!h||h.population<=0)return'NO_HOUSING_NEED';if(h.shortage<1&&h.occupancy<1.12&&h.occupancy<.95)return'NO_HOUSING_NEED';
 const tiles=new Set(h.tileIds.map(Number)),housingTypes=new Set(['house','row_house','collective_house']);
 const pending=[...(v.constructionProjects||[]),...(v.buildingUpgradeProjects||[])].some(p=>tiles.has(Number(p.tileId??p.targetTileId))&&(N(NS.BUILDINGS?.[p.type]?.capacity)>0||N(NS.BUILDINGS?.[p.to]?.capacity)>0));
 if(pending)return'HOUSING_PENDING';if(NS.V034D2.freeSlots(v)<=0)return'PROJECT_CAP';
 const sites=h.tileRows.filter(r=>r.t&&eq(r.t.ownerId,v.id));if(!sites.length)return'NO_SITE';
 const ready=sites.some(r=>!([...v.constructionProjects||[],...v.landDevelopmentProjects||[],...v.buildingUpgradeProjects||[]].some(p=>Number(p.tileId??p.targetTileId)===r.id))&&(N(NS.V017?.remainingSpace?.(v,r.t))>=N(NS.V017?.buildingFootprint?.('house')||1)));
 if(!ready){const development=sites.some(r=>N(NS.V017?.accessiblePotential?.(v,r.t))>N(r.t.developedBuildSpace)+.05);return development?'LAND_DEVELOPMENT_REQUIRED':'NO_SITE';}
 if(phase==='PRECHECK')return'SITE_READY_UNVERIFIED';
 const cost=NS.V08?.effectiveCost?.(v,'house');
 if(cost&&(N(v.wood)+1e-7<N(cost.wood)||N(v.stone)+1e-7<N(cost.stone)))return'MATERIAL_OR_ROUTE';
 if(cost&&N(v.gold)+N((v.territory||[]).size)*0<N(cost.gold))return'GOLD_OR_RESERVE';
 if((v.residents||[]).filter(p=>p.alive!==false&&p.age>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active').length===0)return'LABOR';
 return'START_REJECTED_OTHER';
}
function blocker(v,w,q){if(!q.bad?.length)return'NONE';const h=NS.V034D2.context(v,w).find(x=>x.population>0&&(x.shortage>=1||x.occupancy>=1.12));return h?refusal(v,w,h,'PRECHECK'):'NONE';}
// V0.28 housing pulse uses tile rows and historically can bypass E1's shared resolver.
function housingPulse(v,w){counters.legacyHousingPulseDelegations++;const stats=v.v28Stats||(v.v28Stats={migrationMoves:0,housingActions:0,foodMoves:0,foodMoved:0,foodBlocked:0,lastMigrationCalendar:-99999,lastHousingCalendar:-99999,lastFoodCalendar:-99999});const day=N(w.calendarOrdinalDay?.());if(day-N(stats.lastHousingCalendar)<30)return false;stats.lastHousingCalendar=day;
 const rows=NS.V034D2.context(v,w).filter(h=>h.population>0).sort((a,b)=>b.shortage-a.shortage||b.occupancy-a.occupancy);for(const h of rows){if(h.occupancy<.96&&h.shortage<=0)continue;const yes=NS.V034D2.resolveHousing(v,w,h.coreTileId,'V28_URBAN_SHARED',true);if(yes){stats.housingActions++;return true;}}return false;
}
// Record precisely that a physical construction was attempted and rejected, without dry-run expenditures.
// Intercept only settlement-directed housing starts; physical payment and RNG remain original.
const previousConstruction=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason,...rest){const housing=type==='house'&&String(reason).includes('SETTLEMENT');const h=housing?housingAt(this,w,tileId):null;if(housing)counters.houseAttempts++;
 const outcome=previousConstruction.call(this,w,tileId,type,reason,...rest);
 if(housing){if(outcome)counters.houseStarts++;else counters.houseRejected++;let map=recentAttempts.get(w);if(!map){map=new Map();recentAttempts.set(w,map);}map.set(String(h?.settlementId||tileId),{calendarDay:N(w.calendarOrdinalDay?.()),result:outcome?'STARTED':refusal(this,w,NS.V034D2.context(this,w).find(x=>eq(x.settlementId,h?.settlementId)),'AFTER_REJECTION'),tileId,reason});}
 return outcome;
};
// Record housing upgrade / land development outcomes through their real entrypoints.
for(const [method,label] of [['startHousingUpgrade','UPGRADE'],['startLandDevelopment','LAND']]){
 const original=NS.Village.prototype[method];if(typeof original!=='function')continue;
 NS.Village.prototype[method]=function(w,tid,...args){const reason=String(args[method==='startHousingUpgrade'?1:0]||'');
  const track=reason.includes('SETTLEMENT')&&(reason.includes('HOUSING')||reason.includes('D2')||reason.includes('V28_URBAN'));
  const h=track?housingAt(this,w,tid):null;const ok=original.call(this,w,tid,...args);
  if(track){counters.houseAttempts++;if(ok)counters.houseStarts++;else counters.houseRejected++;
   let map=recentAttempts.get(w);if(!map){map=new Map();recentAttempts.set(w,map);}
   map.set(String(h?.settlementId||tid),{calendarDay:N(w.calendarOrdinalDay?.()),result:ok?label+'_STARTED':label+'_REJECTED',tileId:tid,reason});}
  return ok;};
}
function attempts(w){return [...(recentAttempts.get(w)?.entries()||[])].map(([settlementId,v])=>({settlementId,...v}));}
// The existing D2 blocker is now a conservative precheck, never promises that construction succeeds.
// Delegated at the call site to avoid shadowing D2's retained references.
const d2Meta=NS.V034D2;
// Save rules deliberately remain current-version-only.
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=oldSerialize.call(this);x.version=VERSION;x.v034d2a={revision:'capacity-person-shared-audit-v1',canonicalHousing:true,personStrainShared:true};return x;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error('V0.34D2A 저장 파일만 지원합니다.');return oldFrom({...data,version:PREVIOUS});};
function download(name,body,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const x=localStorage.getItem(KEY);return x?NS.World.from(JSON.parse(x)):null;},
 export(w){download(`village-observer-v034D2A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D2A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D2A-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D2A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const a=audit(w);if(!a.ok)throw Error('D2A 주거 감사 실패: '+a.errors.join('|'));download(`village-observer-v034D2A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){const a=audit(w);if(!a.ok)throw Error('D2A 주거 감사 실패: '+a.errors.join('|'));download(`village-observer-v034D2A-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));}
};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d2aRevision='housing-capacity-shared-person-consistency-hotfix';d.worldSummary.v034d2aAudit=audit(w);d.worldSummary.v034d2aDiagnostics={...counters,recentHousingAttempts:attempts(w)};}return d;};
if(NS.UI){const prevTile=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const out=prevTile.apply(this,args);const root=this.q?.('tileInspector'),box=root?.querySelector?.('.v034d2-housing');if(box&&box.innerHTML.includes('D2 통합 생활권'))box.innerHTML=box.innerHTML.replace('D2 통합 생활권','D2A 통합 생활권');return out;};}
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const out=prev.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementHousingD2Btn');if(btn)btn.title='D2A 검증된 Settlement 공동 주거 CSV 11열';}return out;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Housing Capacity & Shared Living Consistency Hotfix',summary:'회관·전초기지 및 개별 건물 상태를 반영한 공동 주거 계산을 복구하고, 일일 주거 스트레스·인구 변천 판단과 감사 기준을 통일합니다.',sections:[['주거 수용량',['양의 capacity를 가진 모든 건물을 주거에 포함합니다(회관·전초기지 포함).','건물별 상태를 개별 계산해 같은 종류의 정상 건물이 비활성 건물의 주거 수용량을 살리지 않도록 수정합니다.','D1A CSV·D2 Housing CSV·건물별 독립 계산을 교차 감사합니다.']],['Settlement 생활권',['일일 주거 스트레스, 이주 매력도, 연간 출생·질병 판단의 주거 점유율을 Settlement 공동 기준으로 통일합니다.','주거 계산은 일일 Person·구조 무효화 기반 캐시를 사용하며 실제 homeTileId와 군사·건물 위치는 유지합니다.']],['진단 및 안전',['선행 READY는 실제 건축 성공을 보장하지 않으므로 SITE_READY_UNVERIFIED로 구분합니다.','주거 목적 신축 시도의 성공·거절을 원인별로 기록하되 감사·진단은 자원이나 난수를 소비하지 않습니다.','건설 슬롯 3~11, 물류와 자원·Gold·전쟁 규칙은 유지합니다.']]]});
NS.V034D2A=Object.freeze({version:VERSION,capAt,activeCapAt,cachedHousing,housingAt,audit,blocker,housingPulse,attempts,counters});
if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D2A header',e);}
})(window.VSim);
