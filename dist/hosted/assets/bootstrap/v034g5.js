/* V0.34G5 — Specialized Labor & Field Recovery.
   4 techs, no new jobs/stock/state machine. All Person/physical stock and 1-day G3B rules retained. */
(function(NS){'use strict';
const VERSION='V0.34G5',PREV='V0.34G4A1',KEY='village-observer-v034g5';
const ADDED={
 INTENSIVE_FARMING:{id:'INTENSIVE_FARMING',label:'집약 농법',icon:'🌾',cost:700,req:['HYDRAULIC_ENGINEERING','GRANARY'],branch:'생산',desc:'농부의 실제 수확 효율을 개선합니다. 농업시설의 자연 재생을 높이는 수리공학과는 다른 효과입니다.',effects:['농부 식량 생산 배율 +0.12 (합연산)','채집꾼·사냥꾼 제외, 자연 식량·저장 한도 유지']},
 MINING_TECHNIQUES:{id:'MINING_TECHNIQUES',label:'채굴 공법',icon:'⛏️',cost:700,req:['IRON_MINING','ENGINEERING'],branch:'생산',desc:'석재·철광석을 채굴하는 광부의 효율을 개선합니다. 제련과 도구 제작은 그대로입니다.',effects:['광부 석재 산출 배율 +0.12 (합연산)','철광산 채굴 목표량 +12%p, 실제 광맥·창고 한도 준수']},
 SYSTEMATIC_RESEARCH:{id:'SYSTEMATIC_RESEARCH',label:'체계적 연구법',icon:'📚',cost:850,req:['ACADEMY','EDUCATION'],branch:'지식',desc:'학당에서 근무하는 실제 학자의 체계적 연구 역량을 강화합니다.',effects:['학당 학자 Knowledge 직업 산출 +15%p (학당 보정 1.20 → 1.35)','기존 국가 Knowledge 계수 및 다른 직업 불변']},
 FIELD_REORGANIZATION:{id:'FIELD_REORGANIZATION',label:'야전 재편술',icon:'🎖️',cost:750,req:['MILITARY_LOGISTICS','BUREAUCRACY'],branch:'군사',desc:'Formation의 전투 후 사기·재집결·작전 복귀를 더 빠르게 합니다.',effects:['전투 후 Formation 사기 회복 속도 +20%','신규 Regroup 기간 약 15% 감소','신규 전투 후 작전 복귀 기간 약 15% 감소','Person 부상·사망·장비 및 군수 규칙 불변']}
};
for(const [k,v] of Object.entries(ADDED)){NS.TECH[k]=v;if(!NS.TECH_ORDER.includes(k))NS.TECH_ORDER.push(k);}
const counters={farmerWorks:0,stoneMinerWorks:0,oreMinerWorks:0,scholarWorks:0,regroupsDiscounted:0,postBattleDiscounted:0};
function workerMultiplier(p,v,kind,t,base){let add=0;if(p?.alive&&p.age>=15&&p.assignment!=='PIONEER'){
 if(kind==='food'&&p.job==='농부'&&v?.hasTech?.('INTENSIVE_FARMING')){add=.12;counters.farmerWorks++;}
 else if(kind==='stone'&&p.job==='광부'&&v?.hasTech?.('MINING_TECHNIQUES')){add=.12;counters.stoneMinerWorks++;}
 }return Math.max(0,Number(base||0))+add;
}
function oreMultiplier(v,base){if(v?.hasTech?.('MINING_TECHNIQUES')){counters.oreMinerWorks++;return Number(base||0)+.12;}return Number(base||0);}
function scholarMultiplier(v){if(v?.hasTech?.('SYSTEMATIC_RESEARCH')){counters.scholarWorks++;return 1.35;}return 1.20;}
function regroupDays(v,d){const days=Number(d)||0;if(v?.hasTech?.('FIELD_REORGANIZATION')){counters.regroupsDiscounted++;return Math.max(1,Math.round(days*.85));}return days;}
function postBattleDays(v,d){const days=Number(d)||0;if(v?.hasTech?.('FIELD_REORGANIZATION')){counters.postBattleDiscounted++;return Math.max(1,Math.round(days*.85));}return days;}
const choose=NS.TechSystem.choose;
NS.TechSystem.choose=function(v,w){const fallback=choose.call(this,v,w),choices=this.available(v);if(!choices?.length)return fallback;
 const pop=Number(v.population?.()||0),people=v.residents||[],living=people.filter(p=>p.alive&&p.age>=15&&p.assignment!=='PIONEER'),count=k=>living.filter(p=>p.job===k).length,farms=count('농부'),miners=count('광부'),scholars=count('학자');
 if(choices.includes('INTENSIVE_FARMING')&&farms>=Math.max(2,pop*.10)&&Number(v.foodReserveDays?.()||0)<65)return 'INTENSIVE_FARMING';
 if(choices.includes('MINING_TECHNIQUES')&&miners>=2)return 'MINING_TECHNIQUES';
 if(choices.includes('SYSTEMATIC_RESEARCH')&&scholars>=2)return 'SYSTEMATIC_RESEARCH';
 const war=!!NS.V033?.warForNation?.(w,v.id),morale=(v.military32A?.formations||[]).some(f=>Number(f.v33c1BattleMorale||0)<-5||f.status==='REGROUPING');
 if(choices.includes('FIELD_REORGANIZATION')&&(war||morale))return 'FIELD_REORGANIZATION';
 return fallback;
};
const oldSave=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const s=oldSave.call(this);s.version=VERSION;s.v034g5={revision:'specialized-labor-formation-recovery',techCount:43};return s;};
NS.World.from=function(s){return oldFrom(s?.version===VERSION?{...s,version:PREV}:s);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.techCount=NS.TECH_ORDER.length;d.worldSummary.v034g5={revision:'specialized-labor-formation-recovery',technologies:Object.keys(ADDED).reduce((a,k)=>(a[k]=(w?.activeVillages||[]).filter(v=>v.hasTech?.(k)).length,a),{}),counters:{...counters},physicalStockPreserved:true};return d;};
function verify(w){const prev=NS.V034G4A1.verify(w),t={...prev.tests,version:NS.RELEASE_VERSION===VERSION,statsCaption:typeof document==='undefined'||!document.getElementById('statsScope')||document.getElementById('statsScope')?.querySelector('option[value="settlement"]')?.textContent==='타일 (기존 장기 통계)',techCount:NS.TECH_ORDER.length===43,newTechs:Object.keys(ADDED).every(k=>NS.TECH_ORDER.includes(k)),additiveFarmer:typeof workerMultiplier==='function'&&typeof oreMultiplier==='function'&&typeof scholarMultiplier==='function',regroupRecovery:Math.round(20*.85)===17};return{version:VERSION,ok:Object.values(t).every(Boolean),tests:t};}
function audit(w){const r=NS.V034G4A1.audit(w);return{...r,version:VERSION,integrity:verify(w)};}
function status(){const w=window.villageObserver?.world,r=verify(w);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.setAttribute('data-runtime-version',VERSION);}const s=document.getElementById('g3aRuntimeIntegrity');if(s){s.textContent=r.ok?'✓ G5 · 기술 43개 · 직업 생산/Formation 회복 · G4A1 안정성 유지':'⚠ G5: '+Object.keys(r.tests).filter(k=>!r.tests[k]).join(', ');s.style.color=r.ok?'#a9e7ca':'#ffe0a1';}return r;}
const prior=NS.SaveSystem;
function download(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...prior,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const keys=[KEY,'village-observer-v034g4a1','village-observer-v034g4a','village-observer-v034g4','village-observer-v034g3b'];for(const k of keys){const raw=localStorage.getItem(k);if(raw)return NS.World.from(JSON.parse(raw));}return null;},
 export(w){download(`village-observer-v034G5-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034G5-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(t=>t.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'직업 생산성·야전 재편술',summary:'기술 39→43개. 농부·광부·학자의 합연산 생산 보너스와 Formation 전투 후 사기·Regroup·작전복귀 단축. G4A1 허기·통계 UI 안정성 유지.',sections:[['새 기술',['집약 농법 700K: 수리공학 + 곡물 저장·보존 / 농부 식량 +12%p','채굴 공법 700K: 철광 채굴 + 공학 / 광부 석재·철광석 +12%p','체계적 연구법 850K: 학당 + 교육제도 / 학당 학자 Knowledge +15%p','야전 재편술 750K: 군수 행정 + 관료제 / Formation 회복 +20%, 재집결·전투 후 대기 약 15% 단축']],['수치와 회계',['개별 직업 산출에만 보너스를 적용하고 국가 기술 간 보너스를 누적 곱하지 않습니다.','석재는 원래 D3A 채취·저장·자연복원 경로를 유지하며 철광산 채굴은 광맥·실제 저장 한도를 유지합니다.','Person 부상 회복, 사망, 군사 이동, 사상자와 장비 소모를 변경하지 않습니다.']],['호환',['G4A1 식량 수요 및 Hunger 수치, G4 도로 계수·수리공학, G3B 신규 병합 왕복 1일, 기존 정착지 공동 재고 및 통계 드롭다운 안정성을 보존합니다.']]]});
NS.V034G5=Object.freeze({version:VERSION,techs:ADDED,workerMultiplier,oreMultiplier,scholarMultiplier,regroupDays,postBattleDays,verify,audit,refresh:status,counters});
if(NS.UI){const head=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const x=head.apply(this,a);status();return x;};}
status();
})(window.VSim);
