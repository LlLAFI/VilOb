/* V0.35H1C4 — Stable World diagnostic center + read-only staged profiler probes.
 * Do not change simulation state, RNG, snapshot/CSV schema or saved telemetry.
 */
(function(NS){'use strict';
if(!NS?.V035H1C3||!NS?.UI)return;
const VERSION='V0.35H1C4';
const CATALOG=Object.freeze([
 {id:'v035h1c1Panel',group:'performance',name:'H1C1 · 180일 Snapshot 계층 분석'},
 {id:'v035h1b1Panel',group:'performance',name:'H1B1 · 스냅샷 내부 진단'},
 {id:'v035h1bPanel',group:'performance',name:'H1B · 고정 세계 A/B 성능 비교'},
 {id:'v035aProfilePanel',group:'performance',name:'35A · 전체 실행 함수 계측'},
 {id:'v035cPanel',group:'performance',name:'35C · 분기·행정 계측'},
 {id:'v035dPanel',group:'performance',name:'35D · 사회·경제 계측'},
 {id:'v035ePanel',group:'performance',name:'35E · 주택·건설 계측'},
 {id:'v035fPanel',group:'performance',name:'35F · 개발 판단 계측'},
 {id:'v035h1c3Panel',group:'integrity',name:'H1C3 · 점령 재고·사건 무결성'},
 {id:'v035h1c2Panel',group:'integrity',name:'H1C2 · 시뮬레이션 상태와 관측 분리'},
 {id:'v035gConstructionExports',group:'observation',name:'건설·경로·주거 데이터 내보내기'},
 {id:'v035bAdminPanel',group:'archive',name:'35B · 과거 행정 모델 상세 계측'}
]);
const GROUPS=Object.freeze([
 {id:'performance',name:'성능 프로파일러'},
 {id:'integrity',name:'무결성 검사'},
 {id:'observation',name:'관측·저장 분석'},
 {id:'archive',name:'과거 버전 진단'}
]);
let category='performance',selected='v035h1c1Panel',open=false,installCount=0,lastUI=null;
function mk(tag,id,parent,className){const el=document.createElement(tag);if(id)el.id=id;if(className)el.className=className;parent.appendChild(el);return el;}
function createCenter(){
 // The original panels are generated in one another by old renderWorld wrappers.
 // Each original element and its listeners is moved individually, not recreated.
 const anchor=document.getElementById('h3Advanced')||document.getElementById('h3Diagnostics')||document.getElementById('view-world');
 if(!anchor)return null;
 let root=document.getElementById('v035h1c4Center');if(root)return root;
 const checkpoint=document.getElementById('v035h1aPanel');
 // Ensure checkpoint remains discoverable without opening Developer Diagnostics.
 // Move it *before* moving the old parent 35F/35G tools.
 let dock=document.getElementById('v035h1c4CheckpointDock');
 if(!dock){dock=mk('div','v035h1c4CheckpointDock',anchor);dock.style.margin='10px 0';}
 if(checkpoint&&checkpoint.parentNode!==dock)dock.appendChild(checkpoint);
 root=mk('details','v035h1c4Center',anchor,'panel');root.open=open;root.style.marginTop='12px';
 const summary=mk('summary',null,root);summary.style.cursor='pointer';summary.style.fontWeight='700';summary.style.padding='4px 0';summary.textContent='진단 센터 · 성능 / 무결성 / 관측 / 과거 도구';
 const body=mk('div','v035h1c4Body',root);body.style.padding='10px 0';
 const lead=mk('div',null,body,'small muted');lead.textContent='게임 필수 Simulation State · Domain Events는 진단 도구를 접어도 계속 작동합니다. 각 기존 계측 버튼과 JSON 기능을 유지합니다.';
 const state=mk('div','v035h1c4Status',body,'small muted');state.style.margin='8px 0';
 const nav=mk('div','v035h1c4Nav',body);nav.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:8px 0';
 for(const g of GROUPS){const b=mk('button',null,nav);b.type='button';b.dataset.group=g.id;b.textContent=g.name;b.onclick=()=>{category=g.id;const available=CATALOG.filter(t=>t.group===category&&document.getElementById(t.id));selected=available[0]?.id||'';update();};}
 const line=mk('div',null,body);line.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0';
 const label=mk('label',null,line,'small');label.textContent='진단 선택';label.htmlFor='v035h1c4Select';
 const choice=mk('select','v035h1c4Select',line);choice.style.cssText='max-width:100%;min-width:min(270px,100%);padding:6px';choice.onchange=()=>{selected=choice.value;update();};
 const display=mk('div','v035h1c4Active',body);display.style.marginTop='8px';
 const parking=mk('div','v035h1c4Parking',root);parking.hidden=true;parking.style.display='none';
 // Reject simultaneous *manual* profiler starts before legacy button handlers fire.
 // Existing profiling engines continue to own their own start/stop lifecycles.
 root.addEventListener('click',event=>{
  const button=event.target?.closest?.('button');if(!button)return;
  const startIds=new Set(['v035aStart','v035bBegin','v035cStart','v035dStart','v035eStart','v035fStart','v035h1b1SnapStart','v035h1c1Start']);
  if(!startIds.has(button.id)&&!button.dataset?.h1b)return;
  const active=[NS.V035A?.isActive?.()?'35A':null,NS.V035B?.reportDetail?.()?.active?'35B':null,
   NS.V035C?.isActive?.()?'35C':null,NS.V035D?.isActive?.()?'35D':null,
   NS.V035E?.isActive?.()?'35E':null,NS.V035F?.isActive?.()?'35F':null,
   NS.V035H1B?.isActive?.()?'H1B':null,NS.V035H1B1?.snapshotReport?.()?.active?'Snapshot':null].filter(Boolean);
  if(!active.length)return;
  event.preventDefault();event.stopImmediatePropagation();
  const st=root.querySelector('#v035h1c4Status');if(st)st.textContent='중복 계측 방지 · '+active.join(', ')+' 종료 후 시작해 주세요.';
 },true);
 root.addEventListener('toggle',()=>{open=root.open;});
 return root;
}
function relocate(root){
 const parking=root.querySelector('#v035h1c4Parking');if(!parking)return;
 // Move deepest descendants first to break the historical nested chain.
 // All existing IDs, event handlers, timers and live readouts survive relocation.
 for(const t of CATALOG){const panel=document.getElementById(t.id);if(panel&&panel!==root&&panel.parentElement!==parking&&panel.parentElement?.id!=='v035h1c4Active')parking.appendChild(panel);}
}
function status(){
 // Cheap state checks only: detailed profiler report() builds arrays and the
 // H1C1 full report traverses the 360-window food ledger (never on UI ticks).
 const parts=[];
 const snap=NS.V035H1B1?.snapshotReport?.();
 if(snap?.active)parts.push('Snapshot '+snap.days+'/'+snap.plannedDays+'일 실행 중');
 if(NS.V035H1B?.isActive?.())parts.push('H1B 실행 중');
 if(NS.V035A?.isActive?.())parts.push('35A 실행 중');
 return parts.length?'진행 중 · '+parts.join(' · '):'실행 중인 주요 진단 없음 · 도구 선택 후 시작할 수 있습니다';
}
function update(ui){
 if(typeof document==='undefined')return;
 const root=document.getElementById('v035h1c4Center');if(!root)return;
 const parking=root.querySelector('#v035h1c4Parking'),display=root.querySelector('#v035h1c4Active'),select=root.querySelector('#v035h1c4Select');
 if(!parking||!display||!select)return;
 const existing=CATALOG.filter(t=>t.group===category&&document.getElementById(t.id));
 if(!existing.some(t=>t.id===selected))selected=existing[0]?.id||'';
 for(const t of CATALOG){const el=document.getElementById(t.id);if(!el)continue;
  const target=t.id===selected?display:parking;if(el.parentNode!==target)target.appendChild(el);
  if(t.id===selected){el.hidden=false;el.style.display='';}
 }
 const signature=existing.map(t=>t.id).join('|');if(select.dataset.signature!==signature){select.replaceChildren();for(const t of existing){const opt=document.createElement('option');opt.value=t.id;opt.textContent=t.name;select.appendChild(opt);}select.dataset.signature=signature;}
 if(existing.length)select.value=selected;
 for(const b of root.querySelectorAll('[data-group]')){const isActive=b.dataset.group===category;b.setAttribute('aria-pressed',String(isActive));b.style.fontWeight=isActive?'700':'400';b.style.opacity=isActive?'1':'.75';}
 const st=root.querySelector('#v035h1c4Status'),stateText=status();if(st)st.textContent=stateText;
 const summary=root.firstElementChild||root.children?.[0];
 if(summary)summary.textContent=stateText.startsWith('진행 중')?'진단 센터 · 실행 중 ('+stateText.slice(7)+')':'진단 센터 · 성능 / 무결성 / 관측 / 과거 도구';
 const note=root.querySelector('#v035h1c4Empty');if(note)note.remove();
 if(!existing.length){const p=mk('div','v035h1c4Empty',display,'small muted');p.textContent='이 범주의 기존 진단 패널이 현재 화면에 없습니다.';}
}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 lastUI=ui;const root=createCenter();if(!root)return;
 relocate(root);update(ui);installCount++;
}
const priorWorld=NS.UI.prototype.renderWorld;
NS.UI.prototype.renderWorld=function(...args){const out=priorWorld.apply(this,args);install(this);return out;};
// Distinguish runtime release from the deliberately unchanged save schema.
const previousJSON=NS.Telemetry?.prototype?.toJSON;
if(previousJSON)NS.Telemetry.prototype.toJSON=function(w,...args){
 const data=previousJSON.call(this,w,...args);data.version=VERSION;data.runtimeVersion=VERSION;
 if(data.worldSummary)data.worldSummary.runtimeVersion=VERSION;
 return data;
};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-26',title:'Snapshot Hotpath & Diagnostic Center V1',summary:'세계 탭 개발 진단 도구를 성능·무결성·관측·과거 기능으로 통합. H1C3 게임 규칙·RNG·관측 스키마 보존, E/F 스냅샷 상세 경계 확장.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const prevHeader=NS.UI.prototype.renderHeader;if(prevHeader)NS.UI.prototype.renderHeader=function(...args){const value=prevHeader.apply(this,args);badge();return value;};badge();
NS.V035H1C4=Object.freeze({version:VERSION,catalog:CATALOG,groups:GROUPS,install,report:()=>({version:VERSION,selected,group:category,renderCount:installCount,stageNames:['C4_PRE_E4_099','C4_PRE_E4_105','C4_E4_108','C4_E4_TO_F_112','C4_F1_115','C4_F5_119','C4_F5A_122']}),installCount:()=>installCount});
})(window.VSim);
