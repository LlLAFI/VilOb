/* V0.34E-rc4h — on-demand profiling foundation.
 * No simulation decisions are modified. Method instrumentation is INSTALLED
 * only during a manually requested sample and restored at stop().
 */
(function(NS){'use strict';
const VERSION='V0.34E-rc5';
const PREVIOUS='V0.34D3B3B';
const SAVE_KEY='village-observer-v034e-rc5';
const names=[
 ['World','advanceOneDay','world.day'],
 ['World','socialAndMigration','macro.socialAndMigration'],
 ['World','processAutonomousTrade','macro.autonomousTrade'],
 ['World','checkExtinctions','macro.extinctionReview'],
 ['World','processRuins','macro.ruinReview'],
 ['World','anomalyCheck','macro.anomalyCheck'],
 ['Village','maintainSettlements','macro.maintenance'],
 ['Village','processBuildingMaintenance','macro.buildingMaintenance'],
 ['Village','developSettlements','macro.development'],
 ['Person','act','person.act'],
 ['Person','metabolism','person.metabolism'],
 ['Person','chooseJob','person.jobReview'],
 ['Village','dailyTick','settlement.daily'],
 ['Village','seasonalTick','settlement.seasonal'],
 ['Village','internalMigration','settlement.migration'],
 ['Village','withdrawAt','stock.withdraw'],
 ['Village','depositAt','stock.deposit'],
 // Stock reads may occur hundreds of thousands of times; sample separately (avoid observer effect).
 // ['Village','stockAt','stock.read'],
 // ['Village','settlementReserveDays','food.reserveRead'],
 ['VillageBrain','seasonalDecision','ai.seasonalDecision'],
 ['Telemetry','record','telemetry.event'],
 ['Telemetry','snapshot','telemetry.snapshot']
];
let session=null,last=null;
const now=()=>performance.now();
function report(s){
 const rows=Object.entries(s.rows).map(([name,v])=>({name,calls:v.calls,inclusiveMs:+v.inclusiveMs.toFixed(3),exclusiveMs:+v.exclusiveMs.toFixed(3),avgInclusiveUs:v.calls?+(v.inclusiveMs/v.calls*1000).toFixed(3):0}));
 rows.sort((a,b)=>b.exclusiveMs-a.exclusiveMs);
 return {format:'vilob-performance-e01',version:VERSION,sourceVersion:PREVIOUS,mode:'instrumented-only',yearAtStart:s.startYear,dayAtStart:s.startDay,days:s.days,requestedDays:s.requestedDays,totalWorldMs:+s.totalWorldMs.toFixed(3),perSimDayMs:s.days?+(s.totalWorldMs/s.days).toFixed(3):0,rows,notes:['Nested method times must not be added to their parent inclusive totals.','Instrumentation introduces overhead; use the uninstrumented CLI benchmark for release speed comparison.','Performance samples never alter gameplay RNG or resource quantities.']};
}
function stop(){if(!session)return last;const s=session;session=null;for(let i=s.patches.length-1;i>=0;i--){const p=s.patches[i];p.proto[p.method]=p.original;}last=report(s);return last;}
function start(world,days=30){
 if(session)throw Error('V0.34E profiler is already recording.');
 if(!(world instanceof NS.World))throw Error('World instance required');
 days=Math.max(1,Math.min(360,Math.trunc(Number(days)||30)));
 const s={world,requestedDays:days,days:0,totalWorldMs:0,startYear:world.year,startDay:world.ordinalDay?.(),rows:{},stack:[],patches:[]};
 session=s;
 try{
 for(const [className,method,label] of names){const proto=NS[className]?.prototype;if(!proto||typeof proto[method]!=='function')continue;
  const original=proto[method];s.rows[label]={calls:0,inclusiveMs:0,exclusiveMs:0};
  proto[method]=function(...args){
   // Other World objects are not sampled. Nested calls in the sampled world
   // naturally run while the selected World.advanceOneDay frame is active.
   if(session!==s || (label==='world.day'&&this!==world) || (label!=='world.day'&&!s.stack.length))return original.apply(this,args);
   const frame={label,start:now(),children:0};s.stack.push(frame);
   let errored=false;
   try{return original.apply(this,args);}catch(err){errored=true;throw err;}finally{
    const elapsed=now()-frame.start;s.stack.pop();
    const row=s.rows[label];row.calls++;row.inclusiveMs+=elapsed;row.exclusiveMs+=Math.max(0,elapsed-frame.children);
    if(s.stack.length)s.stack[s.stack.length-1].children+=elapsed;
    if(label==='world.day'){
     s.days++;s.totalWorldMs+=elapsed;
     if(errored||s.days>=s.requestedDays)stop();
    }
   }
  };
  s.patches.push({proto,method,original});
 }
 return {active:true,requestedDays:days,startYear:s.startYear,startDay:s.startDay};
 }catch(e){stop();throw e;}
}
function status(){return session?{active:true,days:session.days,requestedDays:session.requestedDays,totalWorldMs:session.totalWorldMs}: {active:false,lastDays:last?.days||0};}
function download(name,body,mime='application/json'){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function traceSegment(name,fn){const s=session;if(!s||!s.stack.length)return fn();const frame={label:name,start:now(),children:0};s.stack.push(frame);try{return fn();}finally{const dt=now()-frame.start;s.stack.pop();const row=s.rows[name]||(s.rows[name]={calls:0,inclusiveMs:0,exclusiveMs:0});row.calls++;row.inclusiveMs+=dt;row.exclusiveMs+=Math.max(0,dt-frame.children);if(s.stack.length)s.stack[s.stack.length-1].children+=dt;}}
const profiler=Object.freeze({start,stop,status,get traceSegmentActive(){return session?traceSegment:null;},last:()=>last,labels:names.map(x=>x[2]),exportJSON(){const r=last||stop();if(!r)throw Error('먼저 성능 계측을 수행하세요.');download('village-observer-v034E-rc5-performance.json',JSON.stringify(r,null,2));return r;}});
NS.V034E=Object.freeze({version:VERSION,profiling:profiler});
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('Invalid save data');return oldFrom([VERSION,'V0.34E-rc4h','V0.34E-rc4','V0.34E-rc3','V0.34E-rc2','V0.34E-rc1'].includes(d.version)?{...d,version:PREVIOUS}:d);};
// E-02: Full Snapshot cadence is deliberately retained. Late synthetic A/B showed
// world/RNG divergence when these old observer callbacks were skipped.
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJSON.call(this,w);d.version=VERSION;if(d.worldSummary)d.worldSummary.v034eRevision='E05_macro_job_review_and_benchmark_warmup';if(d.worldSummary)d.worldSummary.v034eTelemetry={autoSnapshotPolicy:"UNCHANGED_B3B",eventPruneMinIntervalOrdinal:30,eventRetentionThreshold:16000,highFrequencyProfilerDefault:"OFF"};return d;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const keys=[SAVE_KEY,'village-observer-v034e-rc4','village-observer-v034e-rc3','village-observer-v034e-rc2','village-observer-v034e-rc1','village-observer-v034d3b3b','village-observer-v034d3b3a','village-observer-v034d3b3','village-observer-v034d3b2'];let raw;for(const key of keys){raw=localStorage.getItem(key);if(raw)break;}return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034E-rc5-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034E-rc5-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));}
};
function updateVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
function profilerUI(w){if(typeof document==='undefined')return;const p=document.getElementById('v30aPerfPanel');if(!p||!p.parentElement)return;
 let host=document.getElementById('v034eE01Panel');if(!host){host=document.createElement('div');host.id='v034eE01Panel';host.className='panel';host.innerHTML='<div class="section-head"><h2>0.34E 실험실 · 선택형 성능 계측</h2><span class="tag">E-05</span></div><div class="small muted" id="v034eE01Status">계측 비활성 (일반 플레이 성능 오버헤드 없음)</div><div class="button-grid"><button id="v034eStart">다음 30일 계측</button><button id="v034eStop">계측 중지</button><button id="v034eExport">성능 JSON 내보내기</button></div><div class="small muted">계측 ON은 시간을 추가로 사용하므로 일반 성능 수치와 비교하지 마세요. 실제 세이브는 동봉된 benchmark-local.html로 PC에서 비교 가능.</div>';
  p.insertAdjacentElement('afterend',host);
  host.querySelector('#v034eStart').onclick=()=>{try{profiler.start(w,30);}catch(e){alert(e.message);}profilerUI(w);};
  host.querySelector('#v034eStop').onclick=()=>{profiler.stop();profilerUI(w);};
  host.querySelector('#v034eExport').onclick=()=>{try{profiler.exportJSON();}catch(e){alert(e.message);}};
 }
 const state=status(),el=host.querySelector('#v034eE01Status');if(el)el.textContent=state.active?'계측 '+state.days+'/'+state.requestedDays+'일 진행':last?'최근 계측 '+last.days+'일 · SIM 평균 '+last.perSimDayMs+'ms/일 (프로파일러 ON)':'계측 비활성 (일반 플레이 성능 오버헤드 없음)';
}
if(NS.UI){const priorHeader=NS.UI.prototype.renderHeader,priorWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(...a){const ret=priorHeader.apply(this,a);updateVersion();return ret;};
 NS.UI.prototype.renderWorld=function(...a){const ret=priorWorld.apply(this,a);profilerUI(this.world);return ret;};
}
updateVersion();
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({
 version:VERSION,date:'2026-10-14',title:'0.34E RC5 — 노동 결정·예열 벤치마크',
 summary:'시뮬레이션의 난수·시점·물자 규칙을 유지하면서 노동 후보 탐색의 중복 읽기를 제거하고, 독립 예열형 A/B 도구를 도입합니다.',
 sections:[
  ['노동 결정 읽기 최적화',['건축가의 진행 중 공사 위치 목록을 한 번 구축해 같은 결정 내 반복 탐색을 줄입니다.','직업 검사에서 중복된 홈 타일 조회를 제거합니다. AIProfile 계측 카운터 및 상태 변경 함수 호출은 그대로 유지합니다.']],
  ['예열형 벤치마크',['같은 HTML 안에서 별도 세계를 예열한 뒤 원본 세이브를 복원합니다.','예열 후 시작 상태 지문 검사, 3~5회 교차 실험, 회차별 개선율을 제공합니다.']],
  ['보존 및 검증',['Snapshot 호출 빈도 및 F5/F5A attachWorld는 RC4h와 동일하게 유지합니다.','실제 61년차 세이브의 성능 판정은 사용자 로컬 교차 시험으로 확인합니다.']]
 ]
});
NS.RELEASE_VERSION=VERSION;
})(window.VSim);
