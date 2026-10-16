/* Village Observer V0.34G1B — settlement-first nation UI; read-only observation.
 * No economy, logistics, AI, Person, RNG, or protected legacy source changes.
 */
(function(NS){'use strict';
const VERSION='V0.34G1B',PREVIOUS='V0.34G1A',KEY='village-observer-v034g1b';
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=(x,d=1)=>n(x).toFixed(d);
const pct=(part,total)=>Math.max(0,Math.min(100,total>0?100*n(part)/n(total):0));
const eq=(a,b)=>String(a)===String(b);
const RES=[['food','🌾','식량'],['wood','🪵','목재'],['stone','🪨','석재'],['iron_ore','⛏','철광'],['iron','🔩','철'],['tools','🔧','도구']];
const buildingIcon=b=>NS.BUILDINGS?.[b]?.icon||'▣';
const buildingLabel=b=>NS.BUILDINGS?.[b]?.label||b;
const terrain=t=>NS.TERRAIN?.[t?.terrain]?.label||String(t?.terrain||'미상');
const bar=(value,maximum)=>`<div class="v034g1b-bar"><span style="width:${pct(value,maximum).toFixed(2)}%"></span></div>`;
function dataFor(v,w){
 const gs=NS.V034G1A.groupsForUI(v,w),personByTile=new Map(),personByGroup=new Map();
 const byTile=new Map();for(const g of gs)for(const tid of g.tileIds||[])byTile.set(Number(tid),String(g.settlementId));
 for(const p of v.residents||[]){if(p.alive===false)continue;const tid=Number(p.homeTileId),sid=byTile.get(tid);if(!sid)continue;
  let a=personByGroup.get(sid);if(!a){a={count:0,age:0,health:0,happiness:0,hunger:0,severe:0,critical:0,jobs:new Map()};personByGroup.set(sid,a);}a.count++;a.age+=n(p.age);a.health+=n(p.health);a.happiness+=n(p.happiness);a.hunger+=n(p.hunger);if(n(p.hunger)>=85)a.severe++;if(n(p.hunger)>=95)a.critical++;const j=String(p.job||'미배정');a.jobs.set(j,(a.jobs.get(j)||0)+1);personByTile.set(tid,(personByTile.get(tid)||0)+1);
 }
 return{groups:gs,people:personByGroup,byTile,personByTile};
}
function groupData(v,w,g,people){
 const ids=(g.tileIds||[]).map(Number),centerId=Number(g.coreTileId??ids[0]);const tiles=ids.map(id=>w.map.get(id)).filter(Boolean);
 const raw=k=>Math.max(0,n(v.stockAt?.(centerId,k)));const stock=Object.fromEntries(RES.map(([k])=>[k,raw(k)]));
 const sharedCaps=v.settlementCaps?.(centerId)||{};const capacity=Object.fromEntries(RES.map(([k])=>[k,Math.max(0,n(sharedCaps[k]))]));
 const counts=new Map(),condition=[],cityNames=new Map(),urbScores=[],usedTiles=new Set();
 for(const t of tiles){usedTiles.add(Number(t.id));(t.buildings||[]).forEach((b,i)=>{counts.set(b,(counts.get(b)||0)+1);condition.push(n(t.buildingCondition?.[i]??100));});}
 // V28 tile urbanity is a historical tile-scoped statistic, not a settlement value.
 // Show a derived tile-population-weighted figure only when existing cached rows are present.
 const source=v._v28Summary?.data?.rows||[];for(const r of source){if(!usedTiles.has(Number(r.id)))continue;urbScores.push({val:n(r.urbanity),pop:Math.max(1,n(r.pop))});if(r.rank)cityNames.set(r.rank,(cityNames.get(r.rank)||0)+1);}
 const urban=urbScores.length?urbScores.reduce((s,r)=>s+r.val*r.pop,0)/urbScores.reduce((s,r)=>s+r.pop,0):null;
 return{ids,tiles,centerId,stock,capacity,counts,buildCondition:condition.length?condition.reduce((a,b)=>a+b,0)/condition.length:null,people:people||{count:0,age:0,health:0,happiness:0,hunger:0,severe:0,critical:0,jobs:new Map()},urban,cityNames};
}
function drawResources(d){return RES.map(([k,ico,label])=>{
 const cap=d.capacity[k],val=d.stock[k];return`<div class="v034g1b-resource" title="정착지 전체 물리 재고 합계 / 구성 타일 저장 용량 합계"><span>${ico} ${label}</span>${bar(val,cap)}<span class="v034g1b-res-val">${f(val,0)} / ${f(cap,0)}</span></div>`;
 }).join('');}
function drawBuildings(d){const entries=[...d.counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));return entries.length?entries.map(([b,c])=>`<span class="v034g1b-building">${esc(buildingIcon(b))} ${esc(buildingLabel(b))} <strong>×${c}</strong></span>`).join(''):'<span class="v034g1b-note">건물 없음</span>';}
function settlementCard(v,w,g,ps,open){
 const d=groupData(v,w,g,ps),t=w.map.get(d.centerId),p=d.people,actualPop=n(g.population),cap=n(g.capacity),reserve=n(v.settlementReserveDays?.(d.centerId)),critical=p.critical||0;
 const buildingTotal=[...d.counts.values()].reduce((a,b)=>a+b,0);
 const jobList=[...p.jobs.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([job,c])=>`${esc(job)} ${c}`).join(' · ');
 const urgent=critical>0||reserve<6;
 return `<article class="v034g1b-settlement ${urgent?'v034g1b-urgent':''}" data-g1b-sid="${esc(g.settlementId)}">
  <header><div><h3>🏘 정착지 ${esc(g.settlementId)}</h3><div class="v034g1b-sub">중심 (${t?.x??'?'},${t?.y??'?'}) · ${d.ids.length}타일 · ${buildingTotal}개 건물</div></div><div class="v034g1b-reserve" title="현재 F2 주민 구성별 3일 배급 요구량 기준">🌾 ${f(reserve)} <small>작업주기</small></div></header>
  <div class="v034g1b-pop"><div class="v034g1b-pop-label"><strong>👥 ${actualPop}명</strong><span>공동 주거 ${f(cap,0)}명분${g.shortage>0?' · 부족 '+f(g.shortage,1):''}</span></div>${bar(actualPop,cap)}
    <div class="v034g1b-pop-meta">평균 건강 ${p.count?f(p.health/p.count,0):'—'} · 행복 ${p.count?f(p.happiness/p.count,0):'—'} · Hunger ${p.count?f(p.hunger/p.count,0):'—'}${p.severe?' · 심한 Hunger '+p.severe+'명':''}</div></div>
  <div class="v034g1b-overview"><span><b>주거</b> ${f(pct(actualPop,cap),0)}%</span><span><b>도시화</b> ${d.urban==null?'미집계':f(d.urban,0)+'/100'}</span><span><b>평균 연령</b> ${p.count?f(p.age/p.count):'—'}세</span><span><b>평균 시설 상태</b> ${d.buildCondition==null?'—':f(d.buildCondition,0)+'%'}</span></div>
  <div class="v034g1b-resources">${drawResources(d)}</div>
  <div class="v034g1b-buildings"><div class="v034g1b-section-title">🏗 시설 · ${buildingTotal}개</div><div class="v034g1b-building-list">${drawBuildings(d)}</div></div>
  <div class="v034g1b-jobs"><b>직업 구성</b> <span>${jobList||'거주 주민 없음'}</span></div>
  <div class="v034g1b-action"><button type="button" data-g1b-expand="${esc(g.settlementId)}">${open?'구성 타일 접기 ▴':'구성 타일 보기 ▾'}</button><button type="button" data-g1b-center="${d.centerId}">📍 지도에서 보기</button></div>
  ${open?`<div class="v034g1b-member-list">${d.tiles.map(t=>`<button type="button" data-g1b-member="${t.id}">#${t.id} (${t.x},${t.y}) · ${esc(terrain(t))}</button>`).join('')}</div>`:''}
 </article>`;
}
function tileDetail(v,w,t){const cap=Object.fromEntries(RES.map(([k])=>[k,n(NS.V034D3?.physicalCap?.(v,t.id,k))])),raw=k=>n(NS.V034D3?.stockRaw?.(w,t.id,k)??t.stocks?.[k]);return `<div class="v034g1b-tile-detail"><div class="v034g1b-section-title">개별 타일 정보 · 공동 정착지 재고가 아닌 실제 위치별 재고</div>
  <div class="v034g1b-physical">${RES.map(([k,ico,label])=>`<span>${ico} ${label} ${f(raw(k),1)} / ${f(cap[k],1)}</span>`).join('')}</div>
  <div class="v034g1b-building-list">${(t.buildings||[]).map(b=>`<span class="v034g1b-building">${esc(buildingIcon(b))} ${esc(buildingLabel(b))}</span>`).join('')||'시설 없음'}</div>
  <button type="button" data-g1b-center="${t.id}">📍 지도에서 타일 상세 보기</button></div>`;}
function render(ui){const w=ui.world,v=w?.selectedNation,root=ui.q?.('villageContent');if(!w||!v||!root)return;
 const switcher=root.querySelector('.v034g1a-switch');const mode=ui._g1aMode==='tiles'?'tiles':'settlements';const model=dataFor(v,w),expanded=ui._g1bExpanded||(ui._g1bExpanded=new Set());
 let html='';if(mode==='settlements'){
  html=`<div class="v034g1b-heading"><strong>${esc(v.name)} · 정착지</strong><span>정착지 ${model.groups.length}개 · 영토 ${v.territory.size}타일</span></div><div class="v034g1b-cards">${model.groups.map(g=>settlementCard(v,w,g,model.people.get(String(g.settlementId)),expanded.has(String(g.settlementId)))).join('')}</div>`;
 }else{
  const tiles=[...v.territory].map(id=>w.map.get(Number(id))).filter(Boolean).sort((a,b)=>n(model.personByTile.get(b.id))-n(model.personByTile.get(a.id))||a.id-b.id),sel=ui._g1bTileOpen;
  html=`<div class="v034g1b-heading"><strong>${esc(v.name)} · 타일</strong><span>${tiles.length}타일 · 선택하여 상세 보기</span></div><div class="v034g1b-tiles">${tiles.map(t=>{const selected=Number(sel)===t.id,pop=n(model.personByTile.get(t.id)),bid=(t.buildings||[]).length;return `<section class="v034g1b-tile-row ${selected?'is-selected':''}"><button type="button" class="v034g1b-tile-button" data-g1b-tile="${t.id}" aria-expanded="${selected}"><span class="v034g1b-tile-main">${t.id===v.coreTileId?'🏛':'▣'} <b>#${t.id}</b> (${t.x},${t.y}) · ${esc(terrain(t))}<small>정착지 ${esc(model.byTile.get(t.id)||'미배정')}</small></span><span class="v034g1b-tile-metrics">👥 ${pop} · 🏗 ${bid} ${selected?'▴':'▾'}</span></button>${selected?tileDetail(v,w,t):''}</section>`;}).join('')}</div>`;
 }
 // Preserve G1A's working mode switch, but replace previous dense/compact list contents.
 const scroll=root.scrollTop,bar=switcher?.cloneNode(true);root.innerHTML='';if(bar){root.appendChild(bar);bar.querySelectorAll('[data-g1a-mode]').forEach(b=>b.addEventListener('click',()=>{ui._g1aMode=b.dataset.g1aMode;ui._g1bTileOpen=null;ui.renderVillageContent();}));}
 const host=document.createElement('div');host.className='v034g1b-root';host.innerHTML=html;root.appendChild(host);root.scrollTop=scroll;
 root.querySelectorAll('[data-g1b-expand]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.g1bExpand;expanded.has(id)?expanded.delete(id):expanded.add(id);ui.renderVillageContent();}));
 root.querySelectorAll('[data-g1b-member]').forEach(b=>b.addEventListener('click',()=>{ui._g1aMode='tiles';ui._g1bTileOpen=Number(b.dataset.g1bMember);ui.world.selectedTileId=ui._g1bTileOpen;root.scrollTop=0;ui.renderVillageContent();const row=root.querySelector('.is-selected');row?.scrollIntoView({block:'nearest'});}));
 root.querySelectorAll('[data-g1b-tile]').forEach(b=>b.addEventListener('click',()=>{const id=Number(b.dataset.g1bTile);ui._g1bTileOpen=ui._g1bTileOpen===id?null:id;ui.world.selectedTileId=id;ui.renderVillageContent();}));
 root.querySelectorAll('[data-g1b-center]').forEach(b=>b.addEventListener('click',()=>{ui.world.selectedTileId=Number(b.dataset.g1bCenter);ui.view='map';ui.renderViews();}));
}
const priorSave=NS.SaveSystem;
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const s=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g1a')||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3')||localStorage.getItem('village-observer-v034f2');return s?NS.World.from(JSON.parse(s)):null;},
 export(w){const data=JSON.stringify(w.serialize()),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`village-observer-v034G1B-save-${w.year}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 exportDevJSON(w){const data=JSON.stringify(w.telemetry.toJSON(w)),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`village-observer-v034G1B-devlog-${w.telemetry.sessionId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g1b={ui:'settlement-detail/tile-compact',simulationChanged:false};return d;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('잘못된 세이브');return from(data.version===VERSION?{...data,version:PREVIOUS}:data);};
const toJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=toJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g1b={ui:'settlement-detail/tile-compact',simulationChanged:false};return j;};
if(NS.UI){const old=NS.UI.prototype.renderVillageContent,head=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderVillageContent=function(...args){const result=old.apply(this,args);if(this.sub==='settlements')render(this);return result;};
 NS.UI.prototype.renderHeader=function(...args){const r=head.apply(this,args);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
}
if(typeof document!=='undefined'){
 const s=document.createElement('style');s.textContent=`
 .v034g1b-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin:12px 0}.v034g1b-heading>strong{font-size:17px}.v034g1b-heading>span{font-size:12px;opacity:.72}
 .v034g1b-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v034g1b-settlement{border:1px solid rgba(115,148,177,.38);border-radius:12px;background:rgba(17,34,51,.39);padding:12px;min-width:0}.v034g1b-settlement.v034g1b-urgent{border-left:3px solid #e8a750}
 .v034g1b-settlement>header{display:flex;justify-content:space-between;gap:6px;align-items:flex-start;margin-bottom:8px}.v034g1b-settlement h3{font-size:14px;line-height:1.25;margin:0 0 4px;font-weight:700}.v034g1b-sub{font-size:11px;opacity:.7}.v034g1b-reserve{font-size:13px;white-space:nowrap;color:#b6d7f0;font-weight:700}.v034g1b-reserve small{font-size:10px;font-weight:400;opacity:.75}
 .v034g1b-pop{border:1px solid rgba(92,143,192,.32);border-radius:9px;padding:9px;background:rgba(52,110,161,.13)}.v034g1b-pop-label{display:flex;justify-content:space-between;font-size:12px;gap:8px}.v034g1b-pop-label span{opacity:.78}.v034g1b-bar{height:7px;min-width:15px;flex:1;border-radius:6px;background:rgba(130,170,205,.15);overflow:hidden}.v034g1b-bar>span{height:100%;display:block;background:#70b3ef;border-radius:6px}.v034g1b-pop>.v034g1b-bar{margin-top:7px}.v034g1b-pop-meta{font-size:11px;line-height:1.45;margin-top:6px;opacity:.78}
 .v034g1b-overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;font-size:11px;margin:8px 0}.v034g1b-overview>span{border-radius:5px;background:rgba(107,143,175,.11);padding:5px}.v034g1b-overview b{font-weight:600}
 .v034g1b-resources{display:grid;gap:4px;margin:8px 0}.v034g1b-resource{display:flex;align-items:center;gap:7px;font-size:11px}.v034g1b-resource>span:first-child{width:57px;flex:none}.v034g1b-resource .v034g1b-bar{height:6px}.v034g1b-res-val{width:81px;text-align:right;flex:none;white-space:nowrap;opacity:.8}
 .v034g1b-section-title{font-size:11px;font-weight:700;margin-bottom:6px}.v034g1b-building-list{display:flex;flex-wrap:wrap;gap:5px}.v034g1b-building{font-size:10px;border-radius:100px;border:1px solid rgba(123,159,189,.4);padding:4px 7px;white-space:nowrap}.v034g1b-note{font-size:11px;opacity:.62}.v034g1b-buildings{margin-top:8px}.v034g1b-jobs{display:flex;gap:6px;font-size:11px;line-height:1.5;margin-top:9px}.v034g1b-jobs span{opacity:.77}
 .v034g1b-action{display:flex;gap:7px;justify-content:space-between;margin-top:9px}.v034g1b-action button,.v034g1b-member-list button,.v034g1b-tile-detail button{font-size:11px;border-radius:7px;padding:6px 8px;cursor:pointer;border:1px solid rgba(105,147,190,.40)}.v034g1b-member-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
 .v034g1b-tiles{display:grid;gap:6px}.v034g1b-tile-row{border:1px solid rgba(121,161,192,.35);border-radius:9px;overflow:hidden;background:rgba(104,141,179,.06)}.v034g1b-tile-row.is-selected{border-color:#74b7ef}.v034g1b-tile-button{display:flex;justify-content:space-between;align-items:center;gap:8px;cursor:pointer;width:100%;padding:9px 12px;text-align:left;background:transparent;border:0;color:inherit}.v034g1b-tile-main{font-size:12px;line-height:1.45}.v034g1b-tile-main small{display:block;opacity:.65}.v034g1b-tile-metrics{font-size:11px;opacity:.76;white-space:nowrap}.v034g1b-tile-detail{padding:12px;border-top:1px solid rgba(121,161,192,.32)}.v034g1b-physical{display:flex;flex-wrap:wrap;gap:8px;font-size:11px;margin-bottom:9px}.v034g1b-physical>span{padding:4px 6px;border-radius:5px;background:rgba(101,143,184,.11)}.v034g1b-tile-detail button{margin-top:10px}
 @media(max-width:730px){.v034g1b-cards{grid-template-columns:1fr}.v034g1b-settlement{padding:9px}.v034g1b-res-val{width:76px}.v034g1b-overview{grid-template-columns:repeat(2,minmax(0,1fr))}}
 `;document.head.appendChild(s);
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'정착지 상세 카드 · 타일 간결 목록',summary:'국가 정보에서 공동 경제와 인구·주거·시설을 정착지 상세 카드에 모으고, 타일은 선택형 간결 목록으로 전환합니다. 식량 비축 표시는 F2의 3일 작업주기 단위를 통일합니다.',sections:[['정착지 중심 화면',['실제 Settlement별 2열 카드(모바일 1열)에서 공동 재고, 주거, 평균 건강·행복, 건물 구성과 주민 직업을 바로 확인할 수 있습니다.','구성 타일은 필요할 때만 펼쳐보고 지도 상세로 이동합니다.']],['타일 탐색',['많은 타일을 빠르게 훑을 수 있는 압축 목록으로 전환합니다.','타일을 클릭하면 해당 타일의 물리 재고·건물만 펼쳐 보여 줍니다.']],['표시 정합성',['F2 식량 비축값을 작업주기(3일)로 명시하고 개별 타일의 공동 비축값 반복을 제거합니다.','공동 재고와 개별 타일의 실제 물리 재고를 구분 표시합니다.']],['비변경 범위',['G1A 물류 감사·F3 대사·RNG·경제·AI·군사·도로·공간 통합 규칙은 유지됩니다.','G2 정착지 단위 물류 알고리즘과 G3 원형 반경 확장은 아직 적용되지 않았습니다.']]]});
NS.V034G1B=Object.freeze({version:VERSION,dataFor,groupData});NS.RELEASE_VERSION=VERSION;
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);
