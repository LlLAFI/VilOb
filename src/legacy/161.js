
/* V0.34C1E-HF1 — UI/version bootstrap + existing C1E CSV & notes shape repairs.
   No simulation, AI, RNG, scoring, or physical World logic changes. */
(function(NS){'use strict';
const VERSION='V0.34C1E-HF1',PREVIOUS='V0.34C1E';
// C1E patch-note entry is repaired at its source. Validate this new entry's
// [heading, string[]] data contract before the dynamic D2 renderer reads it.
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(n=>n.version===VERSION)){
 NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'C1E UI + CSV Integrity Hotfix',summary:'초기 버전 표시, 패치노트 창 열기 오류, C1E Snapshot CSV의 국가별 행-스냅샷 시간축 매칭을 수정합니다. C1E AI 성능 최적화와 시뮬레이션 규칙은 변경하지 않았습니다.',sections:[['UI',['새 게임 첫 화면부터 올바른 HF1 버전을 표시합니다.','패치노트 항목을 기존 [제목, 내용 배열] 규격으로 통일하여 버전 배지 클릭 시 창이 정상적으로 열립니다.']],['관측 CSV',['C1E 신규 9개 카운터를 각 스냅샷의 국가별 행에 일치시킵니다. 기존 열 이름/수와 국가별 행 정렬은 유지합니다.']],['안전·호환',['C1E 및 하위 버전 세이브를 계속 지원하며 AI 점수·난수 소비·Person·장비·Settlement·전투 규칙은 그대로 유지합니다.']]]});
}
const serializePrev=NS.World.prototype.serialize,fromPrev=NS.World.from;
NS.World.prototype.serialize=function(){const d=serializePrev.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return fromPrev(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
const jsonPrev=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonPrev.call(this,w);d.version=VERSION;d.worldSummary.v034c1eHF1Revision='patch-notes-version-initialization-csv-row-alignment';return d;};
const savePrev=NS.SaveSystem;
function download(name,content,mime='application/json'){
 const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
NS.SaveSystem={...savePrev,
 save(w){try{localStorage.setItem('village-observer-v034c1e-hf1',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1e-hf1');return data?NS.World.from(JSON.parse(data)):savePrev.load?.();},
 export(w){download(`village-observer-v034C1E-HF1-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1E-HF1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);if(check&&!check.ok)throw Error('C1E-HF1 CSV schema mismatch '+JSON.stringify(check.bad?.slice(0,3)));download(`village-observer-v034C1E-HF1-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const headerPrev=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(){const r=headerPrev.call(this);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const status=this.q?.('runtimeStatus');if(status)status.textContent='✓ '+VERSION+' · AI 성능 최적화 · 패치노트/CSV 안정화';return r;};
}
NS.V034C1EHF1={version:VERSION,scope:'patch notes, initial header, C1E CSV row alignment only'};
// Critical: initial UI instance was created long before C1E/C1E-HF1 scripts.
// Re-render the final header *after* installing the last version wrapper.
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('C1E-HF1 initial version header',e);}
})(window.VSim);
