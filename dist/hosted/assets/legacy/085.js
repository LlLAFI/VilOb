
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV32F='military-readiness-supply-equipment-032-close';
const NOW=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const CAL=w=>Number(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number(v)||0));
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

function statsF(w){
 w.v32fStats=w.v32fStats||{};const s=w.v32fStats;
 const defs={armoryIronConsumptionDeferred:0,armoryIronReserveBlocks:0,armoryStartAttempts:0,armoryStarts:0,readinessUpdates:0,supplyDisconnectedObservations:0,proposalSyncCorrections:0,perfMilitaryReadinessMs:0};
 for(const[k,d]of Object.entries(defs))if(!Number.isFinite(Number(s[k])))s[k]=d;
 return s;
}
function stateF(v){v.v32fMilitary=v.v32fMilitary||{};const s=v.v32fMilitary;for(const[k,d]of Object.entries({lastReadinessCal:-99999,lastArmoryAttemptCal:-99999,readinessUpdates:0}))if(!Number.isFinite(Number(s[k])))s[k]=d;return s;}
function countBuildingF(v,w,type){let n=0;for(const id of v?.territory||[]){const t=w?.map?.get(Number(id));if(!t)continue;for(let i=0;i<(t.buildings||[]).length;i++)if(t.buildings[i]===type&&Number(t.buildingCondition?.[i]??100)>0)n++;}return n;}
function pendingF(v,type){return(v?.constructionProjects||[]).some(p=>p?.type===type&&!p?.v17Marker);}
function activeMilitaryF(v){return(v?.residents||[]).filter(p=>p.alive&&p.militaryStatus32A==='active').length;}
function totalF(v,k){try{return Number(v.resourceTotal?.(k)||0);}catch{return Number(v?.[k]||0);}}
function armoryReserveTargetF(v,w){
 if(!v||v.status!=='active'||!v.hasTech?.('IRONWORKING'))return 0;
 if(countBuildingF(v,w,'armory')>0||pendingF(v,'armory'))return 0;
 if(countBuildingF(v,w,'smithy')<=0||activeMilitaryF(v)<2||Number(v.foodReserveDays?.()||0)<34)return 0;
 return 5.25;
}
function armoryPipelineF(v,w){
 const built=countBuildingF(v,w,'armory'),pending=pendingF(v,'armory'),iron=totalF(v,'iron'),target=armoryReserveTargetF(v,w),active=activeMilitaryF(v),smith=countBuildingF(v,w,'smithy');
 if(built>0)return{state:'ACTIVE',iron,target,built,pending:0};
 if(pending)return{state:'BUILDING',iron,target:0,built:0,pending:1};
 if(!v.hasTech?.('IRONWORKING'))return{state:'TECH',iron,target:0,built:0,pending:0};
 if(active<2)return{state:'NO_ACTIVE_FORCE',iron,target:0,built:0,pending:0};
 if(!smith)return{state:'NO_SMITHY',iron,target:0,built:0,pending:0};
 if(Number(v.foodReserveDays?.()||0)<34)return{state:'FOOD_RESERVE',iron,target:0,built:0,pending:0};
 if(iron+1e-9<5)return{state:'RESERVING_IRON',iron,target,built:0,pending:0};
 const r=NS.V032C1?.readiness?.(v,w,false);if(r?.type==='armory')return{state:r.ready?'READY':String(r.blocker||'BLOCKED'),iron,target,built:0,pending:0,readiness:r};
 return{state:'WAITING_PRIORITY',iron,target,built:0,pending:0,readiness:r};
}

/* F1. Break the C/C1 armory deadlock without creating resources.
   Until the first armory starts, real smithy work may consume iron only above
   a small national reserve. Construction remains on the existing physical
   startConstruction/payBuild path and spends the reserved iron normally. */
const actF=NS.Person.prototype.act;
NS.Person.prototype.act=function(v,w){const prev=NS._v32fActiveAct;NS._v32fActiveAct={v,w,p:this};try{return actF.call(this,v,w);}finally{NS._v32fActiveAct=prev;}};
const withdrawAtF=NS.Village.prototype.withdrawAt;
NS.Village.prototype.withdrawAt=function(tileId,kind,qty){
 const a=NS._v32fActiveAct;if(kind==='iron'&&a?.v===this&&a?.p?.alive&&a.p.job==='철공'&&a.p.workBuildingType29==='smithy'){
  const w=a.w||this._world,target=armoryReserveTargetF(this,w);if(target>0){const total=totalF(this,'iron'),allowed=Math.max(0,total-target),want=Math.max(0,Number(qty)||0),take=Math.min(want,allowed);a.smithyReserveActive=true;a.smithyIronTaken=Number(a.smithyIronTaken||0);if(take+1e-9<want){const s=statsF(w);s.armoryIronReserveBlocks++;s.armoryIronConsumptionDeferred+=want-take;}if(take<=1e-9)return 0;const got=withdrawAtF.call(this,tileId,kind,take);a.smithyIronTaken+=Number(got||0);return got;}
 }
 return withdrawAtF.call(this,tileId,kind,qty);
};
/* The V0.31 smithy path computes tool output from its requested iron amount,
   not from withdrawAt()'s return value. When F caps iron consumption, cap the
   matching tool deposit to the iron actually withdrawn so conservation holds. */
const depositAtF=NS.Village.prototype.depositAt;
NS.Village.prototype.depositAt=function(tileId,kind,amount){const a=NS._v32fActiveAct;if(kind==='tools'&&a?.v===this&&a?.smithyReserveActive){const cap=Math.max(0,Number(a.smithyIronTaken||0)*(this.hasTech?.('ADVANCED_FORGING')?.88:.78)),q=Math.min(Math.max(0,Number(amount)||0),cap);return q>1e-9?depositAtF.call(this,tileId,kind,q):0;}return depositAtF.call(this,tileId,kind,amount);};
/* Count every physical Armory start regardless of whether C1 PRE_SEASON,
   PROJECT_FREED or the F post-season retry owns the successful call. */
const startBuildF=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason='AI'){const armory=type==='armory',ironBefore=armory?totalF(this,'iron'):0;if(armory)statsF(w).armoryStartAttempts++;const ok=startBuildF.call(this,w,tileId,type,reason);if(ok&&armory){statsF(w).armoryStarts++;w.telemetry?.record?.('ARMORY_PIPELINE_STARTED32F',w,{village:this.name,villageId:this.id,tileId:Number(tileId),ironBefore:+Number(ironBefore||0).toFixed(3),ironAfter:+Number(totalF(this,'iron')||0).toFixed(3),reason});}return ok;};
function tryArmoryF(v,w,source='F_SEASON'){
 const st=stateF(v),cal=CAL(w);if(cal-Number(st.lastArmoryAttemptCal||-99999)<30)return false;st.lastArmoryAttemptCal=cal;
 const pipe=armoryPipelineF(v,w);if(pipe.state!=='READY')return false;
 let ok=false;try{ok=!!NS.V032C1?.tryStartMilitaryFacility?.(v,w,source);}catch(e){console.error('V0.32F armory activation failed',e);}return ok;
}

/* F2. Formation Supply / Readiness V1.
   No second Person food consumption is added. Supply is logistical access:
   road/path cost to a real support settlement plus national/local food access.
   Equipment remains the conserved C equipment pool. */
function supportSourcesF(v,w){
 const out=[];for(const id0 of v.territory||[]){const id=Number(id0),t=w.map.get(id);if(!t||t.ownerId!==v.id)continue;const bs=t.buildings||[];let bonus=0,label='정착지';if(id===Number(v.coreTileId)){bonus+=14;label='수도';}if(bs.includes('armory')){bonus+=22;label='무기고';}if(bs.includes('barracks')){bonus+=15;label=label==='무기고'?'무기고·병영':'병영';}if(bs.includes('training_ground'))bonus+=5;if(bs.includes('granary')){bonus+=7;if(label==='정착지')label='곡물창고 거점';}if(bs.includes('warehouse')){bonus+=5;if(label==='정착지')label='창고 거점';}if(bs.includes('admin_office')){bonus+=6;if(label==='정착지')label='행정 거점';}const pop=(v.tileResidents?.(id)||[]).filter(p=>p.alive).length;bonus+=Math.min(8,pop*.55);const qualified=id===Number(v.coreTileId)||bonus>=5||pop>=8;if(qualified)out.push({id,bonus,pop,label});}
 if(!out.length&&Number.isFinite(Number(v.coreTileId)))out.push({id:Number(v.coreTileId),bonus:10,pop:0,label:'수도'});return out;
}
function foodFactorF(v,sourceId){const nat=Number(v.foodReserveDays?.()||0),loc=Number(v.settlementReserveDays?.(sourceId));const days=Number.isFinite(loc)&&loc>0?Math.min(nat||loc,loc):nat;if(days>=45)return 1;if(days>=30)return .94;if(days>=18)return .82;if(days>=10)return .67;return .48;}
function supplyTargetF(v,w,c,sources){
 const target=Number(c.tileId??v.coreTileId);let best=null;for(const s of sources){const raw=v.internalPathCost?.(s.id,target);if(raw==null)continue;let route=Number(raw);if(!Number.isFinite(route))continue;const score=route-s.bonus*.055;if(!best||score<best.score)best={...s,route,score};}
 if(!best)return{target:18,route:Infinity,sourceTileId:null,sourceLabel:'단절',connected:false};
 const ff=foodFactorF(v,best.id),techBonus=v.hasTech?.('MILITARY_LOGISTICS')?6:0,raw=(98-best.route*4.6+best.bonus+techBonus)*ff;return{target:clamp(raw),route:best.route,sourceTileId:best.id,sourceLabel:best.label,connected:true};
}
function updateReadinessF(v,w,force=false){
 if(!v||v.status!=='active')return;const st=stateF(v),cal=CAL(w);if(!force&&cal-Number(st.lastReadinessCal||-99999)<15)return;const t0=NOW();st.lastReadinessCal=cal;
 NS.V032D?.ensureFormations?.(v,w);NS.V032C?.roster?.(v,w,true);NS.V032C?.applyCohortQuality?.(v,w);const sources=supportSourcesF(v,w),coh=(v.military32A?.cohorts||[]).filter(c=>(c.memberIds||[]).length);
 let disconnected=0;for(const c of coh){const x=supplyTargetF(v,w,c,sources),old=Number((c.supply32F??c.supply)||0),next=c._v32fSupplyInitialized?old*.55+x.target*.45:x.target;c._v32fSupplyInitialized=true;c.supply32F=+clamp(next).toFixed(1);c.supply=c.supply32F;c.supplyTarget32F=+x.target.toFixed(1);c.supplyRouteCost32F=Number.isFinite(x.route)?+x.route.toFixed(2):null;c.supplySourceTileId32F=x.sourceTileId;c.supplySourceLabel32F=x.sourceLabel;c.supplyConnected32F=x.connected?1:0;if(!x.connected)disconnected++;c.readiness32F=+clamp(Number(c.training||0)*.30+Number(c.equipment||0)*.25+Number((c.supply32F??c.supply)||0)*.30+Number(c.morale||0)*.15).toFixed(1);}
 st.readinessUpdates++;statsF(w).readinessUpdates++;statsF(w).supplyDisconnectedObservations+=disconnected;statsF(w).perfMilitaryReadinessMs+=Math.max(0,NOW()-t0);
}
function cohortRowsF(v,w){NS.V032D?.ensureFormations?.(v,w);const cohorts=(v.military32A?.cohorts||[]).filter(c=>(c.memberIds||[]).length);return cohorts.map(c=>({id:c.id,name:c.name,role:c.role32D1==='FIELD_FORCE'?'FIELD':c.role32B==='CORE_GARRISON'?'GARRISON':'COHORT',manpower:(c.memberIds||[]).length,training:Number(c.training||0),equipment:Number(c.equipment||0),supply:Number((c.supply32F??c.supply)||0),morale:Number(c.morale||0),readiness:Number(c.readiness32F??(Number(c.training||0)*.30+Number(c.equipment||0)*.25+Number((c.supply32F??c.supply)||0)*.30+Number(c.morale||0)*.15)),route:c.supplyRouteCost32F,source:c.supplySourceTileId32F,sourceLabel:c.supplySourceLabel32F||'-',connected:Number(c.supplyConnected32F??1)}));}
function restoreSupplyF(v){for(const c of v?.military32A?.cohorts||[])if(Number.isFinite(Number(c.supply32F)))c.supply=Number(c.supply32F);}
function militarySummaryF(v,w){
 const rows=cohortRowsF(v,w),avg=k=>rows.length?rows.reduce((a,x)=>a+Number(x[k]||0),0)/rows.length:0,field=rows.filter(x=>x.role==='FIELD'),gar=rows.filter(x=>x.role==='GARRISON'),maxRoute=Math.max(0,...rows.map(x=>Number.isFinite(Number(x.route))?Number(x.route):0)),disc=rows.filter(x=>!x.connected).length,pipe=armoryPipelineF(v,w),active=activeMilitaryF(v),equipmentStock=NS.V033I1?.enabled?NS.V033I1.physicalItemCount(v,w):Number(v.v32cMilitary?.equipmentStock||0),coverage=NS.V033I1?.enabled?NS.V033I1.compatCoverage(v,w):(active?clamp(equipmentStock/active*100):0);
 return{rows,militaryReadinessAvg32F:+avg('readiness').toFixed(1),militaryFieldReadiness32F:+(field.length?field.reduce((a,x)=>a+x.readiness,0)/field.length:0).toFixed(1),militaryGarrisonReadiness32F:+(gar.length?gar.reduce((a,x)=>a+x.readiness,0)/gar.length:0).toFixed(1),militarySupplyAvg32F:+avg('supply').toFixed(1),militarySupplyMaxRoute32F:+maxRoute.toFixed(2),militarySupplyDisconnected32F:disc,militaryEquipmentCoverage32F:+coverage.toFixed(1),armories32F:countBuildingF(v,w,'armory'),armoryPipeline32F:pipe.state,armoryIron32F:+Number(pipe.iron||0).toFixed(3),armoryIronReserveTarget32F:+Number(pipe.target||0).toFixed(2)};
}

/* F3. Proposal consistency: if the physical E4 start already failed this tick,
   the observer must report that concrete blocker instead of recomputing READY. */
if(NS.V032E4?.diagnose){const diagnoseF=NS.V032E4.diagnose;NS.V032E4.diagnose=function(v,w,i){const base=diagnoseF(v,w,i),actual=String(i?.blocker||'NONE'),status=String(i?.status||'');if(base==='READY'&&status==='BLOCKED'&&actual!=='NONE'&&actual!=='READY'){const key=`${CAL(w)}:${v.id}:${i?.tileId}:${actual}`;w._v32fProposalFixSeen=w._v32fProposalFixSeen||new Set();if(!w._v32fProposalFixSeen.has(key)){w._v32fProposalFixSeen.add(key);statsF(w).proposalSyncCorrections++;if(w._v32fProposalFixSeen.size>400){const keep=[...w._v32fProposalFixSeen].slice(-200);w._v32fProposalFixSeen=new Set(keep);}}return actual;}return base;};}

/* F4. Repair E14 harvest profiling. The E14 Tile.harvest wrapper expected a
   tile-level world reference that normal Person work tiles did not carry.
   F supplies the active act world only for the duration of the call. */
const harvestF=NS.Tile.prototype.harvest;
NS.Tile.prototype.harvest=function(){const a=NS._v32fActiveAct,prev=this._worldRef;if(a?.w)this._worldRef=a.w;try{return harvestF.apply(this,arguments);}finally{this._worldRef=prev;}};

const dailyF=NS.Village.prototype.dailyTick;
NS.Village.prototype.dailyTick=function(w){const r=dailyF.call(this,w);if(this.status==='active')updateReadinessF(this,w,false);return r;};
const seasonF=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const r=seasonF.call(this,w);if(this.status==='active'){tryArmoryF(this,w,'F_POST_SEASON');updateReadinessF(this,w,true);}return r;};

function goldConcentrationF(snapshot){const vals=(snapshot?.villages||[]).map(r=>Number(r.moneySupply30||0)).filter(x=>x>=0).sort((a,b)=>b-a),sum=vals.reduce((a,b)=>a+b,0);return{goldTop1Share32F:+(sum?Number(vals[0]||0)/sum:0).toFixed(5),goldTop2Share32F:+(sum?(Number(vals[0]||0)+Number(vals[1]||0))/sum:0).toFixed(5)};}
function globalSummaryF(w,snap=null){const s=statsF(w),rows=(w.activeVillages||[]).map(v=>militarySummaryF(v,w)),g=snap?goldConcentrationF(snap):{goldTop1Share32F:0,goldTop2Share32F:0};return{armoryIronConsumptionDeferred32F:+Number(s.armoryIronConsumptionDeferred||0).toFixed(3),armoryIronReserveBlocks32F:Number(s.armoryIronReserveBlocks||0),armoryStartAttempts32F:Number(s.armoryStartAttempts||0),armoryStarts32F:Number(s.armoryStarts||0),militaryReadinessUpdates32F:Number(s.readinessUpdates||0),militarySupplyDisconnectedObs32F:Number(s.supplyDisconnectedObservations||0),constructionProposalSyncCorrections32F:Number(s.proposalSyncCorrections||0),perfMilitaryReadiness32F:+Number(s.perfMilitaryReadinessMs||0).toFixed(3),militaryReadyNations32F:rows.filter(x=>x.militaryReadinessAvg32F>=70&&x.militaryEquipmentCoverage32F>0).length,...g};}
function resetPerfF(w){statsF(w).perfMilitaryReadinessMs=0;}

function attachF(w,src=null){w=NS.V032E14?.attachWorld?.(w,src)||w;if(!w)return w;const saved=src?.v32fStats||w.v32fStats||{};w.v32fStats={...statsF(w),...saved};const oldRows=src?.villages||[];for(const v of w.villages||[]){v._world=w;const old=oldRows.find(x=>Number(x.id)===Number(v.id));if(old?.v32fMilitary)v.v32fMilitary={...stateF(v),...old.v32fMilitary};else stateF(v);}return w;}

const villageSerF=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSerF.call(this);d.v32fMilitary=this.v32fMilitary||null;return d;};
const snapF=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snapF.call(this,w,reason,note);if(!s)return s;for(const v of w.villages||[])restoreSupplyF(v);for(const row of s.villages||[]){const v=(NS.V035H1B1?.lookupVillage?.(w,row.id)??w.villages.find(x=>Number(x.id)===Number(row.id)));if(v)Object.assign(row,militarySummaryF(v,w));}Object.assign(s.global,globalSummaryF(w,s));const ys=(this.yearlySummaries||[]).find(x=>Number(x.year)===Number(w.year));if(ys){Object.assign(ys.global,s.global);for(const n of ys.nations||[]){const r=s.villages.find(x=>Number(x.id)===Number(n.id));if(r)for(const k of ['militaryReadinessAvg32F','militaryFieldReadiness32F','militaryGarrisonReadiness32F','militarySupplyAvg32F','militarySupplyMaxRoute32F','militarySupplyDisconnected32F','militaryEquipmentCoverage32F','armories32F','armoryPipeline32F','armoryIron32F','armoryIronReserveTarget32F'])n[k]=r[k];}}resetPerfF(w);return s;};
const csvF=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csvF.call(this),lines=base.split('\n');if(!lines.length)return base;const G=['armoryIronConsumptionDeferred32F','armoryIronReserveBlocks32F','armoryStartAttempts32F','armoryStarts32F','militaryReadinessUpdates32F','militarySupplyDisconnectedObs32F','constructionProposalSyncCorrections32F','perfMilitaryReadiness32F','militaryReadyNations32F','goldTop1Share32F','goldTop2Share32F'],R=['militaryReadinessAvg32F','militaryFieldReadiness32F','militaryGarrisonReadiness32F','militarySupplyAvg32F','militarySupplyMaxRoute32F','militarySupplyDisconnected32F','militaryEquipmentCoverage32F','armories32F','armoryPipeline32F','armoryIron32F','armoryIronReserveTarget32F'],q=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+[...G,...R].map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const row of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+[...G.map(k=>s.global?.[k]),...R.map(k=>row?.[k])].map(q).join(',');}return lines.join('\n');};
const jsonF=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonF.call(this,w);d.version='0.32F';Object.assign(d.worldSummary,{v32FRevision:REV32F,v32SeriesClosed:true,militaryEquipmentPipeline32F:'smithy iron consumption preserves a small real-stock reserve only until the first armory starts; armory construction still spends physical iron/materials/Gold through the existing build path',formationSupply32F:'Formation supply is a logistical-access readiness metric derived from real owned support settlements, internal route cost/roads and food access; it does not double-consume Person food',militaryReadiness32F:'cohort readiness combines training, conserved equipment coverage, logistical supply and morale; combat remains disabled',constructionProposalSync32F:'trade-network proposal observation defers to the actual current E4 blocked status after a physical start rejection, removing false READY rows',personProfilerFix32F:'E14 harvest profiling receives the active Person-act world reference during Tile.harvest so real harvest time is measured',goldConcentrationObserver32F:'snapshot-only Top-1/Top-2 money-supply share is exported for long-run concentration observation; no redistribution rule is added'});return d;};

const serF=NS.World.prototype.serialize,fromF=NS.World.from;
NS.World.prototype.serialize=function(){const d=serF.call(this);d.version='0.32F';d.v32f={revision:REV32F,seriesClosed:true,armoryIronReserve:true,formationSupplyV1:true,militaryReadinessV1:true,proposalExecutionSync:true,harvestProfilerFix:true,goldConcentrationObserver:true,combat:false};d.v32fStats=JSON.parse(JSON.stringify(statsF(this)));return d;};
NS.World.from=function(d){if(d?.version==='0.32F'){const w=fromF({...d,version:'0.32E14'});return attachF(w,d);}return attachF(fromF(d),d);};

function dlF(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
const savePrevF=NS.SaveSystem;
(function(){const KEY='village-observer-v0-32f',fallback=['village-observer-v0-32e14','village-observer-v0-32e12','village-observer-v0-32e11','village-observer-v0-32e10','village-observer-v0-32e9','village-observer-v0-32e8','village-observer-v0-32e7','village-observer-v0-32e6','village-observer-v0-32e5','village-observer-v0-32e4','village-observer-v0-32e3','village-observer-v0-32e2','village-observer-v0-32e1','village-observer-v0-32d5'];NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dlF(`village-observer-v032F-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dlF(`village-observer-v032F-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const text=w.telemetry.snapshotsCSV(),c=NS.V032E14?.validateCSV?.(text),s=NS.V032E14?.stats?.(w);if(s)s.csvSchemaChecks=Number(s.csvSchemaChecks||0)+1;if(c&&!c.ok){if(s)s.csvSchemaFailures=Number(s.csvSchemaFailures||0)+1;throw new Error(`CSV schema mismatch: expected ${c.columns} columns; bad rows ${c.bad.slice(0,8).join(', ')}`);}dlF(`village-observer-v032F-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+text,'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){const data=JSON.parse(await file.text()),w=NS.V019.worldFromMapData(data);return attachF(NS.V032E14?.attachWorld?.(w)||w);},async importScenario(file){const w=await savePrevF.importScenario(file);return attachF(w);},exportScenario(w,meta=null){const x=NS.V032E14?.scenarioWrapper?.(w,meta);if(!x)return savePrevF.exportScenario(w,meta);x.meta={...x.meta,intendedVersion:'0.32F'};x.world.testScenario={...x.meta};if(x.world.v32e11)x.world.v32e11.scenario={...x.meta};const es=NS.V032E14?.stats?.(w);if(es)es.scenarioExports=Number(es.scenarioExports||0)+1;dlF(`village-observer-v032F-scenario-${x.meta.id}.json`,JSON.stringify(x));return x;}};})();

function militaryPanelF(v,w){const s=militarySummaryF(v,w),pipe=s.armoryPipeline32F,pipeLabel={ACTIVE:'가동',BUILDING:'건설 중',READY:'착공 가능',RESERVING_IRON:'철 비축 중',TECH:'철공 기술 필요',NO_ACTIVE_FORCE:'현역 부족',NO_SMITHY:'대장간 필요',FOOD_RESERVE:'식량 비축 부족',WAITING_PRIORITY:'선행 군사시설 대기'}[pipe]||pipe;return`<div class="v32f-ready"><div class="section-head"><div><strong>⚔️ F 군사 준비태세</strong><div class="small muted">전투 전 단계 · Person 기반 병력 + 실제 장비 + 위치 기반 보급</div></div><span class="tag">Readiness ${s.militaryReadinessAvg32F.toFixed(0)}</span></div><div class="v32f-grid"><span>주둔 준비 <b>${s.militaryGarrisonReadiness32F.toFixed(0)}</b></span><span>야전 준비 <b>${s.militaryFieldReadiness32F.toFixed(0)}</b></span><span>평균 보급 <b>${s.militarySupplyAvg32F.toFixed(0)}%</b></span><span>장비 충족 <b>${s.militaryEquipmentCoverage32F.toFixed(0)}%</b></span><span>최장 보급 route <b>${s.militarySupplyMaxRoute32F.toFixed(2)}</b></span><span>보급 단절 <b>${s.militarySupplyDisconnected32F}</b></span><span>무기고 <b>${s.armories32F}</b></span><span>장비 파이프라인 <b>${esc(pipeLabel)}</b></span></div>${pipe==='RESERVING_IRON'?`<div class="small muted">무기고 착공용 실제 철을 보존 중: ${s.armoryIron32F.toFixed(2)} / ${s.armoryIronReserveTarget32F.toFixed(2)}</div>`:''}<div class="v32f-cohorts">${s.rows.map(r=>`<div class="small"><b>${esc(r.name)}</b> · ${r.role} · ${r.manpower}명 · 준비 ${r.readiness.toFixed(0)} · 보급 ${r.supply.toFixed(0)}% · 장비 ${r.equipment.toFixed(0)}%<br><span class="muted">보급원 ${r.source!=null?`#${r.source} ${esc(r.sourceLabel)}`:'단절'} · route ${r.route==null?'∞':Number(r.route).toFixed(2)}</span></div>`).join('')||'<div class="small muted">현역 Cohort 없음</div>'}</div></div>`;}
if(NS.UI){const setF=NS.UI.prototype.setWorld,headF=NS.UI.prototype.renderHeader,contentF=NS.UI.prototype.renderVillageContent,worldF=NS.UI.prototype.renderWorld;NS.UI.prototype.setWorld=function(w){return setF.call(this,attachF(w));};NS.UI.prototype.renderHeader=function(){headF.call(this);document.title='Village Observer V0.32F';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32F</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32F 0.32 마감 · 장비 파이프라인 · Formation 보급/준비태세 · Proposal/Profiler 정합성';};NS.UI.prototype.renderVillageContent=function(){contentF.call(this);const v=this.world.selectedNation,root=this.q('villageContent');if(v)restoreSupplyF(v);if(v&&root&&this.sub==='military'&&!root.querySelector('.v32f-ready'))root.insertAdjacentHTML('afterbegin',militaryPanelF(v,this.world));};NS.UI.prototype.renderWorld=function(){worldF.call(this);const panel=document.getElementById('v30aPerfPanel');if(panel){const e=panel.querySelector('.v32e14-person-prof');if(e)e.textContent=e.textContent.replace(/^E14 Person leaf/,'F Person leaf');let x=panel.querySelector('.v32f-perf');if(!x){x=document.createElement('div');x.className='small muted v32f-perf';panel.appendChild(x);}x.textContent=`F military readiness observer ≈ ${Number(statsF(this.world).perfMilitaryReadinessMs||0).toFixed(1)}ms · combat OFF`;}};}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`.v32f-ready{margin:0 0 12px;padding:12px;border:1px solid rgba(241,188,92,.38);border-radius:12px;background:rgba(160,105,35,.08)}.v32f-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:8px 0}.v32f-grid span{padding:6px 7px;border-radius:8px;background:rgba(255,255,255,.045);font-size:11px}.v32f-cohorts{display:grid;gap:5px;margin-top:7px}.v32f-cohorts>div{padding:6px 7px;border-radius:8px;background:rgba(255,255,255,.035)}@media(max-width:760px){.v32f-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(st);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32F'))NS.PATCH_NOTES.unshift({version:'V0.32F',date:'2026-09-28',title:'Military Readiness + V0.32 Closure',summary:'E14 장기주행에서 드러난 무기고/장비 교착과 Proposal 관측 불일치를 정리하고, 실제 Formation 위치·도로망·식량 접근을 보급/준비태세로 연결해 전쟁 V1 직전의 군사사회를 완성합니다. 전투는 여전히 비활성입니다.',sections:[['무기고·장비 파이프라인',['무기고가 없고 실제 현역/대장간/철공 조건이 갖춰진 국가에서는 대장간이 무기고 착공에 필요한 소량의 실제 철 재고를 우선 보존합니다.','철은 생성되지 않으며 기존 제련소가 만든 철만 예약됩니다. 무기고 착공 시 기존 startConstruction/payBuild가 실제 철·목재·석재·Gold를 소비합니다.','무기고가 착공 또는 완공되면 철 예약은 즉시 해제되고 기존 도구 생산 흐름으로 돌아갑니다.']],['Formation Supply / Readiness V1',['Cohort 보급을 고정 누적 보너스가 아니라 현재 Formation 위치에서 실제 자국 지원 정착지까지의 내부 route cost, 도로 효과, 식량 접근으로 다시 계산합니다.','병사는 이미 Person으로 식량을 소비하므로 군사 보급이 별도 식량을 이중 소비하지 않습니다.','준비태세는 훈련·실제 장비 충족·보급·사기를 합성한 관측값이며 0.33 Combat에서 사용할 수 있도록 저장/telemetry/UI에 노출합니다.']],['Construction Proposal 정합성',['E4가 실제 startConstruction 단계에서 PAYMENT_REJECTED/STRATEGIC_GATE 등으로 막힌 뒤에도 E8 Proposal이 READY로 재계산하던 관측 불일치를 수정합니다.','현재 intent가 실제 BLOCKED 상태이면 Proposal도 같은 concrete blocker를 표시합니다.']],['성능·경제 관측',['E14 harvest profiler가 work tile의 world reference를 받지 못해 항상 0이던 계측을 수정합니다.','F 보급/준비태세 자체의 저빈도 비용을 별도로 기록합니다.','세계 Gold 분포는 snapshot 시 Top-1/Top-2 money-supply share만 추가 관측하며 재분배나 Gold 생성 규칙은 넣지 않습니다.']],['0.32 마감',['Person-backed 병력, Garrison/Field Cohort, Formation 이동, 군사시설, 장비, 보급, 준비태세까지 0.32 범위로 마감합니다.','전쟁 선포·전투·피해·전사/부상/포로·후퇴·점령·영토 변경은 V0.33 전쟁 V1 범위입니다.','Transit Trade 방향은 유지하지만 F에는 실제 중계무역 경제를 추가하지 않습니다.']]]});
NS.V032F={revision:REV32F,attachWorld:attachF,stats:statsF,state:stateF,militarySummary:militarySummaryF,armoryPipeline:armoryPipelineF,updateReadiness:updateReadinessF,combat:false,seriesClosed:true};
try{const ui=window.villageObserver;if(ui){ui.world=attachF(ui.world);for(const v of ui.world.activeVillages||[])updateReadinessF(v,ui.world,true);ui.renderHeader?.();ui.render?.();}}catch(e){console.error('V0.32F startup attach failed',e);}
})(window.VSim);
