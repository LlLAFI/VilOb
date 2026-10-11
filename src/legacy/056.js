
window.VSim=window.VSim||{};(function(NS){
const REV32C='military-equipment-training-facilities-optimization1';
const CAL32C=w=>Number(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
const clamp32C=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));

/* ============================================================
   V0.32C · military equipment/training/facilities + optimization pass #1
   - keep Person-backed manpower
   - add one abstract serviceable military-equipment pool per nation
   - add ancient barracks / training ground / armory
   - smithy workers + real iron/wood/tools provision equipment
   - cut redundant diagnostics and avoid rebuilding military containers daily
   ============================================================ */

/* ---------- military buildings ---------- */
Object.assign(NS.BUILDINGS,{
 barracks:{label:'고대 병영',icon:'🛡️',capacity:0,maint:.0055,footprint:1.8,storage:{food:8,wood:8,stone:6,iron_ore:0,iron:4,tools:4},desc:'평시 주둔군의 숙영·조직·기초 훈련을 지원합니다.'},
 training_ground:{label:'고대 훈련장',icon:'🎯',capacity:0,maint:.0045,footprint:1.5,storage:{food:4,wood:5,stone:3,iron_ore:0,iron:0,tools:2},desc:'현역 Cohort의 반복 훈련과 전투 숙련 향상을 지원합니다.'},
 armory:{label:'고대 무기고',icon:'🗡️',capacity:0,maint:.006,footprint:1.7,storage:{food:0,wood:8,stone:8,iron_ore:0,iron:18,tools:10},desc:'철과 목재·도구를 군사 장비로 전환하고 보관·분배합니다.'}
});
if(NS.V08?.BUILD_COSTS)Object.assign(NS.V08.BUILD_COSTS,{
 barracks:{wood:32,stone:16,gold:6},
 training_ground:{wood:20,stone:8,gold:4},
 armory:{wood:26,stone:18,iron:4,gold:10}
});
if(NS.V09?.MAINT_BASE)Object.assign(NS.V09.MAINT_BASE,{
 barracks:{wood:12,stone:4,labor:.38,priority:72},
 training_ground:{wood:8,stone:2,labor:.28,priority:64},
 armory:{wood:10,stone:5,labor:.35,priority:74}
});

function ensure32C(v){
 const s=v.v32cMilitary||(v.v32cMilitary={});
 for(const [k,d] of Object.entries({equipmentStock:0,equipmentMade:0,ironUsed:0,woodUsed:0,toolsUsed:0,facilityStarts:0,barracksStarts:0,trainingStarts:0,armoryStarts:0,lastProvisionCal:-99999,lastFacilityPlanCal:-99999,trainingCycles:0}))if(!Number.isFinite(Number(s[k])))s[k]=d;
 return s;
}
function countBuilding32C(v,w,type){let n=0;for(const id of v.territory||[]){const t=w.map.get(id);if(!t)continue;for(let i=0;i<(t.buildings||[]).length;i++)if(t.buildings[i]===type&&Number(t.buildingCondition?.[i]??100)>0)n++;}return n;}
function pending32C(v,type){return (v.constructionProjects||[]).filter(p=>p.type===type&&!p.v17Marker).length;}
function firstBuildingTile32C(v,w,type){for(const id of v.territory||[]){const t=w.map.get(id);if(t&&(t.buildings||[]).includes(type))return t;}return null;}
function smithyWorkers32C(v){let n=0;for(const p of v.residents||[])if(p.alive&&p.militaryStatus32A!=='active'&&p.job==='철공'&&p.workBuildingType29==='smithy')n++;return n;}
function resourceTotal32C(v,k){try{return Number(v.resourceTotal?.(k)||0);}catch{return Number(v[k]||0);}}

/* ---------- optimization: cheap military-shape ensure ----------
   V0.32A rebuilt cohort/garrison instances and scanned every Person on every ensure call.
   After a B/C world has been attached, only a resident-epoch change requires checking new Persons. */
const ensureMilitarySlow32C=NS.V032A?.ensureMilitary;
function ensureMilitaryFast32C(v,w){
 if(!v)return null;v._world=w||v._world;
 if(!v.military32A||!Array.isArray(v.military32A.cohorts)||!Array.isArray(v.military32A.garrisons)){return ensureMilitarySlow32C?.(v,w);}
 const epoch=Number(v._v26ResidentEpoch||0),count=(v.residents||[]).length;
 if(v._v32cMilitaryEnsureEpoch!==epoch||v._v32cMilitaryEnsureCount!==count){
  for(const p of v.residents||[]){
   if(!['civilian','reserve','active','wounded','captured'].includes(p.militaryStatus32A))p.militaryStatus32A='civilian';
   if(p.militaryCohortId32A===undefined)p.militaryCohortId32A=null;
   if(p.militaryWoundedUntil32A===undefined)p.militaryWoundedUntil32A=0;
   if(p.militaryCapturedBy32A===undefined)p.militaryCapturedBy32A=null;
   if(p.militaryServiceDays32A===undefined)p.militaryServiceDays32A=0;
  }
  v._v32cMilitaryEnsureEpoch=epoch;v._v32cMilitaryEnsureCount=count;
 }
 return v.military32A;
}
if(NS.V032A)NS.V032A.ensureMilitary=ensureMilitaryFast32C;

/* ---------- optimization: cached military roster for C calculations ---------- */
function roster32C(v,w,force=false){
 ensureMilitaryFast32C(v,w);const cal=CAL32C(w),epoch=Number(v._v26ResidentEpoch||0),m=v.military32A||{};
 const sig=`${cal}:${epoch}:${(v.residents||[]).length}:${m.mobilizationLevel||'PEACE'}`;
 if(!force&&v._v32cRoster?.sig===sig)return v._v32cRoster;
 const alive=[],eligible=[],active=[],reserve=[],wounded=[],captured=[];
 for(const p of v.residents||[]){if(!p.alive)continue;alive.push(p);const st=p.militaryStatus32A||'civilian';if(st==='active')active.push(p);else if(st==='reserve')reserve.push(p);else if(st==='wounded')wounded.push(p);else if(st==='captured')captured.push(p);if(Number(p.age)>=18&&Number(p.age)<=50&&Number(p.health)>=45&&st!=='wounded'&&st!=='captured'&&(p.assignment!=='PIONEER'||p._v32bMilitaryAssignment))eligible.push(p);}
 return v._v32cRoster={sig,alive,eligible,active,reserve,wounded,captured};
}
function invalidateRoster32C(v){v._v32cRoster=null;}

/* ---------- military facilities AI ---------- */
function facilityTile32C(v,w,type){
 const coh=(v.military32A?.cohorts||[]).find(c=>(c.memberIds||[]).length),preferred=coh?.tileId??v.coreTileId;
 const rows=[preferred,...[...v.territory].filter(id=>Number(id)!==Number(preferred))];
 for(const id of rows){const t=w.map.get(Number(id));if(!t||t.ownerId!==v.id)continue;const pop=(v.tileResidents?.(t.id)||[]).length;if(type==='barracks'&&Number(id)!==Number(preferred)&&pop<4)continue;if(type==='training_ground'&&pop<3)continue;if(type==='armory'&&pop<3)continue;const foot=Number(NS.V017?.buildingFootprint?.(type)||NS.BUILDINGS?.[type]?.footprint||1),space=Number(NS.V017?.remainingSpace?.(v,t)??999);if(space+1e-9>=foot)return t;}
 return w.map.get(Number(preferred))||null;
}
function tryFacility32C(v,w,type,reason){const t=facilityTile32C(v,w,type);if(!t)return false;if(v.startConstruction?.(w,t.id,type,reason)){const s=ensure32C(v);s.facilityStarts++;if(type==='barracks')s.barracksStarts++;if(type==='training_ground')s.trainingStarts++;if(type==='armory')s.armoryStarts++;w.telemetry?.record?.('MILITARY_FACILITY_STARTED32C',w,{village:v.name,tileId:t.id,type,reason});return true;}return false;}
function planFacilities32C(v,w,force=false){
 if(v.status!=='active')return false;const s=ensure32C(v),cal=CAL32C(w);if(!force&&cal-s.lastFacilityPlanCal<180)return false;s.lastFacilityPlanCal=cal;
 const r=roster32C(v,w,true),food=Number(v.foodReserveDays?.()||0),pop=Number(v.population?.()||0),b=countBuilding32C(v,w,'barracks')+pending32C(v,'barracks'),tg=countBuilding32C(v,w,'training_ground')+pending32C(v,'training_ground'),a=countBuilding32C(v,w,'armory')+pending32C(v,'armory'),smith=countBuilding32C(v,w,'smithy');
 if(v.hasTech?.('WATCHTOWERS')&&r.active.length>0&&pop>=40&&food>=32&&b===0)return tryFacility32C(v,w,'barracks','V32C_STANDING_GARRISON');
 if(v.hasTech?.('IRONWORKING')&&r.active.length>=2&&smith>0&&food>=34&&a===0&&resourceTotal32C(v,'iron')>=5)return tryFacility32C(v,w,'armory','V32C_EQUIPMENT_SUPPLY');
 if(v.hasTech?.('WATCHTOWERS')&&b>0&&r.active.length>=2&&pop>=70&&food>=38&&tg===0)return tryFacility32C(v,w,'training_ground','V32C_TRAINING_CAPACITY');
 return false;
}

/* ---------- real-resource equipment provisioning ---------- */
function equipmentCapacity32C(v,w){return countBuilding32C(v,w,'armory')*36+countBuilding32C(v,w,'barracks')*6;}
function equipmentNeed32C(v,w){const r=roster32C(v,w);return r.active.length+r.reserve.length*.35;}
function provision32C(v,w,force=false){
 if(NS.V033I1?.enabled)return 0;
 const s=ensure32C(v),cal=CAL32C(w);if(!force&&cal-s.lastProvisionCal<90)return 0;s.lastProvisionCal=cal;
 const arm=countBuilding32C(v,w,'armory'),workers=smithyWorkers32C(v),cap=equipmentCapacity32C(v,w);if(!arm||!workers||cap<=0)return 0;
 const need=Math.max(0,Math.min(cap,equipmentNeed32C(v,w)+3)-s.equipmentStock);if(need<.05)return 0;
 const desired=Math.min(need,workers*.75+arm*.9),iron=resourceTotal32C(v,'iron'),wood=resourceTotal32C(v,'wood'),tools=resourceTotal32C(v,'tools');
 const possible=Math.max(0,Math.min(desired,iron/.72,wood/.18,tools/.045));if(possible<.05)return 0;
 const ironPer=(v.hasTech?.('ADVANCED_FORGING') ? .66 : .72),toolsPer=(v.hasTech?.('ADVANCED_FORGING') ? .04 : .045),ironNeed=possible*ironPer,woodNeed=possible*.18,toolsNeed=possible*toolsPer;
 const gi=v.withdrawNetwork?.('iron',ironNeed)??0,gw=v.withdrawNetwork?.('wood',woodNeed)??0,gt=v.withdrawNetwork?.('tools',toolsNeed)??0;
 const ratio=Math.min(ironNeed?gi/ironNeed:1,woodNeed?gw/woodNeed:1,toolsNeed?gt/toolsNeed:1),made=possible*ratio;
 s.equipmentStock=Math.min(cap,s.equipmentStock+made);s.equipmentMade+=made;s.ironUsed+=gi;s.woodUsed+=gw;s.toolsUsed+=gt;
 if(made>.05)w.telemetry?.record?.('MILITARY_EQUIPMENT_PRODUCED32C',w,{village:v.name,qty:+made.toFixed(2),iron:+gi.toFixed(2),wood:+gw.toFixed(2),tools:+gt.toFixed(3),smithyWorkers:workers,armories:arm});return made;
}
function equipmentCoverage32C(v,w){if(NS.V033I1?.enabled&&NS.V033I1.compatCoverage)return NS.V033I1.compatCoverage(v,w);const r=roster32C(v,w),n=r.active.length;if(!n)return 0;return clamp32C(ensure32C(v).equipmentStock/Math.max(1,n)*100,0,100);}
function facilityBonus32C(v,w,force=false){const cal=CAL32C(w),sig=`${cal}:${v.territory?.size||0}:${(v.constructionProjects||[]).length}`;if(!force&&v._v32cFacilityBonus?.sig===sig)return v._v32cFacilityBonus.value;const value={barracks:countBuilding32C(v,w,'barracks'),training:countBuilding32C(v,w,'training_ground'),armory:countBuilding32C(v,w,'armory')};v._v32cFacilityBonus={sig,value};return value;}
function applyCohortQuality32C(v,w){
 const f=facilityBonus32C(v,w),cover=equipmentCoverage32C(v,w),r=roster32C(v,w,true);for(const c of v.military32A?.cohorts||[]){if(!(c.memberIds||[]).length)continue;const people=(c.memberIds||[]).map(id=>r.alive.find(p=>String(p.id)===String(id))).filter(Boolean),base=people.length?people.reduce((a,p)=>a+Number(p.skills?.combat||0),0)/people.length:0,service=people.length?people.reduce((a,p)=>a+Number(p.militaryServiceDays32A||0),0)/people.length:0;c.training=+clamp32C(18+base*.52+Math.min(18,service/180*3)+f.barracks*5+f.training*12,0,100).toFixed(1);const cohortCover=NS.V033I1?.enabled&&NS.V033I1.cohortCoverage?NS.V033I1.cohortCoverage(v,w,c):cover;c.equipment=+Number(cohortCover||0).toFixed(1);c.supply=+clamp32C(Number(c.supply||0)+f.barracks*5+f.armory*3,0,100).toFixed(1);}
}


/* ---------- optimization: telemetry noise pruning ----------
   30B4 already supersedes the older 30A specialization diagnostic.
   Repeated treasury blocks for the same nation/tile/building within one calendar day are one fact. */
const recordBefore32C=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){
 w.v32cOptimizationStats=w.v32cOptimizationStats||{suppressedLegacyDiagnostics:0,dedupedReserveBlocks:0};
 if(type==='SPECIALIZATION_DIAGNOSTIC30A'){w.v32cOptimizationStats.suppressedLegacyDiagnostics++;return;}
 if(type==='TREASURY_RESERVE_BLOCK'){
  const cal=CAL32C(w),key=`${cal}:${payload?.village||''}:${payload?.tileId??''}:${payload?.type||''}:${Number(payload?.goldCost||0).toFixed(2)}`;
  this._v32cReserveBlockSeen=this._v32cReserveBlockSeen||new Map();if(this._v32cReserveBlockSeen.get(key)===cal){w.v32cOptimizationStats.dedupedReserveBlocks++;return;}this._v32cReserveBlockSeen.set(key,cal);if(this._v32cReserveBlockSeen.size>2000){for(const [k,d] of this._v32cReserveBlockSeen)if(cal-Number(d)>30)this._v32cReserveBlockSeen.delete(k);}
 }
 return recordBefore32C.call(this,type,w,payload);
};

/* ---------- quarterly integration ---------- */
const season32C=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const r=season32C.call(this,w);if(this.status==='active'){invalidateRoster32C(this);planFacilities32C(this,w,true);provision32C(this,w,true);ensure32C(this).trainingCycles++;applyCohortQuality32C(this,w);}return r;};
const daily32C=NS.Village.prototype.dailyTick;
NS.Village.prototype.dailyTick=function(w){const r=daily32C.call(this,w);if(this.status==='active'&&w.ordinalDay()%10===0){invalidateRoster32C(this);applyCohortQuality32C(this,w);}return r;};

/* ---------- C summary ---------- */
function summary32C(v,w){
 applyCohortQuality32C(v,w);const r=roster32C(v,w),s=ensure32C(v),f=facilityBonus32C(v,w),coh=v.military32A?.cohorts||[],avg=k=>coh.length?coh.reduce((a,c)=>a+Number(c[k]||0),0)/coh.length:0;
 return{militaryEquipmentStock32C:+s.equipmentStock.toFixed(2),militaryEquipmentCoverage32C:+equipmentCoverage32C(v,w).toFixed(1),militaryEquipmentMade32C:+s.equipmentMade.toFixed(2),militaryEquipmentIronUsed32C:+s.ironUsed.toFixed(2),militaryEquipmentWoodUsed32C:+s.woodUsed.toFixed(2),militaryEquipmentToolsUsed32C:+s.toolsUsed.toFixed(3),barracks32C:f.barracks,trainingGrounds32C:f.training,armories32C:f.armory,militaryFacilities32C:f.barracks+f.training+f.armory,militaryTrainingAvg32C:+avg('training').toFixed(1),militaryEquipmentAvg32C:+avg('equipment').toFixed(1),militaryActive32C:r.active.length,militaryReserve32C:r.reserve.length};
}

/* ---------- persistence ---------- */
const villageSer32C=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSer32C.call(this);d.v32cMilitary={...ensure32C(this)};return d;};
const ser32C=NS.World.prototype.serialize,from32C=NS.World.from;
NS.World.prototype.serialize=function(){const d=ser32C.call(this);d.version='0.32C';d.v32c={revision:REV32C,militaryEquipment:true,militaryFacilities:true,training:true,optimizationPass:1};return d;};
function attach32C(w){w=NS.V032B?.attachWorld?.(w)||w;if(!w)return w;for(const v of w.villages||[]){v._world=w;ensure32C(v);ensureMilitaryFast32C(v,w);invalidateRoster32C(v);applyCohortQuality32C(v,w);}w.v32cOptimizationStats=w.v32cOptimizationStats||{suppressedLegacyDiagnostics:0,dedupedReserveBlocks:0};w._v32cAttached=true;return w;}
NS.World.from=function(d){
 if(d?.version==='0.32C'){const src=d.villages||[],opt=d.v32cOptimizationStats,w=from32C({...d,version:'0.32B'});for(const v of w.villages||[]){const old=src.find(x=>Number(x.id)===Number(v.id));if(old?.v32cMilitary)v.v32cMilitary={...ensure32C(v),...old.v32cMilitary};}if(opt)w.v32cOptimizationStats={...opt};return attach32C(w);}return attach32C(from32C(d));
};

/* ---------- telemetry ---------- */
const snap32C=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap32C.call(this,w,reason,note);if(!s)return s;let eq=0,made=0,iron=0,wood=0,tools=0,bar=0,tr=0,arm=0,active=0,reserve=0;for(const row of s.villages||[]){const v=w.villages.find(x=>Number(x.id)===Number(row.id));if(!v)continue;const x=summary32C(v,w);Object.assign(row,x);eq+=x.militaryEquipmentStock32C;made+=x.militaryEquipmentMade32C;iron+=x.militaryEquipmentIronUsed32C;wood+=x.militaryEquipmentWoodUsed32C;tools+=x.militaryEquipmentToolsUsed32C;bar+=x.barracks32C;tr+=x.trainingGrounds32C;arm+=x.armories32C;active+=x.militaryActive32C;reserve+=x.militaryReserve32C;}const opt=w.v32cOptimizationStats||{};Object.assign(s.global,{militaryEquipmentStock32C:+eq.toFixed(2),militaryEquipmentMade32C:+made.toFixed(2),militaryEquipmentIronUsed32C:+iron.toFixed(2),militaryEquipmentWoodUsed32C:+wood.toFixed(2),militaryEquipmentToolsUsed32C:+tools.toFixed(3),barracks32C:bar,trainingGrounds32C:tr,armories32C:arm,militaryFacilities32C:bar+tr+arm,militaryActive32C:active,militaryReserve32C:reserve,v32cSuppressedLegacyDiagnostics:Number(opt.suppressedLegacyDiagnostics||0),v32cDedupedReserveBlocks:Number(opt.dedupedReserveBlocks||0)});const ys=(this.yearlySummaries||[]).find(x=>x.year===w.year);if(ys){Object.assign(ys.global,s.global);for(const n of ys.nations||[]){const row=s.villages.find(x=>Number(x.id)===Number(n.id));if(row)for(const k of ['militaryEquipmentStock32C','militaryEquipmentCoverage32C','militaryEquipmentMade32C','militaryEquipmentIronUsed32C','militaryEquipmentWoodUsed32C','militaryEquipmentToolsUsed32C','barracks32C','trainingGrounds32C','armories32C','militaryFacilities32C','militaryTrainingAvg32C','militaryEquipmentAvg32C','militaryActive32C','militaryReserve32C'])n[k]=row[k];}}return s;};
const csv32C=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csv32C.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['militaryEquipmentStock32C','militaryEquipmentCoverage32C','militaryEquipmentMade32C','militaryEquipmentIronUsed32C','militaryEquipmentWoodUsed32C','militaryEquipmentToolsUsed32C','barracks32C','trainingGrounds32C','armories32C','militaryFacilities32C','militaryTrainingAvg32C','militaryEquipmentAvg32C','militaryActive32C','militaryReserve32C'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k]??s.global?.[k])).join(',');}return lines.join('\n');};
const json32C=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json32C.call(this,w);d.version='0.32C';Object.assign(d.worldSummary,{v32CRevision:REV32C,militaryEquipment32C:'serviceable equipment pool is produced only by real smithy workers through conserved iron + wood + tools and distributed through armories',militaryFacilities32C:'ancient barracks, training grounds and armories are AI-built support facilities; no combat or formation movement yet',militaryTraining32C:'barracks/training grounds improve Person-backed Cohort training; armories raise equipment readiness',optimization32C:'pass #1 keeps historical systems but removes duplicate diagnostics, deduplicates same-day reserve-block logs, and caches military shape/rosters; measured Person.act compatibility path is retained because its PIONEER early-return is already efficient'});return d;};

/* ---------- UI ---------- */
if(NS.UI){const set32C=NS.UI.prototype.setWorld,head32C=NS.UI.prototype.renderHeader,content32C=NS.UI.prototype.renderVillageContent;NS.UI.prototype.setWorld=function(w){return set32C.call(this,attach32C(w));};NS.UI.prototype.renderHeader=function(){head32C.call(this);document.title='Village Observer V0.32C';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32C</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32C 군사장비·훈련·병영/훈련장/무기고 · 최적화 1차';};NS.UI.prototype.renderVillageContent=function(){content32C.call(this);if(this.sub!=='military')return;const v=this.world.selectedNation,root=this.q('villageContent');if(!v||!root)return;const b=NS.V032B.summary(v,this.world),c=summary32C(v,this.world),coh=v.military32A?.cohorts||[],coord=id=>{const t=this.world.map.get(Number(id));return t?`(${t.x},${t.y})`:'-';},level=b.mobilizationLevel32B==='WATCH'?'경계':'평시';root.innerHTML=`<div class="section-head"><div><div class="muted small">V0.32C 군사사회 · 장비/훈련</div><h2>${v.name} 군사</h2></div><span class="tag">${level}</span></div><div class="grid"><div class="info">현역 / 목표<div class="big">${b.activeMilitary32B} / ${b.militaryTargetActive32B}</div></div><div class="info">예비 / 목표<div class="big">${b.reserveMilitary32B} / ${b.militaryTargetReserve32B}</div></div><div class="info">장비 충족<div class="big">${c.militaryEquipmentCoverage32C.toFixed(0)}%</div></div><div class="info">장비 풀<div class="big">${c.militaryEquipmentStock32C.toFixed(1)}</div></div><div class="info">평균 훈련<div class="big">${c.militaryTrainingAvg32C.toFixed(0)}</div></div><div class="info">전략 경계<div class="big">${b.militaryConcern32B.toFixed(0)}</div></div></div><div class="v32c-fac"><strong>군사 시설</strong><div class="small">🛡️ 고대 병영 ${c.barracks32C} · 🎯 고대 훈련장 ${c.trainingGrounds32C} · 🗡️ 고대 무기고 ${c.armories32C}</div><div class="small muted">누적 군사장비 ${c.militaryEquipmentMade32C.toFixed(1)}세트 · 철 ${c.militaryEquipmentIronUsed32C.toFixed(1)} / 목재 ${c.militaryEquipmentWoodUsed32C.toFixed(1)} / 도구 ${c.militaryEquipmentToolsUsed32C.toFixed(2)} 소비</div></div>${coh.length?`<div class="v32b-cohorts">${coh.map(x=>{const names=(x.memberIds||[]).map(id=>v.residents.find(p=>String(p.id)===String(id))?.name).filter(Boolean);return`<div class="v32b-cohort"><div><strong>${x.name}</strong><span class="tag">${coord(x.tileId)}</span></div><div class="small">실제 Person ${names.length}명 · 훈련 ${Number(x.training||0).toFixed(0)} · 장비 ${Number(x.equipment||0).toFixed(0)}% · 사기 ${Number(x.morale||0).toFixed(0)} · 보급 ${Number(x.supply||0).toFixed(0)}%</div><div class="small muted">${names.join(' · ')||'구성원 없음'}</div></div>`;}).join('')}</div>`:'<div class="v32b-note small muted">아직 조직된 현역 Cohort가 없습니다.</div>'}`;};}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent='.v32c-fac{margin-top:12px;padding:10px;border:1px solid rgba(166,190,230,.25);border-radius:10px;background:rgba(105,130,175,.07)}';document.head.appendChild(st);}

if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32C'))NS.PATCH_NOTES.unshift({version:'V0.32C',date:'2026-09-26',title:'군사장비·훈련·군사시설 + 최적화 1차',summary:'실제 철경제를 평시 군사 준비와 연결하고, 고대 병영·훈련장·무기고 및 장비 충족률을 도입합니다. 동시에 중복 진단과 군사 핫패스를 정리합니다.',sections:[['군사장비',['군사장비는 별도 Person이 아니라 국가가 보유하는 정비 가능한 장비 세트 풀입니다.','무기고가 있고 실제 대장간 철공이 근무할 때만 철+목재+도구를 소비해 장비가 생산됩니다.','Cohort 장비 충족률은 실제 현역 수 대비 서비스 가능한 장비 풀로 계산합니다.']],['군사시설',['고대 병영은 평시 주둔군의 조직/훈련/보급을 지원합니다.','고대 훈련장은 반복 훈련 효과를 강화합니다.','고대 무기고는 장비 생산·저장 기반이며 철공 기술과 대장간 공급망을 요구합니다.']],['최적화 1차',['V0.30B4가 대체한 SPECIALIZATION_DIAGNOSTIC30A 로그는 더 이상 중복 기록하지 않습니다.','같은 날 같은 시설에 대한 동일 TREASURY_RESERVE_BLOCK 이벤트를 중복 기록하지 않습니다.','군사 객체 ensure를 resident epoch 기반으로 바꾸고 군사 roster를 일 단위 캐시합니다.','현역 Person의 Person.act 체인은 실제 벤치마크에서 기존 PIONEER 조기 반환이 충분히 빨라 별도 우회 코드를 추가하지 않습니다.','내부 물류 상세 로그와 Person 개별 시뮬레이션은 관측 가치가 높아 이번 최적화에서 유지합니다.']]]});

(function(){const KEY='village-observer-v0-32c',fallback=['village-observer-v0-32b','village-observer-v0-32a','village-observer-v0-31i','village-observer-v0-31h','village-observer-v0-31g','village-observer-v0-31f','village-observer-v0-31a','village-observer-v0-31','village-observer-v0-30b4','village-observer-v0-30b3','village-observer-v0-30b2','village-observer-v0-30a','village-observer-v0-30'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v032C-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v032C-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v032C-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attach32C(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
NS.V032C={revision:REV32C,attachWorld:attach32C,summary:summary32C,roster:roster32C,planFacilities:planFacilities32C,provision:provision32C,applyCohortQuality:applyCohortQuality32C};
})(window.VSim);
