/* V0.34G3A — Runtime Integrity, UI Synchronization and Read-only Observer.
 * No food/spatial/AI/RNG formula changes. Local large-save validation is a
 * separate generated offline HTML. Built artifact integrity is checked here.
 */
(function(NS){'use strict';
const VERSION='V0.34G3A',PREV='V0.34G3',KEY='village-observer-v034g3a';
const same=(a,b)=>String(a)===String(b);
const verifiedWorlds=new WeakMap();
const number=x=>Number.isFinite(Number(x))?Number(x):0;
function verify(w){
 const tests={
  version:NS.RELEASE_VERSION===VERSION,
  g3Module:!!(NS.V034G3&&NS.V034G3.config?.spatialEnabled&&NS.V034G3.config?.foodEnabled),
  g3FoodHook:typeof NS.V034G2A?.relay==='function'&&/V034G3/.test(Function.prototype.toString.call(NS.V034G2A.relay)),
  g3SpatialHook:typeof NS.V034C?.canJoin==='function'&&/V034G3/.test(Function.prototype.toString.call(NS.V034C.canJoin)),
  g3PathHook:typeof NS.V034C?.canJoin==='function'&&typeof NS.V034G3?.bothReachable==='function'&&/V034G3/.test(Function.prototype.toString.call(NS.V034C.canJoin)),
  g3DeliveryCsv:!!w&&typeof NS.V034G2A?.csv==='function'&&String(NS.V034G2A.csv(w)).replace(/^\uFEFF/,'').split(/\r?\n/,1)[0].split(',').length===20,
  g3Observation:typeof NS.V034G3?.observe==='function'
 };
 return {version:VERSION,build:'g3a-static-v1',ok:Object.values(tests).every(Boolean),tests};
}
function updateUI(){if(NS.V034G3B?.refresh)return NS.V034G3B.refresh();try{
 const w=window.villageObserver?.world;
 let status=w&&verifiedWorlds.get(w);if(!status){status=verify(w);if(w)verifiedWorlds.set(w,status);}
 document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 let node=document.getElementById('g3aRuntimeIntegrity');
 if(!node&&document.body?.appendChild){node=document.createElement('div');node.id='g3aRuntimeIntegrity';node.setAttribute?.('role','status');node.style.cssText='position:relative;z-index:20;margin:2px auto 7px;max-width:1120px;border-radius:9px;padding:7px 10px;font:12px system-ui,sans-serif;border:1px solid '+(status.ok?'#235a4c':'#a64c39')+';color:'+(status.ok?'#a9e7ca':'#ffe0a1')+';background:#0c1b28';const shell=document.querySelector('.shell');const runtime=document.getElementById('runtimeStatus');if(runtime?.parentNode)runtime.parentNode.insertBefore(node,runtime.nextSibling);else shell?.prepend?.(node);}
 if(node){node.textContent=status.ok?'✓ G3A 런타임 무결성: G3 공간·구호 Hook 및 CSV 20열 연결 확인':'⚠ G3A 무결성 검사 실패: '+Object.keys(status.tests).filter(k=>!status.tests[k]).join(', ')+' — 이 세계의 패치 검증을 중단하세요';node.style.borderColor=status.ok?'#235a4c':'#a64c39';node.style.color=status.ok?'#a9e7ca':'#ffe0a1';}
 const btn=document.getElementById('exportG2RelayBtn');if(btn)btn.textContent='G3A 구호 배송 CSV';
 return status;
 }catch(e){console.error('G3A integrity UI error',e);return {ok:false,error:String(e)};}}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=oldSerialize.call(this);data.version=VERSION;data.v034g3a={runtimeIntegrity:'g3a-static-v1',balance:'G3_UNCHANGED'};return data;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){return NS.V034G3.observe(()=>{const r=oldJSON.call(this,w);r.version=VERSION;r.worldSummary.v034g3a={revision:'runtime-integrity-local-validation',simulationUnchanged:true,integrity:verify(w).tests};return r;});};
// V034C is deliberately frozen. Read-only clients invoke its inspector through G3.observe().
function audit(w){const v32Stats=w.v32e3OptimizationStats?{...w.v32e3OptimizationStats}:null;try{return NS.V034G3.observe(()=>{
 const c=NS.V034C?.inspect?.(w),d=NS.V034D3?.audit?.(w),f=NS.V034F2?.diagnostics?.(w),g2=NS.V034G2A?.summary?.(w),g3=NS.V034G3?.summary?.(w);
 const world={time:w.timestamp?.(),calendarDay:w.calendarOrdinalDay?.(),population:w.allPeople?.length,activeNations:w.activeVillages?.length,claimedTiles:w.map?.tiles?.filter(t=>t.ownerId!=null).length};
 const people=w.allPeople||[],nations=(w.activeVillages||[]).map(v=>({id:v.id,name:v.name,population:v.population?.(),food:number(v.food),criticalHunger:(v.residents||[]).filter(p=>p.alive!==false&&number(p.hunger)>=95).length,severeHunger:(v.residents||[]).filter(p=>p.alive!==false&&number(p.hunger)>=85).length}));
 const failures={settlement:c?.errors?.length??null,physical:d?.errors?.length??null,metabolismDuplicates:f?.duplicateMetabolismRequests??null,missingHomes:f?.missingHomes??null,conservation:g2?.conservationErrors??null,reserveViolations:g2?.reserveViolations??null};
 return {version:VERSION,world,integrity:verify(w),failures,settlements:{...c?.counts,ok:c?.ok,errors:(c?.errors||[]).slice(0,12)},stock:{ok:d?.ok,errors:(d?.errors||[]).slice(0,12)},g2a:{shipments:g2?.shipments,quantity:g2?.quantity,alternativeDonorsUsed:g2?.alternativeDonorsUsed,reserveViolations:g2?.reserveViolations,conservationErrors:g2?.conservationErrors},g3,nations};
 });}finally{if(v32Stats&&w.v32e3OptimizationStats)Object.assign(w.v32e3OptimizationStats,v32Stats);}}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g3','village-observer-v034g2a','village-observer-v034g2','village-observer-v034g1b'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G3A-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G3A-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G3A-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\uFEFF'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};
NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
function download(filename,contents,mime='application/json'){const u=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const result=prev.apply(this,args);updateUI();return result;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'G3A 런타임 무결성 · 읽기 전용 관측 · 로컬 검증',summary:'G3 공간·구호 밸런스는 유지하며 최초 버전 표시, Hook 자동 진단과 대용량 세이브 로컬 검증을 안정화합니다.',sections:[['배포 및 UI',['G3A 초기 화면 버전 동기화와 물류·공간 Hook/배송 CSV 연결 검사를 제공합니다.','연결 오류는 화면에 명시적으로 경고하며, 배포본 파일은 버전별로 캐시 갱신합니다.']],['관측 안정화',['G3 정책 카운터는 실제 시뮬레이션 판정에서만 증가합니다.','DEVLOG 내보내기·정착지 감사는 관측 전용으로 실행됩니다.']],['로컬 진단',['대용량 세이브 JSON을 외부에 전송하지 않고 브라우저에서 로드·검사·추가 주행합니다.','세계 상태와 RNG를 보존하고 소형 요약 JSON/CSV만 출력합니다.']]]});
NS.V034G3A=Object.freeze({version:VERSION,verify,audit,refresh:updateUI});
// The legacy UI was constructed before D0..G3A bootstraps: refresh immediately.
updateUI();
})(window.VSim);
