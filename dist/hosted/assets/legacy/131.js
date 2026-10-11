
(function(NS){'use strict';
if(!NS||!NS.World||!NS.Village||!NS.Telemetry||!NS.V033F5A5)return;
const VERSION='0.33F5A8',REV='recovery-essential-investment';
const clone=x=>{try{return JSON.parse(JSON.stringify(x));}catch{return x;}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,Number(x)||0));
function ensure(w,src=null){
  if(!w)return null;
  if(src?.v33f5a8&&!w.v33f5a8)w.v33f5a8=clone(src.v33f5a8);
  const z=w.v33f5a8||(w.v33f5a8={revision:REV,stats:{},nations:{}});
  z.revision=REV;z.stats=z.stats||{};z.nations=z.nations||{};
  const defs={recoveryEssentialReviews:0,recoveryEssentialStarts:0,recoveryEssentialSawmillStarts:0,recoveryEssentialFarmStarts:0,recoveryEssentialRejected:0,recoveryEssentialProjectCapBlocks:0,recoveryEssentialTrueSurvivalBlocks:0,recoveryEssentialWarBlocks:0,recoveryEssentialNoNeed:0,recoveryEssentialReserveOverrides:0};
  for(const[k,d]of Object.entries(defs))z.stats[k]=Number(z.stats[k]??d);
  for(const v of w.villages||[]){const n=z.nations[String(v.id)]||(z.nations[String(v.id)]={});for(const[k,d]of Object.entries({lastType:'NONE',lastBlocker:'NONE',lastNeedScore:0,lastKey:'',starts:0,sawmillStarts:0,farmStarts:0}))n[k]=n[k]??d;}
  return z;
}
function nstate(v,w){const z=ensure(w);return z.nations[String(v.id)]||(z.nations[String(v.id)]={lastType:'NONE',lastBlocker:'NONE',lastNeedScore:0,lastKey:'',starts:0,sawmillStarts:0,farmStarts:0});}
function trueSurvival(v){return!!(v?.v30b2?.survival?.active||v?.v30b4?.survival?.active);}
function recoveryOnly(v){return!!v?.recoveryState?.active&&!trueSurvival(v);}
function atWar(v,w){return(w?.wars||[]).some(x=>!x?.ended&&(x.attackerId===v.id||x.defenderId===v.id||(x.sideAIds||[]).includes(v.id)||(x.sideBIds||[]).includes(v.id)));}
function projectCount(v){return(v.constructionProjects||[]).filter(p=>!p?.v17Marker).length+(v.landDevelopmentProjects||[]).length+(v.buildingUpgradeProjects||[]).length+(v.specializationProjects||[]).length;}
function projectCap(v){let n=1;if(Number(v.population?.()||0)>=25)n++;if(Number(v.population?.()||0)>=60)n++;if(v.hasTech?.('ADMINISTRATION'))n++;return NS.V034D2?.projectCap?.(v)??Math.min(5,n);}
function freeSlots(v){return Math.max(0,projectCap(v)-projectCount(v));}
function stock(v,k){if(typeof v.resourceTotal==='function'){const q=Number(v.resourceTotal(k));if(Number.isFinite(q))return q;}return Number(v?.[k]||0);}
function countBuilding(v,w,type){let n=0;for(const id of v.territory||[]){const t=w.map?.get?.(Number(id));if(t)n+=(t.buildings||[]).filter(x=>x===type).length;}return n;}
function pending(v,type){if(type==='SAWMILL')return(v.constructionProjects||[]).some(p=>p?.type==='sawmill'||p?.building==='sawmill');if(type==='ANCIENT_FARM')return(v.buildingUpgradeProjects||[]).some(p=>p?.to==='ancient_farm');return false;}
function trait(v,k){return Number(NS.AIProfiles?.trait?.(v,k)??1);}
function needInfo(v,w,row){
  const pop=Math.max(1,Number(v.population?.()||0)),fd=Number(v.foodReserveDays?.()||0),h=Number(v.avgHunger?.()||0),wood=stock(v,'wood');
  if(row?.type==='SAWMILL'){
    const exitWood=Math.max(16,pop*.4),target=Math.max(1,Number(v.targetWood?.(w)||80)),have=countBuilding(v,w,'sawmill');
    const threshold=Math.max(exitWood*1.15,target*.55),needed=wood+1e-9<threshold;
    const urgency=clamp((threshold-wood)/Math.max(1,threshold),0,1.5);
    return{needed,score:100+urgency*75+(have===0?15:0)+(trait(v,'production')-1)*12,metric:wood,target:threshold,reason:'WOOD_RECOVERY'};
  }
  if(row?.type==='ANCIENT_FARM'){
    const needed=fd<42||h>=15,urgency=clamp((42-fd)/24,0,1.5)+clamp((h-10)/30,0,.8);
    return{needed,score:100+urgency*70+(trait(v,'production')-1)*8,metric:fd,target:42,reason:'FOOD_RECOVERY'};
  }
  return{needed:false,score:0,metric:0,target:0,reason:'NOT_ESSENTIAL'};
}
function inferReject(v,row){if(!row?.site?.t)return'NO_SITE';if(freeSlots(v)<=0)return'PROJECT_CAP';const c=row.cost||{};if(Number(c.wood||0)>stock(v,'wood')+1e-9)return'WOOD';if(Number(c.stone||0)>stock(v,'stone')+1e-9)return'STONE';return'START_REJECTED';}
function note(v,w,type,blocker,score=0,extra={}){
  const z=ensure(w),n=nstate(v,w),key=`${type}:${blocker}:${Math.round(score)}`;
  n.lastType=type;n.lastBlocker=blocker;n.lastNeedScore=+Number(score||0).toFixed(1);
  if(n.lastKey!==key){n.lastKey=key;w.telemetry?.record?.('RECOVERY_ESSENTIAL_REVIEW33F5A8',w,{village:v.name,villageId:v.id,type,blocker,needScore:n.lastNeedScore,...extra});}
}
function startEssential(v,w,row,info){
  let ok=false;const z=ensure(w);
  /* Recovery-essential construction may spend below ordinary strategic reserve floors, but never creates resources or bypasses physical cost/space/project checks. */
  const hadPlan=!!v.aiPlan,oldRes=hadPlan&&v.aiPlan?.reserves?{...v.aiPlan.reserves}:null,oldB2=v.v30b2?.survival?.active,old31=v._v31hIndustryAttempt,old32=v._v32c1MilitaryAttempt;
  try{
    if(v.aiPlan?.reserves)for(const k of Object.keys(v.aiPlan.reserves))v.aiPlan.reserves[k]=0;
    if(v.v30b2?.survival)v.v30b2.survival.active=true;
    v._v31hIndustryAttempt=true;v._v32c1MilitaryAttempt=true;z.stats.recoveryEssentialReserveOverrides++;
    if(row.type==='SAWMILL')ok=!!v.startConstruction?.(w,row.site.t.id,'sawmill','A8_RECOVERY_ESSENTIAL_SAWMILL');
    else if(row.type==='ANCIENT_FARM')ok=!!NS.V033F5A4?.startFarmUpgrade?.(v,w,row.site.t,row.site.index,'A8_RECOVERY_ESSENTIAL_FARM');
  }finally{
    if(oldRes&&v.aiPlan?.reserves)v.aiPlan.reserves={...oldRes};
    if(v.v30b2?.survival)v.v30b2.survival.active=!!oldB2;
    v._v31hIndustryAttempt=old31;v._v32c1MilitaryAttempt=old32;
  }
  const n=nstate(v,w);
  if(ok){z.stats.recoveryEssentialStarts++;n.starts++;if(row.type==='SAWMILL'){z.stats.recoveryEssentialSawmillStarts++;n.sawmillStarts++;}else{z.stats.recoveryEssentialFarmStarts++;n.farmStarts++;}n.lastType=row.type;n.lastBlocker='STARTED';n.lastNeedScore=+info.score.toFixed(1);n.lastKey=`${row.type}:STARTED:${Math.round(info.score)}`;w.telemetry?.record?.('RECOVERY_ESSENTIAL_STARTED33F5A8',w,{village:v.name,villageId:v.id,type:row.type,tileId:row.site?.t?.id??null,needScore:+info.score.toFixed(1),reason:info.reason,metric:+Number(info.metric||0).toFixed(2),target:+Number(info.target||0).toFixed(2),recoverySinceDay:v.recoveryState?.sinceDay??null,productionTrait:+trait(v,'production').toFixed(2)});return true;}
  z.stats.recoveryEssentialRejected++;const b=inferReject(v,row);note(v,w,row.type,b,info.score,{reason:info.reason,tileId:row.site?.t?.id??null});return false;
}
function tryRecoveryEssential(v,w){
  if(!v||v.status!=='active'||!v.recoveryState?.active)return false;
  const z=ensure(w);z.stats.recoveryEssentialReviews++;
  if(trueSurvival(v)){z.stats.recoveryEssentialTrueSurvivalBlocks++;note(v,w,'NONE','TRUE_SURVIVAL');return false;}
  if(atWar(v,w)){z.stats.recoveryEssentialWarBlocks++;note(v,w,'NONE','WAR');return false;}
  if(freeSlots(v)<=0){z.stats.recoveryEssentialProjectCapBlocks++;note(v,w,'NONE','PROJECT_CAP');return false;}
  const raw=(NS.V033F5A5?.productionProposals?.(v,w,false)||[]),cands=[];
  for(const row of raw){if(!['SAWMILL','ANCIENT_FARM'].includes(row?.type)||pending(v,row.type))continue;const info=needInfo(v,w,row);if(!info.needed)continue;if(!row.site?.t){cands.push({row,info,hard:'NO_SITE'});continue;}cands.push({row,info,hard:null});}
  if(!cands.length){z.stats.recoveryEssentialNoNeed++;note(v,w,'NONE','NO_ESSENTIAL_NEED');return false;}
  cands.sort((a,b)=>b.info.score-a.info.score);
  for(const x of cands){if(x.hard){note(v,w,x.row.type,x.hard,x.info.score,{reason:x.info.reason});continue;}if(startEssential(v,w,x.row,x.info))return true;}
  return false;
}

/* Recovery essential investment owns the first seasonal look before A7/A5 planners see the same slots. */
const seasonPrev=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){try{tryRecoveryEssential(this,w);}catch(e){console.error('V0.33F5A8 recovery essential investment failed',e);}return seasonPrev.call(this,w);};

const snapPrev=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',noteText=''){const s=snapPrev.call(this,w,reason,noteText);if(!s)return s;const z=ensure(w);Object.assign(s.global,{recoveryEssentialReviews33F5A8:z.stats.recoveryEssentialReviews,recoveryEssentialStarts33F5A8:z.stats.recoveryEssentialStarts,recoveryEssentialSawmillStarts33F5A8:z.stats.recoveryEssentialSawmillStarts,recoveryEssentialFarmStarts33F5A8:z.stats.recoveryEssentialFarmStarts,recoveryEssentialRejected33F5A8:z.stats.recoveryEssentialRejected,recoveryEssentialProjectCapBlocks33F5A8:z.stats.recoveryEssentialProjectCapBlocks,recoveryEssentialTrueSurvivalBlocks33F5A8:z.stats.recoveryEssentialTrueSurvivalBlocks,recoveryEssentialWarBlocks33F5A8:z.stats.recoveryEssentialWarBlocks,recoveryEssentialNoNeed33F5A8:z.stats.recoveryEssentialNoNeed,recoveryEssentialReserveOverrides33F5A8:z.stats.recoveryEssentialReserveOverrides});for(const row of s.villages||[]){const v=(w.villages||[]).find(x=>Number(x.id)===Number(row.id));if(!v)continue;const n=nstate(v,w);Object.assign(row,{recoveryEssentialActive33F5A8:v.recoveryState?.active?1:0,recoveryEssentialLastType33F5A8:n.lastType,recoveryEssentialLastBlocker33F5A8:n.lastBlocker,recoveryEssentialStartsNation33F5A8:n.starts,recoveryEssentialSawmillStartsNation33F5A8:n.sawmillStarts,recoveryEssentialFarmStartsNation33F5A8:n.farmStarts});}return s;};
const csvPrev=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csvPrev.call(this),lines=base.split('\n');if(!lines.length)return base;const G=['recoveryEssentialReviews33F5A8','recoveryEssentialStarts33F5A8','recoveryEssentialSawmillStarts33F5A8','recoveryEssentialFarmStarts33F5A8','recoveryEssentialRejected33F5A8','recoveryEssentialProjectCapBlocks33F5A8','recoveryEssentialTrueSurvivalBlocks33F5A8','recoveryEssentialWarBlocks33F5A8','recoveryEssentialNoNeed33F5A8','recoveryEssentialReserveOverrides33F5A8'],R=['recoveryEssentialActive33F5A8','recoveryEssentialLastType33F5A8','recoveryEssentialLastBlocker33F5A8','recoveryEssentialStartsNation33F5A8','recoveryEssentialSawmillStartsNation33F5A8','recoveryEssentialFarmStartsNation33F5A8'],q=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+[...G,...R].map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const row of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+[...G.map(k=>s.global?.[k]),...R.map(k=>row?.[k])].map(q).join(',');}return lines.join('\n');};
const jsonPrev=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonPrev.call(this,w),z=ensure(w);d.version=VERSION;d.v33F5A8=clone(z);Object.assign(d.worldSummary||{},{v33F5A8Revision:REV,recoveryEssentialInvestment33F5A8:'Recovery no longer aliases to true Survival for two direct recovery facilities. While Recovery is active but true Survival and active war are not, a wood-deficit sawmill or food-deficit ancient-farm upgrade may claim one real project slot before ordinary seasonal construction. All physical costs, space, labor and project validation remain authoritative; only ordinary strategic reserve/slot floors are relaxed for the essential attempt.',recoverySafety33F5A8:'True early Survival remains a hard block; quarry, research infrastructure, commerce, roads, military and other discretionary facilities receive no Recovery bypass.',recoveryExit33F5A8:'Recovery exit thresholds are unchanged. A8 only removes the self-lock where Recovery could forbid the facility needed to restore wood or food stability.',aiEditorRoadmap33F5A8:'After this deadlock regression, AIProfile JSON import/export remains the next planned AI Editor foundation step.'});return d;};

const serPrev=NS.World.prototype.serialize,fromPrev=NS.World.from;
NS.World.prototype.serialize=function(){const d=serPrev.call(this);d.version=VERSION;d.v33f5a8=clone(ensure(this));return d;};
NS.World.from=function(d){if(d?.version===VERSION){const src=d,w=fromPrev({...d,version:'0.33F5A7'});ensure(w,src);return w;}const w=fromPrev(d);ensure(w,d);return w;};
function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
const oldSave=NS.SaveSystem;(function(){const KEY='village-observer-v0-33f5a8',fallback=['village-observer-v0-33f5a7','village-observer-v0-33f5a6'];NS.SaveSystem={...oldSave,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v033F5A8-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v033F5A8-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const x=w.telemetry.snapshotsCSV(),c=NS.V032E14?.validateCSV?.(x);if(c&&!c.ok)throw new Error(`CSV schema mismatch: expected ${c.columns} columns; bad rows ${c.bad.slice(0,8).join(', ')}`);dl(`village-observer-v033F5A8-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+x,'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));}};})();

if(NS.UI){const headPrev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){headPrev.call(this);document.title='Village Observer V0.33F5A8';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33F5A8</strong>';const st=this.q?.('runtimeStatus'),z=ensure(this.world);if(st)st.textContent=`✓ V0.33F5A8 Recovery Essential Investment · 복구필수 착공 ${z?.stats?.recoveryEssentialStarts||0}`;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33F5A8'))NS.PATCH_NOTES.unshift({version:'V0.33F5A8',date:'2026-10-05',title:'Recovery Essential Investment',summary:'Recovery가 필요한 생산시설까지 SURVIVAL로 차단해 스스로 회복하지 못하던 교착을 제거합니다. 실제 Survival 우선권과 모든 물리 비용은 그대로 유지합니다.',sections:[['Recovery와 Survival 분리',['조기 생존위기(v30b2/v30b4)와 장기 Recovery를 생산시설 gate에서 구분합니다.','진짜 Survival 중에는 기존처럼 생산 투자 예외가 전혀 없습니다.','Recovery만 활성인 경우에 한해 회복 조건을 직접 개선하는 시설을 별도 검토합니다.']],['복구 필수 투자',['목재가 Recovery 탈출에 필요한 수준보다 낮으면 고대 제재소를 복구 필수시설로 검토합니다.','식량 비축이 42일 미만이거나 평균 Hunger가 높은 경우 고대 경작지→고대 농장 개축을 검토합니다.','한 분기당 국가별 최대 한 개의 복구 필수시설만 먼저 착공하며 기존 실제 프로젝트 슬롯·공간·재료·Gold·노동 검증을 그대로 통과해야 하며, 일반 전략 reserve/산업·군사 슬롯 예약만 복구 필수 착공 순간에 한해 완화합니다.']],['범위 제한',['고대 채석장·학당·도로·상업·군사시설·일반 확장은 Recovery 예외 대상이 아닙니다.','전쟁 중에는 복구 필수 투자도 선행하지 않습니다.','Recovery 종료 조건과 시설 생산량/건설비는 변경하지 않습니다.']],['관측',['복구 필수 검토·착공·제재소/농장 시작·거부·프로젝트 한도·진짜 Survival/전쟁 차단을 Snapshot CSV와 Devlog에 추가합니다.']],['AI Editor 준비',['A7에서 Profile→실제 행동 연결은 검증됐으며, A8은 Custom AI에서도 Recovery가 성향을 영구 무력화하지 않도록 기반 교착만 제거합니다.','다음 단계는 AIProfile JSON import/export 기반입니다.']]]});
NS.V033F5A8={version:VERSION,revision:REV,ensureState:ensure,tryRecoveryEssential,recoveryOnly,trueSurvival,base:'V0.33F5A7',balanceChanged:true};
try{const ui=window.villageObserver;if(ui){ui.world&&ensure(ui.world);ui.renderHeader?.();}}catch(e){console.error('V0.33F5A8 startup attach failed',e);}
})(window.VSim);
