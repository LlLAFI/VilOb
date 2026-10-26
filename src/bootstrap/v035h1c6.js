/* V0.35H1C6 — Legacy Attach Chain Attribution V1.
 * Separates the protected F5A Snapshot attach chain into nested, disjoint leaf
 * timing stages. Does not suppress, memoize, reorder, or migrate any attach work.
 * Recording is scoped to the one synchronous F5A snapshot attach invocation.
 */
(function(NS){'use strict';
if(!NS?.V035H1C5||!NS?.V035H1B1||!NS?.Telemetry)return;
const VERSION='V0.35H1C6';
const links=[
 ['V032E8','C6_ATTACH_32E8'],['V032E9','C6_ATTACH_32E9'],
 ['V032E10','C6_ATTACH_32E10'],['V032E11','C6_ATTACH_32E11'],
 ['V032E12','C6_ATTACH_32E12'],['V032E14','C6_ATTACH_32E14'],
 ['V032F','C6_ATTACH_32F'],['V033','C6_ATTACH_33'],
 ['V033A','C6_ATTACH_A'],['V033B','C6_ATTACH_B'],['V033C','C6_ATTACH_C'],
 ['V033C1','C6_ATTACH_C1'],['V033C2','C6_ATTACH_C2'],
 ['V033C3','C6_ATTACH_C3'],['V033C3F','C6_ATTACH_C3F'],['V033D','C6_ATTACH_D'],
 ['V033D1','C6_ATTACH_D1'],['V033D1A','C6_ATTACH_D1A'],
 ['V033D1B','C6_ATTACH_D1B'],['V033D1C','C6_ATTACH_D1C'],
 ['V033D2','C6_ATTACH_D2'],['V033D2A','C6_ATTACH_D2A'],
 ['V033E','C6_ATTACH_E'],['V033E1','C6_ATTACH_E1'],
 ['V033E2','C6_ATTACH_E2'],['V033E3','C6_ATTACH_E3'],
 ['V033E4','C6_ATTACH_E4'],['V033E4A','C6_ATTACH_E4A'],
 ['V033E5','C6_ATTACH_E5'],['V033E5F','C6_ATTACH_E5F'],
 ['V033E5F1','C6_ATTACH_E5F1'],['V033E5F2','C6_ATTACH_E5F2'],
 ['V033F','C6_ATTACH_F'],['V033F1','C6_ATTACH_F1'],
 ['V033F2','C6_ATTACH_F2'],['V033F3','C6_ATTACH_F3'],
 ['V033F4','C6_ATTACH_F4'],['V033F5','C6_ATTACH_F5'],
 ['V033F5P1','C6_ATTACH_F5P1'],['V033F5P2','C6_ATTACH_F5P2']
];
let scope=null;
const wrapped=[];
for(const [name,stage] of links){
 const group=NS[name],fn=group?.attachWorld;
 if(typeof fn!=='function')continue;
 // Runtime API namespace remains the same object, only this method is wrapped.
 // All wrappers share exact this, arguments, return value and throw behavior.
 const measured=function(...args){
  const w=args[0];
  if(scope!==w)return fn.apply(this,args);
  return NS.V035H1B1.measureStage(stage,w,fn,this,args);
 };
 group.attachWorld=measured;
 if(group.attachWorld!==measured)throw Error('H1C6 attach wrapper install failed: '+name);
 wrapped.push(stage);
}
function runAttach(w,fn){
 const prev=scope;
 scope=w;
 try{return NS.V035H1B1.measureStage('C5_F5A_ATTACH',w,fn,null,[w]);}
 finally{scope=prev;}
}
const previousJSON=NS.Telemetry.prototype.toJSON;
if(typeof previousJSON==='function')NS.Telemetry.prototype.toJSON=function(w,...args){const out=previousJSON.call(this,w,...args);out.version=VERSION;out.runtimeVersion=VERSION;if(out.worldSummary)out.worldSummary.runtimeVersion=VERSION;return out;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-26',title:'Legacy Attach Chain Attribution V1',summary:'F5A Snapshot attach 체인의 단계별 배타 비용·호출 횟수를 분리 계측. 연결/수리/초기화 및 RNG·이벤트·CSV 값 보존.'});
function badge(){if(typeof document==='undefined')return;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const h=NS.UI?.prototype?.renderHeader;if(h)NS.UI.prototype.renderHeader=function(...args){const out=h.apply(this,args);badge();return out;};badge();
NS.V035H1C6=Object.freeze({version:VERSION,runAttach,stageNames:wrapped,description:'Profile nested F5A attachWorld stages without changing work or output'});
})(window.VSim);
