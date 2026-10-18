/* V0.34G1 — Tile / Settlement terminology and read-only legacy food relay audit.
 * NO changes to F3 food, Person lifecycle, AI choice, physical transfer, route or RNG.
 * Audit sampled only at the existing E2 6-calendar-day food-index cadence.
 */
(function(NS){'use strict';
const VERSION='V0.34G1',PREVIOUS='V0.34F3',KEY='village-observer-v034g1';
const data=new WeakMap(),MAX_ROWS=1200,SMALL=1e-9;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const eq=(a,b)=>String(a)===String(b);
function audit(w){let a=data.get(w);if(!a){a={indexPulses:0,indexTileRows:0,indexSettlements:0,multiTilePulses:0,duplicateTileRows:0,duplicateDonorCandidates:0,hiddenShortageTiles:0,falseDonorTiles:0,duplicateUrgentReceivers:0,sameSettlementPairs:0,sameSettlementFallbackPairs:0,pairSamples:0,shipments:0,sameSettlementShipments:0,shipmentQty:0,sameSettlementQty:0,multiTileShipmentEndpoints:0,potentialManhattanSavings:0,maxPotentialManhattanSavings:0,rows:[]};data.set(w,a);}return a;}
function short(x){return Number(n(x).toFixed(5));}
function cal(w){return Number(w?.calendarOrdinalDay?.()??0);}
function settlement(w,v,id){const t=w?.map?.get(Number(id));if(!t||!eq(t.ownerId,v.id)||t.settlementId==null||t.v33OccupierId!=null&&!eq(t.v33OccupierId,v.id))return null;return String(t.settlementId);}
function group(v,w,states){const groups=new Map();
 for(const r of states||[]){const sid=settlement(w,v,r.id)||('tile:'+r.id);let g=groups.get(sid);if(!g){g={sid,nationId:String(v.id),nationName:String(v.name),tiles:[],population:0,stock:n(r.stock),severe:0,critical:0,adults:0,donor24:0,donor30:0,urgentTiles:0,localDaysMin:Infinity,localDaysMax:0};groups.set(sid,g);}
  g.tiles.push(Number(r.id));g.population+=n(r.pop);g.severe+=n(r.severe);g.critical+=n(r.critical);g.adults+=n(r.adults);g.stock=n(r.stock);g.localDaysMin=Math.min(g.localDaysMin,n(r.days));g.localDaysMax=Math.max(g.localDaysMax,n(r.days));
  if(r.days>24&&r.stock>Math.max(8,r.pop*.36*24))g.donor24++;
  if(r.days>30&&r.stock>Math.max(8,r.pop*.36*30))g.donor30++;
  if(r.days<6||r.critical>0||r.severe>=2||(r.severe>0&&r.days<12))g.urgentTiles++;
 }
 for(const g of groups.values()){
  g.settlementDays=g.stock/Math.max(.12,g.population*.36);
  g.settlementUrgent=g.settlementDays<6||g.critical>0||g.severe>=2||(g.severe>0&&g.settlementDays<12);
  g.settlementDonor24=g.settlementDays>24&&g.stock>Math.max(8,g.population*.36*24);
  g.settlementDonor30=g.settlementDays>30&&g.stock>Math.max(8,g.population*.36*30);
 }
 return groups;
}
function append(w,entry){const a=audit(w);a.rows.push({calendarDay:cal(w),...entry});if(a.rows.length>MAX_ROWS)a.rows.splice(0,a.rows.length-MAX_ROWS);}
function observeFoodIndex(v,w,states){const a=audit(w),gs=group(v,w,states);
 a.indexPulses++;a.indexTileRows+=(states||[]).length;a.indexSettlements+=gs.size;
 for(const g of gs.values()){
  if(g.tiles.length>1)a.multiTilePulses++;
  a.duplicateTileRows+=Math.max(0,g.tiles.length-1);
  a.duplicateDonorCandidates+=Math.max(0,g.donor24-1);
  // Existing tile-based reserve can hide a Settlement-wide urgent shortage.
  if(g.settlementUrgent&&!g.urgentTiles)a.hiddenShortageTiles+=g.tiles.length;
  if(!g.settlementDonor24&&g.donor24)a.falseDonorTiles+=g.donor24;
  if(g.settlementUrgent&&g.urgentTiles>1)a.duplicateUrgentReceivers+=g.urgentTiles-1;
  // Keep samples for every multi-tile Settlement and any classification mismatch.
  if(g.tiles.length>1||g.settlementUrgent!==Boolean(g.urgentTiles)||!g.settlementDonor24&&g.donor24){
   append(w,{kind:'INDEX',nation:g.nationName,settlementId:g.sid,memberTileIds:g.tiles.join('|'),population:g.population,food:short(g.stock),settlementReserveDays:short(g.settlementDays),tileReserveDaysMin:short(g.localDaysMin),tileReserveDaysMax:short(g.localDaysMax),tileDonor24:g.donor24,settlementDonor24:Number(g.settlementDonor24),tileUrgent:g.urgentTiles,settlementUrgent:Number(g.settlementUrgent)});
  }
 }
}
function observePair(v,w,d,r,regular,z){const a=audit(w);a.pairSamples++;const s=settlement(w,v,d.id),t=settlement(w,v,r.id);
 if(s&&s===t){a.sameSettlementPairs++;if(n(regular?.capacity)<SMALL&&n(z.cap)>SMALL)a.sameSettlementFallbackPairs++;
  append(w,{kind:'SAME_SETTLEMENT_PAIR',nation:v.name,settlementId:s,fromTileId:d.id,toTileId:r.id,regularReason:regular?.reason||'',regularCapacity:n(regular?.capacity),fallbackCapacity:short(z.cap),routeCost:short(z.cost)});
 }
}
function endpointGeometry(w,v,from,to){const x=w.map?.get(Number(from)),y=w.map?.get(Number(to));if(!x||!y)return null;
 const idsFor=id=>{
  const m=NS.V034D3?.members?.(v,id);if(m?.ids?.length)return m.ids;
  const sid=settlement(w,v,id);if(sid&&v.territory){const rows=[];for(const tid of v.territory){if(settlement(w,v,tid)===sid)rows.push(Number(tid));}if(rows.length)return rows;}
  return[Number(id)];
 };
 const src=idsFor(from),dst=idsFor(to);
 const md=(a,b)=>Math.abs(n(a.x)-n(b.x))+Math.abs(n(a.y)-n(b.y));const base=md(x,y);let best=base,bestFrom=Number(from),bestTo=Number(to);
 for(const a of src){const ta=w.map?.get(a);if(!ta)continue;for(const b of dst){const tb=w.map?.get(b);if(!tb)continue;const dist=md(ta,tb);if(dist<best){best=dist;bestFrom=a;bestTo=b;}}}
 return{base,best,saving:Math.max(0,base-best),bestFrom,bestTo,actualRouteCostNotCompared:true};
}
function observeShipment(v,w,from,to,qty,routeCost){const a=audit(w);a.shipments++;a.shipmentQty+=n(qty);const s=settlement(w,v,from),t=settlement(w,v,to),same=!!s&&s===t;if(same){a.sameSettlementShipments++;a.sameSettlementQty+=n(qty);}
 const geo=endpointGeometry(w,v,from,to);if(geo&&geo.saving>0){a.multiTileShipmentEndpoints++;a.potentialManhattanSavings+=geo.saving;a.maxPotentialManhattanSavings=Math.max(a.maxPotentialManhattanSavings,geo.saving);}
 append(w,{kind:'SHIPMENT',nation:v.name,fromSettlementId:s||'',toSettlementId:t||'',fromTileId:from,toTileId:to,quantity:short(qty),legacyRouteCost:short(routeCost),sameSettlement:Number(same),legacyManhattan:geo?.base??'',bestManhattan:geo?.best??'',candidateFromTileId:geo?.bestFrom??'',candidateToTileId:geo?.bestTo??'',note:'G1 candidate is Manhattan only; no claimed road/terrain route saving'});
}
function summary(w){const a=audit(w),{rows,...counts}=a;return{...counts,shipmentQty:short(counts.shipmentQty),sameSettlementQty:short(counts.sameSettlementQty),retainedAuditRows:rows.length,retentionLimit:MAX_ROWS,observationScope:'V0.32E2 national emergency food relay decision points; geometry only for observed shipments',foodBalanceChanged:false,legacyDecisionChanged:false};}
const HEAD=['calendarDay','kind','nation','settlementId','memberTileIds','population','food','settlementReserveDays','tileReserveDaysMin','tileReserveDaysMax','tileDonor24','settlementDonor24','tileUrgent','settlementUrgent','fromSettlementId','toSettlementId','fromTileId','toTileId','regularReason','regularCapacity','fallbackCapacity','routeCost','quantity','legacyRouteCost','sameSettlement','legacyManhattan','bestManhattan','candidateFromTileId','candidateToTileId','note'];
function csv(w){const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';return[HEAD.map(quote).join(','),...audit(w).rows.map(r=>HEAD.map(k=>quote(r[k])).join(','))].join('\n');}
function filename(w){return`village-observer-v034G1-logistics-audit-${w.telemetry?.sessionId||'session'}.csv`;}
function download(name,contents,type){const url=URL.createObjectURL(new Blob([contents],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const save=NS.SaveSystem;
NS.SaveSystem={...save,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const text=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f3')||localStorage.getItem('village-observer-v034f2')||localStorage.getItem('village-observer-v034f1a1');return text?NS.World.from(JSON.parse(text)):null;},
 export(w){download(`village-observer-v034G1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034G1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportLogisticsAuditG1(w){download(filename(w),'\ufeff'+csv(w),'text/csv;charset=utf-8');}
};
const ser=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=ser.call(this);d.version=VERSION;d.v034g1={terminology:'Tile=타일,Settlement=정착지',audit:'read-only; counters not saved'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const toJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=toJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g1={revision:'settlement-terminology-legacy-food-relay-audit-v1',...summary(w)};return j;};
function settlementCounts(w,v){const active=w?._v34bActive;let count=0;
 if(active&&typeof active.values==='function'){for(const s of active.values())if(s?.lifecycle==='ACTIVE'&&eq(s.nationId,v.id))count++;}
 else{const seen=new Set();for(const id of v.territory||[]){const t=w?.map?.get(Number(id));if(t?.settlementId!=null)seen.add(String(t.settlementId));}count=seen.size;}
 return count;
}
function termCard(ui){const root=ui.q?.('villageContent'),v=ui.world?.selectedNation;if(!root||!v)return;let card=root.querySelector('.v034g1-terms');if(!card){card=document.createElement('div');card.className='v034g1-terms';root.insertAdjacentElement('afterbegin',card);}const tiles=v.territory?.size??v.territory?.length??0;card.textContent=`🏘 정착지 ${settlementCounts(ui.world,v)}개 · 🗺 영토 타일 ${tiles}개　|　정착지: 공동 주거·식량·경제권 / 타일: 지형·시설·군사 위치`;}
function renameTileTexts(root){if(!root)return;for(const node of root.querySelectorAll?.('.v17-settlement-detail .muted.small,.v16-jump [data-go="settlement"]')||[]){if(node.textContent?.trim()==='정착지 상세')node.textContent='타일 상세 (소속 정착지 공동 경제권)';if(node.hasAttribute?.('data-go'))node.textContent='🏘 이 타일의 개발 정보';}}
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const scope=document.getElementById('statsScope');const opt=scope?.querySelector?.('option[value="settlement"]');if(opt&&opt.textContent!=='타일 (기존 장기 통계)')opt.textContent='타일 (기존 장기 통계)';}
if(NS.UI){const hdr=NS.UI.prototype.renderHeader,rt=NS.UI.prototype.renderTile,rv=NS.UI.prototype.renderVillageContent,rs=NS.UI.prototype.renderStats;
 if(typeof hdr==='function')NS.UI.prototype.renderHeader=function(...args){const x=hdr.apply(this,args);mark();const near=document.getElementById('exportSettlementEconomyD3Btn')||document.getElementById('exportSettlementFoodFlowD3ABtn');if(near&&!document.getElementById('exportLogisticsAuditG1Btn')){const b=document.createElement('button');b.id='exportLogisticsAuditG1Btn';b.textContent='G1 물류 감사 CSV';b.title='기존 타일 수요와 정착지 수요 비교 (판단·배송 변경 없음)';b.addEventListener('click',()=>NS.SaveSystem.exportLogisticsAuditG1(this.world));near.insertAdjacentElement('afterend',b);}return x;};
 if(typeof rt==='function')NS.UI.prototype.renderTile=function(...args){const x=rt.apply(this,args),root=this.q?.('tileInspector'),t=this.world?.map?.get(this.world?.selectedTileId);if(!root||!t)return x;renameTileTexts(root);if(t.ownerId==null)return x;const economyTitle=root.querySelector?.('.v034d3-economy b');if(economyTitle)economyTitle.textContent='🌾 정착지 공동 재고';let info=root.querySelector('.v034g1-tile-label');if(!info){info=document.createElement('div');info.className='v034g1-tile-label';root.insertAdjacentElement('afterbegin',info);}const v=this.world?.villages?.find(nat=>eq(nat.id,t.ownerId)),sid=t.settlementId,member=v&&NS.V034D3?.members?.(v,t.id);info.textContent=`🗺 타일 #${t.id} · 소속 정착지 ${sid==null?'없음':sid} (${member?.ids.length||1}타일) · 국가 ${v?.name||''}`;return x;};
 if(typeof rv==='function')NS.UI.prototype.renderVillageContent=function(...args){const x=rv.apply(this,args);if(['overview','settlements','economy'].includes(this.sub)){termCard(this);if(this.sub==='settlements'){renameTileTexts(this.q?.('villageContent'));const main=this.q?.('villageContent')?.querySelector?.(':scope > h2');if(main&&main.textContent?.trim()===String(this.world.selectedNation?.name)+' 정착지')main.textContent=String(this.world.selectedNation.name)+' 영토 타일 목록';}for(const selector of ['.v034d1-summary b','.v034d2-summary b']){const t=this.q?.('villageContent')?.querySelector?.(selector);if(t)t.textContent=t.textContent.replaceAll('Settlement','정착지');}const title=this.q?.('villageContent')?.querySelector?.('.v034d3-summary b');if(title)title.textContent='🌾 D3 정착지 공동 자원·식량';}return x;};
 if(typeof rs==='function')NS.UI.prototype.renderStats=function(...args){const x=rs.apply(this,args),scope=this.q?.('statsScope'),opt=scope?.querySelector?.('option[value="settlement"]');if(opt&&opt.textContent!=='타일 (기존 장기 통계)')opt.textContent='타일 (기존 장기 통계)';const note=this.q?.('statsNote');if(note&&this.statsScope==='settlement')note.textContent='이 선택은 과거 타일별 장기 기록입니다. 다중 타일 정착지 통합 통계와 구분됩니다.';return x;};
}
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent='.v034g1-terms,.v034g1-tile-label{margin:8px 0;padding:8px 10px;border-radius:7px;background:rgba(82,128,183,.08);border:1px solid rgba(82,128,183,.28);font-size:12px;line-height:1.6}';document.head.appendChild(style);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'타일·정착지 용어 정비 및 식량 물류 감사 V1',summary:'Tile은 타일, Settlement는 공동 생활·경제권인 정착지로 통일합니다. 기존 E2 타일 기반 식량 물류 후보와 정착지 전체 수요를 비교하는 관측 전용 CSV를 추가하며 배급·AI·운송 규칙을 바꾸지 않습니다.',sections:[['용어 정비',['국가·지도에서 영토 타일 수와 정착지 수를 나누어 보여줍니다. 타일 상세는 위치·시설, 정착지는 공동 주거·식량·경제권입니다.','기존 타일별 장기통계 범위는 정착지 통합 지표와 구분하여 표시합니다.']],['기존 물류 감사',['V0.32E2 타일별 식량 수요·공급 후보와 Settlement별 합산 수요의 불일치, 동일 정착지의 운송 후보·실제 운송 여부를 관측합니다.','실제 배송 발생 시 최적 경계 진입점의 맨해튼 거리 후보만 계산합니다. 도로·지형 포함 실경로 절감은 G2 연구 대상으로 남깁니다.','정착지 수요/공급 집계는 기존 판단에 영향을 주지 않고 G1 물류 감사 CSV와 Devlog worldSummary에만 기록합니다.']],['검증·범위',['D3 공동 물리 재고·F0~F3 배급·Health·Happiness, 기존 AI·군사·RNG·경제 보존식 유지.','식량 물류의 Settlement 단위 실제 재설계 및 경계 도착 타일 선정은 G2에서 적용합니다.','감사 기록은 세이브에 포함되지 않아 일반 세이브 복귀 후 관측 카운터가 새로 시작됩니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034G1=Object.freeze({version:VERSION,enabled:true,observeFoodIndex,observePair,observeShipment,settlement,group,endpointGeometry,summary,csv,terminology:{Tile:'타일',Settlement:'정착지',Nation:'국가',Person:'주민'}});
mark();try{window.villageObserver?.renderHeader?.();}catch(e){}
})(window.VSim);
