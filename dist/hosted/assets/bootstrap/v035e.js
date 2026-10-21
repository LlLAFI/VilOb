/* Village Observer V0.35E — Housing Hotpath V1.
 * Production optimizations are build transforms; only opt-in profiling gathers
 * call-path timing, counters and end-state hints. No gameplay skips or day cache.
 */
(function(NS){'use strict';
const VERSION='V0.35E',PREV='V0.35D',KEY='village-observer-v035e';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDevlog=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const out=oldSerialize.apply(this,args);out.version=VERSION;return out;};
NS.World.from=function(d,...args){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const out=oldDevlog.apply(this,args);out.version=VERSION;return out;};
const now=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const metrics=['demandDevelopment','buildHouseTop','buildHouseV17','housingRowsD3','tryHousingResolveD3','orderedHousingScopeD3','adminRegionKeyD3','tileBusyD3'];
let current=null,previous=null;
function empty(){return {calls:0,success:0,failure:0,exceptions:0,inclusiveMs:0,exclusiveMs:0,maxMs:0,samples:[]};}
function measure(name,cb){const s=current;if(!s||s.seasonDepth<1||!s.metrics[name])return cb();const a=s.metrics[name],begin=now(),frame={child:0};s.frames.push(frame);let failed=false,returned=false,result;try{result=cb();returned=true;return result;}catch(e){failed=true;throw e;}finally{const ms=Math.max(0,now()-begin);s.frames.pop();a.calls++;a.inclusiveMs+=ms;a.exclusiveMs+=Math.max(0,ms-frame.child);a.maxMs=Math.max(a.maxMs,ms);if(failed)a.exceptions++;if(returned){if(result)a.success++;else a.failure++;}if(a.samples.length<10000)a.samples.push(ms);if(s.frames.length)s.frames[s.frames.length-1].child+=ms;}}
function housingEffectsState(v,w){return{
 telemetry:Number(w?.telemetry?.entries?.length||0),
 reserveBlocks:Number(v?.v32d3Housing?.reserveBlocks||0),
 housingActions:Number(v?.v32d3Housing?.actions||0),
 relocations:Number(v?.v32d3Housing?.relocations||0),
 construction:Number(v?.constructionProjects?.length||0),
 land:Number(v?.landDevelopmentProjects?.length||0),
 upgrade:Number(v?.buildingUpgradeProjects?.length||0)
};}
function measureHouseCall(v,w,fn){const s=current;if(!s||s.seasonDepth===0)return fn();const before=housingEffectsState(v,w);let returned=false,value;
 try{value=measure('buildHouseTop',fn);returned=true;return value;}
 finally{const e=s.houseEffects,after=housingEffectsState(v,w);if(returned){if(value)e.success++;else e.failure++;}else e.exceptions++;
 if(returned&&!value){if(after.telemetry!==before.telemetry)e.failedWithTelemetry++;
  if(after.reserveBlocks!==before.reserveBlocks||after.housingActions!==before.housingActions||after.relocations!==before.relocations)e.failedWithHousingState++;
  if(after.construction!==before.construction||after.land!==before.land||after.upgrade!==before.upgrade)e.failedWithProjectCount++;}
 }}
function isMeasuring(){return !!current&&current.seasonDepth>0;}
function view(s){if(!s)return previous;const out={};for(const id of metrics){const v=s.metrics[id],sort=v.samples.slice().sort((a,b)=>a-b);out[id]={calls:v.calls,success:v.success,failure:v.failure,exceptions:v.exceptions,inclusiveMs:+v.inclusiveMs.toFixed(2),exclusiveMs:+v.exclusiveMs.toFixed(2),meanMs:v.calls?+(v.inclusiveMs/v.calls).toFixed(4):0,maxMs:+v.maxMs.toFixed(2),p95Ms:sort.length?+sort[Math.ceil(sort.length*.95)-1].toFixed(2):0};}return{format:'vilob-v035e-housing-v1',houseEffects:{...s.houseEffects},version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime,observedDays:s.days,quarterCount:s.quarters.length,metrics:out,seasonal:s.quarters,notes:['Only calls within seasonalTick are measured; inclusive timings of nested functions overlap.','Success/failure classify truthiness of returned values; only buildHouse and tryHousingResolveD3 are meaningful as action outcomes.','No production buildHouse attempts or events are skipped.','The 21-layer seasonal profiler is enabled during this opt-in session; do not claim unprofiled speedup from this report.']};}
function start(w){if(!w)throw Error('세계가 없습니다');if(current)stop();if(NS.V035D?.isActive?.()||NS.V035C?.isActive?.()||NS.V035A?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('35A~35D 계측을 먼저 종료해 주세요.');const p=NS.V034C1B;if(!p?.setEnabled)throw Error('분기 계층 계측기가 없습니다.');
 const s={w,active:true,startTime:w.timestamp?.()||'',finishTime:null,days:0,seasonDepth:0,frames:[],quarters:[],lastCal:null,metrics:Object.fromEntries(metrics.map(k=>[k,empty()])),houseEffects:{success:0,failure:0,exceptions:0,failedWithTelemetry:0,failedWithHousingState:0,failedWithProjectCount:0},restore:[],wasEnabled:!!p.summarize(w)?.enabled};
 p.setEnabled(w,true);
 function wrap(obj,key,handler){const orig=obj[key];if(typeof orig!=='function')throw Error('35E missing '+key);const wrapped=function(...args){return handler.call(this,orig,args);};obj[key]=wrapped;s.restore.push([obj,key,orig,wrapped]);}
 function capture(){const q=p.summarize(w);if(q?.hasProfile&&q.sampleCount&&s.lastCal!==q.calendarDay){s.lastCal=q.calendarDay;s.quarters.push({year:q.year,season:q.season,calendarDay:q.calendarDay,outerMs:q.outerMs,stages:{...q.stages},missing:q.missingCheckpoints});}}
 try{wrap(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);s.seasonDepth++;try{return orig.apply(this,args);}finally{s.seasonDepth--;}});
 wrap(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});}
 catch(e){for(const [obj,key,orig,wrapped] of s.restore.reverse())if(obj[key]===wrapped)obj[key]=orig;if(!s.wasEnabled)p.setEnabled(w,false);throw e;}
 current=s;return view(s);
}
function stop(){if(!current)return previous;const s=current;s.active=false;for(const [obj,key,orig,wrapped] of s.restore.reverse())if(obj[key]===wrapped)obj[key]=orig;if(!s.wasEnabled)NS.V034C1B.setEnabled(s.w,false);s.finishTime=s.w.timestamp?.()||'';previous=view(s);current=null;return previous;}
function report(){return current?view(current):previous;}
function download(name,data){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족: JSON으로 내보내 주세요. '+e.message);}},
 load(){const data=localStorage.getItem(KEY);return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v035E-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035E-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35EProfile(w){const r=report();if(!r)throw Error('35E 계측을 먼저 실행해 주세요');download(`vilob-v035E-housing-${w.year}y.json`,r);}
};
const UI=NS.UI?.prototype;if(UI){const prevWorld=UI.renderWorld;UI.renderWorld=function(...args){const out=prevWorld.apply(this,args);if(typeof document==='undefined')return out;const parent=document.getElementById('v035dPanel')||document.getElementById('v035cPanel');if(!parent)return out;let el=document.getElementById('v035ePanel');if(!el){el=document.createElement('div');el.id='v035ePanel';el.className='small muted';el.style.marginTop='8px';el.innerHTML='<strong>35E · 주거·건설 분기 상세 계측 (선택)</strong><div class="small muted">D3 주거 해결과 V0.17 주택 건설, 후보 목록 및 주거 범위 연산을 측정. 기본 OFF.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button id="v035eStart" type="button">35E 계측 시작</button><button id="v035eStop" type="button">35E 계측 종료</button><button id="v035eExport" type="button">35E JSON 저장</button></div><div id="v035eStatus"></div>';parent.appendChild(el);el.querySelector('#v035eStart').onclick=()=>{try{start(this.world);}catch(e){el.querySelector('#v035eStatus').textContent=String(e?.message||e);}};el.querySelector('#v035eStop').onclick=()=>stop();el.querySelector('#v035eExport').onclick=()=>NS.SaveSystem.export35EProfile(this.world);}const r=report(),label=el.querySelector('#v035eStatus');if(label)label.textContent=r?`관측 ${r.observedDays}일 · 분기 ${r.quarterCount}회 · ${r.active?'계측 중':'종료'}`:'계측 기록 없음';return out;};
 const prevHdr=UI.renderHeader;UI.renderHeader=function(...args){const out=prevHdr.apply(this,args);syncVersion();return out;};}
function syncVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-21',title:'Housing Demand Hotpath',summary:'주거 개발 수요의 중복 주민 조회와 D3 후보 거리 재계산을 제거하고 선택형 건설 계측을 추가합니다. 최초 화면 버전 표기를 수정합니다.',sections:[['주거 성능',['V0.17 건설 후보의 미사용 주민 수 집계를 제거합니다.','D3 주거 후보 순서 계산에서 같은 거리의 중복 조회를 제거합니다.','주택 건설 시도·실패·이벤트·RNG 순서는 바꾸지 않습니다.']],['진단',['V0.35E 주거·건설 분기 계측 기능을 제공합니다.','D3 후보, 범위, 건설 판단 및 이전 버전 건설 로직을 분리해서 측정합니다.']],['표시 및 안정성',['최초 화면 좌상단 버전 표시를 최신 릴리스로 갱신합니다.','43기술·CSV 1683열·보호 레거시 169블록은 그대로 유지합니다.']]]});
NS.V035E=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!current,isMeasuring,measure,measureHouseCall});
syncVersion();
})(window.VSim);
