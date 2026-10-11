
/* V0.34C1B — Seasonal Legacy Profiling V1 (observational, off by default).
   Script-boundary checkpoints divide the historic nested seasonalTick call chain
   into disjoint strata. No AI decisions, physical values, or game RNG are changed. */
(function(NS){'use strict';
const VERSION='V0.34C1B',PREVIOUS='V0.34C1A';
const LABELS={core07:'초기 정착지 핵심',maintenance08:'초기 기술·유지보수',society18:'초기 사회·문화',frontier20:'초기 개척·이주',frontier24:'지역 확장·관리',survival30:'생존·경제 안정화',industry31:'철산업·산업투자',military32:'초기 군사 인력·장비',administration32:'군사시설·행정',housing32:'주거·Formation 확장',tradeIntent32:'교역망 계획',tradeLifecycle32:'교역망 Intent 관리',commerce32:'상업·건설 제안',hunger32:'식량 상태 검사',armory32:'군수·Readiness',war33:'전쟁 진입·관리',warRecovery33:'전쟁 후 회복·탈출',production33:'생산 발전',aiInvestment33:'AI 우선투자·회복',equipment33:'장비 복구·물류',after33:'33I 이후 바깥쪽 래퍼'};
const KEYS=Object.keys(LABELS),state=new WeakMap();
const now=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
const r3=x=>Math.round((Number(x)||0)*1000)/1000;
const cal=w=>Number(w?.calendarOrdinalDay?.()??(w?.ordinalDay?.()||0)*3);
function get(w){let s=state.get(w);if(!s){s={enabled:false,last:null,current:null,quarters:0,samples:0,timerSamples:0,bookkeepingMs:0};state.set(w,s);}return s;}
function isActive(w){return !!(w&&state.get(w)?.enabled);}
function emptyQuarter(w){return{calendarDay:cal(w),year:Number(w.year||0),season:Number(w.season||0),outerMs:0,samples:0,byNation:{},stages:Object.fromEntries(KEYS.map(k=>[k,0])),missing:0,nonAdditiveNote:'strata are non-overlapping increments between dated seasonalTick boundaries; E9/E10 internal timers overlap them'};}
function start(w,v){if(!isActive(w))return null;const s=get(w),key=cal(w);if(!s.current||s.current.calendarDay!==key){if(s.current?.samples)s.quarters++;s.current=emptyQuarter(w);}return {id:String(v.id),name:String(v.name||v.id),start:now(),layerMs:{},samples:0};}
function addLayer(w,v,k,ms){const s=state.get(w),f=s?.activeFrame;if(!s?.enabled||!f||f.id!==String(v.id))return;const t=now();f.layerMs[k]=Math.max(0,Number(ms)||0);f.samples++;s.timerSamples++;s.bookkeepingMs+=now()-t;}
function finish(w,v,f){if(!f)return;const s=get(w),t=now(),q=s.current;let previous=Math.max(0,now()-f.start),total=previous,missing=0;
 const increments={after33:0};let upperKey='after33';for(const key of [...KEYS].reverse().filter(k=>k!=='after33')){const inclusive=f.layerMs[key];if(inclusive==null){missing++;continue;}increments[upperKey]=Math.max(0,previous-inclusive);previous=inclusive;upperKey=key;}
 // The innermost checkpoint covers all historical seasonal logic inside it.
 increments.core07=Math.max(0,Number(f.layerMs.core07||0));
 // Every increment is attributed to the newer endpoint; after33 is the remaining external shell.
 // Each diff is exclusive of its older recorded checkpoint; none should be added to E9/E10.
 const measured=KEYS.reduce((sum,k)=>sum+(increments[k]||0),0);
 const row={id:f.id,name:f.name,outerMs:r3(total),stages:Object.fromEntries(KEYS.map(k=>[k,r3(increments[k]||0)])),missing,coveredMs:r3(measured),timerSamples:f.samples};
 q.outerMs+=total;q.samples++;q.missing+=missing;
 for(const k of KEYS)q.stages[k]+=Number(increments[k]||0);
 q.byNation[f.id]=row;
 s.samples++;s.last=q;const e9=w._v32e9PerfLast||{},e10=w._v32e10PerfLast||{};q.legacyOtherE10Ms=Math.max(0,Number(e9.unattributed||0)-Number(e10.maintenanceFinalize||0)-Number(e10.maintenancePlan||0));s.activeFrame=null;s.bookkeepingMs+=now()-t;
}
function summarize(w){const s=get(w),q=s.last;if(!q)return{enabled:s.enabled,hasProfile:false,quarters:(s.quarters||0)+(s.current?.samples?1:0),samples:s.samples,timerSamples:s.timerSamples,bookkeepingMs:r3(s.bookkeepingMs)};
 return{enabled:s.enabled,hasProfile:true,year:q.year,season:q.season,calendarDay:q.calendarDay,outerMs:r3(q.outerMs),sampleCount:q.samples,missingCheckpoints:q.missing,stages:Object.fromEntries(KEYS.map(k=>[k,r3(q.stages[k])])),byNation:q.byNation,timerSamples:s.timerSamples,bookkeepingMs:r3(s.bookkeepingMs),quarters:(s.quarters||0)+(s.current?.samples?1:0),
 legacyOtherE10Ms:r3(q.legacyOtherE10Ms||0),
 note:'E9/E10 timers overlap historical strata; do not sum these two presentations. Bookkeeping time is a measured lower bound, not the entire profiler overhead.'};
}
function setEnabled(w,on){const s=get(w);s.enabled=!!on;s.current=null;s.activeFrame=null;return s.enabled;}
NS.V034C1B={version:VERSION,LABELS,KEYS,now,isActive,addLayer,start,finish,setEnabled,summarize};
const oldSeason=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const P=NS.V034C1B;if(!P.isActive(w))return oldSeason.call(this,w);
 const s=get(w),frame=P.start(w,this);s.activeFrame=frame;
 try{return oldSeason.call(this,w);}finally{P.finish(w,this,frame);}
};
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
// Side-channel only: never persist the profiler into the physical save file.
const oldSnap=NS.Telemetry.prototype.snapshot;
const G=['profileEnabled34C1B','profileQuarter34C1B','profileOuterMs34C1B','profileSamples34C1B','profileMissing34C1B','profileBookkeepingMs34C1B','profileTimerSamples34C1B','profileLegacyOtherE10Ms34C1B',...KEYS.map(k=>'profile_'+k+'Ms34C1B')];
const N=['profileNationOuterMs34C1B','profileNationTopLayer34C1B','profileNationTopLayerMs34C1B','profileNationCheckpointsMissing34C1B'];
function globals(s){const x={profileEnabled34C1B:s.enabled?1:0,profileQuarter34C1B:s.hasProfile?`${s.year}Y-Q${s.season+1}`:'NONE',profileOuterMs34C1B:s.outerMs||0,profileSamples34C1B:s.sampleCount||0,profileMissing34C1B:s.missingCheckpoints||0,profileBookkeepingMs34C1B:s.bookkeepingMs||0,profileTimerSamples34C1B:s.timerSamples||0,profileLegacyOtherE10Ms34C1B:s.legacyOtherE10Ms||0};for(const k of KEYS)x['profile_'+k+'Ms34C1B']=Number(s.stages?.[k]||0);return x;}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=oldSnap.call(this,w,reason,note);if(!sn)return sn;const s=summarize(w);Object.assign(sn.global,globals(s));for(const row of sn.villages||[]){const n=s.byNation?.[String(row.id)];row.profileNationOuterMs34C1B=Number(n?.outerMs||0);row.profileNationCheckpointsMissing34C1B=Number(n?.missing||0);const top=n?Object.entries(n.stages||{}).sort((a,b)=>b[1]-a[1])[0]:null;row.profileNationTopLayer34C1B=top?.[0]||'NONE';row.profileNationTopLayerMs34C1B=Number(top?.[1]||0);}return sn;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+[...G,...N].map(q).join(',');let i=1;for(const sn of this.snapshots||[])for(const row of sn.villages||[])if(i<lines.length)lines[i++]+=','+[...G.map(k=>q(sn.global?.[k])),...N.map(k=>q(row?.[k]))].join(',');return lines.join('\n');};
const oldJson=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJson.call(this,w);d.version=VERSION;d.worldSummary.v034c1bRevision='seasonal-legacy-profiling-v1';d.worldSummary.v034c1bProfiler=summarize(w);d.worldSummary.v034c1bProfileLabels=LABELS;return d;};
const priorSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem('village-observer-v034c1b',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const x=localStorage.getItem('village-observer-v034c1b');return x?NS.World.from(JSON.parse(x)):priorSave.load?.();},
 export(w){download(`village-observer-v034C1B-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('V0.34C1B CSV schema mismatch '+JSON.stringify(test.bad?.slice(0,3)));download(`village-observer-v034C1B-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader,oldWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(){const r=oldHeader.call(this);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
 NS.UI.prototype.renderWorld=function(){const r=oldWorld.call(this),panel=document.getElementById('v30aPerfPanel'),w=this.world;if(!panel||!w)return r;let el=panel.querySelector('.v034c1b-profiler');if(!el){el=document.createElement('div');el.className='v034c1b-profiler small';el.style.marginTop='8px';el.style.borderTop='1px solid #6665';el.style.paddingTop='8px';
  el.innerHTML='<label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" class="v034c1b-toggle"> C1B 정밀 분기 프로파일링 (기본 OFF, 성능에 영향)</label><div class="v034c1b-summary small muted" style="margin-top:5px"></div>';
  panel.appendChild(el);el.querySelector('.v034c1b-toggle').addEventListener('change',e=>{setEnabled(this.world,e.target.checked);const box=el.querySelector('.v034c1b-summary');if(box)box.textContent=e.target.checked?'활성화됨 · 다음 분기부터 측정합니다.':'비활성화됨 · 측정값은 마지막 측정 분기를 유지합니다.';});}
  const toggle=el.querySelector('.v034c1b-toggle'),p=summarize(w);if(toggle&&toggle.checked!==p.enabled)toggle.checked=p.enabled;
  const box=el.querySelector('.v034c1b-summary');if(box){if(!p.hasProfile){box.textContent='측정 데이터 없음 · 체크한 뒤 다음 분기까지 진행하세요.';}else{const top=Object.entries(p.stages).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${LABELS[k]} ${Number(v).toFixed(1)}ms`).join(' · ');box.textContent=`최근 ${p.year}년 ${p.season+1}분기 · 전체 ${Number(p.outerMs).toFixed(1)}ms / ${p.sampleCount}국 · 상위: ${top} · 누락 ${p.missingCheckpoints}개`;}}return r;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'Seasonal Legacy Profiling V1',summary:'분기 legacy-other 잔여 비용을 정밀 추적하기 위해 historical seasonalTick 래퍼를 중복 없는 증분 구간으로 나누는 개발자 전용 계측을 도입합니다.',sections:[['정밀 관측',['20개 역사적 seasonalTick 경계 + 최외곽을 별도로 계측하고 각 중첩 함수의 순수 증분 비용을 계산합니다.','국가별 전체 분기 비용과 최상위 구간을 Snapshot CSV에 남기고, Devlog에는 국가별 구간 전체를 포함합니다.','기존 E9/E10 계측은 그대로 둡니다. E9/E10 구간과 역사적 구간은 겹치므로 상호 합산하지 않습니다.']],['성능·안전',['계측 스위치는 월드 성능 패널에서 수동으로 켜며 기본값은 OFF입니다.','Person/일별 행동 루프에는 타이머를 넣지 않습니다.','Settlement 규칙·AI·자원·전쟁·난수 로직은 변경하지 않았습니다.']],['호환',['V0.34C1A 세이브를 그대로 불러옵니다. 계측 임시 데이터는 물리 세이브에 기록하지 않습니다.']]]});
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('C1B header',e);}
})(window.VSim);

