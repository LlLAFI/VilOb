
/* V0.34C1D — Legacy Core Hotpath Profiling V1.
   Observation only; enabled exclusively by the existing C1B profiler switch.
   Inclusive child timings are never added to the disjoint root grouping.
   Transient WeakMaps are never written to World.serialize(). */
(function(NS){'use strict';
const VERSION='V0.34C1D',PREVIOUS='V0.34C1C';
const LABELS={decision:'AI 분기 판단',baseScores:'AI 점수 평가',decisionLog:'전략 프로그램 Devlog 조회',infrastructure:'자동 기반시설',development:'정착지 개발',house:'주택 정책',defense:'방어 정책',expansion:'개척 정책'};
const KEYS=Object.keys(LABELS),ROOT=['decision','infrastructure','development','house','defense','expansion'];
const state=new WeakMap(),frames=new WeakMap();
const now=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
const r3=x=>Math.round((Number(x)||0)*1000)/1000;
const cal=w=>Number(w?.calendarOrdinalDay?.()??(w?.ordinalDay?.()||0)*3);
function get(w){let s=state.get(w);if(!s){s={last:null,history:[],totalCalls:0,totalLogEntriesCopied:0,samples:0,bookkeepingMs:0};state.set(w,s);}return s;}
function makeQuarter(w){return{calendarDay:cal(w),year:Number(w.year||0),season:Number(w.season||0),nations:0,coreMs:0,rootMs:0,unclassifiedMs:0,byNation:{},times:Object.fromEntries(KEYS.map(k=>[k,0])),exclusive:Object.fromEntries(KEYS.map(k=>[k,0])),calls:Object.fromEntries(KEYS.map(k=>[k,0])),logEntriesCopied:0,territoryUpperBound:0,callSamples:0};}
function newFrame(v,w){return{id:String(v.id),name:String(v.name||v.id),begin:now(),times:Object.fromEntries(KEYS.map(k=>[k,0])),exclusive:Object.fromEntries(KEYS.map(k=>[k,0])),calls:Object.fromEntries(KEYS.map(k=>[k,0])),root:0,stack:[],logEntriesCopied:0,territoryUpperBound:0,territoryAtStart:Number(v.territory?.size||0),populationAtStart:Number(v.residents?.filter?.(x=>x.alive)?.length||0),exceptions:0};}
function beginCore(w,v){if(!NS.V034C1B?.isActive(w))return null;
 const s=get(w),d=cal(w);if(!s.last||s.last.calendarDay!==d){s.last=makeQuarter(w);s.history.push(s.last);if(s.history.length>8)s.history.shift();}
 const f=newFrame(v,w);frames.set(w,f);return f;
}
function isCoreActive(w,v){const f=w&&frames.get(w);return !!(f&&v&&String(v.id)===f.id);}
function timeKey(w,v,key,fn){const f=frames.get(w);if(!f||String(v?.id)!==f.id)return fn();
 const parent=f.stack.at(-1),entry={key,begin:now(),childMs:0};f.stack.push(entry);f.calls[key]++;
 if(key==='development'||key==='infrastructure')f.territoryUpperBound+=Number(v.territory?.size||0);
 try{return fn();}catch(e){f.exceptions++;throw e;}finally{const duration=Math.max(0,now()-entry.begin),exclusive=Math.max(0,duration-entry.childMs);f.stack.pop();if(parent)parent.childMs+=duration;else if(ROOT.includes(key))f.root+=duration;
 f.times[key]+=duration;f.exclusive[key]+=exclusive;
 }
}
function timeDecisionLog(w,v,fn){const f=frames.get(w);if(f&&String(v?.id)===f.id)f.logEntriesCopied+=Number(w.telemetry?.entries?.length||0);return timeKey(w,v,'decisionLog',fn);}
function endCore(w,v,f){if(!f)return;const s=get(w),q=s.last,ms=Math.max(0,now()-f.begin);frames.delete(w);
 const row={id:f.id,name:f.name,coreMs:r3(ms),rootMs:r3(f.root),unclassifiedMs:r3(Math.max(0,ms-f.root)),times:Object.fromEntries(KEYS.map(k=>[k,r3(f.times[k])])),exclusive:Object.fromEntries(KEYS.map(k=>[k,r3(f.exclusive[k])])),calls:{...f.calls},logEntriesCopied:f.logEntriesCopied,territoryAtStart:f.territoryAtStart,populationAtStart:f.populationAtStart,territoryUpperBound:f.territoryUpperBound,exceptions:f.exceptions};
 q.nations++;q.coreMs+=ms;q.rootMs+=f.root;q.unclassifiedMs+=Math.max(0,ms-f.root);q.byNation[f.id]=row;q.logEntriesCopied+=f.logEntriesCopied;q.territoryUpperBound+=f.territoryUpperBound;
 for(const k of KEYS){q.times[k]+=f.times[k];q.exclusive[k]+=f.exclusive[k];q.calls[k]+=f.calls[k];q.callSamples+=f.calls[k];}
 s.samples++;s.totalCalls+=Object.values(f.calls).reduce((a,b)=>a+b,0);s.totalLogEntriesCopied+=f.logEntriesCopied;
}
function summarize(w){const s=get(w),q=s.last,enabled=NS.V034C1B?.isActive(w)||false;
 if(!q)return{enabled,hasProfile:false,samples:s.samples,bookkeepingMs:r3(s.bookkeepingMs)};
 const coreReference=NS.V034C1B?.summarize(w);let c1bCore=null;
 if(coreReference?.hasProfile&&coreReference.calendarDay===q.calendarDay&&coreReference.sampleCount===q.nations)c1bCore=Number(coreReference.stages?.core07||0);
 return{enabled,hasProfile:true,year:q.year,season:q.season,calendarDay:q.calendarDay,nations:q.nations,coreMs:r3(q.coreMs),rootMs:r3(q.rootMs),unclassifiedMs:r3(q.unclassifiedMs),c1bCoreMs:c1bCore,coreDeltaMs:c1bCore==null?null:r3(c1bCore-q.coreMs),times:Object.fromEntries(KEYS.map(k=>[k,r3(q.times[k])])),exclusive:Object.fromEntries(KEYS.map(k=>[k,r3(q.exclusive[k])])),calls:{...q.calls},byNation:q.byNation,logEntriesCopied:q.logEntriesCopied,territoryUpperBound:q.territoryUpperBound,callSamples:q.callSamples,quarters:s.history.length,samples:s.samples,totalCalls:s.totalCalls,totalLogEntriesCopied:s.totalLogEntriesCopied,
 note:'Root grouping = decision+infrastructure+development+house+defense+expansion at stack depth 0; baseScores and decisionLog are nested measurements, not additive to parent. territoryUpperBound counts territory size at entry, not actual tile visits. C1B core07 includes extra profiling overhead.'};
}
function history(w){const s=get(w);return s.history.map(q=>({year:q.year,season:q.season,calendarDay:q.calendarDay,nations:q.nations,coreMs:r3(q.coreMs),rootMs:r3(q.rootMs),unclassifiedMs:r3(q.unclassifiedMs),times:Object.fromEntries(KEYS.map(k=>[k,r3(q.times[k])])),calls:{...q.calls},logEntriesCopied:q.logEntriesCopied,territoryUpperBound:q.territoryUpperBound}));}
function wrap(obj,method,key,mode){if(typeof obj?.[method]!=='function')return;const old=obj[method];obj[method]=function(...args){const w=mode==='brain'?args[1]:args[0],v=mode==='brain'?args[0]:this;
 if(!isCoreActive(w,v))return old.apply(this,args);
 return timeKey(w,v,key,()=>old.apply(this,args));};}
wrap(NS.VillageBrain.prototype,'seasonalDecision','decision','brain');
wrap(NS.VillageBrain.prototype,'baseScores','baseScores','brain');
for(const [method,key] of [['autoInfrastructure','infrastructure'],['developSettlements','development'],['buildHouse','house'],['buildDefense','defense'],['startExpansion','expansion']])wrap(NS.Village.prototype,method,key,'village');
NS.V034C1D={version:VERSION,LABELS,KEYS,beginCore,endCore,isCoreActive,timeDecisionLog,summarize,history};
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
const oldSnap=NS.Telemetry.prototype.snapshot;
const GLOBAL=['coreDEnabled','coreDQuarter','coreDTotalMs','coreDRootMs','coreDResidualMs','coreDC1BReferenceMs','coreDC1BDeltaMs','coreDNations','coreDLogEntriesCopied','coreDTerritoryUpperBound',...KEYS.flatMap(k=>['coreD_'+k+'Ms','coreD_'+k+'ExclusiveMs','coreD_'+k+'Calls'])];
const NATION=['coreDNationTotalMs','coreDNationRootMs','coreDNationResidualMs','coreDNationLogEntriesCopied','coreDNationTerritory','coreDNationPopulation','coreDNationTerritoryUpperBound',...KEYS.flatMap(k=>['coreDNation_'+k+'Ms','coreDNation_'+k+'ExclusiveMs','coreDNation_'+k+'Calls'])];
function worldFields(s){const r={coreDEnabled:s.enabled?1:0,coreDQuarter:s.hasProfile?`${s.year}Y-Q${s.season+1}`:'NONE',coreDTotalMs:s.coreMs||0,coreDRootMs:s.rootMs||0,coreDResidualMs:s.unclassifiedMs||0,coreDC1BReferenceMs:s.c1bCoreMs??'',coreDC1BDeltaMs:s.coreDeltaMs??'',coreDNations:s.nations||0,coreDLogEntriesCopied:s.logEntriesCopied||0,coreDTerritoryUpperBound:s.territoryUpperBound||0};for(const k of KEYS){r['coreD_'+k+'Ms']=s.times?.[k]||0;r['coreD_'+k+'ExclusiveMs']=s.exclusive?.[k]||0;r['coreD_'+k+'Calls']=s.calls?.[k]||0;}return r;}
function nationFields(n){const r={coreDNationTotalMs:n?.coreMs||0,coreDNationRootMs:n?.rootMs||0,coreDNationResidualMs:n?.unclassifiedMs||0,coreDNationLogEntriesCopied:n?.logEntriesCopied||0,coreDNationTerritory:n?.territoryAtStart||0,coreDNationPopulation:n?.populationAtStart||0,coreDNationTerritoryUpperBound:n?.territoryUpperBound||0};for(const k of KEYS){r['coreDNation_'+k+'Ms']=n?.times?.[k]||0;r['coreDNation_'+k+'ExclusiveMs']=n?.exclusive?.[k]||0;r['coreDNation_'+k+'Calls']=n?.calls?.[k]||0;}return r;}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=oldSnap.call(this,w,reason,note);if(!sn?.global)return sn;const s=summarize(w);Object.assign(sn.global,worldFields(s));for(const v of sn.villages||[])Object.assign(v,nationFields(s.byNation?.[String(v.id)]));return sn;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+[...GLOBAL,...NATION].map(q).join(',');let i=1;for(const sn of this.snapshots||[])for(const n of sn.villages||[])if(i<lines.length)lines[i++]+=','+[...GLOBAL.map(k=>q(sn.global?.[k])),...NATION.map(k=>q(n?.[k]))].join(',');return lines.join('\n');};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary.v034c1dRevision='legacy-core-hotpath-profiling-v1';d.worldSummary.v034c1dProfiler=summarize(w);d.worldSummary.v034c1dQuarterHistory=history(w);d.worldSummary.v034c1dLabels=LABELS;return d;};
const oldSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem('village-observer-v034c1d',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1d');return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v034C1D-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1D-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);if(check&&!check.ok)throw Error('V0.34C1D CSV schema mismatch '+JSON.stringify(check.bad?.slice(0,3)));download(`village-observer-v034C1D-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader,oldWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(){const ret=oldHeader.call(this);document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el)el.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return ret;};
 NS.UI.prototype.renderWorld=function(){const ret=oldWorld.call(this),panel=document.querySelector('.v034c1b-profiler'),w=this.world;if(!panel||!w)return ret;let el=panel.querySelector('.v034c1d-summary');if(!el){el=document.createElement('div');el.className='v034c1d-summary small muted';el.style.marginTop='6px';panel.appendChild(el);}const p=summarize(w);if(!p.hasProfile)el.textContent='C1D: C1B 스위치를 켜고 다음 분기까지 진행하면 AI·건설 경로가 기록됩니다.';else el.textContent=`C1D ${p.year}년 ${p.season+1}분기 · core ${p.coreMs.toFixed(1)}ms / AI ${p.times.decision.toFixed(1)}ms (점수 ${p.times.baseScores.toFixed(1)}ms · 로그 ${p.times.decisionLog.toFixed(1)}ms) / 기반시설 ${p.times.infrastructure.toFixed(1)}ms / 정착지 ${p.times.development.toFixed(1)}ms / 기타 ${p.unclassifiedMs.toFixed(1)}ms`;
 return ret;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Legacy Core Hotpath Profiling V1',summary:'C1C 이후 남은 core07 고정 병목을 AI 결정, 점수, 전략 로그 조회, 자동 기반시설, 정착지 개발로 세분화한 관측 전용 패치입니다.',sections:[['핵심 계측',['C1B 프로파일 ON에서만 core07 내부를 관측하며 기본 OFF를 유지합니다.','AI seasonalDecision과 baseScores, V33C2 전략 프로그램의 최신 AI_DECISION 역순 로그 조회를 개별 계측합니다.','자동 기반시설, 정착지 개발, 주택·방어·개척 정책의 호출 수·시간을 국가별로 기록합니다.']],['해석 주의',['AI 판단 시간은 점수/로그 조회를 포함합니다. 하위 시간과 부모 시간을 더하지 않습니다.','core07 내 최상위 함수 시간만 합산하고 나머지는 미분류 잔여로 남깁니다.','영토 검사량 proxy는 함수 진입 시 영토 수이며 실제 타일 검사 횟수를 뜻하지 않습니다.','C1B core07과 C1D core 측정은 타이머 시작/종료 경계가 조금 다르므로 소량의 계측 오차가 생길 수 있습니다.']],['규칙·호환',['AI 점수·전략 로그 역순 조회 알고리즘·개척 RNG·경제 및 전쟁 규칙은 변경하지 않습니다.','임시 계측은 WeakMap 전용이며 저장 파일에 들어가지 않습니다.','기존 C1C 및 이전 세이브를 기존 로더 체인으로 읽습니다.']]]});
})(window.VSim);
