/* Village Observer V0.35H1B — isolated, optional hotpath attribution.
 * No profiler instruments an unselected world.  Never serialize runtime timers.
 * Timers are inclusive and are not safe to add across nested systems.
 */
(function(NS){'use strict';
if(!NS?.V035H1A||!NS?.V035A||!NS?.V035C||!NS?.V035D)return;
const VERSION='V0.35H1B1';
const clock=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
const ranks=a=>{const b=a.slice().sort((x,y)=>x-y),at=p=>b.length?b[Math.min(b.length-1,Math.ceil(b.length*p)-1)]:0;return {samples:b.length,meanMs:b.length?a.reduce((x,y)=>x+y,0)/b.length:0,medianMs:at(.5),p95Ms:at(.95),maxMs:b.length?b[b.length-1]:0};};
let active=null,latest=null;
const catalog={BASELINE:{label:'계측 OFF 기준 측정',maxDays:180},A:{label:'35A 일일·Person',maxDays:180},C:{label:'35C 분기·행정',maxDays:360},D:{label:'35D 사회·경제',maxDays:360}};
function runtimeSnapshot(s){
 const a=NS.V035H1A,days=s.latencies.length,batches=s.batches.slice(),stat=ranks(s.latencies),batch=ranks(batches),world=s.world;
 const profiler=s.mode==='A'?NS.V035A.report():s.mode==='C'?NS.V035C.report():s.mode==='D'?NS.V035D.report():null;
 return {format:'vilob-v035h1b-attribution-v1',version:VERSION,mode:s.mode,modeLabel:catalog[s.mode].label,active:s.active,start:s.start,finish:s.active?null:{...a.report(world).current},observedDays:days,plannedDays:catalog[s.mode].maxDays,
  simDays:stat,nonoverlap10DayBatches:batch,over1000Ms:batches.filter(x=>x>1000).length,snapshotInclusive:{calls:s.snapshotCalls,ms:s.snapshotMs,maxMs:s.snapshotMax,meanMs:s.snapshotCalls?s.snapshotMs/s.snapshotCalls:0},
  profiler:profiler||null,
  interpretation:{profilerOverhead:s.mode!=='BASELINE',baselineOverhead:'Only 2 high-resolution clock reads per day plus one report row; not identical to entirely instrument-free F0',batch:'10 consecutive measured advanceOneDay costs, no rendering/yield; not the browser UI F0 batch metric',snapshot:'Snapshot time includes every nested legacy observation layer; overlaps with World.advanceOneDay, do not add',crossMode:'Each mode must start by loading the same whole-world checkpoint file. Compare same device and world/state signature. Profilers 35A, 35C, 35D are mutually exclusive.',regression:'Signature and RNG are necessary checks, not a substitute for complete-world parity or conserved-resource audits.'}};
}
function start(w,mode='BASELINE'){
 if(!catalog[mode])throw Error('H1B 계측 방식이 잘못됐습니다.');if(!w)throw Error('계측할 세계가 없습니다.');if(NS.V035H1B1?.snapshotReport?.()?.active)throw Error('H1B1 스냅샷 진단을 먼저 종료하세요.');if(active)stop();
 if(NS.V035A.isActive()||NS.V035C.isActive()||NS.V035D.isActive()||NS.V035B?.reportDetail?.()?.active)throw Error('다른 프로파일러를 종료한 뒤 H1B를 시작하세요.');
 const startState=NS.V035H1A.report(w);if(startState.mode!=='FIXED_RNG')throw Error('H1B는 고정 RNG 시나리오 또는 그 체크포인트에서만 실행할 수 있습니다.');
 const s={world:w,mode,active:true,start:{...startState.current},latencies:[],batches:[],batchSum:0,partial:0,snapshotCalls:0,snapshotMs:0,snapshotMax:0,restores:[],profilerStarted:false};
 const api=mode==='A'?NS.V035A:mode==='C'?NS.V035C:mode==='D'?NS.V035D:null;
 try{
  if(api){api.start(w);s.profilerStarted=true;}
  const old=NS.World.prototype.advanceOneDay;
  const wrapper=function(...args){if(this!==w)return old.apply(this,args);const t=clock();try{return old.apply(this,args);}finally{
   const elapsed=Math.max(0,clock()-t);s.latencies.push(elapsed);s.partial++;s.batchSum+=elapsed;
   if(s.partial===10){s.batches.push(s.batchSum);s.partial=0;s.batchSum=0;}
   if(s.active&&s.latencies.length>=catalog[s.mode].maxDays)stop();
  }};
  NS.World.prototype.advanceOneDay=wrapper;s.restores.push([NS.World.prototype,'advanceOneDay',old,wrapper]);
  if(mode!=='BASELINE'){
   const prev=NS.Telemetry.prototype.snapshot;
   const wrapperSnap=function(...args){if(args[0]!==w)return prev.apply(this,args);const t=clock();try{return prev.apply(this,args);}finally{const elapsed=Math.max(0,clock()-t);s.snapshotCalls++;s.snapshotMs+=elapsed;s.snapshotMax=Math.max(s.snapshotMax,elapsed);}};
   NS.Telemetry.prototype.snapshot=wrapperSnap;s.restores.push([NS.Telemetry.prototype,'snapshot',prev,wrapperSnap]);
  }
 }catch(e){for(const [owner,key,old,wrapped] of s.restores.reverse())if(owner[key]===wrapped)owner[key]=old;if(s.profilerStarted)api?.stop();throw e;}
 active=s;return runtimeSnapshot(s);
}
function stop(){if(!active)return latest;const s=active;s.active=false;
 for(const [owner,key,original,wrapper] of s.restores.slice().reverse())if(owner[key]===wrapper)owner[key]=original;
 if(s.profilerStarted)(s.mode==='A'?NS.V035A:s.mode==='C'?NS.V035C:NS.V035D).stop();
 latest=runtimeSnapshot(s);active=null;return latest;
}
function report(){return active?runtimeSnapshot(active):latest;}
function download(name,object){if(typeof document==='undefined')return object;const blob=new Blob([JSON.stringify(object,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);return object;}
const prevSave=NS.SaveSystem,priorDev=NS.Telemetry.prototype.toJSON;
NS.SaveSystem={...prevSave,exportH1BProfile(w){const r=report();if(!r)throw Error('H1B 진단 시작 후 저장하세요.');return download(`vilob-v035H1B-${r.mode}-${w.year}y-diagnostic.json`,r);}};
NS.Telemetry.prototype.toJSON=function(w,...args){const d=priorDev.call(this,w,...args);d.version=VERSION;if(report()&&active?.world===w){d.worldSummary=d.worldSummary||{};d.worldSummary.v35h1bDiagnostic={mode:active.mode,days:active.latencies.length};}return d;};
function panel(ui){if(typeof document==='undefined'||!ui?.world)return;const host=document.getElementById('v035h1aPanel')||document.getElementById('v035gConstructionExports');if(!host)return;let box=document.getElementById('v035h1bPanel');if(!box){box=document.createElement('div');box.id='v035h1bPanel';box.className='panel';box.style.marginTop='10px';box.innerHTML='<h3>H1B · 성능 진단 세션</h3><div class="small muted">매 단계 시작 전에 위의 「체크포인트 불러오기」로 <b>동일한 체크포인트 파일</b>을 다시 여세요. 계측기는 중복 실행하지 않습니다.</div><div class="button-grid"><button type="button" data-h1b="BASELINE">기준 180일</button><button type="button" data-h1b="A">35A 180일</button><button type="button" data-h1b="C">35C 360일</button><button type="button" data-h1b="D">35D 360일</button><button type="button" id="v035h1bStop">진단 종료</button><button type="button" id="v035h1bExport">H1B 진단 JSON</button></div><div id="v035h1bStatus" class="small muted"></div>';host.appendChild(box);
  for(const b of box.querySelectorAll('[data-h1b]'))b.addEventListener('click',()=>{try{start(ui.world,b.dataset.h1b);panel(ui);}catch(e){const p=document.getElementById('v035h1bStatus');if(p)p.textContent=String(e?.message||e);}});
  box.querySelector('#v035h1bStop').onclick=()=>{stop();panel(ui);};box.querySelector('#v035h1bExport').onclick=()=>{try{NS.SaveSystem.exportH1BProfile(ui.world);}catch(e){const st=document.getElementById('v035h1bStatus');if(st)st.textContent=e.message;}};
 }
 const r=report(),status=document.getElementById('v035h1bStatus');if(status)status.textContent=r?`${r.modeLabel} · ${r.observedDays}/${r.plannedDays}일 · 10일 배치 중앙값 ${r.nonoverlap10DayBatches.medianMs.toFixed(1)}ms · ${r.active?'계측 중':'종료'} · 계측값은 실제 ×10 UI 성능과 구분`:'진단 없음 · 고정 성능 세계 체크포인트를 불러오세요.';
}
if(NS.UI){const oldRender=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...args){const r=oldRender.apply(this,args);panel(this);return r;};const oldSet=NS.UI.prototype.setWorld;NS.UI.prototype.setWorld=function(w,...args){if(active&&active.world!==w)stop();return oldSet.call(this,w,...args);};}
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
if(NS.UI){const h=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=h.apply(this,args);badge();return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Hotpath Attribution & Optimization V1 · H1B',summary:'같은 H1A 체크포인트 기반 35A·35C·35D 개별 진단과 일일 주민 현황 이중 순회 최적화. 시뮬레이션 규칙·난수 불변.',sections:[['병목 식별',['분리된 180/360일 진단 세션에서 일일 전체 및 Telemetry 스냅샷 inclusive 비용을 관측합니다.','35A·35C·35D 중첩 시간을 합산하지 않고, 계측 OFF와 정확한 브라우저 F0 측정을 구분합니다.']],['일일 핫패스',['보호 레거시 원본 SHA는 그대로 두고 Village.dailyTick의 근로자/상인 이중 filter 순회를 단일 순회로 변환합니다.','주민 행동 이후 조건식과 Gold 계산 순서 및 RNG 호출을 그대로 유지합니다.']],['검증',['H1A-HF 체크포인트 및 저장 키를 받아들이고 고정 RNG 시나리오를 유지합니다.','기술 43개, CSV 1683열, 169 보호 블록, 경량 GitHub 배포를 유지합니다.']]]});
NS.V035H1B=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!active,catalog:{...catalog}});badge();
})(window.VSim);
