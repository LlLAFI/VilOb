/* V0.34D1A — labor measurement, not employment simulation. Observers never assign work. */
(function(NS){'use strict';
const VERSION='V0.34D1A',PREVIOUS='V0.34D1',SAVE_KEY='village-observer-v034d1a';
const CANDIDATE_FIELDS=['civilianEligible15','occupationTagged15','unemployed15','slotKeyTagged15','facilitySlotAssigned15','informalSlotAssigned15','workTileAssigned15','nonFacilityOccupation15','outboundWorkAssigned15','inboundWorkAssigned15','workLocationOtherTile15','workLocationForeign15','workTileDangling15','militaryExcluded15','pioneerExcluded15','slotStructuralWarnings'];
const n=x=>{const t=Number(x);return Number.isFinite(t)?t:0;};
const same=(a,b)=>String(a)===String(b);
const workId=p=>p.workTileId!==null&&p.workTileId!==undefined&&p.workTileId!==''&&Number.isInteger(Number(p.workTileId))?Number(p.workTileId):null;
const isMilitary=p=>p.militaryStatus32A==='active'||p.militaryActive32B===true;
const eligible=p=>p&&p.alive!==false&&n(p.age)>=15&&p.assignment!=='PIONEER'&&!isMilitary(p);
const occupied=p=>Boolean(p.job)&&!['무직','실업','아이'].includes(p.job);
const SLOT_JOB={farmstead:'농부',ancient_farm:'농부',sawmill:'목수',quarry:'광부',deep_quarry:'광부',iron_mine:'광부',smelter:'철공',smithy:'철공',market:'상인',grand_market:'상인',trading_post:'상인',merchant_guild:'상인',harbor:'상인',schoolhouse:'학자'};
function residentPeople(w,settlement,prep){const m=prep?.byNation?.get(String(settlement.nationId));if(!m)return[];const out=[];for(const tid of settlement.tileIds)for(const p of m.peopleByHome.get(Number(tid))||[])out.push(p);return out;}
function newMetrics(){return Object.fromEntries(CANDIDATE_FIELDS.map(x=>[x,0]));}
// Read-only structural check, deliberately avoiding V029.laborIndex() and cached labor rebuild.
// Index < 0 is an informal V29 slot; index >= 0 refers to a physical building.
function slotInfo(w,p){const key=p._v29SlotKey;if(typeof key!=='string'||!key)return {kind:'none',valid:false};
 const parts=key.match(/^(\d+):(-?\d+):(.+)$/);if(!parts)return {kind:'badKey',valid:false};
 const tid=Number(parts[1]),idx=Number(parts[2]),job=parts[3],t=w.map.get(tid);
 if(!t||!same(t.ownerId,p.villageId)||workId(p)!==tid||String(p.job)!==job)return {kind:'mismatch',valid:false,key};
 if(idx<0){const passable=NS.TERRAIN?.[t.terrain]?.passable!==false;const v=(w.villages||[]).find(v=>same(v.id,p.villageId));
  const hasFarm=(t.buildings||[]).some(x=>['farmstead','ancient_farm'].includes(x));
  const hasMine=(t.buildings||[]).some(x=>['quarry','deep_quarry','iron_mine'].includes(x));
  const hasTrade=(t.buildings||[]).some(x=>['market','grand_market','trading_post','merchant_guild','harbor'].includes(x));
  if(passable&&((idx===-1&&job==='농부'&&!hasFarm)||(idx===-2&&job==='광부'&&!hasMine)||(idx===-3&&job==='상인'&&!hasTrade&&Number(v?.coreTileId)===tid)))return {kind:'informal',valid:true,key};
  return {kind:'badInformal',valid:false,key};}
 if(!Array.isArray(t.buildings)||!t.buildings[idx]||n(t.buildingCondition?.[idx]??100)<=0)return {kind:'missingBuilding',valid:false,key};
 if(n(p.workBuildingIndex29)!==idx||String(p.workBuildingType29)!==String(t.buildings[idx])||SLOT_JOB[t.buildings[idx]]!==job)return {kind:'buildingMismatch',valid:false,key};
 return {kind:'facility',valid:true,key};
}
function calc(w,r,prep){const out=newMetrics();const members=new Set(r.tileIds.map(Number));for(const p of residentPeople(w,r,prep)){
 if(n(p.age)<15)continue;
 if(p.assignment==='PIONEER')out.pioneerExcluded15++;
 if(isMilitary(p))out.militaryExcluded15++;
 if(!eligible(p))continue;
 out.civilianEligible15++;
 if(occupied(p))out.occupationTagged15++;
 if(p.job==='무직'||p.job==='실업')out.unemployed15++;
 const wid=workId(p),info=slotInfo(w,p),hasKey=Boolean(p._v29SlotKey);
 if(hasKey){out.slotKeyTagged15++;if(info.valid){if(info.kind==='facility')out.facilitySlotAssigned15++;else if(info.kind==='informal')out.informalSlotAssigned15++;}else out.slotStructuralWarnings++;}
 else if(occupied(p))out.nonFacilityOccupation15++;
 if(wid!==null){out.workTileAssigned15++;if(wid!==Number(p.homeTileId))out.workLocationOtherTile15++;
  const target=w.map.get(wid);if(!target||target.ownerId===null||target.ownerId===undefined)out.workTileDangling15++;
  if(!target||!same(target.ownerId,r.nationId))out.workLocationForeign15++;
  if(!members.has(wid)||!target||!same(target.ownerId,r.nationId))out.outboundWorkAssigned15++;
 }
 }
 // Incoming *eligible* people may live in another Settlement or nation.
 for(const [nid,z] of prep.byNation||[])for(const tid of r.tileIds)for(const p of z.peopleByWork.get(Number(tid))||[]){
  if(eligible(p)&&(!same(nid,r.nationId)||!members.has(Number(p.homeTileId))))out.inboundWorkAssigned15++;
 }
 return out;
}
function prepare(w){return NS.V034D1.prepare(w);}
function aggregate(w,id,prepared){const r=NS.V034D1.aggregate(w,id,prepared);if(!r)return null;
 return {...r,labor:calc(w,r,prepared?.world===w?prepared:prepare(w))};}
function all(w){const prep=prepare(w);return NS.V034D1.all(w).map(r=>({...r,labor:calc(w,r,prep)}));}
const SUM_FIELDS=CANDIDATE_FIELDS.filter(k=>k!=='slotStructuralWarnings');
function audit(w,rows){const base=NS.V034D1.audit(w,(rows||all(w)).map(({labor,...base})=>base));const errors=[...base.errors],warnings=[];rows=rows||all(w);
 // Independent nation-wide sweep: do not rely on Settlement resident indexes or calculated row counters.
 const expected=new Map(),expectedInbound=new Map();for(const v of w.villages||[]){const raw=newMetrics();for(const p of v.residents||[]){if(!p||p.alive===false||n(p.age)<15)continue;
  if(p.assignment==='PIONEER')raw.pioneerExcluded15++;if(isMilitary(p))raw.militaryExcluded15++;
  if(!eligible(p))continue;raw.civilianEligible15++;if(occupied(p))raw.occupationTagged15++;
  if(p.job==='무직'||p.job==='실업')raw.unemployed15++;
  const info=slotInfo(w,p),hasKey=Boolean(p._v29SlotKey),wid=workId(p);
  if(hasKey){raw.slotKeyTagged15++;if(info.valid){if(info.kind==='facility')raw.facilitySlotAssigned15++;else raw.informalSlotAssigned15++;}else raw.slotStructuralWarnings++;}
  else if(occupied(p))raw.nonFacilityOccupation15++;
  if(wid!==null){raw.workTileAssigned15++;if(wid!==Number(p.homeTileId))raw.workLocationOtherTile15++;
   const target=w.map.get(wid);if(!target||target.ownerId==null)raw.workTileDangling15++;
   if(!target||!same(target.ownerId,v.id))raw.workLocationForeign15++;
   const home=w.map.get(Number(p.homeTileId)),homeSid=home?.settlementId,targetSid=target?.settlementId;
   if(!target||!same(target.ownerId,v.id)||!same(targetSid,homeSid))raw.outboundWorkAssigned15++;
   if(target?.ownerId!=null&&targetSid!=null&&(!same(v.id,target.ownerId)||!same(homeSid,targetSid)))
    expectedInbound.set(String(target.ownerId),(expectedInbound.get(String(target.ownerId))||0)+1);
  }
 }
 expected.set(String(v.id),raw);}
 for(const [nid,exp] of expected){const rs=rows.filter(x=>same(x.nationId,nid)),s=k=>rs.reduce((a,r)=>a+n(r.labor?.[k]),0);
  for(const k of SUM_FIELDS.filter(k=>k!=='inboundWorkAssigned15'))if(s(k)!==exp[k])errors.push('LABOR:'+nid+':'+k+':'+s(k)+'/'+exp[k]);
  if(s('inboundWorkAssigned15')!==(expectedInbound.get(nid)||0))errors.push('LABOR_INBOUND:'+nid+':'+s('inboundWorkAssigned15')+'/'+(expectedInbound.get(nid)||0));
 }
 // Cross-Settlement worker location must balance when foreign owners are included.
 const inbound=rows.reduce((a,r)=>a+n(r.labor?.inboundWorkAssigned15),0);
 const outboundInside=rows.reduce((a,r)=>a+n(r.labor?.outboundWorkAssigned15)-n(r.labor?.workTileDangling15),0);
 // Some work locations may belong to unowned/foreign-owner tiles; these are informational.
 if(inbound>outboundInside)warnings.push('LABOR_INBOUND_EXCEEDS_OUTBOUND:'+inbound+'/'+outboundInside);
 const structural=rows.reduce((s,r)=>s+n(r.labor?.slotStructuralWarnings),0);
 if(structural)warnings.push('SLOT_STRUCTURAL:'+structural);
 return {...base,ok:errors.length===0,errors,warnings,laborCandidates:rows.reduce((s,r)=>s+n(r.labor?.civilianEligible15),0),laborStructuralWarnings:structural};
}
const columns=[...NS.V034D1.columns,...CANDIDATE_FIELDS];
function csv(w){const rows=all(w),q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';const data=[columns.map(q).join(',')];for(const r of rows){const original={...r,...r.people,...r.finance,children:r.people.children,workersAtTile:r.people.workplaces,housingCapacity:r.housing.capacity,overcrowdedTiles:r.housing.overcrowdedTiles,housingShortage:r.housing.shortage,conditionAverage:r.condition.average,conditionBelow70:r.condition.below70,conditionInactive:r.condition.inactive,tileIds:r.tileIds.join('|'),...r.labor};for(const k of NS.V034D1.resources)original['stock_'+k]=r.resources[k];data.push(columns.map(k=>q(original[k])).join(','));}return data.join('\n');}
function download(filename,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
// Current-version-only saves; D1 loader's physical-fact round trip is reused.
const origSerialize=NS.World.prototype.serialize,origFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=origSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||d.version!==VERSION)throw Error('V0.34D1A 저장 파일만 지원합니다.');return origFrom({...d,version:PREVIOUS});};
// D1 deserializer returns a world whose serialize() now emits D1A.
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const str=localStorage.getItem(SAVE_KEY);return str?NS.World.from(JSON.parse(str)):null;},
 export(w){download(`village-observer-v034D1A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D1A-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D1A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const rows=all(w),check=audit(w,rows);if(!check.ok)throw Error('Settlement D1A 감사 오류: '+check.errors.slice(0,6).join(','));download(`village-observer-v034D1A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const origJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=origJSON.call(this,w),rows=all(w),check=audit(w,rows);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d1aRevision='labor-metric-clarification-readonly';d.worldSummary.v034d1aLaborAudit=check;}return d;};
// No new CSV V2 columns: D1A metrics are available through Settlement CSV and Devlog.
const origSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=origSnapshot.call(this,w,...args);if(s){const rows=all(w),check=audit(w,rows);Object.assign(s.global,{d1aLaborEligible:check.laborCandidates,d1aLaborErrors:check.errors.length,d1aLaborSlotWarnings:check.laborStructuralWarnings});}return s;};
if(NS.UI){const tile=NS.UI.prototype.renderTile,head=NS.UI.prototype.renderHeader,village=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderTile=function(...args){const out=tile.apply(this,args),w=this.world,t=w?.map?.get(w.selectedTileId),root=this.q?.('tileInspector');if(!t||t.ownerId==null||!root)return out;const base=root.querySelector?.('.v34d1-settlement-detail');if(!base)return out;const s=aggregate(w,t.settlementId);if(!s)return out;
  // Clarify raw V1 employment-field labels that are NOT counts of actual workers.
  base.innerHTML=base.innerHTML.replace(/근무 위치 (\d+)명 · 내부 유입 (\d+)명 · 외부 통근 (\d+)명/,'근무지 필드 $1명 · 외부 거주 배정 $2명 · 외부 근무지 배정 $3명 (연령 무관)');
  let el=base.querySelector?.('.v034d1a-labor');if(!el){el=document.createElement('div');el.className='v034d1a-labor';base.appendChild(el);}
  const a=s.labor;el.innerHTML=`<b>💼 D1A 노동 분류 (15세 이상 민간)</b><div class="small">후보 ${a.civilianEligible15} · 직업 표기 ${a.occupationTagged15} · 무직 ${a.unemployed15}<br>시설 슬롯 ${a.facilitySlotAssigned15} · 야외/임시 슬롯 ${a.informalSlotAssigned15} · 비시설 직업 ${a.nonFacilityOccupation15}<br>근무지 지정 ${a.workTileAssigned15} · 외부 배정 ${a.outboundWorkAssigned15} · 외부 유입 ${a.inboundWorkAssigned15}<br><span class="muted">실제 취업률·일일 생산량은 아님. 슬롯 구조 경고 ${a.slotStructuralWarnings}건.</span></div>`;
  return out;};
 NS.UI.prototype.renderVillageContent=function(...args){const out=village.apply(this,args);if(this.sub!=='settlements')return out;const v=this.world?.selectedNation,root=this.q?.('villageContent');if(!v||!root)return out;const el=root.querySelector?.('.v34d1-settlement-overview');if(!el)return out;
  const w=this.world,prep=prepare(w),rs=(w.v34b?.settlements||[]).filter(r=>r.lifecycle==='ACTIVE'&&same(r.nationId,v.id)&&r.tileIds?.length).map(r=>aggregate(w,r.id,prep)).filter(Boolean);const sum=k=>rs.reduce((a,r)=>a+n(r.labor[k]),0);let box=el.querySelector?.('.v034d1a-nation');if(!box){box=document.createElement('div');box.className='v034d1a-nation';el.appendChild(box);}
  box.innerHTML=`<div class="small"><b>D1A 노동 집계</b> · 민간 후보 ${sum('civilianEligible15')}명 · 유효 시설 슬롯 ${sum('facilitySlotAssigned15')}명 · 비시설 직업 ${sum('nonFacilityOccupation15')}명 · 외부 근무지 ${sum('outboundWorkAssigned15')}명</div>`;return out;};
 NS.UI.prototype.renderHeader=function(...args){const out=head.apply(this,args);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const b=document.getElementById('exportSettlementCsvD1Btn');if(b){b.textContent='Settlement CSV (D1A)';b.title='읽기 전용 노동 분류 및 통합 자원 (48열)';}return out;};
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent='.v034d1a-labor{margin-top:8px;padding-top:8px;border-top:1px dashed #598c94}.v034d1a-nation{margin-top:5px;padding-top:5px;border-top:1px dashed #598c94}';document.head?.appendChild(st);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(r=>r.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Labor Metrics Clarification',summary:'Settlement 노동 통계를 인구·직업 표기·근무지·실제 시설 슬롯으로 구분합니다. 노동 배정이나 생산 규칙은 변경하지 않습니다.',sections:[['노동 인구 분류',['15세 미만·개척 임무·현역 병력을 민간 노동 후보에서 구분합니다.','실제 시설 슬롯과 야외·임시 슬롯, 비시설 직업을 별도로 집계합니다.','직업 문자열 또는 근무지 필드만으로 실제 노동 투입을 주장하지 않습니다.']],['관측·무결성',['D1의 기존 Settlement CSV 32열을 보존하고 노동 16열을 추가합니다.','읽기 전용 독립 국가별 노동 감사와 슬롯 정합성 경고를 추가합니다.','기존 Snapshot CSV V2 1,683열은 유지합니다.']],['호환·범위',['D1A 자체 세이브 키·버전만 지원합니다.','D2에서 주거·노동 행동을 변경할 예정이며 D1A는 관측 패치입니다.']]]});
NS.V034D1A=Object.freeze({version:VERSION,prepare,aggregate,all,audit,csv,columns:columns.slice(),laborColumns:CANDIDATE_FIELDS.slice(),slotInfo,eligible});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D1A header',e);}
})(window.VSim);
