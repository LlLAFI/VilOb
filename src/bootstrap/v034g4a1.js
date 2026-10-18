/* V0.34G4A1 — Statistics dropdown DOM stability hotfix.
 * Only UI option text stability and release identity; no simulation rules changed.
 * The G1 bootstrapping layer now compares the caption before mutating option.textContent.
 * F5A1 continues to defer statistics redraw while the select is active.
 */
(function(NS){'use strict';
const VERSION='V0.34G4A1',PREV='V0.34G4A',KEY='village-observer-v034g4a1';
const previousSerialize=NS.World.prototype.serialize,previousFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=previousSerialize.call(this);d.version=VERSION;d.v034g4a1={revision:'stats-dropdown-option-dom-stability',simulationUnchanged:true};return d;};
NS.World.from=function(d){return previousFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const jsonPrev=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonPrev.call(this,w);d.version=VERSION;d.worldSummary.v034g4a1={revision:'stats-dropdown-option-dom-stability',simulationUnchanged:true,statsSelectorsProtected:true};return d;};
function verify(w){const parent=NS.V034G4A.verify(w),t={...parent.tests,version:NS.RELEASE_VERSION===VERSION,statsCaption:typeof document==='undefined'||document.getElementById('statsScope')?.querySelector('option[value="settlement"]')?.textContent==='타일 (기존 장기 통계)'};
return {version:VERSION,ok:Object.values(t).every(Boolean),tests:t};}
function audit(w){return{...NS.V034G4A.audit(w),version:VERSION,integrity:verify(w)};}
function status(){const c=verify(window.villageObserver?.world);if(typeof document!=='undefined'){
 document.title='Village Observer '+VERSION;
 const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.setAttribute('data-runtime-version',VERSION);}
 const x=document.getElementById('g3aRuntimeIntegrity');if(x){x.textContent=c.ok?'✓ G4A1 런타임 · G4A 밸런스 유지 · 통계 드롭다운 안정화':'⚠ G4A1 무결성: '+Object.keys(c.tests).filter(k=>!c.tests[k]).join(', ');x.style.color=c.ok?'#a9e7ca':'#ffe0a1';x.style.border='1px solid '+(c.ok?'#235a4c':'#a64c39');}}
 return c;}
const priorSave=NS.SaveSystem;
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g4a','village-observer-v034g4','village-observer-v034g3b','village-observer-v034g3a','village-observer-v034g3'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){const data=JSON.stringify(w.serialize()),a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.href=u;a.download=`village-observer-v034G4A1-save-${w.year}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);},
 exportDevJSON(w){const data=JSON.stringify(w.telemetry.toJSON(w)),a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.href=u;a.download=`village-observer-v034G4A1-devlog-${w.telemetry.sessionId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'통계 범주 드롭다운 새로고침 수정',summary:'게임 진행 중 세계/국가/타일(기존 장기 통계) 드롭다운이 다시 만들어져 닫히는 UI 문제를 해결합니다. 식량·허기 밸런스와 시뮬레이션은 G4A와 같습니다.',sections:[['통계 화면',['G1 용어 교체 코드가 매 프레임 같은 option.textContent를 다시 할당하던 회귀를 수정했습니다.','드롭다운이 열린 동안 옵션 DOM을 변경하지 않고, 사용자가 실제로 값을 바꿀 때만 갱신합니다.','세계·국가·타일(기존 장기 통계) 선택값과 차트 기능은 보존합니다.']],['규칙·세이브',['G4A의 식량 수요 0.28/0.39, 허기 변화, G4 기술 39개, G3B 병합 1일 기준, 군사·AI·RNG·회계 규칙은 변경하지 않았습니다.','G4A 등 이전 세이브를 불러올 수 있으며 G4A1 저장 형식은 별도 버전명을 사용합니다.']]]});
NS.V034G4A1=Object.freeze({version:VERSION,verify,audit,refresh:status});
if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=old.apply(this,args);status();return r;};}
status();
})(window.VSim);
