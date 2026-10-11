
/* V0.33I3B — ranged-only opening and phase-consistent native B/C/D tests.
   I2 casualties, armor, Person equipment and D engagement remain authoritative.
   No independent phase casualty rolls are introduced. */
(function(NS){'use strict';
const VERSION='0.33I3B',REV='ranged-opening-first-contact-v1';
const OPEN={OPENING:.35,CONTACT:.20,MELEE:.45},NO_RANGED={OPENING:0,CONTACT:4/13,MELEE:9/13},LATER={OPENING:0,CONTACT:0,MELEE:1};
const MELEE_REF=.92,CONTACT_REF=.45*.92+.75*.8;
const REF_OPEN=.20*CONTACT_REF+.45*MELEE_REF;
const REF_NO_RANGED=NO_RANGED.CONTACT*CONTACT_REF+NO_RANGED.MELEE*MELEE_REF;
const C=(x,lo,hi)=>Math.max(lo,Math.min(hi,Number(x)||0));
const active=rows=>NS.V033I2.activePeople(rows);
const gear=p=>NS.V033I2.gear(p);
const weaponStats=p=>gear(p).weapon?.stats||{};
function hasRanged(rows){return active(rows).some(x=>Number(weaponStats(x.p).ranged||0)>0);}
function weightsFor(rows,round){if(round>1)return{...LATER};return hasRanged(rows.a)||hasRanged(rows.b)?{...OPEN}:{...NO_RANGED};}
function reference(weights,round){return round>1?MELEE_REF:weights.OPENING?REF_OPEN:REF_NO_RANGED;}
function components(s,screen){const melee=Number(s.melee||0),ranged=Number(s.ranged||0),reach=Number(s.reach||0),sustain=Number(s.rangedSustain||0);return{OPENING:1.10*ranged,CONTACT:.45*melee+.75*reach,MELEE:melee+ranged*sustain*screen};}
function profile(rows,round=1,weights=null){
  const people=active(rows),manpower=people.length,meleeCount=people.filter(x=>gear(x.p).weapon?.mode!=='RANGED').length,screen=NS.V033I2.screenCoverage(meleeCount,manpower);
  const w=weights|| (round>1?LATER:hasRanged(rows)?OPEN:NO_RANGED),ref=reference(w,round);
  const phases={OPENING:0,CONTACT:0,MELEE:0};let penetration=0,protection=0;
  for(const x of people){const s=weaponStats(x.p),p=components(s,screen);for(const k in phases)phases[k]+=p[k];penetration+=Number(s.penetration||0);protection+=Number(gear(x.p).armor?.stats?.protection||0);}
  for(const k in phases)phases[k]=manpower?phases[k]/manpower:0;
  const phaseScore=Object.keys(phases).reduce((a,k)=>a+w[k]*phases[k],0);
  return{manpower,meleeCount,screen,phases,phaseWeights:{...w},phaseScore,qualityMultiplier:phaseScore/ref,penetration:manpower?penetration/manpower:0,protection:manpower?protection/manpower:0,phasePower:{OPENING:0,CONTACT:0,MELEE:0},reference:ref,rangedPeople:people.filter(x=>Number(weaponStats(x.p).ranged||0)>0).length};
}
function roundPower(rows,pr,enemyPen){let total=0;const ref=pr.reference,weights=pr.phaseWeights;
  for(const x of rows||[])for(const u of x.force||[]){const ps=(u.people||[]).filter(p=>p.alive&&p.militaryStatus32A==='active');if(!ps.length)continue;
    const cs=(u.cohortIds||[]).map(id=>(x.v?.military32A?.cohorts||[]).find(c=>String(c.id)===String(id))).filter(Boolean);
    const avg=k=>cs.length?cs.reduce((a,c)=>a+Number(c[k]||0),0)/cs.length:0;
    const base=.42+avg('training')/250+(avg('supply32F')||avg('supply'))/280+avg('morale')/400;
    const cmd=u.formation?Number(NS.V033E1?.commanderCombatMultiplier?.(x.v,u.formation)||1):1;
    for(const p of ps){const c=components(weaponStats(p),pr.screen),ep=NS.V033I2.personProtection(p,enemyPen),factor=base*cmd*(1+.30*ep)/ref;
      for(const k in c)pr.phasePower[k]+=factor*c[k];
      total+=factor*(weights.OPENING*c.OPENING+weights.CONTACT*c.CONTACT+weights.MELEE*c.MELEE);
    }
  }
  return total;
}
function terrainFactor(w,war,side,tileId){const t=w?.map?.get?.(Number(tileId));if(!t)return 1;const ids=side==='A'?(war?.sideAIds?.length?war.sideAIds:[war?.attackerId]):(war?.sideBIds?.length?war.sideBIds:[war?.defenderId]);if(!ids.map(Number).includes(Number(t.ownerId)))return 1;let f={forest:1.08,rock:1.11,mountain:1.20}[t.terrain]||1;if((t.buildings||[]).includes('watchtower'))f+=.07;if((t.buildings||[]).includes('fortification'))f+=.12;if((t.buildings||[]).includes('barracks'))f+=.04;const owner=(w?.villages||[]).find(v=>Number(v.id)===Number(t.ownerId));if(owner&&Number(owner.coreTileId)===Number(t.id))f+=.06;return f;}
function calculateRound(w,war,eng,rows,round=Number(eng?.rounds||0)+1,frozenWeights=null){
 const weights=frozenWeights||weightsFor(rows,round),a=profile(rows.a,round,weights),b=profile(rows.b,round,weights);
 const ar=roundPower(rows.a,a,b.penetration),br=roundPower(rows.b,b,a.penetration);
 const af=terrainFactor(w,war,'A',eng.tileId),bf=terrainFactor(w,war,'B',eng.tileId);
 const ap=ar*af*(.92+Math.random()*.16),bp=br*bf*(.92+Math.random()*.16);
 const result={a:{...a,power:ap,rawPower:ar,terrainFactor:af,effectiveProtection:NS.V033I2.effectiveProtection(a.protection,b.penetration)},b:{...b,power:bp,rawPower:br,terrainFactor:bf,effectiveProtection:NS.V033I2.effectiveProtection(b.protection,a.penetration)},round,phaseMode:round>1?'SUSTAINED_MELEE':weights.OPENING?'RANGED_OPENING':'DIRECT_CONTACT'};
 return result;
}
function intrinsicUnitPower(v,u){const rows=[{v,force:[u]}],pr=profile(rows,1);return roundPower(rows,pr,0);}
function formationPower(v,f){const ids=new Set((f?.cohortIds||[]).flatMap(cid=>(v?.military32A?.cohorts||[]).find(c=>String(c.id)===String(cid))?.memberIds||[]).map(String));const people=(v?.residents||[]).filter(p=>p.alive&&p.militaryStatus32A==='active'&&ids.has(String(p.id)));return intrinsicUnitPower(v,{formation:f,cohortIds:f?.cohortIds||[],people});}
const prevPublic=NS.V033I2.battleTelemetry;
function battleTelemetry(calc){const d=prevPublic(calc);d.model='equipment-tactical-v2-ranged-opening';d.phaseMode=calc.phaseMode;d.normalizationReference=+calc.a.reference.toFixed(6);d.a.rangedPeople=calc.a.rangedPeople;d.b.rangedPeople=calc.b.rangedPeople;return d;}
Object.assign(NS.V033I2,{version:VERSION,revision:REV,FIRST:{...OPEN},NO_RANGED:{...NO_RANGED},LATER:{...LATER},BASE_FIRST:REF_OPEN,BASE_FIRST_NO_RANGED:REF_NO_RANGED,profile,intrinsicUnitPower,formationPower,calculateRound,battleTelemetry});
if(NS.V033H){NS.V033H.combatFormulaChanged=true;NS.V033H.balanceChanged=true;}
const prevSer=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSer.call(this);d.version=VERSION;d.v33i3b={revision:REV,opening:'ranged-only',contactWhenNoRanged:NO_RANGED.CONTACT,meleeWhenNoRanged:NO_RANGED.MELEE,phaseCasualties:'end-of-round-only'};return d;};
NS.World.from=function(d){const newer=String(d?.version||'')===VERSION;const w=prevFrom(newer?{...d,version:'0.33I3A'}:d);w.v33i3b={revision:REV,opening:'ranged-only',phaseCasualties:'end-of-round-only'};return w;};
const prevJson=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJson.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{}, {v33I3BRevision:REV,combatModel33I3B:'OPENING has ranged damage only; if both sides lack ranged weapons, opening skipped and CONTACT/MELEE weight is 4/13,9/13; later rounds MELEE only; Person casualties still resolve once per round.',aScenarioStatus33I3B:'CLOSED',bcdScenarioStatus33I3B:'ACTIVE'});return d;};
const prevSave=NS.SaveSystem;
function dl(name,text,type='application/json'){const a=document.createElement('a'),blob=new Blob([text],{type});a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
NS.SaveSystem={...prevSave,save(w){localStorage.setItem('village-observer-v0-33i3b',JSON.stringify(w.serialize()));},load(){const s=localStorage.getItem('village-observer-v0-33i3b');return s?NS.World.from(JSON.parse(s)):prevSave.load?.();},export(w){dl(`village-observer-v033I3B-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v033I3B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);if(check&&!check.ok)throw Error('CSV schema mismatch');dl(`village-observer-v033I3B-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');},exportScenario(w,meta=null){const x=NS.V032E11.scenarioWrapper(w,meta||w.testScenario);x.meta={...x.meta,intendedVersion:VERSION};x.world.version=VERSION;x.world.testScenario={...x.meta};if(x.world.v32e11)x.world.v32e11.scenario={...x.meta};dl(`village-observer-v033I3B-scenario-${x.meta.id}.json`,JSON.stringify(x));return x;}};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this),b=this.q?.('versionBadge')||document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33I3B</strong>';document.title='Village Observer V0.33I3B';return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33I3B'))NS.PATCH_NOTES.unshift({version:'V0.33I3B',date:'2026-10-08',title:'원거리 개전·근접 접촉 단계 재설계',summary:'A1/A2 실험 종료. OPENING은 원거리 무기만 반영하고, 근접 전용 교전은 CONTACT/MELEE로 재정규화합니다. B·C·D 통제실험을 I3B 전술 공식으로 재개합니다.',sections:[['단계 의미',['원거리 무기의 개전 사격만 OPENING에 기여합니다. 창·검·도끼는 OPENING 공격력이 0입니다.','양측 모두 원거리 무기가 없는 첫 라운드는 OPENING 0%, CONTACT 30.77%, MELEE 69.23%입니다. 원거리 무기가 있는 첫 라운드는 기존 35%/20%/45%이며 이후에는 MELEE 100%입니다.','군사력 합성·전투 기록관·Formation 표시에도 같은 전술 공식을 사용합니다.']],['사상자 및 보존',['전투 단계별 조기 사상자 모델은 도입하지 않았습니다. 피해는 기존처럼 라운드 종료 시 한 번 정산합니다.','장비 회수·유실, Person 부상·사망과 정식 Engagement 타이머는 유지합니다.']],['시나리오',['A1/A2는 완료·동결하여 이번 실험 파일에서 제외합니다.','B 궁병 Screen, C 방호/관통, D 개전 화력/지속 난전 3개를 동일한 6:6 격리 환경에서 검증합니다.']]]});
NS.V033I3B={version:VERSION,revision:REV,openingWeights:{...OPEN},noRangedWeights:{...NO_RANGED},laterWeights:{...LATER},refs:{ranged:REF_OPEN,noRanged:REF_NO_RANGED,later:MELEE_REF},calculateRound};
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('I3B init',e);}
})(window.VSim);
