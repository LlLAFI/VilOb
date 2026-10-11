
/* V0.34C1A — scoped quarter-finalization administrative lookup cache.
   No save data or game RNG algorithm changes. */
(function(NS){'use strict';
const VERSION='V0.34C1A', PREVIOUS='V0.34C1';
const stats=new WeakMap();
function counters(w){let s=stats.get(w);if(!s){s={adminModelBuilds:0,adminModelHits:0,maintenanceWithdrawScopes:0};stats.set(w,s);}return s;}
const oldAdminModel=NS.V032D?.adminModel;
if(typeof oldAdminModel==='function')NS.V032D.adminModel=function(v,w,force=false){
 const scope=!force&&v?._v34c1aAdminLookupScope;
 if(!scope)return oldAdminModel.apply(this,arguments);
 const st=counters(w);st.maintenanceWithdrawScopes++;
 if(Object.prototype.hasOwnProperty.call(scope,'result')){st.adminModelHits++;return scope.result;}
 st.adminModelBuilds++;
 return scope.result=oldAdminModel.apply(this,arguments);
};
const oldSer=NS.World.prototype.serialize, oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(data){return oldFrom(data?.version===VERSION?{...data,version:PREVIOUS}:data);};
const oldSnap=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const r=oldSnap.call(this,w,reason,note);if(r?.global){const c=counters(w);r.global.maintenanceAdminModelBuilds34C1A=c.adminModelBuilds;r.global.maintenanceAdminModelHits34C1A=c.adminModelHits;}return r;
};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){
 const lines=oldCSV.call(this).split('\n'),keys=['maintenanceAdminModelBuilds34C1A','maintenanceAdminModelHits34C1A'],q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
 if(lines.length<2)return lines.join('\n');lines[0]+=','+keys.map(q).join(',');let i=1;
 for(const sn of this.snapshots||[])for(const row of sn.villages||[])if(i<lines.length)lines[i++]+=','+keys.map(k=>q(sn.global?.[k])).join(',');return lines.join('\n');
};
const oldJson=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJson.call(this,w);d.version=VERSION;d.worldSummary.v034c1aRevision='seasonal-hotpath-scoped-admin-lookup';d.worldSummary.v034c1aPerformance={...counters(w)};return d;};
const save=NS.SaveSystem;
function download(name,data,mime='application/json'){const url=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...save,
 save(w){try{localStorage.setItem('village-observer-v034c1a',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const text=localStorage.getItem('village-observer-v034c1a');return text?NS.World.from(JSON.parse(text)):save.load?.();},
 export(w){download(`village-observer-v034C1A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('V0.34C1A CSV schema mismatch');download(`village-observer-v034C1A-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=prev.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Seasonal Hotpath Optimization V1',summary:'유지보수 확정 중 반복되는 행정권 모델 평가를 한 자원 인출 구간 동안 공유하고, 동일 세계 회귀 및 성능을 검증합니다.',sections:[['성능',['기존 분기 유지보수의 경로·공여자 재고·실제 Gold/자원 이동 규칙은 유지됩니다.','행정권 모델 호출은 각 물자 인출 작업 범위에서 재사용합니다.','캐시 구축·적중 지표를 Snapshot CSV 및 Devlog에 추가했습니다.']],['호환성',['V0.34C1 세이브를 그대로 가져오고, 임시 캐시는 저장하지 않습니다.','AI·전투·출생 등 난수 규칙은 변경하지 않습니다.']]]});
NS.V034C1A={version:VERSION,counters};
})(window.VSim);
