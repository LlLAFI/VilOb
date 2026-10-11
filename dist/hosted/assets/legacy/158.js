
/* V0.34C1C — Frontier Hotpath Optimization V1.
   V0.19 quarterly specialization uses a single scoped read-only log index.
   No cached values escape considerSpecialization; mutate-on-append immediately
   falls back to the original scan. V0.20 randomized frontier remains untouched. */
(function(NS){'use strict';
const VERSION='V0.34C1C',PREVIOUS='V0.34C1B';
const scopes=new WeakMap(),metrics=new WeakMap();
const now=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
function stats(w){let s=metrics.get(w);if(!s){s={scopes:0,scans:0,scannedEntries:0,indexBuildMs:0,specializationMs:0,specializationCalls:0,queries:0,tradeHits:0,constructionHits:0,stoneHits:0,fallbacks:0,invalidations:0,legacyEntryChecksAvoided:0,lastQuarter:null};metrics.set(w,s);}return s;}
const add=(m,key,amount=1)=>{m[key]+=amount;};
function accumulateTrade(map,k,q){let row=map.get(k);if(!row){row={qty:0,count:0};map.set(k,row);}row.qty+=q;row.count++;}
function begin(v,w){
 // V0.19 only. One national seasonal evaluation, not a calendar-day/global cache.
 if(!w?.telemetry)return null;
 // Small maps and short logs are cheaper to scan directly; avoid eager index construction.
 // With eight occupied territory records the V0.19 code can repeat a full scan 8+ times.
 if((v.territory?.size||0)<8||(w.telemetry.entries?.length||0)<300)return null;
 const m=stats(w),old=scopes.get(w)||null,t=now(),entries=w.telemetry.entries||[],day=w.ordinalDay(),trade=new Map(),stone=new Map(),construction=new Map();
 // The exact existing per-entry predicates and append order are retained.
 // Build both 120-day trade throughput and 240-day quarry/stoneworks evidence.
 for(const e of entries){
  const typ=e.type,p=e.payload,delta=day-Number(e.ordinalDay||0);
  if((typ==='TRADE'||typ==='DOMESTIC_TRADE29')){
   if(delta<=120){const a=typ==='DOMESTIC_TRADE29'?p?.fromTileId:p?.sellerTileId,b=typ==='DOMESTIC_TRADE29'?p?.toTileId:p?.buyerTileId,q=Number(p?.qty||0);
    if(a!=null)accumulateTrade(trade,a,q);
    if(b!=null&&b!==a)accumulateTrade(trade,b,q);
   }
   if(delta<=240&&p?.resource==='stone'){
    const b=p?.buyerTileId??null,d=p?.toTileId??null;
    // Original predicate uses (buyerTileId === tile || toTileId === tile)
    // regardless of whether the event is an international/domestic trade.
    const q=Number(p?.qty||0);
    if(b!=null)stone.set(b,(stone.has(b)?stone.get(b):0)+q);
    if(d!=null&&d!==b)stone.set(d,(stone.has(d)?stone.get(d):0)+q);
   }
  }
  if(delta<=240&&p?.village===v.name&&(typ==='BUILDING_STARTED'||typ==='BUILDING_UPGRADE_STARTED'||typ==='BUILDING_SPECIALIZATION_STARTED'||typ==='LAND_DEVELOPMENT_STARTED')){
   const a=p?.tileId,b=p?.targetTileId;
   if(a!=null)construction.set(a,(construction.get(a)||0)+1);
   if(b!=null&&b!==a)construction.set(b,(construction.get(b)||0)+1);
  }
 }
 const sc={v,w,old,entries,len:entries.length,trade,stone,construction,queries:0,invalidated:false,startClock:t};
 scopes.set(w,sc);m.scopes++;m.scans++;m.scannedEntries+=entries.length;m.indexBuildMs+=now()-t;
 return sc;
}
function valid(w){const sc=scopes.get(w);if(!sc||sc.w!==w)return null;
 if(sc.entries!==w.telemetry?.entries||sc.len!==w.telemetry.entries.length){if(!sc.invalidated){stats(w).invalidations++;sc.invalidated=true;}return null;}
 return sc;
}
function tradeVolume(w,tileId,days,resource){const sc=valid(w);if(!sc||days!==120||resource!==null){if(scopes.has(w))stats(w).fallbacks++;return null;}
 const m=stats(w);m.queries++;m.tradeHits++;m.legacyEntryChecksAvoided+=sc.len;return sc.trade.get(tileId)||{qty:0,count:0};
}
function construction(w,v,tileId,days){const sc=valid(w);if(!sc||sc.v!==v||days!==240){if(scopes.has(w))stats(w).fallbacks++;return null;}
 const m=stats(w);m.queries++;m.constructionHits++;m.legacyEntryChecksAvoided+=sc.len;return sc.construction.get(tileId)||0;
}
function stoneImports(w,tileId,days){const sc=valid(w);if(!sc||days!==240){if(scopes.has(w))stats(w).fallbacks++;return null;}
 const m=stats(w);m.queries++;m.stoneHits++;m.legacyEntryChecksAvoided+=sc.len;return sc.stone.has(tileId)?sc.stone.get(tileId):0;
}
function end(v,w,sc){if(!sc)return;const m=stats(w);m.specializationCalls++;m.specializationMs+=now()-sc.startClock;if(sc.old)scopes.set(w,sc.old);else scopes.delete(w);}
function summarize(w){const m=stats(w);return Object.fromEntries(Object.entries(m).filter(([key])=>key!=='lastQuarter').map(([key,val])=>[key,typeof val==='number'?Math.round(val*1000)/1000:val]));}
NS.V034C1C={version:VERSION,begin,end,tradeVolume,construction,stoneImports,summarize};
const baseSer=NS.World.prototype.serialize,baseFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=baseSer.call(this);x.version=VERSION;return x;};
NS.World.from=function(data){return baseFrom(data?.version===VERSION?{...data,version:PREVIOUS}:data);};
// Observation only. This is cumulative scoped work since first profile start.
const baseSnap=NS.Telemetry.prototype.snapshot;
const FIELDS=['c1cScopes','c1cScannedEntries','c1cIndexBuildMs','c1cSpecializationMs','c1cSpecializationCalls','c1cTradeHits','c1cConstructionHits','c1cStoneHits','c1cFallbacks','c1cInvalidations','c1cLegacyChecksAvoided'];
function fmt(w){const m=summarize(w);return{c1cScopes:m.scopes,c1cScannedEntries:m.scannedEntries,c1cIndexBuildMs:m.indexBuildMs,c1cSpecializationMs:m.specializationMs,c1cSpecializationCalls:m.specializationCalls,c1cTradeHits:m.tradeHits,c1cConstructionHits:m.constructionHits,c1cStoneHits:m.stoneHits,c1cFallbacks:m.fallbacks,c1cInvalidations:m.invalidations,c1cLegacyChecksAvoided:m.legacyEntryChecksAvoided};}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=baseSnap.call(this,w,reason,note);if(sn?.global)Object.assign(sn.global,fmt(w));return sn;};
const baseCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=baseCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+FIELDS.map(q).join(',');let i=1;for(const sn of this.snapshots||[])for(const row of sn.villages||[])if(i<lines.length)lines[i++]+=','+FIELDS.map(k=>q(sn.global?.[k])).join(',');return lines.join('\n');};
const baseJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=baseJSON.call(this,w);d.version=VERSION;d.worldSummary.v034c1cRevision='frontier-hotpath-scoped-event-index-v1';d.worldSummary.v034c1cPerformance=summarize(w);d.worldSummary.v034c1cScope='V0.19 specialization trade throughput/stone imports/construction history only. V0.20 random candidate scans are unchanged.';return d;};
const oldSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem('village-observer-v034c1c',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1c');return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v034C1C-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1C-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('V0.34C1C CSV schema mismatch '+JSON.stringify(test.bad?.slice(0,3)));download(`village-observer-v034C1C-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=oldHeader.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Frontier Hotpath Optimization V1',summary:'V0.19 분기 전문화의 반복적인 전체 이벤트 로그 탐색을 분기·국가별 임시 인덱스로 줄이고, V0.20 개척 RNG 경로는 변경하지 않았습니다.',sections:[['성능',['시설 전문화에서 과거 교역량·석재 수입·건설 이력을 타일마다 반복 스캔하지 않고 한 번의 로그 통과로 인덱싱합니다.','120일 교역 처리량과 240일 석재 수입·최근 건설 기록의 원래 범위·합산 순서를 유지합니다.','이벤트 로그가 도중에 증가하거나 참조가 바뀌면 원래 조회 경로를 사용합니다.']],['관측',['C1B의 21개 구간 프로파일러와 기존 E9/E10 계측은 그대로 유지합니다.','C1C의 인덱스 생성·적중·회귀 횟수를 CSV·Devlog에 추가합니다.']],['게임 규칙',['Person, Settlement, 군사, 기술, 경제, 개척 점수, 소비 난수 횟수, 임계값과 AI 선택은 변경하지 않습니다.','정밀 프로파일 스위치는 기존처럼 기본 OFF이며 C1C의 임시 인덱스는 세이브에 기록하지 않습니다.']]]});
})(window.VSim);
