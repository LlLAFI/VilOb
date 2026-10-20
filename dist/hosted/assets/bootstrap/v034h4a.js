/* Village Observer V0.34H4A — storage provenance diagnostics + map/stats polish.
 * All state tracking is read-only and non-serialized. No resource/AI/RNG mutations.
 * Historical causes before this release cannot be reconstructed from current stock.
 */
(function(NS){'use strict';
const VERSION='V0.34H4A',PREV='V0.34H4',KEY='village-observer-v034h4a';
const P=NS.UI?.prototype,track=new WeakMap();
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>n(x).toLocaleString('ko-KR',{maximumFractionDigits:2});
const color=v=>String((NS.NATION_COLORS||[])[Number(v?.id)]||'#8293a7');
const canonicalDay=w=>Number(w?.calendarOrdinalDay?.()??((Number(w?.year||1)-1)*360+(Number(w?.quarter||w?.season||1)-1)*90+Number(w?.day||1)));
function topology(w){const c=w?.v34c?.counters||{};return [n(c.ownershipChanges),n(c.merges),n(c.splits)].join('/');}
function currentRows(w){return NS.V034H4.storageDiagnosis(w);}
function watch(w,reason='BASELINE',force=false){if(!w)return null;let z=track.get(w);if(!z){z={records:[],last:new Map(),topology:topology(w),lastPeriod:-Infinity};track.set(w,z);force=true;reason='PREEXISTING_AT_FIRST_OBSERVATION';}
 const day=canonicalDay(w),sig=topology(w),changed=sig!==z.topology,period=day-z.lastPeriod>=30;
 if(!force&&!changed&&!period)return z;
 const rows=currentRows(w),now=new Map(rows.map(r=>[String(r.settlementId),r]));
 for(const r of rows){const previous=z.last.get(String(r.settlementId));if(!previous||r.excess>previous.excess+1e-5||r.excess<previous.excess-1e-5||r.currentCap!==previous.currentCap||r.stock!==previous.stock){
  const type=!previous?(reason==='PREEXISTING_AT_FIRST_OBSERVATION'?'PREEXISTING_AT_FIRST_OBSERVATION':'NEWLY_OBSERVED_OVERFLOW'):r.excess>previous.excess+1e-5?'OBSERVED_EXCESS_INCREASE':r.excess<previous.excess-1e-5?'OBSERVED_EXCESS_DECREASE':'OBSERVED_STOCK_OR_CAP_CHANGE';
  z.records.push({day,simTime:w.timestamp?.()||'',type,trigger:reason==='BASELINE'&&changed?'SETTLEMENT_TOPOLOGY_CHANGED':reason==='BASELINE'&&period?'PERIODIC_30D_OBSERVATION':reason,settlementId:r.settlementId,nationId:r.nationId,tileIds:r.tileIds,stock:r.stock,currentCap:r.currentCap,excess:r.excess,classification:r.classification,previous:previous?{stock:previous.stock,currentCap:previous.currentCap,excess:previous.excess}:null});
 }}
 for(const [id,old] of z.last)if(!now.has(id))z.records.push({day,type:'OVERFLOW_NO_LONGER_PRESENT',settlementId:id,previousExcess:old.excess,trigger:reason});
 if(z.records.length>96)z.records.splice(0,z.records.length-96);
 z.last=now;z.topology=sig;z.lastPeriod=day;return z;
}
// Only inspect the economy on a real topology change, a 30-calendar-day cadence,
// or an explicit user request/export. Do not scan each Person or per UI render.
const advance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){watch(this);const out=advance.apply(this,args);watch(this);return out;};
function relevantEvents(w,tiles,limit=70){const set=new Set(tiles.map(Number));const ev=w?.telemetry?.entries||[];const out=[];for(let i=ev.length-1;i>=0&&out.length<limit;i--){const e=ev[i],p=e.payload||{};if(!/SETTLEMENT|OUTPOST|FRONTIER|TILE_CEDED|TERRITORY|BUILDING|OWNERSHIP|CONQUEST|PEACE_SETTLEMENT/i.test(String(e.type||'')))continue;const ids=[p.tileId,p.fromTileId,p.toTileId,p.targetTileId,...(p.tileIds||[]),...(p.cededTileIds||[])].filter(x=>x!=null).map(Number);if(!ids.some(id=>set.has(id)))continue;out.push({type:e.type,simTime:e.simTime||e.calendarDate24||'',tileIds:ids.filter(x=>set.has(x)),settlementId:p.settlementId??null,building:p.building??p.type??null});}return out.reverse();}
function diagnosis(w){
 watch(w,'MANUAL_DIAGNOSTIC',true);
 const rows=currentRows(w);
 const tiles=[...new Set(rows.flatMap(r=>r.tileIds||[]))].map(Number);
 const byNation=new Map((w.villages||[]).map(v=>[Number(v.id),v]));
 return {
  format:'vilob-h4a-storage-diagnostic-v1',version:VERSION,simTime:w.timestamp?.()||'',
  note:'Causes before H4A are unknown; the classification is not proof of how resources arrived. Read-only physical stock.',
  world:{mapSize:[w.map.width,w.map.height],overflowSettlements:rows.length,overflowStone:rows.reduce((s,r)=>s+r.excess,0)},
  settlements:rows.map(r=>{
   const v=byNation.get(Number(r.nationId));
   return {...r,nationName:v?.name||null,tiles:(r.tileIds||[]).map(raw=>{
    const t=w.map.get(Number(raw));
    return {
     id:Number(raw),ownerId:t?.ownerId,settlementId:t?.settlementId,terrain:t?.terrain,
     stocks:Object.fromEntries(Object.entries(t?.stocks||{}).map(([k,val])=>[k,n(val)])),
     stonePhysicalCap:v?NS.V034D3.physicalCap(v,Number(raw),'stone'):null,
     buildings:(t?.buildings||[]).map((b,i)=>({type:b,condition:n(t?.buildingCondition?.[i]),stoneStorage:n(NS.BUILDINGS?.[b]?.storage?.stone)}))
    };
   })};
  }),
  observations:[...(track.get(w)?.records||[])],relatedEvents:relevantEvents(w,tiles)
 };
}

function saveFile(filename,data){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function ensureAudit(ui){if(typeof document==='undefined')return;const run=document.getElementById('h3AuditRun'),out=document.getElementById('h3AuditOutput'),host=document.getElementById('h3AuditCheck');if(!run||!out||!host)return;
 if(!run.dataset.h4aBound){run.dataset.h4aBound='1';run.onclick=()=>{try{const w=ui.world,c=NS.V034C.inspect(w),d2=NS.V034D2.audit(w),h4=NS.V034H4.audit(w),errors=[...(c.errors||[]).map(e=>'C: '+String(e.code||e)),...(d2.errors||[]).map(e=>'D2: '+e),...(h4.errors||[]).map(e=>'D3: '+e)],warnings=[...(h4.warnings||[])];ui._h3LastAudit={world:w,errors,warnings,when:w.timestamp?.()||''};out.innerHTML=`<div>검사 시점 ${esc(ui._h3LastAudit.when)} · <strong>${errors.length?'오류 '+errors.length+'건':'무결성 오류 0건'}</strong> · 주의 ${warnings.length}건</div>`+errors.slice(0,12).map(e=>`<div class="h3-audit-err">${esc(e)}</div>`).join('')+h4.storage.map(r=>`<div class="h3-audit-warn">${esc(r.settlementId)} · ${esc(r.classification)} · 석재 ${fmt(r.stock)} / 용량 ${fmt(r.currentCap)} · 초과 ${fmt(r.excess)}</div>`).join('')+warnings.filter(x=>!String(x).startsWith('STORAGE_OVERFLOW:')).slice(0,12).map(e=>`<div class="h3-audit-warn">${esc(e)}</div>`).join('');watch(w,'MANUAL_AUDIT',true);NS.V034H3?.refreshIntegrity?.(ui);}catch(e){out.textContent='검사 실패: '+String(e?.message||e);}};}
 if(!document.getElementById('h4aExportStorage')){const btn=document.createElement('button');btn.id='h4aExportStorage';btn.type='button';btn.textContent='석재 저장 경량 진단 JSON 내보내기';btn.style.marginLeft='8px';btn.onclick=()=>{const w=ui.world;saveFile(`vilob-h4a-storage-${w.year}y.json`,diagnosis(w));};run.insertAdjacentElement('afterend',btn);}
}
function strokeNationalBorders(ui){if((ui.h1BoundaryMode||'all')!=='all')return;const w=ui.world,g=ui._mapGeom,canvas=ui.q?.('worldCanvas');if(!w||!g||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx||!g.cell)return;
 const {cell,ox,oy}=g;ctx.save();ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);ctx.clip();ctx.beginPath();let edges=0;
 for(const t of w.map.tiles){if(t.ownerId==null)continue;for(const [dx,dy] of [[1,0],[0,1]]){const other=w.map.at(t.x+dx,t.y+dy);if(!other||other.ownerId==null||String(t.ownerId)===String(other.ownerId))continue;
  const x=ox+(t.x+(dx?1:0))*cell,y=oy+(t.y+(dy?1:0))*cell;ctx.moveTo(x,y);ctx.lineTo(x+(dy?cell:0),y+(dx?cell:0));edges++;}}
 if(edges){ctx.strokeStyle='#000000';ctx.lineWidth=Math.max(2.3,cell*.115)*.70;ctx.lineJoin='round';ctx.lineCap='square';ctx.globalAlpha=1;ctx.stroke();}ctx.restore();}
function statsDecorate(ui){if(ui.view!=='stats'||!ui.world)return;const sel=document.getElementById('statsNation');if(!sel)return;
 let bar=document.getElementById('h4aSelectedNationBar');if(!bar){bar=document.createElement('span');bar.id='h4aSelectedNationBar';bar.className='h4a-nation-bar';bar.setAttribute('aria-hidden','true');sel.insertAdjacentElement('beforebegin',bar);}bar.style.backgroundColor=color(ui.world.villages?.find(v=>Number(v.id)===Number(sel.value)));
 let legend=document.getElementById('h4aNationLegend');if(!legend){legend=document.createElement('div');legend.id='h4aNationLegend';legend.className='h4a-nation-legend';legend.setAttribute('aria-label','국가별 색상과 통계 선택');const target=sel.closest('.panel')||sel.parentElement;target?.appendChild(legend);}
 const sig=(ui.world.villages||[]).map(v=>[v.id,v.name,color(v)].join(':')).join('|');if(legend.dataset.signature!==sig){legend.dataset.signature=sig;legend.replaceChildren();for(const v of ui.world.villages||[]){const b=document.createElement('button');b.type='button';b.className='h4a-nation-choice';b.dataset.nation=String(v.id);const mark=document.createElement('span');mark.className='h4a-nation-bar';mark.style.backgroundColor=color(v);mark.setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=v.name;b.append(mark,label);b.onclick=()=>{sel.value=String(v.id);sel.dispatchEvent(new Event('change',{bubbles:true}));};legend.appendChild(b);}}
 const visible=ui.statsScope!=='world';bar.hidden=!visible;legend.hidden=!visible;for(const b of legend.querySelectorAll('[data-nation]'))b.setAttribute('aria-pressed',String(b.dataset.nation===sel.value));}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const data=oldSerialize.apply(this,a);data.version=VERSION;return data;};
NS.World.from=function(data,...a){const w=oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...a);watch(w,'LOADED_WORLD',true);return w;};
NS.Telemetry.prototype.toJSON=function(...a){const data=oldJSON.apply(this,a);data.version=VERSION;if(data.worldSummary){data.worldSummary.v034h4aRevision='storage-provenance-lightweight-export-and-national-boundary-stats-polish';if(a[0]){const z=watch(a[0],'DEVLOG_EXPORT',true);data.worldSummary.v034h4aStorageObservation={count:z?.records?.length||0,recent:z?.records?.slice(-16)||[]};}}return data;};
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},export(w){saveFile(`village-observer-v034H4A-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){saveFile(`village-observer-v034H4A-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
if(P){const prevMap=P.renderMap,prevStats=P.renderStats,prevViews=P.renderViews,prevWorld=P.renderWorld,prevHeader=P.renderHeader;
 P.renderMap=function(...a){const out=prevMap.apply(this,a);strokeNationalBorders(this);return out;};
 P.renderStats=function(...a){const out=prevStats.apply(this,a);statsDecorate(this);return out;};
 P.renderViews=function(...a){const out=prevViews.apply(this,a);ensureAudit(this);statsDecorate(this);return out;};
 P.renderWorld=function(...a){const out=prevWorld.apply(this,a);ensureAudit(this);return out;};
 P.renderHeader=function(...a){const out=prevHeader.apply(this,a);refresh();return out;};
}
NS.V034H4A=Object.freeze({version:VERSION,diagnosis,watch,strokeNationalBorders,statsDecorate});
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent=`.h4a-nation-legend{display:flex;flex-wrap:wrap;gap:5px 9px;margin:9px 0}.h4a-nation-choice{display:inline-flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line,#41526b);border-radius:6px;padding:5px 8px;background:transparent;color:inherit;cursor:pointer}.h4a-nation-choice[aria-pressed=true]{border-color:#98c8ff;background:rgba(74,144,220,.15)}.h4a-nation-bar{display:inline-block;flex:none;width:4px;height:16px;border-radius:1px;margin-right:4px;vertical-align:middle}.h4a-nation-legend[hidden],.h4a-nation-bar[hidden]{display:none!important}@media(max-width:650px){.h4a-nation-choice{font-size:11px;padding:5px 7px}}`;document.head.appendChild(style);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'석재 저장 원인 추적·지도 국경·통계 색상',summary:'기존 석재 재고 보존, 저장 초과 경량 진단 JSON, 원인 분류 포함 수동 감사, 국가 간 검은 경계 및 통계 색상 막대',sections:[['저장 무결성',['용량 초과 재고는 삭제·강제 이전하지 않습니다.','이미 발생한 초과는 H4A 최초 관측 이전 원인 확정 불가로 표시합니다.','정착지 소유권·병합·분할 변화와 30일 관측에 의한 초과 변동 추적, 경량 JSON으로 타일 실물 재고·건물·관련 사건 추출합니다.']],['지도',['정착지 경계 전체 모드에서 다른 국가 간 경계는 정착지 테두리 위에 검은 실선으로 표시합니다.','선택 강조·기타 지도 모드는 변경하지 않습니다.']],['통계',['국가명 왼쪽의 세로 국가색 막대와 국가 선택 보조 목록을 제공합니다.','기존 선택 드롭다운·필터·스크롤은 보존하고 사용자 정의 국가색을 반영합니다.']],['검증',['H4 대비 시뮬레이션 RNG 및 세계 상태를 보존합니다.','석재 원인 확정은 실제 이전 시점의 자료가 없는 경우 유보합니다.']]]});
try{refresh();const ui=window.villageObserver;if(ui){ensureAudit(ui);statsDecorate(ui);}}catch(e){console.warn('H4A init',e);}
})(window.VSim);
