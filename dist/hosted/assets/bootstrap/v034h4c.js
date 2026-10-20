/* Village Observer V0.34H4C — conserved legacy stone overflow relocation + neutral/water borders.
 * Existing over-cap stock remains physically stored; NEW ordinary deposits obey the
 * total active Settlement capacity. Real same-nation routes move only excess stock.
 */
(function(NS){'use strict';
const VERSION='V0.34H4C',PREV='V0.34H4B',KEY='village-observer-v034h4c';
const EPS=1e-7,n=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b);
const data=new WeakMap(),bypass=new WeakMap();
function stats(w){let s=data.get(w);if(!s){s={pulses:0,shipments:0,quantity:0,blockedDeposits:0,blockedQuantity:0,physicalMismatch:0,failedReturns:0,blocked:{},latest:[],lastDay:null};data.set(w,s);}return s;}
function block(s,why){s.blocked[why]=(s.blocked[why]||0)+1;}
function tileOK(v,t){return !!(t&&same(t.ownerId,v.id)&&(t.v33OccupierId==null||same(t.v33OccupierId,v.id)));}
function group(v,tid){const w=v._world,t=w?.map?.get(Number(tid));if(!tileOK(v,t))return null;
 const m=NS.V034D3?.members?.(v,Number(tid));const ids=m?.ids?.length?m.ids.map(Number):[Number(tid)];
 return {id:String(m?.sid??'tile:'+tid),ids,anchor:Number(m?.core??ids[0]),nationId:v.id};
}
function stock(w,ids){return ids.reduce((s,id)=>s+Math.max(0,n(w.map.get(id)?.stocks?.stone)),0);}
function cap(v,ids){return ids.reduce((s,id)=>s+n(NS.V034D3?.physicalCap?.(v,id,'stone')??v.settlementCaps(id).stone),0);}
const previousDeposit=NS.Village.prototype.depositAt;
// Conserved rollback is permitted ONLY inside an explicit physical transaction.
// Do not allow a general production call to relabel itself as a return.
function withReturn(v,fn){const old=bypass.get(v)||0;bypass.set(v,old+1);try{return fn();}finally{if(old)bypass.set(v,old);else bypass.delete(v);}}
NS.Village.prototype.depositAt=function(id,k,qty){
 if(k==='stone'&&(bypass.get(this)||NS.V034D3A?.isReturning?.(this._world,this))){
  // Returning PREEXISTING physical stock to its original owner is legal even
  // when the ordinary storage capacity shrank. The native tile deposit will
  // accept what fits; any remaining rollback is restored on the physical tile.
  const t=this._world?.map.get(Number(id)),allowed=t&&tileOK(this,t)?Math.max(0,n(qty)):0;
  if(allowed<=EPS)return 0;
  const put=n(previousDeposit.call(this,id,k,allowed));
  if(allowed>put+EPS){t.stocks=t.stocks||{};t.stocks.stone=n(t.stocks.stone)+(allowed-put);}
  return allowed;
 }
 if(k!=='stone')return previousDeposit.call(this,id,k,qty);
 const g=group(this,id);if(!g)return previousDeposit.call(this,id,k,qty);
 const available=Math.max(0,cap(this,g.ids)-stock(this._world,g.ids));
 const want=Math.max(0,n(qty)),allowed=Math.min(want,available);
 if(want>allowed+EPS){const s=stats(this._world);s.blockedDeposits++;s.blockedQuantity+=want-allowed;}
 return allowed>EPS?previousDeposit.call(this,id,k,allowed):0;
};
// V034D3A returns rejected intra-network stones with RETURN context; its handler
// invokes depositAt again, so preserve that exact already-owned stock as well.
const originalTransfer=NS.V034D3A?.transferWithReturn;
if(originalTransfer){
 // The original D3A handler does not export its internal RETURN context. A
 // dedicated stone transport path below avoids relying on this legacy behavior.
}
function groups(v,w){const map=new Map();for(const raw of v.territory||[]){const tid=Number(raw),t=w.map.get(tid);if(!tileOK(v,t))continue;
 const g=group(v,tid);if(!g)continue;let row=map.get(g.id);if(!row){row={id:g.id,ids:[],anchor:tid};map.set(g.id,row);}row.ids.push(tid);
 }
 return [...map.values()].map(g=>{g.ids.sort((a,b)=>a-b);g.anchor=g.ids[0];g.stock=stock(w,g.ids);g.cap=cap(v,g.ids);g.excess=Math.max(0,g.stock-g.cap);g.room=Math.max(0,g.cap-g.stock);return g;});}
function route(v,w,source,target){let best=null;
 for(const a of source.ids)for(const b of target.ids){const ta=w.map.get(a),tb=w.map.get(b);if(!tileOK(v,ta)||!tileOK(v,tb))continue;
 const q=v.internalLogisticsCapacity?.(a,b,'stone',false),cost=Number(q?.cost),capacity=n(q?.capacity);
 if(!Number.isFinite(cost)||capacity<=EPS||q.reason==='D3_SHARED_POOL_NO_SHIPMENT')continue;
 if(!best||cost<best.cost-EPS||Math.abs(cost-best.cost)<EPS&&capacity>best.capacity)best={from:a,to:b,cost,capacity};
 }
 return best;
}
function restorePhysical(v,oldValues){let restored=0;for(const [id,amount] of oldValues){const t=v._world.map.get(id);if(t){const before=n(t.stocks?.stone);if(!t.stocks)t.stocks={};t.stocks.stone=amount;restored+=Math.max(0,amount-before);}}return restored;}
function move(v,w,src,dst,choice,limit){
 if(!choice||src.id===dst.id||!Number.isFinite(choice.cost))return 0;
 const beforeSrc=stock(w,src.ids),beforeDst=stock(w,dst.ids),allowed=Math.min(beforeSrc-cap(v,src.ids),cap(v,dst.ids)-beforeDst,n(choice.capacity),n(limit));
 if(allowed<=EPS)return 0;
 const snapshot=[...new Set([...src.ids,...dst.ids])].map(id=>[id,n(w.map.get(id)?.stocks?.stone)]);
 // Only the source pool supplies stone; the destination uses the native D3 deposit
 // so each accepted unit is real physical inventory, never an accounting phantom.
 const removed=n(v.withdrawAt(choice.from,'stone',allowed));
 const added=n(v.depositAt(choice.to,'stone',removed));
 if(removed-added>EPS){const s=stats(w);s.failedReturns++;restorePhysical(v,snapshot);block(s,'TRANSACTION_ROLLBACK');return 0;}
 const delta=(stock(w,src.ids)+stock(w,dst.ids))-(beforeSrc+beforeDst);
 if(Math.abs(delta)>1e-5){const s=stats(w);s.physicalMismatch++;restorePhysical(v,snapshot);block(s,'CONSERVATION_ROLLBACK');return 0;}
 return added;
}
const time=w=>n(w.calendarOrdinalDay?.()??((n(w.year)-1)*360+(n(w.quarter)-1)*90+n(w.day)));
function redistribute(w,{force=false}={}){
 if(!w)return null;const s=stats(w),day=time(w);if(!force&&(day%3!==0||day===s.lastDay))return s;
 s.lastDay=day;s.pulses++;
 for(const v of w.activeVillages||[]){const all=groups(v,w),sources=all.filter(g=>g.excess>EPS).sort((a,b)=>b.excess-a.excess||a.anchor-b.anchor);if(!sources.length)continue;
 let sent=0;for(const src of sources){if(sent>=3)break;
  let rem=Math.max(0,stock(w,src.ids)-cap(v,src.ids));if(rem<=EPS)continue;
  // Cheap geographic shortlist before expensive path search. Retry a second
  // group if the nearest targets are disconnected/occupied, not every nation tile.
  const options=all.filter(dst=>dst.id!==src.id&&cap(v,dst.ids)-stock(w,dst.ids)>EPS)
   .map(dst=>({dst,proximity:Math.min(...src.ids.flatMap(id=>dst.ids.map(j=>{
    const a=w.map.get(id),b=w.map.get(j);return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
   })))})).sort((a,b)=>a.proximity-b.proximity||a.dst.anchor-b.dst.anchor);
  let reachable=[];
  for(let start=0;start<options.length&&reachable.length===0&&start<24;start+=12){
   reachable=options.slice(start,start+12).map(({dst})=>({dst,way:route(v,w,src,dst)})).filter(x=>x.way);
  }
  reachable.sort((a,b)=>a.way.cost-b.way.cost||b.dst.room-a.dst.room||a.dst.anchor-b.dst.anchor);
  if(!reachable.length){block(s,options.length?'NO_ROUTE':'NO_CAPACITY');continue;}
  for(const {dst,way} of reachable){if(sent>=3||rem<=EPS)break;
   // G2/G2A food is processed before this H4C post-day pulse; same endpoint
   // capacity is shared instead of granting a second full food+stone shipment.
   const food=NS.V034G2A?.routes?.(w)||[];
   let spent=0;for(let i=food.length-1;i>=0;i--){const f=food[i];if(n(f.day)!==day)continue;if(same(f.nation,v.name)&&n(f.fromTileId)===way.from&&n(f.toTileId)===way.to)spent+=n(f.qty);}
   const remaining=Math.max(0,way.capacity-spent);if(remaining<=EPS){block(s,'CARRIER_RESERVED_FOR_FOOD');continue;}
   const moved=move(v,w,src,dst,way,Math.min(rem,remaining));if(moved<=EPS)continue;
   sent++;rem-=moved;s.shipments++;s.quantity+=moved;
   v.logisticsStats=v.logisticsStats||{};v.logisticsStats.moves=n(v.logisticsStats.moves)+1;v.logisticsStats.stoneMoved=n(v.logisticsStats.stoneMoved)+moved;
   const record={day,simTime:w.timestamp?.()||'',nationId:v.id,nation:v.name,fromSettlementId:src.id,toSettlementId:dst.id,fromTileId:way.from,toTileId:way.to,routeCost:+way.cost.toFixed(3),qty:+moved.toFixed(5),excessAfter:+Math.max(0,rem).toFixed(5)};
   s.latest.push(record);if(s.latest.length>70)s.latest.shift();
   w.telemetry?.record?.('STORAGE_OVERFLOW_TRANSFER34H4C',w,record);
  }
 }
 }
 return s;
}
const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const out=prevAdvance.apply(this,args);redistribute(this);return out;};
function summary(w){const s=stats(w),overflow=NS.V034H4?.storageDiagnosis?.(w)||[];return {version:VERSION,shipments:s.shipments,quantity:+s.quantity.toFixed(5),blockedDeposits:s.blockedDeposits,blockedQuantity:+s.blockedQuantity.toFixed(5),physicalMismatch:s.physicalMismatch,failedReturns:s.failedReturns,blocked:s.blocked,latest:s.latest.slice(-20),pending:overflow.length,pendingQuantity:+overflow.reduce((x,r)=>x+n(r.excess),0).toFixed(5)};}
function strokeNeutralBorders(ui){if((ui.h1BoundaryMode||'all')!=='all')return;const w=ui.world,g=ui._mapGeom,canvas=ui.q?.('worldCanvas');if(!w||!g||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx||!g.cell)return;
 const {cell,ox,oy}=g;ctx.save();ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);ctx.clip();ctx.beginPath();let count=0;
 for(const t of w.map.tiles){if(t.ownerId==null)continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const other=w.map.at(t.x+dx,t.y+dy);if(!other||other.ownerId!=null)continue;
 const x=ox+(t.x+(dx===1?1:0))*cell,y=oy+(t.y+(dy===1?1:0))*cell;
 ctx.moveTo(x,y);ctx.lineTo(x+(dy!==0?cell:0),y+(dx!==0?cell:0));count++;}}
 if(count){ctx.strokeStyle='#000000';ctx.lineWidth=Math.max(2.3,cell*.115)*.70;ctx.lineJoin='round';ctx.lineCap='square';ctx.globalAlpha=1;ctx.stroke();}ctx.restore();}
const proto=NS.UI?.prototype;
if(proto){const prevMap=proto.renderMap,prevHeader=proto.renderHeader;proto.renderMap=function(...a){const out=prevMap.apply(this,a);strokeNeutralBorders(this);return out;};proto.renderHeader=function(...a){const out=prevHeader.apply(this,a);refresh();return out;};}
function ensureStorageExport(ui){
 if(typeof document==='undefined'||!ui?.world)return;
 const near=document.getElementById('h4aExportStorage');if(!near||document.getElementById('h4cExportStorage'))return;
 const btn=document.createElement('button');btn.id='h4cExportStorage';btn.type='button';
 btn.textContent='H4C · 초과 석재 운송 진단 JSON';btn.style.marginLeft='8px';
 btn.onclick=()=>NS.SaveSystem.exportH4CStorage(ui.world);near.insertAdjacentElement('afterend',btn);
}
if(proto){const prior=proto.renderWorld;proto.renderWorld=function(...args){const out=prior.apply(this,args);ensureStorageExport(this);return out;};}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=oldSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const j=oldJSON.apply(this,a);j.version=VERSION;if(a[0]&&j.worldSummary)j.worldSummary.v034h4c=summary(a[0]);return j;};
const saveFile=(name,obj)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간이 부족합니다. JSON 파일로 내보내 주세요. '+e.message);}},
 load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},
 export(w){saveFile(`village-observer-v034H4C-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){saveFile(`village-observer-v034H4C-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 exportH4CStorage(w){saveFile(`vilob-h4c-storage-${w.year}y.json`,{version:VERSION,simTime:w.timestamp?.(),summary:summary(w),physical:NS.V034H4A?.diagnosis?.(w)});}
};
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'석재 초과 재분배·국가 전체 외곽선',summary:'과거의 초과 석재는 보존하되 신규 입고는 Settlement 전체 용량 기준으로 제한하고, 실제 통행 가능한 국가 내 정착지로 초과분을 물리 운송합니다. 중립 육지·수역 접경까지 국가 검은 외곽선을 확장합니다.',sections:[['석재 저장',['이미 존재하는 초과 재고는 삭제하지 않습니다.','일반 석재 입고는 정착지 공동 상한에 따라 차단하고, 3일마다 실제 경로·용량 내에서 최대 3건씩 재분배합니다.','실물 재고의 출발·도착 보존식 검사와 반송 실패 롤백을 시행합니다.']],['지도',['국가-국가 경계뿐 아니라 국가-중립 육지 및 국가-물 접경을 H4B와 같은 검은 두께로 그립니다.','세계 국가 비교 색상 막대와 선택 강조 모드는 변경하지 않습니다.']],['관측',['Devlog v034h4c 항목에 배송량·보존식·차단 건수·잔여 초과량을 표시합니다.']]]});
NS.V034H4C=Object.freeze({version:VERSION,groups,redistribute,summary,strokeNeutralBorders,withReturn,move});
try{refresh();}catch(_e){}
})(window.VSim);
