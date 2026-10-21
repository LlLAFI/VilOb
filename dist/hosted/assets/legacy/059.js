
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV32C1='tech-tree-military-activation-stats-selector-hotfix';
const MIL32C1=new Set(['barracks','training_ground','armory']);
const clamp32C1=(v,a,b)=>Math.max(a,Math.min(b,v));
const cal32C1=w=>Number(w?.calendarOrdinalDay?.()??((Number(w?.ordinalDay?.()||0))*3));

/* ============================================================
   1) Technology tree audit / descriptions / selective buffs
   ============================================================ */
function patchTech32C1(id,p){if(!NS.TECH?.[id])return;Object.assign(NS.TECH[id],p);}
patchTech32C1('AGRICULTURE',{
 desc:'경작 지식을 체계화해 식량 생산 효율을 높이고 정착지에 고대 경작지를 조성할 수 있게 합니다.',
 effects:['고대 경작지 건설 해금','식량 채취량 +8%']
});
patchTech32C1('IRRIGATION',{
 desc:'수로와 물 관리로 평야·초지의 식량 생산량을 높이고 경작지에서 더 많은 농부가 함께 일할 수 있게 합니다.',
 effects:['고대 경작지 → 고대 농장 개축 해금']
});
patchTech32C1('CROP_ROTATION',{
 desc:'경작 순환을 체계화해 평야와 초지의 장기 식량 생산력을 높이고 경작지의 노동 수용력을 확대합니다.',
 effects:[]
});
patchTech32C1('FOOD_PRESERVATION',{
 desc:'건조·염장·훈연과 저장 관리로 장기 비축의 손실을 줄이고 식량 위기에서 버틸 시간을 늘립니다.',
 effects:['분기 식량 부패 -40%','아사 위험 약 -10%']
});
patchTech32C1('CART',{
 desc:'수레와 육상 운송 체계를 이용해 더 멀리, 더 많은 물자를 이동시키며 식량 위기 대응도 개선합니다.',
 effects:['교역 가능 경로 +3','회당 운송량 +12','내부 물류 기본 운송량 증가','아사 위험 -7%']
});
patchTech32C1('STANDARD_WEIGHTS',{
 desc:'무게와 단위를 표준화해 거래 마찰과 운송 손실을 줄이고 시장이 더 많은 상인을 수용하게 합니다.',
 effects:['교역 운송비 계수 -12%','회당 교역량 +10%','시장 상인 노동슬롯 +1']
});
patchTech32C1('ENVOYS',{
 desc:'정기적으로 사절을 보내 이웃을 더 멀리 발견하고 시장 정보를 교환하며 접촉국과의 관계를 관리합니다.',
 effects:['문명 발견 거리 크게 증가','시장 정보 접촉 거리 증가','접촉국과의 관계가 분기마다 조금씩 회복','장기 외교 기반']
});
patchTech32C1('LONG_DISTANCE_TRADE',{
 desc:'전문 상단이 먼 지역까지 정기적으로 왕래하며 시장 정보를 넓히고 교역소를 대규모 상업거점으로 발전시킵니다.',
 effects:['문명 발견·시장 접촉 거리 크게 증가','회당 교역량 +20%','교역소 상인 노동슬롯 +1','상단회관 고도화 경로 해금']
});
patchTech32C1('COMMERCIAL_LAW',{
 req:['CURRENCY'],
 desc:'화폐 기반 계약·채무·시장 관행을 정리해 상단 간 분쟁과 거래 마찰을 줄이고 고급 상업시설을 가능하게 합니다.',
 effects:['교역 운송·거래 비용 -10%','회당 교역량 +8%','상단회관·대시장 고도화 경로 해금']
});
patchTech32C1('SURVEYING',{
 desc:'지형을 기록하고 경계를 측정해 개척 계획의 낭비를 줄이며 정착지에서 활용 가능한 건축공간을 넓힙니다.',
 effects:['개척 기본 기간 -10%','중심지에서 멀어질 때 추가되는 개척 기간 감소','타일 잠재 건축공간 +1']
});
patchTech32C1('FRONTIER_LOGISTICS',{
 desc:'개척대의 식량·장비 보급을 표준화하고 주변 정착지의 성인 인력을 공동 활용해 장기·병렬 개척을 안정시킵니다.',
 effects:['개척 기간 추가 단축','개척 지연·보급손실 위험 감소','개척대 일일 식량 소모 -25%','지역 개척 인력 탐색 범위 확대','동시 개척 역량 증가']
});
patchTech32C1('ADMINISTRATION',{
 desc:'정착지별 재고·노동·운송을 기록해 국가 내부 물류와 공공사업을 조직하고 군사 예비인력 등록 기반을 마련합니다.',
 effects:['국가 내부 물류량 +25%','거리로 인한 내부 물류 효율 감소 완화','동시 공사 한도 +1','예비군 등록 체계 해금']
});
patchTech32C1('WATCHTOWERS',{
 cost:500,req:['ADMINISTRATION'],
 desc:'파수 지점과 봉수 체계를 조직해 넓어진 영토의 위협을 파악하고 실제 Person 기반 평시 주둔군과 병영 체계를 운용합니다.',
 effects:['영토 규모에 따른 방어력 증가','평시 현역 주둔군 활성화','고대 병영 해금'],
 eureka:'정착지 4곳 보유'
});
patchTech32C1('FORTIFICATION',{
 cost:500,req:['URBAN_PLANNING'],
 desc:'목책과 석조 방어시설의 배치·축조법을 발전시켜 방책을 더 저렴하고 빠르게 건설하고 조직적인 군사훈련 기반을 마련합니다.',
 effects:['방책 방어 기여도 +4.0','방책 목재·석재 비용 -15%','방책 건설 노동량 -20%','고대 훈련장 해금','향후 야전 요새화 효율 +25%'],
 eureka:'방책 2개 이상'
});
patchTech32C1('ARCHITECTURE',{
 desc:'규격화된 구조와 시공법으로 건설 자재의 낭비를 줄이고 정착지의 활용 가능한 건축공간을 확장합니다.',
 effects:['일반 건물 목재·석재 비용 -10%','타일 잠재 건축공간 +1']
});
patchTech32C1('ENGINEERING',{
 desc:'도로·토목·산업시설 설계를 결합해 험지 건설과 이동을 개선하고 채석·철산업 시설의 노동 수용력을 높입니다.',
 effects:['도로 목재·석재 비용 -25% 추가','암지·산악 개척 기간 추가 단축','타일 잠재 건축공간 +2','도로 Lv.2 및 경로비 개선','채석장·철광산·제련소·대장간 노동슬롯 +1']
});
patchTech32C1('PUBLIC_WORKS',{
 cost:660,
 desc:'여러 정착지의 노동과 자재를 조직해 공공 건설을 빠르게 진행하고 위생·식량위기 대응을 함께 개선합니다.',
 effects:['신규 건설 필요 노동/기간 약 -12%','질병 위험 -10%','아사 위험 -6%'],
 eureka:'국가 내 건물 12개 이상'
});
patchTech32C1('URBANIZATION',{
 desc:'고밀도 주거·대형 저장·고급 도로를 결합해 큰 정착지를 유지하고 도시 밀집으로 인한 질병 위험을 줄입니다.',
 effects:['집합주거 해금','타일 잠재 건축공간 +3','창고 저장량 +15%','도로 Lv.3 및 경로비 개선','질병 위험 -10%']
});
patchTech32C1('EDUCATION',{
 cost:660,
 desc:'학당을 중심으로 기록과 전문 지식을 다음 세대에 체계적으로 전하고 더 많은 학자가 연구에 전념하도록 합니다.',
 effects:['Knowledge 획득 +15%','학당당 학자 노동슬롯 +2','질병 위험 -8%'],
 eureka:'학당과 행정제도를 함께 보유'
});
patchTech32C1('OCEAN_NAVIGATION',{
 cost:720,
 desc:'별과 방향, 장거리 보급 지식을 결합해 대양을 횡단하고 가장 먼 해상 교역·개척권을 형성합니다.',
 effects:['대양 타일 통과 가능','가장 긴 해상 교역·개척 거리']
});
patchTech32C1('IRON_MINING',{
 desc:'철광맥을 식별하고 철광석을 체계적으로 채굴해 철기 산업의 첫 단계를 엽니다.',
 effects:['철광산 건설 해금','철광석 매장지의 전략 가치 인식'],
 eureka:'자국 영토에서 철광맥 보유'
});
patchTech32C1('SMELTING',{
 req:['IRON_MINING'],
 desc:'철광석을 목재 연료와 함께 제련해 가공 가능한 철을 생산합니다.',
 effects:['제련소 건설 해금','철광석 + 목재 → 철 생산'],
 eureka:'철광산 완공 및 철광석 20 이상 비축'
});
patchTech32C1('IRONWORKING',{
 desc:'제련된 철을 반복 가공해 도구와 군사 장비 기반을 생산합니다.',
 effects:['대장간 건설 해금','철 → 도구 생산','도구 보급 시 생산·건설 효율 상승','고대 무기고 해금'],
 eureka:'제련소에서 철을 최초 생산'
});

/* Iron-chain Eureka additions. Existing Eureka system applies 25% of research cost. */
const eurekas32C1=NS.Village.prototype.checkEurekas;
NS.Village.prototype.checkEurekas=function(w){
 eurekas32C1.call(this,w);
 let hasDeposit=false,mine=0;
 for(const id of this.territory||[]){const t=w.map.get(id);if(!t)continue;if(Number(t.resourceCap?.iron_ore||0)>0)hasDeposit=true;mine+=(t.buildings||[]).filter(x=>x==='iron_mine').length;}
 if(hasDeposit)this.grantEureka?.('IRON_MINING',w);
 if(mine>0&&Number(this.resourceTotal?.('iron_ore')||0)>=20)this.grantEureka?.('SMELTING',w);
 if(Number(this.v31Stats?.ironSmelted||0)>0||Number(this.resourceTotal?.('iron')||0)>0)this.grantEureka?.('IRONWORKING',w);
};

/* Fortification is now a meaningful construction technology. */
if(NS.V08?.effectiveCost){const cost32C1=NS.V08.effectiveCost;NS.V08.effectiveCost=function(v,type){const c=cost32C1(v,type);if(type==='palisade'&&v?.hasTech?.('FORTIFICATION'))for(const k of ['wood','stone'])if(Number(c[k]||0)>0)c[k]=Math.max(.1,Math.round(Number(c[k])*0.85*10)/10);return c;};}
const sec32C1=NS.Village.prototype.securityScore;
NS.Village.prototype.securityScore=function(w){let s=Number(sec32C1.call(this,w)||0);if(this.hasTech?.('FORTIFICATION')){let pal=0;for(const id of this.territory||[])pal+=(w.map.get(id)?.buildings||[]).filter(x=>x==='palisade').length;s+=pal*1.5;}return Math.round(s);};

/* ============================================================
   2) Military facility activation / strategic finance / diagnostics
   ============================================================ */
function built32C1(v,w,type){let n=0;for(const id of v.territory||[])n+=(w.map.get(id)?.buildings||[]).filter(x=>x===type).length;return n;}
function pending32C1(v,type){return (v.constructionProjects||[]).filter(p=>p?.type===type&&!p?.v17Marker).length;}
function projectCap32C1(v){return Number(NS.V031G?.maxProjects?.(v)||1);}
function projectCount32C1(v){return (v.constructionProjects||[]).length;}
function popAt32C1(v,id){return (v.tileResidents?.(id)||[]).filter(p=>p.alive).length;}
function roster32C1(v,w){return NS.V032C?.roster?.(v,w,true)||{active:[],reserve:[]};}
function resource32C1(v,k){return Number(v.resourceTotal?.(k)||v[k]||0);}
function militaryNeed32C1(v,w){
 if(v.status!=='active')return{type:null,reason:'INACTIVE'};
 const r=roster32C1(v,w),food=Number(v.foodReserveDays?.()||0),pop=Number(v.population?.()||0),b=built32C1(v,w,'barracks')+pending32C1(v,'barracks'),a=built32C1(v,w,'armory')+pending32C1(v,'armory'),tg=built32C1(v,w,'training_ground')+pending32C1(v,'training_ground'),smith=built32C1(v,w,'smithy');
 if(v.hasTech?.('WATCHTOWERS')&&r.active.length>0&&pop>=40&&food>=32&&b===0)return{type:'barracks',reason:'V32C1_STANDING_GARRISON'};
 if(v.hasTech?.('IRONWORKING')&&r.active.length>=2&&smith>0&&food>=34&&a===0&&resource32C1(v,'iron')>=5)return{type:'armory',reason:'V32C1_EQUIPMENT_SUPPLY'};
 if(v.hasTech?.('FORTIFICATION')&&b>0&&r.active.length>=2&&pop>=70&&food>=38&&tg===0)return{type:'training_ground',reason:'V32C1_FORTIFIED_TRAINING'};
 return{type:null,reason:'NO_TARGET'};
}
function tileBusy32C1(v,id){return (v.constructionProjects||[]).some(p=>Number(p.tileId)===Number(id)&&!p.v17Marker)||(v.landDevelopmentProjects||[]).some(p=>Number(p.tileId)===Number(id))||(v.buildingUpgradeProjects||[]).some(p=>Number(p.tileId)===Number(id))||(v.specializationProjects||[]).some(p=>Number(p.tileId)===Number(id));}
function candidate32C1(v,w,type){
 const coh=(v.military32A?.cohorts||[]).find(c=>(c.memberIds||[]).length),preferred=Number(coh?.tileId??v.coreTileId),foot=Number(NS.V017?.buildingFootprint?.(type)||NS.BUILDINGS?.[type]?.footprint||1);
 const ids=[preferred,...[...v.territory].filter(id=>Number(id)!==preferred)];
 const rows=[];
 for(const id of ids){const t=w.map.get(Number(id));if(!t||t.ownerId!==v.id||tileBusy32C1(v,id)||(t.buildings||[]).includes(type))continue;const pop=popAt32C1(v,id);if(type==='barracks'&&Number(id)!==preferred&&pop<4)continue;if(type!=='barracks'&&pop<3)continue;const space=Number(NS.V017?.remainingSpace?.(v,t)??999);if(space+1e-9<foot)continue;const f=NS.V031H?.funding?.(v,w,id,type);rows.push({id,t,pop,space,foot,f,score:(Number(id)===preferred?40:0)+pop*2+Math.min(25,Number(f?.localAvailable||0))});}
 return rows.sort((a,b)=>b.score-a.score);
}
function materialOK32C1(v,type){const c=NS.V08?.effectiveCost?.(v,type)||NS.V08?.BUILD_COSTS?.[type]||{};for(const k of ['wood','stone'])if(Number(v[k]||0)+1e-9<Number(c[k]||0))return false;if(Number(c.iron||0)>0&&resource32C1(v,'iron')+1e-9<Number(c.iron))return false;return true;}
function readiness32C1(v,w,ignoreCapacity=false){
 const n=militaryNeed32C1(v,w),cap=projectCap32C1(v),projects=projectCount32C1(v);if(!n.type)return{...n,ready:false,blocker:n.reason,cap,projects};
 if(!ignoreCapacity&&projects>=cap)return{...n,ready:false,blocker:'PROJECT_CAPACITY',cap,projects};
 if(!materialOK32C1(v,n.type))return{...n,ready:false,blocker:'MATERIALS',cap,projects};
 const rows=candidate32C1(v,w,n.type);if(!rows.length)return{...n,ready:false,blocker:'SPACE_OR_SITE',cap,projects};
 const row=rows.find(x=>Number(x.f?.funding||0)+1e-9>=Number(x.f?.goldCost||0));if(!row){const best=rows[0];return{...n,ready:false,blocker:'GOLD',cap,projects,row:best,funding:best?.f};}
 return{...n,ready:true,blocker:'NONE',cap,projects,row,funding:row.f};
}
function shouldReserve32C1(v,w){const f=NS.V035F;return f?.isMeasuringDevelopment?.()?f.measure('militaryReserve32C1',()=>shouldReserve32C135FOriginal(v,w)):shouldReserve32C135FOriginal(v,w);}
function shouldReserve32C135FOriginal(v,w){const r=readiness32C1(v,w,true);return{...r,reserve:!!r.ready&&r.projects>=Math.max(0,r.cap-1)&&r.projects<r.cap};}
function emergency32C1(v,w,type){if(['iron_mine','smelter','smithy','barracks','training_ground','armory'].includes(type))return true;const fd=Number(v.foodReserveDays?.()||0);if(type==='outpost')return true;if((type==='farmstead'||type==='granary')&&(fd<28||Number(v.avgHunger?.()||0)>48))return true;if(type==='house'){const occ=Number(v.population?.()||0)/Math.max(1,Number(v.capacity?.(w)||1));if(occ>.98)return true;}if(type==='palisade'&&Number(v.threat||0)>=35)return true;return false;}

/* Military buildings can use conserved settlement market surplus just like strategic iron industry. */
const econ32C1=NS.Village.prototype.isEconomicBuild31F;
NS.Village.prototype.isEconomicBuild31F=function(type){return MIL32C1.has(type)||!!econ32C1?.call(this,type);};
const pay32C1=NS.Village.prototype.payBuild;
NS.Village.prototype.payBuild=function(tileId,cost){
 const type=this._v29BuildTypeContext||null,w=this._world,goldCost=Number(cost?.gold||0);if(!w||!MIL32C1.has(type)||goldCost<=0)return pay32C1.call(this,tileId,cost);
 const f=NS.V031H?.funding?.(this,w,tileId,type);if(!f||Number(f.funding||0)+1e-9<goldCost)return false;
 const treasuryBefore=Number(this.gold||0),moves=[];let need=Math.max(0,goldCost-Number(f.treasurySpendable||0));
 const local=(f.rows||[]).find(x=>Number(x.id)===Number(tileId));if(local&&need>0){const q=Math.min(need,Number(local.available||0));if(q>0){local.econ.marketGold-=q;this.gold+=q;moves.push({row:local,amount:q});need-=q;}}
 let remoteLeft=Math.min(need,Number(f.remoteAvailable||0));for(const row of f.rows||[]){if(remoteLeft<=1e-9)break;if(Number(row.id)===Number(tileId)||Number(row.available||0)<=0)continue;const q=Math.min(remoteLeft,Number(row.available||0));if(q<=0)continue;row.econ.marketGold-=q;this.gold+=q;moves.push({row,amount:q});remoteLeft-=q;need-=q;}
 if(need>1e-7){for(const m of moves)m.row.econ.marketGold+=m.amount;this.gold=treasuryBefore;return false;}
 const ok=pay32C1.call(this,tileId,cost);if(!ok){for(const m of moves)m.row.econ.marketGold+=m.amount;this.gold=treasuryBefore;return false;}
 const amount=moves.reduce((a,m)=>a+m.amount,0);if(amount>0)w.telemetry?.record?.('MILITARY_MARKET_POOL32C1',w,{village:this.name,villageId:this.id,targetTileId:tileId,type,amount:+amount.toFixed(3),goldCost:+goldCost.toFixed(2),sources:moves.map(m=>({tileId:m.row.id,amount:+m.amount.toFixed(3)}))});return true;
};

const start32C1=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason='AI'){
 if(type==='training_ground'&&!this.hasTech?.('FORTIFICATION'))return false;
 if(!this._v32c1MilitaryAttempt&&!MIL32C1.has(type)){
  const r=shouldReserve32C1(this,w);if(r.reserve&&!emergency32C1(this,w,type)){const cal=cal32C1(w),key=`${r.type}:${type}:${reason}`,last=Number(this._v32c1ReserveLog?.[key]||-99999);this._v32c1ReserveLog=this._v32c1ReserveLog||{};if(cal-last>=90){this._v32c1ReserveLog[key]=cal;w.telemetry?.record?.('MILITARY_SLOT_RESERVED32C1',w,{village:this.name,villageId:this.id,target:r.type,blockedType:type,reason,projects:r.projects,projectCap:r.cap,funding:+Number(r.funding?.funding||0).toFixed(2),goldCost:+Number(r.funding?.goldCost||0).toFixed(2)});}return false;}
 }
 const before=(this.constructionProjects||[]).length,ok=start32C1.call(this,w,tileId,type,reason);
 if(ok&&type==='palisade'&&this.hasTech?.('FORTIFICATION')){const p=(this.constructionProjects||[]).at(-1);if(p&&(this.constructionProjects||[]).length>before&&Number.isFinite(Number(p.totalLabor25))){p.totalLabor25=Math.max(1,Number(p.totalLabor25)*.80);p.duration=p.totalLabor25;}}
 return ok;
};
function tryMilitary32C1(v,w,source='SEASON'){
 const r=readiness32C1(v,w,false);v._v32c1MilitaryDiag=r;if(!r.ready||!r.row)return false;let ok=false;v._v32c1MilitaryAttempt=true;try{ok=!!v.startConstruction?.(w,r.row.id,r.type,r.reason);}finally{v._v32c1MilitaryAttempt=false;}if(ok)w.telemetry?.record?.('MILITARY_FACILITY_ACTIVATED32C1',w,{village:v.name,villageId:v.id,type:r.type,tileId:r.row.id,source,projectsBefore:r.projects,projectCap:r.cap,funding:+Number(r.funding?.funding||0).toFixed(2),goldCost:+Number(r.funding?.goldCost||0).toFixed(2)});return ok;
}
const season32C1=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const _t=NS._e9Now?NS._e9Now():0;if(this.status==='active')tryMilitary32C1(this,w,'PRE_SEASON');if(NS._e9PerfAdd)NS._e9PerfAdd(w,'militaryFacility',NS._e9Now()-_t);return season32C1.call(this,w);};
const progress32C1=NS.Village.prototype.progressConstruction;
NS.Village.prototype.progressConstruction=function(w){const before=projectCount32C1(this),r=progress32C1.call(this,w),after=projectCount32C1(this);if(after<before&&this.status==='active')tryMilitary32C1(this,w,'PROJECT_FREED');return r;};

function diag32C1(v,w){const r=readiness32C1(v,w,true),reserve=shouldReserve32C1(v,w);return{militaryFacilityTarget32C1:r.type||'NONE',militaryFacilityBlocker32C1:r.type?(r.ready?(r.projects>=r.cap?'PROJECT_CAPACITY':'NONE'):r.blocker):r.blocker||'NO_TARGET',militaryFacilityFunding32C1:+Number(r.funding?.funding||0).toFixed(2),militaryFacilityGoldNeed32C1:+Number(r.funding?.goldCost||0).toFixed(2),militaryFacilityReservedSlot32C1:reserve.reserve?1:0};}

/* ============================================================
   3) Statistics select stability
   Full stats redraw is skipped while a selector is focused/open.
   This prevents old wrapper layers from replacing <option> DOM every tick.
   ============================================================ */
if(NS.UI){
 const stats32C1=NS.UI.prototype.renderStats,statIds32C1=new Set(['statsScope','statsNation','statsSettlement','statsMetric','statsPeriod','statsResource30A','statsResource31F']),htmlDesc32C1=(typeof Element!=='undefined'?Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'):null);
 NS.UI.prototype.renderStats=function(){
  const a=typeof document!=='undefined'?document.activeElement:null,protect=!!(a&&statIds32C1.has(a.id)&&a.tagName==='SELECT'&&a.isConnected&&htmlDesc32C1?.get&&htmlDesc32C1?.set);
  if(!protect)return stats32C1.call(this);
  try{
   Object.defineProperty(a,'innerHTML',{configurable:true,get(){return htmlDesc32C1.get.call(this);},set(_v){/* 열린 드롭다운의 option DOM은 틱 렌더 중 교체하지 않는다. */}});
   return stats32C1.call(this);
  }finally{try{delete a.innerHTML;}catch(_){}}
 };
}

/* ---------- telemetry ---------- */
const snap32C1=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap32C1.call(this,w,reason,note);if(!s)return s;let reserved=0;for(const row of s.villages||[]){const v=w.villages.find(x=>Number(x.id)===Number(row.id));if(!v)continue;const d=diag32C1(v,w);Object.assign(row,d);reserved+=d.militaryFacilityReservedSlot32C1;}s.global.militaryFacilityReservedSlots32C1=reserved;const ys=(this.yearlySummaries||[]).find(x=>x.year===w.year);if(ys){ys.global.militaryFacilityReservedSlots32C1=reserved;for(const n of ys.nations||[]){const row=s.villages.find(x=>Number(x.id)===Number(n.id));if(row)for(const k of ['militaryFacilityTarget32C1','militaryFacilityBlocker32C1','militaryFacilityFunding32C1','militaryFacilityGoldNeed32C1','militaryFacilityReservedSlot32C1'])n[k]=row[k];}}return s;};
const csv32C1=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csv32C1.call(this),lines=base.split('\n'),extra=['militaryFacilityTarget32C1','militaryFacilityBlocker32C1','militaryFacilityFunding32C1','militaryFacilityGoldNeed32C1','militaryFacilityReservedSlot32C1'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;if(!lines.length)return base;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k]??'')).join(',');}return lines.join('\n');};
const json32C1=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json32C1.call(this,w);d.version='0.32C1a';Object.assign(d.worldSummary,{v32C1Revision:REV32C1,techTreeAudit32C1:'39-tech tree audited; incomplete or misleading effect descriptions synchronized and selected weak/high-friction technologies buffed without global research-cost reduction',ironEurekas32C1:'owned iron deposit -> IRON_MINING Eureka; mine+20 ore -> SMELTING Eureka; first iron output -> IRONWORKING Eureka',militaryFacilityActivation32C1:'barracks/watchtowers, training ground/fortification, armory/ironworking; military facilities pre-plan before normal seasonal construction and may reserve one strategic slot',militaryFacilityFinance32C1:'military facilities may use conserved settlement-market surplus plus treasury through the existing strategic funding model',statsSelectorFix32C1:'stats rendering continues every tick while only the active statistics select blocks option-DOM replacement, preserving an open dropdown without freezing the stats tab'});return d;};

/* ---------- save / load ---------- */
function attach32C1(w){w=NS.V032C?.attachWorld?.(w)||w;for(const v of w.villages||[])v._world=w;return w;}
const ser32C1=NS.World.prototype.serialize,from32C1=NS.World.from;
NS.World.prototype.serialize=function(){const d=ser32C1.call(this);d.version='0.32C1a';d.v32c1={revision:REV32C1,techTreeAudit:true,militaryFacilityActivation:true,statsSelectStability:true};return d;};
NS.World.from=function(d){if(d?.version==='0.32C1a'||d?.version==='0.32C1')return attach32C1(from32C1({...d,version:'0.32C'}));return attach32C1(from32C1(d));};

/* ---------- UI ---------- */
if(NS.UI){const set32C1=NS.UI.prototype.setWorld,head32C1=NS.UI.prototype.renderHeader,content32C1=NS.UI.prototype.renderVillageContent;NS.UI.prototype.setWorld=function(w){return set32C1.call(this,attach32C1(w));};NS.UI.prototype.renderHeader=function(){head32C1.call(this);document.title='Village Observer V0.32C1a';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32C1a</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32C1a 통계 탭 핫픽스 · C1 기술/군사 보정 유지';};NS.UI.prototype.renderVillageContent=function(){content32C1.call(this);if(this.sub!=='military')return;const v=this.world.selectedNation,root=this.q('villageContent');if(!v||!root)return;const d=diag32C1(v,this.world);let box=root.querySelector('.v32c1-diag');if(!box){box=document.createElement('div');box.className='v32b-note v32c1-diag';root.appendChild(box);}box.innerHTML=`<strong>🏗️ 군사시설 발화 진단</strong><div class="small">목표 <strong>${d.militaryFacilityTarget32C1}</strong> · 차단 <strong>${d.militaryFacilityBlocker32C1}</strong> · 전략 슬롯 ${d.militaryFacilityReservedSlot32C1?'예약':'미예약'}</div><div class="small muted">Gold 자금 ${d.militaryFacilityFunding32C1.toFixed(1)}/${d.militaryFacilityGoldNeed32C1.toFixed(1)}G · 병영=봉수와 파수 · 훈련장=축성술 · 무기고=철공</div>`;};}

if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32C1a'))NS.PATCH_NOTES.unshift({version:'V0.32C1a',date:'2026-09-26',title:'통계 탭 핫픽스 · C1 기술/군사 보정 유지',summary:'39개 기술의 실제 효과 설명을 정리하고 일부 약한/고비용 기술을 선별 버프합니다. 군사시설이 일반 건설·재정에 밀려 92년까지 0개였던 병목을 전략 슬롯과 보존형 시장재정으로 수정하고 통계 드롭다운의 틱 초기화를 막습니다.',sections:[['기술트리',['전체 연구비를 일괄 인하하지 않고 봉수와 파수 500, 축성술 500, 학당 교육 660, 공공사업 660, 원양 항해 720으로 선별 조정합니다.','중복 선행조건을 정리합니다: 봉수와 파수←행정제도, 축성술←정착지 계획, 상법←화폐제도, 제련←철광 채굴.','기술 설명과 효과 목록에 작업슬롯·건축공간·질병/아사·시장접촉·군사시설 해금 등 실제 숨은 효과를 표시합니다.','철광맥 보유/철광산+철광석/최초 철 생산에 철기 3단계 유레카를 추가합니다.']],['축성술·군사시설',['축성술은 방책 방어 기여도를 기존 총 +2.5에서 +4.0으로 올리고 방책 자재 -15%, 노동 -20%를 제공합니다.','병영은 봉수와 파수, 훈련장은 축성술, 무기고는 철공 기술에 연결됩니다.','군사시설 조건이 충족되면 일반 계절 건설보다 먼저 착공을 시도하고 필요 시 공사 슬롯 1개를 전략적으로 비웁니다.','Settlement 시장 잉여 Gold와 국고를 실제 보유량 범위에서 공동 사용하며 Gold는 생성하지 않습니다.']],['UI·관측',['통계 계산·차트 렌더는 계속 수행하되, 현재 열려 있는 드롭다운의 option DOM만 틱 중 교체하지 않도록 수정합니다.','군사 탭과 telemetry에 다음 군사시설 목표·차단 원인·가용 Gold·전략 슬롯 상태를 추가합니다.']]]});

(function(){const KEY='village-observer-v0-32c1a',fallback=['village-observer-v0-32c1','village-observer-v0-32c','village-observer-v0-32b','village-observer-v0-32a','village-observer-v0-31i','village-observer-v0-31h','village-observer-v0-31g','village-observer-v0-31f','village-observer-v0-31a','village-observer-v0-31'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v032C1a-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v032C1a-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v032C1a-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attach32C1(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
NS.V032C1={revision:REV32C1,attachWorld:attach32C1,diagnostics:diag32C1,readiness:readiness32C1,tryStartMilitaryFacility:tryMilitary32C1};
try{window.villageObserver?.renderHeader?.();}catch(_){}
})(window.VSim);

