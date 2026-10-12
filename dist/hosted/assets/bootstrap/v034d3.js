/* Village Observer V0.34D3 — physical-stock Settlement economy V1.
 * Same active, owned Settlement: civilian inventory, storage space and food
 * consumption are shared. Stocks, buildings and cash remain physical at tile.
 * Different Settlements retain transport constraints and conserved payments.
 * No food/terrain/harvest/consumption balance constants are modified.
 */
(function(NS){'use strict';
const VERSION='V0.34D3',PREVIOUS='V0.34D2B',KEY='village-observer-v034d3';
const RES=['food','wood','stone','iron_ore','iron','tools'];
const N=x=>Number.isFinite(Number(x))?Number(x):0;
const eq=(a,b)=>String(a)===String(b);
const meter=new WeakMap(),feeding=new WeakMap();
function stat(w){let s=meter.get(w);if(!s){s={sharedWithdrawCalls:0,sharedWithdrawQty:0,sharedDepositCalls:0,sharedDepositQty:0,avoidedSameSettlementTradePairs:0,marketGroupsNormalized:0,foodMealCalls:0,foodMealRequested:0,foodMealReceived:0,foodHarvestCalls:0,foodHarvestRequested:0,foodHarvested:0,foodNaturalRegenerated:0,foodDepositOverflow:0,marketGoldTransfers:0,marketGoldTransferQty:0,byTile:{}};meter.set(w,s);}return s;}
function tileStats(w,id){const s=stat(w);return s.byTile[id]||(s.byTile[id]={harvested:0,regen:0,consumed:0,mealDemand:0,depositOverflow:0});}
// D3B3: event-invalidated, physical Settlement membership cache.
// Only ownership, Settlement id and occupation state are watched. Stocks,
// Gold, buildings and Person objects remain live, never cached here.
const memberCache=new WeakMap(),memberScopes=new WeakMap(),tileWatch=new WeakMap();
function memberScope(w){let s=memberScopes.get(w);if(!s){s={epoch:0};memberScopes.set(w,s);}return s;}
function watchTile(w,t){if(tileWatch.get(t)===w)return true;
 const scope=memberScope(w);
 for(const key of ['ownerId','settlementId','v33OccupierId']){
  const d=Object.getOwnPropertyDescriptor(t,key);
  if(d&&!d.configurable)return false;
 }
 for(const key of ['ownerId','settlementId','v33OccupierId']){
  const d=Object.getOwnPropertyDescriptor(t,key),getter=d?.get,setter=d?.set;
  let value=getter?getter.call(t):t[key];
  Object.defineProperty(t,key,{configurable:true,enumerable:d?.enumerable??true,
   get(){return getter?getter.call(this):value;},
   set(next){const before=getter?getter.call(this):value;
    if(setter)setter.call(this,next);else if(!getter)value=next;
    const after=getter?getter.call(this):value;
    if(before!==after)scope.epoch++;
   }});
 }
 tileWatch.set(t,w);return true;
}
function members(v,id){const w=v?._world,tid=Number(id),t=w?.map?.get(tid);if(!t||!eq(t.ownerId,v.id))return null;
 const sid=t.settlementId;if(sid==null)return null;const rec=w._v34bActive?.get(String(sid))||(w.v34b?.settlements||[]).find(r=>eq(r.id,sid)&&r.lifecycle==='ACTIVE');
 if(!rec||!eq(rec.nationId,v.id)||rec.lifecycle!=='ACTIVE')return null;
 const scope=memberScope(w);let m=memberCache.get(rec);
 if(m&&m.source===rec.tileIds&&m.size===rec.tileIds.length&&m.core===Number(rec.coreTileId)&&m.nationId===v.id&&m.epoch===scope.epoch){return m.ids.includes(tid)?m:null;}
 const ids=[];let watched=true;
 for(const raw of rec.tileIds||[]){const mid=Number(raw),x=w.map.get(mid);if(x){if(!watchTile(w,x))watched=false;
  if(eq(x.ownerId,v.id)&&eq(x.settlementId,sid)&&!(x.v33OccupierId!=null&&!eq(x.v33OccupierId,v.id)))ids.push(mid);
 }}
 m={sid,ids,core:Number(rec.coreTileId),nationId:v.id,source:rec.tileIds,size:(rec.tileIds||[]).length,epoch:watched?scope.epoch:-1};
 memberCache.set(rec,m);return ids.includes(tid)?m:null;
}
function sameSettlement(w,a,b,nationId){if(Number(a)===Number(b))return true;const x=w?.map?.get(Number(a)),y=w?.map?.get(Number(b));return !!(x&&y&&x.settlementId!=null&&eq(x.settlementId,y.settlementId)&&eq(x.ownerId,y.ownerId)&&(nationId==null||eq(x.ownerId,nationId))&&!(x.v33OccupierId!=null&&!eq(x.v33OccupierId,x.ownerId))&&!(y.v33OccupierId!=null&&!eq(y.v33OccupierId,y.ownerId)));}
function stockRaw(w,id,k){return Math.max(0,N(w?.map?.get(Number(id))?.stocks?.[k]));}
const oldStock=NS.Village.prototype.stockAt,oldCap=NS.Village.prototype.settlementCaps,oldDeposit=NS.Village.prototype.depositAt,oldWithdraw=NS.Village.prototype.withdrawAt;
function pool(v,tid,k){const m=members(v,tid);return m?m.ids.reduce((s,id)=>s+stockRaw(v._world,id,k),0):Math.max(0,N(oldStock.call(v,tid,k)));}
function physicalCap(v,tid,k){return Math.max(0,N(oldCap.call(v,tid)?.[k]));}
function capacity(v,tid,k){const m=members(v,tid);return m?m.ids.reduce((s,id)=>s+physicalCap(v,id,k),0):physicalCap(v,tid,k);}
// Preserve the raw tile getter for observers, transport receipts and audits.
NS.Village.prototype.stockAt=function(id,k){const m=members(this,id);if(!m||m.ids.length<2)return oldStock.call(this,id,k);return m.ids.reduce((s,tid)=>s+stockRaw(this._world,tid,k),0);};
NS.Village.prototype.settlementCaps=function(id){const raw=oldCap.call(this,id),m=members(this,id);if(!m||m.ids.length<2)return raw;const o={...raw};for(const k of RES)o[k]=m.ids.reduce((s,tid)=>s+physicalCap(this,tid,k),0);return o;};
NS.Village.prototype.withdrawAt=function(id,k,qty){const m=members(this,id),q=Math.max(0,N(qty));if(!m||m.ids.length<2||!q){const got=oldWithdraw.call(this,id,k,qty),feed=feeding.get(this._world);if(k==='food'&&feed&&feed.v===this&&q>0){feed.requested+=q;feed.got+=got;tileStats(this._world,Number(id)).consumed+=got;tileStats(this._world,Number(id)).mealDemand+=q;}return got;}
 let left=q,got=0;for(const tid of [Number(id),...m.ids.filter(x=>x!==Number(id))]){if(left<=1e-9)break;const take=oldWithdraw.call(this,tid,k,left);got+=take;left-=take;}
 const d=stat(this._world);d.sharedWithdrawCalls++;d.sharedWithdrawQty+=got;
 const feedingCtx=feeding.get(this._world);if(k==='food'&&feedingCtx&&feedingCtx.v===this){feedingCtx.requested+=q;feedingCtx.got+=got;tileStats(this._world,Number(id)).consumed+=got;tileStats(this._world,Number(id)).mealDemand+=q;}
 return got;
};
NS.Village.prototype.depositAt=function(id,k,qty){const m=members(this,id),q=Math.max(0,N(qty));if(!m||m.ids.length<2||!q){const got=oldDeposit.call(this,id,k,qty);if(k==='food'&&this._world&&qty>got){stat(this._world).foodDepositOverflow+=Number(qty)-got;tileStats(this._world,Number(id)).depositOverflow+=Number(qty)-got;}return got;}
 let left=q,put=0;for(const tid of [Number(id),...m.ids.filter(x=>x!==Number(id))]){if(left<=1e-9)break;const added=oldDeposit.call(this,tid,k,left);put+=added;left-=added;}
 const s=stat(this._world);s.sharedDepositCalls++;s.sharedDepositQty+=put;
 if(k==='food'&&q>put){s.foodDepositOverflow+=q-put;tileStats(this._world,Number(id)).depositOverflow+=q-put;}
 return put;
};
// Legacy food reserve is in three-day economic-cycle units (child .30, adult .42).
// All homes in a Settlement share one numerator AND one population-weighted denominator.
const oldDays=NS.Village.prototype.settlementReserveDays;
NS.Village.prototype.settlementReserveDays=function(id){const m=members(this,id);if(!m||m.ids.length<2)return oldDays.call(this,id);
 // V26's resident index invalidates on birth, death, relocation and roster
 // replacement; only the members' real residents are read, not the nation.
 const index=NS.V026?.ensureResidentIndex?.(this)?.byHome;let people=0,demand=0;
 if(index){for(const tid of m.ids){const rows=index.get(tid);if(!rows)continue;for(const p of rows){people++;demand+=N(p.age)<15?.30:.42;}}}
 else{const resident=new Set(m.ids);for(const p of this.residents||[]){if(p.alive===false||!resident.has(Number(p.homeTileId)))continue;people++;demand+=N(p.age)<15?.30:.42;}}
 if(!people)return 999;return pool(this,id,'food')/Math.max(.12,demand);
};
// Same-Settlement logistics is not a shipment, and does not require route capacity.
const oldLogistics=NS.Village.prototype.internalLogisticsCapacity;
NS.Village.prototype.internalLogisticsCapacity=function(a,b,k,construction){if(Number(a)!==Number(b)&&sameSettlement(this._world,a,b,this.id))return {capacity:0,cost:0,reason:'D3_SHARED_POOL_NO_SHIPMENT'};return oldLogistics.call(this,a,b,k,construction);};
// Physically conserved Market Gold transfers within the same Settlement. Called
// only by real V29 wages, settlement-to-settlement domestic trade and real
// international market purchase. No national Treasury or Person wallet is used.
function fundMarketGold(v,w,tid,needed){const m=members(v,tid),want=Math.max(0,N(needed));if(!m||m.ids.length<2||want<=1e-9)return 0;
 const receiver=w.map.get(Number(tid));if(!receiver?.v29Economy)return 0;let left=want,moved=0;
 for(const id of m.ids){if(id===Number(tid))continue;const source=w.map.get(id)?.v29Economy;if(!source)continue;const available=Math.max(0,N(source.marketGold)),take=Math.min(left,available);if(take<=0)continue;source.marketGold=available-take;receiver.v29Economy.marketGold=N(receiver.v29Economy.marketGold)+take;left-=take;moved+=take;if(left<=1e-9)break;}
 if(moved>0){const s=stat(w);s.marketGoldTransfers++;s.marketGoldTransferQty+=moved;}return moved;
}
// The real tile market liquidity is conserved. Identical Settlement members use
// the same scarcity ratio/quote inside the V29 civilian market and never trade
// goods against themselves merely because they occupy distinct tiles.
function harmonizeMarketRows(v,w,rows){const groups=new Map();for(const row of rows.values()){const m=members(v,row.id),key=m?.sid??('tile-'+row.id);let group=groups.get(key);if(!group){group=[];groups.set(key,group);}group.push(row);}
 for(const group of groups.values()){if(group.length<2)continue;const prices={},stock={},caps={},ratio={};for(const k of ['food','wood','stone']){stock[k]=group.reduce((a,r)=>a+stockRaw(w,r.id,k),0);caps[k]=group.reduce((a,r)=>a+physicalCap(v,r.id,k),0);ratio[k]=stock[k]/Math.max(1,caps[k]);prices[k]=group.reduce((a,r)=>a+N(r.prices[k])*Math.max(1,physicalCap(v,r.id,k)),0)/group.reduce((a,r)=>a+Math.max(1,physicalCap(v,r.id,k)),0);}
 for(const row of group){row.stock={...stock};row.caps={...caps};row.ratio={...ratio};row.prices={...row.prices,...prices};}stat(w).marketGroupsNormalized++;
 }}
const oldMetabolism=NS.Person.prototype.metabolism;
NS.Person.prototype.metabolism=function(v,w,...args){const prev=feeding.get(w),scope={v,p:this,requested:0,got:0};feeding.set(w,scope);try{return oldMetabolism.call(this,v,w,...args);}finally{if(prev)feeding.set(w,prev);else feeding.delete(w);if(scope.requested>0){const s=stat(w);s.foodMealCalls++;s.foodMealRequested+=scope.requested;s.foodMealReceived+=scope.got;}}};
const oldHarvest=NS.Tile.prototype.harvest;
NS.Tile.prototype.harvest=function(k,qty,day){const out=oldHarvest.call(this,k,qty,day);if(k==='food'){const w=NS._v32fActiveAct?.w||this._worldRef;if(w){const s=stat(w);s.foodHarvestCalls++;s.foodHarvestRequested+=Math.max(0,N(qty));s.foodHarvested+=out;tileStats(w,this.id).harvested+=out;}}return out;};
const oldSync=NS.Tile.prototype.syncResources;
NS.Tile.prototype.syncResources=function(day){const before=N(this.resources?.food),last=N(this.lastResourceDay);const out=oldSync.call(this,day),gain=Math.max(0,N(this.resources?.food)-before);if(gain>0&&N(day)>last){const w=NS._v32fActiveAct?.w||this._worldRef;if(w){stat(w).foodNaturalRegenerated+=gain;tileStats(w,this.id).regen+=gain;}}return out;};
function economyRows(w){const groups=NS.V034D1.all(w),out=[];for(const r of groups){const v=w.villages.find(x=>eq(x.id,r.nationId));if(!v)continue;const m=r.tileIds,foodDemand=(v.residents||[]).filter(p=>p.alive!==false&&m.some(id=>Number(id)===Number(p.homeTileId))).reduce((s,p)=>s+(N(p.age)<15?.30:.42),0);
 const baseRegen=m.reduce((s,id)=>s+N(NS.TERRAIN[w.map.get(Number(id))?.terrain]?.regen?.food),0),natural=m.reduce((s,id)=>s+N(w.map.get(Number(id))?.resources?.food),0);
 const cap={};for(const k of ['food','wood','stone'])cap[k]=m.reduce((s,id)=>s+physicalCap(v,id,k),0);
 const history=m.reduce((s,id)=>{const h=stat(w).byTile[Number(id)]||{};for(const k of ['harvested','regen','consumed','mealDemand','depositOverflow'])s[k]=(s[k]||0)+N(h[k]);return s;},{});
 out.push({...r,capacity:cap,foodDemand,foodReserveDays:foodDemand?r.resources.food/foodDemand:999,naturalFoodRemaining:natural,baseFoodRegenPerCycle:baseRegen,...history});
 }return out;}
function audit(w){const errs=[],warnings=[],rows=economyRows(w),d1=NS.V034D1.audit(w);if(!d1.ok)errs.push(...d1.errors.map(x=>'D1:'+x));const totals=Object.fromEntries(RES.map(k=>[k,0]));for(const r of rows){const v=w.villages.find(x=>eq(x.id,r.nationId));for(const k of RES){const physical=r.tileIds.reduce((s,id)=>s+stockRaw(w,id,k),0);if(Math.abs(physical-r.resources[k])>1e-6)errs.push('STOCK:'+r.settlementId+':'+k);totals[k]+=physical;
 if(r.tileIds.length>1){const p=pool(v,r.tileIds[0],k);if(Math.abs(p-physical)>1e-6)errs.push('POOL:'+r.settlementId+':'+k);}}
 for(const k of ['food','wood','stone'])if(r.resources[k]-r.capacity[k]>1e-5)warnings.push('STORAGE_OVERFLOW:'+r.settlementId+':'+k);
 }for(const k of RES){const real=(w.map?.tiles||[]).filter(t=>t.ownerId!=null).reduce((s,t)=>s+stockRaw(w,t.id,k),0);if(Math.abs(real-totals[k])>1e-5)errs.push('WORLD_'+k);}
 return {ok:errs.length===0,errors:errs,warnings,settlements:rows.length,multiTile:rows.filter(r=>r.tiles>1).length,resources:totals,foodNaturalPotential:rows.reduce((s,r)=>s+r.naturalFoodRemaining,0),foodBaseRegenPerCycle:rows.reduce((s,r)=>s+r.baseFoodRegenPerCycle,0)};
}
const COL=['settlementId','nationId','nationName','tileIds','population',...RES.map(k=>'stock_'+k),'foodStorageCapacity','woodStorageCapacity','stoneStorageCapacity','foodDemandPerCycle','foodReserveCycles','naturalFoodRemaining','baseFoodRegenPerCycle','foodHarvestedObserved','foodNaturalRegenObserved','mealFoodReceivedObserved','mealFoodRequestedObserved','foodDepositOverflowObserved','marketGold'];
function csv(w){const lines=[COL.join(',')],esc=x=>'"'+String(x??'').replace(/"/g,'""')+'"';for(const r of economyRows(w)){const o={...r,tileIds:r.tileIds.join('|'),foodStorageCapacity:r.capacity.food,woodStorageCapacity:r.capacity.wood,stoneStorageCapacity:r.capacity.stone,foodDemandPerCycle:r.foodDemand,foodReserveCycles:r.foodReserveDays,foodHarvestedObserved:r.harvested,foodNaturalRegenObserved:r.regen,mealFoodReceivedObserved:r.consumed,mealFoodRequestedObserved:r.mealDemand,foodDepositOverflowObserved:r.depositOverflow,marketGold:r.finance.marketGold};for(const k of RES)o['stock_'+k]=r.resources[k];lines.push(COL.map(k=>esc(o[k])).join(','));}return lines.join('\n');}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=oldSerialize.call(this);x.version=VERSION;x.v034d3={revision:'civilian-physical-settlement-economy-pooling',noFreeResources:true,baseRegenUnchanged:true};return x;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error('V0.34D3 저장 파일만 지원합니다.');return oldFrom({...data,version:PREVIOUS});};
function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const text=localStorage.getItem(KEY);return text?NS.World.from(JSON.parse(text)):null;},
 export(w){download(`village-observer-v034D3-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D3-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D3-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const a=audit(w);if(!a.ok)throw Error('D3 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D3-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){const a=audit(w);if(!a.ok)throw Error('D3 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D3-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){const a=audit(w);if(!a.ok)throw Error('D3 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D3-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=oldJSON.call(this,w);out.version=VERSION;if(out.worldSummary){out.worldSummary.v034d3Revision='civilian-settlement-economy-physical-stock-pooling-v1';out.worldSummary.v034d3Audit=audit(w);const x=stat(w);out.worldSummary.v034d3FoodFlow={...x,byTile:undefined,mealUnserved:Math.max(0,x.foodMealRequested-x.foodMealReceived)};}return out;};
if(NS.UI){const codex=NS.UI.prototype.renderCodex;if(typeof codex==='function')NS.UI.prototype.renderCodex=function(...args){const result=codex.apply(this,args),root=this.q?.('codexContent');if(root&&root.innerHTML?.includes('자연회복/일'))root.innerHTML=root.innerHTML.replaceAll('자연회복/일','자연회복/3일 작업주기');return result;};}
if(NS.UI){const header=NS.UI.prototype.renderHeader,tile=NS.UI.prototype.renderTile,content=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderHeader=function(...args){const out=header.apply(this,args);if(typeof document==='undefined')return out;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const near=document.getElementById('exportSettlementHousingD2Btn')||document.getElementById('exportSettlementCsvD1Btn');if(near&&!document.getElementById('exportSettlementEconomyD3Btn')){const btn=document.createElement('button');btn.id='exportSettlementEconomyD3Btn';btn.textContent='Settlement Economy CSV';btn.title='D3 공동 자원·식량 흐름 CSV '+COL.length+'열';btn.addEventListener('click',()=>{try{NS.SaveSystem.exportSettlementEconomyCSV(this.world);}catch(e){console.error(e);alert('D3 CSV 오류: '+e.message);}});near.insertAdjacentElement('afterend',btn);}return out;};
 NS.UI.prototype.renderTile=function(...args){const out=tile.apply(this,args),id=this.world?.selectedTileId,t=this.world?.map?.get(id),v=this.world?.villages?.find(x=>eq(x.id,t?.ownerId)),root=this.q?.('tileInspector');if(!v||!root)return out;const m=members(v,id);if(!m)return out;let box=root.querySelector('.v034d3-economy');if(!box){box=document.createElement('div');box.className='v034d3-economy';root.appendChild(box);}const f=pool(v,id,'food'),days=v.settlementReserveDays(id),r=m.ids.reduce((s,tid)=>s+N(this.world.map.get(tid)?.resources?.food),0);box.innerHTML=`<b>🌾 D3 공동 경제권</b><div class="small">${m.ids.length}타일 · 식량 ${f.toFixed(1)} / 비축 ${days.toFixed(1)}작업주기 · 자연 식량 ${r.toFixed(1)}<br>목재 ${pool(v,id,'wood').toFixed(1)} · 석재 ${pool(v,id,'stone').toFixed(1)} · 철광 ${pool(v,id,'iron_ore').toFixed(1)}<br>시설·군사 위치는 타일별 유지 / 다른 Settlement 물류는 별도</div>`;return out;};
 NS.UI.prototype.renderVillageContent=function(...args){const out=content.apply(this,args),v=this.world?.selectedNation,root=this.q?.('villageContent');if(!v||!root||!['overview','settlements','economy'].includes(this.sub))return out;let box=root.querySelector('.v034d3-summary');if(!box){box=document.createElement('div');box.className='v034d3-summary';root.insertAdjacentElement('afterbegin',box);}const rows=economyRows(this.world).filter(r=>eq(r.nationId,v.id));const food=rows.reduce((s,r)=>s+r.resources.food,0),demand=rows.reduce((s,r)=>s+r.foodDemand,0);box.innerHTML=`<b>🌾 D3 Settlement 공동 자원·식량</b><div class="small">경제권 ${rows.length}개 · 저장 식량 ${food.toFixed(1)} · 평균 ${demand>0?(food/demand).toFixed(1):'∞'}작업주기 · 자연회복 기초 ${rows.reduce((s,r)=>s+r.baseFoodRegenPerCycle,0).toFixed(1)} / 3일<br>자원 자체 생성 없이 동일 Settlement 재고·창고 접근을 통합합니다.</div>`;return out;};
}
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent='.v034d3-economy,.v034d3-summary{margin:9px 0;padding:9px 11px;background:rgba(82,128,183,.09);border:1px solid rgba(82,128,183,.40);border-radius:9px;line-height:1.55}';document.head.appendChild(style);document.title='Village Observer '+VERSION;}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Settlement Economy Integration V1',summary:'같은 Settlement의 실제 식량·자재·저장 공간을 공동 이용하고 내부 가상 운송·거래를 배제합니다. 식량 수지 관측을 추가하며 기본 생산·소비·자연회복 수치는 유지합니다.',sections:[['공동 경제권',['동일 활성 Settlement 내 식량·목재·석재·철광석·철·도구 재고를 공동 이용합니다. 실제 재고는 개별 물리 타일에 보존됩니다.','건물과 군사 유닛은 기존 타일 단위로 남고, 다른 Settlement/국가 간 이동은 실제 물류 제약을 유지합니다.','같은 Settlement 내 별도 배송 및 국내 가격 차이로 발생하는 자기 거래는 실행하지 않습니다.']],['시장·식량',['기존 V0.29 민간 시장 평가에서 같은 Settlement의 재고 충족률과 가격 신호를 공유합니다. 임금·실제 시장 결제는 동일 Settlement 기존 Market Gold에서 보전되며 총액은 보존됩니다.','자연 식량 채집 요청·획득, 자연회복, 주민 식량 공급과 저장 초과를 관측합니다.','지형별 자연회복과 농업 채집 및 0.30/0.42 소비 수치를 변경하지 않습니다.']],['검증',['D3 24열 Settlement Economy CSV를 신규 제공하며 기존 Snapshot V2 1,683열, Settlement 48열, Housing 11열을 유지합니다.','D2B 특정 고정 시드 진행 중단 및 장기 전쟁·노후화 회귀는 계속 미해결 검증 항목입니다.']]]});
NS.V034D3=Object.freeze({version:VERSION,resources:RES,members,sameSettlement,pool,capacity,stockRaw,physicalCap,fundMarketGold,harmonizeMarketRows,economyRows,audit,csv,stats:w=>stat(w),noteIgnoredTradePair:w=>stat(w).avoidedSameSettlementTradePairs++});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D3 header',e);}
})(window.VSim);
