/* Village Observer V0.34H0 — verified UI-refactor boundary.
 * Compatibility: H0 and G5/G4A1/G4A/G4/G3B worlds only (current G5 supported chain).
 * No Person, production, AI, battle, RNG, time, F0/F1, or telemetry snapshot changes.
 */
(function(NS){'use strict';
const VERSION='V0.34H0',PREVIOUS='V0.34G5',KEY='village-observer-v034h0';
const priorSerialize=NS.World.prototype.serialize,priorFrom=NS.World.from;
NS.World.prototype.serialize=function(...a){const d=priorSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(data,...a){return priorFrom.call(this,data?.version===VERSION?{...data,version:PREVIOUS}:data,...a);};
const priorJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(...a){const d=priorJSON.apply(this,a);d.version=VERSION;return d;};
const priorSave=NS.SaveSystem;
function download(name,obj){const url=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):priorSave.load?.();},
 export(w){download(`village-observer-v034H0-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034H0-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
// The following small, optional helpers are shared by H1-H3; H0 does not change panel DOM.
const ui=Object.freeze({
 byId:id=>typeof document==='undefined'?null:document.getElementById(id),
 setExpanded(node,expanded){if(!node)return false;node.hidden=!expanded;node.setAttribute?.('aria-hidden',expanded?'false':'true');return true;},
 isExpanded:node=>!!node&&!node.hidden,
 // Return a status snapshot without assuming that a G5 component check audits the whole world.
 integrity:()=>NS.V034G5.verify(window.villageObserver?.world)
});
NS.RELEASE_VERSION=VERSION;
function refresh(){
 if(typeof document==='undefined')return;
 document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');
 if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 // Old release success text is not a real error channel. Retain its DOM anchor for F0 layout.
 const old=document.getElementById('runtimeStatus');if(old){old.hidden=true;old.style.display='none';}
 const notice=document.getElementById('g3aRuntimeIntegrity');
 if(notice){const r=NS.V034G5.verify(window.villageObserver?.world);notice.hidden=!!r.ok;notice.style.display=r.ok?'none':'';
  if(!r.ok){notice.textContent='⚠ H0 구성 무결성: '+Object.keys(r.tests).filter(k=>!r.tests[k]).join(', ');notice.setAttribute?.('role','alert');}}
}
NS.V034H0=Object.freeze({version:VERSION,verify:()=>NS.V034G5.verify(window.villageObserver?.world),audit:w=>NS.V034G5.audit(w),compatibility:['V0.34H0','V0.34G5','V0.34G4A1','V0.34G4A','V0.34G4','V0.34G3B'],ui,refresh});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'UI 개편 기반 · 레거시 경계 정리',summary:'C1G 고정 성공 문구를 제거하고 정상 무결성 알림을 숨깁니다. H1~H3 UI 통합을 위한 공통 인터페이스·회귀 기준을 추가했습니다. 게임 로직과 F0/F1 계측은 G5 그대로입니다.',sections:[['이번 버전',['구형 C1G 성공 문구 제거; 기존 실제 연간 진단/계측은 유지','상단 정상 상태 알림을 숨기고 검사 실패 경고는 계속 표시','후속 UI 개편을 위한 확장용 인터페이스 및 의존성 감사 추가']],['호환성',['V0.34 계열 G5/G4A1/G4A/G4/G3B 저장파일 로드 유지','V0.33 이하 세이브 지원은 보장하지 않음','기술 43개·Person·AI·군사·Gold·물리 재고·RNG·F0/F1·CSV 스키마 변경 없음']]]});
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const result=prev.apply(this,a);refresh();return result;};}
refresh();
})(window.VSim);
