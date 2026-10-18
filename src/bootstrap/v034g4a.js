/* Village Observer V0.34G4A — Food & Hunger Balance Only.
 * No additional food logistics, welfare, migration, occupation or economic subsystem.
 * The 12-calendar-day Hunger=100 fatality gate and physical stock rules are unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.34G4A',PREV='V0.34G4',KEY='village-observer-v034g4a';
const CONFIG=Object.freeze({childFoodNeed:.28,adultFoodNeed:.39,priorChildNeed:.30,priorAdultNeed:.42,shortfallHungerGainReduction:.15,highHungerRecoveryBonus:.10,highHungerRecoveryStart:70,starvationGraceDays:12});
const cap=(x,a,b)=>Math.max(a,Math.min(b,Number(x)||0));
// At full ration, original work/rest Hunger gain is exactly preserved.
// With short rations, Hunger still grows, just modestly more slowly.
function hungerGain(gain,ratio){return Math.max(0,Number(gain)||0)*(1-CONFIG.shortfallHungerGainReduction*(1-cap(ratio,0,1)));}
// No food => zero recovery, as before. Higher Hunger modestly increases effectiveness of real rations.
function reliefFactor(hunger){return 1+CONFIG.highHungerRecoveryBonus*cap((Number(hunger)-CONFIG.highHungerRecoveryStart)/(100-CONFIG.highHungerRecoveryStart),0,1);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g4a={balance:'FOOD_HUNGER_NUMERIC_V1',...CONFIG};return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v034g4a={balance:'FOOD_HUNGER_NUMERIC_V1',...CONFIG};return d;};
const oldG4Verify=NS.V034G4.verify;
function verify(w){const g4=oldG4Verify(w),tests={...g4.tests,version:NS.RELEASE_VERSION===VERSION,
  foodNeed:Math.abs(NS.V034F0.needFor({age:10})-.28)<1e-8&&Math.abs(NS.V034F0.needFor({age:35})-.39)<1e-8,
  fullMealGain:Math.abs(hungerGain(6,1)-6)<1e-8,
  shortMealGain:Math.abs(hungerGain(6,0)-5.1)<1e-8,
  normalRecovery:reliefFactor(60)===1,highRecovery:Math.abs(reliefFactor(100)-1.1)<1e-8,
  starvationGrace:CONFIG.starvationGraceDays===12&&typeof NS.V034F2?.dailyStarvation==='function'};
 return {version:VERSION,build:'g4a-v1',ok:Object.values(tests).every(Boolean),tests};}
function audit(w){const a=NS.V034G3B.audit(w);return{...a,version:VERSION,integrity:verify(w),g4:NS.V034G4.stats(w),g4a:{...CONFIG}};}
function download(name,data,mime='application/json'){const u=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g4','village-observer-v034g3b','village-observer-v034g3a','village-observer-v034g3'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G4A-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G4A-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G4A-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'식량·허기 수치 밸런스',summary:'신규 구호 메커니즘 없이 기존 3일 배급 수요를 약 7% 줄이고, 식량 부족 시 Hunger 누적을 일부 완화하며, 심각한 Hunger에 실제 식사로 회복하는 효과를 약간 높입니다.',sections:[['식량 수요',['아동 3일 수요 0.30→0.28, 성인 0.42→0.39. 군인 1.09배·정착지별 공동 실물 배급은 유지합니다.','기존 식량 생산·자연 회복·시설·기술 보너스·정착지 물류에 추가 변경이 없습니다.']],['허기',['정상 배급 시 기존 Hunger 증가식을 그대로 유지합니다.','부족한 배급의 비율에 따라 Hunger 증가량을 최대 15% 완화합니다. 식량이 없으면 Hunger는 여전히 증가합니다.','식사 직전 Hunger 70 초과부터 실제 식량을 먹었을 때의 회복량이 최대 10% 높아집니다. 식량을 먹지 못하면 회복하지 않습니다.']],['보존 및 범위',['Hunger=100 유지 12달력일 기아 사망 판정은 그대로 유지합니다.','F3 Health 및 Happiness, 군사·AI·경제·기술·국가 간 물류와 물리 재고·Gold 보존식은 수정하지 않습니다.']]]});
function refresh(){const check=verify(window.villageObserver?.world);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 const status=document.getElementById('g3aRuntimeIntegrity');if(status){status.textContent=check.ok?'✓ G4A 런타임 · 식량·허기 수치 조정 · 물리 재고/12일 유예 유지':'⚠ G4A 무결성: '+Object.keys(check.tests).filter(k=>!check.tests[k]).join(', ');status.style.color=check.ok?'#a9e7ca':'#ffe0a1';status.style.border='1px solid '+(check.ok?'#235a4c':'#a64c39');}}
 return check;}
NS.V034G4A=Object.freeze({version:VERSION,config:CONFIG,hungerGain,reliefFactor,verify,audit,refresh});
if(NS.UI){const prior=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=prior.apply(this,args);refresh();return r;};}
refresh();
})(window.VSim);
