
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV23='stability-demography-economy-performance';
const clamp23=(v,a,b)=>Math.max(a,Math.min(b,v));
const RES23=['food','wood','stone'];
const RLAB23={food:'🌾 식량',wood:'🪵 목재',stone:'🪨 석재'};
const DETAIL_DAYS23=30*120;
function ensureNation23(v){
 if(!v)return v;
 v.fiscalStats23=v.fiscalStats23||{publicSpendingPending:0,lifetimePublicSpending:0,lifetimeCirculationRevenue:0,lastAnnualRevenue:0,lastTradeCount:Number(v.tradeStats?.count||0),lastRevenueYear:0};
 for(const k of ['publicSpendingPending','lifetimePublicSpending','lifetimeCirculationRevenue','lastAnnualRevenue','lastTradeCount','lastRevenueYear'])if(!Number.isFinite(Number(v.fiscalStats23[k])))v.fiscalStats23[k]=0;
 return v;
}
function attachV23World(w){NS.V022.attachWorld(w);for(const v of w.villages)ensureNation23(v);w.v23=w.v23||{revision:REV23};return w;}
/* Track construction/development Gold at the actual payment point so direct builds and projects use one source of truth. */
const payBuild22=NS.Village.prototype.payBuild;
NS.Village.prototype.payBuild=function(tileId,cost){
 const before=Number(this.gold||0),ok=payBuild22.call(this,tileId,cost);if(!ok)return ok;
 const spent=Math.max(0,before-Number(this.gold||0));if(spent>0){const f=ensureNation23(this).fiscalStats23;f.publicSpendingPending=0;f.lifetimePublicSpending+=spent;}return ok;
};
function recentDemography23(v,w,years=8){
 const cutoff=w.ordinalDay()-years*120,out={births:0,childDeaths:0,starvation:0,illness:0,oldAge:0};
 const a=w.telemetry?.entries||[];
 for(let i=a.length-1;i>=0;i--){const e=a[i],day=Number(e.ordinalDay||0);if(day<cutoff)break;if(e.payload?.village!==v.name)continue;if(e.type==='BIRTH')out.births++;else if(e.type==='DEATH_STARVATION'){out.starvation++;if(Number(e.payload?.age)<=14)out.childDeaths++;}else if(e.type==='DEATH_ILLNESS'){out.illness++;if(Number(e.payload?.age)<=14)out.childDeaths++;}else if(e.type==='DEATH_OLD_AGE')out.oldAge++;}
 const pop=Math.max(1,v.population()),deaths=out.starvation+out.illness+out.oldAge;
 out.childMortality=out.childDeaths/Math.max(1,out.births);out.illnessPressure=out.illness/pop;out.starvationPressure=out.starvation/pop;out.netPressure=deaths/Math.max(1,out.births);return out;
}
function prerequisiteOf23(id,target,seen=new Set()){
 if(id===target)return true;if(seen.has(target))return false;seen.add(target);const t=NS.TECH[target];if(!t)return false;for(const r of t.req||[])if(r===id||prerequisiteOf23(id,r,seen))return true;return false;
}
function pathBoost23(id,targets,weight){for(const t of targets)if(prerequisiteOf23(id,t,new Set()))return weight;return 0;}
/* Research AI: score survival technology paths from actual demographic outcomes, not only national food stock. */
NS.TechSystem.choose=function(v,w){
 const ids=this.available(v);if(!ids.length)return null;
 const rr=v.resourceRatios(w),fd=v.foodReserveDays(),trade=v.tradePressure(w),pop=v.population(),sett=v.territory.size,buildings=type=>v.buildingCount?.(w,type)||0,d=recentDemography23(v,w,8),year=Number(w.year||1);
 const healthNeed=clamp23(d.childMortality*.95+d.illnessPressure*.85,0,1.5),foodNeed=clamp23(d.starvationPressure*1.6+Math.max(0,30-fd)/55,0,1.5);
 const healthTargets=['SANITATION','PUBLIC_WORKS','EDUCATION','URBANIZATION'],foodTargets=['FOOD_PRESERVATION','CART','ROADS','FRONTIER_LOGISTICS'];
 const scored=ids.map(id=>{let s=13-Math.min(7,NS.TECH[id].cost/230);
  if(['AGRICULTURE','IRRIGATION','GRANARY','CROP_ROTATION','FOOD_PRESERVATION'].includes(id))s+=Math.max(0,55-fd)*.32+Math.max(0,.35-rr.food)*40;
  if(['CARPENTRY','FORESTRY','ARCHITECTURE'].includes(id))s+=Math.max(0,.38-rr.wood)*34+sett*1.2;
  if(['MASONRY','QUARRY','ENGINEERING','FORTIFICATION'].includes(id))s+=Math.max(0,.30-rr.stone)*28+sett;
  if(['BARTER','CART','MARKET','ROADS','CURRENCY','STANDARD_WEIGHTS','LONG_DISTANCE_TRADE','COMMERCIAL_LAW','ENVOYS'].includes(id))s+=trade*19+(NS.AIProfileCompat(v,'tradeDiplomacy')>.5?10:0)+(v.tradeStats?.count||0)*.10;
  if(['RECORD_KEEPING','SCHOLARSHIP','ACADEMY','EDUCATION'].includes(id))s+=pop*.20+6;
  if(['SURVEYING','FRONTIER_LOGISTICS','ADMINISTRATION','WATCHTOWERS'].includes(id))s+=sett*3.5+(NS.AIProfileCompat(v,'territorialExpansion')>.5?7:0);
  if(['URBAN_PLANNING','SANITATION','URBANIZATION','PUBLIC_WORKS'].includes(id))s+=Math.max(0,pop-18)*.35+sett*1.8;
  if(id==='ACADEMY'&&buildings('schoolhouse')===0)s+=4;
  s+=pathBoost23(id,healthTargets,healthNeed*30)+pathBoost23(id,foodTargets,foodNeed*26);
  if(year>=22&&!v.hasTech('FOOD_PRESERVATION'))s+=pathBoost23(id,['FOOD_PRESERVATION'],7+Math.min(7,(year-22)*.18));
  if(year>=25&&!v.hasTech('SANITATION'))s+=pathBoost23(id,['SANITATION'],9+Math.min(10,(year-25)*.22));
  if(year>=28&&!v.hasTech('CART'))s+=pathBoost23(id,['CART'],6);
  if(year>=32&&!v.hasTech('ROADS'))s+=pathBoost23(id,['ROADS'],6);
  if(year>=35&&!v.hasTech('PUBLIC_WORKS'))s+=pathBoost23(id,['PUBLIC_WORKS'],5);
  return{id,score:s+Math.random()*2.5};
 }).sort((a,b)=>b.score-a.score);
 v._v23LastResearchSignal={year,healthNeed:+healthNeed.toFixed(3),foodNeed:+foodNeed.toFixed(3),recent:d,top:scored.slice(0,4).map(x=>({id:x.id,score:+x.score.toFixed(2)}))};
 return scored[0]?.id||null;
};
/* Gold circulation: a modest annual return from domestic activity and a fraction of public spending. */
function annualCirculation23(v,w){
 const f=ensureNation23(v).fiscalStats23;if(f.lastRevenueYear===w.year)return 0;
 const adults=v.residents.filter(p=>p.alive&&p.age>=16&&p.assignment!=='PIONEER').length,merchants=v.residents.filter(p=>p.alive&&p.job==='상인'&&p.assignment!=='PIONEER').length;
 const commerce=(v.buildingCount?.(w,'market')||0)+(v.buildingCount?.(w,'trading_post')||0)+(v.buildingCount?.(w,'merchant_guild')||0)+(v.buildingCount?.(w,'grand_market')||0),tradeNow=Number(v.tradeStats?.count||0),tradeDelta=Math.max(0,tradeNow-f.lastTradeCount);
 const revenue=Math.min(6,adults*.004+merchants*.02+commerce*.025+tradeDelta*.01);
 f.publicSpendingPending=0;if(revenue>0)v.gold+=revenue;f.lastAnnualRevenue=revenue;f.lifetimeCirculationRevenue+=revenue;f.lastTradeCount=tradeNow;f.lastRevenueYear=w.year;
 if(revenue>=.08)w.telemetry.record('FISCAL_CIRCULATION',w,{village:v.name,revenue:+revenue.toFixed(3),adults,merchants,commerce,tradeDelta,publicSpendingReturn:0,model:'V0.33F4_ACTIVITY_ONLY_FISCAL_REVENUE'});return revenue;
}
const yearly22=NS.Village.prototype.yearlyTick;
NS.Village.prototype.yearlyTick=function(w){yearly22.call(this,w);annualCirculation23(this,w);};
/* Track Gold sinks through events without scanning the log every tick. */
const record22=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){
 const e=record22.call(this,type,w,payload),vname=payload?.village||payload?.nation,v=w?.villages?.find(x=>x.name===vname);
 if(v){const f=ensureNation23(v).fiscalStats23;let spend=0;if(type==='FRONTIER_EXPANSION_STARTED')spend=6+Math.max(0,(payload?.pioneers?.length||2)-2);else if(type==='FESTIVAL_HELD')spend=Number(payload?.goldCost||0);if(spend>0){f.publicSpendingPending=0;f.lifetimePublicSpending+=spend;}}
 /* Performance: keep only 30 years of detailed routine events; annual summaries/manual notes preserve older history. */
 if((Number(this.nextEntryId||0)%256===0||this.entries.length>12000)&&this.entries.length){const cutoff=w.ordinalDay()-DETAIL_DAYS23;if(Number(this.entries[0]?.ordinalDay||0)<cutoff)this.entries=this.entries.filter(x=>Number(x.ordinalDay||0)>=cutoff||x.type==='MANUAL_NOTE');}
 return e;
};
/* Population observer: World -> Nation -> Settlement. */
function people23(ui,v,scope){if(scope==='world')return ui.world.activeVillages.flatMap(n=>n.residents.filter(p=>p.alive));if(scope?.startsWith('settlement:')){const id=Number(scope.split(':')[1]);return v.residents.filter(p=>p.alive&&p.homeTileId===id);}return v.residents.filter(p=>p.alive);}
function socialPanel23(ui,v){
 let scope=ui.socialScope23||'nation';if(scope.startsWith('settlement:')&&!v.territory.has(Number(scope.split(':')[1])))scope='nation';ui.socialScope23=scope;
 const opts=`<option value="world">세계 전체</option><option value="nation">${v.name} 국가 전체</option>`+[...v.territory].map(id=>{const t=ui.world.map.get(id);return`<option value="settlement:${id}">(${t?.x},${t?.y})${id===v.coreTileId?' 중심지':''}</option>`;}).join('');
 const ps=people23(ui,v,scope),male=ps.filter(p=>p.sex==='남').length,female=ps.filter(p=>p.sex==='여').length,total=Math.max(1,ps.length),avgAge=ps.length?ps.reduce((s,p)=>s+Number(p.age||0),0)/ps.length:0,jobs=new Map();for(const p of ps)jobs.set(p.job,(jobs.get(p.job)||0)+1);const jobRows=[...jobs.entries()].sort((a,b)=>b[1]-a[1]),jmax=Math.max(1,...jobRows.map(x=>x[1])),bins=[];for(let a=0;a<80;a+=10)bins.push({label:`${a}~${a+9}`,m:0,f:0});bins.push({label:'80+',m:0,f:0});for(const p of ps){const i=Math.min(8,Math.floor(Number(p.age||0)/10));if(p.sex==='남')bins[i].m++;else bins[i].f++;}const amax=Math.max(1,...bins.flatMap(x=>[x.m,x.f])),title=scope==='world'?'세계 전체 인구 구조':scope==='nation'?`${v.name} 인구 구조`:`${v.name} 선택 정착지 인구 구조`;
 return`<div class="section-head"><div><h2>${title}</h2><div class="small muted">실제 Person을 세계·국가·정착지 범위로 집계합니다.</div></div><select id="v23SocialScope">${opts}</select></div><div class="v20-social-summary"><div class="v20-donut" style="--male:${male/total*360}deg"><div><strong>${ps.length}</strong><span>명</span></div></div><div><strong>성별·연령</strong><div class="small">♂ 남성 ${male}명 (${(male/total*100).toFixed(1)}%)</div><div class="small">♀ 여성 ${female}명 (${(female/total*100).toFixed(1)}%)</div><div class="small muted">평균연령 ${avgAge.toFixed(1)}세</div></div></div><h3>인구 피라미드</h3><div class="v20-pyramid">${bins.map(b=>`<div class="v20-age-row"><span class="v20-age-num">${b.m}</span><div class="v20-age-side left"><i style="width:${b.m/amax*100}%"></i></div><strong>${b.label}</strong><div class="v20-age-side right"><i style="width:${b.f/amax*100}%"></i></div><span class="v20-age-num">${b.f}</span></div>`).join('')}<div class="v20-pyr-label"><span>남성</span><span>여성</span></div></div><div class="small muted v23-age-note">V0.23까지 나이·출생·사망 판정은 연 단위입니다. 연중 분산 시간모델은 V0.24 대상입니다.</div><h3>직업 분포</h3><div class="v20-jobs">${jobRows.map(([job,n])=>`<div class="v20-job"><span>${job}</span><div class="bar"><i style="width:${n/jmax*100}%"></i></div><strong>${n}</strong></div>`).join('')||'<div class="muted">주민 없음</div>'}</div>`;
}
function economicInterpretation23(v,w){const pop=Math.max(1,v.population()),caps=v.storageCaps(w),owned=[...v.territory].map(id=>w.map.get(id)).filter(t=>t&&t.terrain!=='water'),settled=owned.filter(t=>v.tileResidents(t.id).some(p=>p.alive)||(t.buildings?.length||0)>0),priceTiles=settled.length?settled:owned,f=ensureNation23(v).fiscalStats23;const rows=RES23.map(k=>{const total=Number(v[k]||0),cap=Math.max(1,Number(caps[k]||0)),per=total/pop,fill=total/cap,price=priceTiles.length?priceTiles.reduce((s,t)=>s+Number(NS.V017?.marketPrice?.(v,t,k,w)||({food:.24,wood:.28,stone:.46}[k])),0)/priceTiles.length:0;return`<div class="v23-econ-row"><strong>${RLAB23[k]}</strong><span>총 ${total.toFixed(0)}</span><span>1인당 ${per.toFixed(2)}</span><span>저장 ${Math.round(fill*100)}%</span><span>평균 ${price.toFixed(3)}G</span></div>`;}).join('');return`<h3>가격 해석</h3><div class="small muted">가격은 세계 총량만이 아니라 현지 재고·저장 여유·건설수요·최근 거래에 반응합니다.</div><div class="v23-econ-table">${rows}</div><h3>Gold 순환</h3><div class="trade-row">최근 연간 일반세입 <strong>${Number(f.lastAnnualRevenue||0).toFixed(2)}G</strong> · 누적 일반세입 ${Number(f.lifetimeCirculationRevenue||0).toFixed(1)}G<div class="small muted">성인·상인·상업시설·무역활동에 기반한 소규모 일반세입입니다. V0.33F4부터 publicSpending 사후 환류는 0이며 건설 Gold는 결제 시점에 직접 국내 시장으로 순환합니다.</div></div>`;}
/* Save / telemetry */
const villageSer22=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSer22.call(this);d.fiscalStats23={...ensureNation23(this).fiscalStats23};return d;};
const worldSer22=NS.World.prototype.serialize,worldFrom22=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSer22.call(this);d.version='0.23';d.v23={stabilityPatch:true,demographyAwareResearch:true,worldPopulationObserver:true,goldCirculation:true,priceInterpretation:true,performanceInstrumentation:true,detailEventYears:30,revision:REV23};return d;};
NS.World.from=function(d){if(d.version==='0.23'){const w=worldFrom22({...d,version:'0.22'});for(const v of w.villages){const src=(d.villages||[]).find(x=>x.id===v.id)||{};v.fiscalStats23=src.fiscalStats23||v.fiscalStats23;}return attachV23World(w);}return attachV23World(worldFrom22(d));};
const snap22=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap22.call(this,w,reason,note);if(!s)return s;let rev=0,spend=0;for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;const f=ensureNation23(v).fiscalStats23,d=recentDemography23(v,w,8);r.fiscalRevenue23=+Number(f.lifetimeCirculationRevenue||0).toFixed(2);r.publicSpending23=+Number(f.lifetimePublicSpending||0).toFixed(2);r.recentChildMortality23=+Number(d.childMortality||0).toFixed(3);r.recentIllnessDeaths23=d.illness;r.recentStarvationDeaths23=d.starvation;rev+=Number(f.lifetimeCirculationRevenue||0);spend+=Number(f.lifetimePublicSpending||0);}s.global.fiscalRevenue23=+rev.toFixed(2);s.global.publicSpending23=+spend.toFixed(2);s.global.perfSimMs23=+Number(w._v23Perf?.simMs||0).toFixed(2);s.global.perfRenderMs23=+Number(w._v23Perf?.renderMs||0).toFixed(2);return s;};
const csv22=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const extra=['fiscalRevenue23','publicSpending23','recentChildMortality23','recentIllnessDeaths23','recentStarvationDeaths23'],base=csv22.call(this),lines=base.split('\n');if(!lines.length)return base;const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k])).join(',');}return lines.join('\n');};
const json22=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json22.call(this,w);d.version='0.23';d.worldSummary.demographyAwareResearch='recent child/illness/starvation outcomes raise survival-tech and prerequisite research priority';d.worldSummary.goldCirculation='V0.33F4: no public-spending return; small activity-based annual revenue remains and trade stays gold-conserving';d.worldSummary.populationStructure='world / nation / settlement observer scope';d.worldSummary.priceInterpretation='per-capita stock, storage fill and local average price exposed in economy UI';d.worldSummary.performance='SIM/render timing + 30-year detailed routine-event window; annual summaries preserved';d.worldSummary.v23Revision=REV23;return d;};
NS.V023={attachWorld:attachV23World,ensureNation:ensureNation23,recentDemography:recentDemography23,revision:REV23};
(function(){const KEY='village-observer-v0-23',fallback=['village-observer-v0-22','village-observer-v0-21','village-observer-v0-20','village-observer-v0-19','village-observer-v0-18','village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v023-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v023-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v023-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attachV23World(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
/* UI and runtime performance instrumentation. */
if(NS.UI){
 const setWorld22=NS.UI.prototype.setWorld,header22=NS.UI.prototype.renderHeader,content22=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.setWorld=function(w){return setWorld22.call(this,attachV23World(w));};
 NS.UI.prototype.start=function(){clearInterval(this.timer);this.timer=setInterval(()=>{const now=()=>globalThis.performance?.now?performance.now():Date.now(),a=now();for(let i=0;i<this.world.speed;i++)this.world.advanceOneDay();const b=now();this.render();const c=now(),old=this.world._v23Perf||{simMs:0,renderMs:0,samples:0},alpha=old.samples?.12:.35;this.world._v23Perf={simMs:old.simMs*(1-alpha)+(b-a)*alpha,renderMs:old.renderMs*(1-alpha)+(c-b)*alpha,samples:(old.samples||0)+1};},550);};
 NS.UI.prototype.renderHeader=function(){header22.call(this);const p=this.world._v23Perf,s=p?` · SIM ${p.simMs.toFixed(1)}ms / UI ${p.renderMs.toFixed(1)}ms`:'';this.q('runtimeStatus').textContent=`✓ V0.23 사회·경제 안정화 · 인구변천 AI · Gold 순환 · 성능 계측${s}`;document.title='Village Observer V0.23';const eye=document.querySelector('.eyebrow');if(eye)eye.textContent='Village Observer · V0.23';};
 NS.UI.prototype.renderVillageContent=function(){content22.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el)return;if(this.sub==='social'){el.innerHTML=socialPanel23(this,v);const sel=this.q('v23SocialScope');if(sel){sel.value=this.socialScope23||'nation';sel.onchange=()=>{this.socialScope23=sel.value;this.renderVillageContent();};}return;}if(this.sub==='economy'&&!el.querySelector('.v23-economy-extra'))el.insertAdjacentHTML('beforeend',`<div class="v23-economy-extra">${economicInterpretation23(v,this.world)}</div>`);};
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`.v23-age-note{max-width:720px;margin:-4px 0 14px}.v23-econ-table{margin-top:8px;border:1px solid var(--line);border-radius:12px;overflow:hidden}.v23-econ-row{display:grid;grid-template-columns:1.2fr repeat(4,minmax(70px,1fr));gap:8px;padding:8px 10px;border-bottom:1px solid var(--line);font-size:11px;align-items:center}.v23-econ-row:last-child{border-bottom:0}.v23-econ-row span{text-align:right;color:var(--muted)}#v23SocialScope{min-height:38px;border:1px solid var(--line);border-radius:10px;background:#13243a;color:var(--text);padding:6px 8px}@media(max-width:640px){.v23-econ-row{grid-template-columns:1fr 1fr;gap:5px}.v23-econ-row strong{grid-column:1/-1}.v23-econ-row span{text-align:left}}`;document.head.appendChild(st);}
})(window.VSim);

