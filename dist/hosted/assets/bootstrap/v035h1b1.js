/* V0.35H1B1 — exact-signature checkpoint reconciliation and opt-in snapshot diagnostics.
 * Strictly repair only direct, serialized fingerprint fields; never fabricate people,
 * territories, or entities. No gameplay calls, no RNG, and no automatic snapshot writes.
 */
(function(NS){'use strict';
if(!NS?.V035H1A||!NS?.V035H1B)return;
const VERSION='V0.35H1B1', fp=NS.V035H1A.fingerprint;
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const clone=x=>JSON.parse(JSON.stringify(x));
const EQUAL=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const scalarTile=['ownerId','v33OccupierId','terrain','road','resources','buildings'];
const scalarNation=['status','coreTileId','gold'];
const scalarPerson=['alive','age','health','hunger','happiness','homeTileId','workTileId','job','assignment','gold29','militaryStatus32A'];
let last=null, snapshotActive=null, snapshotScope=null, completedSnapshot=null;
// Read-only lookups are reused only within one snapshot invocation. Never use across days.
function lookupVillage(w,id){if(!snapshotScope||snapshotScope.world!==w)return (w.villages||[]).find(x=>Number(x.id)===Number(id));
 const scope=snapshotScope;if(scope.rows!==w.villages||scope.length!==w.villages.length){scope.rows=w.villages;scope.length=w.villages.length;scope.byId=new Map();for(const v of w.villages){const k=Number(v.id);if(!scope.byId.has(k))scope.byId.set(k,v);}}
 return scope.byId.get(Number(id))||null;}
function brief(x){let s;try{s=JSON.stringify(x)}catch{s=String(x)}return s?.length>180?s.slice(0,180)+'…':s??'[undefined]';}
function prepare(raw,restored,expected){
 const diag={format:'vilob-v035h1b1-checkpoint-diagnostic-v1',version:VERSION,date:[raw.year,raw.season,raw.day],originalSignature:expected,serializedSignature:fp(raw),restoredSignature:fp(restored),result:'UNKNOWN',differences:[],differenceCount:0,repairCount:0,missingEntities:0};
 const diff=(path,a,b)=>{diag.differenceCount++;if(diag.differences.length<48)diag.differences.push({path,serialized:brief(a),restored:brief(b)});};
 const mapBy=(arr)=>new Map((arr||[]).map(x=>[String(x.id),x]));
 const tileMap=mapBy(restored.map?.tiles),nationMap=mapBy(restored.villages);
 for(const a of raw.map?.tiles||[]){const b=tileMap.get(String(a.id));if(!b){diag.missingEntities++;diff('map.tiles['+a.id+']','PRESENT','MISSING');continue;}
  for(const k of scalarTile)if(!EQUAL(a[k],b[k]))diff('map.tiles['+a.id+'].'+k,a[k],b[k]);
 }
 for(const a of raw.villages||[]){const b=nationMap.get(String(a.id));if(!b){diag.missingEntities++;diff('villages['+a.id+']','PRESENT','MISSING');continue;}
  for(const k of scalarNation)if(!EQUAL(a[k],b[k]))diff('villages['+a.id+'].'+k,a[k],b[k]);
  const ta=[...(a.territory||[])].sort((x,y)=>x-y),tb=[...(b.territory||[])].sort((x,y)=>x-y);
  if(!EQUAL(ta,tb))diff('villages['+a.id+'].territory',ta,tb);
  const sa=[...(a.technologies||[])].sort(),sb=[...(b.technologies||[])].sort();if(!EQUAL(sa,sb))diff('villages['+a.id+'].technologies',sa,sb);
  const ps=mapBy(b.residents);for(const p of a.residents||[]){const q=ps.get(String(p.id));if(!q){diag.missingEntities++;diff('villages['+a.id+'].residents['+p.id+']','PRESENT','MISSING');continue;}
   for(const k of scalarPerson)if(!EQUAL(p[k],q[k]))diff('villages['+a.id+'].residents['+p.id+'].'+k,p[k],q[k]);
  }
  if((b.residents||[]).length!==(a.residents||[]).length){diag.missingEntities++;diff('villages['+a.id+'].residents.length',(a.residents||[]).length,(b.residents||[]).length);}
 }
 if((restored.map?.tiles||[]).length!==(raw.map?.tiles||[]).length)diag.missingEntities++;
 if((restored.villages||[]).length!==(raw.villages||[]).length)diag.missingEntities++;
 return diag;
}
function setExact(o,k,value){if(value===undefined){if(Object.prototype.hasOwnProperty.call(o,k)){delete o[k];return 1;}return 0;}
 if(EQUAL(o[k],value))return 0;o[k]=clone(value);return 1;
}
function reconcile(w,wrapper){const raw=wrapper.world,expected=wrapper.perf.stateSignature;
 const diag=prepare(raw,w,expected);last=diag;
 if(diag.serializedSignature!==expected){diag.result='CORRUPT_OR_UNREPRESENTABLE_SERIALIZATION';throw new Error('저장된 원본 세계의 서명이 일치하지 않습니다. H1B1 체크포인트 진단 JSON을 내보내세요.');}
 if(diag.restoredSignature===expected){diag.result='EXACT';return w;}
 if(diag.missingEntities){diag.result='MISSING_ENTITIES';throw new Error('복원 과정에서 개체가 누락되거나 증가했습니다. 원본 파일은 변경하지 않았습니다. 진단 JSON을 내보내세요.');}
 // The exporter signature verified the canonical values. A few inherited attachWorld
 // adapters normalize even same-version fields on import; replay ONLY those stored
 // properties, preserving Set identity and all non-signature state. No AI tick runs.
 const byId=arr=>new Map((arr||[]).map(x=>[String(x.id),x]));
 const ts=byId(w.map?.tiles),vs=byId(w.villages);
 for(const a of raw.map?.tiles||[]){const b=ts.get(String(a.id));for(const k of scalarTile)diag.repairCount+=setExact(b,k,a[k]);}
 for(const a of raw.villages||[]){const b=vs.get(String(a.id));for(const k of scalarNation)diag.repairCount+=setExact(b,k,a[k]);
  if(!EQUAL([...(b.territory||[])].sort((x,y)=>x-y),[...(a.territory||[])].sort((x,y)=>x-y))){b.territory=new Set(a.territory||[]);diag.repairCount++;}
  if(!EQUAL([...(b.technologies||[])].sort(),[...(a.technologies||[])].sort())){b.technologies=new Set(a.technologies||[]);diag.repairCount++;}
  const ps=byId(b.residents);for(const p of a.residents||[]){const q=ps.get(String(p.id));for(const k of scalarPerson)diag.repairCount+=setExact(q,k,p[k]);}
 }
 diag.afterReconcileSignature=fp(w);
 if(diag.afterReconcileSignature!==expected){diag.result='UNRESOLVED';throw new Error('직렬화 복원 후 서명 불일치가 남았습니다. 진단 JSON을 내보내세요.');}
 diag.result='RECONCILED_CANONICAL_FIELDS';return w;
}
function recentDiagnostic(){return last?clone(last):null;}
function downloadDiagnostic(){if(!last)throw Error('체크포인트 검증 기록이 없습니다.');const result=clone(last);
 if(typeof document!=='undefined'){
  const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`vilob-v035H1B1-checkpoint-${result.date?.[0]||'unknown'}y-diagnostic.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }return result;
}
// Snapshot V1: compare opt-in observation runs without retaining large snapshots.
// This is an inclusive runtime metric, not a replacement for the existing 35A etc.
function startSnapshot(w){if(!w)throw Error('세계가 없습니다.');if(NS.V035H1B.isActive())throw Error('기존 H1B 진단을 먼저 종료하세요.');if(snapshotActive)stopSnapshot();
 const prev=NS.Telemetry.prototype.snapshot;const s={world:w,active:true,days:0,maxDays:180,startedAt:{year:w.year,day:w.day,rngState:w.v35h1a?.rngState,signature:fp(w)},calls:0,totalMs:0,maxMs:0,byReason:{},byStage:{},stack:[],previous:prev,wrapper:null,dayWrapper:null,previousDay:null};
 const wrapped=function(...args){if(args[0]!==w)return prev.apply(this,args);const start=clock();try{return prev.apply(this,args);}finally{const elapsed=Math.max(0,clock()-start),r=String(args[1]||'AUTO');s.calls++;s.totalMs+=elapsed;s.maxMs=Math.max(s.maxMs,elapsed);const a=s.byReason[r]||(s.byReason[r]={calls:0,ms:0});a.calls++;a.ms+=elapsed;}};
 s.wrapper=wrapped;NS.Telemetry.prototype.snapshot=wrapped;
 const originalDay=NS.World.prototype.advanceOneDay;
 const dayWrapper=function(...args){if(this!==w)return originalDay.apply(this,args);try{return originalDay.apply(this,args);}finally{s.days++;if(s.active&&s.days>=s.maxDays)stopSnapshot();}};
 s.dayWrapper=dayWrapper;s.previousDay=originalDay;NS.World.prototype.advanceOneDay=dayWrapper;snapshotActive=s;completedSnapshot=null;return snapshotReport();
}
function stopSnapshot(){
 if(!snapshotActive)return completedSnapshot;
 const s=snapshotActive;
 if(NS.Telemetry.prototype.snapshot===s.wrapper)NS.Telemetry.prototype.snapshot=s.previous;
 if(NS.World.prototype.advanceOneDay===s.dayWrapper)NS.World.prototype.advanceOneDay=s.previousDay;
 s.active=false;snapshotActive=null;
 completedSnapshot={format:'vilob-v035h1b1-snapshot-v1',version:VERSION,observedDays:s.days,plannedDays:s.maxDays,start:s.startedAt,finish:{year:s.world.year,day:s.world.day,rngState:s.world.v35h1a?.rngState,signature:fp(s.world)},calls:s.calls,totalMs:s.totalMs,maxMs:s.maxMs,meanMs:s.calls?s.totalMs/s.calls:0,byReason:clone(s.byReason),segments:clone(s.byStage),segmentNote:'Selected nested snapshot boundaries; exclusiveMs subtracts only measured descendants. This estimate is separate from 35A/C/D inclusive timings.'};
 return completedSnapshot;
}
function snapshotReport(){const s=snapshotActive;return s?{active:true,days:s.days,plannedDays:s.maxDays,calls:s.calls,totalMs:s.totalMs,maxMs:s.maxMs,byReason:clone(s.byReason),segments:clone(s.byStage)}:completedSnapshot;}
function measureStage(stage,w,original,that,args){
 const s=snapshotActive;if(!s||s.world!==w)return original.apply(that,args);
 const frame={child:0},start=clock();s.stack.push(frame);
 try{return original.apply(that,args);}finally{
  const inclusiveMs=Math.max(0,clock()-start),exclusiveMs=Math.max(0,inclusiveMs-frame.child);
  s.stack.pop();if(s.stack.length)s.stack[s.stack.length-1].child+=inclusiveMs;
  const m=s.byStage[stage]||(s.byStage[stage]={calls:0,inclusiveMs:0,exclusiveMs:0,maxMs:0});
  m.calls++;m.inclusiveMs+=inclusiveMs;m.exclusiveMs+=exclusiveMs;m.maxMs=Math.max(m.maxMs,inclusiveMs);
 }
}
function downloadSnapshot(){const data=snapshotReport();if(!data)throw Error('H1B1 스냅샷 진단을 먼저 시작하세요.');if(typeof document!=='undefined'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`vilob-v035H1B1-snapshot-${data.finish?.year||'active'}y-diagnostic.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 return data;
}
function installPanel(ui){
 if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1bPanel');if(!host)return;
 let panel=document.getElementById('v035h1b1Panel');
 if(!panel){panel=document.createElement('div');panel.id='v035h1b1Panel';panel.className='panel';panel.style.marginTop='10px';
 panel.innerHTML='<h3>H1B1 · 스냅샷 내부 진단</h3><div class="small muted">같은 체크포인트를 불러온 뒤 독립적으로 실행하세요. 180일 후 자동 종료됩니다.</div><div class="button-grid"><button id="v035h1b1SnapStart">스냅샷 180일 진단 시작</button><button id="v035h1b1SnapStop">진단 종료</button><button id="v035h1b1SnapJSON">스냅샷 진단 JSON</button></div><div class="small muted" id="v035h1b1SnapStatus"></div>';
 host.appendChild(panel);const el=id=>document.getElementById(id);
 el('v035h1b1SnapStart').onclick=()=>{try{startSnapshot(ui.world);installPanel(ui);}catch(e){el('v035h1b1SnapStatus').textContent=e.message;}};
 el('v035h1b1SnapStop').onclick=()=>{stopSnapshot();installPanel(ui);};
 el('v035h1b1SnapJSON').onclick=()=>{try{downloadSnapshot();}catch(e){el('v035h1b1SnapStatus').textContent=e.message;}};}
 const st=document.getElementById('v035h1b1SnapStatus'),r=snapshotReport();if(st)st.textContent=r?`진단 ${r.active?'실행 중':'완료'} · ${r.days??r.observedDays}/${r.plannedDays}일 · 스냅샷 ${r.calls}회 · 누적 ${r.totalMs.toFixed(1)}ms`:'스냅샷 진단 없음';
}
if(NS.UI){const prev=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...args){const r=prev.apply(this,args);installPanel(this);return r;};}
const snapshotOriginal=NS.Telemetry.prototype.snapshot;NS.Telemetry.prototype.snapshot=function(w,...args){const prev=snapshotScope;snapshotScope={world:w,rows:null,length:0,byId:null};try{return snapshotOriginal.call(this,w,...args);}finally{snapshotScope=prev;}};
const oldSetWorld=NS.UI?.prototype.setWorld;if(oldSetWorld)NS.UI.prototype.setWorld=function(w,...args){if(snapshotActive&&snapshotActive.world!==w)stopSnapshot();return oldSetWorld.call(this,w,...args);};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Checkpoint Integrity & Snapshot Hotpath · H1B1',summary:'동일 H1A 계열 체크포인트의 원본/복원 서명 단계별 검사, 원본 증명된 서명 필드만 선택적 보정, 로컬 차이 진단, 스냅샷 inclusive 분석과 관측 중 국가 ID 조회 캐시.',sections:[['체크포인트',['저장된 JSON 자체의 세계 서명을 검증한 다음 복원 결과를 비교합니다.','누락된 사람·타일 등은 자동 생성하지 않고 오류로 보고합니다.','복원 시 레거시 attach가 고쳐쓴 서명 대상 필드만 원본으로 되돌립니다.']],['관측 성능',['H1B 기존 4모드 진단을 유지하고 별도 스냅샷 계측을 제공합니다.','스냅샷 기록 주기나 1683열 CSV를 변경하지 않습니다.']]]});
const h=NS.UI?.prototype.renderHeader;if(h)NS.UI.prototype.renderHeader=function(...args){const r=h.apply(this,args);const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;return r;};
NS.V035H1B1=Object.freeze({version:VERSION,reconcile,recentDiagnostic,downloadDiagnostic,lookupVillage,startSnapshot,stopSnapshot,snapshotReport,measureStage,downloadSnapshot});
})(window.VSim);
