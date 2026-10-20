/* Village Observer V0.34H4B — settlement/nation border refinement + world nation markers + overflow provenance validation.
 * Rule changes: NONE. Pre-H4A history is observation-only; do not delete or fabricate resources.
 */
(function(NS){'use strict';
const VERSION='V0.34H4B',PREV='V0.34H4A',KEY='village-observer-v034h4b';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldSave=NS.SaveSystem,oldToJSON=NS.Telemetry.prototype.toJSON;
NS.World.prototype.serialize=function(...args){const result=oldSerialize.apply(this,args);result.version=VERSION;return result;};
NS.World.from=function(data,...args){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...args);};
const saveFile=(name,obj)=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},
 load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},
 export(w){saveFile(`village-observer-v034H4B-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){saveFile(`village-observer-v034H4B-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
NS.Telemetry.prototype.toJSON=function(...args){const data=oldToJSON.apply(this,args);data.version=VERSION;
 if(data.worldSummary){data.worldSummary.v034h4bRevision='border-thickness-minus-30pc-world-nation-color-markers-and-stock-provenance-tests';
 data.worldSummary.v034h4bStoragePolicy='Over-capacity physical stone remains conserved on tile abandonment/reclaim; no stock correction; use H4A observer for preexisting overflows.';}
 return data;};
NS.RELEASE_VERSION=VERSION;
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
const P=NS.UI?.prototype;if(P){const oldHeader=P.renderHeader;P.renderHeader=function(...args){const out=oldHeader.apply(this,args);refresh();return out;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'경계 가독성·세계 국가색·석재 저장 경로 검증',summary:'정착지 전체 경계와 검정 국경 모두 약 30% 축소, 세계 국가 비교에 실제 국가색 수직 막대 추가, 석재 재고의 포기·재개척·병합 경로 재현 및 보존 정책 유지.',sections:[['지도',['정착지 경계 전체 모드의 내부 색상선과 외곽 윤곽선은 기존 대비 70%로 조정합니다.','서로 다른 국가 사이의 최종 검은색 테두리도 기존 대비 70%로 줄입니다.','선택 강조 모드와 기타 지도 모드는 유지합니다.']],['세계',['세계 국가 비교의 국가명 왼쪽에 통계 탭과 동일한 국가색 막대를 표시합니다.','실제 국가의 국가색, 정렬, 멸망국 필터, 국가 탭 이동은 유지합니다.']],['석재',['기존 타일의 석재는 영토 포기·재개척 후에도 실물로 남을 수 있습니다.','단순 과잉 재고를 자원 생성 오류로 간주하지 않으며 초과분을 삭제하지 않습니다.','H4A 경량 진단과 신규 초과 관측은 계속 사용할 수 있습니다.']],['검증',['H4A 대비 게임 상태와 RNG 동일성, 건물·정착지 연결·세이브 회귀를 확인합니다.']]]});
NS.V034H4B=Object.freeze({version:VERSION,boundaryFactor:0.70,storagePolicy:'PRESERVE_STOCK_ON_ABANDONMENT'});
try{refresh();}catch(e){console.warn('H4B init',e);}
})(window.VSim);
