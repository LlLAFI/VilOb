/* V0.35H1B1A — wartime checkpoint continuity.
 * Repairs lossy legacy formation rehydration after the full prior loader chain.
 * No forced tactical actions, RNG calls, occupation progress grants or timer advances.
 */
(function(NS){'use strict';
if(!NS?.World||!NS?.V035H1A||!NS?.V035H1B1||!NS?.MilitaryFormation)return;
const VERSION='V0.35H1B1A',PRIOR='V0.35H1B1';
const copy=x=>JSON.parse(JSON.stringify(x));
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const key=x=>String(x?.id);
const signature=x=>JSON.stringify(x);
let latest=null,latestWorld=null;
// Legacy MilitaryFormation.from only copied the V0.32D constructor fields, and
// consequently erased V0.33C-I military timers, war assignments and command
// ownership when a loader/UI normalized a plain JSON Formation.
const originalFormationFrom=NS.MilitaryFormation.from;
NS.MilitaryFormation.from=function(saved){
 const f=originalFormationFrom.call(this,saved);
 if(saved&&typeof saved==='object')Object.assign(f,saved);
 if(Array.isArray(saved?.cohortIds))f.cohortIds=[...saved.cohortIds];
 return f;
};
function wartimeData(raw){return (raw?.v33?.war?.wars||[]).filter(x=>x.status==='ACTIVE');}
function diagnostic(raw,w){
 const result={format:'vilob-v035h1b1a-war-rehydration-v1',version:VERSION,date:[raw.year,raw.season,raw.day],activeWars:wartimeData(raw).map(x=>({warId:x.id,sides:[x.sideAIds||[],x.sideBIds||[]]})),formationCount:0,restoredFormations:0,missingFormations:[],changedFormationFields:0,occupationCount:0,restoredOperations:0,changedOperations:0,warStateChanged:false,status:'CHECKING'};
 latest=result;
 const villages=new Map((w.villages||[]).map(v=>[key(v),v]));
 for(const sv of raw.villages||[]){if(!sv.v32dMilitary||!Array.isArray(sv.v32dMilitary.formations))continue;
  const v=villages.get(key(sv));if(!v){result.missingFormations.push({villageId:sv.id,reason:'MISSING_NATION'});continue;}
  const formations=new Map((v.v32dMilitary?.formations||[]).map(f=>[key(f),f]));
  // Do not replace the military registry wholesale: restore each existing
  // Formation in-place so downstream cohort/war links continue to point to it.
  for(const sf of sv.v32dMilitary.formations){result.formationCount++;
   const f=formations.get(key(sf));if(!f){result.missingFormations.push({villageId:sv.id,formationId:sf.id,reason:'MISSING_FORMATION'});continue;}
   if(signature(sf)!==signature(f))result.changedFormationFields++;
   // Restore *all* serialized fields, not just the original 0.32D subset;
   // also delete attach-created own fields not present in the saved instance.
   for(const k of Object.keys(f))if(!own(sf,k))delete f[k];
   Object.assign(f,copy(sf));
   Object.setPrototypeOf(f,NS.MilitaryFormation.prototype);
   result.restoredFormations++;
  }
  // A valid checkpoint cannot silently acquire or lose a military Formation.
  if(formations.size!==sv.v32dMilitary.formations.length){
   for(const f of formations.values())if(!sv.v32dMilitary.formations.some(sf=>key(sf)===key(f)))result.missingFormations.push({villageId:sv.id,formationId:f.id,reason:'EXTRA_FORMATION'});
  }
  // Preserve the original timing of formation reviews without resetting the
  // rest of the Nation's post-load caches and object identities.
  for(const k of ['v33dLastAssignmentCal','v33dLastWarPlanCal'])if(own(sv,k))v[k]=copy(sv[k]);
 }
 const tiles=new Map((w.map?.tiles||[]).map(t=>[key(t),t]));
 for(const st of raw.map?.tiles||[]){
  const t=tiles.get(key(st));
  if(!own(st,'v33OccupationOperation')){if(t&&own(t,'v33OccupationOperation')){delete t.v33OccupationOperation;result.changedOperations++;}continue;}
  result.occupationCount++;if(!t){result.missingFormations.push({tileId:st.id,reason:'MISSING_OCCUPATION_TILE'});continue;}
  if(signature(st.v33OccupationOperation)!==signature(t.v33OccupationOperation))result.changedOperations++;
  t.v33OccupationOperation=copy(st.v33OccupationOperation);
  result.restoredOperations++;
 }
 // War pulse/engagement schedulers live outside the H1A compact fingerprint.
 // Legacy attachWorld hooks can re-plan and mutate them without violating that
 // signature, so the authenticated saved war state must be authoritative.
 if(wartimeData(raw).length){
  if(own(raw,'v33')&&own(raw.v33,'war')){
   result.warStateChanged=signature(raw.v33.war)!==signature(w.v33War);
   w.v33War=copy(raw.v33.war);
  }
  for(const k of ['v33d','v33c','v33e5'])if(own(raw,k))w[k]=copy(raw[k]);
 }
 if(result.missingFormations.length){result.status='MISSING_MILITARY_ENTITIES';throw Error('전쟁 체크포인트에서 군사 개체 누락/증가가 발견됐습니다. 원본을 보존하고 진단을 확인하세요.');}
 result.status='RESTORED';return result;
}
const fromBefore=NS.World.from;
NS.World.from=function(raw,...args){const w=fromBefore.call(this,raw,...args);
 // Only checkpoint-era input, never historical migration or fresh world.
 if(raw?.v35h1a?.enabled&&raw?.v33?.war){
  try{latestWorld=w;latest=diagnostic(raw,w);}catch(e){if(latest)latest.error=String(e.message);throw e;}
 }
 return w;
};
function report(){if(!latest)return null;const out=copy(latest),w=latestWorld;if(w){
 out.current={year:w.year,season:w.season,day:w.day,calendarOrdinalDay:w.calendarOrdinalDay?.(),warLastPulseCal:w.v33War?.lastPulseCal??null,
 activeWars:(w.v33War?.wars||[]).filter(x=>x.status==='ACTIVE').map(x=>({warId:x.id,status:x.status})),
 formations:(w.villages||[]).flatMap(v=>(v.v32dMilitary?.formations||[]).map(f=>({nationId:v.id,formationId:f.id,tileId:f.tileId,targetTileId:f.targetTileId,status:f.status,assignedWarId:f.v33dAssignedWarId,nextMoveCal:f.v33c1NextMoveCal,mission:f.v33dMission,cohorts:[...(f.cohortIds||[])]}))),
 occupations:(w.map?.tiles||[]).filter(t=>t.v33OccupationOperation).map(t=>({tileId:t.id,warId:t.v33OccupationOperation.warId,progress:t.v33OccupationOperation.progress,requirement:t.v33OccupationOperation.requirement,status:t.v33OccupationOperation.status,lastProgressCal:t.v33OccupationOperation.lastProgressCal}))};
 }return out;}
function exportDiagnostic(){if(!latest)throw Error('전쟁 체크포인트 복원 기록이 없습니다.');const data=report();if(typeof document!=='undefined'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`vilob-v035H1B1A-war-load-${latest.date?.[0]||'unknown'}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}return data;}
function install(ui){if(typeof document==='undefined')return;const host=document.getElementById('v035h1aPanel');if(!host)return;
 if(!document.getElementById('v035h1b1aWarDiag')){const btn=document.createElement('button');btn.id='v035h1b1aWarDiag';btn.textContent='전쟁 복원 진단 JSON';btn.onclick=()=>{try{exportDiagnostic();}catch(e){const st=document.getElementById('v035h1aStatus');if(st)st.textContent=e.message;}};host.querySelector?.('.button-grid')?.appendChild(btn);}
}
if(NS.UI){const oldRender=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...args){const r=oldRender.apply(this,args);install(this);return r;};const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=oldHeader.apply(this,args);const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-24',title:'Wartime Checkpoint Continuity · H1B1A',summary:'전쟁 중 체크포인트에서 Formation의 전체 필드·이동 시각·배속·점령 작전과 전쟁 제어 상태를 보존하며 원본에 없는 병력을 생성하지 않습니다.',sections:[['복원',['V0.32D 객체 복원 시 누락되던 V0.33C~I Formation 고유 필드를 보존합니다.','전쟁/점령 진행 정보 및 이동 예정일은 원본 체크포인트가 우선합니다.','필수 Formation이 누락되면 보정 생성 대신 오류로 차단합니다.']],['회귀',['전쟁 중 저장→복원→후속 진행을 검사합니다.','기존 H1B1 진단, 저장 서명 검증, 기술 43개 및 CSV 1,683열을 유지합니다.']]]});
NS.V035H1B1A=Object.freeze({version:VERSION,report,exportDiagnostic});
})(window.VSim);
