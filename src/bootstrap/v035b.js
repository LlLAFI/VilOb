/* Village Observer V0.35B — Administrative Logistics Hotpath Optimization.
 * The single admin-model lookup is applied in tools/35b-transform.mjs to D2's
 * lexical sameInstitutionD2 helper. All gameplay constants/route rules remain H35A.
 * Optional diagnostic instrumentation is OFF by default and never enters Save JSON.
 */
(function(NS){'use strict';
const VERSION='V0.35B',PREV='V0.35A',KEY='village-observer-v035b';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDevlog=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=oldSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=oldDevlog.apply(this,a);d.version=VERSION;return d;};
let diagnostic=null,diagnosticLast=null;
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
function begin(){if(diagnostic)return result();const orig=NS.V032D?.adminModel;if(typeof orig!=='function')throw new Error('Administrative model not available');
 const scope={orig,calls:0,force:0,measured:0,sum:0,max:0,started:clock()};
 const wrapped=function(...args){scope.calls++;if(args[2])scope.force++;const measure=scope.calls%16===0;if(!measure)return orig.apply(this,args);const t=clock();try{return orig.apply(this,args);}finally{const ms=clock()-t;scope.measured++;scope.sum+=ms;scope.max=Math.max(scope.max,ms);}};
 scope.wrapped=wrapped;NS.V032D.adminModel=wrapped;diagnostic=scope;return result();}
function end(){if(diagnostic){const s=diagnostic;if(NS.V032D.adminModel===s.wrapped)NS.V032D.adminModel=s.orig;diagnosticLast={...result(),active:false};diagnostic=null;}return diagnosticLast;}
function result(){const s=diagnostic;if(!s)return diagnosticLast||null;return {version:VERSION,active:true,adminModelCalls:s.calls,forcedCalls:s.force,sampledCalls:s.measured,meanSampleMs:s.measured?s.sum/s.measured:0,estimatedInclusiveMs:s.measured?s.sum/s.measured*s.calls:0,maxSampleMs:s.max,elapsedMs:clock()-s.started,note:'Opt-in; inclusive sampled time overlaps other probes; no simulation RNG consumed.'};}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간이 부족합니다. JSON으로 내보내 주세요. '+e.message);}},
 load(){const str=localStorage.getItem(KEY);return str?NS.World.from(JSON.parse(str)):oldSave.load?.();},
 export(w){download(`village-observer-v035B-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035B-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35AProfile(w){const d=NS.V035A?.report();if(!d)throw Error('먼저 계측을 시작해 주세요');download(`vilob-v035B-profile-${w.year}y.json`,{...d,version:VERSION,v035bAdminDetail:result()});}
};
const P=NS.UI?.prototype;
if(P){const oldWorld=P.renderWorld;P.renderWorld=function(...args){const out=oldWorld.apply(this,args);if(typeof document==='undefined')return out;
  const parent=document.getElementById('v035aProfilePanel');if(!parent)return out;
  let panel=document.getElementById('v035bAdminPanel');if(!panel){panel=document.createElement('div');panel.id='v035bAdminPanel';panel.className='small muted';panel.innerHTML='<div style="margin:6px 0">35B · 행정 모델 호출 상세계측 (선택)</div><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" id="v035bBegin">행정 계측 시작</button><button type="button" id="v035bEnd">행정 계측 종료</button></div><div id="v035bAdminStats"></div>';parent.appendChild(panel);panel.querySelector('#v035bBegin').onclick=()=>{begin();};panel.querySelector('#v035bEnd').onclick=()=>{end();};}
  const s=result();const stats=panel.querySelector('#v035bAdminStats');if(stats)stats.textContent=s?`호출 ${s.adminModelCalls}회 · 추정 ${s.estimatedInclusiveMs?.toFixed(1)||0}ms · ${s.active?'계측 중':'종료'}`:'계측 기록 없음';return out;};}
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
if(P){const oldHead=P.renderHeader;P.renderHeader=function(...a){const r=oldHead.apply(this,a);refresh();return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'Administrative Logistics Hotpath Optimization',summary:'내부 물류의 동일 호출 안에서 행정 모델 중복 평가를 제거합니다. 규칙과 캐시 수명은 유지합니다.',sections:[['성능',['sameInstitutionD2의 출발·도착지 행정 모델 호출을 한 번으로 통합합니다.','행정 모델 부수효과를 고려해 하루 단위 전역 캐시는 도입하지 않습니다.']],['검증',['행정 모델의 별도 선택 계측을 지원합니다.','물류·행정권·자원·Gold·RNG·AI·전쟁 규칙과 기존 35A 성능 계측은 유지합니다.']]]});
NS.V035B=Object.freeze({version:VERSION,startDetail:begin,stopDetail:end,reportDetail:result});
try{refresh();}catch(_){}
})(window.VSim);
