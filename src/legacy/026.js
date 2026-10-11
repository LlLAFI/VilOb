
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const RES=['food','wood','stone'];
const BASE={food:.32,wood:.35,stone:.49};
const RLAB={food:'🌾 식량',wood:'🪵 목재',stone:'🪨 석재'};
NS.NATION_COLORS=['#62a8ff','#74d69c','#ff8b91','#bd9cff','#f2b45b','#5fd0cf'];

/* ---------- V0.18 six AI dispositions ---------- */
function brain(type,label,mods){return new NS.VillageBrain(type,label,mods);}
const BRAIN_FACTORY={
 survival:()=>brain('survival','생존안정형',{FOOD:5,MAINTAIN:4,TRADE:2,EXPAND:-2}),
 diplomatic:()=>brain('diplomatic','교역외교형',{TRADE:8,MAINTAIN:1,SECURITY:-1}),
 expansionist:()=>brain('expansionist','영토확장형',{EXPAND:8,SECURITY:2,TRADE:-1}),
 balanced:()=>brain('balanced','균형형',{MAINTAIN:2}),
 urbanist:()=>brain('urbanist','도시집약형',{MAINTAIN:4,HOUSING:5,EXPAND:-4}),
 resource_seeker:()=>brain('resource_seeker','자원개척형',{EXPAND:5,TRADE:2})
};
NS.Brains={create:t=>(BRAIN_FACTORY[t]||BRAIN_FACTORY.balanced)(),random(){const k=Object.keys(BRAIN_FACTORY);return BRAIN_FACTORY[k[Math.floor(Math.random()*k.length)]]();},types:Object.keys(BRAIN_FACTORY)};

const createVillages17=NS.World.prototype.createVillages;
NS.World.prototype.createVillages=function(n){
 // Constructors and MapData shells still ask for four; new V0.18 worlds deliberately start with six.
 const wanted=(Number(n)===4&&(!this.villages||this.villages.length===0))?6:n;
 return createVillages17.call(this,wanted);
};

const baseScores17=NS.VillageBrain.prototype.baseScores;
NS.VillageBrain.prototype.baseScores=function(v,w){
 const s=baseScores17.call(this,v,w);
 if(NS.AIProfileCompat(v,'urbanConcentration')>.5){
  const ts=[...v.territory].map(id=>w.map.get(id)).filter(Boolean);
  const used=ts.reduce((a,t)=>a+(NS.V017?.usedSpace?.(t)||0),0),dev=ts.reduce((a,t)=>a+Number(t.developedBuildSpace||0),0);
  const spaceRatio=dev>0?used/dev:0;
  const maxHousing=ts.length?Math.max(...ts.map(t=>NS.V017?.settlementPressure?.(v,t,w)?.housing||0)):0;
  s.MAINTAIN+=spaceRatio>.72?7:2;s.HOUSING+=maxHousing>68?12:4;s.EXPAND-=spaceRatio<.72?4:8;
 }
 if(NS.AIProfileCompat(v,'resourceSeeking')>.5){
  const rr=v.resourceRatios?.(w)||{},scarcity=Math.max(0,.22-(rr.wood||0))+Math.max(0,.20-(rr.stone||0));
  s.EXPAND+=6+scarcity*45;s.TRADE+=scarcity*16;
 }
 if(NS.AIProfileCompat(v,'territorialExpansion')>.5){
  const settled=[...v.territory].filter(id=>v.tileResidents(id).some(p=>p.alive)),adultless=settled.filter(id=>!v.tileResidents(id).some(p=>p.alive&&p.age>=16)).length/Math.max(1,settled.length);
  const recentRuins=(w.telemetry?.entries||[]).filter(e=>e.type==='OUTPOST_RUINED'&&e.payload?.village===v.name&&w.ordinalDay()-(e.ordinalDay||0)<=240).length;
  // Expansionists stay expansionist, but repeated frontier collapse is remembered as a soft warning.
  s.EXPAND-=Math.min(22,adultless*24+recentRuins*3.5);
  if(adultless>.25)s.MAINTAIN+=8;
 }
 return s;
};

const expansion17=NS.Village.prototype.expansionCandidates;
NS.Village.prototype.expansionCandidates=function(w){
 const rows=expansion17.call(this,w);if(!(NS.AIProfileCompat(this,'resourceSeeking')>.5)||!rows.length)return rows;
 const owned=[...this.territory].map(id=>w.map.get(id)).filter(Boolean);
 const avg=k=>owned.length?owned.reduce((a,t)=>a+(NS.V017?.marketPrice?.(this,t,k,w)||BASE[k]),0)/owned.length:BASE[k];
 const rel={food:avg('food')/BASE.food,wood:avg('wood')/BASE.wood,stone:avg('stone')/BASE.stone};
 for(const q of rows){const t=q.tile;if(!t||t.terrain==='water')continue;q.score+=(Number(t.resourceCap?.food||0)/1700)*5*rel.food+(Number(t.resourceCap?.wood||0)/2350)*13*rel.wood+(Number(t.resourceCap?.stone||0)/3350)*17*rel.stone+(Number(t.resourceCap?.gold||0)/180)*8;}
 return rows.sort((a,b)=>b.score-a.score);
};

/* ---------- actual production ledger ---------- */
function ensureV18(v){
 v.productionDaily=Array.isArray(v.productionDaily)?v.productionDaily:[];
 v.festivalState=v.festivalState||{until:0,lastDay:-99999,tileId:null,count:0,goldSpent:0,foodSpent:0};
 v._v18SpaceBlockedUntil=v._v18SpaceBlockedUntil||{};
 return v;
}
function addProduction(v,day,k,qty){if(!v||!RES.includes(k)||qty<=0)return;ensureV18(v);let r=v.productionDaily.at(-1);if(!r||r.day!==day){r={day,food:0,wood:0,stone:0};v.productionDaily.push(r);}r[k]+=qty;v.productionDaily=v.productionDaily.filter(x=>day-x.day<150).slice(-150);}
function productionRate(v,w,k,days=30){ensureV18(v);const now=w.ordinalDay(),start=now-days+1,sum=v.productionDaily.filter(r=>r.day>=start&&r.day<=now).reduce((a,r)=>a+Number(r[k]||0),0),den=Math.max(1,Math.min(days,now));return sum/den;}
let ACTIVE_WORLD=null;
const advance17=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(){ACTIVE_WORLD=this;try{return advance17.call(this);}finally{ACTIVE_WORLD=null;}};
const harvest17=NS.Tile.prototype.harvest;
NS.Tile.prototype.harvest=function(kind,amount,day){const got=harvest17.call(this,kind,amount,day);if(got>0&&ACTIVE_WORLD&&this.ownerId!=null&&RES.includes(kind))addProduction(ACTIVE_WORLD.villages[this.ownerId],Number(day||ACTIVE_WORLD.ordinalDay()),kind,got);return got;};

/* ---------- food trade: internal relief first, real landed-price discipline ---------- */
function internalFoodDonor(v,w,buyerTileId){
 const rows=[...v.territory].filter(id=>id!==buyerTileId&&v.tileResidents(id).some(p=>p.alive)&&v.settlementReserveDays(id)>65);
 for(const id of rows){const info=v.internalLogisticsCapacity?.(id,buyerTileId,'food',false);if(!info||Number(info.capacity||0)>0)return id;}return null;
}
const deal17=NS.World.prototype.dealCandidate;
NS.World.prototype.dealCandidate=function(buyer,seller,resource,route){
 const d=deal17.call(this,buyer,seller,resource,route);if(!d)return null;
 if(resource!=='food')return d;
 const bt=this.map.get(d.buyerTileId??d.sourceTileId);if(!bt)return null;
 const pop=Math.max(1,buyer.tileResidents(bt.id).filter(p=>p.alive).length),localDays=Number(bt.stocks?.food||0)/(pop*.36),nationalDays=buyer.foodReserveDays(),donor=internalFoodDonor(buyer,this,bt.id);
 const qty=Math.max(.001,Number(d.qty||0)),landed=Number(d.unitPrice||0)+Number(d.fee||0)/qty,local=Number(d.buyerLocalPrice||NS.V017?.marketPrice?.(buyer,bt,'food',this)||BASE.food);
 const emergency=localDays<12||nationalDays<28;
 if(!emergency&&donor!=null)return null;
 if(emergency){if(landed>local*1.55&&nationalDays>=18)return null;d.foodTradeReason='EMERGENCY_IMPORT';d.score=(d.score||0)+55+Math.max(0,28-nationalDays)*2;}
 else {if(localDays>=38)return null;if(landed>=local*.98)return null;d.foodTradeReason='ECONOMIC_IMPORT';d.score=(d.score||0)+Math.max(0,(local-landed)*qty*45);}
 d.localFoodDays=+localDays.toFixed(1);d.nationalFoodDays=+nationalDays.toFixed(1);d.internalDonorTileId=donor;d.landedUnitPrice=+landed.toFixed(3);
 return d;
};
const executeTrade17=NS.World.prototype.executeTrade;
NS.World.prototype.executeTrade=function(d){const ok=executeTrade17.call(this,d);if(ok&&d.resource==='food'){const e=[...(this.telemetry.entries||[])].reverse().find(x=>x.type==='TRADE'&&x.ordinalDay===this.ordinalDay()&&x.payload?.buyerId===d.buyer?.id&&x.payload?.sellerId===d.seller?.id&&x.payload?.resource==='food');if(e){e.payload.foodTradeReason=d.foodTradeReason||null;e.payload.localFoodDays=d.localFoodDays??null;e.payload.nationalFoodDays=d.nationalFoodDays??null;e.payload.landedUnitPrice=d.landedUnitPrice??null;e.payload.internalDonorTileId=d.internalDonorTileId??null;}}return ok;};

/* ---------- surplus Gold -> public festivals -> temporary happiness ---------- */
function considerFestival(v,w){
 ensureV18(v);const f=v.festivalState,day=w.ordinalDay();if(f.until>=day||day-f.lastDay<240||v.recoveryState?.active)return false;
 const reserve=Math.max(v.targetGold?.()||0,80),surplus=v.gold-reserve;if(v.gold<Math.max(180,reserve*1.75)||surplus<35||v.foodReserveDays()<75||v.avgHappiness()>81)return false;
 const tiles=[...v.territory].map(id=>w.map.get(id)).filter(Boolean).sort((a,b)=>v.tileResidents(b.id).filter(p=>p.alive).length-v.tileResidents(a.id).filter(p=>p.alive).length),t=tiles[0];if(!t)return false;
 const goldCost=Math.min(surplus*.28,Math.max(18,12+v.population()*.28+v.territory.size*.5)),foodCost=Math.max(4,v.population()*.45),available=v.stockAt?.(t.id,'food')||0;if(available<foodCost)return false;
 const took=v.withdrawAt(t.id,'food',foodCost);if(took<foodCost*.9){if(took>0)v.depositAt(t.id,'food',took);return false;}v.gold-=goldCost;f.lastDay=day;f.until=day+60;f.tileId=t.id;f.count=(f.count||0)+1;f.goldSpent=(f.goldSpent||0)+goldCost;f.foodSpent=(f.foodSpent||0)+foodCost;
 w.log(`${v.name}이(가) (${t.x},${t.y})에서 공공 축제를 열었습니다.`,false,'FESTIVAL_HELD',{village:v.name,tileId:t.id,goldCost:+goldCost.toFixed(2),foodCost:+foodCost.toFixed(2),until:f.until,avgHappinessBefore:+v.avgHappiness().toFixed(1)});return true;
}
const seasonal17=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){seasonal17.call(this,w);considerFestival(this,w);};
const metabolism17=NS.Person.prototype.metabolism;
NS.Person.prototype.metabolism=function(v,w,worked=true){metabolism17.call(this,v,w,worked);ensureV18(v);const f=v.festivalState;if(f.until>=w.ordinalDay()){
 const boost=this.homeTileId===f.tileId?8:3,target=clamp(Number(this.happinessTarget??this.happiness)+boost,0,95);this.happinessTarget=target;this.happiness=clamp(this.happiness+(target-this.happiness)*.012,0,100);
 }};

/* ---------- prevent repeated impossible space construction ---------- */
const startConstruction17=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason='AI'){
 ensureV18(this);const key=`${tileId}:${type}`,day=w.ordinalDay();if(Number(this._v18SpaceBlockedUntil[key]||0)>day)return false;
 const t=w.map.get(tileId),need=NS.V017?.buildingFootprint?.(type)||1,remain=t?NS.V017?.remainingSpace?.(this,t):Infinity,pot=t?NS.V017?.accessiblePotential?.(this,t):0;
 if(t&&need>Number(remain||0)+1e-6){const redirected=pot>Number(t.developedBuildSpace||0)+.05&&this.startLandDevelopment?.(w,tileId,'BLOCKED_CONSTRUCTION_SPACE');this._v18SpaceBlockedUntil[key]=day+120;w.telemetry.record(redirected?'BUILDING_BLOCKED_SPACE_REDIRECT':'BUILDING_BLOCKED_SPACE',w,{village:this.name,tileId,type,need:+need.toFixed(2),remaining:+Number(remain||0).toFixed(2),developed:+Number(t.developedBuildSpace||0).toFixed(2),potential:+Number(pot||0).toFixed(2),reason,cooldownDays:120});return false;}
 return startConstruction17.call(this,w,tileId,type,reason);
};

/* ---------- telemetry and save migration ---------- */
function attachV18World(w){NS.V017.attachWorld(w);for(const v of w.villages)ensureV18(v);return w;}
const villageSer17=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=villageSer17.call(this);ensureV18(this);d.productionDaily=this.productionDaily;d.festivalState=this.festivalState;d._v18SpaceBlockedUntil=this._v18SpaceBlockedUntil;return d;};
const worldSer17=NS.World.prototype.serialize,worldFrom17=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSer17.call(this);d.version='0.18';d.v18={sixDispositions:true,festivalGoldSink:true,productionTelemetry:true,foodTradeDiscipline:true,eurekaVisual:true,directionalFlowMaps:true,statsPriceFix:true};return d;};
NS.World.from=function(d){if(!['0.8','0.9','0.10','0.11','0.12','0.13','0.14','0.15','0.16','0.17','0.18'].includes(d.version))throw new Error('V0.8~V0.18 세이브만 불러올 수 있습니다.');const source=d.version,w=worldFrom17(source==='0.18'?{...d,version:'0.17'}:d);if(source==='0.18'){for(const v of w.villages){const src=(d.villages||[]).find(x=>x.id===v.id)||{};v.productionDaily=src.productionDaily||[];v.festivalState=src.festivalState||null;v._v18SpaceBlockedUntil=src._v18SpaceBlockedUntil||{};}}return attachV18World(w);};
const snapshot17=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snapshot17.call(this,w,reason,note);for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;ensureV18(v);r.productionFood30=+productionRate(v,w,'food',30).toFixed(3);r.productionWood30=+productionRate(v,w,'wood',30).toFixed(3);r.productionStone30=+productionRate(v,w,'stone',30).toFixed(3);r.productionFood120=+productionRate(v,w,'food',120).toFixed(3);r.productionWood120=+productionRate(v,w,'wood',120).toFixed(3);r.productionStone120=+productionRate(v,w,'stone',120).toFixed(3);r.festivalCount=v.festivalState.count||0;r.festivalGoldSpent=+Number(v.festivalState.goldSpent||0).toFixed(2);}return s;};
const csv17=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const extra=['productionFood30','productionWood30','productionStone30','productionFood120','productionWood120','productionStone120','festivalCount','festivalGoldSpent'],base=csv17.call(this),lines=base.split('\n');if(!lines.length)return base;const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k])).join(',');}return lines.join('\n');};
const json17=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json17.call(this,w);d.version='0.18';d.worldSummary.foodTrade='internal relief first; normal imports require favorable landed price; emergency premiums allowed';d.worldSummary.festivalEconomy='surplus national Gold + food can fund temporary public happiness';d.worldSummary.productionTelemetry='actual natural harvesting tracked as 30/120-day per-day production';d.worldSummary.aiDispositions='survival-stability / trade-diplomacy / territorial-expansion / balanced / urbanist / resource-seeker';d.worldSummary.flowMap='recent one-year internal logistics and trade shown as directional arrows';return d;};
NS.V018={attachWorld:attachV18World,productionRate,considerFestival};

(function(){const KEY='village-observer-v0-18',fallback=['village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v018-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v018-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v018-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){const w=NS.V014.worldFromMapData(JSON.parse(await file.text()));return attachV18World(w);}};})();

/* ---------- directional flow overlays ---------- */
function aggregateFlows(w,type,days=120){const now=w.ordinalDay(),map=new Map();for(const e of w.telemetry?.entries||[]){if(now-Number(e.ordinalDay||0)>days)continue;let from,to,qty,resource=e.payload?.resource||'';if(type==='logistics'&&e.type==='INTERNAL_LOGISTICS'){from=e.payload?.fromTileId;to=e.payload?.toTileId;qty=Number(e.payload?.qty||0);}else if(type==='trade'&&e.type==='TRADE'){from=e.payload?.sellerTileId;to=e.payload?.buyerTileId;qty=Number(e.payload?.qty||0);}else continue;if(from==null||to==null||!qty)continue;const key=`${from}>${to}`,r=map.get(key)||{from,to,qty:0,resources:{}};r.qty+=qty;r.resources[resource]=(r.resources[resource]||0)+qty;map.set(key,r);}return[...map.values()];}
function drawArrow(ctx,x1,y1,x2,y2,width,color,dashed=true,offset=0){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);if(len<3)return;const ux=dx/len,uy=dy/len,nx=-uy,ny=ux;const trim=Math.min(14,len*.16),sx=x1+ux*trim+nx*offset,sy=y1+uy*trim+ny*offset,ex=x2-ux*trim+nx*offset,ey=y2-uy*trim+ny*offset;ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.setLineDash(dashed?[Math.max(4,width*2.4),Math.max(3,width*1.8)]:[]);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);const size=5+width*1.25,a=Math.atan2(ey-sy,ex-sx);ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-size*Math.cos(a-.52),ey-size*Math.sin(a-.52));ctx.lineTo(ex-size*Math.cos(a+.52),ey-size*Math.sin(a+.52));ctx.closePath();ctx.fill();ctx.restore();}
function drawFlowMap(ui,type){const c=ui.q('worldCanvas'),g=ui._mapGeom;if(!c||!g)return;const rows=aggregateFlows(ui.world,type,120);if(!rows.length)return;const max=Math.max(...rows.map(r=>r.qty),1),ctx=c.getContext('2d'),pairs=new Set(rows.map(r=>`${Math.min(r.from,r.to)}:${Math.max(r.from,r.to)}`));for(const r of rows){const a=ui.world.map.get(r.from),b=ui.world.map.get(r.to);if(!a||!b)continue;const rev=rows.some(q=>q.from===r.to&&q.to===r.from),offset=rev?(r.from<r.to?3:-3):0,width=1.2+3.8*Math.sqrt(r.qty/max),color=type==='trade'?'rgba(245,202,112,.82)':'rgba(100,210,255,.78)';drawArrow(ctx,g.ox+(a.x+.5)*g.cell,g.oy+(a.y+.5)*g.cell,g.ox+(b.x+.5)*g.cell,g.oy+(b.y+.5)*g.cell,width,color,true,offset);}}

/* ---------- UI fixes and additions ---------- */
if(NS.UI){
 const bind17=NS.UI.prototype.bind,header17=NS.UI.prototype.renderHeader,map17=NS.UI.prototype.renderMap,content17=NS.UI.prototype.renderVillageContent,tech17=NS.UI.prototype.renderTech,setWorld17=NS.UI.prototype.setWorld;
 NS.UI.prototype.setWorld=function(w){return setWorld17.call(this,attachV18World(w));};
 NS.UI.prototype.bind=function(){bind17.call(this);
  const sel=this.q('v15LayerSelect');if(sel&&!sel.querySelector('option[value="trade"]')){const o=document.createElement('option');o.value='trade';o.textContent='교역 지도';sel.appendChild(o);}
  const rerender=()=>this.renderStats();for(const id of ['statsScope','statsNation','statsSettlement','statsMetric','statsPeriod']){const el=this.q(id);if(!el)continue;el.onchange=()=>{if(id==='statsScope')this.statsScope=el.value;if(id==='statsNation'){this.statsNationId=Number(el.value);this.statsSettlementId=null;}if(id==='statsSettlement')this.statsSettlementId=Number(el.value);if(id==='statsMetric')this.statsMetric=el.value;if(id==='statsPeriod')this.statsPeriod=Number(el.value);rerender();};}
 };
 NS.UI.prototype.renderHeader=function(){header17.call(this);this.q('runtimeStatus').textContent='✓ V0.18 6개 국가 성향 · 식량교역 교정 · 축제 · 생산량 · 방향 물류/교역';document.title='Village Observer V0.18';const eye=document.querySelector('.eyebrow');if(eye)eye.textContent='Village Observer · V0.18';};
 NS.UI.prototype.renderMap=function(){map17.call(this);if(this.mapLayer==='logistics'||this.mapLayer==='trade')drawFlowMap(this,this.mapLayer);const legend=this.q('v15LayerLegend');if(legend){if(this.mapLayer==='logistics')legend.textContent='최근 1년 내부 물류 · 화살표 방향/굵기=이동 방향/양';if(this.mapLayer==='trade')legend.textContent='최근 1년 국가간 교역 · 판매지 → 구매지';}};
 NS.UI.prototype.renderTech=function(){tech17.call(this);const v=this.world.selectedNation||this.world.selectedVillage;if(!v)return;for(const b of this.q('techTree')?.querySelectorAll('[data-tech]')||[]){const id=b.dataset.tech;if(v.technologies?.has(id))continue;if(v.eurekaClaimed?.has?.(id)){b.classList.add('eureka-ready');const name=b.querySelector('.tech-name');if(name&&!name.querySelector('.v18-eureka-badge'))name.insertAdjacentHTML('beforeend',' <span class="v18-eureka-badge">⚡ 유레카</span>');}}};
 NS.UI.prototype.renderVillageContent=function(){content17.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el)return;
  if(this.sub==='settlements'){const detail=el.querySelector('.v17-settlement-detail'),grid=el.querySelector('.settlement-grid');if(detail&&grid)grid.parentNode.insertBefore(detail,grid);el.querySelectorAll('[data-v17-settlement]').forEach(card=>{card.onclick=()=>{this.world.selectedTileId=Number(card.dataset.v17Settlement);this.selectedSettlementDetailId=this.world.selectedTileId;this.renderVillageContent();requestAnimationFrame(()=>this.q('villageContent')?.querySelector('.v17-settlement-detail')?.scrollIntoView({block:'start',behavior:'smooth'}));};});}
  if(this.sub==='economy'){ensureV18(v);const p30=Object.fromEntries(RES.map(k=>[k,productionRate(v,this.world,k,30)])),p120=Object.fromEntries(RES.map(k=>[k,productionRate(v,this.world,k,120)])),f=v.festivalState;el.insertAdjacentHTML('afterbegin',`<div class="v18-production"><strong>⛏️ 실제 생산량</strong><div class="small muted">수입·내부물류를 제외하고 자연자원에서 실제 채취된 양의 평균입니다.</div><div class="grid" style="margin-top:7px">${RES.map(k=>`<div class="info">${RLAB[k]}<div class="big">${p30[k].toFixed(2)} /일</div><div class="small muted">최근 1년 ${p120[k].toFixed(2)} /일</div></div>`).join('')}</div></div>${(f.count||0)>0?`<div class="v18-festival-note small">🎉 공공 축제 ${f.count}회 · 누적 Gold ${Number(f.goldSpent||0).toFixed(1)} 사용${f.until>=this.world.ordinalDay()?' · 현재 축제 효과 진행 중':''}</div>`:''}`);}
 };
}

if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`
.tech-card.eureka-ready{border-color:#e7c65b;box-shadow:0 0 0 1px rgba(231,198,91,.3),0 0 18px rgba(231,198,91,.14);background:linear-gradient(145deg,#18283b,#2a2b22)}.v18-eureka-badge{display:inline-block;font-size:9px;color:#ffe68c;border:1px solid #8f7836;border-radius:999px;padding:2px 5px;margin-left:4px;vertical-align:1px}.v18-production{margin-bottom:10px;padding:10px;border:1px solid #355d7f;border-radius:13px;background:#0d1a2b}.v18-festival-note{margin:7px 0 10px;padding:7px 9px;border:1px solid #7b6535;border-radius:10px;background:rgba(245,202,112,.08)}
`;document.head.appendChild(st);}

})(window.VSim);

