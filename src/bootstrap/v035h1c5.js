/* V0.35H1C5 — F5A Snapshot Attach Hotpath V1.
 * F5A full attach / repairs remain before base snapshot.
 * F5 Snapshot skips only the second consecutive updateMonetary call: attach already does it.
 * No gameplay, RNG, save schema, telemetry retention or CSV changes.
 */
(function(NS){'use strict';
if(!NS?.V035H1C4||!NS?.Telemetry||!NS?.UI)return;
const VERSION='V0.35H1C5';
const original=NS.Telemetry.prototype.toJSON;
if(typeof original==='function')NS.Telemetry.prototype.toJSON=function(w,...args){const d=original.call(this,w,...args);d.version=VERSION;d.runtimeVersion=VERSION;if(d.worldSummary)d.worldSummary.runtimeVersion=VERSION;return d;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-26',title:'F5A Snapshot Attach Hotpath V1',summary:'F5 Snapshot의 연속 화폐 갱신 중복 1회를 제거하고 F5A attach의 세부 계측을 추가. 모든 연결·점령·전쟁 보정은 그대로 유지.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const previous=NS.UI.prototype.renderHeader;
if(previous)NS.UI.prototype.renderHeader=function(...args){const r=previous.apply(this,args);badge();return r;};badge();
NS.V035H1C5=Object.freeze({version:VERSION,description:'Remove duplicate F5 monetary refresh after attach; profile F5A attach',stageNames:['C5_F5A_ATTACH']});
})(window.VSim);
