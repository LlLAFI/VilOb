
/* V0.33I3A — Native Combat Scenario Isolation.
   Only explicit combat test fixtures switch to this path. Natural games remain untouched.
   World time advances one calendar day without Person/economy/strategic-war pulses,
   but original V0.33D engagementRoundD retains all tactical/casualty/equipment effects. */
window.VSim=window.VSim||{};(function(NS){'use strict';
const VERSION='0.33I3A',REV='combat-scenario-isolation-v1';
const isFixture=w=>w?.v33i3a?.mode==='ISOLATED_NATIVE_COMBAT'&&w?.testScenario?.category==='combat-regression'&&/^I3[AB]-/.test(String(w.testScenario.id||''));
const num=x=>Number(x)||0;
function getEng(w){const z=w.v33i3a,war=(NS.V033D?.activeWars?.(w)||[]).find(x=>String(x.id)===String(z?.warId));const eng=(war?.engagements33D||[]).find(x=>String(x.id)===String(z?.engagementId));return{war,eng};}
function delayOpening(w,war,eng){return isFixture(w)&&String(w.v33i3a.warId)===String(war.id)&&num(w.v33i3a.tileId)===num(eng.tileId)&&w.v33i3a.stage==='READY';}
function validate(w){const z=w.v33i3a,issues=[];if(!isFixture(w))return{ok:false,issues:['NOT_ISOLATED_FIXTURE']};const {war,eng}=getEng(w);if(!war||!eng){issues.push('ENGAGEMENT_NOT_FOUND');return{ok:false,issues};}
 const tile=w.map.get(z.tileId);
 if(!tile||tile.ownerId!=null||Number(eng.tileId)!==Number(z.tileId))issues.push('NON_NEUTRAL_BATTLEFIELD');
 const bySide={};
 for(const side of ['A','B']){
  const nation=w.villages.find(x=>Number(x.id)===Number(z.nations[side]));
  const ids=new Set((z.rosters[side]||[]).map(String));
  const persons=(nation?.residents||[]).filter(p=>ids.has(String(p.id)));
  const active=persons.filter(p=>p.alive&&p.militaryStatus32A==='active');
  const equipped=active.map(p=>p.militaryEquipment33I1||{});
  const expected=z.equipment[side]||[];
  const expectedById=new Map((z.rosters[side]||[]).map((id,i)=>[String(id),expected[i]]));
  const ok=persons.length===6&&active.length===6&&equipped.length===expected.length&&active.every(p=>{const e=p.militaryEquipment33I1||{},want=expectedById.get(String(p.id));return !!want&&e.weaponId===want.weaponId&&e.armorId===want.armorId;});
  if(z.stage==='READY'&&!ok)issues.push(`${side}_NOT_EXACT_SIX_EQUIPPED`);
  const all=(nation?.military32A?.cohorts||[]).filter(c=>c.role32B!=='CORE_GARRISON');
  const activeAtTile=new Set();
  for(const c of all)if(Number(c.tileId)===Number(z.tileId))for(const pid of c.memberIds||[])if((nation?.residents||[]).some(p=>String(p.id)===String(pid)&&p.alive&&p.militaryStatus32A==='active'))activeAtTile.add(String(pid));
  if(z.stage==='READY'&&(activeAtTile.size!==6||[...activeAtTile].some(id=>!ids.has(id))))issues.push(`${side}_FORMATION_ROSTER_MISMATCH`);
  bySide[side]={actual:active.length,expected:6,weapons:Object.fromEntries(expected.reduce((m,x)=>(m.set(x.weaponId,(m.get(x.weaponId)||0)+1),m),new Map()))};
 }
 const rec=NS.V033I3?.records?.(w,z.tileId)?.find(x=>String(x.id)===String(z.engagementId));
 if(z.stage==='READY'&&(eng.rounds!==0||!rec||rec.initial?.A?.manpower!==6||rec.initial?.B?.manpower!==6))issues.push('OPENING_ALREADY_EXECUTED_OR_UNBALANCED');
 return{ok:issues.length===0,issues,bySide,rounds:num(eng.rounds),engagementStatus:eng.status,historyRounds:rec?.rounds?.length||0};
}
function isolatedDay(w){const z=w.v33i3a;if(z.stage==='READY'){
 const v=validate(w);if(!v.ok){z.stage='ERROR';z.errors=[...v.issues];w.telemetry?.record?.('COMBAT_FIXTURE_INVALID33I3A',w,{issues:v.issues});return false;}
 }
 // V24 calendars: one legacy macro day spans exactly three calendar subdays.
 w._v24MacroStart=null;w._v24Subday=Math.max(0,Math.min(2,num(w._v24Subday)))+1;
 if(w._v24Subday>2){w._v24Subday=0;w.day++;if(w.day>30){w.day=1;w.season++;if(w.season>3){w.season=0;w.year++;}}}
 if(z.stage==='READY')z.stage='FIGHTING';
 const {war,eng}=getEng(w);
 if(!war||!eng){z.stage='ERROR';z.errors=['ENGAGEMENT_DISAPPEARED'];return false;}
 if(eng.status==='ACTIVE')NS.V033D.engagementRound(w,war,eng,eng.rounds===0);
 const rec=NS.V033I3?.records?.(w,z.tileId)?.find(x=>String(x.id)===String(eng.id));
 if(rec){z.lastObservedRounds=rec.rounds.length;z.lastObservedPower=rec.rounds.length?{A:rec.rounds[rec.rounds.length-1].A.power,B:rec.rounds[rec.rounds.length-1].B.power}:null;}
 if(eng.status!=='ACTIVE'){z.stage='DONE';z.result={winnerSide:eng.winnerSide,rounds:eng.rounds,reason:eng.endReason||null};}
 z.elapsedCalendarDays=num(z.elapsedCalendarDays)+1;
 const errors=[];
 if(z.lastObservedRounds>0){for(const side of ['A','B']){
 const nation=w.villages.find(x=>Number(x.id)===Number(z.nations[side]));
 if(!nation)continue;
 const audit=NS.V033I1?.audit?.(nation,w,false)||[];
 if(audit.length)errors.push(...audit.map(x=>({side,...x})));
 }}
 if(errors.length){z.stage='ERROR';z.errors=['EQUIPMENT_CONSERVATION',...errors];}
 if(z.stage==='DONE'||z.stage==='ERROR'||z.elapsedCalendarDays%5===0)w.telemetry?.snapshot?.(w,'I3A_ISOLATED_COMBAT');
 return true;
}

function nativeSeed(n){let x=(Number(n)>>>0)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296;};}
async function runNativeBatch(baseline,iterations=30,seed=12345,update=()=>{}){
 if(typeof baseline==='string')baseline=JSON.parse(baseline);
 if(!baseline?.v33i3a||baseline.v33i3a.stage!=='READY')throw Error('첫 라운드 직전의 I3A 시나리오만 반복할 수 있습니다.');
 iterations=Math.max(1,Math.min(300,Math.trunc(Number(iterations)||30)));
 const report={revision:REV,method:'V0.33D actual Person-backed engagementRound, I2 equipment + casualties, isolated calendar',scenario:String(baseline.testScenario?.title||''),iterations,seed,summary:{A:0,B:0,draw:0,rounds:0,battleDeathsA:0,battleDeathsB:0,battleWoundsA:0,battleWoundsB:0},trials:[]};
 for(let i=0;i<iterations;i++){
  const original=Math.random;
  try{
   Math.random=nativeSeed((Number(seed)+i*2654435761)>>>0);
   const w=NS.World.from(baseline);if(!isFixture(w))throw Error('fixture state lost');
   const validation=validate(w);if(!validation.ok)throw Error('fixture initialization: '+validation.issues.join(','));
   for(let day=0;day<75&&['READY','FIGHTING'].includes(w.v33i3a.stage);day++)w.advanceOneDay();
   const z=w.v33i3a,rec=NS.V033I3.records(w,z.tileId).find(x=>String(x.id)===String(z.engagementId));
   if(z.stage!=='DONE'||!rec||rec.rounds.length<1)throw Error('fixture non-termination: '+z.stage+' '+JSON.stringify(z.errors));
   const battle={trial:i+1,winnerSide:rec.winnerSide||null,roundCount:rec.rounds.length,reason:rec.endReason,elapsedCalendarDays:z.elapsedCalendarDays,rounds:rec.rounds.map(r=>({number:r.number,phaseWeights:r.phaseWeights,winnerSide:r.winnerSide,sequential33I3C:r.sequential33I3C||null,A:{power:r.A.power,manpowerBefore:r.A.before?.manpower,manpowerAfter:r.A.after?.manpower,screen:r.A.tactics?.screen,phasePower:r.A.tactics?.phasePower,casualties:r.A.casualties},B:{power:r.B.power,manpowerBefore:r.B.before?.manpower,manpowerAfter:r.B.after?.manpower,screen:r.B.tactics?.screen,phasePower:r.B.tactics?.phasePower,casualties:r.B.casualties}}))};
   const audits=w.villages.slice(0,2).flatMap(v=>NS.V033I1.audit(v,w,false));if(audits.length)throw Error('equipment conservation '+JSON.stringify(audits));
   report.trials.push(battle);
   report.summary[rec.winnerSide==='A'?'A':rec.winnerSide==='B'?'B':'draw']++;
   report.summary.rounds+=rec.rounds.length;
   for(const side of ['A','B'])for(const r of rec.rounds){report.summary['battleDeaths'+side]+=Number(r[side].casualties.dead||0);report.summary['battleWounds'+side]+=Number(r[side].casualties.wounded||0);}
  }finally{Math.random=original;}
  if(i===0||(i+1)%5===0||i===iterations-1)update(i+1,iterations);
  if(i%2===1)await new Promise(resolve=>setTimeout(resolve,0));
 }
 report.summary.avgRounds=Math.round(report.summary.rounds/iterations*1000)/1000;
 return report;
}

const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){if(isFixture(this))return isolatedDay(this);return prevAdvance.apply(this,args);};
const prevSer=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSer.call(this);d.version=VERSION;if(this.v33i3a)d.v33i3a=JSON.parse(JSON.stringify(this.v33i3a));return d;};
NS.World.from=function(d){const isNew=String(d?.version)==='0.33I3A';const w=prevFrom(isNew?{...d,version:'0.33I3'}:d);if(isNew&&d?.v33i3a){w.v33i3a=JSON.parse(JSON.stringify(d.v33i3a));if(isFixture(w))for(const side of ['A','B']){const v=w.villages.find(x=>Number(x.id)===Number(w.v33i3a.nations[side]));const ids=new Set((w.v33i3a.rosters[side]||[]).map(String));for(const f of v?.v32dMilitary?.formations||[]){if(!(f.cohortIds||[]).some(cid=>(v.military32A?.cohorts||[]).some(c=>String(c.id)===String(cid)&&(c.memberIds||[]).some(pid=>ids.has(String(pid))))))continue;f.tileId=w.v33i3a.tileId;f.targetTileId=w.v33i3a.tileId;f.status='ENGAGED';for(const cid of f.cohortIds||[]){const c=(v.military32A?.cohorts||[]).find(c=>String(c.id)===String(cid));if(c)c.tileId=w.v33i3a.tileId;}}}}return w;};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevToJSON.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{},{v33I3ARevision:REV,nativeCombatFixture33I3A:isFixture(w),nativeCombatFixtureState33I3A:isFixture(w)?w.v33i3a.stage:null,nativeCombatFixtureRoundCount33I3A:isFixture(w)?num(w.v33i3a.lastObservedRounds):0});return d;};
if(NS.UI){const oldSetWorld=NS.UI.prototype.setWorld;NS.UI.prototype.setWorld=function(w){this._i3aBatchBaseline=null;this._i3aBatchResult=null;return oldSetWorld.call(this,w);};const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=oldHeader.call(this);document.title='Village Observer V0.33I3A';const b=this.q?.('versionBadge')||document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33I3A</strong>';if(isFixture(this.world)){
 let box=document.getElementById('i3aFixtureStatus');const parent=document.getElementById('v33i3LabPanel')||document.getElementById('v32e11ScenarioPanel');if(!box&&parent){box=document.createElement('div');box.id='i3aFixtureStatus';box.className='i3a-fixture-status';parent.insertAdjacentElement('beforebegin',box);}if(box){const z=this.world.v33i3a;if(z.stage==='READY'&&!this._i3aBatchBaseline)this._i3aBatchBaseline=JSON.stringify(this.world.serialize());
 box.innerHTML='<strong>⚔ I3B 격리 실전</strong> · '+String(this.world.testScenario.title||'')+'<div>상태: '+z.stage+' · 전투 라운드 '+num(z.lastObservedRounds)+' · 경과 '+num(z.elapsedCalendarDays)+'일</div><div class="muted small">일반 AI·인구·경제 정지, 실제 D 전투/장비 정산만 진행 · 타일 #'+num(z.tileId)+'</div>'+(this._i3aBatchBaseline?'<div><label>독립 재실행 <select id="i3aBatchCount"><option>10</option><option selected>30</option><option>100</option><option>300</option></select>회</label> <button id="i3aBatchRun" type="button">실전 엔진 반복</button> <button id="i3aBatchExport" type="button" '+(!this._i3aBatchResult?'disabled':'')+'>결과 JSON 내보내기</button></div>':'')+'<div id="i3aBatchStatus" class="muted small">'+(this._i3aBatchResult?('최근 결과 '+this._i3aBatchResult.iterations+'회 · A '+this._i3aBatchResult.summary.A+'승 / B '+this._i3aBatchResult.summary.B+'승 · 평균 '+this._i3aBatchResult.summary.avgRounds+'라운드'):'전투 첫 라운드가 시작되기 전 상태를 복원해 반복합니다.')+'</div>';
 const run=box.querySelector('#i3aBatchRun'),status=box.querySelector('#i3aBatchStatus');if(run)run.onclick=async()=>{run.disabled=true;try{const count=Number(box.querySelector('#i3aBatchCount').value),result=await runNativeBatch(this._i3aBatchBaseline,count,12345,(n,total)=>{if(status?.isConnected)status.textContent=`실전 교전 반복 ${n}/${total}회 완료`;});this._i3aBatchResult=result;if(status?.isConnected)status.textContent=`${count}회 · A ${result.summary.A}승 / B ${result.summary.B}승 · 평균 ${result.summary.avgRounds}라운드 · 장비 오류 0`;const e=box.querySelector('#i3aBatchExport');if(e)e.disabled=false;}catch(e){if(status?.isConnected)status.textContent='반복 검증 실패: '+e.message;}finally{if(run.isConnected)run.disabled=false;}};
 const exportBtn=box.querySelector('#i3aBatchExport');if(exportBtn)exportBtn.onclick=()=>{if(this._i3aBatchResult)dl('village-observer-v033I3B-native-batch.json',JSON.stringify(this._i3aBatchResult,null,2));};}
 }else{document.getElementById('i3aFixtureStatus')?.remove();}return r;};}
const prevSave=NS.SaveSystem;
function dl(name,text,type='application/json'){const a=document.createElement('a'),blob=new Blob([text],{type});a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
NS.SaveSystem={...prevSave,save(w){localStorage.setItem('village-observer-v0-33i3a',JSON.stringify(w.serialize()));},load(){const s=localStorage.getItem('village-observer-v0-33i3a');return s?NS.World.from(JSON.parse(s)):prevSave.load?.();},export(w){dl(`village-observer-v033I3A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v033I3A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('CSV schema mismatch');dl(`village-observer-v033I3A-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}};
NS.V033I3A={version:VERSION,revision:REV,isFixture,delayOpening,validate,isolatedDay,runNativeBatch};
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33I3A'))NS.PATCH_NOTES.unshift({version:'V0.33I3A',date:'2026-10-08',title:'실전 전술 시나리오 격리 및 검증',summary:'중립 타일 6:6 실전 교전의 첫 라운드 직전 저장, AI·경제·인구 루프 차단, 기존 D Engagement 라운드만 진행. 일반 게임은 기존과 동일합니다.',sections:[['격리 실전',['I3A combat-regression 전용 JSON에서만 연산 경로를 분리하고 출산·아사·경제·Formation 이동/동원을 중단합니다.','실전 V0.33D 전투 라운드 함수와 I2 장비 전투력·실제 Person 부상/사망·I1A2 장비 회수/유실을 그대로 사용합니다.']],['통제 조건',['양측 초기 6 Person과 실물 장비·중립 전장·코호트 편제 검증, 교전 직전 시작, 고정된 훈련과 보급.','진행 중 감소는 실제 전투 피해만 허용. 기록관은 I3와 같은 데이터를 사용합니다.']],['호환성',['일반 I3·I2 세이브/세계 주행에는 격리 경로가 작동하지 않습니다.','I3A 격리 상태는 세이브와 테스트 시나리오 JSON에 함께 저장됩니다.']]]});
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('I3A init',e);}
})(window.VSim);
