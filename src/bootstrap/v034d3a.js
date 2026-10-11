/* Village Observer V0.34D3A — conserved civilian harvest and causal 30-day food observation.
 * Original physical tile ownership, prices, production multipliers and consumption remain intact.
 * All flow observations are additive; no RNG and no daily all-person/tile rescan.
 */
(function(NS){'use strict';
const VERSION='V0.34D3A',PREVIOUS='V0.34D3',KEY='village-observer-v034d3a',D3=NS.V034D3;
const num=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b),EPS=1e-8;
const observ=new WeakMap(),harvestScope=new WeakMap(),transferScope=new WeakMap(),mealScope=new WeakMap();
const METRICS=['harvestRequested','harvestRequested','harvestRaw','harvestProduced','harvestStored','harvestRestoredNatural','harvestRejectedOutput','harvestCalls','foodRegenObserved','depositRequested','depositAccepted','depositRejected','otherDeposited','otherWithdrawn','mealRequested','mealReceived','remoteFoodWithdrawn','remoteWoodWithdrawn','remoteStoneWithdrawn','remoteFoodDeposited','remoteWithdrawCalls','remoteDepositCalls','transferMoved','transferAccepted','transferReturned','transferUnrecovered','foodRegenObserved'];
function freshRow(id,nid,name,ids){return {settlementId:String(id),nationId:String(nid),nationName:name||'',tileIds:(ids||[]).map(Number),openingFood:0,closingFood:0,openingNatural:0,closingNatural:0,openingCapacity:0,closingCapacity:0,population:0,foodLaborers:0,severeHunger:0,criticalHunger:0,foodReserveCycles:0,topologyChanged:false,...Object.fromEntries(METRICS.map(k=>[k,0]))};}
function group(w,v,tid){const m=D3.members(v,tid),sid=m?.sid??('tile-'+tid);return {id:String(sid),nationId:String(v.id),name:v.name||'',ids:m?.ids||[Number(tid)]};}
function state(w){let s=observ.get(w);if(!s){s={startedOrdinal:num(w.ordinalDay?.()),windows:[],live:null,lastBucket:null,total:{harvestRequested:0,harvestRaw:0,foodRegenObserved:0,harvestProduced:0,harvestStored:0,harvestRestoredNatural:0,harvestRejectedOutput:0,transferAccepted:0,transferReturned:0,transferUnrecovered:0,remoteFoodWithdrawn:0,remoteWoodWithdrawn:0,remoteStoneWithdrawn:0,remoteFoodDeposited:0},periods:0};observ.set(w,s);}return s;}
function groupedPhysical(w){const rows=D3.economyRows(w),out=new Map();for(const r of rows){const x=freshRow(r.settlementId,r.nationId,r.nationName,r.tileIds);x.openingFood=x.closingFood=num(r.resources.food);x.openingNatural=x.closingNatural=num(r.naturalFoodRemaining);x.openingCapacity=x.closingCapacity=num(r.capacity.food);out.set(x.settlementId,x);}return out;}
function start(w){const s=state(w),ordinal=Math.max(1,num(w.ordinalDay?.())),bucket=Math.floor((ordinal-1)/30);if(s.live&&s.lastBucket===bucket)return s;
 if(s.live){finish(w,s);}const rows=groupedPhysical(w);s.live={bucket,startOrdinal:bucket*30+1,endOrdinal:(bucket+1)*30,startedAtOrdinal:ordinal,groups:Object.fromEntries(rows),partialStart:ordinal>bucket*30+1};s.lastBucket=bucket;return s;}
function row(w,v,tid){const s=start(w),g=group(w,v,tid);let r=s.live.groups[g.id];if(!r){r=freshRow(g.id,g.nationId,g.name,g.ids);r.topologyChanged=true;r.openingFood=g.ids.reduce((n,id)=>n+D3.stockRaw(w,id,'food'),0);r.openingNatural=g.ids.reduce((n,id)=>n+num(w.map.get(id)?.resources?.food),0);s.live.groups[g.id]=r;}
 if(!eq(r.nationId,g.nationId)||r.tileIds.join(',')!==g.ids.join(','))r.topologyChanged=true;
 return r;}
function add(w,v,tid,k,amount){if(!w||!v||!Number.isFinite(amount)||!amount)return;const r=row(w,v,tid);r[k]=(r[k]||0)+amount;const s=state(w);if(Object.hasOwn(s.total,k))s.total[k]+=amount;}
function finish(w,s){const live=s.live;if(!live)return;const physical=groupedPhysical(w);for(const r of Object.values(live.groups)){
 const now=physical.get(r.settlementId);if(now&&eq(now.nationId,r.nationId)){r.closingFood=now.closingFood;r.closingNatural=now.closingNatural;r.closingCapacity=now.closingCapacity;
 if(r.tileIds.join(',')!==now.tileIds.join(','))r.topologyChanged=true;
 const v=w.villages.find(v=>eq(v.id,r.nationId));if(v){const ids=new Set(now.tileIds),people=(v.residents||[]).filter(p=>p.alive!==false&&ids.has(Number(p.homeTileId)));r.population=people.length;r.foodLaborers=people.filter(p=>p.age>=15&&['농부','채집꾼','사냥꾼'].includes(p.job)&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'&&!p.militaryActive32B).length;r.severeHunger=people.filter(p=>num(p.hunger)>=85).length;r.criticalHunger=people.filter(p=>num(p.hunger)>=95).length;}
 const demand=v?(v.residents||[]).filter(p=>p.alive!==false&&new Set(now.tileIds).has(Number(p.homeTileId))).reduce((n,p)=>n+(num(p.age)<15?.30:.42),0):0;r.foodReserveCycles=demand?r.closingFood/demand:999;
 }else{r.closingFood=null;r.closingNatural=null;r.closingCapacity=null;r.topologyChanged=true;}
 r.storageDelta=r.closingFood==null?null:r.closingFood-r.openingFood;
 r.observedFoodDelta=r.harvestStored+r.otherDeposited-r.mealReceived-r.otherWithdrawn;
 r.unattributedDelta=r.storageDelta==null?null:r.storageDelta-r.observedFoodDelta;
 }s.windows.push({startOrdinal:live.startOrdinal,endOrdinal:Math.min(live.endOrdinal,num(w.ordinalDay?.())-1||live.endOrdinal),startedAtOrdinal:live.startedAtOrdinal,partialStart:live.partialStart,rows:Object.values(live.groups)});if(s.windows.length>360)s.windows.splice(0,s.windows.length-360);s.periods++;s.live=null;}
function roll(w){const s=state(w),current=Math.floor((Math.max(1,num(w.ordinalDay?.()))-1)/30);if(s.live&&current!==s.lastBucket){finish(w,s);start(w);}}
// Conservation: take actual natural raw material, multiply by the original production
// multiplier, deposit the output, then restore *only* unused input to nature. This
// preserves the previously used multiplier and never creates a substitute output.
function harvestAndStore(p,v,w,t,k,requested,day){const raw=Math.max(0,num(t.harvest(k,requested,day))),mul=Math.max(0,num(v.harvestMultiplier(k,t))),made=raw*mul;const prev=harvestScope.get(w);harvestScope.set(w,{v,t,k});let stored=0;
 try{if(made>0)stored=Math.max(0,num(v.depositAt(t.id,k,made)));}finally{if(prev)harvestScope.set(w,prev);else harvestScope.delete(w);}
 const refused=Math.max(0,made-stored),restored=made>EPS?Math.min(raw,raw*(refused/made)):raw;
 if(restored>0){t.resources[k]=Math.max(0,num(t.resources?.[k])+restored);}
 if(k==='food'){
  for(const [name,value] of [['harvestRequested',Math.max(0,num(requested))],['harvestRaw',raw],['harvestProduced',made],['harvestStored',stored],['harvestRestoredNatural',restored],['harvestRejectedOutput',refused]])add(w,v,t.id,name,value);
  add(w,v,t.id,'harvestCalls',1);
 }
 return stored;
}
// Observe D3's actual physical transfer while retaining all its own distribution logic.
const origWithdraw=NS.Village.prototype.withdrawAt,origDeposit=NS.Village.prototype.depositAt,origMeta=NS.Person.prototype.metabolism;
NS.Village.prototype.withdrawAt=function(tid,k,qty){const w=this._world,m=k==='food'?D3.members(this,tid):D3.members(this,tid),local=D3.stockRaw(w,tid,k),fed=mealScope.get(w),ctx=transferScope.get(w),got=origWithdraw.call(this,tid,k,qty);if(!w)return got;
 if(k==='food'&&fed?.v===this)add(w,this,tid,'mealRequested',Math.max(0,num(qty)));
 if(got<=0)return got;
 if(m&&m.ids.length>1){const remote=Math.max(0,got-Math.min(Math.max(0,num(qty)),local));if(remote>EPS){const key=({food:'remoteFoodWithdrawn',wood:'remoteWoodWithdrawn',stone:'remoteStoneWithdrawn'})[k];if(key)add(w,this,tid,key,remote);add(w,this,tid,'remoteWithdrawCalls',1);}}
 if(k==='food'){if(fed?.v===this){add(w,this,tid,'mealReceived',got);}else if(!ctx?.v||ctx.v!==this)add(w,this,tid,'otherWithdrawn',got);else add(w,this,tid,'otherWithdrawn',got);}
 return got;};
NS.Village.prototype.depositAt=function(tid,k,qty){const w=this._world,req=Math.max(0,num(qty)),m=D3.members(this,tid),localRoom=Math.max(0,num(D3.physicalCap(this,tid,k))-D3.stockRaw(w,tid,k)),got=origDeposit.call(this,tid,k,qty);if(!w||k!=='food'&&(!m||m.ids.length<2))return got;
 if(m&&m.ids.length>1){const remote=Math.max(0,got-Math.min(got,localRoom));if(remote>EPS){if(k==='food')add(w,this,tid,'remoteFoodDeposited',remote);add(w,this,tid,'remoteDepositCalls',1);}}
 if(k==='food'&&req>0){add(w,this,tid,'depositRequested',req);add(w,this,tid,'depositAccepted',got);add(w,this,tid,'depositRejected',Math.max(0,req-got));if(harvestScope.get(w)?.v===this){/* harvested amount logged by harvestAndStore */}else add(w,this,tid,'otherDeposited',got);}
 return got;};
NS.Person.prototype.metabolism=function(v,w,...args){const prior=mealScope.get(w);mealScope.set(w,{v});try{return origMeta.call(this,v,w,...args);}finally{if(prior)mealScope.set(w,prior);else mealScope.delete(w);}};
const origSync=NS.Tile.prototype.syncResources;
NS.Tile.prototype.syncResources=function(day){const before=num(this.resources?.food),out=origSync.call(this,day),gained=Math.max(0,num(this.resources?.food)-before),w=NS._v32fActiveAct?.w||this._worldRef;if(gained>EPS&&w){const v=(w.villages||[]).find(v=>eq(v.id,this.ownerId));if(v)add(w,v,this.id,'foodRegenObserved',gained);}return out;};
// Explicit transaction lifecycle: these call sites return any refused goods to the
// original physical source through the normal D3 deposit function. Never assume
// returns are full if a same-day unrelated action filled the origin store.
function transferWithReturn(v,from,to,k,amount){const w=v._world,previous=transferScope.get(w);transferScope.set(w,{v,kind:'TRANSFER'});let took=0,put=0,returned=0;
 try{took=v.withdrawAt(from,k,amount);put=v.depositAt(to,k,took);if(took>put+EPS){transferScope.set(w,{v,kind:'RETURN'});returned=v.depositAt(from,k,took-put);}}finally{if(previous)transferScope.set(w,previous);else transferScope.delete(w);}
 if(k==='food'){add(w,v,to,'transferMoved',took);add(w,v,to,'transferAccepted',put);add(w,v,from,'transferReturned',returned);if(took-put-returned>EPS)add(w,v,from,'transferUnrecovered',took-put-returned);}
 return {took,put,returned,unrecovered:Math.max(0,took-put-returned)};
}
const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){start(this);const result=prevAdvance.apply(this,args);roll(this);return result;};
// A separate read-only slot scan runs only when exporting a report (not in Person.act).
function laborIssues(w){const issues=[];for(const v of w.villages||[])for(const p of v.residents||[]){if(!NS.V034D1A.eligible(p)||!p._v29SlotKey)continue;const s=NS.V034D1A.slotInfo(w,p);if(s.valid)continue;const tid=Number(p.workTileId),t=w.map.get(tid),idx=Number(p.workBuildingIndex29);issues.push({personId:String(p.id),nationId:String(v.id),homeTileId:p.homeTileId,workTileId:p.workTileId,job:p.job,slotKey:p._v29SlotKey,category:s.kind,buildingIndex:Number.isInteger(idx)?idx:null,buildingType:t?.buildings?.[idx]??p.workBuildingType29??null,buildingCondition:t?.buildingCondition?.[idx]??null});}return issues;}
function windowRows(w,partial=true){const s=state(w),out=s.windows.flatMap(win=>win.rows.map(r=>({...r,windowStart:win.startOrdinal,windowEnd:win.endOrdinal,partial:win.partialStart?'STARTED_MID_WINDOW':''})));if(partial&&s.live){const now=groupedPhysical(w);for(const r of Object.values(s.live.groups)){const x={...r},n=now.get(r.settlementId);x.closingFood=n?.closingFood??null;x.closingNatural=n?.closingNatural??null;x.closingCapacity=n?.closingCapacity??null;x.storageDelta=x.closingFood==null?null:x.closingFood-x.openingFood;x.observedFoodDelta=x.harvestStored+x.otherDeposited-x.mealReceived-x.otherWithdrawn;x.unattributedDelta=x.storageDelta==null?null:x.storageDelta-x.observedFoodDelta;out.push({...x,windowStart:s.live.startOrdinal,windowEnd:Math.max(s.live.startedAtOrdinal,num(w.ordinalDay?.())),partial:'ACTIVE'});}}return out;}
const COL=['windowStart','windowEnd','partial','settlementId','nationId','nationName','tileIds','openingFood','closingFood','storageDelta','harvestRequested','harvestRequested','harvestRaw','harvestProduced','harvestStored','harvestRestoredNatural','harvestRejectedOutput','depositRequested','depositAccepted','depositRejected','mealRequested','mealReceived','otherDeposited','otherWithdrawn','transferMoved','transferAccepted','transferReturned','transferUnrecovered','remoteFoodWithdrawn','remoteWoodWithdrawn','remoteStoneWithdrawn','remoteFoodDeposited','foodRegenObserved','openingNatural','closingNatural','openingCapacity','closingCapacity','population','foodLaborers','severeHunger','criticalHunger','foodReserveCycles','observedFoodDelta','unattributedDelta','topologyChanged'];
const csvEsc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
function foodCSV(w){const rows=windowRows(w);return [COL.join(','),...rows.map(r=>COL.map(k=>csvEsc(k==='tileIds'?r.tileIds.join('|'):r[k])).join(','))].join('\n');}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this),s=state(this);out.version=VERSION;out.v034d3a={revision:'conserved-harvest-30day-food-flow',startedOrdinal:s.startedOrdinal,windows:s.windows,live:s.live,total:s.total,periods:s.periods,lastBucket:s.lastBucket};return out;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error(VERSION+' 저장 파일만 지원합니다.');const w=oldFrom({...data,version:PREVIOUS}),d=data.v034d3a;if(d&&Array.isArray(d.windows)){const s=state(w);s.startedOrdinal=num(d.startedOrdinal);s.windows=d.windows.slice(-360);s.live=d.live||null;s.total=d.total||s.total;s.periods=num(d.periods);s.lastBucket=d.lastBucket??null;}return w;};
function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const d=localStorage.getItem(KEY);return d?NS.World.from(JSON.parse(d)):null;},
 export(w){download(`village-observer-v034D3A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3A-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3A-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D3.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3A-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+foodCSV(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w),s=state(w);if(d.worldSummary){d.worldSummary.v034d3aRevision='conserved-civilian-harvest-food-flow-v1';d.worldSummary.v034d3aFoodFlow={startedOrdinal:s.startedOrdinal,periods:s.periods,total:{...s.total},latestPeriods:s.windows.slice(-2),liveStart:s.live?.startOrdinal??null,laborIssues:laborIssues(w)};}d.version=VERSION;return d;};
if(NS.UI){const head=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const ret=head.apply(this,args);if(typeof document==='undefined')return ret;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const near=document.getElementById('exportSettlementEconomyD3Btn');if(near&&!document.getElementById('exportSettlementFoodFlowD3ABtn')){const btn=document.createElement('button');btn.id='exportSettlementFoodFlowD3ABtn';btn.textContent='Food Flow 30일 CSV';btn.title='D3A 30일 단위 식량 흐름·입고/반환·공유 실제량 ('+COL.length+'열)';btn.addEventListener('click',()=>{try{NS.SaveSystem.exportSettlementFoodFlowCSV(this.world);}catch(e){console.error(e);alert(e.message);}});near.insertAdjacentElement('afterend',btn);}return ret;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Food Supply & Storage Stabilization',summary:'일반 식량·목재·석재 채집물의 미입고 원료를 자연으로 정확히 복구하고, 30일 식량 수지와 실제 Settlement 간격 내 원격 조달·반송을 관측합니다. 생산·소비·자연회복 밸런스는 유지합니다.',sections:[['수확 보존',['창고가 가득 차도 채집 시 사용한 원료 중 입고되지 않은 생산물에 대응하는 양을 자연 자원으로 복원합니다.','실제 생산 효율, 주민 소비, 지형별 자원 회복률은 변경하지 않습니다.']],['관측',['새 Food Flow 30일 CSV에서 Settlement별 주식량 입고·소비·복원·타일 간 원격 조달을 관측합니다.','이전 D3 foodDepositOverflow는 입고 미수용 요청량이며 실제 유실량이 아닙니다.']],['검증',['기존 Snapshot 1,683열, Settlement 48열, Housing 11열, Economy 24열을 유지합니다.','다른 Settlement 재고·시장 Gold·군사 물류는 변경하지 않습니다.']]]});
NS.V034D3A=Object.freeze({version:VERSION,harvestAndStore,transferWithReturn,foodCSV,columns:COL,stats:state,rows:windowRows,laborIssues,audit:w=>({ok:D3.audit(w).ok,conservedHarvestRestored:state(w).total.harvestRestoredNatural,transferUnrecovered:state(w).total.transferUnrecovered})});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D3A header',e);}
})(window.VSim);
