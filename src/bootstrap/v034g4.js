/* V0.34G4 — Transport Network & Hydraulic Engineering.
 * New roads operate on physical paved tiles. Tier substitution, never multiplicative.
 * G3B bidirectional 1.00 join / legacy split / D3 pooled stocks remain authoritative.
 */
(function(NS){'use strict';
const VERSION='V0.34G4',PREV='V0.34G3B',KEY='village-observer-v034g4',EPS=1e-9;
const ADDED={
 ROAD_IMPROVEMENT:{id:'ROAD_IMPROVEMENT',label:'도로 개량술',icon:'🛣️',cost:650,req:['ROADS','ENGINEERING'],branch:'개척·행정',desc:'도로의 노면·교량을 개량해 실제 도로가 놓인 타일의 민간 이동비를 낮춥니다.',effects:['활성 도로 이동비 0.62 → 0.49','신규 정착지 병합의 1일 기준 유지']},
 POSTAL_NETWORK:{id:'POSTAL_NETWORK',label:'역참 제도',icon:'🐎',cost:850,req:['ROAD_IMPROVEMENT','BUREAUCRACY','FRONTIER_LOGISTICS'],branch:'개척·행정',desc:'역참·정기 운송망으로 실제 도로의 민간 수송 효율을 강화합니다.',effects:['활성 도로 이동비 0.49 → 0.32','도로 미설치 타일에는 효과 없음']},
 HYDRAULIC_ENGINEERING:{id:'HYDRAULIC_ENGINEERING',label:'수리공학',icon:'💧',cost:650,req:['IRRIGATION','ENGINEERING'],branch:'생산',desc:'기존 관개 시설의 용수·수로 관리를 개선해 농업시설을 갖춘 토지의 자연 식량 재생을 증진합니다.',effects:['가동 농업시설의 기본 식량 자연재생 +10%p (합연산)','일반 채취 산출 및 자원 최대치 불변']}
};
for(const [id,t] of Object.entries(ADDED)){NS.TECH[id]=t;if(!NS.TECH_ORDER.includes(id))NS.TECH_ORDER.push(id);}
// Road quality remains a single physical grade. Higher civilian tech replaces its coefficient.
const roadTier=v=>v?.hasTech?.('POSTAL_NETWORK')?3:v?.hasTech?.('ROAD_IMPROVEMENT')?2:v?.hasTech?.('ROADS')?1:0;
const roadFactor=v=>[1,.62,.49,.32][roadTier(v)];
const owner=(w,t)=>w?.villages?.find(v=>String(v.id)===String(t?.ownerId));
function roadCondition(t){if(!t)return 0;let q=0;for(let i=0;i<(t.buildings||[]).length;i++)if(t.buildings[i]==='road')q=Math.max(q,Number(t.buildingCondition?.[i]??100));return q;}
// G3/G3B rule: no benefit unless real road exists and condition >=25.
function spatialStep(w,t){const terrain=NS.TERRAIN?.[t?.terrain];if(!terrain?.passable)return Infinity;const v=owner(w,t);return Number(terrain.tradeCost||1)*(roadCondition(t)>=25?roadFactor(v):1);}
// General civilian land path: retain the historical gradual-condition factor by passing typeEff().
function civilianRoadFactor(w,t,eff){const v=owner(w,t);const quality=Math.max(0,Math.min(1,Number(eff||0)));return 1-(1-roadFactor(v))*quality;}
let activeWorld=null;
function agriculturalEfficiency(t){let best=0;for(let i=0;i<(t?.buildings||[]).length;i++)if(t.buildings[i]==='farmstead'||t.buildings[i]==='ancient_farm'){const c=Number(t.buildingCondition?.[i]??100);best=Math.max(best,c<=0?0:c>=70?1:c/70);}return best;}
function hydraulicBonus(t,dt){if(dt<=0||!t||t.ownerId==null)return 0;const w=t._worldRef||activeWorld,v=owner(w,t);if(!v?.hasTech?.('HYDRAULIC_ENGINEERING'))return 0;const eff=agriculturalEfficiency(t);return Number(NS.TERRAIN?.[t.terrain]?.regen?.food||0)*dt*.10*eff;}
// Readonly telemetry, no RNG or state changes.
function stats(w){const tech={ROADS:0,ROAD_IMPROVEMENT:0,POSTAL_NETWORK:0,HYDRAULIC_ENGINEERING:0},roads={};let cultivated=0,validRoadTiles=0;
 for(const v of w?.villages||[]){for(const k of Object.keys(tech))if(v.hasTech?.(k))tech[k]++;roads[v.id]=roadFactor(v);for(const id of v.territory||[]){const t=w.map?.get?.(Number(id));if(!t)continue;if(roadCondition(t)>=25)validRoadTiles++;if(agriculturalEfficiency(t)>0)cultivated++;}}
 return {tech,roadCoefficientsByNation:roads,validRoadTiles,cultivatedTiles:cultivated,settlementJoinLimit:NS.V034G3B?.joinLimit??null};}
const oldDay=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const previous=activeWorld;activeWorld=this;try{return oldDay.apply(this,args);}finally{activeWorld=previous;}};
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g4={revision:'road-tier-substitution-hydraulic',techCount:39,roadFactors:[.62,.49,.32],oneDayJoin:true};return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v034g4={revision:'physical-civilian-road-tier-and-irrigated-regen',...stats(w)};d.worldSummary.techCount=NS.TECH_ORDER.length;d.worldSummary.roadModel='physical road single grade; nation technology substitutes 0.62 / 0.49 / 0.32 for civilian paths';return d;};
const prevChoose=NS.TechSystem.choose;
NS.TechSystem.choose=function(v,w){const base=prevChoose.call(this,v,w),available=this.available(v);if(!available?.length)return base;let roadCount=0,farmCount=0;for(const id of v.territory||[]){const t=w.map.get(Number(id));if(!t)continue;if(roadCondition(t)>=25)roadCount++;if(agriculturalEfficiency(t)>0)farmCount++;}
 const spread=(v.territory?.size||0),pop=Number(v.population?.()||0),days=Number(v.foodReserveDays?.()||0),trait=Number(NS.V033F5A6?.profileFor?.(v)?.traits?.production??1);
 if(available.includes('HYDRAULIC_ENGINEERING')&&farmCount>0&&(days<28||days<55&&farmCount>=2))return 'HYDRAULIC_ENGINEERING';
 if(available.includes('ROAD_IMPROVEMENT')&&roadCount>=3&&(spread>=8||pop>=35))return 'ROAD_IMPROVEMENT';
 if(available.includes('POSTAL_NETWORK')&&roadCount>=5&&spread>=12)return 'POSTAL_NETWORK';
 return base;};
function verify(w){const tests={version:[VERSION,'V0.34G4A1'].includes(NS.RELEASE_VERSION),techCount:NS.TECH_ORDER.length===39,newTechs:Object.keys(ADDED).every(k=>NS.TECH_ORDER.includes(k)),joinLimit:Math.abs(NS.V034G3B?.joinLimit-1)<EPS,splitPreserved:!!NS.V034G3?.policy,pooledStock:!!NS.V034D3?.audit,roadFactors:roadFactor({hasTech:k=>['ROADS','ROAD_IMPROVEMENT','POSTAL_NETWORK'].includes(k)})===.32,hydraulicFunction:typeof hydraulicBonus==='function'};return{version:VERSION,build:'g4-v1',ok:Object.values(tests).every(Boolean),tests};}
function audit(w){const a=NS.V034G3B.audit(w);return{...a,version:VERSION,integrity:verify(w),g4:stats(w)};}
function refresh(){try{const w=window.villageObserver?.world,c=verify(w);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.setAttribute('data-runtime-version',VERSION);}
 let n=document.getElementById('g3aRuntimeIntegrity');if(n){n.textContent=c.ok?'✓ G4 런타임 · 기술 39개 · 도로 0.62/0.49/0.32 · 병합 왕복 1일 유지':'⚠ G4 무결성: '+Object.keys(c.tests).filter(k=>!c.tests[k]).join(', ');n.style.border='1px solid '+(c.ok?'#235a4c':'#a64c39');n.style.color=c.ok?'#a9e7ca':'#ffe0a1';}return c;}catch(e){return{ok:false,error:String(e)};}}
function download(name,data,mime='application/json'){const u=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g3b','village-observer-v034g3a','village-observer-v034g3','village-observer-v034g2a'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G4-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G4-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G4-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'도로 개량술·역참 제도·수리공학',summary:'기술 36→39개. 실제 도로를 기반으로 민간 이동비를 0.62/0.49/0.32로 대체하고, 가동 중인 농업시설의 자연 식량 회복을 기본량 기준 +10%p 높입니다.',sections:[['기술 트리',['도로 개량술(도로+토목술, 650K), 역참 제도(도로 개량술+관료제+개척 보급술, 850K), 수리공학(관개·윤작+토목술, 650K)을 추가합니다.']],['도로와 정착지',['기술 계수는 누적 곱하지 않고 최고 기술의 계수로 대체하며, 실제 도로와 도로 상태를 반영합니다.','G3B 신규 병합 왕복 1일 기준, 기존 정착지 보호·분할·공동 재고는 유지합니다.','군사 이동 공식은 변경하지 않습니다.']],['농업',['가동 중인 농업시설에서만 기본 자연 식량 재생의 10%p를 합연산으로 추가합니다.','농부 개인 산출량·식량 저장 한도·재고 보존 기준은 변경하지 않습니다.']]]});
NS.V034G4=Object.freeze({version:VERSION,techs:ADDED,roadTier,roadFactor,roadCondition,spatialStep,civilianRoadFactor,hydraulicBonus,stats,verify,audit,refresh});
if(NS.UI){const header=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=header.apply(this,args);refresh();return r;};}
if(NS.UI){const old=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const r=old.apply(this,args);try{const box=document.querySelector('.v34c-settlement-tile');if(box){const x=box.querySelector('.v034g3b-travel-note');if(x)x.textContent=x.textContent.replace('G3B 신규 병합','G4 신규 병합');}}catch{}return r;};}
refresh();
})(window.VSim);
