from pathlib import Path
src=Path('/mnt/data/village-observer-v034C1G/index.html')
output=Path('/mnt/data/village-observer-v034C1H/index.html')
s=src.read_text(encoding='utf-8')
# Cross-resource, quarter-finalization scoped read-only administrative model.
a='''function routeWithdraw25(v,w,targetId,k,need,routeUse){
 const prevAdminScope=v._v34c1aAdminLookupScope;
 v._v34c1aAdminLookupScope={};
 try{let left=need,got=0;'''
b='''function routeWithdraw25(v,w,targetId,k,need,routeUse){
 const _c1h=NS.V034C1H,_c1hTimer=_c1h?.beginWithdrawal?.(w,routeUse);
 const prevAdminScope=v._v34c1aAdminLookupScope;
 v._v34c1aAdminLookupScope=routeUse.__v34c1hSharedAdminScope||(routeUse.__v34c1hSharedAdminScope={});
 try{let left=need,got=0;'''
assert s.count(a)==1,s.count(a)
s=s.replace(a,b)
a='''let evals=0;donors=territory.filter(id=>id!==targetId&&Number(v.stockAt?.(id,k)||0)>0).map(id=>{evals++;return{id,...v.internalLogisticsCapacity(id,targetId,k,false)};}).filter(x=>x.capacity>0&&Number.isFinite(x.cost)).sort((a,b)=>a.cost-b.cost);cache.set(ck,donors);'''
b='''let evals=0;const _c1hDonorTime=_c1h?.beginDonorBuild?.(w);try{donors=territory.filter(id=>id!==targetId&&Number(v.stockAt?.(id,k)||0)>0).map(id=>{evals++;return{id,...v.internalLogisticsCapacity(id,targetId,k,false)};}).filter(x=>x.capacity>0&&Number.isFinite(x.cost)).sort((a,b)=>a.cost-b.cost);}finally{_c1h?.endDonorBuild?.(w,_c1hDonorTime,evals);}cache.set(ck,donors);'''
assert s.count(a)==1,s.count(a)
s=s.replace(a,b)
a=''' }finally{v._v34c1aAdminLookupScope=prevAdminScope;}
}
function missionBurden25'''
b=''' }finally{v._v34c1aAdminLookupScope=prevAdminScope;_c1h?.endWithdrawal?.(w,_c1hTimer);}
}
function missionBurden25'''
assert s.count(a)==1,s.count(a)
s=s.replace(a,b)
# Ensure profile stage records per Nation, including no orders and errors
old='''function finalizeMaintenancePlan25(v,w){const plan=v.maintenancePlan25;if(!plan?.orders?.length){closeQuarterLabor25(v,0,0);return;}const routeUse={},newlyZero25=new Set();let needTotal=0,deliveredTotal=0,remote=0;'''
new='''function finalizeMaintenancePlan25(v,w){const plan=v.maintenancePlan25;if(!plan?.orders?.length){closeQuarterLabor25(v,0,0);return;}const routeUse={},newlyZero25=new Set(),_c1h=NS.V034C1H;_c1h?.beginFinalize?.(w,v,plan.orders.length);try{let needTotal=0,deliveredTotal=0,remote=0;'''
assert s.count(old)==1,s.count(old)
s=s.replace(old,new)
old="""model:'V0.25_LABOR_DAY'});
}
NS.Village.prototype.processBuildingMaintenance=function(w){"""
new="""model:'V0.25_LABOR_DAY'});
 }finally{_c1h?.endFinalize?.(w);}
}
NS.Village.prototype.processBuildingMaintenance=function(w){"""
assert s.count(old)==1,s.count(old)
s=s.replace(old,new)
# instrumentation and version module. append just before body close
mod=r'''<script>
/* V0.34C1H — Maintenance Finalization Hotpath + C-series Closure candidate.
 * The V0.25 physical stock withdrawals/order priorities are untouched.
 * Read-only C1A administration model is reused within a single quarterly finalize;
 * the scope never survives a finalize, population/road update or a save boundary.
 * Profiler timers are only collected with C1B enabled, integer counters always work.
 */
(function(NS){'use strict';
const VERSION='V0.34C1H',PREVIOUS='V0.34C1G';
const data=new WeakMap(),active=new WeakMap();
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const n3=n=>Math.round((Number(n)||0)*1000)/1000;
function get(w){let s=data.get(w);if(!s){s={finalizes:0,orders:0,withdraws:0,donorBuilds:0,donorEvaluations:0,adminScopesCreated:0,adminScopeReused:0,totalFinalizeMs:0,totalWithdrawalMs:0,totalDonorMs:0,history:[],last:null};data.set(w,s);}return s;}
const enabled=w=>!!NS.V034C1B?.isActive?.(w);
function beginFinalize(w,v,orders){const f={w,v,orders,enabled:enabled(w),start:0,withdraws:0,donorBuilds:0,donorEvaluations:0,scopes:0,reuses:0,withdrawMs:0,donorMs:0};if(f.enabled)f.start=clock();active.set(w,f);}
function beginWithdrawal(w,route){const f=active.get(w);if(!f)return null;f.withdraws++;if(Object.prototype.hasOwnProperty.call(route,'__v34c1hSharedAdminScope')){if(Object.prototype.hasOwnProperty.call(route.__v34c1hSharedAdminScope,'result'))f.reuses++;}else f.scopes++;return f.enabled?clock():null;}
function endWithdrawal(w,t){const f=active.get(w);if(f?.enabled&&t!=null)f.withdrawMs+=clock()-t;}
function beginDonorBuild(w){const f=active.get(w);return f?.enabled?clock():null;}
function endDonorBuild(w,t,n){const f=active.get(w);if(!f)return;f.donorBuilds++;f.donorEvaluations+=n||0;if(f.enabled&&t!=null)f.donorMs+=clock()-t;}
function endFinalize(w){const f=active.get(w);if(!f)return;active.delete(w);const s=get(w);s.finalizes++;s.orders+=f.orders;s.withdraws+=f.withdraws;s.donorBuilds+=f.donorBuilds;s.donorEvaluations+=f.donorEvaluations;s.adminScopesCreated+=f.scopes;s.adminScopeReused+=f.reuses;
 if(f.enabled){const elapsed=clock()-f.start;s.totalFinalizeMs+=elapsed;s.totalWithdrawalMs+=f.withdrawMs;s.totalDonorMs+=f.donorMs;const row={year:Number(w.year||0),season:Number(w.season||0),calendarDay:Number(w.calendarOrdinalDay?.()||0),nationId:String(f.v.id),name:String(f.v.name),orders:f.orders,withdraws:f.withdraws,donorBuilds:f.donorBuilds,donorEvaluations:f.donorEvaluations,adminScopesCreated:f.scopes,adminScopeReused:f.reuses,finalizeMs:n3(elapsed),withdrawalMs:n3(f.withdrawMs),donorMs:n3(f.donorMs)};s.last=row;s.history.push(row);if(s.history.length>112)s.history.shift();}}
function summarize(w){const s=get(w);return{enabled:enabled(w),hasProfile:!!s.last,finalizes:s.finalizes,orders:s.orders,withdraws:s.withdraws,donorBuilds:s.donorBuilds,donorEvaluations:s.donorEvaluations,adminScopesCreated:s.adminScopesCreated,adminScopeReused:s.adminScopeReused,totalFinalizeMs:n3(s.totalFinalizeMs),totalWithdrawalMs:n3(s.totalWithdrawalMs),totalDonorMs:n3(s.totalDonorMs),historyCount:s.history.length,last:s.last};}
NS.V034C1H={version:VERSION,beginFinalize,beginWithdrawal,endWithdrawal,beginDonorBuild,endDonorBuild,endFinalize,summarize,history:w=>get(w).history.slice()};
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
const fields=['maintenanceHFinalizes','maintenanceHOrders','maintenanceHWithdraws','maintenanceHDonorBuilds','maintenanceHDonorEvaluations','maintenanceHAdminScopes','maintenanceHAdminReuses','maintenanceHProfileEnabled','maintenanceHLastFinalizeMs','maintenanceHLastWithdrawalMs','maintenanceHLastDonorMs','maintenanceHTotalFinalizeMs'];
function values(w){const s=summarize(w),last=s.last||{};return{maintenanceHFinalizes:s.finalizes,maintenanceHOrders:s.orders,maintenanceHWithdraws:s.withdraws,maintenanceHDonorBuilds:s.donorBuilds,maintenanceHDonorEvaluations:s.donorEvaluations,maintenanceHAdminScopes:s.adminScopesCreated,maintenanceHAdminReuses:s.adminScopeReused,maintenanceHProfileEnabled:s.enabled?1:0,maintenanceHLastFinalizeMs:last.finalizeMs??0,maintenanceHLastWithdrawalMs:last.withdrawalMs??0,maintenanceHLastDonorMs:last.donorMs??0,maintenanceHTotalFinalizeMs:s.totalFinalizeMs};}
const oldSnap=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=oldSnap.call(this,w,reason,note);if(sn?.global)Object.assign(sn.global,values(w));return sn;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+fields.map(q).join(',');let i=1;for(const sn of this.snapshots||[])for(const _ of sn.villages||[])if(i<lines.length)lines[i++]+=','+fields.map(k=>q(sn.global?.[k])).join(',');return lines.join('\n');};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary.v034c1hRevision='maintenance-quarter-scoped-administration-cache';d.worldSummary.v034c1hPerformance=summarize(w);d.worldSummary.v034c1hQuarterHistory=NS.V034C1H.history(w);return d;};
const oldSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem('village-observer-v034c1h',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1h');return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v034C1H-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1H-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);if(check&&!check.ok)throw Error('C1H CSV schema mismatch '+JSON.stringify(check.bad?.slice(0,3)));download(`village-observer-v034C1H-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader,oldWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(){const ret=oldHeader.call(this);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return ret;};
 NS.UI.prototype.renderWorld=function(){const ret=oldWorld.call(this),panel=document.querySelector('.v034c1b-profiler'),w=this.world;if(!panel||!w)return ret;let el=panel.querySelector('.v034c1h-summary');if(!el){el=document.createElement('div');el.className='v034c1h-summary small muted';panel.appendChild(el);}const p=summarize(w);el.textContent=`C1H 유지보수 정산 · ${p.finalizes}회 / 행정 모델 재사용 ${p.adminScopeReused}회 / 자재 인출 ${p.withdraws}회`+(p.last?` / 최근 정산 ${p.last.finalizeMs}ms`:'');return ret;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Maintenance Finalization Hotpath + C-Series Closure',summary:'V0.25 분기 건물 유지보수에서 행정권 조회 결과를 해당 정산 한 번에 한정해 재사용합니다. 물리 자재·노동·건물 상태·우선순위·난수 규칙은 유지하고 C1 계열 마지막 성능 계측을 추가합니다.',sections:[['유지보수 성능',['기존 C1A의 자재 인출 단위 행정 모델 캐시를 한 분기 정산 단위로 묶어, 중복적인 행정권 모델 재계산을 줄입니다.','캐시 수명은 해당 국가의 정산 1회까지이며 다음 분기, 국가, 저장 및 불러오기에는 전달되지 않습니다.','자재 공여자 재고는 매번 실제 재고를 읽고, 기존 E10 공여자 우선순위와 물류 용량을 유지합니다.']],['정밀 관측',['정산과 자재 인출·공여자 후보 계산의 비용을 세분화하고, 신규 카운터를 Devlog 및 CSV에 기록합니다.','C1B 정밀 계측 OFF에서는 상세 소요시간 측정을 수행하지 않습니다.']],['C 계열 마감',['V0.34C의 Settlement 구조 전환 및 C1A~C1G 최적화 결과를 유지합니다.','게임 규칙 변경 없이 C1H를 마지막 C계열 성능 패치로 준비합니다. 실제 자연주행 비교가 끝나면 C계열을 최종 마감합니다.']]]});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('C1H initial header',e);}
})(window.VSim);
</script>
'''
assert '</body></html>' in s
s=s.replace('</body></html>',mod+'</body></html>')
s=s.replace('<title>Village Observer V0.34C1A</title>','<title>Village Observer V0.34C1H</title>',1)
output.write_text(s,encoding='utf-8');print('created',output,len(s),len(s.split('<script>'))-1)
