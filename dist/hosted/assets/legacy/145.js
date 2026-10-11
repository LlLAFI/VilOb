
/* V0.33I2 — Equipment-Aware Tactical Combat V1.
   First round 35/20/45; later rounds MELEE-only.
   I1A2 conservation and Person-backed injury/death remain authoritative. */
window.VSim=window.VSim||{};(function(NS){
'use strict';
const VERSION='0.33I2', REV='equipment-aware-tactical-combat-v1';
const FIRST={OPENING:.35,CONTACT:.20,MELEE:.45}, LATER={OPENING:0,CONTACT:0,MELEE:1};
const BASE_FIRST=.35*(.55*.92)+.20*(.45*.92+.75*.80)+.45*.92; // basic spear without ranged support
const BASE_MELEE=.92;
const C=(n,lo=0,hi=1)=>Math.max(lo,Math.min(hi,Number(n)||0));
const item=id=>NS.V033I1?.equipmentRegistry?.[id]||null;
// Character equipment slots are managed by V033I1.ensurePerson, not by a second inventory.
function slots(p){const e=NS.V033I1?.ensurePerson?.(p)||p?.v33i1Equipment||{};return{weaponId:e.weaponId||null,armorId:e.armorId||null};}
function gear(p){const s=slots(p);return{weapon:item(s.weaponId)||item('improvised_club'),armor:item(s.armorId)};}
function activePeople(rows){const out=[],seen=new Set();for(const x of rows||[])for(const u of x.force||[])for(const p of u.people||[]){if(!p?.alive||p.militaryStatus32A!=='active')continue;const k=String(x.v?.id)+':'+String(p.id);if(seen.has(k))continue;seen.add(k);out.push({v:x.v,p,u});}return out;}
function screenCoverage(nMelee,nTotal){return nTotal?C(2*nMelee/nTotal):0;}
function profile(rows,round=1){
 const people=activePeople(rows),n=people.length,meleeCount=people.reduce((a,x)=>a+(gear(x.p).weapon?.mode!=='RANGED'?1:0),0),screen=screenCoverage(meleeCount,n);
 const phases={OPENING:0,CONTACT:0,MELEE:0},weights=round===1?FIRST:LATER;
 let penetration=0,protection=0;
 for(const x of people){const g=gear(x.p),s=g.weapon?.stats||{},melee=Number(s.melee||0),ranged=Number(s.ranged||0),reach=Number(s.reach||0),sustain=Number(s.rangedSustain||0);
  phases.OPENING+=.55*melee+1.10*ranged;
  phases.CONTACT+=.45*melee+.75*reach;
  phases.MELEE+=melee+ranged*sustain*screen;
  penetration+=Number(s.penetration||0);protection+=Number(g.armor?.stats?.protection||0);
 }
 for(const k of Object.keys(phases))phases[k]=n?phases[k]/n:0;
 const phaseScore=weights.OPENING*phases.OPENING+weights.CONTACT*phases.CONTACT+weights.MELEE*phases.MELEE;
 const qualityMultiplier=phaseScore/(round===1?BASE_FIRST:BASE_MELEE);
 return{manpower:n,meleeCount,screen,phases,phaseWeights:{...weights},phaseScore,qualityMultiplier,
  penetration:n?penetration/n:0,protection:n?protection/n:0,people};
}
function effectiveProtection(protection,penetration){return C(Number(protection||0)-.65*Number(penetration||0),0,.45);}
function personProtection(p,attackerPenetration){return effectiveProtection(Number(gear(p).armor?.stats?.protection||0),attackerPenetration);}
function casualtyMultiplier(pEff){return 1-.75*C(pEff,0,.45);}
function deathChance(pEff){return .36*(1-.35*C(pEff,0,.45));}
function intrinsicUnitPower(v,u){
 const people=(u?.people||[]).filter(p=>p.alive&&p.militaryStatus32A==='active'),n=people.length;
 if(!n)return 0;
 const cs=(u?.cohortIds||[]).map(id=>(v?.military32A?.cohorts||[]).find(c=>String(c.id)===String(id))).filter(Boolean),avg=k=>cs.length?cs.reduce((a,c)=>a+Number(c[k]||0),0)/cs.length:0;
 const base=.42+avg('training')/250+(avg('supply32F')||avg('supply'))/280+avg('morale')/400;
 const cmd=u?.formation?Number(NS.V033E1?.commanderCombatMultiplier?.(v,u.formation)||1):1;
 const pr=profile([{v,force:[{people}]}],1);return n*base*cmd*pr.qualityMultiplier;
}
function formationPower(v,f){const ids=new Set((f?.cohortIds||[]).flatMap(cid=>(v?.military32A?.cohorts||[]).find(c=>String(c.id)===String(cid))?.memberIds||[]).map(String));const people=(v?.residents||[]).filter(p=>p.alive&&p.militaryStatus32A==='active'&&ids.has(String(p.id)));return intrinsicUnitPower(v,{formation:f,cohortIds:f?.cohortIds||[],people});}
function roundPower(rows,pr,enemyPenetration){let baseTotal=0;
 for(const x of rows||[])for(const u of x.force||[]){const people=(u.people||[]).filter(p=>p.alive&&p.militaryStatus32A==='active'),n=people.length;if(!n)continue;
  const cs=(u.cohortIds||[]).map(id=>(x.v?.military32A?.cohorts||[]).find(c=>String(c.id)===String(id))).filter(Boolean),avg=k=>cs.length?cs.reduce((a,c)=>a+Number(c[k]||0),0)/cs.length:0;
  const base=.42+avg('training')/250+(avg('supply32F')||avg('supply'))/280+avg('morale')/400;
  const cmd=u.formation?Number(NS.V033E1?.commanderCombatMultiplier?.(x.v,u.formation)||1):1;
  // Individual quality; don't count equipment/250 or apply a second inventory-coverage bonus.
  for(const p of people){const g=gear(p),s=g.weapon?.stats||{};
   const melee=Number(s.melee||0),ranged=Number(s.ranged||0),reach=Number(s.reach||0),sustain=Number(s.rangedSustain||0),weights=pr.phaseWeights;
   const opening=.55*melee+1.10*ranged,contact=.45*melee+.75*reach,brawl=melee+ranged*sustain*pr.screen;
   const tactical=(weights.OPENING*opening+weights.CONTACT*contact+weights.MELEE*brawl)/(weights.OPENING?BASE_FIRST:BASE_MELEE);
   const ep=personProtection(p,enemyPenetration);
   const phaseScale=base*cmd*(1+.30*ep)/(weights.OPENING?BASE_FIRST:BASE_MELEE);
   const phasePower=pr.phasePower||(pr.phasePower={OPENING:0,CONTACT:0,MELEE:0});
   phasePower.OPENING+=phaseScale*opening;phasePower.CONTACT+=phaseScale*contact;phasePower.MELEE+=phaseScale*brawl;
   baseTotal+=base*cmd*tactical*(1+.30*ep);
  }
 }
 return baseTotal;
}
function defensiveFactor(w,war,side,tileId){const t=w?.map?.get?.(Number(tileId));if(!t)return 1;const A=war?.sideAIds?.length?war.sideAIds:[war?.attackerId],B=war?.sideBIds?.length?war.sideBIds:[war?.defenderId];const owners=(side==='A'?A:B).map(Number);if(!owners.includes(Number(t.ownerId)))return 1;let f={forest:1.08,rock:1.11,mountain:1.20}[t.terrain]||1;if((t.buildings||[]).includes('watchtower'))f+=.07;if((t.buildings||[]).includes('fortification'))f+=.12;if((t.buildings||[]).includes('barracks'))f+=.04;const owner=(w?.villages||[]).find(v=>Number(v.id)===Number(t.ownerId));if(owner&&Number(owner.coreTileId)===Number(t.id))f+=.06;return f;}
function calculateRound(w,war,eng,rows,round=Number(eng?.rounds||0)+1){const a=profile(rows.a,round),b=profile(rows.b,round);
 const ar=roundPower(rows.a,a,b.penetration),br=roundPower(rows.b,b,a.penetration);
 const af=defensiveFactor(w,war,'A',eng.tileId),bf=defensiveFactor(w,war,'B',eng.tileId);
 const ap=ar*af*(.92+Math.random()*.16),bp=br*bf*(.92+Math.random()*.16);
 return{a:{...a,power:ap,rawPower:ar,terrainFactor:af,effectiveProtection:effectiveProtection(a.protection,b.penetration)},b:{...b,power:bp,rawPower:br,terrainFactor:bf,effectiveProtection:effectiveProtection(b.protection,a.penetration)},round};}
function publicSide(s){return{manpower:s.manpower,screen:+s.screen.toFixed(3),penetration:+s.penetration.toFixed(3),protection:+s.protection.toFixed(3),effectiveProtection:+s.effectiveProtection.toFixed(3),opening:+s.phases.OPENING.toFixed(3),contact:+s.phases.CONTACT.toFixed(3),melee:+s.phases.MELEE.toFixed(3),qualityMultiplier:+s.qualityMultiplier.toFixed(3),rawPower:+s.rawPower.toFixed(3),terrainFactor:+s.terrainFactor.toFixed(3)};}
function battleTelemetry(calc){return{model:'equipment-tactical-v1',round:calc.round,phaseWeights:{...calc.a.phaseWeights},a:publicSide(calc.a),b:publicSide(calc.b)};}
function casualties(people,tuned,enemyPenetration){const rows=people.map(x=>{const pEff=personProtection(x.p,enemyPenetration);return{...x,pEff,exposure:casualtyMultiplier(pEff),deathChance:deathChance(pEff)};});
 const expected=rows.reduce((a,x)=>a+x.exposure*tuned,0),count=Math.min(rows.length,Math.floor(expected)+(Math.random()<expected-Math.floor(expected)?1:0));
 const pool=[...rows],chosen=[];for(let i=0;i<count;i++){const total=pool.reduce((a,x)=>a+x.exposure,0);let ticket=Math.random()*total,index=pool.length-1;for(let j=0;j<pool.length;j++){ticket-=pool[j].exposure;if(ticket<0){index=j;break;}}chosen.push(pool.splice(index,1)[0]);}
 return{count,chosen,expected};
}
const worldFromPrev=NS.World.from,worldSerializePrev=NS.World.prototype.serialize;
NS.World.from=function(d){const v=String(d?.version||''),w=worldFromPrev(v===VERSION?{...d,version:'0.33I1A2'}:d);w.v33i2={revision:REV,tacticalCombat:true};return w;};
NS.World.prototype.serialize=function(){const d=worldSerializePrev.call(this);d.version=VERSION;d.v33i2={revision:REV,tacticalCombat:true};if(d.v33i1){d.v33i1.qualityCombatEnabled=true;d.v33i1.inTileCombatEnabled=true;}return d;};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevToJSON.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{},{formationCombatPower33H:'I2 baseline equipment combat power before opponent and terrain; actual combat uses phase- and opponent-dependent composite.',v33I2Revision:REV,combatModel33I2:'First round OPENING 35%, CONTACT 20%, MELEE 45%; following rounds MELEE only. All ranges are within one contested tile.',screen33I2:'clamp(2 * melee-capable / total, 0, 1); ranged sustain remains in MELEE only through Screen.',equipmentCombat33I2:'Remove Equipment/250 and use physical Person weapon melee/ranged/reach/rangedSustain, and armor protection versus opposing penetration.',protection33I2:'effective = clamp(armor protection - 0.65 * enemy penetration,0,0.45); casualty exposure=1-0.75*effective; death probability=0.36*(1-0.35*effective).',equipmentConservation33I2:'No inventory edits on a combat-power calculation; I1A2 Person death capture and equipment recovery/loss unchanged.',i3Deferred33I2:'Full combat UI, tactical AI, and broad balance calibration deferred to I3.'});return d;};
if(NS.V033H){NS.V033H.combatFormulaChanged=true;NS.V033H.balanceChanged=true;}
if(NS.V033I1){NS.V033I1.qualityCombatEnabled=true;NS.V033I1.inTileCombatEnabled=true;}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33I2'))NS.PATCH_NOTES.unshift({version:'V0.33I2',date:'2026-10-08',title:'장비 기반 전술 교전 V1',summary:'I1A2의 실물 Person 장비를 실제 합동전쟁 BATTLE33 판정에 연결합니다. 첫 라운드는 OPENING 35% · CONTACT 20% · MELEE 45%, 이후 라운드는 MELEE 전용이며 같은 타일 안에서만 원거리 사격을 평가합니다.',sections:[['전투 단계',['첫 라운드 OPENING 35%, CONTACT 20%, MELEE 45%; 다음 라운드부터 MELEE 100%를 유지합니다.','창의 Reach는 CONTACT에만 적용하고, 활·투창은 rangedSustain × Screen으로 MELEE 단계 지원사격을 유지합니다.']],['Screen과 개인 장비',['Screen = clamp(2×근접전 가능 인원/전체 인원,0,1)입니다.','기존 장비 보급률 Equipment/250 보너스는 제거하고 실제 Person 장비의 melee/ranged/reach/penetration/protection을 적용합니다. 미장착 무기는 기존 임시 곤봉입니다.']],['관통·방호 및 피해',['유효 방호력 = clamp(방어구 방호력 − 0.65×적 평균 관통력,0,0.45)입니다.','사상 노출은 1 − 0.75×유효 방호력, 개인 사망확률은 0.36×(1 − 0.35×유효 방호력)을 사용합니다.','I1A2 전사자 장비 회수·유실·현물 보존식은 유지합니다.']],['관측·후속',['BATTLE33에 단계 기여도, Screen, 관통/방호 계수를 기록합니다.','세부 전투 UI·전술 AI 확장·본격적인 밸런스 조정은 I3로 이월합니다.']]]});
const uiProto=NS.UI?.prototype;
if(uiProto){const prevHeader=uiProto.renderHeader;uiProto.renderHeader=function(){const r=prevHeader.call(this);document.title='Village Observer V0.33I2';const b=this.q?.('versionBadge')||document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33I2</strong>';return r;};}
const savePrev=NS.SaveSystem;
function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
NS.SaveSystem={...savePrev,
 save(w){localStorage.setItem('village-observer-v0-33i2',JSON.stringify(w.serialize()));},
 load(){const s=localStorage.getItem('village-observer-v0-33i2');return s?NS.World.from(JSON.parse(s)):savePrev.load?.();},
 export(w){dl(`village-observer-v033I2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v033I2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw new Error(`CSV schema mismatch: expected ${test.columns} columns`);dl(`village-observer-v033I2-snapshots-${w.telemetry.sessionId}.csv`,csv,'text/csv;charset=utf-8');},
 async import(file){return NS.World.from(JSON.parse(await file.text()));}
};
NS.V033I2={version:VERSION,revision:REV,FIRST,LATER,BASE_FIRST,BASE_MELEE,item,slots,gear,profile,screenCoverage,effectiveProtection,personProtection,casualtyMultiplier,deathChance,intrinsicUnitPower,formationPower,calculateRound,casualties,battleTelemetry,activePeople};
try{const ui=window.villageObserver;if(ui){ui.renderHeader?.();}}catch(e){console.error('I2 init',e);}
})(window.VSim);
