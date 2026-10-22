/* Village Observer V0.35F1 — Housing construction decision simplification.
 * A national seasonal demandDevelopment pass attempts the existing global
 * buildHouse implementation at most once; storage/commerce remain eligible.
 * Economic conservation, build cost, slot and project validation are unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.35F1',PREV='V0.35F',KEY='village-observer-v035f1';
const previousFrom=NS.World.from,previousSerialize=NS.World.prototype.serialize;
const previousTelemetry=NS.Telemetry.prototype.toJSON,previousSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const d=previousSerialize.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(d,...args){return previousFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const d=previousTelemetry.apply(this,args);d.version=VERSION;return d;};
function download(name,obj){if(typeof document==='undefined')return;const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function currentProfile(){const raw=NS.V035F.report();if(!raw)return null;return{...raw,format:'vilob-v035f1-development-v1',version:VERSION,notes:[
 '35F1: at most one global housing construction attempt per nation per seasonal demandDevelopment decision (including profiled path).',
 'housingEligible is the number of qualifying tile candidates; housingAttemptStarted35F1 is the actual number of attempts; housingSkippedRepeat35F1 counts repeat candidates deliberately skipped.',
 'Warehouse/trading-post decisions continue after a failed housing attempt; normal build checks, resource costs and project slots remain authoritative.',
 'Simulation decisions may differ from 35F; unprofiled same-save A/B is required for performance claims.',
 ...(raw.notes||[]).filter(x=>!x.includes('unprofiled 35E body is preserved verbatim')&&!x.includes('attempts and policy reservations are not skipped'))]};}
NS.SaveSystem={...previousSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족: JSON 내보내기를 이용해 주세요. '+e.message);}},
 load(){const str=localStorage.getItem(KEY);return str?NS.World.from(JSON.parse(str)):previousSave.load?.();},
 export(w){download(`village-observer-v035F1-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035F1-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35FProfile(w){const r=currentProfile();if(!r)throw Error('계측을 먼저 실행해 주세요');download(`vilob-v035F1-development-${w.year}y.json`,r);},
 export35F1Profile(w){return this.export35FProfile(w);}
};
function syncBadge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
const ui=NS.UI?.prototype;if(ui){const oldHeader=ui.renderHeader;ui.renderHeader=function(...args){const r=oldHeader.apply(this,args);syncBadge();return r;};const oldWorld=ui.renderWorld;ui.renderWorld=function(...args){const r=oldWorld.apply(this,args);if(typeof document!=='undefined'){const panel=document.getElementById('v035fPanel');if(panel){const heading=panel.querySelector('strong');if(heading)heading.textContent='35F1 · 개발·건설 병목 상세 계측 (선택)';const exportButton=document.getElementById('v035fExport');if(exportButton)exportButton.textContent='35F1 JSON 저장';const helper=panel.querySelector('.small.muted');if(helper)helper.textContent='주택 건설 최대 1회/국가·분기 개발 판단 · 창고/교역소 검사 유지 · 기본 OFF';}}return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-22',title:'Housing Retry Simplification',summary:'분기 개발 판단당 주택 건설 시도를 국가별 최대 1회로 제한해 반복된 실패 탐색을 줄입니다. 창고·교역소 건설 판단과 모든 실제 비용·건설 슬롯 검사는 유지합니다.',sections:[['개발 AI 단순화',['국가별 분기 개발 판단에서 첫 주택 건설 시도 후에는 같은 판단 안의 추가 주택 시도를 생략합니다.','주택 건설 실패 후에도 창고 및 교역소 후보를 계속 확인합니다.','기존 주택 건설 함수가 담당하는 신축·개축·이주·토지정비·자원·건설 슬롯 규칙은 변경하지 않습니다.']],['성능 및 검증',['35F 계측에서 15번의 국가 개발 판단 동안 주택 건설 시도 464회 중 실패 463회, 주택 시도 시간 누적 6,839.6ms가 관찰됐습니다.','35F1 계측에서 주택 요청과 반복 생략 건수를 별도로 확인할 수 있습니다.','주택 건설 AI 결정과 RNG 순서는 35F와 달라질 수 있으며 경제·군사·회계 일관성은 유지해야 합니다.']],['유지',['좌상단 최초 화면 및 저장 파일 버전을 V0.35F1로 표시합니다.','기술 43개, CSV 1683열, 보호 레거시 169블록은 그대로 유지합니다.']]]});
NS.V035F1=Object.freeze({version:VERSION,report:currentProfile});
syncBadge();
})(window.VSim);
