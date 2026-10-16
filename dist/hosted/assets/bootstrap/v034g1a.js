/* Village Observer V0.34G1A — audit connectivity + Settlement/Tile UI split.
 * Observation only. Never change logistics, diet, AI, RNG, Person or economy state.
 */
(function(NS){'use strict';
const VERSION='V0.34G1A',PREVIOUS='V0.34G1',KEY='village-observer-v034g1a';
const MAX=1600,weak=new WeakMap(),n=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b),num=x=>Number(n(x).toFixed(5));
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=w=>Number(w?.calendarOrdinalDay?.()||0);
function audit(w){let a=weak.get(w);if(!a){a={sampleDays:0,nationSamples:0,tileSamples:0,settlementSamples:0,multiTileSamples:0,hiddenShortageSettlements:0,falseDonorSettlements:0,duplicateDonorTiles:0,duplicateUrgentTileCandidates:0,pairSamples:0,sameSettlementPairs:0,sameSettlementFallbackPairs:0,shipments:0,shipmentQty:0,sameSettlementShipments:0,sameSettlementQty:0,rows:[],lastSampleDay:-1};weak.set(w,a);}return a;}
const sid=(w,v,id)=>{const t=w.map?.get(Number(id));return t&&same(t.ownerId,v.id)&&t.settlementId!=null?String(t.settlementId):'tile:'+id;};
function push(w,row){const a=audit(w);a.rows.push({calendarDay:day(w),...row});if(a.rows.length>MAX)a.rows.splice(0,a.rows.length-MAX);}
function sample(w){if(!w||!w.map)return;const a=audit(w),date=day(w);if(a.lastSampleDay===date)return;
 a.lastSampleDay=date;a.sampleDays++;
 for(const v of w.activeVillages||[]){
  const popByTile=new Map();for(const p of v.residents||[]){if(p?.alive===false||p.homeTileId==null)continue;const id=Number(p.homeTileId);let r=popByTile.get(id);if(!r){r={pop:0,severe:0,critical:0};popByTile.set(id,r);}r.pop++;if(n(p.hunger)>=85)r.severe++;if(n(p.hunger)>=95)r.critical++;}
  const groups=new Map();for(const id0 of v.territory||[]){const id=Number(id0),r=popByTile.get(id);if(!r?.pop)continue;const stock=n(v.stockAt?.(id,'food')),days=stock/Math.max(.12,r.pop*.36),s=sid(w,v,id);let g=groups.get(s);if(!g){g={id:s,tiles:[],population:0,stock,severe:0,critical:0,legacyUrgent:0,legacyDonor:0,minDays:Infinity,maxDays:0};groups.set(s,g);}g.tiles.push(id);g.population+=r.pop;g.stock=stock;g.severe+=r.severe;g.critical+=r.critical;g.minDays=Math.min(g.minDays,days);g.maxDays=Math.max(g.maxDays,days);
    if(days<6||r.critical>0||r.severe>=2||(r.severe>0&&days<12))g.legacyUrgent++;
    if(days>24&&stock>Math.max(8,r.pop*.36*24))g.legacyDonor++;
    a.tileSamples++;
  }
  a.nationSamples++;a.settlementSamples+=groups.size;
  for(const g of groups.values()){
   const sd=g.stock/Math.max(.12,g.population*.36),urgent=sd<6||g.critical>0||g.severe>=2||(g.severe>0&&sd<12),donor=sd>24&&g.stock>Math.max(8,g.population*.36*24);
   const hidden=urgent&&!g.legacyUrgent,wrongDonor=!donor&&g.legacyDonor>0;
   if(g.tiles.length>1)a.multiTileSamples++;
   if(hidden)a.hiddenShortageSettlements++;
   if(wrongDonor)a.falseDonorSettlements++;
   a.duplicateDonorTiles+=Math.max(0,g.legacyDonor-1);a.duplicateUrgentTileCandidates+=Math.max(0,g.legacyUrgent-1);
   if(g.tiles.length>1||hidden||wrongDonor)push(w,{kind:'INDEX',nation:v.name,settlementId:g.id,memberTileIds:g.tiles.join('|'),population:g.population,sharedFood:num(g.stock),settlementReserveDays:num(sd),tileDaysMin:num(g.minDays),tileDaysMax:num(g.maxDays),legacyUrgentTiles:g.legacyUrgent,settlementUrgent:Number(urgent),legacyDonorTiles:g.legacyDonor,settlementDonor:Number(donor),hiddenShortage:Number(hidden),falseDonor:Number(wrongDonor)});
  }
 }
}
function observePair(v,w,d,r,regular,z){const a=audit(w);a.pairSamples++;const s=sid(w,v,d.id),t=sid(w,v,r.id);if(s===t){a.sameSettlementPairs++;if(n(regular?.capacity)<=0&&n(z?.cap)>0)a.sameSettlementFallbackPairs++;push(w,{kind:'SAME_SETTLEMENT_PAIR',nation:v.name,settlementId:s,fromTileId:d.id,toTileId:r.id,legacyRouteCost:num(z?.cost),regularCapacity:n(regular?.capacity),fallbackCapacity:num(z?.cap),note:regular?.reason||''});}}
function observeShipment(type,w,data){if(type!=='NATIONAL_FOOD_RELAY32D5'||!w||!data)return;const v=(w.villages||[]).find(v=>same(v.id,data.villageId));if(!v)return;const a=audit(w),s=sid(w,v,data.fromTileId),t=sid(w,v,data.toTileId),isSame=s===t,qty=n(data.qty);a.shipments++;a.shipmentQty+=qty;if(isSame){a.sameSettlementShipments++;a.sameSettlementQty+=qty;}
 const geo=NS.V034G1?.endpointGeometry?.(w,v,data.fromTileId,data.toTileId);
 push(w,{kind:'SHIPMENT',nation:v.name,fromSettlementId:s,toSettlementId:t,fromTileId:data.fromTileId,toTileId:data.toTileId,quantity:qty,legacyRouteCost:num(data.routeCost),sameSettlement:Number(isSame),legacyManhattan:geo?.base??'',bestManhattan:geo?.best??'',candidateFromTileId:geo?.bestFrom??'',candidateToTileId:geo?.bestTo??'',note:'real logistics event / geometry is Manhattan only'});
}
const advance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const ret=advance.apply(this,args);const d=day(this);if(d>0&&d%6===0&&audit(this).lastSampleDay!==d)sample(this);return ret;};
const record=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,data,...rest){const ret=record.call(this,type,w,data,...rest);if(type==='NATIONAL_FOOD_RELAY32D5')observeShipment(type,w,data);return ret;};
function summary(w){const a=audit(w),{rows,lastSampleDay,...counts}=a;return{...counts,shipmentQty:num(counts.shipmentQty),sameSettlementQty:num(counts.sameSettlementQty),retainedRows:rows.length,lastSampleDay,retentionLimit:MAX,scope:'6-day settlement comparison + actual E2 relay event + E2 pair cache-miss',simulationChanged:false};}
const HEAD=['calendarDay','kind','nation','settlementId','memberTileIds','population','sharedFood','settlementReserveDays','tileDaysMin','tileDaysMax','legacyUrgentTiles','settlementUrgent','legacyDonorTiles','settlementDonor','hiddenShortage','falseDonor','fromSettlementId','toSettlementId','fromTileId','toTileId','quantity','legacyRouteCost','sameSettlement','regularCapacity','fallbackCapacity','legacyManhattan','bestManhattan','candidateFromTileId','candidateToTileId','note'];
function csv(w){const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';return[HEAD.map(quote).join(','),...audit(w).rows.map(r=>HEAD.map(k=>quote(r[k])).join(','))].join('\n');}
function download(name,value){const url=URL.createObjectURL(new Blob(['\ufeff',value],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const saved=NS.SaveSystem;
NS.SaveSystem={...saved,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const text=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3')||localStorage.getItem('village-observer-v034f2');return text?NS.World.from(JSON.parse(text)):null;},
 export(w){const d=JSON.stringify(w.serialize()),url=URL.createObjectURL(new Blob([d],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=`village-observer-v034G1A-save-${w.year}y.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 exportDevJSON(w){const d=JSON.stringify(w.telemetry.toJSON(w)),url=URL.createObjectURL(new Blob([d],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=`village-observer-v034G1A-devlog-${w.telemetry.sessionId}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 exportLogisticsAuditG1(w){download(`village-observer-v034G1A-logistics-audit-${w.telemetry?.sessionId||'session'}.csv`,csv(w));}
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g1a={audit:'transient observation',ui:'nation settlement/tile tabs'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const originalJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=originalJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g1a=summary(w);return j;};
function groupsForUI(v,w){const rows=NS.V034D2?.context?.(v,w)||[],seen=new Set();return rows.filter(r=>{const id=String(r.settlementId);if(seen.has(id))return false;seen.add(id);return true;}).sort((a,b)=>n(b.population)-n(a.population)||n(a.coreTileId)-n(b.coreTileId));}
function renderGroups(ui,root,v){const w=ui.world,groups=groupsForUI(v,w),open=ui._g1aOpen||new Set();const html=groups.map(g=>{const anchor=Number(g.coreTileId??g.tileIds[0]),ids=(g.tileIds||[]).map(Number),r=(resource)=>n(v.stockAt?.(anchor,resource)),days=n(v.settlementReserveDays?.(anchor));const center=w.map.get(anchor);const structures=ids.reduce((s,id)=>s+(w.map.get(id)?.buildings?.length||0),0);const title=`정착지 ${escape(g.settlementId)}`;
 return `<details class="v034g1a-settlement-card" data-g1a-sid="${escape(g.settlementId)}" ${open.has(String(g.settlementId))?'open':''}><summary><span><strong>🏘 ${title}</strong><small>${center?`중심 (${center.x},${center.y}) · `:''}${ids.length}타일 · ${g.population}명</small></span><span class="v034g1a-tag">${days.toFixed(1)}주기 ▾</span></summary><div class="v034g1a-grid"><div>👥 인구 <b>${g.population}명</b></div><div>🏠 공동 주거 <b>${n(g.capacity).toFixed(1)}명분</b></div><div>🌾 공동 식량 <b>${r('food').toFixed(1)}</b></div><div>📦 비축 <b>${days.toFixed(1)}주기</b></div><div>🪵 목재 <b>${r('wood').toFixed(1)}</b></div><div>🪨 석재 <b>${r('stone').toFixed(1)}</b></div><div>🏗 건물 <b>${structures}개</b></div><div>🏘 주거 부족 <b>${n(g.shortage).toFixed(1)}명분</b></div></div><div class="v034g1a-members"><span>구성 타일</span>${ids.map(id=>{const t=w.map.get(id);return `<button type="button" data-g1a-tile="${id}" title="타일 탭에서 자세히 보기">#${id} (${t?.x??'?'},${t?.y??'?'})</button>`;}).join('')}</div><button type="button" class="v034g1a-jump" data-g1a-map="${anchor}">📍 중심 타일 지도에서 보기</button></details>`;}).join('');
 root.innerHTML=`<div class="v034g1a-top"><h2>${escape(v.name)} · 정착지</h2><div class="small muted">정착지 ${groups.length}개 · 영토 타일 ${v.territory.size}개</div></div><div class="v034g1a-list">${html||'<p class="muted">표시할 정착지가 없습니다.</p>'}</div>`;
 root.querySelectorAll('details[data-g1a-sid]').forEach(el=>el.addEventListener('toggle',()=>{const id=el.dataset.g1aSid;if(el.open)open.add(id);else open.delete(id);}));ui._g1aOpen=open;
 root.querySelectorAll('[data-g1a-tile]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.g1aTile);ui._g1aMode='tiles';ui.world.selectedTileId=id;ui.selectedSettlementDetailId=id;ui.renderVillageContent();});
 root.querySelectorAll('[data-g1a-map]').forEach(b=>b.onclick=()=>{ui.world.selectedTileId=Number(b.dataset.g1aMap);ui.view='map';ui.renderViews();});
}
function tabBar(ui,root){const mode=ui._g1aMode==='tiles'?'tiles':'settlements';const wrap=document.createElement('div');wrap.className='v034g1a-switch';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','국가 영역 보기');wrap.innerHTML=`<button type="button" data-g1a-mode="settlements" class="${mode==='settlements'?'active':''}">🏘 정착지</button><button type="button" data-g1a-mode="tiles" class="${mode==='tiles'?'active':''}">🗺 타일</button>`;root.insertAdjacentElement('afterbegin',wrap);wrap.querySelectorAll('button').forEach(b=>b.onclick=()=>{ui._g1aMode=b.dataset.g1aMode;ui.renderVillageContent();});}
if(NS.UI){const content=NS.UI.prototype.renderVillageContent,header=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderVillageContent=function(...args){const root=this.q?.('villageContent'),priorScroll=root?.scrollTop||0;const prevOpen=root?.querySelectorAll?.('details[data-g1a-sid]');if(prevOpen){this._g1aOpen=this._g1aOpen||new Set();prevOpen.forEach(d=>{if(d.open)this._g1aOpen.add(d.dataset.g1aSid);else this._g1aOpen.delete(d.dataset.g1aSid);});}
  const result=content.apply(this,args);const v=this.world?.selectedNation,host=this.q?.('villageContent');if(this.sub!=='settlements'||!host||!v)return result;
  if(this._g1aMode!=='tiles')renderGroups(this,host,v);
  tabBar(this,host);host.scrollTop=priorScroll;return result;};
 NS.UI.prototype.renderHeader=function(...args){const r=header.apply(this,args);const btn=document.getElementById('exportLogisticsAuditG1Btn');if(btn){btn.textContent='G1A 물류 감사 CSV';btn.title='6일 간격 독립 정착지 감사 + 실제 물류 이벤트';}document.title='Village Observer '+VERSION;const v=document.getElementById('versionBadge');if(v)v.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
}
if(typeof document!=='undefined'){const s=document.createElement('style');s.textContent=`.v034g1a-switch{display:flex;gap:6px;margin:8px 0 14px;position:sticky;top:0;z-index:2;background:var(--bg,#131c27);padding:5px;border-radius:9px}.v034g1a-switch button{flex:1;padding:9px;border-radius:8px;cursor:pointer}.v034g1a-switch button.active{border:1px solid #5b9fc6;background:rgba(91,159,198,.22);font-weight:700}.v034g1a-list{display:grid;gap:10px}.v034g1a-settlement-card{border:1px solid rgba(125,158,184,.35);border-radius:10px;padding:10px;background:rgba(90,134,165,.07)}.v034g1a-settlement-card summary{display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer;list-style:none}.v034g1a-settlement-card summary::-webkit-details-marker{display:none}.v034g1a-settlement-card summary span{display:flex;flex-direction:column;gap:3px}.v034g1a-settlement-card summary small{opacity:.72}.v034g1a-settlement-card summary .v034g1a-tag{font-size:12px;white-space:nowrap;opacity:.75}.v034g1a-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:12px 0}.v034g1a-grid>div{background:rgba(101,134,164,.10);border-radius:6px;padding:8px;font-size:12px;display:flex;flex-direction:column;gap:3px}.v034g1a-members{display:flex;flex-wrap:wrap;align-items:center;gap:5px;padding:7px 0}.v034g1a-members span{font-size:12px;opacity:.7;margin-right:5px}.v034g1a-members button,.v034g1a-jump{cursor:pointer;border:1px solid rgba(115,147,182,.35);border-radius:7px;padding:6px;font-size:12px}.v034g1a-jump{margin-top:9px}.v034g1a-top{margin-bottom:10px}`;document.head.appendChild(s);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'정착지 카드·타일 탭 분리 및 식량 물류 감사 연결 안정화',summary:'국가 정착지 탭을 실제 정착지별 카드로 바꾸고 타일 상세를 별도 하위 탭에서 유지합니다. E2 물류 감사가 빈 파일로 끝나지 않도록 6일 정착지 샘플과 실제 운송 이벤트를 독립 계측합니다.',sections:[['국가 UI',['정착지별 공동 인구·주거·식량·자원 카드 및 구성 타일 버튼','정착지/타일 하위 탭 분리, 기존 타일 상세·지도 클릭 유지']],['감사',['6일마다 정착지 전체와 타일별 기존 비축 판단을 비교합니다.','실제 NATIONAL_FOOD_RELAY32D5 이벤트에서 배송 건수와 동일 정착지 배송 여부를 독립 기록합니다.','CSV 및 Devlog 요약은 G1A 전용으로 제공하며 감사 데이터는 세이브에 포함하지 않습니다.']],['변경하지 않은 것',['실제 물류·AI·F3 배급·RNG·전쟁·Gold·재고 보존식 미변경','최적 도로 경로와 정착지 수요 통합은 G2에서 처리']]]});
NS.V034G1A=Object.freeze({version:VERSION,summary,csv,sample,observePair,observeShipment,groupsForUI});NS.RELEASE_VERSION=VERSION;
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);
