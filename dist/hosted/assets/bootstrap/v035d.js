/* Village Observer V0.35D — Society18 Hotpath V1.
 * Legacy instrumentation is opt-in; production ledger and demand-trade scans
 * are local deterministic transforms, with no persistent cache or new RNG.
 */
(function(NS){'use strict';
const VERSION='V0.35D',PREV='V0.35C',KEY='village-observer-v035d';
const originalSerialize=NS.World.prototype.serialize,originalFrom=NS.World.from,originalDevlog=NS.Telemetry.prototype.toJSON,priorSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const v=originalSerialize.apply(this,a);v.version=VERSION;return v;};
NS.World.from=function(d,...a){return originalFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=originalDevlog.apply(this,a);d.version=VERSION;return d;};
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const metricIds=['demandDevelopment','settlementPressure','tradeVolumeLookup','localTargetPrice','recoveryProfile','updateRecovery','foodSpoilage','concernEvents','festivalDecision'];
let current=null,previous=null;
function zero(){return{calls:0,inclusiveMs:0,exclusiveMs:0,maxMs:0,p95:[],exceptions:0};}
function view(s){if(!s)return previous;const out={};for(const k of metricIds){const x=s.metrics[k],sorted=x.p95.slice().sort((a,b)=>a-b);out[k]={calls:x.calls,inclusiveMs:+x.inclusiveMs.toFixed(3),exclusiveMs:+x.exclusiveMs.toFixed(3),meanMs:x.calls?+(x.inclusiveMs/x.calls).toFixed(5):0,maxMs:+x.maxMs.toFixed(3),p95Ms:sorted.length?+sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*.95)-1)].toFixed(3):0,exceptions:x.exceptions};}
 return {format:'vilob-v035d-society-v1',version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime||null,observedDays:s.days,quarterCount:s.quarters.length,metrics:out,seasonal:s.quarters.map(q=>({...q})),notes:['Only calls inside Village.seasonalTick are timed. Per-metric inclusive values overlap with parents; exclusive time excludes measured children only.','The 35C 21-layer checkpoint is independent from these nested timers.','Sampling is opt-in and may distort performance. Use an unprofiled same-save A/B to claim speedups.','The source transformation preserves legacy original blocks and does not use daily/global cache.']};
}
function isMeasuring(){return!!current&&current.seasonDepth>0;}
function measure(id,fn){const s=current;if(!s||s.seasonDepth===0||!s.metrics[id])return fn();const x=s.metrics[id],t=clock(),f={child:0};s.frames.push(f);let failed=false;try{return fn();}catch(err){failed=true;throw err;}finally{const ms=Math.max(0,clock()-t);s.frames.pop();x.calls++;x.inclusiveMs+=ms;x.exclusiveMs+=Math.max(0,ms-f.child);x.maxMs=Math.max(x.maxMs,ms);if(failed)x.exceptions++;if(x.p95.length<10000)x.p95.push(ms);if(s.frames.length)s.frames[s.frames.length-1].child+=ms;}}
function start(w){if(!w)throw Error('세계가 없습니다');if(current)stop();if(NS.V035A?.isActive?.()||NS.V035C?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('35A/35B/35C 계측을 먼저 종료해 주세요.');const p=NS.V034C1B;if(!p?.setEnabled)throw Error('분기 계층 계측기가 없습니다.');
 const s={w,active:true,startTime:w.timestamp?.()||'',finishTime:null,days:0,seasonDepth:0,frames:[],quarters:[],lastCal:null,metrics:Object.fromEntries(metricIds.map(k=>[k,zero()])),restore:[],wasEnabled:!!p.summarize(w)?.enabled};
 p.setEnabled(w,true);function wrap(owner,key,hook){const fn=owner[key];if(typeof fn!=='function')throw Error('35D missing '+key);const replacement=function(...a){return hook.call(this,fn,a);};owner[key]=replacement;s.restore.push([owner,key,fn,replacement]);}
 function capture(){const v=p.summarize(w);if(!v?.hasProfile||!v.sampleCount||s.lastCal===v.calendarDay)return;s.lastCal=v.calendarDay;s.quarters.push({year:v.year,season:v.season,calendarDay:v.calendarDay,outerMs:v.outerMs,stages:{...v.stages},missing:v.missingCheckpoints});}
 try{wrap(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);s.seasonDepth++;try{return orig.apply(this,args);}finally{s.seasonDepth--;}});
 wrap(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});}
 catch(e){for(const [o,k,f,r] of s.restore.reverse())if(o[k]===r)o[k]=f;if(!s.wasEnabled)p.setEnabled(w,false);throw e;}
 current=s;return view(s);
}
function stop(){if(!current)return previous;const s=current;s.active=false;for(const [o,k,fn,wrapper] of s.restore.reverse())if(o[k]===wrapper)o[k]=fn;if(!s.wasEnabled)NS.V034C1B.setEnabled(s.w,false);s.finishTime=s.w.timestamp?.()||'';previous=view(s);current=null;return previous;}
function report(){return current?view(current):previous;}
function download(name,obj){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(err){throw Error('저장 공간 부족: JSON으로 내보내 주세요. '+err.message);}},
 load(){const text=localStorage.getItem(KEY);return text?NS.World.from(JSON.parse(text)):priorSave.load?.();},
 export(w){download(`village-observer-v035D-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035D-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35DProfile(w){const d=report();if(!d)throw Error('먼저 35D 계측을 실행해 주세요');download(`vilob-v035D-society-${w.year}y.json`,d);}
};
const UI=NS.UI?.prototype;if(UI){const original=UI.renderWorld;UI.renderWorld=function(...a){const r=original.apply(this,a);if(typeof document==='undefined')return r;const parent=document.getElementById('v035cPanel')||document.getElementById('v035bAdminPanel');if(!parent)return r;let el=document.getElementById('v035dPanel');if(!el){el=document.createElement('div');el.id='v035dPanel';el.className='small muted';el.style.marginTop='8px';el.innerHTML='<strong>35D · 사회·경제 분기 상세 계측 (선택)</strong><div class="small muted">society18 내부 함수 시간 및 21계층 비교. 기본 OFF, 계측 중 시간 오버헤드 발생.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button id="v035dStart" type="button">35D 계측 시작</button><button id="v035dStop" type="button">35D 계측 종료</button><button id="v035dExport" type="button">35D JSON 저장</button></div><div id="v035dStatus"></div>';parent.appendChild(el);el.querySelector('#v035dStart').onclick=()=>{try{start(this.world);}catch(e){el.querySelector('#v035dStatus').textContent=String(e?.message||e);}};el.querySelector('#v035dStop').onclick=()=>stop();el.querySelector('#v035dExport').onclick=()=>NS.SaveSystem.export35DProfile(this.world);}const p=report();const st=el.querySelector('#v035dStatus');if(st)st.textContent=p?`관측 ${p.observedDays}일 · 분기 ${p.quarterCount}회 · ${p.active?'계측 중':'종료'}`:'계측 기록 없음';return r;};
 const hdr=UI.renderHeader;UI.renderHeader=function(...a){const r=hdr.apply(this,a);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-21',title:'Society18 Hotpath Optimization',summary:'초기 사회·경제 분기 처리에서 반복되는 최근 거래·생산 이력 검색을 국소 최적화하고 함수별 선택 계측을 추가합니다.',sections:[['사회·경제 성능',['정착지 개발 수요 평가에서 최근 거래를 한 번의 순회로 정착지별 집계합니다.','시장 생산 이력의 30일·120일 반복 탐색을 하나의 순회로 통합합니다.']],['정밀 계측',['35D 사회·경제 상세 계측을 추가합니다.','분기 사회 계층 내 대상 함수별 호출·평균·P95·배타적/포괄 시간 비교를 내보냅니다.']],['안정성',['세계 상태·RNG·경제·행정·외교 규칙의 동일성을 유지합니다.','43기술·1683열 CSV·169개 보호 블록을 그대로 유지합니다.']]]});
NS.V035D=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!current,isMeasuring,measure});
// 35B initializes its version badge at bootstrap, while later releases only
// refresh it on UI.renderHeader(). Initial load must show the actual release
// even before the user starts the simulation or triggers another render.
if(typeof document!=='undefined'){
 document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');
 if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}
}
})(window.VSim);
