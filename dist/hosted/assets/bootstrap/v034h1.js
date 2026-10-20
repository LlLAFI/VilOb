/* V0.34H1 — Map UI & Settlement Visualization V2
 * Presentation-only: map geometry, controls, and inspector composition.
 * The Settlement ledger and all production, combat, AI, RNG, telemetry and F0/F1
 * calculations remain owned by the G5/H0 engines.
 */
(function(NS){'use strict';
const VERSION='V0.34H1',PREVIOUS='V0.34H0',KEY='village-observer-v034h1';
const P=NS.UI?.prototype;
const equal=(a,b)=>String(a)===String(b);
const terrain=t=>NS.TERRAIN?.[t?.terrain]?.label||t?.terrain||'미확인';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeNum=v=>Number.isFinite(Number(v))?Number(v):0;
const settlements=w=>(w?.v34b?.settlements||[]).filter(s=>s.lifecycle==='ACTIVE'&&s.tileIds?.length);
const nationColor=(owner)=>{const pal=NS.NATION_COLORS||['#62a8ff','#74d69c','#ff8b91','#bd9cff'];const id=Number(owner);return pal[(id%pal.length+pal.length)%pal.length]||pal[0];};
function colorFor(t){const base=nationColor(t.ownerId);const v=String(t.settlementId||'').split('').reduce((n,ch)=>(n*33+ch.charCodeAt(0))>>>0,5381);
 // Small stable light/dark change per Settlement; retain the nation's hue.
 if(/^#[0-9a-f]{6}$/i.test(base)){const shift=(v%3-1)*11;const raw=[1,3,5].map(i=>Math.max(22,Math.min(246,parseInt(base.slice(i,i+2),16)+shift)));return '#'+raw.map(n=>n.toString(16).padStart(2,'0')).join('');}
 return base;
}
function boundaryGeometry(w){
 const entries=[],groups=new Map(),map=w.map;
 for(const t of map.tiles){if(t.ownerId==null||t.settlementId==null)continue;
  const sid=String(t.settlementId),nation=String(t.ownerId);let r=groups.get(sid);
  if(!r){r={sid,nation,color:colorFor(t),tiles:[],edges:[],core:null};groups.set(sid,r);}
  r.tiles.push([t.x,t.y]);
  for(const [dx,dy,x1,y1,x2,y2] of [[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){
   const n=map.at(t.x+dx,t.y+dy);
   if(!n||n.ownerId==null||!equal(n.ownerId,t.ownerId)||String(n.settlementId)!==sid)
    r.edges.push([t.x+x1,t.y+y1,t.x+x2,t.y+y2]);
  }
 }
 for(const s of settlements(w)){const r=groups.get(String(s.id));if(r)r.core=Number(s.coreTileId);}
 return [...groups.values()];
}
function geometryFor(w){const c=w.v34c?.counters||{},sig=[w.map?.tiles?.length,c.ownershipChanges,c.merges,c.splits].join(':');
 // All topology mutations in the C engine advance at least one of these counters.
 if(w._v034h1Borders?.signature===sig)return w._v034h1Borders.groups;
 const groups=boundaryGeometry(w);
 Object.defineProperty(w,'_v034h1Borders',{configurable:true,enumerable:false,writable:true,value:{signature:sig,groups}});
 return groups;
}
function invalidate(w){if(w&&Object.prototype.hasOwnProperty.call(w,'_v034h1Borders'))delete w._v034h1Borders;}
function selectedId(ui){const t=ui.world?.map?.get(ui.world.selectedTileId);return t?.ownerId!=null&&t?.settlementId!=null?String(t.settlementId):null;}
function drawBoundaries(ui){const w=ui.world,mode=ui.h1BoundaryMode||'all',geo=ui._mapGeom,c=ui.q?.('worldCanvas');if(!w||!geo||!c||mode==='off')return;
 const selected=selectedId(ui),groups=geometryFor(w),{cell,ox,oy}=geo,ctx=c.getContext('2d');if(!ctx||!cell)return;
 ctx.save();ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);ctx.clip();
 if(mode==='selected'&&selected){
  // Dim the full map OUTSIDE the selected Settlement (including neutral land and water).
  // Even-odd fill leaves the actual member tiles untouched; never clear map pixels.
  const chosen=groups.find(g=>g.sid===selected);
  if(chosen){ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);
   for(const [x,y] of chosen.tiles)ctx.rect(ox+x*cell,oy+y*cell,cell,cell);
   ctx.fillStyle='rgba(8,16,29,.32)';ctx.fill('evenodd');}
 }
 for(const g of groups){const active=mode==='all'||g.sid===selected;
  if(!active)continue;
  ctx.fillStyle=g.color;ctx.globalAlpha=mode==='selected'?.19:.105;
  for(const [x,y] of g.tiles)ctx.fillRect(ox+x*cell,oy+y*cell,cell,cell);
 }
 ctx.globalAlpha=1;
 for(const g of groups){const active=mode==='all'||g.sid===selected;
  if(mode==='selected'&&!active)continue;
  const baseWidth=Math.max(mode==='selected'?2.2:1.6,cell*(mode==='selected'?.105:.075));const width=mode==='all'?baseWidth*.70:baseWidth;
  function trace(){ctx.beginPath();for(const [x1,y1,x2,y2] of g.edges){ctx.moveTo(ox+x1*cell,oy+y1*cell);ctx.lineTo(ox+x2*cell,oy+y2*cell);}}
  ctx.lineJoin='round';ctx.lineCap='square';
  trace();ctx.strokeStyle='rgba(7,17,26,.92)';ctx.lineWidth=mode==='all'?(baseWidth+2.1)*.70:width+2.1;ctx.stroke();
  trace();ctx.strokeStyle=g.color;ctx.lineWidth=width;ctx.stroke();
  if(mode==='selected'&&active&&g.core!=null){const t=w.map.get(g.core);if(t){ctx.beginPath();ctx.arc(ox+(t.x+.5)*cell,oy+(t.y+.5)*cell,Math.max(2.5,cell*.105),0,Math.PI*2);ctx.fillStyle='#fff5cf';ctx.fill();ctx.strokeStyle='#172d40';ctx.lineWidth=1.9;ctx.stroke();}}
 }
 ctx.restore();
}
function installControls(ui){if(typeof document==='undefined')return;const bar=document.querySelector('#view-map .map-toolbar');if(!bar)return;
 document.getElementById('v34cBoundaryToggle')?.remove();
 const layer=ui.q?.('v15LayerSelect');if(layer){layer.querySelector('option[value="lifezone"]')?.remove();if(layer.value==='lifezone'||ui.mapLayer==='lifezone'){ui.mapLayer='base';layer.value='base';}}
 let sel=document.getElementById('h1SettlementBoundary');if(!sel){const label=document.createElement('label');label.className='h1-boundary-setting';label.textContent='정착지 경계 ';sel=document.createElement('select');sel.id='h1SettlementBoundary';sel.setAttribute('aria-label','정착지 경계 표시');sel.innerHTML='<option value="off">끔</option><option value="all">전체</option><option value="selected">선택 강조</option>';label.appendChild(sel);bar.appendChild(label);
  sel.addEventListener('change',()=>{const instance=window.villageObserver;if(!instance)return;instance.h1BoundaryMode=sel.value;instance.renderMap?.();});}
 sel.value=ui.h1BoundaryMode||'all';
 // Filters belong only to the corresponding layer; do not alter their legacy business logic.
 for(const el of bar.querySelectorAll('select')){if(el.id==='h1SettlementBoundary'||el.id==='v15LayerSelect'||el.id==='v32dMapStyle')continue;
  const id=el.id.toLowerCase();const overlay=ui.mapLayer||'base';if(/trade|flow|resource|good|item|partner/.test(id))el.style.display=(overlay.includes('trade')||overlay.includes('logistic')||overlay.includes('resource'))?'':'none';}
}
function updateStats(ui){const w=ui.world,root=ui.q?.('globalStats');if(!root||!w)return;
 const rows=[['인구',w.allPeople?.length||0],['국가',w.activeNations?.length||0],['정착지',settlements(w).length],['영토 타일',w.map.tiles.filter(t=>t.ownerId!=null).length],['국가 국고 합계',`${(w.activeNations||[]).reduce((n,v)=>n+safeNum(v.gold),0).toFixed(0)} G`]];
 const sig=rows.map(x=>x.join(':')).join('|');if(root.dataset.h1Stats===sig)return;root.dataset.h1Stats=sig;
 root.innerHTML=rows.map(([label,val])=>`<div class="stat"><div class="label">${label}</div><div class="value">${val}</div></div>`).join('');
}
function categorizeTile(ui){const root=ui.q?.('tileInspector'),w=ui.world,t=w?.map?.get(w.selectedTileId);if(!root||!t)return;
 const key=String(t.id),before=ui._h1InspectorOpen||{};const current={...before};
 for(const d of root.querySelectorAll('details[data-h1-group]'))current[d.dataset.h1Group]=d.open;
 ui._h1InspectorOpen=current;
 const v=t.ownerId==null?null:w.villages.find(n=>equal(n.id,t.ownerId));const s=t.settlementId==null?null:settlements(w).find(s=>equal(s.id,t.settlementId));
 const pop=v?.tileResidents?.(t.id)?.filter(p=>p.alive).length||0;
 const basic=document.createElement('section');basic.className='h1-tile-summary';
 basic.innerHTML=`<strong>🗺 타일 #${t.id} · (${t.x}, ${t.y}) ${esc(terrain(t))}</strong><div class="h1-tile-chips"><span>🏳️ ${esc(v?.name||'중립지')}</span><span>🏘 ${esc(s?.id||'정착지 없음')}</span><span>👥 ${pop}명</span><span>🏗 ${(t.buildings||[]).length}개 시설</span></div>${s?`<div class="small muted">정착지 전체 ${s.tileIds.length}타일 · 중심 #${s.coreTileId}</div>`:''}`;
 const old=[...root.childNodes];root.replaceChildren(basic);
 if(v){const nav=document.createElement('div');nav.className='h1-map-jump';nav.innerHTML='<button type="button" data-h1-go="settlement">🏘 정착지·타일 보기</button><button type="button" data-h1-go="nation">🏛 국가 개요</button>';
  nav.querySelector('[data-h1-go="settlement"]').onclick=()=>ui.goNation?.(t.ownerId,'settlements',t.id);nav.querySelector('[data-h1-go="nation"]').onclick=()=>ui.goNation?.(t.ownerId,'overview',t.id);root.appendChild(nav);}
 const defs=[['resources','🌿 자연자원·재고·경제'],['housing','🏗 주거·건설·정착지'],['military','⚔ 군사·전투'],['diagnostics','🔬 개발자 진단'],['more','📋 타일 상세 정보']];
 const buckets=Object.fromEntries(defs.map(x=>[x[0],[]]));
 for(const node of old){if(node.nodeType===3&&!node.textContent?.trim())continue;
  if(node.nodeType===1&&node.classList.contains('v034g1-tile-label'))continue;
  if(node.nodeType===1&&node.classList.contains('v16-jump'))continue;
  const cls=node.nodeType===1?String(node.className||'').toLowerCase():'';
  const label=cls+' '+(node.nodeType===1?String(node.textContent||'').slice(0,100):'');
  let group='more';
  if(/diagnos|audit|profiler|v34c-settlement-tile|pathcost|spatial-index|경로비용|성능|회계 검사/.test(label))group='diagnostics';
  else if(/military|formation|battle|combat|전투 기록|병력|전쟁/.test(label))group='military';
  else if(/housing|construction|v34d1-settlement|v034d2|건축공간|주거/.test(label))group='housing';
  else if(/v17-inspector-grid|econom|stock|resource|v17-price-row|v034d3|자연자원/.test(label))group='resources';
  buckets[group].push(node);
 }
 for(const [id,label] of defs){if(!buckets[id].length)continue;const details=document.createElement('details');details.dataset.h1Group=id;details.open=!!current[`${key}:${id}`];details.className='h1-inspector-detail';
  const summary=document.createElement('summary');summary.textContent=label;details.appendChild(summary);
  const content=document.createElement('div');content.className='h1-inspector-detail-body';content.append(...buckets[id]);details.appendChild(content);
  details.addEventListener('toggle',()=>{ui._h1InspectorOpen=ui._h1InspectorOpen||{};ui._h1InspectorOpen[`${key}:${id}`]=details.open;});root.appendChild(details);
 }
}
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}
 // The old H0 integrity notice can be stale during source installation; retain errors only.
 const report=NS.V034G5?.verify?.(window.villageObserver?.world),notice=document.getElementById('g3aRuntimeIntegrity');if(notice&&report){notice.hidden=!!report.ok;notice.style.display=report.ok?'none':'';if(!report.ok){notice.textContent='⚠ H1 무결성 검사 실패';notice.setAttribute('role','alert');}}
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const d=oldSerialize.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(data,...args){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREVIOUS}:data,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const j=oldJSON.apply(this,args);j.version=VERSION;return j;};
function download(name,obj){const url=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const json=localStorage.getItem(KEY);return json?NS.World.from(JSON.parse(json)):oldSave.load?.();},export(w){download(`village-observer-v034H1-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){download(`village-observer-v034H1-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
if(P){const map=P.renderMap,tile=P.renderTile,mapView=P.renderMapView,header=P.renderHeader,set=P.setWorld,bind=P.bind;
 P.renderMap=function(...a){const r=map.apply(this,a);drawBoundaries(this);return r;};
 P.renderTile=function(...a){const r=tile.apply(this,a);categorizeTile(this);return r;};
 if(typeof mapView==='function')P.renderMapView=function(...a){const r=mapView.apply(this,a);updateStats(this);return r;};
 P.renderHeader=function(...a){const r=header.apply(this,a);updateStats(this);installControls(this);refresh();return r;};
 P.setWorld=function(w,...a){const r=set.call(this,w,...a);invalidate(this.world);updateStats(this);return r;};
 P.bind=function(...a){const r=bind.apply(this,a);installControls(this);return r;};
}
NS.V034H1=Object.freeze({version:VERSION,geometry:boundaryGeometry,geometryFor,invalidate,drawBoundaries,settlements,refresh,compatibility:['V0.34H1','V0.34H0','V0.34G5'],verify:()=>NS.V034G5.verify(window.villageObserver?.world)});
if(typeof document!=='undefined'){const css=document.createElement('style');css.textContent=`
.v33g2a-map-card{padding:6px 9px!important;min-height:unset!important}.v33g2a-map-card .small{line-height:1.3}
.h1-boundary-setting{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text,#eaf1ff)}
.h1-boundary-setting select{min-height:35px;min-width:104px;border:1px solid var(--line,#4a5c6c);border-radius:7px;padding:5px 7px;background:#152840;color:#eaf1ff}
#view-map #globalStats{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px}
.h1-tile-summary{border:1px solid rgba(108,175,230,.42);border-radius:11px;background:rgba(80,132,185,.12);padding:11px;line-height:1.7}
.h1-tile-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.h1-tile-chips>span{font-size:12px;border:1px solid rgba(127,161,195,.3);background:rgba(20,40,58,.5);padding:2px 7px;border-radius:7px}
.h1-map-jump{display:flex;flex-wrap:wrap;gap:7px;margin:8px 0 12px}.h1-map-jump button{flex:1;min-width:150px}
.h1-inspector-detail{margin-top:8px;border:1px solid var(--line,#384a5d);border-radius:9px;background:rgba(37,62,86,.17);overflow:hidden}
.h1-inspector-detail>summary{cursor:pointer;padding:10px 12px;font-weight:650;font-size:13px}
.h1-inspector-detail-body{padding:6px 11px 12px;line-height:1.65;overflow-wrap:anywhere}
@media(max-width:650px){.h1-boundary-setting{width:100%;justify-content:space-between}.h1-boundary-setting select{flex:1}}
`;document.head.appendChild(css);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'지도 UI · 정착지 경계 V2',summary:'국가색으로 정착지 완전 외곽선을 그리고 내부 음영 및 선택 강조를 추가합니다. 구형 생활권 레이어를 제거하고 지도 상단 정착지 집계와 타일 상세 화면을 정리합니다.',sections:[['지도',['정착지 완전 외곽선·국가색·약한 내부 음영·선택 강조 모드','실제 Settlement 수·영토 타일 수·국고 합계 구분','구형 생활권 시각화만 제거; 신세계·맵 파일 가져오기 유지']],['타일 상세',['타일 고유 기본 정보, 정착지 소속, 인구·시설 수를 먼저 표시','자원/경제·주거/건설·군사/전투·개발자 진단 접기 구성']],['보존',['시뮬레이션·AI·전쟁·물리재고·Gold·기술 43개·F0/F1·CSV 1683열 보존','H0/G5 저장파일을 이어서 불러오기 지원']]]});
refresh();
try {const ui=window.villageObserver;if(ui){ui.renderHeader?.();if(ui.view==='map')ui.renderMapView?.();}}catch(e){console.warn('H1 initial UI refresh',e);}
})(window.VSim);
