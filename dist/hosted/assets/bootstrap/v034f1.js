/* Village Observer V0.34F1 — starvation attribution and bounded late-sim tracing.
 * NO food/health/birth/death equation changes. Observer-only hooks use existing
 * pooled-ration results and never withdraw resources or consume RNG.
 */
(function(NS){'use strict';
const VERSION='V0.34F1',PREVIOUS='V0.34F0',SAVE_KEY='village-observer-v034f1';
const diagnosis=new WeakMap(), traces=new WeakMap();
const clock=()=>typeof performance==='object'&&performance.now?performance.now():Date.now();
const safe=n=>Number.isFinite(Number(n))?Number(n):0;
const ordinal=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
function fresh(){return {windowDays:1800,months:{},totals:{groups:0,requested:0,received:0,shortage:0,partialGroups:0,criticalGroups:0},last:{}};}
function diag(w){let d=diagnosis.get(w);if(!d){d=fresh();diagnosis.set(w,d);}return d;}
function prune(d,month){if(!Number.isInteger(month)||month%6!==0||month===d._prunedMonth)return;d._prunedMonth=month;const cutoff=month-Math.ceil(d.windowDays/30);for(const key of Object.keys(d.months)){if(Number(key.split('|')[0])<cutoff)delete d.months[key];}}
// Called exactly once per Settlement food cycle. No extra inventory access.
function recordRation(w,v,g,info){const requested=safe(info.requested),received=safe(info.received);if(requested<=0)return;
 const day=ordinal(w),month=Math.floor(day/30),pop=Math.max(0,safe(info.population)),ratio=Math.max(0,Math.min(1,received/requested));
 const d=diag(w),t=d.totals;t.groups++;t.requested+=requested;t.received+=received;
 const short=Math.max(0,requested-received),partial=ratio<.999999,critical=ratio<.8;
 if(partial){t.shortage+=short;t.partialGroups++;if(critical)t.criticalGroups++;}
 // Record healthy groups only monthly, but record every food-short group. This
 // prevents a 150-year, per-day, per-Settlement history from accumulating.
 if(!partial && day%30!==0)return;
 const key=month+'|'+String(v.id)+'|'+String(g.sid),b=d.months[key]||(d.months[key]={month,nationId:String(v.id),nationName:String(v.name),settlementId:String(g.sid),samples:0,shortageCycles:0,criticalCycles:0,requested:0,received:0,popMax:0,hungerHighMax:0,healthLowMax:0,localFoodMin:null,lastDay:0});
 b.samples++;b.shortageCycles+=Number(partial);b.criticalCycles+=Number(critical);b.requested+=requested;b.received+=received;b.popMax=Math.max(b.popMax,pop);b.hungerHighMax=Math.max(b.hungerHighMax,safe(info.hungerHigh));b.healthLowMax=Math.max(b.healthLowMax,safe(info.healthLow));b.localFoodMin=b.localFoodMin===null?safe(info.available):Math.min(b.localFoodMin,safe(info.available));b.lastDay=day;
 if(partial)d.last[String(v.id)]={month,day,settlementId:String(g.sid),ratio,missing:short,hungerHigh:safe(info.hungerHigh),healthLow:safe(info.healthLow)};
 prune(d,month);
}
function report(w){const d=diag(w),rows=Object.values(d.months).sort((a,b)=>a.month-b.month||a.nationId.localeCompare(b.nationId)||a.settlementId.localeCompare(b.settlementId));
 const nations={};for(const r of rows){const n=nations[r.nationId]||(nations[r.nationId]={nationId:r.nationId,nationName:r.nationName,requested:0,received:0,shortageCycles:0,criticalCycles:0,settlements:new Set()});n.requested+=r.requested;n.received+=r.received;n.shortageCycles+=r.shortageCycles;n.criticalCycles+=r.criticalCycles;n.settlements.add(r.settlementId);}
 return {format:'vilob-f1-survival-diagnostics',version:VERSION,year:w.year,day:ordinal(w),retentionDays:d.windowDays,model:'F0 pooled ration UNCHANGED',semantics:'Rows sample every shortage cycle and only one normal cycle per month; not complete food-accounting totals. totals reflects runtime since diagnostic initialization, may reset on imported F0 saves.',totals:{...d.totals},nationSummary:Object.values(nations).map(n=>({...n,settlements:n.settlements.size,shortageRatio:n.requested?+(100*(n.requested-n.received)/n.requested).toFixed(3):0})),rows};
}
const session={active:null,last:null};
function startTrace(w,days=60){if(session.active)throw Error('이미 1개 세계의 성능 계측이 진행 중입니다.');if(!(w instanceof NS.World))throw Error('World 객체가 필요합니다.');const target=Math.max(1,Math.min(360,Math.trunc(Number(days)||60)));session.active={world:w,remaining:target,days:[],startYear:w.year,startOrdinal:ordinal(w),snapshotMs:0,snapshotCalls:0};return {started:true,days:target,year:w.year};}
function stopTrace(){if(!session.active)return session.last;const a=session.active;session.active=null;session.last={format:'vilob-f1-daily-trace',version:VERSION,startYear:a.startYear,startOrdinal:a.startOrdinal,completedDays:a.days.length,days:a.days,notes:['SIM-day elapsed includes instrumented snapshot; nested times are not additive.','Performance instrumentation ON changes timing; compare RC5/F1 speed using uninstrumented A/B, not this trace.','6th/51st labels refer to offset from trace start, not calendar day-of-quarter.']};return session.last;}
const prevSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const a=session.active;if(!a||a.world!==w)return prevSnapshot.call(this,w,...args);const t=clock();try{return prevSnapshot.call(this,w,...args);}finally{a.snapshotMs+=clock()-t;a.snapshotCalls++;}};
const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const a=session.active;if(!a||a.world!==this)return prevAdvance.apply(this,args);const t=clock(),s0=a.snapshotMs,c0=a.snapshotCalls,year=this.year,date=ordinal(this),index=a.days.length+1;let failure;
 try{return prevAdvance.apply(this,args);}catch(e){failure=e;throw e;}finally{const elapsed=clock()-t; a.days.push({offset:index,year,ordinal:date,elapsedMs:+elapsed.toFixed(3),snapshotMs:+(a.snapshotMs-s0).toFixed(3),snapshotCalls:a.snapshotCalls-c0,macro:date%3===0,population:undefined});a.remaining--;if(failure||a.remaining<=0)stopTrace();}};
function download(name,obj){const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this);out.version=VERSION;const d=diag(this);out.v034f1Diagnosis={windowDays:d.windowDays,months:d.months,totals:d.totals,last:d.last};return out;};
NS.World.from=function(input){if(!input||typeof input!=='object')throw Error('Invalid save');const w=oldFrom(input.version===VERSION?{...input,version:PREVIOUS}:input),d=input.v034f1Diagnosis;
 if(d&&typeof d==='object'){const q=diag(w);q.windowDays=Math.max(30,Math.min(1800,safe(d.windowDays)||1800));q.months=d.months&&typeof d.months==='object'?d.months:{};q.totals={...q.totals,...(d.totals||{})};q.last=d.last&&typeof d.last==='object'?d.last:{};}return w;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const r=oldJSON.call(this,w);r.version=VERSION;if(r.worldSummary)r.worldSummary.v034f1Diagnosis= {totals:{...diag(w).totals},last:{...diag(w).last},retentionDays:1800};return r;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem('village-observer-v034f0')||localStorage.getItem('village-observer-v034e-rc5');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F1-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034F1-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 exportF1Diagnostics(w){download(`village-observer-v034F1-survival-${w.year}y.json`,report(w));},
 exportF1Trace(){if(!session.last)throw Error('먼저 60일 계측을 완료하세요.');download('village-observer-v034F1-daily-trace.json',session.last);}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const e=document.getElementById('versionBadge');if(e)e.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...a){const out=oldHeader.apply(this,a),w=this.world;badge();if(typeof document==='undefined'||!w)return out;
  const prev=document.getElementById('v034f0PerfPanel');if(!prev?.parentElement)return out;
  let host=document.getElementById('v034f1Panel');if(!host){host=document.createElement('div');host.className='panel';host.id='v034f1Panel';host.innerHTML='<div class="section-head"><h2>F1 · 식량 위험 및 SIM 추적</h2><span class="tag">진단 전용</span></div><div id="v034f1Status" class="small muted"></div><div class="button-grid"><button id="v034f1ExportFood">식량 위험 JSON</button><button id="v034f1StartTrace">다음 60일 SIM 추적</button><button id="v034f1ExportTrace">SIM 추적 JSON</button></div><div class="small muted">60일 SIM 추적 중에는 계측 오버헤드가 발생합니다. 평상시 ×10 성능 기록과 구분하세요.</div>';prev.insertAdjacentElement('afterend',host);
   host.querySelector('#v034f1ExportFood').onclick=()=>NS.SaveSystem.exportF1Diagnostics(this.world);
   host.querySelector('#v034f1StartTrace').onclick=()=>{try{startTrace(this.world,60);}catch(e){alert(e.message);}};
   host.querySelector('#v034f1ExportTrace').onclick=()=>{try{NS.SaveSystem.exportF1Trace();}catch(e){alert(e.message);}};}
  const text=host.querySelector('#v034f1Status'),d=diag(w),x=session.active;if(text)text.textContent=`식량 부족 감지 ${d.totals.partialGroups}회 · 심각 ${d.totals.criticalGroups}회 · 기록 정착지/기간 ${Object.keys(d.months).length}개 · ${x?'60일 추적 중 '+x.days.length+'일':session.last?'최근 '+session.last.completedDays+'일 추적 완료':'SIM 추적 대기'}`;
  return out;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-14',title:'F1 — 기아 붕괴 진단·후기 성능 추적',summary:'F0 배급·건강 수식은 유지하고 정착지별 공급 부족과 후반 SIM 급증을 별도 기록합니다.',sections:[['생존 원인 추적',['정착지 배급 주기의 부족량과 심각 부족 빈도를 30일 단위로 제한 기록합니다.','국가 식량 총량만으로 식량 접근을 판단하지 않으며, 건강 위험 및 부족 구간을 구분합니다.']],['성능 진단',['필요할 때만 다음 60일 World 실행시간과 Snapshot 시간을 날짜별로 기록합니다.','RC5 선택형 세부 profiler도 기존 방식으로 유지하며, 계측 ON 결과는 일반 SIM/BATCH 합격 판정에 사용하지 않습니다.']],['밸런스 보존',['F1에서는 굶주림·건강·출산·물류 공식과 RNG를 바꾸지 않습니다.','150년 ×10 기준은 여전히 PC SIM/BATCH 1000ms 미만이며 F1은 목표 달성을 주장하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;badge();
try{window.villageObserver?.renderHeader?.();}catch(e){}
NS.V034F1=Object.freeze({version:VERSION,recordRation,report,startTrace,stopTrace,traceLast:()=>session.last,traceActive:()=>session.active!==null});
})(window.VSim);
