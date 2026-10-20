/* Village Observer V0.35C — Seasonal & Administrative Hotpath Diagnostics.
 * Explicitly opt-in.  Preserve the side effects of adminModel on every call.
 * 35C does not introduce long-lived administration caches or gameplay changes.
 */
(function(NS){'use strict';
const VERSION='V0.35C',PREV='V0.35B',KEY='village-observer-v035c';
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from,prevDevlog=NS.Telemetry.prototype.toJSON,priorSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const o=prevSerialize.apply(this,args);o.version=VERSION;return o;};
NS.World.from=function(o,...args){return prevFrom.call(this,o?.version===VERSION?{...o,version:PREV}:o,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const o=prevDevlog.apply(this,args);o.version=VERSION;return o;};
const now=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
let session=null,latest=null;
const groups=['logistics','seasonal','daily','other'];
const fresh=()=>({calls:0,samples:0,sampleMs:0,maxMs:0,forced:0});
function snapshot(s){
 if(!s)return latest;
 const admin={};for(const k of groups){const x=s.admin[k];admin[k]={...x,meanSampleMs:x.samples?+(x.sampleMs/x.samples).toFixed(5):0,estimatedInclusiveMs:x.samples?+(x.sampleMs/x.samples*x.calls).toFixed(3):0};}
 const labels=NS.V034C1B?.LABELS||{};
 const stages=Object.entries(s.stages).map(([id,x])=>({id,label:labels[id]||id,totalMs:+x.toFixed(3),quarters:s.quarters.length})).sort((a,b)=>b.totalMs-a.totalMs);
 return {format:'vilob-v035c-season-admin-v1',version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime||null,observedDays:s.days,quarterCount:s.quarters.length,adminModel:{totalCalls:groups.reduce((v,k)=>v+s.admin[k].calls,0),groups:admin,classification:'Only public NS.V032D.adminModel invocations are counted (lexical adminModel32D calls inside old scripts are not wrapped); nested methods attributed to innermost tagged scope; inclusive samples not additive to other scopes'},seasonal:{quarters:s.quarters.map(q=>({...q})),stages,legacyProfilerNote:'C1B checkpoint increments are disjoint WITHIN each quarter; never add E9/E10 overlapping timers or administration inclusive time.'},f0Metric:'F0 SIM/BATCH (10x) remains separate from timed method samples',statusNote:'Administration model full state-update path remains active; no global or day cache.'};
}
function start(w){
 if(!w)throw Error('세계가 없습니다');if(session)stop();if(NS.V035A?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('35A/35B 계측을 먼저 종료한 다음 35C를 시작해 주세요.');
 const p=NS.V034C1B,ad=NS.V032D;if(typeof p?.setEnabled!=='function'||typeof ad?.adminModel!=='function')throw Error('35C profiler prerequisite unavailable');
 const s={world:w,active:true,startTime:w.timestamp?.()||'',startNow:now(),days:0,lastCal:null,quarters:[],stages:{},admin:Object.fromEntries(groups.map(k=>[k,fresh()])),restores:[],stack:[]};
 s.wasEnabled=!!p.summarize(w)?.enabled;p.setEnabled(w,true);
 const install=(owner,key,callback)=>{const original=owner?.[key];if(typeof original!=='function')throw Error('35C cannot instrument '+key);const wrapper=function(...args){return callback.call(this,original,args);};owner[key]=wrapper;s.restores.push([owner,key,original,wrapper]);};
 function tag(group,orig,args,ctx){s.stack.push(group);try{return orig.apply(ctx,args);}finally{s.stack.pop();}}
 function capture(){const v=p.summarize(w);if(!v?.hasProfile||!v.sampleCount||s.lastCal===v.calendarDay)return;s.lastCal=v.calendarDay;const q={year:v.year,season:v.season,calendarDay:v.calendarDay,outerMs:v.outerMs,sampleCount:v.sampleCount,missing:v.missingCheckpoints,stages:{...v.stages}};s.quarters.push(q);for(const [key,value] of Object.entries(v.stages||{}))s.stages[key]=(s.stages[key]||0)+Number(value||0);}
 try{
  install(NS.Village.prototype,'internalLogisticsCapacity',function(orig,args){if(this._world!==w)return orig.apply(this,args);return tag('logistics',orig,args,this);});
  install(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);return tag('seasonal',orig,args,this);});
  install(NS.Village.prototype,'dailyTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);return tag('daily',orig,args,this);});
  install(ad,'adminModel',function(orig,args){if(args[1]!==w)return orig.apply(this,args);const group=s.stack.at(-1)||'other',stat=s.admin[group],n=++stat.calls;if(args[2])stat.forced++;if(n%16!==0)return orig.apply(this,args);const tick=now();try{return orig.apply(this,args);}finally{const time=Math.max(0,now()-tick);stat.samples++;stat.sampleMs+=time;stat.maxMs=Math.max(stat.maxMs,time);}});
  install(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});
 }catch(err){for(const [obj,k,old,f] of s.restores.reverse())if(obj[k]===f)obj[k]=old;if(!s.wasEnabled)p.setEnabled(w,false);throw err;}
 session=s;return snapshot(s);
}
function stop(){if(!session)return latest;const s=session;s.active=false;
 for(const [obj,k,old,fn] of s.restores.reverse())if(obj[k]===fn)obj[k]=old;
 if(!s.wasEnabled)NS.V034C1B.setEnabled(s.world,false);
 s.finishTime=s.world.timestamp?.()||'';latest=snapshot(s);session=null;return latest;
}
function report(){return session?snapshot(session):latest;}
function download(name,obj){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(err){throw Error('저장 공간 부족: JSON으로 내보내 주세요. '+err.message);}},
 load(){const x=localStorage.getItem(KEY);return x?NS.World.from(JSON.parse(x)):priorSave.load?.();},
 export(w){download(`village-observer-v035C-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035C-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35AProfile(w){const p=NS.V035A?.report();if(!p&&!report())throw Error('먼저 계측을 시작해 주세요');download(`vilob-v035C-profile-${w.year}y.json`,{...(p||{}),version:VERSION,v035bAdminDetail:NS.V035B?.reportDetail?.()||null,v035cDetail:report()});},
 export35CProfile(w){const x=report();if(!x)throw Error('먼저 35C 계측을 실행해 주세요');download(`vilob-v035C-season-admin-${w.year}y.json`,{...x,v035aProfile:NS.V035A?.report()||null,v035bAdminDetail:NS.V035B?.reportDetail?.()||null});}
};
const UI=NS.UI?.prototype;
if(UI){const before=UI.renderWorld;UI.renderWorld=function(...args){const out=before.apply(this,args);if(typeof document==='undefined')return out;const parent=document.getElementById('v035bAdminPanel')||document.getElementById('v035aProfilePanel');if(!parent)return out;
 let box=document.getElementById('v035cPanel');if(!box){box=document.createElement('div');box.id='v035cPanel';box.className='small muted';box.style.marginTop='8px';box.innerHTML='<strong>35C · 분기·행정 정밀 추적 (선택)</strong><div class="small muted">분기별 과거 래퍼 비용 및 호출 영역. 기본 OFF, 계측에는 별도 부담이 있습니다.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button type="button" id="v035cStart">35C 계측 시작</button><button type="button" id="v035cStop">35C 계측 종료</button><button type="button" id="v035cExport">35C JSON 저장</button></div><div id="v035cStats"></div>';parent.appendChild(box);box.querySelector('#v035cStart').onclick=()=>{try{start(this.world);}catch(e){const area=box.querySelector('#v035cStats');if(area)area.textContent=String(e?.message||e);}};box.querySelector('#v035cStop').onclick=()=>stop();box.querySelector('#v035cExport').onclick=()=>NS.SaveSystem.export35CProfile(this.world);}
 const r=report(),stats=box.querySelector('#v035cStats');if(stats)stats.textContent=r?`관측 ${r.observedDays}일 · 분기 ${r.quarterCount}회 · 행정 ${r.adminModel.totalCalls}회 · ${r.active?'계측 중':'종료'}`:'계측 기록 없음';return out;};
 const hdr=UI.renderHeader;UI.renderHeader=function(...a){const r=hdr.apply(this,a);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}return r;};
}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'Seasonal & Administrative Hotpath V2',summary:'관리 상태의 시점·이벤트를 유지하고 최신 행정권 결과의 타일 인덱스를 활용하며, 분기별 레거시 처리 비용을 정밀 분석할 수 있습니다.',sections:[['행정',['동일 모델 결과의 byTile 인덱스를 이용해 물류 행정권 소속 조회를 가속합니다.','행정 상태 갱신과 이벤트 발생을 생략하는 장기 캐시는 도입하지 않았습니다.']],['성능 관측',['35C 정밀 추적으로 분기별 C1B 레거시 계층 비용을 누적 보고합니다.','행정 모델 호출을 물류·분기·일일·기타 영역으로 구분합니다.']],['유지',['기존 기술 43개, CSV 1683열, 원본 레거시 169블록, H4C 물류 및 국가 경계 표시를 유지합니다.']]]});
NS.V035C=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!session});
})(window.VSim);
