/* V0.34H3 — World & Statistics UI Consolidation V1.
 * UI/observer-only; consumes existing saved World and cached telemetry.
 * Never calls AI, production, combat, RNG or a snapshot function in render.
 */
(function(NS){'use strict';
const VERSION='V0.34H3',PREV='V0.34H2A',KEY='village-observer-v034h3';
const P=NS.UI?.prototype;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const d=id=>document.getElementById(id);
const fmt=(x,k=0)=>n(x).toLocaleString('ko-KR',{maximumFractionDigits:k});
const boolOwned=t=>t?.ownerId!==null&&t?.ownerId!==undefined;
const cap=(title,subtitle)=>`<div class="section-head"><div><h2>${title}</h2><div class="small muted">${subtitle}</div></div></div>`;
const metric=(title,value)=>`<div class="h3-metric"><span>${esc(title)}</span><strong>${esc(value)}</strong></div>`;
const exists=(t,w)=>t&&w?.map?.get?.(Number(t));

function createPanel(id,title,subtitle){const p=document.createElement('section');p.id=id;p.className='panel h3-panel';p.innerHTML=cap(title,subtitle);return p;}
function detailGroup(id,title,subtitle,open=false){const x=document.createElement('details');x.className='h3-group';x.id=id;x.open=open;const s=document.createElement('summary');s.innerHTML=`${title}<span>${subtitle}</span>`;x.append(s);return x;}
function ensureWorldShell(ui){const root=d('view-world');if(!root)return null;
 let shell=d('h3WorldRoot');if(shell)return shell;
 shell=document.createElement('div');shell.id='h3WorldRoot';shell.className='h3-world-root';root.prepend(shell);
 const overview=createPanel('h3Overview','🌐 세계 현황','세계에 실제 존재하는 주민·영토·정착지 집계');
 overview.insertAdjacentHTML('beforeend','<div id="h3WorldMetrics" class="h3-metrics"></div>');shell.append(overview);
 const compare=createPanel('h3Comparison','🏛 국가 비교','실제 국가·정착지·기술·국고·시장·주민 Gold 분리');
 compare.insertAdjacentHTML('beforeend',`<div class="h3-tools"><label>정렬 <select id="h3CompareSort"><option value="population">인구순</option><option value="territory">영토순</option><option value="tech">기술순</option><option value="money">총 통화량순</option></select></label><label><input id="h3CompareExtinct" type="checkbox"> 멸망 국가 포함</label></div><div id="h3CompareTable" class="h3-table-wrap"></div>`);shell.append(compare);
 d('h3CompareSort').addEventListener('change',()=>refreshWorld(ui,true));d('h3CompareExtinct').addEventListener('change',()=>refreshWorld(ui,true));
 const history=createPanel('h3Chronicle','📜 세계 연대기','보존된 세계 사건 기록 · 시간순 최근 80건');
 history.insertAdjacentHTML('beforeend',`<div class="h3-tools"><label>사건 <select id="h3ChronicleFilter"><option value="all">전체</option><option value="war">전쟁·점령</option><option value="death">멸망·사망</option><option value="tech">기술</option><option value="settlement">정착지·개척</option><option value="economy">교역·경제</option></select></label><span id="h3ChronicleCount" class="small muted"></span></div><div id="h3ChronicleList" class="h3-chronicle"></div>`);shell.append(history);
 d('h3ChronicleFilter').addEventListener('change',()=>refreshChronicle(ui,true));
 const observer=detailGroup('h3Observer','📊 성능·생존 관측','F0/F1 수집 방식 유지 · 세부 패널 기본 접힘');shell.append(observer);
 const storage=detailGroup('h3Storage','💾 저장 · Devlog · Snapshot','기존 파일 버튼·메모 유지',false);shell.append(storage);
 const advanced=detailGroup('h3Advanced','🔧 관찰자 개입·AI·개발자 도구','시뮬레이션 변경 기능 · 기본 접힘',false);shell.append(advanced);
 const diagnostics=detailGroup('h3Diagnostics','🧪 기존 상세 진단','과거 버전 패널 기능 보존',false);advanced.append(diagnostics);
 const audit=document.createElement('div');audit.id='h3AuditCheck';audit.className='panel';
 audit.innerHTML='<h3>정착지·자원 무결성 수동 검사</h3><div class="small muted">필요할 때만 실제 감사 실행 · 렌더링/타이머에서는 실행하지 않습니다.</div><button id="h3AuditRun">현재 세계 감사 실행</button><div id="h3AuditOutput" class="small muted" aria-live="polite">아직 검사하지 않았습니다.</div>';
 diagnostics.append(audit);
 d('h3AuditRun').onclick=()=>runAudit(ui);
 // Transfer legacy DOM rather than clone: all event handlers and object identities survive.
 for(const el of Array.from(root.children)){
  if(el===shell)continue;
  if(el.id==='v034f0PerfPanel'||el.id==='v034f1Panel'||el.id==='v30aPerfPanel'){observer.append(el);continue;}
  if(el.matches('.panel')){
   const title=el.querySelector('h2')?.textContent?.trim()||'';
   if(title.startsWith('세계 연대기')){const old=d('chronicle');if(old){old.setAttribute('aria-hidden','true');old.hidden=true;el.hidden=true;}diagnostics.append(el);}
   else if(title.startsWith('개발 로그')||title==='세이브')storage.append(el);
   else if(title.startsWith('관찰자 개입')||el.id==='aiProfilePanel33G1'||el.id==='g3ValidationPanel')advanced.insertBefore(el,diagnostics);
   else diagnostics.append(el);
  }else diagnostics.append(el);
 }
 return shell;
}
function moveObservationPanels(){const target=d('h3Observer'),advanced=d('h3Diagnostics'),root=d('view-world'),shell=d('h3WorldRoot');if(!target||!root||!shell)return;
 for(const id of ['v034f0PerfPanel','v034f1Panel','v30aPerfPanel']){const el=d(id);if(el&&el.parentElement!==target)target.append(el);}
 // Old E-series UI can lazily insert a panel relative to first .panel descendant
 // after H3 has already grouped the world view. Re-home without cloning it.
 for(const child of [...shell.children,...root.children]){
  if(child===shell||child.id?.startsWith('h3'))continue;
  if(child.nodeType!==1)continue;
  const parent=(child.id==='v034eE01Panel'||child.id==='v30aPerfPanel')? (child.id==='v30aPerfPanel'?target:advanced):advanced;
  if(parent&&child.parentElement!==parent)parent.append(child);
 }
 // Earlier releases emitted literal backslash-n text between script tags. Remove
 // only those non-semantic body text nodes, not actual UI elements or controls.
 if(!document.body.dataset.h3TextCleaned){for(const textNode of [...document.body.childNodes])if(textNode.nodeType===3&&/^(?:\s|\\n)+$/.test(textNode.textContent||'')&&textNode.textContent?.includes('\\n'))textNode.remove();document.body.dataset.h3TextCleaned='1';}
}
function runAudit(ui){const w=ui.world,out=d('h3AuditOutput');if(!out||!w)return;
 try{const c=NS.V034C.inspect(w),d2=NS.V034D2.audit(w),d3=NS.V034D3.audit(w);
  const errors=[...(c.errors||[]).map(e=>'C: '+String(e.code||e)),...(d2.errors||[]).map(e=>'D2: '+String(e)),...(d3.errors||[]).map(e=>'D3: '+String(e))],warnings=[...(d3.warnings||[])];
  ui._h3LastAudit={world:w,errors,warnings,when:w.timestamp?.()||''};
  out.innerHTML=`<div>검사 시점 ${esc(ui._h3LastAudit.when)} · <strong>${errors.length?'오류 '+errors.length+'건':'무결성 오류 0건'}</strong> · 주의 ${warnings.length}건</div>${errors.slice(0,12).map(e=>`<div class="h3-audit-err">${esc(e)}</div>`).join('')}${warnings.slice(0,12).map(e=>`<div class="h3-audit-warn">${esc(e)}</div>`).join('')}${warnings.length>12?`<div>그 외 ${warnings.length-12}건</div>`:''}`;
  refreshIntegrity(ui);
 }catch(e){out.textContent='수동 감사 실행 실패: '+String(e?.message||e);}
}
function refreshChronicle(ui,force=false){if(ui.view!=='world'||!d('h3ChronicleList'))return;
 const w=ui.world,events=w?.events||[],filter=d('h3ChronicleFilter')?.value||'all';
 const last=events[events.length-1],sig=`${events.length}:${last?.time}:${last?.text}:${filter}`;
 if(!force&&ui._h3ChronicleSig===sig)return;ui._h3ChronicleSig=sig;
 const matches=e=>{if(filter==='all')return true;const str=`${e?.type||''} ${e?.text||''}`;
  return (filter==='war'&&/전쟁|점령|평화|선전|WAR|BATTLE|OCCUP/i.test(str))||(filter==='death'&&/멸망|사망|사망자|기아|DEATH|EXTINCT/i.test(str))||(filter==='tech'&&/기술|연구|TECH/i.test(str))||(filter==='settlement'&&/정착|개척|거점|건설|SETTLEMENT|FRONTIER/i.test(str))||(filter==='economy'&&/경제|교역|Gold|시장|TRADE|GOLD/i.test(str));};
 const rows=events.filter(matches),slice=rows.slice(-80).reverse();
 d('h3ChronicleCount').textContent=`보존 기록 중 ${rows.length}건 · 최근 ${slice.length}건 표시`;
 d('h3ChronicleList').innerHTML=slice.map(e=>`<div class="h3-history-item"><span>${esc(e.time||'')}</span>${esc(e.text||e.type||'')}</div>`).join('')||'<p class="small muted">해당 유형으로 보존된 사건이 없습니다. 자세한 장기 기록은 Devlog JSON을 확인하세요.</p>';
}
function refreshWorld(ui,force=false){if(ui.view!=='world'||!ui.world||!d('h3WorldRoot'))return;
 const w=ui.world,stamp=`${w.year}:${w.quarter}:${w.day}:${w.activeVillages?.length}:${w.telemetry?.snapshots?.length}`;
 if(!force&&ui._h3WorldStamp===stamp){refreshChronicle(ui);return;}ui._h3WorldStamp=stamp;
 const active=w.activeVillages||[],territory=w.map?.tiles?.filter(boolOwned).length||0;
 const groups=active.reduce((a,v)=>a+(NS.V034G1A?.groupsForUI?.(v,w)?.length||0),0);
 const numPeople=active.reduce((s,v)=>s+(v.residents||[]).filter(p=>p.alive!==false).length,0);
 const wars=w.v33War?.wars||[];
 d('h3WorldMetrics').innerHTML=metric('세계 인구',`${fmt(numPeople)}명`)+metric('생존 국가',`${active.length}개`)+metric('정착지',`${fmt(groups)}개`)+metric('소유 영토',`${territory}/${n(w.map?.tiles?.filter(t=>NS.TERRAIN?.[t.terrain]?.passable).length)||'—'}타일`)+metric('전쟁',`${wars.filter(x=>x.status==='ACTIVE').length}건 진행 · ${wars.length}건 누적`);
 const key=d('h3CompareSort')?.value||'population',include=d('h3CompareExtinct')?.checked||false;
 const nationRows=(include?w.villages:active).map(v=>{const people=(v.residents||[]).filter(p=>p.alive!==false),territory=v.territory?.size||0,tech=v.technologies?.size||0,gold=n(v.gold),market=[...(v.territory||[])].reduce((a,id)=>a+n(w.map.get(id)?.v29Economy?.marketGold),0),wallet=people.reduce((a,p)=>a+n(p.gold29),0);return{v,population:people.length,territory,tech,money:gold+market+wallet,gold,market,wallet};}).sort((a,b)=>b[key]-a[key]||a.v.id-b.v.id);
 d('h3CompareTable').innerHTML=`<table class="h3-table"><thead><tr><th>국가</th><th>인구</th><th>영토</th><th>기술</th><th>국고</th><th>시장</th><th>지갑</th><th>전체 Gold</th></tr></thead><tbody>${nationRows.map(r=>`<tr><td><button class="h3-nation-link" data-h3-nation="${Number(r.v.id)}"><span class="h4a-nation-bar" aria-hidden="true" style="background-color:${esc(String(NS.NATION_COLORS?.[Number(r.v.id)]||'#8293a7'))}"></span>${esc(r.v.name)}${r.v.status!=='active'?' · 멸망':''}</button></td><td>${fmt(r.population)}</td><td>${fmt(r.territory)}</td><td>${r.tech}/${NS.TECH_ORDER.length}</td><td>${fmt(r.gold,1)}</td><td>${fmt(r.market,1)}</td><td>${fmt(r.wallet,1)}</td><td>${fmt(r.money,1)}</td></tr>`).join('')}</tbody></table>`;
 d('h3CompareTable').querySelectorAll('[data-h3-nation]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.h3Nation);if(!w.villages?.some(v=>Number(v.id)===id&&v.status==='active'))return;ui.goNation?.(id,'overview');});
 refreshChronicle(ui);
}
function siteRows(w,war){const out=[],seen=new Set(),add=(id,kind)=>{id=Number(id);if(!Number.isInteger(id)||seen.has(id)||!exists(id,w))return;seen.add(id);out.push({id,kind});};
 for(const e of war.engagements33C||[])if(e.tileId!=null)add(e.tileId,'기록된 교전');
 for(const id of war.warGoal33F?.targetTileIds||[])add(id,'전쟁목표');
 for(const t of war.peaceSettlement33F?.cededTiles||[])add(t.tileId??t.id??t,'평화협정 양도');
 return out.slice(0,16);
}
function jumpToTile(ui,id){const t=ui.world?.map?.get?.(Number(id));if(!t)return;
 ui.world.selectedTileId=t.id;if(boolOwned(t))ui.world.selectedVillageId=t.ownerId;
 ui.view='map';ui.renderViews();const canvas=d('worldCanvas'),map=ui.world.map;
 if(canvas){const base=Math.min(canvas.width/map.width,canvas.height/map.height),z=Math.max(n(ui.zoom)||1,1.5),cell=base*z;ui.zoom=z;ui.offsetX=canvas.width/2-(t.x+.5)*cell-(canvas.width-map.width*cell)/2;ui.offsetY=canvas.height/2-(t.y+.5)*cell-(canvas.height-map.height*cell)/2;ui.renderMapView?.();}
 d('view-map')?.scrollIntoView?.({block:'start'});
}
function decorateWars(ui){if(ui.view!=='stats')return;const panel=d('v33aWarHistoryPanel');if(!panel)return;
 d('v33cEngagementHistoryPanel')?.remove();
 const list=[...(ui.world?.v33War?.wars||[])].sort((a,b)=>n(b.startCal)-n(a.startCal));
 const cards=[...panel.querySelectorAll('.v33a-history > .v33a-warcard')];
 cards.forEach((card,i)=>{const war=list[i];if(!war)return;let old=card.querySelector('.h3-sites');const sig=JSON.stringify([war.id,(war.engagements33C||[]).length,(war.warGoal33F?.targetTileIds||[]).join(','),war.peaceSettlement33F?.cededTiles?.length]);if(old?.dataset.h3Sig===sig)return;
 old?.remove();const box=document.createElement('div');box.className='h3-sites';box.dataset.h3Sig=sig;
 const places=siteRows(ui.world,war);box.innerHTML=`<div class="small muted">📍 실제 기록된 위치 · I3 세부 라운드는 종료 후 360일간만 보존됩니다.</div><div class="h3-site-links">${places.map(p=>`<button data-h3-war-tile="${p.id}">#${p.id} · ${esc(p.kind)} <span>지도에서 보기 ↗</span></button>`).join('')||'<span class="small muted">이 전쟁에 보존된 위치 정보가 없습니다.</span>'}</div>`;
 card.append(box);box.querySelectorAll('[data-h3-war-tile]').forEach(b=>b.onclick=()=>jumpToTile(ui,Number(b.dataset.h3WarTile)));
 });
}
// Use only already-collected snapshot error counters. No expensive per-header audits.
function refreshIntegrity(ui){const header=document.querySelector('.topbar'),w=ui.world;if(!header||!w)return;
 let b=d('h3IntegrityAlert');if(!b){b=document.createElement('button');b.id='h3IntegrityAlert';b.type='button';b.hidden=true;b.onclick=()=>{ui.view='world';ui.renderViews();d('h3Diagnostics').open=true;d('h3Advanced').open=true;d('h3Diagnostics').scrollIntoView?.({block:'nearest'});};header.append(b);}
 const latest=w.telemetry?.snapshots?.at(-1)?.global||{};
 const names=['settlementRegistryErrors34B','settlementErrors34C','global.equipmentConservationErrors33I1','global.equipmentConservationErrors33I1A1'];let bad=[];
 for(const k of names){if(Object.prototype.hasOwnProperty.call(latest,k)&&n(latest[k])>0)bad.push(`${k}: ${n(latest[k])}`);}
 const manual=ui._h3LastAudit?.world===w?ui._h3LastAudit:null;
 if(manual?.errors?.length){bad.push('수동 검사: '+manual.errors.length+'건');}
 const caution=manual?.warnings?.length||0;
 if(bad.length){b.hidden=false;b.dataset.level='error';b.textContent=`⚠ 무결성 오류 ${bad.length}종`;b.title=bad.join(' · ')+' · 마지막 Snapshot/수동 검사 기준';b.setAttribute('aria-label',b.title);}
 else if(caution){b.hidden=false;b.dataset.level='warning';b.textContent=`⚠ 저장 경고 ${caution}건`;b.title='수동 검사 기준: '+manual.warnings.slice(0,5).join(' · ');b.setAttribute('aria-label',b.title);}
 else{b.hidden=true;b.removeAttribute('title');}
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const out=oldSerialize.apply(this,a);out.version=VERSION;return out;};
NS.World.from=function(input,...a){return oldFrom.call(this,input?.version===VERSION?{...input,version:PREV}:input,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const out=oldJSON.apply(this,a);out.version=VERSION;out.worldSummary.v034h3Revision='world-statistics-ui-consolidation-v1';return out;};
function download(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},export(w){download(`village-observer-v034H3-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){download(`village-observer-v034H3-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
function refreshVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=d('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
if(P){const prevViews=P.renderViews,prevWorld=P.renderWorld,prevHeader=P.renderHeader;
 P.renderViews=function(...a){const r=prevViews.apply(this,a);ensureWorldShell(this);moveObservationPanels();if(this.view==='world')refreshWorld(this);if(this.view==='stats')decorateWars(this);return r;};
 P.renderWorld=function(...a){const r=prevWorld.apply(this,a);ensureWorldShell(this);if(this.view==='world')refreshWorld(this);return r;};
 P.renderHeader=function(...a){const r=prevHeader.apply(this,a);refreshVersion();moveObservationPanels();refreshIntegrity(this);return r;};}
NS.V034H3=Object.freeze({version:VERSION,readOnly:true,refreshWorld,decorateWars,jumpToTile,refreshIntegrity});
if(typeof document!=='undefined'){
 const css=document.createElement('style');css.textContent=`
.h3-world-root{display:grid;gap:12px}.h3-panel{margin:0}.h3-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:9px}.h3-metric{display:grid;gap:4px;padding:12px;border-radius:9px;border:1px solid var(--line,#46617a);background:rgba(88,135,176,.10)}.h3-metric span{font-size:12px;color:var(--muted,#a8bacc)}.h3-metric strong{font-size:18px}.h3-tools{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:9px 0}.h3-tools label{display:flex;align-items:center;gap:6px;font-size:12px}.h3-tools select{min-height:34px;background:#14273b;color:#eef6ff;border:1px solid var(--line,#42566d);border-radius:7px}.h3-table-wrap{max-width:100%;overflow-x:auto}.h3-table{border-collapse:collapse;width:100%;min-width:680px;font-size:12px}.h3-table th,.h3-table td{padding:9px 7px;border-bottom:1px solid var(--line,#40546b);text-align:right;white-space:nowrap}.h3-table td:first-child,.h3-table th:first-child{text-align:left}.h3-nation-link{background:none;border:0;color:#9ecfff;cursor:pointer;text-decoration:underline;padding:2px}.h3-chronicle{max-height:440px;overflow-y:auto}.h3-history-item{padding:8px 4px;border-bottom:1px solid var(--line,#364c63);font-size:12px}.h3-history-item span{display:inline-block;min-width:95px;margin-right:6px;color:var(--muted,#9cb4cc)}.h3-group{border:1px solid var(--line,#41526b);border-radius:10px;overflow:hidden}.h3-group>summary{padding:15px;cursor:pointer;font-weight:700;background:rgba(87,128,166,.15)}.h3-group>summary span{display:block;font-size:11px;font-weight:400;color:var(--muted,#9ab1c7);margin-top:4px}.h3-group>.panel,.h3-group>.h3-group{margin:12px}.h3-group:not([open]){padding-bottom:0}.h3-site-links{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.h3-site-links button{font-size:11px;padding:5px 8px}.h3-site-links span{font-size:10px;color:var(--muted,#9ab1c7)}.h3-sites{padding-top:8px;margin-top:8px;border-top:1px solid var(--line,#314c63)}#h3IntegrityAlert{color:#ffe0bb;background:#693d20;border:1px solid #b87f3d;padding:6px 10px;border-radius:8px;margin-left:8px}#h3IntegrityAlert[data-level=error]{background:#652d34;border-color:#b85963;color:#ffe5e5}.h3-audit-err{color:#ffabae}.h3-audit-warn{color:#ffdda0;margin-top:3px}#h3AuditOutput{margin-top:8px}#h3IntegrityAlert[hidden]{display:none!important}
@media(max-width:650px){.h3-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.h3-metric strong{font-size:15px}.h3-history-item span{display:block;margin-bottom:2px}.h3-group>.panel,.h3-group>.h3-group{margin:7px}}
`;document.head.appendChild(css);
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-19',title:'세계·통계 UI 통합 V1',summary:'세계 현황·국가별 Gold 분리 비교·연대기 필터, 실제 전쟁/전장 지도 연결, F0/F1·개발자 도구 배치 통합. 시뮬레이션·RNG·무결성 계산 불변.',sections:[['세계',['현재 인구·정착지·영토·전쟁 집계 표시','국가별 인구·영토·기술·국고/시장/지갑 Gold 분리 비교','보존된 연대기의 사건 분류·최근 80개만 표시']],['전쟁 기록',['구형 C 지속 교전 별도 패널 제거, E/F 최신 공식 전쟁기록 보존','실제로 보존된 교전·목표·할양 타일을 지도로 선택','I3 세부 라운드 360일 보존 범위를 명시']],['성능·도구',['F0/F1의 실제 DOM을 세계 탭으로 이동하고 기존 이벤트·수집 경로 보존','저장/CSV/Devlog·AI 프로필·관찰자 개입 기존 버튼 보존','기존 Snapshot 오류 계측값을 이용한 상단 경고만 표시']],['보존',['H2A 세이브 복구·H1 지도·H2 국가 UI·43개 기술 유지','Gold·자원·Person·군사·AI·RNG·CSV 1683열 불변','석재 저장량 초과는 원인 미확정이므로 이번 범위 제외']]]});
try{refreshVersion();const ui=window.villageObserver;if(ui){ensureWorldShell(ui);moveObservationPanels();ui.view==='world'&&refreshWorld(ui,true);ui.view==='stats'&&decorateWars(ui);}}catch(e){console.warn('H3 initial UI mounting',e);}
})(window.VSim);
