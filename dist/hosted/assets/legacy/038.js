
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const REV27='person-simulation-food-distribution-performance';
const now27=()=>globalThis.performance?.now?performance.now():Date.now();
const clamp27=(v,a,b)=>Math.max(a,Math.min(b,v));
const VALID_JOBS27=new Set(['아이','농부','채집꾼','사냥꾼','목수','광부','건축가','상인','경비','무직','학자']);

/* ============================================================
   V0.27 · Person simulation optimization + regional food stability
   - scheduled job/workplace reviews instead of full national scans every day
   - one-per-day topology signature + persistent route front-cache
   - zero-copy resident index reads
   - adaptive time-sliced ×10 execution for UI responsiveness
   - sampled leaf profiler inside villageDaily
   - predictive/critical local food relief using physical internal routes
   - neutral-tile deselection + stronger inter-nation borders
   ============================================================ */

/* ---------- resident index: cached arrays are read-only by convention ---------- */
NS.Village.prototype.tileResidents=function(tileId){
 const c=NS.V026?.ensureResidentIndex?.(this),a=c?.byHome?.get(tileId);return a||[];
};

/* ---------- topology cache: avoid rescanning every road/building for every route lookup ---------- */
const path26=NS.Village.prototype.internalPathCost;
function topologySig27(v){
 const w=v._world,day=Number(w?.calendarOrdinalDay?.()??w?.ordinalDay?.()??0);
 if(v._v27TopoMemo?.day===day)return v._v27TopoMemo.sig;
 let sum=0,roads=0,roadHash=0,harbors=0,harborHash=0;
 for(const id of v.territory||[]){
  sum=(sum+id*17)%1000000007;const t=w?.map?.get(id);if(!t)continue;
  for(let i=0;i<(t.buildings||[]).length;i++){
   const b=t.buildings[i],cond=Number(t.buildingCondition?.[i]??100);if(cond<=0)continue;
   if(b==='road'){roads++;roadHash=(roadHash+id*31+i)%1000000007;}
   if(b==='harbor'){harbors++;harborHash=(harborHash+id*37+i)%1000000007;}
  }
 }
 const tech=['ROADS','ENGINEERING','URBANIZATION','COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'].map(k=>v.hasTech?.(k)?1:0).join('');
 const sig=`${v.territory?.size||0}:${sum}:${roads}:${roadHash}:${harbors}:${harborHash}:${tech}`;
 v._v27TopoMemo={day,sig};return sig;
}
NS.Village.prototype.internalPathCost=function(fromId,toId){
 if(fromId===toId)return 0;
 const sig=topologySig27(this);
 if(!this._v27PathCache||this._v27PathCache.sig!==sig)this._v27PathCache={sig,map:new Map(),hits:0,misses:0};
 const a=Math.min(fromId,toId),b=Math.max(fromId,toId),key=`${a}:${b}`;
 if(this._v27PathCache.map.has(key)){this._v27PathCache.hits++;return this._v27PathCache.map.get(key);}
 const t0=now27(),cost=path26.call(this,fromId,toId),ms=now27()-t0;this._v27PathCache.misses++;
 this._v27PathCache.map.set(key,cost);if(this._v27PathCache.map.size>12000){const first=this._v27PathCache.map.keys().next().value;this._v27PathCache.map.delete(first);}
 const w=this._world;if(w){const p=w._v27PerfCurrent||(w._v27PerfCurrent={});p.routeMiss=(p.routeMiss||0)+ms;}
 return cost;
};

/* ---------- Person job/workplace review cadence ----------
   Legacy behavior attempted an 8% daily job reconsideration, but paid the full national
   search cost every day. We schedule the same geometric event instead: cheap daily guard,
   full scoring only when the reconsideration event is due or the assignment is invalid. */
function personSeed27(p){if(Number.isFinite(p._v27Seed))return p._v27Seed;let h=2166136261;for(const ch of String(p.id||p.name||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return p._v27Seed=(h>>>0);}
function profileSample27(p,w,mod=16){return ((personSeed27(p)+Number(w?.calendarOrdinalDay?.()??w?.ordinalDay?.()??0))%mod)===0;}
function nextReviewGap27(){
 /* Geometric(p=.08), matching the old per-day 8% reconsideration probability. */
 const u=Math.max(1e-9,1-Math.random());return clamp27(Math.ceil(Math.log(u)/Math.log(.92)),1,60);
}
const choose26=NS.Person.prototype.chooseJob;
NS.Person.prototype.chooseJob=function(v,w){
 const now=Number(w.ordinalDay?.()||0);
 if(this.age<15){this.job='아이';this.workTileId=this.homeTileId;this._v27NextJobReviewDay=now+30;return;}
 const assigned=w.map.get(this.workTileId),home=w.map.get(this.homeTileId);
 const invalid=!VALID_JOBS27.has(this.job)||!home||home.ownerId!==v.id||!assigned||assigned.ownerId!==v.id;
 if(!invalid&&Number.isFinite(this._v27NextJobReviewDay)&&now<this._v27NextJobReviewDay)return;
 const forcedEvent=!invalid&&Number.isFinite(this._v27NextJobReviewDay)&&now>=this._v27NextJobReviewDay;
 const oldJob=this.job;
 /* On a scheduled reconsideration event, force the legacy score chooser to evaluate once.
    This preserves the old ~8%/day opportunity without paying for it every day. */
 if(forcedEvent&&this.job!=='무직')this.job='무직';
 const t0=now27();choose26.call(this,v,w);const ms=now27()-t0;
 const p=w._v27PerfCurrent||(w._v27PerfCurrent={});p.jobReview=(p.jobReview||0)+ms;p.jobReviews=(p.jobReviews||0)+1;
 if(!VALID_JOBS27.has(this.job))this.job=oldJob||'무직';
 this._v27NextJobReviewDay=now+nextReviewGap27();
};

/* Repeated home/work tile resolution happens several times within one Person.act. */
const home26=NS.Person.prototype.homeTile;
NS.Person.prototype.homeTile=function(v,w){
 const day=Number(w.ordinalDay?.()||0),useWork=!!this._v20UseWorkTile,key=`${day}:${useWork?1:0}:${this.homeTileId}:${this.workTileId}`;
 if(this._v27TileMemo?.key===key&&this._v27TileMemo.tile?.ownerId===v.id)return this._v27TileMemo.tile;
 const t=home26.call(this,v,w);this._v27TileMemo={key, tile:t};return t;
};

/* ---------- daily shared Person context + optimized needs/happiness ---------- */
function conditionEff27(q){q=Number(q??100);return q>=70?1:clamp27(q/70,0,1);}
function effectiveLocalCapacity27(t){if(!t)return 0;let n=0;for(let i=0;i<(t.buildings||[]).length;i++)n+=(NS.BUILDINGS?.[t.buildings[i]]?.capacity||0)*conditionEff27(t.buildingCondition?.[i]??100);return n;}
function housingActiveCapacity27(t){if(!t)return 0;let n=0;for(let i=0;i<(t.buildings||[]).length;i++){const type=t.buildings[i],q=Number(t.buildingCondition?.[i]??100),thr=['town_hall','house','outpost'].includes(type)?15:35;if(q>=thr)n+=NS.BUILDINGS?.[type]?.capacity||0;}return n;}
function localCondition27(t){if(!t||!(t.buildings||[]).length)return 75;let sum=0;for(let i=0;i<t.buildings.length;i++)sum+=Number(t.buildingCondition?.[i]??100);return sum/t.buildings.length;}
function sharedVillage27(v,w){
 const day=Number(w.ordinalDay?.()||0),idx=NS.V026?.ensureResidentIndex?.(v),epoch=Number(v._v26ResidentEpoch||0);if(v._v27Shared?.day===day&&v._v27Shared.epoch===epoch)return v._v27Shared;
 const alive=idx?.alive||v.residents.filter(p=>p.alive),byId=new Map(alive.map(p=>[p.id,p]));let security=0,criticalShare=0;
 try{security=Number(v.securityScore?.(w)||0);}catch{}
 try{criticalShare=Number(v.foodStressProfile?.()?.criticalShare||0);}catch{}
 return v._v27Shared={day,epoch,alive,byId,byHome:idx?.byHome||new Map(),security,criticalShare,effectiveCaps:new Map(),activeCaps:new Map(),conditions:new Map()};
}
function targetHappiness27(p,v,w,ctx){
 const t=w.map.get(p.homeTileId),shared=NS.V034D2A?.housingAt?.(v,w,p.homeTileId),people=ctx.byHome.get(p.homeTileId)||[],pop=shared?shared.population:people.length;let cap=shared?shared.capacity:ctx.effectiveCaps.get(p.homeTileId);if(cap==null){cap=effectiveLocalCapacity27(t);ctx.effectiveCaps.set(p.homeTileId,cap);}const housing=pop?clamp27((cap-pop)/Math.max(1,pop),-1,1):0;
 const relations=Object.values(p.relations||{}),rel=relations.length?relations.reduce((a,b)=>a+Number(b||0),0)/relations.length:20;let family=0;for(const id of [p.motherId,p.fatherId])if(id){const q=ctx.byId.get(id);if(q)family+=q.homeTileId===p.homeTileId?2.5:.5;}
 const security=clamp27((ctx.security-Number(v.threat||0))/25,-1,1);let cond=ctx.conditions.get(p.homeTileId);if(cond==null){cond=(localCondition27(t)-70)/30;ctx.conditions.set(p.homeTileId,cond);}const employed=p.age<15||p.job!=='무직'?1:0,recentMove=w.ordinalDay()-(p.lastMoveDay||-9999)<60?-1:0;
 let target=52+(50-p.hunger)*.18+(p.health-60)*.10+(p.energy-55)*.07+housing*8+clamp27(cond,-1,1)*5+security*3+clamp27((rel-20)/20,-1,1)*4+family+employed*2+recentMove*2;if(ctx.criticalShare>.15)target-=5;return clamp27(target,15,90);
}
NS.Person.prototype.metabolism=function(v,w,worked=true){
 const sampled=profileSample27(this,w,16),t0=sampled?now27():0,consumeTile=this.homeTile(v,w);this.hunger=clamp27(this.hunger+(worked?(5+Math.random()*3):(4+Math.random()*2)),0,100);this.energy=clamp27(this.energy-(worked?(8+Math.random()*5):(4+Math.random()*3)),0,100);
 const need=this.age<15?.25:.36,got=v.withdrawAt(consumeTile.id,'food',need),ate=got>=need*.8;if(ate){const beforeHunger=this.hunger,x=clamp27(beforeHunger/100,0,1),curve=1-(1-x)*(1-x),baseRelief=5+Math.random(),curveRelief=(3+Math.random())*curve,relief=baseRelief+curveRelief;this.hunger=clamp27(this.hunger-relief,0,100);const actual=beforeHunger-this.hunger;NS.V032E11?.recordHungerRelief?.(this,v,w,actual);NS.V032E12?.recordHungerCurve?.(this,v,w,beforeHunger,actual,relief,curve);}NS.V032E10?.recordMeal?.(this,v,w,need,got,ate);this.energy=clamp27(this.energy+(worked?(8+Math.random()*5):(10+Math.random()*5)),0,100);this.energy+=(82-this.energy)*.035;let hd=(82-this.health)*.002;if(!ate)hd-=1;if(this.hunger>80)hd-=.65;if(this.age>60)hd-=.035;this.health=clamp27(this.health+hd,0,100);this.happiness+=(65-this.happiness)*.0025;if(!ate)this.happiness-=.18;this.happiness=clamp27(this.happiness,0,100);
 if(v.hasTech?.('SANITATION')&&this.alive&&this.health<86&&this.hunger<70)this.health=Math.min(100,this.health+.012);
 const home=w.map.get(this.homeTileId),ctx=sharedVillage27(v,w),shared=NS.V034D2A?.housingAt?.(v,w,this.homeTileId),people=ctx.byHome.get(this.homeTileId)||[],population=shared?shared.population:people.length;let activeCap=shared?shared.activeCapacity:ctx.activeCaps.get(this.homeTileId);if(activeCap==null){activeCap=housingActiveCapacity27(home);ctx.activeCaps.set(this.homeTileId,activeCap);}const short=Math.max(0,population-activeCap),severity=population?short/population:0;if(severity>0){this.housingStrainDays=(this.housingStrainDays||0)+1;if(this.housingStrainDays>20){this.energy=clamp27(this.energy-.035-.11*severity,0,100);this.happiness=clamp27(this.happiness-.015-.045*severity,0,100);}if(this.housingStrainDays>45)this.health=clamp27(this.health-.01-.035*severity,0,100);}else this.housingStrainDays=Math.max(0,(this.housingStrainDays||0)-2);
 const target=targetHappiness27(this,v,w,ctx);this.happinessTarget=target;this.happiness=clamp27(this.happiness+(target-this.happiness)*.014,0,100);const f=v.festivalState;if(f&&Number(f.until||0)>=w.ordinalDay()){const boost=this.homeTileId===f.tileId?8:3,ft=clamp27(Number(this.happinessTarget??this.happiness)+boost,0,95);this.happinessTarget=ft;this.happiness=clamp27(this.happiness+(ft-this.happiness)*.012,0,100);}
 if(sampled){const p=w._v27PerfCurrent||(w._v27PerfCurrent={});p.personNeedsEst=(p.personNeedsEst||0)+(now27()-t0)*16;}
};

/* Production telemetry used to trim a 150-day array after every single harvest.
   Preserve identical daily totals while trimming only when a new production day starts. */
let ACTIVE_WORLD27=null;
function recordProduction27(v,day,k,qty){if(!v||!['food','wood','stone'].includes(k)||qty<=0)return;v.productionDaily=Array.isArray(v.productionDaily)?v.productionDaily:[];let r=v.productionDaily.at(-1);if(!r||Number(r.day)!==Number(day)){r={day:Number(day),food:0,wood:0,stone:0};v.productionDaily.push(r);while(v.productionDaily.length&&Number(day)-Number(v.productionDaily[0].day)>=150)v.productionDaily.shift();if(v.productionDaily.length>150)v.productionDaily.splice(0,v.productionDaily.length-150);}r[k]+=qty;}
NS.Tile.prototype.harvest=function(kind,amount,day){this.syncResources(day);const got=Math.min(Math.max(0,amount),this.resources[kind]||0);this.resources[kind]-=got;if(got>0&&ACTIVE_WORLD27&&this.ownerId!=null)recordProduction27(ACTIVE_WORLD27.villages[this.ownerId],Number(day||ACTIVE_WORLD27.ordinalDay()),kind,got);return got;};

/* Sampled leaf profiling: estimates whole Person.act after the hot-path rewrites. */
const act26=NS.Person.prototype.act;
NS.Person.prototype.act=function(v,w){
 if(!profileSample27(this,w,16))return act26.call(this,v,w);
 const t0=now27();try{return act26.call(this,v,w);}finally{const p=w._v27PerfCurrent||(w._v27PerfCurrent={});p.personActEst=(p.personActEst||0)+(now27()-t0)*16;}
};

/* ---------- predictive regional food relief ---------- */
function ensureFoodStats27(v){return v.foodRelief27||(v.foodRelief27={preemptiveMoves:0,criticalMoves:0,foodMoved:0,criticalFoodMoved:0,lastDay:-1});}
function foodState27(v,id){
 const people=v.tileResidents(id),pop=people.length;if(!pop)return null;const stock=Number(v.stockAt(id,'food')||0),daily=Math.max(.18,pop*.36),days=stock/daily;
 let high=0,severe=0,sum=0;for(const p of people){const h=Number(p.hunger||0);sum+=h;if(h>=72)high++;if(h>=86)severe++;}
 return{id,people,pop,stock,daily,days,avgHunger:sum/pop,high,severe};
}
function preemptiveFoodRelief27(w){
 /* Population consumption/production advances on the 3-day legacy work cycle, so scan immediately before that cycle rather than on the two no-work subdays. */
 if(Number(w._v24Subday||0)<2)return;const calendarDay=Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);if(w._v27LastFoodReliefDay===calendarDay)return;w._v27LastFoodReliefDay=calendarDay;
 const t0=now27();
 for(const v of w.activeVillages||[]){
  const stats=ensureFoodStats27(v),states=[];for(const id of v.territory||[]){const s=foodState27(v,id);if(s)states.push(s);}if(states.length<2)continue;
  const receivers=states.filter(s=>s.days<(s.pop>=4?18:10)||s.severe>0||s.avgHunger>=58).sort((a,b)=>((b.severe>0)-(a.severe>0))||(a.days-b.days)||(b.avgHunger-a.avgHunger));
  for(const r of receivers){
   const critical=r.days<8||r.severe>0||r.avgHunger>=72,lastMap=v._v27FoodReliefLast||(v._v27FoodReliefLast={}),last=Number(lastMap[r.id]??-99999);if(!critical&&calendarDay-last<6)continue;const targetDays=critical?38:(r.pop>=4?30:24),donorFloor=critical?44:58,reserveFloor=critical?38:52;
   let need=Math.max(0,r.daily*targetDays-r.stock);if(need<.8)continue;
   const donors=[];for(const d of states){if(d.id===r.id||d.days<=donorFloor)continue;const surplus=Math.max(0,d.stock-d.daily*reserveFloor);if(surplus<.8)continue;const q=v.internalLogisticsCapacity?.(d.id,r.id,'food',false);if(!q||!Number.isFinite(q.cost)||q.capacity<=0)continue;donors.push({d,cost:q.cost,capacity:q.capacity,surplus,score:q.cost*4-d.days*.08});}
   donors.sort((a,b)=>a.score-b.score);let moved=0,used=0;
   for(const q of donors){if(need<.8||used>=3)break;const mult=critical?2.0:1.35,qty=Math.min(need,q.surplus,q.capacity*mult);if(qty<.8)continue;const took=v.withdrawAt(q.d.id,'food',qty),put=v.depositAt(r.id,'food',took);if(put<took)v.depositAt(q.d.id,'food',took-put);if(put<=0)continue;
    q.d.stock-=put;q.d.days=q.d.stock/q.d.daily;r.stock+=put;r.days=r.stock/r.daily;need-=put;moved+=put;used++;
    v.logisticsStats.moves++;v.logisticsStats.foodMoved=(v.logisticsStats.foodMoved||0)+put;stats.foodMoved+=put;if(critical)stats.criticalFoodMoved+=put;
    if(put>=3)w.telemetry.record('INTERNAL_LOGISTICS',w,{village:v.name,resource:'food',qty:+put.toFixed(1),fromTileId:q.d.id,toTileId:r.id,routeCost:+q.cost.toFixed(2),capacity:+(q.capacity*mult).toFixed(2),reason:critical?'V27_CRITICAL_FOOD':'V27_PREEMPTIVE_FOOD',localFoodDaysBefore:+((r.stock-put)/r.daily).toFixed(1),highHunger:r.high,severeHunger:r.severe});
   }
   if(moved>0){lastMap[r.id]=calendarDay;if(critical)stats.criticalMoves++;else stats.preemptiveMoves++;stats.lastDay=calendarDay;}
  }
 }
 const p=w._v27PerfCurrent||(w._v27PerfCurrent={});p.foodRelief=(p.foodRelief||0)+(now27()-t0);
}
const advance26=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(){const prev=ACTIVE_WORLD27;ACTIVE_WORLD27=this;try{preemptiveFoodRelief27(this);return advance26.call(this);}finally{ACTIVE_WORLD27=prev;}};

/* ---------- V0.27 telemetry ---------- */
function smooth27(old,cur,a=.24){const out={...old};for(const k of new Set([...Object.keys(old||{}),...Object.keys(cur||{})]))out[k]=Number(old?.[k]||0)*(1-a)+Number(cur?.[k]||0)*a;return out;}
const snap26=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snap26.call(this,w,reason,note);if(!s)return s;const p=w._v27Perf||{},leaf=p.parts||{};
 Object.assign(s.global,{perfWallMs27:+Number(p.wallMs||0).toFixed(2),perfChunkDays27:Number(p.chunkDays||0),perfYieldCount27:Number(p.yields||0),perfBreakdown27:Object.fromEntries(Object.entries(leaf).filter(([k,v])=>Number.isFinite(v)&&!String(k).startsWith('_')).map(([k,v])=>[k,+Number(v).toFixed(2)]))});
 for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id),fs=v?ensureFoodStats27(v):{};r.preemptiveFoodMoves27=Number(fs.preemptiveMoves||0);r.criticalFoodMoves27=Number(fs.criticalMoves||0);r.foodReliefMoved27=+Number(fs.foodMoved||0).toFixed(1);r.criticalFoodMoved27=+Number(fs.criticalFoodMoved||0).toFixed(1);r.perfWallMs27=+Number(p.wallMs||0).toFixed(2);r.perfChunkDays27=Number(p.chunkDays||0);r.perfYieldCount27=Number(p.yields||0);}
 return s;
};
const csv26=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){
 const base=csv26.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['preemptiveFoodMoves27','criticalFoodMoves27','foodReliefMoved27','criticalFoodMoved27','perfWallMs27','perfChunkDays27','perfYieldCount27'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;
 for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k]??s.global?.[k])).join(',');}return lines.join('\n');
};
const json26=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json26.call(this,w);d.version='0.27';d.worldSummary.v27Revision=REV27;d.worldSummary.performance='scheduled Person job/work reviews + topology front-cache + zero-copy resident reads + adaptive time-sliced batches';d.worldSummary.personSimulation='Person entities remain explicit; job/workplace re-evaluation opportunities are geometrically scheduled at the legacy 8%/day rate';d.worldSummary.foodDistribution='predictive local relief at <18 reserve days or high Hunger; critical routes can use temporary extra internal capacity but still move stock between real owned settlements';d.worldSummary.uiResponsiveness='simulation batches yield between small day chunks when load rises';d.worldSummary.nationalBorders='thicker black inter-nation borders; nation colors remain visible';for(const v of w.villages||[])ensureFoodStats27(v);return d;};

/* ---------- UI responsiveness + map interaction ---------- */
if(NS.UI){
 const renderHeader26=NS.UI.prototype.renderHeader,renderMap26=NS.UI.prototype.renderMap,renderMapView26=NS.UI.prototype.renderMapView,stop26=NS.UI.prototype.stop;
 NS.UI.prototype.renderHeader=function(){
  renderHeader26.call(this);const p=this.world._v27Perf||{},sim=Number(this.world._v26Perf?.simMs||0),ui=Number(this.world._v26Perf?.renderMs||0),speed=Math.max(1,Number(this.world.speed||1)),parts=p.parts||{};
  const ranked=Object.entries(parts).filter(([k,v])=>!['jobReviews'].includes(k)&&Number(v)>0).sort((a,b)=>b[1]-a[1]),coarse=Object.entries(this.world._v26Perf?.parts||{}).filter(([,v])=>Number(v)>0).sort((a,b)=>b[1]-a[1]);const hot=coarse.length?` · HOT ${coarse[0][0]} ${coarse[0][1].toFixed(0)}ms`:'',detail=ranked.length?` · DETAIL ${ranked[0][0]} ${ranked[0][1].toFixed(0)}ms`:'';
  const slice=Number(p.chunkDays||speed);const el=this.q('runtimeStatus');if(el){el.textContent=`✓ V0.27 Person 최적화 · ×${speed} · SIM ${sim.toFixed(1)}ms/batch · ${(sim/speed).toFixed(1)}ms/day · UI ${ui.toFixed(1)}ms · SLICE ${slice}d${hot}${detail}`;el.style.color=sim>=550?'#ff8f6b':sim>=300?'#ffd36b':'#5bd79d';}
  document.title='Village Observer V0.27';const e=document.querySelector('.eyebrow');if(e)e.textContent='Village Observer · V0.27';
 };
 NS.UI.prototype.start=function(){
  clearInterval(this.timer);this._v27RunToken=(this._v27RunToken||0)+1;const token=this._v27RunToken;this.world.running=true;this._v27Busy=false;
  const runBatch=()=>{if(!this.world.running||token!==this._v27RunToken||this._v27Busy)return;this._v27Busy=true;const speed=Math.max(1,Number(this.world.speed||1)),prev=Number(this.world._v26Perf?.simMs||0),pop=Number(this.world.allPeople?.length||0),chunkDays=(prev>=300||pop>=900)?1:(prev>=180||pop>=600)?2:(prev>=90||pop>=350)?3:5;this.world._v26PerfCurrent={};this.world._v27PerfCurrent={};let left=speed,activeMs=0,yields=0,wallStart=now27();
   const chunk=()=>{if(!this.world.running||token!==this._v27RunToken){this._v27Busy=false;return;}const n=Math.min(chunkDays,left),a=now27();for(let i=0;i<n;i++)this.world.advanceOneDay();activeMs+=now27()-a;left-=n;if(left>0){yields++;setTimeout(chunk,0);return;}
    const scroll=typeof captureScroll26==='function'?captureScroll26(this):null,b=now27();this.render();if(scroll&&typeof restoreScroll26==='function')restoreScroll26(scroll);const renderMs=now27()-b,wallMs=now27()-wallStart,old=this.world._v26Perf||{simMs:0,renderMs:0,msPerDay:0,parts:{},samples:0},alpha=(old.samples||0)>12?.22:.42;
    this.world._v26Perf={simMs:old.simMs*(1-alpha)+activeMs*alpha,renderMs:old.renderMs*(1-alpha)+renderMs*alpha,msPerDay:old.msPerDay*(1-alpha)+(activeMs/speed)*alpha,parts:smooth27(old.parts||{},this.world._v26PerfCurrent||{},alpha),samples:(old.samples||0)+1};
    const old27=this.world._v27Perf||{wallMs:0,parts:{},samples:0};this.world._v27Perf={wallMs:old27.wallMs*(1-alpha)+wallMs*alpha,chunkDays,yields,parts:smooth27(old27.parts||{},this.world._v27PerfCurrent||{},alpha),samples:(old27.samples||0)+1};
    this.world._v23Perf={simMs:this.world._v26Perf.simMs,renderMs:this.world._v26Perf.renderMs,samples:this.world._v26Perf.samples};this._v27Busy=false;this.renderHeader();
   };chunk();
  };
  this.timer=setInterval(runBatch,550);
 };
 NS.UI.prototype.stop=function(){this._v27RunToken=(this._v27RunToken||0)+1;this._v27Busy=false;return stop26.call(this);};
 NS.UI.prototype.renderMapView=function(){const t=this.world.map.get(this.world.selectedTileId);if(t&&(t.ownerId===null||t.ownerId===undefined)){this.world.selectedVillageId=null;this.world.selectedPersonId=null;}return renderMapView26.call(this);};
 NS.UI.prototype.renderMap=function(){
  renderMap26.call(this);const g=this._mapGeom,c=this.q('worldCanvas');if(!g||!c)return;const ctx=c.getContext('2d'),m=this.world.map,{cell,ox,oy}=g,sel=this.world.selectedVillageId,inter=Math.max(2.8,Math.min(5.4,cell*.092)),outer=Math.max(1.8,Math.min(3.2,cell*.055));ctx.save();ctx.lineCap='square';
  for(const t of m.tiles){if(t.ownerId==null)continue;const x=ox+t.x*cell,y=oy+t.y*cell;for(const[dx,dy,sx,sy,ex,ey]of[[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){const n=m.at(t.x+dx,t.y+dy);if(n?.ownerId===t.ownerId)continue;const other=n?.ownerId;const between=other!==null&&other!==undefined;if(between&&t.id>n.id)continue;ctx.strokeStyle=between?'rgba(0,0,0,.96)':'rgba(4,7,10,.80)';ctx.lineWidth=between?inter:outer;ctx.beginPath();ctx.moveTo(x+sx*cell,y+sy*cell);ctx.lineTo(x+ex*cell,y+ey*cell);ctx.stroke();}}
  if(sel!=null){const col=NS.NATION_COLORS?.[sel%NS.NATION_COLORS.length]||'#eef5ff';ctx.strokeStyle=col;ctx.lineWidth=Math.max(1.6,Math.min(2.8,cell*.045));for(const t of m.tiles){if(t.ownerId!==sel)continue;const x=ox+t.x*cell,y=oy+t.y*cell;for(const[dx,dy,sx,sy,ex,ey]of[[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){const n=m.at(t.x+dx,t.y+dy);if(n?.ownerId===sel)continue;ctx.beginPath();ctx.moveTo(x+sx*cell,y+sy*cell);ctx.lineTo(x+ex*cell,y+ey*cell);ctx.stroke();}}}
  ctx.restore();
 };
}

/* ---------- save/load compatibility ---------- */
function ensurePerson27(p,w){if(!p)return p;if(!Number.isFinite(p._v27NextJobReviewDay))p._v27NextJobReviewDay=Number(w?.ordinalDay?.()||0)+nextReviewGap27();return p;}
function attachV27World(w){NS.V026.attachWorld(w);for(const v of w.villages||[]){v._world=w;ensureFoodStats27(v);v._v27TopoMemo=null;v._v27PathCache=null;for(const p of v.residents||[])ensurePerson27(p,w);}w._v27Perf=w._v27Perf||{wallMs:0,parts:{},samples:0};return w;}
const worldSer26=NS.World.prototype.serialize,worldFrom26=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSer26.call(this);d.version='0.27';d.v27={revision:REV27,scheduledJobReview:true,topologyFrontCache:true,timeSlicedBatches:true,predictiveFoodRelief:true,strongBorders:true,neutralDeselect:true};return d;};
NS.World.from=function(d){if(d.version==='0.27'){const w=worldFrom26({...d,version:'0.26'});return attachV27World(w);}return attachV27World(worldFrom26(d));};
NS.V027={attachWorld:attachV27World,revision:REV27,preemptiveFoodRelief:preemptiveFoodRelief27,foodState:foodState27};
(function(){const KEY='village-observer-v0-27',fallback=['village-observer-v0-26','village-observer-v0-25','village-observer-v0-24','village-observer-v0-23','village-observer-v0-22','village-observer-v0-21','village-observer-v0-20','village-observer-v0-19','village-observer-v0-18','village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v027-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v027-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v027-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attachV27World(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
})(window.VSim);

