
/* V0.33I3C — Sequential Combat Resolution V1. Combat-only change:
 * within a stage both side casualties are selected before either side is mutated;
 * successive stages use real surviving Person and updated Screen. */
(function(NS){'use strict';
const VERSION='0.33I3C',REV='sequential-person-casualties-v1',PHASES=['OPENING','CONTACT','MELEE'];
const clone=x=>JSON.parse(JSON.stringify(x));
const round=x=>Math.round(Number(x||0)*10000)/10000;
const clamp=(x,l,h)=>Math.max(l,Math.min(h,x));
const active=rows=>NS.V033I2.activePeople(rows);
const merge=(into,add)=>{into.count+=Number(add.count||0);for(const[id,v]of Object.entries(add.byNation||{})){const r=into.byNation[id]||(into.byNation[id]={dead:0,wounded:0});r.dead+=Number(v.dead||0);r.wounded+=Number(v.wounded||0);}};
const summed=(z)=>Object.values(z.byNation||{}).reduce((a,c)=>({dead:a.dead+(c.dead||0),wounded:a.wounded+(c.wounded||0)}),{dead:0,wounded:0});
function selection(w,war,rows,rate,enemySide,pen,maxRemaining,tileId){
 const people=active(rows).map(x=>({v:x.v,p:x.p}));
 if(!people.length||rate<=0||maxRemaining<=0)return{roll:{expected:0,count:0,chosen:[]},tuned:0};
 const tuned=Number(NS.V033E1?.smallUnitCasualtyRate?.(w,war,rows,rate,tileId,enemySide)??rate);
 const rolled=NS.V033I2.casualties(people,tuned,Number(pen||0));
 const chosen=rolled.chosen.slice(0,Math.max(0,maxRemaining));
 return{roll:{expected:rolled.expected,count:chosen.length,chosen},tuned};
}
function resolveRound(w,war,eng,rows,roundNumber,applyCasualties){
 const initial=NS.V033I3B.calculateRound(w,war,eng,rows,roundNumber),frozenWeights={...initial.a.phaseWeights};
 const startN={A:active(rows.a).length,B:active(rows.b).length};
 // No more than 30% (rounded up) of a side's entering manpower can be lost
 // during one calendar-round; prevents chained per-phase attrition blowups.
 const cap={A:Math.ceil(startN.A*.30),B:Math.ceil(startN.B*.30)};
 const total={A:{count:0,byNation:{}},B:{count:0,byNation:{}}};
 const phases=[];let aPower=0,bPower=0;
 for(const phase of PHASES){
  const weight=Number(frozenWeights[phase]||0);if(weight<=0)continue;
  const beforeA=active(rows.a).length,beforeB=active(rows.b).length;
  if(!beforeA||!beforeB)break;
  const c=NS.V033I3B.calculateRound(w,war,eng,rows,roundNumber,frozenWeights);
  const factorA=c.a.rawPower>0?c.a.power/c.a.rawPower:0,factorB=c.b.rawPower>0?c.b.power/c.b.rawPower:0;
  const pA=Math.max(0,Number(c.a.phasePower[phase]||0)*weight*factorA),pB=Math.max(0,Number(c.b.phasePower[phase]||0)*weight*factorB);
  aPower+=pA;bPower+=pB;
  const ratio=Math.max(pA,pB)/Math.max(.1,Math.min(pA,pB));
  const lose=clamp(.10+(ratio-1)*.055,.09,.30),win=clamp(.035+(1/ratio)*.055,.025,.12);
  // Victim-side damage requires positive ATTACKING phase power.
  // E.g. sword-only defenders cannot inflict casualties in OPENING.
  const ra=pB<=1e-10?0:(pA>=pB?win:lose)*weight;
  const rb=pA<=1e-10?0:(pB>=pA?win:lose)*weight;
  const pickA=selection(w,war,rows.a,ra,'B',c.b.penetration,cap.A-total.A.count,eng.tileId);
  const pickB=selection(w,war,rows.b,rb,'A',c.a.penetration,cap.B-total.B.count,eng.tileId);
  // Both target selections completed from the same pre-stage roster.
  const ca=applyCasualties(w,war,rows.a,ra,eng.tileId,'B',eng,c.b,{...pickA,phase,deferSmallUnitRecord:true});
  const cb=applyCasualties(w,war,rows.b,rb,eng.tileId,'A',eng,c.a,{...pickB,phase,deferSmallUnitRecord:true});
  merge(total.A,ca);merge(total.B,cb);
  const dA=summed(ca),dB=summed(cb);
  phases.push({phase,weight:round(weight),powerA:round(pA),powerB:round(pB),A:{before:beforeA,after:active(rows.a).length,dead:dA.dead,wounded:dA.wounded,screen:round(c.a.screen),ranged:c.a.rangedPeople},B:{before:beforeB,after:active(rows.b).length,dead:dB.dead,wounded:dB.wounded,screen:round(c.b.screen),ranged:c.b.rangedPeople}});
 }
 // Maintain old E1 protection's per-round casualty bookkeeping instead of
 // incorrectly considering different phases on the same day separate rounds.
 for(const [s,enemy]of [['A','B'],['B','A']])NS.V033E1?.recordSmallUnitCasualties?.(w,war,rows[s.toLowerCase()],{count:total[s].count,byNation:total[s].byNation,enemySide:enemy});
 const sequential={model:REV,phases,roundCasualtyCap:cap,openingOnlyRanged:true,roundStart:startN};
 initial.sequential33I3C=sequential;
 return{combat:initial,aPower,bPower,ca:total.A,cb:total.B,sequential};
}
const oldBattleTelemetry=NS.V033I2.battleTelemetry;
NS.V033I2.battleTelemetry=function(c){const d=oldBattleTelemetry(c);if(c?.sequential33I3C){d.model='equipment-tactical-v3-sequential';d.sequential33I3C=clone(c.sequential33I3C);}return d;};
const oldRoundRecord=NS.V033I3.round;
NS.V033I3.round=function(w,war,eng,rows,before,calc,power,cas,winner){
 const v=oldRoundRecord(w,war,eng,rows,before,calc,power,cas,winner);
 const record=NS.V033I3.records(w,eng.tileId).find(x=>x.id===eng.id);
 const last=record?.rounds?.find(x=>Number(x.number)===Number(eng.rounds));
 if(last&&calc?.sequential33I3C)last.sequential33I3C=clone(calc.sequential33I3C);
 return v;
};
// The D callback uses this method at runtime. Neither unit movement nor
// isolated-world calendar tick is patched here.
NS.V033I3C={version:VERSION,revision:REV,resolveRound};
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v33i3c={revision:REV,phaseLoss:'simultaneous-per-stage',capFraction:.30};if(d.v33i3b)d.v33i3b.phaseCasualties='superseded-by-I3C';return d;};
NS.World.from=function(d){const updated=String(d?.version||'')===VERSION;const w=oldFrom(updated?{...d,version:'0.33I3B'}:d);w.v33i3c={revision:REV,phaseLoss:'simultaneous-per-stage',capFraction:.30};if(w.v33i3b)w.v33i3b.phaseCasualties='superseded-by-I3C';return w;};
const oldJson=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJson.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{}, {v33I3CRevision:REV,combatModel33I3B:'I3B inherited reference only; superseded by I3C stage casualty resolution.',sequentialCombat33I3C:'First round OPENING→CONTACT→MELEE with simultaneous casualty selection per stage; updates actual Person before subsequent phases. Later rounds MELEE only. 30% per-round casualty cap, existing protection/death/recovery lifecycle retained.'});return d;};
const oldSave=NS.SaveSystem;
function dl(name,text,type='application/json'){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([text],{type}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...oldSave,save(w){localStorage.setItem('village-observer-v0-33i3c',JSON.stringify(w.serialize()));},load(){const s=localStorage.getItem('village-observer-v0-33i3c');return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},export(w){dl(`village-observer-v033I3C-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v033I3C-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),t=NS.V032E14?.validateCSV?.(csv);if(t&&!t.ok)throw Error('CSV schema mismatch');dl(`village-observer-v033I3C-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');},exportScenario(w,meta=null){const old=oldSave.exportScenario; if(!old)throw Error('scenario export not found');return old(w,{...(meta||w.testScenario||{}),intendedVersion:VERSION});}};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const v=oldHeader.call(this),b=this.q?.('versionBadge')||document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33I3C</strong>';document.title='Village Observer V0.33I3C';return v;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33I3C'))NS.PATCH_NOTES.unshift({version:'V0.33I3C',date:'2026-10-08',title:'Sequential Combat Resolution V1 — 실제 개전 사격',summary:'OPENING의 활·투창 공격이 실제 Person 사상자를 발생시키고, 그 결과를 CONTACT/MELEE에 반영합니다. 각 단계 내 양측 피해를 동시 선택하고 과도한 중복 피해를 상한으로 억제합니다.',sections:[['순차 전투',['첫 라운드 원거리 OPENING→CONTACT→MELEE 순서로 실제 병력을 갱신합니다. 원거리 무기 없는 전투는 CONTACT→MELEE 순서이며 이후 라운드는 MELEE만 실행합니다.','각 단계에서 양측 피해 대상을 먼저 뽑은 뒤 동시에 반영하므로, 같은 단계의 공격이 선후 처리 순서로 유리해지지 않습니다.']],['실제 선제 피해',['OPENING 공격력 0인 근접 전용 부대는 OPENING 피해를 줄 수 없습니다. 활이나 투창이 발생시킨 전사·부상은 다음 단계의 공격 인원·Screen에 반영됩니다.','단계별 사상자 확률은 기존 0.33D 사상률에 단계 가중치를 곱해 배분합니다. 각 라운드 시작 인원의 30%(올림)를 인명 손실 상한으로 제한합니다.']],['관측·호환',['BATTLE33과 I3 전투 기록관에 단계별 병력·전사·부상·전투력을 기록합니다.','장비 회수·유실, 방호·관통, 고유 Person 전사/부상, 3연패 전열 붕괴, 무기 등록부 및 격리 시나리오를 유지합니다.','I3B 이전의 이미 종료된 전투 기록에는 과거의 단계별 사상자를 역산해 채우지 않습니다.']]]});
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('I3C initial render',e);}
})(window.VSim);

