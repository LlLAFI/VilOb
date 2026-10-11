
window.VSim=window.VSim||{};
(function(NS){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ============================================================
   V0.13 · settlement population visibility / adaptive diplomatic AI /
           sparse strategic rivalry / local food balance
   ============================================================ */

const FOOD_SPOIL_THRESHOLD=.78;
const FOOD_SPOIL_SAFE=.72;
const FOOD_SPOIL_RATE=.035;
const EMERGENCY_FOOD_DAYS=10;
const EMERGENCY_TARGET_DAYS=24;
const CONCERN_ENTER=50;
const CONCERN_RESOLVE=38;

function ensureV13Nation(v,w){
 v._world=w;
 v.strategicConcerns=v.strategicConcerns||{};
 v.strategicConcernStates=v.strategicConcernStates||{};
 v.foodBalanceStats=v.foodBalanceStats||{spoiled:0,emergencyMoved:0,emergencyMoves:0};
 return v;
}
function attachV13World(w){NS.V012.attachWorld(w);for(const v of w.villages||[])ensureV13Nation(v,w);return w;}

/* ---------- Sparse strategic competition: border + recent trade contacts only ---------- */
function borderContacts(v,w){
 const day=w.ordinalDay();if(v._v13BorderCache?.day===day&&v._v13BorderCache.size===v.territory.size)return new Set(v._v13BorderCache.ids);
 const ids=new Set();for(const id of v.territory){for(const n of w.map.neighbors4(id)){if(n.ownerId!=null&&n.ownerId!==v.id)ids.add(n.ownerId);}}v._v13BorderCache={day,size:v.territory.size,ids:[...ids]};return ids;
}
function contactIds(v,w){
 const ids=borderContacts(v,w),day=w.ordinalDay();
 for(const r of w.recentTrades||[]){if(day-(r.day||0)>180)continue;if(r.buyerId===v.id)ids.add(r.sellerId);else if(r.sellerId===v.id)ids.add(r.buyerId);}
 return [...ids].filter(id=>w.villages.some(x=>x.id===id&&x.status==='active'));
}
function nationPower(v){return v.population()+v.territory.size*3.4+v.technologies.size*2.4+Math.log2(Math.max(1,v.gold)+1)*1.4;}
function recentDependency(v,o,w){
 let imp=0,exp=0;const day=w.ordinalDay();
 for(const r of w.recentTrades||[]){if(day-(r.day||0)>180)continue;const q=Number(r.qty)||0;if(r.buyerId===v.id&&r.sellerId===o.id)imp+=q;else if(r.sellerId===v.id&&r.buyerId===o.id)exp+=q;}
 const total=imp+exp;if(total<1)return 0;return clamp((imp-exp)/total,0,1);
}
function strategicConcernDetail(v,o,w){
 ensureV13Nation(v,w);const borders=borderContacts(v,w),border=borders.has(o.id),own=nationPower(v),other=nationPower(o),ratio=other/Math.max(1,own),dependency=recentDependency(v,o,w),relation=Number(v.relations?.[o.id]||0);
 let score=8+(border?18:0)+clamp((ratio-.90)*60,0,45)+clamp((o.territory.size-v.territory.size)*2,0,20)+clamp((o.technologies.size-v.technologies.size)*2,0,12)+dependency*15-clamp(relation,0,120)/120*8;
 if(NS.AIProfileCompat(v,'tradeDiplomacy')>.5)score*=.84;else if(NS.AIProfileCompat(v,'territorialExpansion')>.5)score*=1.08;else if(NS.AIProfileCompat(v,'survivalPriority')>.5)score*=.96;
 return{score:clamp(score,0,100),border,powerRatio:ratio,dependency,relation,target:o};
}
NS.Village.prototype.strategicConcernList=function(w){
 ensureV13Nation(this,w);const day=w.ordinalDay();if(this._v13ConcernCache?.day===day)return this._v13ConcernCache.rows;const rows=contactIds(this,w).map(id=>{const o=w.villages.find(x=>x.id===id);return o?strategicConcernDetail(this,o,w):null;}).filter(Boolean).sort((a,b)=>b.score-a.score);
 this.strategicConcerns=Object.fromEntries(rows.map(r=>[r.target.id,+r.score.toFixed(1)]));this._v13ConcernCache={day,rows};return rows;
};
NS.Village.prototype.maxStrategicConcern=function(w){return this.strategicConcernList(w)[0]||null;};
function updateConcernEvents(v,w){
 const active=new Set();
 for(const r of v.strategicConcernList(w)){
  active.add(String(r.target.id));const key=String(r.target.id),was=!!v.strategicConcernStates[key];
  if(r.score>=CONCERN_ENTER&&!was){v.strategicConcernStates[key]=true;w.telemetry.record('STRATEGIC_CONCERN_ENTER',w,{village:v.name,target:r.target.name,concern:+r.score.toFixed(1),border:r.border,powerRatio:+r.powerRatio.toFixed(2),dependency:+r.dependency.toFixed(2)});}
  else if(r.score<CONCERN_RESOLVE&&was){v.strategicConcernStates[key]=false;w.telemetry.record('STRATEGIC_CONCERN_RESOLVED',w,{village:v.name,target:r.target.name,concern:+r.score.toFixed(1)});}
  if(r.score>=CONCERN_ENTER){const drift=r.score>=75?.55:.20;v.relations[r.target.id]=(v.relations[r.target.id]||0)-drift;}
 }
 for(const key of Object.keys(v.strategicConcernStates)){if(!active.has(key)&&v.strategicConcernStates[key])v.strategicConcernStates[key]=false;}
}

/* ---------- Diplomatic AI: trade first, but stop looping when trade fails to solve structure ---------- */
const plan12=NS.Village.prototype.updateStrategicPlan;
NS.Village.prototype.updateStrategicPlan=function(w){
 const p=plan12.call(this,w);if(!(NS.AIProfileCompat(this,'tradeDiplomacy')>.5))return p;const x=this.strategicProfile(w),structural=Math.max(x.woodDef||0,Math.max(0,60-(x.avg||0))/60,x.housingUrgency||0),ready=(x.stagnantYears||0)>6&&structural>.25&&(x.front||0)>0&&(x.settlers||0)>=2;
 p.adaptiveExpansion=!!ready;if(ready){p.reserves.wood=Math.max(p.reserves.wood||0,46);p.reserves.stone=Math.max(p.reserves.stone||0,16);p.reserves.food=Math.max(p.reserves.food||0,this.population()*.36*55);}return p;
};
const startConstruction12=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason='AI'){
 const p=this.aiPlan||this.updateStrategicPlan(w);if(NS.AIProfileCompat(this,'tradeDiplomacy')>.5&&p?.adaptiveExpansion&&this.tradingPosts().length>0){const protectedTypes=new Set(['warehouse','market','quarry','farmstead','trading_post']);if(protectedTypes.has(type)&&this.wood<46)return false;}
 return startConstruction12.call(this,w,tileId,type,reason);
};
const baseScores12=NS.VillageBrain.prototype.baseScores;
NS.VillageBrain.prototype.baseScores=function(v,w){
 const s=baseScores12.call(this,v,w),x=v._v10LastProfile||v.strategicProfile(w),concern=v.maxStrategicConcern(w),mem=v.aiMemory||{};
 if(concern)s.SECURITY+=(concern.score/100)*(NS.AIProfileCompat(v,'tradeDiplomacy')>.5?7:12);
 if(NS.AIProfileCompat(v,'tradeDiplomacy')>.5){
  const structural=Math.max(x.woodDef||0,Math.max(0,60-(x.avg||0))/60,x.housingUrgency||0),stagnant=Math.max(0,(x.stagnantYears||0)-5);
  if(stagnant>0&&structural>.20){
   s.EXPAND+=Math.min(42,stagnant*2.2+structural*24);
   if((x.occ||0)>.84)s.HOUSING+=Math.min(28,((x.occ-.84)/.20)*28);
   if((x.reachable||0)===0)s.TRADE-=Math.min(24,8+stagnant*1.6);
   else if(mem.lastAction==='TRADE'&&(mem.streak||0)>=6)s.TRADE-=Math.min(24,(mem.streak-5)*2.2+structural*8);
  }
 }
 return s;
};

/* ---------- Strategic export restraint: soft balancing, never a full embargo ---------- */
const deal12=NS.World.prototype.dealCandidate;
NS.World.prototype.dealCandidate=function(buyer,seller,resource,route){
 const d=deal12.call(this,buyer,seller,resource,route);if(!d)return null;
 const info=strategicConcernDetail(seller,buyer,this),c=info.score;if(c<=38)return d;
 const severity=clamp((c-38)/50,0,1),maxCut=resource==='food'?.10:resource==='wood'?.30:.24,temper=NS.AIProfileCompat(seller,'tradeDiplomacy')>.5?.62:1,factor=1-severity*maxCut*temper;
 if(factor>=.995)return d;
 d.qty*=factor;d.price*=factor;d.fee*=factor;d.total*=factor;d.score*=factor;d.strategicConcern=+c.toFixed(1);d.strategicRestraintFactor=+factor.toFixed(3);
 return d.qty>=1.5?d:null;
};

/* ---------- Local food balance: emergency relief + high-stock spoilage ---------- */
const logistics12=NS.World.prototype.processInternalLogistics;
NS.World.prototype.processInternalLogistics=function(){
 for(const v of this.activeVillages){ensureV13Nation(v,this);const occupied=[...v.territory].filter(id=>v.tileResidents(id).some(p=>p.alive));if(occupied.length<2)continue;
  const receivers=occupied.filter(id=>v.settlementReserveDays(id)<EMERGENCY_FOOD_DAYS).sort((a,b)=>v.settlementReserveDays(a)-v.settlementReserveDays(b));
  for(const rid of receivers){const rpop=v.tileResidents(rid).filter(p=>p.alive).length;if(!rpop)continue;const donors=occupied.filter(id=>id!==rid&&v.settlementReserveDays(id)>70).map(id=>({id,days:v.settlementReserveDays(id),...v.internalLogisticsCapacity(id,rid,'food',false)})).filter(x=>x.capacity>0).sort((a,b)=>b.days-a.days||a.cost-b.cost);if(!donors.length)continue;
   const q=donors[0],donorPop=v.tileResidents(q.id).filter(p=>p.alive).length,need=Math.max(0,rpop*.36*EMERGENCY_TARGET_DAYS-v.stockAt(rid,'food')),surplus=Math.max(0,v.stockAt(q.id,'food')-donorPop*.36*60),qty=Math.min(q.capacity*1.5,need,surplus);if(qty<1)continue;
   const {took,put}=NS.V034D3A.transferWithReturn(v,q.id,rid,'food',qty);if(put<=0)continue;v.logisticsStats.moves++;v.logisticsStats.foodMoved=(v.logisticsStats.foodMoved||0)+put;v.foodBalanceStats.emergencyMoved+=put;v.foodBalanceStats.emergencyMoves++;
   this.telemetry.record('INTERNAL_LOGISTICS',this,{village:v.name,resource:'food',qty:+put.toFixed(1),fromTileId:q.id,toTileId:rid,routeCost:+q.cost.toFixed(2),capacity:+(q.capacity*1.5).toFixed(2),reason:'EMERGENCY_FOOD'});
  }
 }
 logistics12.call(this);
};
function processFoodSpoilage(v,w){
 ensureV13Nation(v,w);let total=0;
 for(const id of v.territory){const t=w.map.get(id);if(!t?.stocks)continue;const cap=v.settlementCaps(id).food,stock=t.stocks.food||0;if(cap<=0||stock/cap<=FOOD_SPOIL_THRESHOLD)continue;const granary=t.buildingEfficiency?.('granary')||0,excess=Math.max(0,stock-cap*FOOD_SPOIL_SAFE),rate=FOOD_SPOIL_RATE*(1-.55*granary)*(v.hasTech?.('FOOD_PRESERVATION')?.60:1),loss=Math.min(stock,excess*rate);if(loss<=.05)continue;t.stocks.food-=loss;total+=loss;NS.V034D3A1?.spoilage?.(w,v,id,loss);}
 if(total>0){v.foodBalanceStats.spoiled+=total;if(total>=8)w.telemetry.record('FOOD_SPOILAGE',w,{village:v.name,qty:+total.toFixed(1),threshold:FOOD_SPOIL_THRESHOLD,granaryProtection:true});}
 return total;
}
const seasonal12=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){seasonal12.call(this,w);processFoodSpoilage(this,w);updateConcernEvents(this,w);};

/* ---------- Telemetry ---------- */
const snap12=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snap12.call(this,w,reason,note);for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;ensureV13Nation(v,w);const c=v.maxStrategicConcern(w);r.maxStrategicConcern=+(c?.score||0).toFixed(1);r.strategicConcernTarget=c?.target?.name||'';r.foodSpoiled=+v.foodBalanceStats.spoiled.toFixed(1);r.emergencyFoodMoved=+v.foodBalanceStats.emergencyMoved.toFixed(1);}return s;
};
NS.Telemetry.prototype.snapshotsCSV=function(){
 const c=['simTime','ordinalDay','reason','note','village','status','brain','population','avgHealth','avgHappiness','avgEnergy','avgHunger','food','foodReserveDays','wood','stone','gold','foodStorage','woodStorage','stoneStorage','security','threat','focus','territoryTiles','occupiedTiles','resourceFoodRatio','resourceWoodRatio','resourceStoneRatio','resourceGoldRatio','expansionTarget','expansionProgress','age0_14','age15_17','age18_42','age43_64','age65plus','reproductiveWomen','reproductiveMen','technologyCount','technologies','researchTarget','researchLabel','researchProgress','researchCost','totalKnowledge','tradeCount','tradeImports','tradeExports','tradeGoldSpent','tradeGoldEarned','tradeShippingEarned','internalMigrations','externalIn','externalOut','settlements','warehouses','tradingPosts','houses','houseLimitTotal','reachableTradeNations','nearestTradeCost','maxStrategicConcern','strategicConcernTarget','foodSpoiled','emergencyFoodMoved'];
 const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`,rows=[c.map(esc).join(',')];for(const s of this.snapshots||[])for(const v of s.villages||[])rows.push(c.map(k=>esc(k==='village'?(v.name??v.village??''):Object.prototype.hasOwnProperty.call(v,k)?v[k]:k==='simTime'?s.simTime:k==='ordinalDay'?s.ordinalDay:k==='reason'?s.reason:k==='note'?s.note:'')).join(','));return rows.join('\n');
};
const json12=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json12.call(this,w);d.version='0.13';d.worldSummary.strategicCompetition='sparse border/recent-trade concern + soft export restraint';d.worldSummary.diplomaticAdaptation='trade-first with stagnation/structural-deficit escape';d.worldSummary.foodBalance='local emergency food logistics + high-stock seasonal spoilage';return d;};

/* ---------- Save migration ---------- */
const serV12=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=serV12.call(this);d.strategicConcerns=this.strategicConcerns||{};d.strategicConcernStates=this.strategicConcernStates||{};d.foodBalanceStats=this.foodBalanceStats||{};return d;};
const serW12=NS.World.prototype.serialize,fromW12=NS.World.from;
NS.World.prototype.serialize=function(){const d=serW12.call(this);d.version='0.13';d.v13={settlementPopulationUI:true,diplomaticAdaptation:true,strategicCompetition:true,foodBalance:true};return d;};
NS.World.from=function(d){
 if(!['0.8','0.9','0.10','0.11','0.12','0.13'].includes(d.version))throw new Error('V0.8~V0.13 세이브만 불러올 수 있습니다.');
 const source=d.version,w=fromW12(source==='0.13'?{...d,version:'0.12'}:d);if(source==='0.13')for(const v of w.villages){const src=(d.villages||[]).find(x=>x.id===v.id)||{};v.strategicConcerns=src.strategicConcerns||{};v.strategicConcernStates=src.strategicConcernStates||{};v.foodBalanceStats=src.foodBalanceStats||{spoiled:0,emergencyMoved:0,emergencyMoves:0};}return attachV13World(w);
};
NS.V013={attachWorld:attachV13World,strategicConcern:strategicConcernDetail,contactIds,foodSpoil:{threshold:FOOD_SPOIL_THRESHOLD,safe:FOOD_SPOIL_SAFE,rate:FOOD_SPOIL_RATE},emergencyFoodDays:EMERGENCY_FOOD_DAYS};

(function(){
 const KEY13='village-observer-v0-13',KEY12='village-observer-v0-12',KEY11='village-observer-v0-11',KEY10='village-observer-v0-10',KEY9='village-observer-v0-9',KEY8='village-observer-v0-8';
 function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 NS.SaveSystem={
  save(w){localStorage.setItem(KEY13,JSON.stringify(w.serialize()));},
  load(){const r=localStorage.getItem(KEY13)||localStorage.getItem(KEY12)||localStorage.getItem(KEY11)||localStorage.getItem(KEY10)||localStorage.getItem(KEY9)||localStorage.getItem(KEY8);return r?NS.World.from(JSON.parse(r)):null;},
  export(w){dl(`village-observer-v013-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
  exportDevJSON(w){dl(`village-observer-v013-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
  exportDevCSV(w){dl(`village-observer-v013-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},
  async import(file){return NS.World.from(JSON.parse(await file.text()));}
 };
})();

/* ---------- UI ---------- */
if(NS.UI){
 const card12=NS.UI.prototype.settlementCard,content12=NS.UI.prototype.renderVillageContent,codex12=NS.UI.prototype.renderCodex;
 NS.UI.prototype.setWorld=function(w){this.stop();this.world=attachV13World(w);this.render();};
 NS.UI.prototype.renderHeader=function(){this.q('timeLabel').textContent=this.world.timestamp();this.q('worldMood').textContent=` · ${this.world.activeVillages.length}개 국가`;this.q('playBtn').textContent=this.world.running?'⏸':'▶';document.querySelectorAll('.speed').forEach(b=>b.classList.toggle('active',+b.dataset.speed===this.world.speed));this.q('runtimeStatus').textContent='✓ V0.13 정착지 인구 시각화 · 외교형 적응 · 전략적 견제 · 식량 균형';this.q('runtimeStatus').style.color='#5bd79d';};
 NS.UI.prototype.settlementCard=function(v,id){
  let html=card12.call(this,v,id),t=this.world.map.get(id);if(!t)return html;const n=v.tileResidents(id).filter(p=>p.alive).length,cap=Math.max(.1,NS.V011.effectiveLocalCapacity(t)),pct=clamp(n/cap*100,0,100),over=n>cap,cls=over?'v13-pop-over':pct>=80?'v13-pop-high':'';
  const block=`<div class="v13-pop-row ${cls}"><span class="v13-pop-badge">👥 <strong>${n}명</strong></span><div class="v13-pop-meter" title="유효 주거 ${cap.toFixed(1)}명"><span style="width:${pct.toFixed(1)}%"></span></div><span class="v13-pop-cap">주거 ${n}/${cap.toFixed(0)}</span></div>`;
  const pos=html.indexOf('</strong>');if(pos>=0)html=html.slice(0,pos+9)+block+html.slice(pos+9);return html;
 };
 NS.UI.prototype.renderVillageContent=function(){
  content12.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el||this.sub!=='overview')return;el.querySelector('.v13-diplomacy')?.remove();const rows=v.strategicConcernList(this.world),box=document.createElement('div');box.className='v13-diplomacy';const body=rows.length?rows.slice(0,4).map(r=>{const label=r.score>=75?'높음':r.score>=55?'경계':r.score>=35?'주의':'낮음';return`<div class="v13-concern-row"><span><strong>${r.target.name}</strong>${r.border?' · 국경 접촉':''}</span><span class="v13-concern-${label==='높음'||label==='경계'?'high':label==='주의'?'mid':'low'}">${label} ${r.score.toFixed(0)}</span></div>`;}).join(''):'<div class="small muted">현재 국경·최근 교역으로 연결된 전략적 접촉국이 없습니다.</div>';
  box.innerHTML=`<strong>⚖️ 외교·전략적 경계</strong><div class="small muted">국경, 상대적 세력, 기술·영토 격차와 최근 교역 의존을 바탕으로 계산합니다. 높은 경계는 전략 자원 수출을 완만하게 줄이고 SECURITY 판단에 반영됩니다.</div>${body}`;el.appendChild(box);
 };
 NS.UI.prototype.renderCodex=function(){
  codex12.call(this);const el=this.q('codexContent');if(!el||el.dataset.v13Ready)return;const prod=el.querySelector('[data-page="prod"]'),logi=el.querySelector('[data-page="logi"]');if(prod)prod.insertAdjacentHTML('beforeend',`<div class="codex-note"><strong>V0.13 식량 보관 균형</strong><br>정착지 식량 저장률이 ${(FOOD_SPOIL_THRESHOLD*100).toFixed(0)}%를 넘으면 ${(FOOD_SPOIL_SAFE*100).toFixed(0)}% 기준 초과분의 약 ${(FOOD_SPOIL_RATE*100).toFixed(0)}%가 분기마다 부패합니다. 활성 곡물창고는 손실을 약 55% 줄입니다.</div>`);if(logi)logi.insertAdjacentHTML('beforeend',`<div class="codex-note"><strong>긴급 식량 수송</strong><br>주민이 있는 정착지의 식량이 ${EMERGENCY_FOOD_DAYS}일 미만이면 70일 초과 비축 정착지에서 우선 구호 수송을 시도하며, 1회 수송용량은 평시의 1.5배까지 사용합니다.<br><strong>전략적 견제</strong><br>모든 국가 쌍을 전수 비교하지 않고 실제 국경 또는 최근 180일 교역 상대만 평가합니다. 경계가 높으면 목재·석재 수출량을 일부 줄이며 식량 제한은 훨씬 약합니다.</div>`);el.dataset.v13Ready='1';
 };
}
if(typeof document!=='undefined'){
 const st=document.createElement('style');st.textContent=`
 .v13-pop-row{display:grid;grid-template-columns:auto minmax(70px,1fr) auto;gap:8px;align-items:center;margin:8px 0 5px;padding:7px 8px;border-radius:9px;background:rgba(105,173,255,.08);border:1px solid rgba(105,173,255,.18)}.v13-pop-badge{font-size:14px}.v13-pop-badge strong{font-size:17px}.v13-pop-cap{font-size:11px;color:var(--muted);white-space:nowrap}.v13-pop-meter{height:9px;border-radius:99px;background:#273950;overflow:hidden}.v13-pop-meter span{display:block;height:100%;background:var(--nation-color,var(--accent));border-radius:99px}.v13-pop-high{border-color:rgba(245,202,112,.38)}.v13-pop-over{border-color:rgba(255,127,137,.55);background:rgba(255,127,137,.08)}.v13-pop-over .v13-pop-cap{color:var(--bad)}
 .v13-diplomacy{margin-top:10px;padding:10px;border:1px solid rgba(189,156,255,.25);border-radius:10px;background:rgba(120,80,170,.07)}.v13-concern-row{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line);font-size:12px}.v13-concern-row:last-child{border-bottom:0}.v13-concern-high{color:#ff9c9c}.v13-concern-mid{color:#ffd36f}.v13-concern-low{color:#8fd9b3}
 @media(max-width:600px){.v13-pop-row{grid-template-columns:auto 1fr}.v13-pop-cap{grid-column:1/-1}.v13-concern-row{align-items:center}}
 `;document.head.appendChild(st);
}

})(window.VSim);

