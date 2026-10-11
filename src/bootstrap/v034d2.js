/* Village Observer V0.34D2 · Unified civilian Settlement + construction slots.
 * Military Formation mobility and the exact physical tile for every building remain unchanged.
 * D3 will separately convert the goods/market logistics layer.
 */
(function(NS){'use strict';
const VERSION='V0.34D2',PREVIOUS='V0.34D1A',KEY='village-observer-v034d2';
const N=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b);
const housingTypes=new Set(['house','row_house','collective_house']);
const statuses={policy:'one-day civilian Settlement; physical buildings and military remain tile-based',construction:'unified national project slots'};
function projectCap(v){let cap=3;const pop=N(v?.population?.());if(pop>=25)cap++;if(pop>=60)cap++;if(v?.hasTech?.('ADMINISTRATION'))cap+=2;if(v?.hasTech?.('ENGINEERING'))cap+=2;if(v?.hasTech?.('URBANIZATION'))cap+=2;return Math.min(11,cap);}
function projectCount(v){return (v?.constructionProjects||[]).filter(p=>!p?.v17Marker).length+(v?.landDevelopmentProjects||[]).length+(v?.buildingUpgradeProjects||[]).length+(v?.specializationProjects||[]).length;}
function freeSlots(v){return Math.max(0,projectCap(v)-projectCount(v));}
function records(w){return(w?.v34b?.settlements||[]).filter(r=>r?.lifecycle==='ACTIVE'&&Array.isArray(r.tileIds)&&r.tileIds.length);}
// Tile carries canonical Settlement ID. Registry lookup is O(1), and automatically
// reflects same-day merges, splits, and conquest without keeping a stale member cache.
function record(w,tid){if(tid===null||tid===undefined)return null;const t=w?.map?.get?.(Number(tid));if(!t||t.ownerId==null||t.settlementId==null)return null;const sid=String(t.settlementId);const r=w?._v34bActive?.get?.(sid)||records(w).find(x=>eq(x.id,sid));if(!r||r.lifecycle!=='ACTIVE'||!r.tileIds?.some(x=>Number(x)===Number(tid))||!eq(r.nationId,t.ownerId))return null;return r;}
function sameSettlement(w,a,b,nid=null){if(a==null||b==null)return false;const x=record(w,a),y=record(w,b);return!!x&&!!y&&eq(x.id,y.id)&&(nid==null||eq(x.nationId,nid));}
function capAt(t){if(!t)return 0;let cap=0;for(let i=0;i<(t.buildings||[]).length;i++){const building=t.buildings[i],capacity=N(NS.BUILDINGS?.[building]?.capacity);if(capacity<=0)continue;const condition=N(t.buildingCondition?.[i]??100);cap+=capacity*(condition>=70?1:Math.max(0,Math.min(1,condition/70)));}return cap;}
function housingAt(v,w,tid){if(NS.V034D2A?.cachedHousing)return NS.V034D2A.cachedHousing(v,w,tid,()=>housingAtUncached(v,w,tid));return housingAtUncached(v,w,tid);}
function housingAtUncached(v,w,tid){const s=record(w,tid);if(!s||!eq(s.nationId,v?.id))return null;let population=0,capacity=0,adults=0;const ids=new Set(s.tileIds.map(Number));
 // Residents are counted by actual homeTileId. They may draw on the whole local housing pool.
 for(const id of s.tileIds)for(const p of v.tileResidents?.(Number(id))||[]){if(p.alive===false||!ids.has(Number(p.homeTileId)))continue;population++;if(N(p.age)>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active')adults++;}
 for(const id of s.tileIds)capacity+=capAt(w.map.get(Number(id)));
 return {settlementId:s.id,nationId:v.id,tileIds:s.tileIds.slice(),coreTileId:s.coreTileId,population,capacity,adults,shortage:Math.max(0,population-capacity),vacancy:Math.max(0,capacity-population),occupancy:population/Math.max(.1,capacity)};}
function context(v,w){const result=[];if(!v||!w)return result;for(const s of records(w)){if(!eq(s.nationId,v.id))continue;const h=housingAt(v,w,s.tileIds[0]);if(!h)continue;const tileRows=s.tileIds.map(id=>{const t=w.map.get(Number(id));return {id:Number(id),t,cap:capAt(t),residents:(v.tileResidents?.(Number(id))||[]).filter(p=>p.alive!==false).length};});result.push({...h,tileRows});}return result;}
function housingRows(v,w){return context(v,w).map(h=>({id:Number(h.coreTileId),t:w.map.get(Number(h.coreTileId)),pop:h.population,cap:Math.max(.1,h.capacity),free:h.vacancy,occupancy:h.occupancy,housingShortage:h.shortage,urbanity:0,rank:'',foodDays:N(v.settlementReserveDays?.(h.coreTileId)),settlementId:h.settlementId,adults:h.adults,tileRows:h.tileRows})).filter(x=>x.t);}
function quickHousing(v,w){const rows=housingRows(v,w),bad=rows.filter(r=>r.pop>0&&(r.occupancy>=1.12||r.housingShortage>=1));const max=Math.max(0,...rows.filter(r=>r.pop>0).map(r=>r.occupancy)),short=rows.reduce((s,r)=>s+r.housingShortage,0);return {rows,bad,max,short,pressure:bad.length>0,active:max>=1.18||short>=3,severe:max>=1.35||short>=8};}
function pendingInSettlement(v,h){const tiles=new Set(h.tileIds.map(Number));return [...(v.constructionProjects||[]).filter(p=>!p?.v17Marker&&N(NS.BUILDINGS?.[p.type]?.capacity)>0),...(v.buildingUpgradeProjects||[]).filter(p=>housingTypes.has(p?.to))].some(p=>tiles.has(Number(p.tileId??p.targetTileId)));}
function tileBusy(v,id){return [...(v.constructionProjects||[]).filter(p=>!p?.v17Marker),...(v.landDevelopmentProjects||[]),...(v.buildingUpgradeProjects||[]),...(v.specializationProjects||[])].some(p=>Number(p.tileId??p.targetTileId)===Number(id));}
function siteOrder(v,w,h){return h.tileRows.filter(r=>r.t&&eq(r.t.ownerId,v.id)&&!tileBusy(v,r.id)).sort((a,b)=>{
 const ar=NS.V017?.remainingSpace?.(v,a.t)??0,br=NS.V017?.remainingSpace?.(v,b.t)??0;
 // Prioritize physically available sites; buildings are *not* virtualized.
 return N(br)-N(ar)||b.residents-a.residents||a.id-b.id;
 });}
function housingBlocker(v,w,q){if(NS.V034D2A?.blocker)return NS.V034D2A.blocker(v,w,q);if(!q.bad?.length)return'NONE';const h=context(v,w).find(x=>x.shortage>0||x.occupancy>=1.12);if(!h)return'NONE';if(pendingInSettlement(v,h))return'HOUSING_PROJECT_QUEUE';if(freeSlots(v)<=0)return'PROJECT_CAP';const sites=siteOrder(v,w,h);const foot=N(NS.V017?.buildingFootprint?.('house')||1);
 if(sites.some(r=>N(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-6>=foot))return 'READY_FOR_HOUSING';if(sites.some(r=>N(NS.V017?.accessiblePotential?.(v,r.t)??0)>N(r.t.developedBuildSpace)+.05))return'LAND_DEVELOPMENT';return'SPACE_CAP';}
const diag={housingReviews:0,housingActions:0,housingSuppressedBySharedVacancy:0,housingProjectQueueBlocks:0,constructionSlotBlocks:0,constructionStarts:0,upgradeStarts:0,landStarts:0};
function resolveHousing(v,w,sourceId,reason='HOUSING34D2',proactive=false){const h=context(v,w).find(x=>x.tileIds.some(id=>Number(id)===Number(sourceId)))||context(v,w).sort((a,b)=>b.shortage-a.shortage)[0];diag.housingReviews++;if(!h||!h.population)return false;
 const needs=h.shortage>=1||h.occupancy>=1.12||(proactive&&h.occupancy>=.95);
 if(!needs){if(h.tileRows.some(r=>r.residents>r.cap)&&h.vacancy>0)diag.housingSuppressedBySharedVacancy++;return false;}
 if(pendingInSettlement(v,h)){diag.housingProjectQueueBlocks++;return false;}if(!freeSlots(v)){diag.constructionSlotBlocks++;return false;}
 const sites=siteOrder(v,w,h);
 // D2 only builds when the Settlement as a whole needs housing. No Person is forcibly moved.
 for(const r of sites)for(let i=0;i<(r.t.buildings||[]).length;i++){const from=r.t.buildings[i],to=from==='house'&&v.hasTech?.('URBAN_PLANNING')?'row_house':from==='row_house'&&v.hasTech?.('URBANIZATION')?'collective_house':null;if(!to)continue;const extra=Math.max(0,N(NS.V017?.buildingFootprint?.(to)||1)-N(NS.V017?.buildingFootprint?.(from)||1));if(N(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-6<extra)continue;
 if(v.startHousingUpgrade?.(w,r.id,i,reason+'_SETTLEMENT_UPGRADE')){diag.housingActions++;return true;}}
 const foot=N(NS.V017?.buildingFootprint?.('house')||1);
 for(const r of sites){if(N(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-6<foot)continue;if(v.startConstruction?.(w,r.id,'house',reason+'_SETTLEMENT_HOUSE')){diag.housingActions++;return true;}}
 for(const r of sites){if(N(NS.V017?.accessiblePotential?.(v,r.t)??0)<=N(r.t.developedBuildSpace)+.05)continue;if(v.startLandDevelopment?.(w,r.id,reason+'_SETTLEMENT_LAND')){diag.housingActions++;return true;}}
 return false;
}
function audit(w){const errors=[],rows=contextAll(w),nations=new Map();for(const v of w.villages||[])nations.set(String(v.id),{pop:0,capacity:0});for(const r of rows){const x=nations.get(String(r.nationId));if(!x){errors.push('UNKNOWN_NATION:'+r.nationId);continue;}x.pop+=r.population;x.capacity+=r.capacity;
 if(r.tileRows.reduce((a,t)=>a+t.residents,0)!==r.population)errors.push('HOME:'+r.settlementId);
 if(Math.abs(r.tileRows.reduce((a,t)=>a+t.cap,0)-r.capacity)>1e-8)errors.push('CAPACITY:'+r.settlementId);
 }
 for(const v of w.villages||[]){const q=nations.get(String(v.id));if(q.pop!==v.residents.filter(p=>p.alive!==false).length)errors.push('NATION_POP:'+v.id);if(projectCount(v)>projectCap(v))errors.push('SLOT_OVERFLOW:'+v.id+':'+projectCount(v)+'/'+projectCap(v));}
 return {ok:errors.length===0,errors,settlements:rows.length,people:rows.reduce((s,r)=>s+r.population,0),housingCapacity:rows.reduce((s,r)=>s+r.capacity,0),slotCapByNation:(w.villages||[]).map(v=>({id:v.id,cap:projectCap(v),used:projectCount(v)}))};}
function contextAll(w){const r=[];for(const v of w.villages||[])r.push(...context(v,w).map(h=>({...h,nationId:v.id,nationName:v.name})));return r;}
function csv(w){const cols=['settlementId','nationId','nationName','tileIds','population','housingCapacityShared','housingDeficitShared','housingVacancyShared','overcrowdingLegacyTileTotal','activeProjectCountNation','projectCapNation'];const rows=[cols.join(',')];for(const h of contextAll(w)){const data=[h.settlementId,h.nationId,h.nationName,h.tileIds.join('|'),h.population,h.capacity,h.shortage,h.vacancy,h.tileRows.reduce((a,r)=>a+Math.max(0,r.residents-r.cap),0),projectCount(w.villages.find(v=>eq(v.id,h.nationId))),projectCap(w.villages.find(v=>eq(v.id,h.nationId)))];rows.push(data.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(','));}return rows.join('\n');}
// Four project types share the same actual national capacity, regardless of legacy subpath.
for(const [name,kind] of [['startConstruction','construction'],['startHousingUpgrade','upgrade'],['startLandDevelopment','land']]){
 const prev=NS.Village.prototype[name];if(!prev)continue;
 NS.Village.prototype[name]=function(...args){if(freeSlots(this)<=0){diag.constructionSlotBlocks++;return false;}const before=projectCount(this),out=prev.apply(this,args);const after=projectCount(this);if(out&&after>before){diag[kind+'Starts']=(diag[kind+'Starts']||0)+1;}return out;};
}
// Direct production and commercial specialization starts use their own guarded entry points.
NS.Village.prototype.buildHouse=function(w){const group=context(this,w).filter(r=>r.population>0).sort((a,b)=>b.shortage-a.shortage||b.occupancy-a.occupancy);for(const h of group){if(resolveHousing(this,w,h.coreTileId,'D2_HOUSING_POLICY',true))return true;}return false;};
// D1A preserved legacy/physical location data. D2 changes only the new settlement-level meaning.
const oldFarmUpgrade=NS.V033F5A4?.startFarmUpgrade;
if(oldFarmUpgrade)NS.V033F5A4.startFarmUpgrade=function(v,...args){if(freeSlots(v)<=0){diag.constructionSlotBlocks++;return false;}return oldFarmUpgrade(v,...args);};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034d2={revision:'settlement-civilian-24h-housing-construction-v1',sharedHousing:true,constructionSlotsV2:true};return d;};
NS.World.from=function(data){if(!data||data.version!==VERSION)throw Error('V0.34D2 저장 파일만 지원합니다.');return from({...data,version:PREVIOUS});};
function download(name,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const r=localStorage.getItem(KEY);return r?NS.World.from(JSON.parse(r)):null;},
 export(w){download(`village-observer-v034D2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D2-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D2-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const report=audit(w);if(!report.ok)throw Error('D2 Settlement 감사 실패: '+report.errors.join(','));download(`village-observer-v034D2-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D2-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d2Revision='shared-civilian-settlement-and-construction-slots-v1';d.worldSummary.v034d2Audit=audit(w);d.worldSummary.v034d2Counters={...diag};}return d;};
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const out=oldSnapshot.call(this,w,...args);if(out){const a=audit(w);Object.assign(out.global,{d2SettlementHousingDeficit:contextAll(w).reduce((t,r)=>t+r.shortage,0),d2SharedHousingAuditErrors:a.errors.length,d2NationalConstructionSlots:(w.villages||[]).reduce((t,v)=>t+projectCap(v),0)});for(const n of out.villages||[]){const v=w.villages.find(v=>eq(v.id,n.id));if(v){n.industryProjectCap31G=projectCap(v);n.d2ProjectSlots=projectCap(v);n.d2ActiveProjectCount=projectCount(v);n.d2SharedHousingDeficit=context(v,w).reduce((a,r)=>a+r.shortage,0);}}}return out;};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader,oldTile=NS.UI.prototype.renderTile,oldContent=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderHeader=function(...args){const result=oldHead.apply(this,args);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const nearby=document.getElementById('exportSettlementCsvD1Btn')||document.getElementById('exportLogCsvV2Btn');if(nearby&&!document.getElementById('exportSettlementHousingD2Btn')){const btn=document.createElement('button');btn.id='exportSettlementHousingD2Btn';btn.textContent='Settlement Housing CSV';btn.title='공동 주거·국가 건설 슬롯 11열 내보내기 (D2)';btn.addEventListener('click',()=>{try{NS.SaveSystem.exportSettlementHousingCSV(this.world);}catch(e){console.error(e);alert('D2 CSV 내보내기 오류: '+e.message);}});nearby.insertAdjacentElement('afterend',btn);}return result;};
 NS.UI.prototype.renderTile=function(...args){const result=oldTile.apply(this,args),t=this.world?.map?.get(this.world.selectedTileId),root=this.q?.('tileInspector');if(!t||t.ownerId==null||!root)return result;const v=this.world.villages.find(v=>eq(v.id,t.ownerId));const h=v&&housingAt(v,this.world,t.id);if(!h)return result;let box=root.querySelector('.v034d2-housing');if(!box){box=document.createElement('div');box.className='v034d2-housing';root.appendChild(box);}box.innerHTML=`<b>🏘️ D2 통합 생활권</b><div class="small">거주 ${h.population}명 · 공동 주거 ${h.capacity.toFixed(1)}명분 · 실질 부족 ${h.shortage.toFixed(1)}명분<br>같은 Settlement 민간 시설 접근은 1일 내 가능 · 건물과 군사 위치는 타일별 유지<br>국가 동시 공사 ${projectCount(v)} / ${projectCap(v)}개</div>`;return result;};
 NS.UI.prototype.renderVillageContent=function(...args){const result=oldContent.apply(this,args),v=this.world?.selectedNation,root=this.q?.('villageContent');if(!v||!root||!['overview','settlements','economy'].includes(this.sub))return result;let box=root.querySelector('.v034d2-summary');if(!box){box=document.createElement('div');box.className='v034d2-summary';root.insertAdjacentElement('afterbegin',box);}const hs=context(v,this.world),pop=hs.reduce((t,r)=>t+r.population,0),cap=hs.reduce((t,r)=>t+r.capacity,0),short=hs.reduce((t,r)=>t+r.shortage,0);box.innerHTML=`<b>🏗️ D2 Settlement 생활·건설</b><div class="small">공동 주거 ${pop}/${cap.toFixed(1)}명 · 실제 부족 ${short.toFixed(1)}명분 · ${hs.length} Settlement<br>국가 건설 동시 상한 <b>${projectCount(v)}/${projectCap(v)}</b> · 인구 및 행정·토목·도시화 기술 연동</div>`;return result;};
}
if(typeof document!=='undefined'){const css=document.createElement('style');css.textContent='.v034d2-housing,.v034d2-summary{margin:9px 0;padding:9px 11px;background:rgba(68,141,117,.09);border:1px solid rgba(76,175,143,.40);border-radius:9px;line-height:1.55}';document.head.appendChild(css);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Settlement Living Space + Construction Capacity',summary:'여러 타일의 Settlement를 하나의 민간 생활권으로 운영하며 건설 슬롯을 기본 3개, 기술 단계에 따라 최대 11개로 완화합니다.',sections:[['공동 생활권',['같은 Settlement의 주택은 타일 간 가상 이주 없이 공동으로 사용합니다.','주택은 실제 타일에 지으며 군사 유닛의 이동·전투·점령은 타일 단위를 유지합니다.','같은 Settlement의 민간 일자리 탐색에서 타일 간 경로 비용을 0으로 처리합니다.','민간 자원·시장 통합은 D3의 과제이며 이 버전의 실제 재고 이동 규칙은 보존합니다.']],['건설 슬롯',['기본 3, 인구 25/60 각 +1, ADMINISTRATION/ENGINEERING/URBANIZATION 각 +2, 총 최대 11입니다.','신축·주택 증축·토지 개발의 활성 프로젝트는 같은 슬롯 한도를 사용합니다.','건설 자재·Gold·노동일과 실제 건물 입지 조건은 변하지 않습니다.']],['관측 및 안전',['D2 공동 주거 부족량·건설 슬롯·집계 감사 및 별도 Housing CSV를 제공하며 기존 D1A 48열 CSV도 유지합니다.','D2 저장 파일만 현재 버전 저장/복원에 사용합니다.']]]});
NS.V034D2=Object.freeze({version:VERSION,projectCap,projectCount,freeSlots,record,sameSettlement,capAt,housingAt,context,contextAll,quickHousing,housingRows,housingBlocker,resolveHousing,audit,csv,diagnostics:diag});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D2 header',e);}
})(window.VSim);
