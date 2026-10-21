/* Village Observer V0.35F — Development & Construction diagnostics.
   All measurements are opt-in. Production paths and RNG remain untouched. */
(function(NS){'use strict';
const VERSION='V0.35F',PREV='V0.35E',KEY='village-observer-v035f';
const from=NS.World.from,serialize=NS.World.prototype.serialize,devlog=NS.Telemetry.prototype.toJSON,save=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=serialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return from.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=devlog.apply(this,a);d.version=VERSION;return d;};
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const names=['development','tradeIndex','rowsBuild','rowsSort','projectBusy','housingAttempt','storageRequirements','storageConstruction','commerceRequirements','commerceConstruction','industryReserve31H','militaryReserve32C1'];
let current=null,latest=null;
function empty(){return{calls:0,ms:0,maxMs:0,samples:[],exceptions:0};}
function measure(name,fn){const s=current;if(!s||!s.depth||!s.metrics[name])return fn();const stat=s.metrics[name],begin=clock();let failed=false;if(name==='development')s.inDevelopment++;try{return fn();}catch(e){failed=true;throw e;}finally{if(name==='development')s.inDevelopment--; const ms=Math.max(0,clock()-begin);stat.calls++;stat.ms+=ms;stat.maxMs=Math.max(stat.maxMs,ms);if(failed)stat.exceptions++;if(stat.samples.length<10000)stat.samples.push(ms);}}
function count(name,n=1){if(current&&current.depth)current.counts[name]=(current.counts[name]||0)+n;}
function isMeasuring(){return !!current&&current.depth>0;}
function isMeasuringDevelopment(){return isMeasuring()&&current.inDevelopment>0;}
function view(s){if(!s)return latest;const out={};for(const name of names){const x=s.metrics[name],sorted=x.samples.slice().sort((a,b)=>a-b);out[name]={calls:x.calls,totalMs:+x.ms.toFixed(2),meanMs:x.calls?+(x.ms/x.calls).toFixed(4):0,maxMs:+x.maxMs.toFixed(2),p95Ms:sorted.length?+sorted[Math.min(sorted.length-1,Math.ceil(.95*sorted.length)-1)].toFixed(2):0,exceptions:x.exceptions};}
return{format:'vilob-v035f-development-v1',version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime,observedDays:s.days,quarterCount:s.quarters.length,metrics:out,counts:{...s.counts},seasonal:s.quarters,notes:['All new function timings are inclusive and overlap with development or with each other; do not sum nested measurements.','The profiled development branch executes only during 35F opt-in; the unprofiled 35E body is preserved verbatim.','StartConstruction attempts and policy reservations are not skipped; the profile does not establish an unprofiled speedup.']};}
function start(w){if(!w)throw Error('세계가 없습니다');if(current)stop();if(NS.V035E?.isActive?.()||NS.V035D?.isActive?.()||NS.V035C?.isActive?.()||NS.V035A?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('다른 계측을 종료한 뒤 시작해 주세요.');
 const p=NS.V034C1B;if(typeof p?.setEnabled!=='function')throw Error('분기 프로파일러가 없습니다');
 const s={w,active:true,startTime:w.timestamp?.()||'',finishTime:null,days:0,depth:0,inDevelopment:0,counts:{},metrics:Object.fromEntries(names.map(x=>[x,empty()])),quarters:[],lastCal:null,restore:[],wasEnabled:!!p.summarize(w)?.enabled};
 p.setEnabled(w,true);
 function wrap(obj,k,handler){const original=obj[k];if(typeof original!=='function')throw Error('35F '+k+' 없음');const wrapped=function(...args){return handler.call(this,original,args);};obj[k]=wrapped;s.restore.push([obj,k,original,wrapped]);}
 function capture(){const q=p.summarize(w);if(q?.hasProfile&&q.sampleCount&&s.lastCal!==q.calendarDay){s.lastCal=q.calendarDay;s.quarters.push({year:q.year,season:q.season,calendarDay:q.calendarDay,outerMs:q.outerMs,stages:{...q.stages},missing:q.missingCheckpoints});}}
 try{wrap(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);s.depth++;try{return orig.apply(this,args);}finally{s.depth--;}});
 wrap(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});
 }catch(e){for(const [obj,k,orig,fn] of s.restore.reverse())if(obj[k]===fn)obj[k]=orig;if(!s.wasEnabled)p.setEnabled(w,false);throw e;}
 current=s;return view(s);
}
function stop(){if(!current)return latest;const s=current;s.active=false;for(const [obj,k,orig,fn] of s.restore.reverse())if(obj[k]===fn)obj[k]=orig;if(!s.wasEnabled)NS.V034C1B.setEnabled(s.w,false);s.finishTime=s.w.timestamp?.()||'';latest=view(s);current=null;return latest;}
function report(){return current?view(current):latest;}
function download(name,obj){if(typeof document==='undefined')return;const u=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...save,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족: JSON 내보내기를 이용해 주세요. '+e.message);}},
 load(){const d=localStorage.getItem(KEY);return d?NS.World.from(JSON.parse(d)):save.load?.();},
 export(w){download(`village-observer-v035F-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035F-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35FProfile(w){const r=report();if(!r)throw Error('35F 계측을 먼저 실행해 주세요');download(`vilob-v035F-development-${w.year}y.json`,r);}
};
const UI=NS.UI?.prototype;if(UI){const rw=UI.renderWorld;UI.renderWorld=function(...args){const ret=rw.apply(this,args);if(typeof document==='undefined')return ret;const parent=document.getElementById('v035ePanel')||document.getElementById('v035dPanel');if(!parent)return ret;let el=document.getElementById('v035fPanel');if(!el){el=document.createElement('div');el.id='v035fPanel';el.className='small muted';el.style.marginTop='8px';el.innerHTML='<strong>35F · 개발·건설 병목 상세 계측 (선택)</strong><div class="small muted">개발 후보·프로젝트 검사·창고/교역소 착공 및 산업/군사 슬롯 예약. 기본 OFF.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button type="button" id="v035fStart">35F 계측 시작</button><button type="button" id="v035fStop">35F 계측 종료</button><button type="button" id="v035fExport">35F JSON 저장</button></div><div id="v035fStatus"></div>';parent.appendChild(el);el.querySelector('#v035fStart').onclick=()=>{try{start(this.world);}catch(e){el.querySelector('#v035fStatus').textContent=String(e?.message||e);}};el.querySelector('#v035fStop').onclick=()=>stop();el.querySelector('#v035fExport').onclick=()=>NS.SaveSystem.export35FProfile(this.world);}const r=report(),status=el.querySelector('#v035fStatus');if(status)status.textContent=r?`관측 ${r.observedDays}일 · 분기 ${r.quarterCount}회 · 후보 ${(r.counts.candidateVisits||0).toLocaleString()}회 · ${r.active?'계측 중':'종료'}`:'계측 기록 없음';return ret;};
const rh=UI.renderHeader;UI.renderHeader=function(...args){const out=rh.apply(this,args);syncBadge();return out;};}
function syncBadge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-21',title:'Development & Construction Hotpath',summary:'개발 후보·건설 프로젝트·착공 및 산업·군사 건설 슬롯 예약의 병목을 구간별로 조사합니다. 기존 게임 결과는 그대로 유지합니다.',sections:[['개발 진단',['35F 선택형 계측으로 개발 후보·정렬·프로젝트 검사 및 창고·교역소 착공의 비용을 분리합니다.','산업시설·군사시설 슬롯 예약 판단을 별도로 추적합니다.']],['게임 동등성',['선택형 계측 OFF일 때 개발 판단의 35E 원래 구현을 그대로 실행합니다.','AI 건설 순서, 이벤트, 비용, RNG와 건설 실패의 부수효과를 생략하지 않습니다.']],['표시·유지',['최초 실행부터 좌상단 버전을 V0.35F로 표시합니다.','기술 43개, CSV 1683열, 보호 레거시 169블록을 유지합니다.']]]});
NS.V035F=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!current,isMeasuring,isMeasuringDevelopment,measure,count});
syncBadge();
})(window.VSim);
