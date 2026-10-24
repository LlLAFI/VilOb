/* V0.35H1B2 — startup/runtime consolidation; observation only.
 * Old bootstraps retain their full execution order. The build replaces a
 * strictly audited set of version-only renderHeader wrappers in distribution
 * code; all gameplay, save migration and military rehydration remain intact.
 */
(function(NS){'use strict';
if(!NS?.UI||!NS?.World||!NS?.V035H1B1A)return;
const VERSION='V0.35H1B2';
const perf=typeof performance!=='undefined'?performance:null;
const finishedAt=perf?.now?.()??null;
function badge(){if(typeof document==='undefined')return;
 const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}
 document.title='Village Observer '+VERSION;
 const gate=document.getElementById('vilob-h1b2-startup-gate');if(gate)gate.remove();
}
function report(){
 const p=perf,nav=p?.getEntriesByType?.('navigation')?.[0]||null;
 const resources=p?.getEntriesByType?.('resource')||[];
 const js=resources.filter(e=>/\.js(?:\?|$)/.test(e.name));
 const style=resources.filter(e=>/\.css(?:\?|$)/.test(e.name));
 return {format:'vilob-v035h1b2-startup-v1',version:VERSION,elapsedToBootstrapEndMs:finishedAt,
  navigation:nav?{type:nav.type,domInteractiveMs:nav.domInteractive,domContentLoadedMs:nav.domContentLoadedEventEnd,loadEventEndMs:nav.loadEventEnd,responseEndMs:nav.responseEnd}:null,
  resourceCount:resources.length,jsResourceCount:js.length,cssResourceCount:style.length,
  scriptRequestsExpectedHosted:166,notes:'Timing includes network, legacy initializers and rendering; measurements must be compared in the same device/cache mode. Resource timings may be restricted by browser privacy or file:// protocol.'};
}
function exportJSON(){const data=report();if(typeof document!=='undefined'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='vilob-v035H1B2-startup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }return data;
}
function install(){if(typeof document==='undefined')return;
 const host=document.getElementById('v035h1aPanel')||document.getElementById('v035h1bPanel');if(!host||document.getElementById('v035h1b2StartupJson'))return;
 const heading=host.querySelector?.('h3');if(heading&&heading.textContent?.startsWith('H1B1A ·'))heading.textContent=heading.textContent.replace('H1B1A ·','H1B2 ·');
 const target=host.querySelector?.('.button-grid')||host;
 const btn=document.createElement('button');btn.id='v035h1b2StartupJson';btn.textContent='H1B2 시작 성능 JSON';btn.title='로딩·부트스트랩·JS 요청 수 계측 (동일 PC, Cold/Warm 구분)';btn.onclick=()=>exportJSON();target.appendChild(btn);
}
const renderHeader=NS.UI.prototype.renderHeader;
NS.UI.prototype.renderHeader=function(...a){const r=renderHeader.apply(this,a);badge();return r;};
const renderWorld=NS.UI.prototype.renderWorld;
NS.UI.prototype.renderWorld=function(...a){const r=renderWorld.apply(this,a);install();return r;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-24',title:'Startup & Runtime Consolidation V1',summary:'GitHub Pages 후속 패치 59개를 실행 순서 보존형 번들로 통합하고, 검증된 버전 전용 헤더 래퍼를 제거합니다. 저장·복원 및 게임 판단은 변경하지 않습니다.',sections:[['시작 성능',['후속 부트스트랩을 하나의 JS 자산으로 묶어 네트워크 요청 수를 줄입니다.','과거 버전 번호의 화면 순차 노출을 막고 최신 버전만 표시합니다.','선택형 시작 성능 JSON에서 탐색·스크립트 요청 수와 로드 시간을 제공합니다.']],['동작 보존',['169 보호 블록·기술 43개·CSV 1,683열·H1B1A 전쟁 Formation 및 점령 복원을 유지합니다.','기반 165개 스크립트와 저장·복원 래퍼 순서는 변경하지 않습니다.']]]});
NS.V035H1B2=Object.freeze({version:VERSION,report,exportJSON});
try{badge();}catch(e){console.warn('H1B2 badge',e);}
})(window.VSim);
