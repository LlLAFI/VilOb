/* Village Observer V0.35A — opt-in runtime profiler and reproducible measurement foundation.
 * Does not change simulation rules, PRNG, saves, production, resource flow or scheduling.
 * No high-frequency wrappers are installed unless the operator explicitly starts profiling.
 */
(function(NS){'use strict';
const VERSION='V0.35A',PREV='V0.34H4C',KEY='village-observer-v035a';
const catalog=[
 ['World','advanceOneDay','SIM · 하루 전체',1],
 ['Person','act','Person · 행동',16],
 ['Person','metabolism','Person · 신진대사',16],
 ['Village','dailyTick','국가 · 일일 처리',1],
 ['Village','seasonalTick','국가 · 분기 처리',1],
 ['Village','yearlyTick','국가 · 연간 처리',1],
 ['VillageBrain','seasonalDecision','AI · 분기 판단',1],
 ['Village','processBuildingMaintenance','경제 · 유지보수',1],
 ['Village','maintainSettlements','경제 · 유지관리',1],
 ['Village','progressConstruction','건설 · 공사 진행',8],
 ['Village','withdrawNetwork','물류 · 공동 출고',8],
 ['Village','internalPathCost','물류 · 경로 조회',16],
 ['Village','internalLogisticsCapacity','물류 · 운송 용량',16],
 ['Village','depositAt','자원 · 입고',16],
 ['Village','withdrawAt','자원 · 출고',16],
 ['Village','stockAt','자원 · 재고 조회',32],
 ['Village','population','정착지 · 인구 조회',32],
 ['Village','foodReserveDays','식량 · 비축일',16],
 ['Village','seasonalTick','분기 전체 (참조)',1],
 ['UI','renderMap','UI · 지도 렌더',1],
 ['UI','renderWorld','UI · 세계 패널',1],
 ['UI','renderStats','UI · 통계 패널',1],
 ['UI','renderHeader','UI · 상단 렌더',1]
];
let current=null, last=null;
function timer(){return (typeof performance!=='undefined'&&typeof performance.now==='function')?performance.now():Date.now();}
function values(ms){const a=[...ms].sort((x,y)=>x-y);return {p50:a.length?a[Math.floor((a.length-1)*.5)]:0,p95:a.length?a[Math.floor((a.length-1)*.95)]:0};}
function emptyRow(label,interval){return {label,interval,calls:0,samples:0,sum:0,max:0,latency:[]};}
function start(w,opts={}){
 if(!w||!NS.World||!NS.Person||!NS.Village)throw Error('계측할 세계가 없습니다');
 if(current)stop();
 const divisor=Math.max(1,Math.min(32,Math.floor(Number(opts.sampleDivider)||1)));
 const s={world:w,active:true,startedSimTime:w.timestamp?.()||'',startYear:Number(w.year)||0,startNow:timer(),rows:Object.create(null),annual:Object.create(null),dayLatencies:[],dayCount:0,notes:[],restorations:[],inDay:false,divisor};
 current=s;
 const defs={World:NS.World,Person:NS.Person,Village:NS.Village,VillageBrain:NS.VillageBrain,UI:NS.UI};
 const seen=new Set();
 try{
  for(const [cls,method,label,baseInterval] of catalog){
   const key=cls+'.'+method;if(seen.has(key))continue;seen.add(key);
   const owner=defs[cls]?.prototype,orig=owner?.[method];if(typeof orig!=='function')continue;
   const interval=key==='World.advanceOneDay'||key.startsWith('UI.')?1:Math.max(1,baseInterval*divisor);
   s.rows[key]=emptyRow(label,interval);
   const instrumented=function(...args){
    const applicable=s.active&&(cls==='UI'?this.world===s.world:s.inDay||key==='World.advanceOneDay')&&(cls==='World'?this===s.world:cls!=='UI'||this.world===s.world);
    if(!applicable)return orig.apply(this,args);
    const row=s.rows[key],idx=++row.calls,timed=(idx%interval===0||interval===1),before=timed?timer():0;
    if(key==='World.advanceOneDay')s.inDay=true;
    try{return orig.apply(this,args);}finally{
      if(timed){const elapsed=Math.max(0,timer()-before);row.samples++;row.sum+=elapsed;row.max=Math.max(row.max,elapsed);if(row.latency.length<256)row.latency.push(elapsed);else row.latency[(row.samples-1)%256]=elapsed;
       if(key==='World.advanceOneDay'){
        s.dayCount++;const year=Number(s.world.year)||0,a=s.annual[year]||(s.annual[year]={year,days:0,sum:0,max:0,latencies:[]});a.days++;a.sum+=elapsed;a.max=Math.max(a.max,elapsed);
        if(a.latencies.length<96)a.latencies.push(elapsed);else a.latencies[(a.days-1)%96]=elapsed;
        if(s.dayLatencies.length<512)s.dayLatencies.push(elapsed);else s.dayLatencies[(s.dayCount-1)%512]=elapsed;
       }
      }
      if(key==='World.advanceOneDay')s.inDay=false;
    }
   };
   owner[method]=instrumented;s.restorations.push([owner,method,orig,instrumented]);
  }
 }catch(e){for(const [owner,method,orig,instrumented] of s.restorations.reverse())if(owner[method]===instrumented)owner[method]=orig;current=null;throw e;}
 return report(s);
}
function stop(){if(!current)return last;const s=current;s.active=false;
 for(const [owner,method,orig,instrumented] of s.restorations.reverse())if(owner[method]===instrumented)owner[method]=orig;
 s.restorations.length=0;s.finishedNow=timer();s.finishedSimTime=s.world.timestamp?.()||'';last=report(s);current=null;return last;
}
function report(s=current){if(!s)return last||null;
 const rows=Object.entries(s.rows).map(([id,r])=>{
   const mean=r.samples?r.sum/r.samples:0;
   return {id,category:r.label,samplingEvery:r.interval,calls:r.calls,timedCalls:r.samples,sampledTotalMs:+r.sum.toFixed(4),estimatedInclusiveMs:+(mean*r.calls).toFixed(4),meanSampleMs:+mean.toFixed(6),maxSampleMs:+r.max.toFixed(5),p95SampleMs:+values(r.latency).p95.toFixed(5)};
 }).sort((a,b)=>b.estimatedInclusiveMs-a.estimatedInclusiveMs);
 const total=rows.find(x=>x.id==='World.advanceOneDay')?.sampledTotalMs||0;
 const annual=Object.values(s.annual).sort((a,b)=>a.year-b.year).map(a=>({year:a.year,days:a.days,meanDailyMs:+(a.sum/a.days).toFixed(4),maxDailyMs:+a.max.toFixed(4),p95DailyMs:+values(a.latencies).p95.toFixed(4)}));
 let f0=null;try{if(NS.V034F0?.performanceReport)f0=NS.V034F0.performanceReport(s.world);}catch(_){}
 return {format:'vilob-v035a-profile-v1',version:VERSION,simTime:s.world.timestamp?.()||'',startedSimTime:s.startedSimTime,finishedSimTime:s.finishedSimTime||null,active:!!s.active,observedDays:s.dayCount,sampleDivider:s.divisor,elapsedRealMs:+((s.finishedNow||timer())-s.startNow).toFixed(3),simulationDayTotalMs:total,
  interpretation:{scope:'World.advanceOneDay: sampled complete simulation days; method probes: inclusive wall-clock sampled at deterministic call intervals',overlap:'Nested method inclusive times overlap; NEVER add row totals or treat each category as exclusive.',sampling:'estimatedInclusiveMs = sampled mean × observed calls; low sample counts / expensive uneven calls need longer runs.',instrumentation:'Enable profiler measures additional wrapper and timer overhead; use unprofiled A/B to assess actual speed.',coverage:'Only explicitly named methods are covered. Unmeasured time and internal lexical functions are not assigned to a category.',device:'Node VM and Chromium UI timings are NOT directly comparable to browser ×10 SIM/BATCH or Wall.'},rows,top10:rows.filter(r=>r.id!=='World.advanceOneDay'&&!r.id.startsWith('UI.')).slice(0,10),annual,f0Performance:f0,memoryHint:typeof performance!=='undefined'&&performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize}:null};
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDevlog=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=oldSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=oldDevlog.apply(this,a);d.version=VERSION;return d;};
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간이 부족합니다. JSON으로 내보내 주세요. '+e.message);}},
 load(){const str=localStorage.getItem(KEY);return str?NS.World.from(JSON.parse(str)):oldSave.load?.();},
 export(w){download(`village-observer-v035A-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035A-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35AProfile(w){const data=report();if(!data)throw Error('먼저 계측을 시작해 주세요');download(`vilob-v035A-profile-${w.year}y.json`,data);}
};
function panel(ui){if(typeof document==='undefined'||!ui?.world)return;
 let area=document.getElementById('v035aProfilePanel');if(!area){const host=document.getElementById('h3Diagnostics')||document.getElementById('h3Advanced')||document.getElementById('v034f0PerfPanel');if(!host)return;
  area=document.createElement('div');area.id='v035aProfilePanel';area.className='panel';area.style.marginTop='8px';area.innerHTML='<div class="section-head"><h3>35A · 정밀 성능 계측</h3><span class="tag">진단 전용</span></div><div class="small muted">기본 비활성 · 시작 시에만 계측 래퍼 설치 · 종료 시 원상 복구</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"><button type="button" id="v035aStart">계측 시작</button><button type="button" id="v035aStop">계측 종료</button><button type="button" id="v035aExport">계측 JSON</button></div><div id="v035aText" class="small muted">계측 기록 없음</div><div id="v035aTop" class="small muted"></div>';
  host.appendChild(area);area.querySelector('#v035aStart').onclick=()=>{start(ui.world);panel(ui);};area.querySelector('#v035aStop').onclick=()=>{stop();panel(ui);};area.querySelector('#v035aExport').onclick=()=>NS.SaveSystem.export35AProfile(ui.world);
 }
 const r=report(),txt=area.querySelector('#v035aText'),top=area.querySelector('#v035aTop');if(txt)txt.textContent=r?`${r.active?'계측 중':'계측 종료'} · ${r.observedDays}일 · 일일 평균 ${(r.simulationDayTotalMs/Math.max(1,r.observedDays)).toFixed(2)}ms · 측정값에는 계측 오버헤드 포함`:'계측 기록 없음';
 if(top&&r)top.textContent='추정 상위: '+r.top10.slice(0,3).map(x=>`${x.category} ${x.estimatedInclusiveMs.toFixed(0)}ms (${x.calls}회)`).join(' / ');
 if(area.querySelector('#v035aStart'))area.querySelector('#v035aStart').disabled=!!current&&current.world===ui.world;
 if(area.querySelector('#v035aStop'))area.querySelector('#v035aStop').disabled=!current;
}
const P=NS.UI?.prototype;
if(P){const before=P.renderWorld;P.renderWorld=function(...a){const out=before.apply(this,a);panel(this);return out;};}
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
if(P){const oldHeader=P.renderHeader;P.renderHeader=function(...a){const out=oldHeader.apply(this,a);refresh();return out;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'Performance Baseline & Profiler V2',summary:'V0.34H4C의 게임 규칙을 유지하고, 사용자 선택 계측과 함수 호출량·비용·연도별 증가 분석을 도입합니다.',sections:[['실측 기반',['계측 시작 후 Person·Settlement·물류·AI·시즌·렌더 핵심 함수의 호출량과 샘플 시간을 JSON으로 추출합니다.','중첩 함수의 시간은 inclusive이므로 합산하지 않습니다. 프로파일러 자체 오버헤드를 감안해 비계측 A/B 검증을 별도로 수행합니다.']],['안전성',['기본 비활성. 계측 종료 시 메서드를 원본으로 되돌리며 세이브에 진단 상태를 저장하지 않습니다.','생산·물류·Person·AI·전투·RNG·Gold·기술·CSV 스키마를 변경하지 않습니다.']],['기준선',['같은 저장 파일을 사용하는 H4C↔35A 실행 비교 도구를 제공하고 실제 90년 원본 세이브는 사용자 기기에서만 선택할 수 있습니다.']]]});
NS.V035A=Object.freeze({version:VERSION,start,stop,report:()=>report(),isActive:()=>!!current,probeCatalog:catalog.map(x=>[...x])});
try{refresh();}catch(_e){}
})(window.VSim);
