/* Village Observer V0.34F3 — Health & Happiness Lifecycle V2.
 * Keep F2 work -> ration -> metabolism -> daily starvation ordering,
 * all physical quantities and RNG feeding intact. Only continuous health
 * nutrition stress, one Happiness target and the Health-0 illness factor change.
 */
(function(NS){'use strict';
const VERSION='V0.34F3',PREVIOUS='V0.34F2',KEY='village-observer-v034f3';
const number=(x,otherwise=0)=>Number.isFinite(Number(x))?Number(x):otherwise;
const bound=(x,lo=0,hi=100)=>Math.max(lo,Math.min(hi,number(x)));
// One nutrition penalty per cycle. Immediate deficit and accumulated Hunger
// are alternative observations of starvation, not additive damage sources.
function nutritionLoss(ratio,hunger){
 const shortfall=1-bound(ratio,0,1);
 const chronic=.65*bound((number(hunger)-60)/40,0,1);
 return Math.max(shortfall,chronic);
}
// Target-only Happiness: one attractor and one update (no competing 65 target,
// underfeeding deduction or separate festival attractor). Housing strain also
// affects the single target, not another direct Happiness subtraction.
function happinessTarget(p,v,w,ratio,housingStress=0){
 const housing=bound(housingStress,0,1),shortfall=1-bound(ratio,0,1);
 const festival=v?.festivalState;
 const bonus=festival&&number(festival.until,-1)>=number(w?.ordinalDay?.(),Infinity)
   ?(Number(p.homeTileId)===Number(festival.tileId)?8:3):0;
 const prolongedHousing=number(p.housingStrainDays)>20?4*housing:0;
 return bound(54+(50-number(p.hunger))*.18+(number(p.health)-60)*.10+
   (number(p.energy)-55)*.07-8*housing-prolongedHousing-8*shortfall+bonus,15,95);
}
function updateHappiness(p,v,w,ratio,housingStress=0){
 const target=happinessTarget(p,v,w,ratio,housingStress);
 p.happinessTarget=target;
 p.happiness=bound(number(p.happiness)+(target-number(p.happiness))*.016);
 return target;
}
// Health 0 is a serious, recoverable impairment, not an instantaneous kill;
// distinguish 0 from missing/non-numeric data so the illness hazard is monotone.
function illnessHealthFactor(health){
 const h=health==null||health===''?30:number(health,30);
 return 1+Math.max(0,30-bound(h))*.012;
}
const originalSerialize=NS.World.prototype.serialize,originalFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=originalSerialize.call(this);x.version=VERSION;
 x.v034f3={model:'HEALTH_HAPPINESS_LIFECYCLE_V2',singleNutritionPenalty:true,singleHappinessTarget:true,healthZeroIllnessFixed:true};return x;};
NS.World.from=function(x){if(!x||typeof x!=='object')throw Error('잘못된 세이브');
 return originalFrom(x.version===VERSION?{...x,version:PREVIOUS}:x);};
const originalJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=originalJSON.call(this,w);j.version=VERSION;
 j.worldSummary=j.worldSummary||{};j.worldSummary.v034f3={model:'HEALTH_HAPPINESS_LIFECYCLE_V2',nutrition:'max(shortfall, 0.65*clamp((Hunger-60)/40))',happiness:'one target, rate 0.016',healthZeroIllnessFactor:1.36};return j;};
const priorSave=NS.SaveSystem;
function download(name,contents,type){const url=URL.createObjectURL(new Blob([contents],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f2')||localStorage.getItem('village-observer-v034f1a1')||localStorage.getItem('village-observer-v034f1a');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){return download(`village-observer-v034F3-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){return download(`village-observer-v034F3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');}
};
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const render=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const x=render.apply(this,args);mark();return x;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'Health & Happiness Lifecycle V2 — 중복 페널티 제거',summary:'F2 생존 순서를 보존하며 건강의 영양 손실을 중복 없이 계산하고 행복도를 단일 목표값으로 통일합니다. Health=0 질병 위험 누락을 고칩니다.',sections:[['Health·Hunger',['당일 식량 부족과 누적 Hunger 영양 스트레스 중 큰 값만 건강에 적용합니다. Hunger 및 배급량 계산식은 변경하지 않습니다.','Health가 0이어도 즉사하지 않지만 질병 위험에 올바르게 반영됩니다. 기존 12일 기아 유예는 동일합니다.']],['Happiness',['기본값 65 복귀, 상황별 목표 복귀, 축제별 추가 복귀를 단일 목표값·단일 수렴식으로 통합합니다.','주거 스트레스, 식량 부족, 축제 효과를 목표값에 포함합니다.']],['검증·범위',['식량·Gold·장비 보존식, 전투·AI·연구·인구의 의사결정식 변경 없음.','F2와 수치/RNG 동일성은 요구하지 않으며, 동일 F3 환경 자체의 결정론을 점검합니다.','Health로 인한 생산 효율 감소는 도입하지 않습니다.']]]});
NS.V034F3=Object.freeze({version:VERSION,enabled:true,nutritionLoss,happinessTarget,updateHappiness,illnessHealthFactor});
NS.RELEASE_VERSION=VERSION;
mark();try{window.villageObserver?.renderHeader?.();}catch(e){}
})(window.VSim);
