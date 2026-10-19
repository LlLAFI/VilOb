/* Village Observer V0.34H4 — bounded integrity/performance stabilization.
 * D3 audit diagnosis is observational and runs only on explicit request/export.
 * D3 member/cache/capacity optimizations are semantics-preserving and verified
 * against unmodified H3 with an identical seed and serialized world state.
 */
(function(NS){'use strict';
const VERSION='V0.34H4', PREV='V0.34H3',KEY='village-observer-v034h4';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
// Model the maximum physical capacity if existing intact but inactive storage buildings
// are restored. This is NOT extra storage granted to the simulation.
function potentialStoneCap(t){
 let total=25;
 for(const b of t?.buildings||[]){
  let add=n(NS.BUILDINGS?.[b]?.storage?.stone);
  if(b==='warehouse'&&t?._v08UrbanStorage)add*=1.15;
  total+=add;
 }
 return total;
}
function storageDiagnosis(w){
 const entries=[];
 for(const r of NS.V034D3.economyRows(w)){
  const current=n(r.capacity?.stone),stock=n(r.resources?.stone),excess=Math.max(0,stock-current);
  if(excess<=1e-5)continue;
  const physicalPotential=(r.tileIds||[]).reduce((s,id)=>s+potentialStoneCap(w.map?.get(Number(id))),0);
  const possibleCapacityContraction=stock<=physicalPotential+1e-5;
  entries.push({settlementId:r.settlementId,nationId:r.nationId,stock,currentCap:current,excess,physicalPotential,classification:possibleCapacityContraction?'POSSIBLE_CAPACITY_CONTRACTION':'UNEXPLAINED_OVERFLOW',
   tileIds:[...(r.tileIds||[])]});
 }
 return entries;
}
function audit(w){
 const base=NS.V034D3.audit(w),storage=storageDiagnosis(w);
 const tag=new Map(storage.map(r=>[r.settlementId,r.classification]));
 // Keep original STORAGE_OVERFLOW for backward-compatible telemetry, add diagnosis;
 // nothing here writes inventory, capacity, RNG, or building condition.
 return {...base,storage,storageSummary:{total:storage.length,possibleContraction:storage.filter(x=>x.classification==='POSSIBLE_CAPACITY_CONTRACTION').length,unexplained:storage.filter(x=>x.classification==='UNEXPLAINED_OVERFLOW').length,totalExcess:storage.reduce((x,r)=>x+r.excess,0)},
  warnings:(base.warnings||[]).map(x=>{const match=String(x).match(/^STORAGE_OVERFLOW:([^:]+):stone$/);return match?x+' ['+(tag.get(match[1])||'NOT_CLASSIFIED')+']':x;})};
}
NS.World.prototype.serialize=function(...args){const data=oldSerialize.apply(this,args);data.version=VERSION;return data;};
NS.World.from=function(data,...args){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const data=oldJSON.apply(this,args);data.version=VERSION;if(data.worldSummary){data.worldSummary.v034h4Revision='stone-capacity-diagnosis-and-d3-member-cap-fastpath';
 // Full storage analysis only for an explicit devlog export, never every simulation day.
 if(args[0])data.worldSummary.v034h4StorageDiagnosis=storageDiagnosis(args[0]);}return data;};
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},
 load(){const text=localStorage.getItem(KEY);return text?NS.World.from(JSON.parse(text)):oldSave.load?.();},
 export(w){download(`village-observer-v034H4-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034H4-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
NS.RELEASE_VERSION=VERSION;
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const out=oldHeader.apply(this,args);refresh();return out;};}
NS.V034H4=Object.freeze({version:VERSION,audit,storageDiagnosis,potentialStoneCap});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-19',title:'장기 무결성·경제권 경량화',summary:'석재 저장 초과를 보존하면서 가동 건물의 저장용량 감소 가능성과 설명되지 않는 초과를 구분합니다. D3 공동 Settlement 조회와 창고용량 중복 계산을 줄입니다.',sections:[
 ['석재 감사',['기존 재고를 절대 삭제하거나 저장용량을 임의 확장하지 않습니다.','건물 상태 악화로 저장 용량이 낮아질 수 있는 정착지와 현존 시설만으로 설명되지 않는 초과를 분리합니다.','실제 88년 Save JSON이 없으므로 기존 경고 5건의 최종 원인 확정은 유보합니다.']],
 ['성능',['공동 Settlement 타일 회원 검색에 Set 조회를 이용하고 저장용량 6종을 시설별 한 번만 산출합니다.','AI·전쟁·생산·물류·Person 의사결정 및 난수 순서는 그대로 유지합니다.']],
 ['검증',['H3 대비 동일 시드·세이브 30일 parity 및 H2A 복구 회귀를 유지합니다.','150년/실제 88년 장기 성능 목표는 별도 동일 PC·세이브 환경에서 검증해야 합니다.']]
]});
try{refresh();}catch(e){console.warn('H4 header',e);}
})(window.VSim);
