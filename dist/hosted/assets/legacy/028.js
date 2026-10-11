
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const RES=['food','wood','stone'];
const RLAB={food:'🌾 식량',wood:'🪵 목재',stone:'🪨 석재'};
const V19_COLORS=['#62a8ff','#74d69c','#ff8b91','#bd9cff','#f2b45b','#5fd0cf'];
NS.NATION_COLORS=V19_COLORS;

/* ============================================================
   V0.19 · six-spawn MapData / specialized commerce & stone
          / readable flow maps / settlement-detail collapse
   ============================================================ */

/* ---------- specialized buildings ---------- */
NS.BUILDINGS.merchant_guild={label:'상단 회관',icon:'🏛️',capacity:0,maint:0,storage:{food:85,wood:70,stone:65},footprint:1.9,desc:'교역소가 고도화된 상업 거점입니다. 더 많은 교역을 처리하고 상인의 활동을 지원합니다.'};
NS.BUILDINGS.grand_market={label:'대시장',icon:'🏬',capacity:0,maint:0,storage:{food:75,wood:45,stone:35},footprint:2.25,desc:'거래량이 많은 도시의 대형 시장입니다. 교역 처리능력과 상업 활동을 높입니다.'};
NS.BUILDINGS.deep_quarry={label:'전문 채석장',icon:'⛏️',capacity:0,maint:0,storage:{food:0,wood:18,stone:150},footprint:2.7,desc:'풍부한 석재 매장지에 노동력을 집중하는 전문 채석시설입니다.'};
NS.BUILDINGS.stoneworks={label:'석재 가공장',icon:'🧱',capacity:0,maint:0,storage:{food:0,wood:20,stone:135},footprint:2.0,desc:'수입·채굴한 석재를 건설에 적합하게 가공해 현지 건설의 석재 효율을 높입니다.'};
if(NS.V08?.BUILD_COSTS){
 NS.V08.BUILD_COSTS.merchant_guild={wood:38,stone:24,gold:24};
 NS.V08.BUILD_COSTS.grand_market={wood:46,stone:32,gold:30};
 NS.V08.BUILD_COSTS.deep_quarry={wood:32,stone:20,gold:18};
 NS.V08.BUILD_COSTS.stoneworks={wood:28,stone:22,gold:16};
}
if(NS.V011?.constructionDays){
 NS.V011.constructionDays.merchant_guild=180;
 NS.V011.constructionDays.grand_market=210;
 NS.V011.constructionDays.deep_quarry=190;
 NS.V011.constructionDays.stoneworks=165;
}

/* Upgraded buildings preserve the semantic role of their predecessor. */
const has18=NS.Tile.prototype.hasBuilding,buildingEfficiency18=NS.Tile.prototype.buildingEfficiency;
NS.Tile.prototype.hasBuilding=function(type){
 if(type==='trading_post'&&has18.call(this,'merchant_guild'))return true;
 if(type==='market'&&has18.call(this,'grand_market'))return true;
 if(type==='quarry'&&has18.call(this,'deep_quarry'))return true;
 return has18.call(this,type);
};
NS.Tile.prototype.buildingEfficiency=function(type){let e=buildingEfficiency18.call(this,type);if(type==='trading_post')e=Math.max(e,buildingEfficiency18.call(this,'merchant_guild'));if(type==='market')e=Math.max(e,buildingEfficiency18.call(this,'grand_market'));if(type==='quarry')e=Math.max(e,buildingEfficiency18.call(this,'deep_quarry'));return e;};

/* ---------- trade throughput: a small piece of the later production-chain model ---------- */
function tradeVolumeAt(w,tileId,days=120,resource=null){
 const fast=NS.V034C1C?.tradeVolume?.(w,tileId,days,resource);if(fast!==null&&fast!==undefined)return fast;
 const now=w.ordinalDay();let qty=0,count=0;
 for(const e of w.telemetry?.entries||[]){
  if(!['TRADE','DOMESTIC_TRADE29'].includes(e.type)||now-Number(e.ordinalDay||0)>days)continue;
  if(resource&&e.payload?.resource!==resource)continue;
  const a=e.type==='DOMESTIC_TRADE29'?e.payload?.fromTileId:e.payload?.sellerTileId,b=e.type==='DOMESTIC_TRADE29'?e.payload?.toTileId:e.payload?.buyerTileId;
  if(a!==tileId&&b!==tileId)continue;
  qty+=Number(e.payload?.qty||0);count++;
 }
 return{qty,count};
}
function tradeCapacity(t){
 if(!t)return 0;let cap=0;
 if(has18.call(t,'merchant_guild'))cap+=420;else if(has18.call(t,'trading_post'))cap+=180;
 if(has18.call(t,'grand_market'))cap+=180;else if(has18.call(t,'market'))cap+=70;
 if(t.hasBuilding?.('harbor'))cap+=90;
 return cap;
}
function tradeUtilization(w,t){const cap=tradeCapacity(t),vol=tradeVolumeAt(w,t.id,120).qty;return{capacity:cap,volume:vol,util:cap>0?vol/cap:0};}

/* Merchant guilds and large markets also improve the people-side merchant ceiling. */
const merchant18=NS.Village.prototype.merchantCapacity;
NS.Village.prototype.merchantCapacity=function(){
 let q=merchant18.call(this),guilds=0,markets=0;
 for(const id of this.territory){const t=this._world?.map.get(id);if(!t)continue;if(has18.call(t,'merchant_guild'))guilds++;if(has18.call(t,'grand_market'))markets++;}
 return q+guilds*8+markets*4;
};
const fee18=NS.Village.prototype.tradeFeeMultiplier;
NS.Village.prototype.tradeFeeMultiplier=function(){let m=fee18.call(this),guilds=0,markets=0;for(const id of this.territory){const t=this._world?.map.get(id);if(!t)continue;if(has18.call(t,'merchant_guild'))guilds++;if(has18.call(t,'grand_market'))markets++;}m*=Math.pow(.96,Math.min(3,guilds));m*=Math.pow(.985,Math.min(3,markets));return Math.max(.38,m);};

/* Endpoints have finite recent-year processing capacity. It is a real but forgiving cap. */
const deal18=NS.World.prototype.dealCandidate;
function withLegacyTradePostAliases(villages,fn){const changed=[];for(const v of villages)for(const id of v.territory){const t=v._world?.map.get(id);if(!t?.buildings)continue;for(let i=0;i<t.buildings.length;i++)if(t.buildings[i]==='merchant_guild'){changed.push([t,i]);t.buildings[i]='trading_post';}}try{return fn();}finally{for(const [t,i] of changed)t.buildings[i]='merchant_guild';}}
NS.World.prototype.dealCandidate=function(buyer,seller,resource,route){
 const d=withLegacyTradePostAliases([buyer,seller],()=>deal18.call(this,buyer,seller,resource,route));if(!d)return null;
 const bt=this.map.get(d.buyerTileId??d.sourceTileId),st=this.map.get(d.sellerTileId??d.targetTileId);if(!bt||!st)return d;
 const bu=tradeUtilization(this,bt),su=tradeUtilization(this,st),old=Math.max(.001,Number(d.qty||0));
 if(bu.capacity>0&&su.capacity>0){
  const br=Math.max(0,bu.capacity-bu.volume),sr=Math.max(0,su.capacity-su.volume),room=Math.min(br,sr);
  if(room<1.5)return null;
  const qty=Math.min(old,room);if(qty<1.5)return null;
  if(qty<old){const scale=qty/old;d.qty=qty;d.price*=scale;d.fee*=scale;d.total=d.price+d.fee;d.score*=Math.max(.35,scale);}
  d.buyerTradeCapacity=+bu.capacity.toFixed(1);d.sellerTradeCapacity=+su.capacity.toFixed(1);d.buyerTradeUtilization=+bu.util.toFixed(3);d.sellerTradeUtilization=+su.util.toFixed(3);
 }
 return d;
};

/* ---------- stone specialization ---------- */
const harvest18=NS.Village.prototype.harvestMultiplier;
NS.Village.prototype.harvestMultiplier=function(kind,t){return harvest18.call(this,kind,t);};

/* A deep quarry can keep several real residents employed as miners when stone is valuable. */
const chooseJob18=NS.Person.prototype.chooseJob;
NS.Person.prototype.chooseJob=function(v,w){
 chooseJob18.call(this,v,w);if(!this.alive||this.age<15||this.assignment==='PIONEER')return;
 const t=this.homeTile?.(v,w);if(!t||!has18.call(t,'deep_quarry'))return;
 t.syncResources?.(w.ordinalDay());const ratio=t.ratio?.('stone',w.ordinalDay())||0,price=NS.V017?.marketPrice?.(v,t,'stone',w)||.46;
 const residents=v.tileResidents(t.id).filter(p=>p.alive&&p.age>=15&&p.assignment!=='PIONEER'),miners=residents.filter(p=>p.job==='광부').length,slots=5;
 if(ratio>.025&&miners<slots&&(price>.52||v.stone<Math.max(18,v.targetStone(w)*1.15))){if(this.job==='광부'||Math.random()<.58)this.job='광부';}
};

/* Stoneworks: local construction can use stone more efficiently. The benefit stays local. */
const effectiveCost18=NS.V08?.effectiveCost;
if(effectiveCost18)NS.V08.effectiveCost=function(v,type){
 const c=effectiveCost18(v,type),tileId=v?._v19CostTileId,t=v?._world?.map.get(tileId);
 if(t&&has18.call(t,'stoneworks')&&c?.stone>0&&!['stoneworks','deep_quarry'].includes(type))c.stone=Math.max(1,Math.round(c.stone*.88*10)/10);
 return c;
};
const startConstruction18=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason='AI'){
 const t=w.map.get(tileId);if(t){
  if(type==='trading_post'&&has18.call(t,'merchant_guild'))return false;
  if(type==='market'&&has18.call(t,'grand_market'))return false;
  if(type==='quarry'&&has18.call(t,'deep_quarry'))return false;
 }
 this._v19CostTileId=tileId;try{return startConstruction18.call(this,w,tileId,type,reason);}finally{this._v19CostTileId=null;}
};

/* ---------- specialization projects ---------- */
const SPECS={
 merchant_guild:{from:'trading_post',wood:38,stone:24,gold:24,duration:180},
 grand_market:{from:'market',wood:46,stone:32,gold:30,duration:210},
 deep_quarry:{from:'quarry',wood:32,stone:20,gold:18,duration:190}
};
function ensureV19(v){v.specializationProjects=Array.isArray(v.specializationProjects)?v.specializationProjects:[];v._v19SpecialCooldown=v._v19SpecialCooldown||{};return v;}
function allBusy(v,tileId){return (v.constructionProjects||[]).some(p=>p.tileId===tileId)|| (v.landDevelopmentProjects||[]).some(p=>p.tileId===tileId)|| (v.buildingUpgradeProjects||[]).some(p=>p.tileId===tileId)|| ensureV19(v).specializationProjects.some(p=>p.tileId===tileId);}
function startSpecialization(v,w,t,index,to,reason,score=0){
 ensureV19(v);const spec=SPECS[to],from=t?.buildings?.[index];if(!spec||from!==spec.from||allBusy(v,t.id))return false;
 const key=`${t.id}:${to}`,day=w.ordinalDay();if(Number(v._v19SpecialCooldown[key]||0)>day)return false;
 const extra=Math.max(0,(NS.V017?.buildingFootprint?.(to)||1)-(NS.V017?.buildingFootprint?.(from)||1)),remain=NS.V017?.remainingSpace?.(v,t)??999;
 if(remain+1e-6<extra){if((NS.V017?.accessiblePotential?.(v,t)||0)>Number(t.developedBuildSpace||0)+.05)v.startLandDevelopment?.(w,t.id,'SPECIALIZATION_SPACE');v._v19SpecialCooldown[key]=day+120;return false;}
 const cost={wood:spec.wood,stone:spec.stone,gold:spec.gold};if(v.hasTech?.('ARCHITECTURE')){cost.wood*=.9;cost.stone*=.9;}if(!v.payBuild?.(t.id,cost)){v._v19SpecialCooldown[key]=day+60;return false;}
 const p={id:`sp-${v.id}-${day}-${Math.random().toString(36).slice(2,7)}`,tileId:t.id,index,from,to,startDay:day,progress:0,duration:spec.duration,cost,reason,score};v.specializationProjects.push(p);
 w.log(`${v.name}이(가) (${t.x},${t.y})의 ${NS.BUILDINGS[from].label}을(를) ${NS.BUILDINGS[to].label}(으)로 고도화하기 시작했습니다.`,false,'BUILDING_SPECIALIZATION_STARTED',{village:v.name,tileId:t.id,from,to,duration:p.duration,cost,reason,score:+score.toFixed(1)});return true;
}
function progressSpecialization(v,w){const arr=ensureV19(v).specializationProjects;for(let i=arr.length-1;i>=0;i--){const p=arr[i],t=w.map.get(p.tileId);if(!t||t.ownerId!==v.id||t.buildings?.[p.index]!==p.from){arr.splice(i,1);continue;}const workers=v.tileResidents(p.tileId).filter(x=>x.alive&&x.age>=16&&x.assignment!=='PIONEER');if(!workers.length)continue;const skill=workers.reduce((s,x)=>s+Number(x.skills?.building||0),0)/workers.length;p.progress+=clamp(.32+workers.length*.09+skill/460,.28,1.25);if(p.progress>=p.duration){t.buildings[p.index]=p.to;if(t.buildingCondition)t.buildingCondition[p.index]=Math.max(75,Number(t.buildingCondition[p.index]??100));if(t.buildingRepairProgress)t.buildingRepairProgress[p.index]=0;arr.splice(i,1);w.log(`${v.name}의 (${t.x},${t.y}) ${NS.BUILDINGS[p.to].label} 고도화가 완료되었습니다.`,false,'BUILDING_SPECIALIZED',{village:v.name,tileId:t.id,from:p.from,to:p.to,elapsed:w.ordinalDay()-p.startDay,cost:p.cost,reason:p.reason});}}
}
function recentConstructionDemand(w,v,tileId,days=240){const fast=NS.V034C1C?.construction?.(w,v,tileId,days);if(fast!==null&&fast!==undefined)return fast;const now=w.ordinalDay();let n=0;for(const e of w.telemetry?.entries||[])if(now-Number(e.ordinalDay||0)<=days&&['BUILDING_STARTED','BUILDING_UPGRADE_STARTED','BUILDING_SPECIALIZATION_STARTED','LAND_DEVELOPMENT_STARTED'].includes(e.type)&&e.payload?.village===v.name&&(e.payload?.tileId===tileId||e.payload?.targetTileId===tileId))n++;return n;}
function recentStoneImports(w,tileId,days=240){const fast=NS.V034C1C?.stoneImports?.(w,tileId,days);if(fast!==null&&fast!==undefined)return fast;const now=w.ordinalDay();let q=0;for(const e of w.telemetry?.entries||[])if(['TRADE','DOMESTIC_TRADE29'].includes(e.type)&&e.payload?.resource==='stone'&&(e.payload?.buyerTileId===tileId||e.payload?.toTileId===tileId)&&now-Number(e.ordinalDay||0)<=days)q+=Number(e.payload?.qty||0);return q;}
function considerSpecialization(v,w){
 ensureV19(v);if(v.status!=='active'||v.recoveryState?.active)return false;
 const P=NS.V034C1C,scope=P?.begin?.(v,w);try{
 const day=w.ordinalDay(),tiles=[...v.territory].map(id=>w.map.get(id)).filter(Boolean),urbanBias=NS.AIProfileCompat(v,'urbanConcentration')>.5?.88:1,tradeBias=NS.AIProfileCompat(v,'tradeDiplomacy')>.5?.86:1,resBias=NS.AIProfileCompat(v,'resourceSeeking')>.5?.82:1;
 const candidates=[];
 for(const t of tiles){if(allBusy(v,t.id))continue;const p=NS.V017?.settlementPressure?.(v,t,w)||{commerce:0,production:0},flow=tradeUtilization(w,t),vol=flow.volume;
  const tp=t.buildings.indexOf('trading_post');if(tp>=0&&(v.hasTech('LONG_DISTANCE_TRADE')||v.hasTech('COMMERCIAL_LAW'))){const threshold=.72*tradeBias*urbanBias,score=p.commerce*.55+Math.min(130,flow.util*100)*.65+Math.min(35,tradeVolumeAt(w,t.id,120).count*4);if((flow.util>=threshold||p.commerce>=84*tradeBias)&&vol>=45)candidates.push({score,t,index:tp,to:'merchant_guild',reason:'TRADE_THROUGHPUT'});}
  const mi=t.buildings.indexOf('market');if(mi>=0&&(v.hasTech('CURRENCY')||v.hasTech('COMMERCIAL_LAW'))){const score=p.commerce*.62+Math.min(120,flow.util*100)*.52+v.tileResidents(t.id).filter(x=>x.alive).length*1.5;if((flow.util>=.62*tradeBias*urbanBias||p.commerce>=82*tradeBias)&&vol>=60)candidates.push({score,t,index:mi,to:'grand_market',reason:'URBAN_COMMERCE'});}
  const qi=t.buildings.indexOf('quarry');if(qi>=0&&v.hasTech('QUARRY')&&['rock','mountain'].includes(t.terrain)){t.syncResources?.(day);const ratio=t.ratio?.('stone',day)||0,price=NS.V017?.marketPrice?.(v,t,'stone',w)||.46,minRatio=.11*resBias,score=(price/.46)*42+ratio*95+(NS.AIProfileCompat(v,'resourceSeeking')>.5?18:0)+p.production*.20;if(ratio>=minRatio&&price>=.50*resBias)candidates.push({score,t,index:qi,to:'deep_quarry',reason:'STONE_SPECIALIZATION'});}
 }
 candidates.sort((a,b)=>b.score-a.score);if(candidates[0]&&candidates[0].score>=64)return startSpecialization(v,w,candidates[0].t,candidates[0].index,candidates[0].to,candidates[0].reason,candidates[0].score);
 /* A stoneworks is a separate city-side facility rather than a quarry tier. */
 if(v.hasTech('MASONRY')){
  const rows=tiles.filter(t=>!has18.call(t,'stoneworks')&&!allBusy(v,t.id)).map(t=>{const imports=recentStoneImports(w,t.id),cons=recentConstructionDemand(w,v,t.id),price=NS.V017?.marketPrice?.(v,t,'stone',w)||.46,pop=v.tileResidents(t.id).filter(x=>x.alive).length,score=imports*.18+cons*13+Math.max(0,price-.46)*120+pop*.8+(NS.AIProfileCompat(v,'urbanConcentration')>.5?12:0);return{t,imports,cons,price,score};}).filter(x=>x.imports>=28||x.cons>=3||x.price>=.69).sort((a,b)=>b.score-a.score);
  const x=rows[0];if(x&&x.score>=42&&((NS.V017?.remainingSpace?.(v,x.t)??0)>=(NS.V017?.buildingFootprint?.('stoneworks')||2)))if(v.startConstruction(w,x.t.id,'stoneworks','STONE_PROCESSING_DEMAND')){w.telemetry.record('SETTLEMENT_DEMAND_ACTION',w,{village:v.name,tileId:x.t.id,demand:'stone_processing',score:+x.score.toFixed(1),stoneImports:+x.imports.toFixed(1),recentConstruction:x.cons});return true;}
 }
 return false;
 }finally{P?.end?.(v,w,scope);}
}
const daily18=NS.Village.prototype.dailyTick;
NS.Village.prototype.dailyTick=function(w){daily18.call(this,w);progressSpecialization(this,w);};
const seasonal18=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){seasonal18.call(this,w);considerSpecialization(this,w);};

/* ---------- MapData v1: six explicit spawns, legacy 4/5 spawn auto-supplement ---------- */
function validateMapData19(d){
 if(!d||d.format!=='village-observer-map'||Number(d.version)!==1)throw new Error('Village Observer MapData v1 파일이 아닙니다.');
 if(!Number.isInteger(d.width)||!Number.isInteger(d.height)||d.width<4||d.height<4||d.width>200||d.height>200)throw new Error('맵 크기는 4~200 범위여야 합니다.');
 if(!Array.isArray(d.tiles)||d.tiles.length!==d.width*d.height)throw new Error('타일 데이터 수가 맵 크기와 맞지 않습니다.');
 for(let i=0;i<d.tiles.length;i++){const t=d.tiles[i];if(!NS.TERRAIN[t?.terrain])throw new Error(`알 수 없는 지형: ${t?.terrain}`);for(const k of ['food','wood','stone','gold'])if(!Number.isFinite(Number(t.resourceCap?.[k]))||!Number.isFinite(Number(t.resources?.[k])))throw new Error(`타일 #${i}의 ${k} 자원 값이 유효하지 않습니다.`);}
 if(!Array.isArray(d.spawns)||d.spawns.length<4)throw new Error('MapData에는 최소 4개의 Spawn이 필요합니다. V0.19 권장값은 A~F 6개입니다.');
 const seen=new Set(),count=Math.min(6,d.spawns.length);for(let i=0;i<count;i++){const s=d.spawns[i];if(!Number.isFinite(s?.x)||!Number.isFinite(s?.y))throw new Error(`Spawn ${s?.id||i+1}의 위치가 없습니다.`);const x=Math.floor(s.x),y=Math.floor(s.y);if(x<0||y<0||x>=d.width||y>=d.height)throw new Error(`Spawn ${s.id||i+1}이 맵 바깥에 있습니다.`);const key=`${x},${y}`;if(seen.has(key))throw new Error('같은 타일에 Spawn을 두 개 이상 둘 수 없습니다.');seen.add(key);const src=d.tiles[y*d.width+x];if(!NS.TERRAIN[src.terrain].passable)throw new Error(`Spawn ${s.id||i+1}이 물 타일에 있습니다.`);}return[];
}
function mapFromData19(d){validateMapData19(d);const m=Object.create(NS.TileMap.prototype);m.width=d.width;m.height=d.height;m.tiles=[];m.ruinIds=new Set();m.generationSeed=d.seed||'';m.generationMode='mapdata';m.mapName=d.name||'사용자 지도';for(let i=0;i<d.tiles.length;i++){const src=d.tiles[i],x=i%d.width,y=Math.floor(i/d.width),t=new NS.Tile(i,x,y,src.terrain);t.resourceCap={food:+src.resourceCap.food||0,wood:+src.resourceCap.wood||0,stone:+src.resourceCap.stone||0,gold:+src.resourceCap.gold||0};t.resources={food:clamp(+src.resources.food||0,0,t.resourceCap.food),wood:clamp(+src.resources.wood||0,0,t.resourceCap.wood),stone:clamp(+src.resources.stone||0,0,t.resourceCap.stone),gold:clamp(+src.resources.gold||0,0,t.resourceCap.gold)};if(src.waterType)t.waterType=src.waterType;t.lastResourceDay=1;t.ownerId=null;t.coreVillageId=null;t.ruin=null;t.buildings=[];t.unoccupiedDays=0;m.tiles.push(t);}const exact=d.spawns.slice(0,6).map(s=>m.at(Math.floor(s.x),Math.floor(s.y))).filter(Boolean),chosen=[...exact];const target=6;while(chosen.length<target){let pool=m.tiles.filter(t=>NS.TERRAIN[t.terrain]?.passable&&['plain','grass','forest'].includes(t.terrain)&&!chosen.some(c=>c.id===t.id));if(!pool.length)pool=m.tiles.filter(t=>NS.TERRAIN[t.terrain]?.passable&&!chosen.some(c=>c.id===t.id));if(!pool.length)break;pool.sort((a,b)=>{const amin=chosen.length?Math.min(...chosen.map(c=>m.distance(c.id,a.id))):99,bmin=chosen.length?Math.min(...chosen.map(c=>m.distance(c.id,b.id))):99,as=(NS.V014?.spawnSuitability?.(m,a)||0)+Math.min(12,amin)*6,bs=(NS.V014?.spawnSuitability?.(m,b)||0)+Math.min(12,bmin)*6;return bs-as;});chosen.push(pool[0]);}if(chosen.length<6)throw new Error('6개 국가를 배치할 수 있는 육지 Spawn이 부족합니다.');m.spawnIds=chosen.slice(0,6).map(t=>t.id);m._v19ProvidedSpawnCount=Math.min(6,d.spawns.length);return m;}
function worldFromMapData19(d){const m=mapFromData19(d),w=Object.create(NS.World.prototype);w.year=1;w.season=0;w.day=1;w.speed=1;w.running=false;w.eventCount=0;w.events=[];w.map=m;w.villages=[];w.selectedVillageId=null;w.selectedPersonId=null;w.selectedTileId=null;w.telemetry=new NS.Telemetry();w.anomalyStates={};w.recentTrades=[];w.tradeRouteCache={};w.mapSource={type:'mapdata',name:m.mapName||'MapData',seed:m.generationSeed||''};w.createVillages(6);const scores=m.spawnIds.map(id=>NS.V014?.spawnSuitability?.(m,m.get(id))??0),warnings=[];for(let i=0;i<scores.length;i++)if(scores[i]<78)warnings.push(`Spawn ${d.spawns?.[i]?.id||String.fromCharCode(65+i)}의 생존 적합도가 낮습니다 (${scores[i].toFixed(0)}).`);if(m._v19ProvidedSpawnCount<6)warnings.unshift(`구형 MapData의 ${m._v19ProvidedSpawnCount}개 Spawn을 유지하고 부족한 ${6-m._v19ProvidedSpawnCount}개 Spawn을 자동 보완했습니다.`);if(d.spawns.length>6)warnings.push('Spawn은 A~F 첫 6개만 사용했습니다.');w.mapSource.spawnSuitability=scores.map(x=>+x.toFixed(1));w.mapSource.warnings=warnings;w.mapSource.spawnMode=m._v19ProvidedSpawnCount>=6?'explicit-6':'legacy-supplemented';w.telemetry.snapshot(w,'WORLD_START');return attachV19World(w);}
NS.V014.validateMapData=validateMapData19;NS.V014.worldFromMapData=worldFromMapData19;

/* ---------- flow map: filters, halo, curves, major-flow mode ---------- */
function aggregateFlows19(w,type,days=120,resource='all',nationId=null){const now=w.ordinalDay(),map=new Map();for(const e of w.telemetry?.entries||[]){if(now-Number(e.ordinalDay||0)>days)continue;let from,to,qty,k=e.payload?.resource||'';if(type==='logistics'&&e.type==='INTERNAL_LOGISTICS'){from=e.payload?.fromTileId;to=e.payload?.toTileId;qty=Number(e.payload?.qty||0);}else if(type==='trade'&&e.type==='TRADE'){from=e.payload?.sellerTileId;to=e.payload?.buyerTileId;qty=Number(e.payload?.qty||0);}else continue;if(resource!=='all'&&k!==resource)continue;if(from==null||to==null||qty<=0)continue;if(nationId!=null){const a=w.map.get(from),b=w.map.get(to);if(a?.ownerId!==nationId&&b?.ownerId!==nationId)continue;}const key=`${from}>${to}`,r=map.get(key)||{from,to,qty:0,resources:{},count:0};r.qty+=qty;r.resources[k]=(r.resources[k]||0)+qty;r.count++;map.set(key,r);}return[...map.values()];}
function flowCurveSign(a,b){const x=((a*73856093)^(b*19349663))>>>0;return(x%3)-1;}
function drawCurvedArrow(ctx,x1,y1,x2,y2,width,color,curve=0){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);if(len<5)return;const ux=dx/len,uy=dy/len,nx=-uy,ny=ux,trim=Math.min(15,len*.16),sx=x1+ux*trim,sy=y1+uy*trim,ex=x2-ux*trim,ey=y2-uy*trim,cx=(sx+ex)/2+nx*curve,cy=(sy+ey)/2+ny*curve;ctx.save();ctx.lineCap='round';ctx.setLineDash([Math.max(4,width*2.2),Math.max(3,width*1.7)]);ctx.strokeStyle='rgba(3,8,16,.82)';ctx.lineWidth=width+3.2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx,cy,ex,ey);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx,cy,ex,ey);ctx.stroke();ctx.setLineDash([]);const t=.72,px=(1-t)*(1-t)*sx+2*(1-t)*t*cx+t*t*ex,py=(1-t)*(1-t)*sy+2*(1-t)*t*cy+t*t*ey,tx=2*(1-t)*(cx-sx)+2*t*(ex-cx),ty=2*(1-t)*(cy-sy),a=Math.atan2(ty,tx),size=6+width*1.3;ctx.fillStyle='rgba(3,8,16,.92)';ctx.beginPath();ctx.moveTo(px+size*.25*Math.cos(a),py+size*.25*Math.sin(a));ctx.lineTo(px-size*1.12*Math.cos(a-.52),py-size*1.12*Math.sin(a-.52));ctx.lineTo(px-size*1.12*Math.cos(a+.52),py-size*1.12*Math.sin(a+.52));ctx.closePath();ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-size*Math.cos(a-.52),py-size*Math.sin(a-.52));ctx.lineTo(px-size*Math.cos(a+.52),py-size*Math.sin(a+.52));ctx.closePath();ctx.fill();ctx.restore();}
function drawFlowMap19(ui,type){const c=ui.q('worldCanvas'),g=ui._mapGeom;if(!c||!g)return;const resource=ui.flowResource||'all',nation=ui.flowScope==='selected'?ui.world.selectedVillageId:null,all=aggregateFlows19(ui.world,type,120,resource,nation);if(!all.length){const legend=ui.q('v15LayerLegend');if(legend)legend.textContent=`최근 1년 ${type==='trade'?'교역':'내부 물류'} · 표시할 흐름 없음`;return;}all.sort((a,b)=>b.qty-a.qty);const max=Math.max(1,all[0].qty),major=ui.flowDensity!=='all',rows=major?all.filter((r,i)=>i<18&&r.qty>=Math.max(3,max*.075)):all.slice(0,60),ctx=c.getContext('2d');for(const r of [...rows].reverse()){const a=ui.world.map.get(r.from),b=ui.world.map.get(r.to);if(!a||!b)continue;const rev=rows.some(q=>q.from===r.to&&q.to===r.from),sign=rev?(r.from<r.to?1:-1):flowCurveSign(r.from,r.to),curve=sign*Math.min(g.cell*.42,Math.max(3,Math.hypot(a.x-b.x,a.y-b.y)*g.cell*.035)),width=1.35+4.3*Math.sqrt(r.qty/max),dominant=Object.entries(r.resources).sort((x,y)=>y[1]-x[1])[0]?.[0],palette={food:'rgba(126,211,255,.94)',wood:'rgba(72,170,255,.94)',stone:'rgba(72,126,255,.94)'},tradePalette={food:'rgba(241,203,92,.90)',wood:'rgba(95,211,135,.90)',stone:'rgba(210,216,228,.92)'},color=type==='logistics'?(resource==='all'?(palette[dominant]||'rgba(104,190,255,.94)'):(palette[resource]||'rgba(104,190,255,.94)')):(resource==='all'?(tradePalette[dominant]||'rgba(245,202,112,.9)'):(tradePalette[resource]||'rgba(245,202,112,.9)'));drawCurvedArrow(ctx,g.ox+(a.x+.5)*g.cell,g.oy+(a.y+.5)*g.cell,g.ox+(b.x+.5)*g.cell,g.oy+(b.y+.5)*g.cell,width,color,curve);}
 const legend=ui.q('v15LayerLegend');if(legend)legend.textContent=`최근 1년 ${type==='trade'?'교역':'내부 물류'} · ${major?'주요':'전체'} 흐름 ${rows.length}/${all.length}개 · ${type==='logistics'?(resource==='all'?'파란색 계열':`${RLAB[resource]} · 파란색 계열`):(resource==='all'?'자원색':RLAB[resource])}`;
}

/* ---------- save / telemetry ---------- */
function attachV19World(w){NS.V018.attachWorld(w);for(const v of w.villages)ensureV19(v);return w;}
const serV18=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=serV18.call(this);ensureV19(this);d.specializationProjects=this.specializationProjects;d._v19SpecialCooldown=this._v19SpecialCooldown;return d;};
const worldSer18=NS.World.prototype.serialize,worldFrom18=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSer18.call(this);d.version='0.19';d.v19={mapDataSixSpawns:true,specializedCommerce:true,specializedStone:true,flowFilters:true,nationColorUnified:true,collapsibleSettlementDetail:true};return d;};
NS.World.from=function(d){if(!['0.8','0.9','0.10','0.11','0.12','0.13','0.14','0.15','0.16','0.17','0.18','0.19'].includes(d.version))throw new Error('V0.8~V0.19 세이브만 불러올 수 있습니다.');const source=d.version,w=worldFrom18(source==='0.19'?{...d,version:'0.18'}:d);if(source==='0.19')for(const v of w.villages){const src=(d.villages||[]).find(x=>x.id===v.id)||{};v.specializationProjects=src.specializationProjects||[];v._v19SpecialCooldown=src._v19SpecialCooldown||{};}return attachV19World(w);};
const snap18=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap18.call(this,w,reason,note);for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;let guild=0,grand=0,deep=0,works=0,cap=0,vol=0;for(const id of v.territory){const t=w.map.get(id);if(!t)continue;if(has18.call(t,'merchant_guild'))guild++;if(has18.call(t,'grand_market'))grand++;if(has18.call(t,'deep_quarry'))deep++;if(has18.call(t,'stoneworks'))works++;cap+=tradeCapacity(t);vol+=tradeVolumeAt(w,t.id,120).qty;}r.merchantGuilds=guild;r.grandMarkets=grand;r.deepQuarries=deep;r.stoneworks=works;r.commercialCapacity120=+cap.toFixed(1);r.commercialVolume120=+vol.toFixed(1);r.commercialUtilization=cap?+(vol/cap).toFixed(3):0;}return s;};
const csv18=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const extra=['merchantGuilds','grandMarkets','deepQuarries','stoneworks','commercialCapacity120','commercialVolume120','commercialUtilization'],base=csv18.call(this),lines=base.split('\n');if(!lines.length)return base;const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k])).join(',');}return lines.join('\n');};
const json18=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json18.call(this,w);d.version='0.19';d.worldSummary.mapDataSpawns='MapData v1 uses explicit A-F six spawns; legacy 4/5 spawn maps are supplemented with warnings';d.worldSummary.commercialSpecialization='trading post -> merchant guild; market -> grand market; rolling one-year endpoint throughput capacity';d.worldSummary.stoneSpecialization='quarry -> deep quarry with real miner slots; stoneworks improves local construction stone efficiency';d.worldSummary.flowMap='one-year directional flows with major/all, resource and selected-nation filters, curved halo arrows';return d;};
NS.V019={attachWorld:attachV19World,worldFromMapData:worldFromMapData19,validateMapData:validateMapData19,tradeCapacity,tradeVolumeAt,tradeUtilization,considerSpecialization};

(function(){const KEY='village-observer-v0-19',fallback=['village-observer-v0-18','village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v019-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v019-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v019-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return worldFromMapData19(JSON.parse(await file.text()));}};})();

/* ---------- UI ---------- */
if(NS.UI){
 const setWorld18=NS.UI.prototype.setWorld,bind18=NS.UI.prototype.bind,header18=NS.UI.prototype.renderHeader,cards18=NS.UI.prototype.renderVillageCards,content18=NS.UI.prototype.renderVillageContent,map18=NS.UI.prototype.renderMap,codex18=NS.UI.prototype.renderCodex;
 NS.UI.prototype.setWorld=function(w){return setWorld18.call(this,attachV19World(w));};
 NS.UI.prototype.bind=function(){bind18.call(this);this.flowResource=this.flowResource||'all';this.flowScope=this.flowScope||'all';this.flowDensity=this.flowDensity||'major';const bar=document.querySelector('#view-map .map-toolbar');if(bar&&!document.getElementById('v19FlowResource')){const res=document.createElement('select');res.id='v19FlowResource';res.innerHTML='<option value="all">흐름: 전체 자원</option><option value="food">흐름: 식량</option><option value="wood">흐름: 목재</option><option value="stone">흐름: 석재</option>';const scope=document.createElement('select');scope.id='v19FlowScope';scope.innerHTML='<option value="all">범위: 모든 국가</option><option value="selected">범위: 선택 국가</option>';const density=document.createElement('select');density.id='v19FlowDensity';density.innerHTML='<option value="major">주요 흐름만</option><option value="all">전체 흐름</option>';for(const x of [res,scope,density])bar.appendChild(x);const sync=()=>{this.flowResource=res.value;this.flowScope=scope.value;this.flowDensity=density.value;this.renderMap();};res.onchange=scope.onchange=density.onchange=sync;}
 };
 NS.UI.prototype.renderHeader=function(){header18.call(this);this.q('runtimeStatus').textContent='✓ V0.19 6 Spawn MapData · 상업/석재 전문화 · 흐름지도 가독성';document.title='Village Observer V0.19';const eye=document.querySelector('.eyebrow');if(eye)eye.textContent='Village Observer · V0.19';};
 NS.UI.prototype.renderVillageCards=function(){cards18.call(this);const cols=NS.NATION_COLORS;[...this.q('villageCards')?.querySelectorAll('.village-card')||[]].forEach((b,i)=>b.style.setProperty('--nation-color',cols[(this.world.villages[i]?.id??i)%cols.length]));};
 NS.UI.prototype.renderVillageContent=function(){content18.call(this);const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el)return;el.style.setProperty('--nation-color',NS.NATION_COLORS[v.id%NS.NATION_COLORS.length]);
  if(this.sub==='settlements'){
   const detail=el.querySelector('.v17-settlement-detail');if(detail){const head=detail.querySelector('.section-head');if(head&&!head.querySelector('[data-v19-close-detail]')){const close=document.createElement('button');close.dataset.v19CloseDetail='1';close.textContent='접기 ✕';close.onclick=()=>{this.selectedSettlementDetailId=-1;this.renderVillageContent();};head.appendChild(close);}const id=Number(this.selectedSettlementDetailId),t=v.territory.has(id)?this.world.map.get(id):null;if(t){const util=tradeUtilization(this.world,t),miners=v.tileResidents(t.id).filter(p=>p.alive&&p.job==='광부').length,box=document.createElement('div');box.className='v19-special-info small';box.innerHTML=`<strong>🏭 전문화 상태</strong> · 교역 처리 ${util.volume.toFixed(0)}/${util.capacity.toFixed(0)} /년 (${(util.util*100).toFixed(0)}%) · 광부 ${miners}명${has18.call(t,'deep_quarry')?' / 전문 채석장 5자리':''}${has18.call(t,'stoneworks')?' · 석재 가공 효율 활성':''}`;detail.insertBefore(box,detail.querySelector('h3')||null);}}
   el.querySelectorAll('[data-v17-settlement]').forEach(card=>{card.onclick=()=>{const id=Number(card.dataset.v17Settlement);if(Number(this.selectedSettlementDetailId)===id)this.selectedSettlementDetailId=-1;else{this.world.selectedTileId=id;this.selectedSettlementDetailId=id;}this.renderVillageContent();if(this.selectedSettlementDetailId>=0)requestAnimationFrame(()=>this.q('villageContent')?.querySelector('.v17-settlement-detail')?.scrollIntoView({block:'start',behavior:'smooth'}));};});
  }
 };
 NS.UI.prototype.renderMap=function(){const flow=this.mapLayer==='logistics'||this.mapLayer==='trade',layer=this.mapLayer;if(flow)this.mapLayer='base';map18.call(this);if(flow){this.mapLayer=layer;drawFlowMap19(this,layer);}const controls=[this.q('v19FlowResource'),this.q('v19FlowScope'),this.q('v19FlowDensity')];for(const c of controls)if(c)c.style.display=flow?'inline-block':'none';};
 NS.UI.prototype.renderCodex=function(){codex18.call(this);const el=this.q('codexContent');if(!el||el.dataset.v19Note)return;const build=el.querySelector('[data-page="build"]'),logi=el.querySelector('[data-page="logi"]');if(build)build.insertAdjacentHTML('afterbegin','<div class="codex-note"><strong>V0.19 경제 전문화</strong><br>고대 교역소→고대 상단 회관, 고대 시장→고대 대시장은 최근 1년 실제 교역량과 상업 압력이 높을 때 개축됩니다. 교역시설은 최근 1년 처리능력을 가지며 포화되면 추가 거래가 제한됩니다.<br>고대 채석장→고대 전문 채석장은 높은 석재 가치와 충분한 매장량이 있을 때 개축되며 최대 5명의 실제 광부를 끌어들입니다. 고대 석재 가공장은 건설 수요·석재 수입이 큰 도시에서 건설되고 같은 타일의 건설 석재 비용을 12% 절감합니다.</div>');if(logi)logi.insertAdjacentHTML('afterbegin','<div class="codex-note"><strong>V0.19 흐름 지도</strong><br>최근 1년 물류·교역을 방향 화살표로 집계합니다. 주요/전체 흐름, 자원 종류, 선택 국가 필터를 사용할 수 있으며 곡선과 외곽선으로 겹침을 줄입니다.</div>');el.dataset.v19Note='1';};
}

if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`
#v19FlowResource,#v19FlowScope,#v19FlowDensity{min-height:40px;border:1px solid var(--line);border-radius:10px;background:#13243a;color:var(--text);padding:7px 9px}.v19-special-info{margin:4px 0 10px;padding:8px 9px;border:1px solid #46667f;border-radius:10px;background:rgba(90,145,195,.08)}@media(max-width:600px){#v19FlowResource,#v19FlowScope,#v19FlowDensity{min-height:36px;max-width:145px}}
`;document.head.appendChild(st);}

})(window.VSim);

