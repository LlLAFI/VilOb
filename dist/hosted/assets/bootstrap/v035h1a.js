/* V0.35H1A — Repeatable performance worlds: fixed initial map + RNG, resumable
 * scenario checkpoints, and durable, low-frequency state signatures.
 * No changes to ordinary world's simulation RNG or gameplay balance.
 */
(function(NS){'use strict';
if(!NS?.World||!NS?.MapGenerator||!NS?.V035H0)return;
const VERSION='V0.35H1A',KEY='village-observer-v035h1a',FORMAT='village-observer-test-scenario';
const PERF_FORMAT='vilob-performance-anchor-v1',DEFAULT_SEED='perf-19x19-a-v1',YEARS=[20,30,40,60,75,90,100,120,150];
const oldAdvance=NS.World.prototype.advanceOneDay,oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldToJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
const copy=x=>JSON.parse(JSON.stringify(x));
const cal=w=>Number(w.calendarOrdinalDay?.()??0);
const hashSeed=s=>{let h=2166136261>>>0;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const next=s=>{let x=(s>>>0)||0x6d2b79f5;x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;};
function withRng(ref,fn){const prev=Math.random;Math.random=()=>{ref.state=next(ref.state);return ref.state/4294967296;};try{return fn();}finally{Math.random=prev;}}
function validState(x){return Number.isInteger(x)&&x>=0&&x<=4294967295;}
function ensure(w,src=null){if(!w)return null;if(src?.v35h1a&&w.v35h1a==null)w.v35h1a=copy(src.v35h1a);const d=w.v35h1a;if(!d)return null;if(!d.enabled||!validState(d.rngState)||typeof d.seed!=='string'||!d.seed)throw new Error('H1A 결정론 RNG/시드가 올바르지 않습니다.');d.checkpoints=d.checkpoints||{};return d;}
function fingerprint(w){
 // Simulation state signature, explicitly excludes rendering, telemetry, profiler,
 // diagnostic caches, and wall-clock time. A compact diagnostic, not a full proof of parity.
 const string=JSON.stringify({date:[w.year,w.season,w.day],map:(w.map?.tiles||[]).map(t=>[t.id,t.ownerId,t.v33OccupierId||null,t.terrain,t.road,t.resources,t.buildings]),nations:(w.villages||[]).map(v=>[v.id,v.status,v.coreTileId,[...(v.territory||[])].sort((a,b)=>a-b),v.gold,v.technologies?[...v.technologies].sort():[],(v.residents||[]).map(p=>[p.id,p.alive,p.age,p.health,p.hunger,p.happiness,p.homeTileId,p.workTileId,p.job,p.assignment,p.gold29,p.militaryStatus32A]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))]),rng:w.v35h1a?.rngState});
 let a=2166136261>>>0,b=0x9e3779b9;for(let i=0;i<string.length;i++){const c=string.charCodeAt(i);a=Math.imul(a^c,16777619)>>>0;b=(Math.imul(b^c,2246822519)+3266489917)>>>0;}return [a,b].map(x=>x.toString(16).padStart(8,'0')).join('');
}
function measure(w){return {year:Number(w.year),calendarDay:cal(w),population:(w.activeVillages||[]).reduce((n,v)=>n+(v.residents||[]).filter(p=>p.alive!==false).length,0),activeNations:(w.activeVillages||[]).length,claimedTiles:(w.map?.tiles||[]).filter(t=>t.ownerId!=null).length,settlements:Number(NS.V034B?.summary?.(w)?.activeSettlements??0)||undefined,rngState:w.v35h1a?.rngState??null,signature:fingerprint(w)};}
function checkpoint(w,label,save=true){const d=ensure(w);if(!d)throw Error('고정 성능 시나리오가 아닙니다.');const c={label:String(label),...measure(w)};if(save)d.checkpoints[String(label)]=c;return c;}
NS.World.prototype.advanceOneDay=function(...args){const d=ensure(this);if(!d)return oldAdvance.apply(this,args);const ref={state:d.rngState>>>0};const result=withRng(ref,()=>oldAdvance.apply(this,args));d.rngState=ref.state>>>0;
 for(const y of YEARS){if(this.year>=y&&!d.checkpoints[String(y)])checkpoint(this,String(y));}
 return result;};
function createWorld(seed=DEFAULT_SEED){seed=String(seed||DEFAULT_SEED).trim();if(!/^[a-zA-Z0-9_-]{3,72}$/.test(seed))throw Error('성능 시드는 영문·숫자·하이픈·밑줄 3~72자로 입력하세요.');
 const ref={state:hashSeed(seed+'|h1a-init')||1};let w=withRng(ref,()=>{
  const map=Object.create(NS.TileMap.prototype);Object.assign(map,{width:19,height:19,tiles:[],ruinIds:new Set()});NS.MapGenerator.naturalGenerate(map,seed);map.generationSeed=seed;
  const o=Object.create(NS.World.prototype);Object.assign(o,{year:1,season:0,day:1,speed:1,running:false,eventCount:0,events:[],map,villages:[],selectedVillageId:null,selectedPersonId:null,selectedTileId:null,telemetry:new NS.Telemetry(),anomalyStates:{},recentTrades:[],tradeRouteCache:{},mapSource:{type:'natural',name:'H1A Performance Anchor',seed}});
  o.createVillages(7);o.telemetry.snapshot(o,'WORLD_START');return NS.V033G2B?.attachWorld?.(o)||o;
 });
 // G3's AI anchor experiment must remain OFF, with all seven baseline nations.
 if(w.v33g3)w.v33g3.experiment=null;
 w.v35h1a={enabled:true,format:PERF_FORMAT,seed,rngAlgorithm:'xorshift32',rngState:ref.state>>>0,checkpoints:{},initialProfiles:(w.villages||[]).map(v=>({id:v.id,profileId:v.aiProfileId||v.brain?.aiProfileId||null}))};
 w.testScenario={id:'h1a-'+seed,title:'H1A 성능 기준 · '+seed,purpose:'19×19 기본 7개국 고정 자연주행 성능/결정론 비교',expected:'동일 버전에서 동일 시드 및 동일 체크포인트 상태를 재현',category:'performance',intendedVersion:VERSION,tags:['H1A','performance','fixed-rng',seed]};w._v32e11Scenario={...w.testScenario};
 checkpoint(w,'INITIAL');return w;
}
NS.World.prototype.serialize=function(...args){const d=oldSerialize.apply(this,args);d.version=VERSION;if(this.v35h1a)d.v35h1a=copy(this.v35h1a);return d;};
NS.World.from=function(data,...args){const current=data?.version===VERSION;const d=current?{...copy(data),version:'V0.35H0'}:data;const w=oldFrom.call(this,d,...args);if(data?.v35h1a){w.v35h1a=copy(data.v35h1a);ensure(w);
 // Some legacy attachWorld readers rewrite fiscal and seasonal state at load time.
 // The actual checkpoint values must remain authoritative for repeatable future pulses.
 // Restore serialized canonical fiscal/admin/intelligence timing, which some older
 // import wrappers refresh merely while attaching the world.
 for(const k of ['v30','v33d1a','v33e','v33e1','v33e2','v33f5','v33f5a7','v33g1'])if(Object.prototype.hasOwnProperty.call(data,k))w[k]=copy(data[k]);
 for(const tile of data.map?.tiles||[]){const t=w.map?.get?.(Number(tile.id));if(t&&Object.prototype.hasOwnProperty.call(tile,'v29Economy'))t.v29Economy=copy(tile.v29Economy);}
 for(const src of data.villages||[]){const v=(w.villages||[]).find(x=>String(x.id)===String(src.id));if(!v)continue;
  for(const k of ['lastExpansionClaimDay','v32dMilitary','v32dAdmin','v32d3Housing','v32d3Expansion','v32d4'])if(Object.prototype.hasOwnProperty.call(src,k))v[k]=copy(src[k]);
  for(const saved of src.residents||[]){const p=(v.residents||[]).find(q=>String(q.id)===String(saved.id));if(p&&!Object.prototype.hasOwnProperty.call(saved,'_v27NextJobReviewDay'))delete p._v27NextJobReviewDay;}
 } }return w;};
function report(w){const d=ensure(w);return {format:PERF_FORMAT,version:VERSION,mode:d?'FIXED_RNG':'NORMAL',seed:d?.seed||null,calendarDay:cal(w),rngState:d?.rngState??null,signature:d?fingerprint(w):null,checkpoints:d?copy(d.checkpoints):{},current:d?measure(w):null,profilers:{routeTime:w._v35h0RouteProfile===true,sim35A:w._v35aProfilerEnabled===true},guidance:'State signature excludes telemetry and runtime performance counters. Compare the same calendar date, RNG state and complete game state in addition to this signature. Timing comparison requires same input save, device and profiler OFF.'};}
NS.Telemetry.prototype.toJSON=function(w,...args){const d=oldToJSON.call(this,w,...args);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v35h1aPerformance=report(w);return d;};
function download(name,text){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function scenario(w){const d=ensure(w);if(!d)throw Error('고정 성능 세계에서만 체크포인트를 내보낼 수 있습니다.');const s=w.serialize(),meta={...w.testScenario,checkpointCalendarDay:cal(w),checkpointYear:Number(w.year),seed:d.seed};s.testScenario={...meta};if(s.v32e11)s.v32e11.scenario={...meta};return {format:FORMAT,version:1,validationVersion:'1.1',meta,world:s,perf:{format:PERF_FORMAT,stateSignature:fingerprint(w),rngState:d.rngState,seed:d.seed}};}
async function importCheckpoint(file){const text=typeof file==='string'?file:await file.text(),o=JSON.parse(text);if(o?.format!==FORMAT||o?.perf?.format!==PERF_FORMAT||o?.world?.version!==VERSION||o?.meta?.category!=='performance')throw Error('H1A 성능 체크포인트 시나리오가 아닙니다.');const d=o.world.v35h1a;if(!d?.enabled||d.seed!==o.perf.seed||d.rngState!==o.perf.rngState||!validState(d.rngState))throw Error('체크포인트 RNG/시드 검증 실패');
 // Validate the exact restored simulation state before any telemetry/import side effects.
 const w=NS.World.from(o.world);ensure(w);if(fingerprint(w)!==o.perf.stateSignature)throw Error('체크포인트 세계 상태 서명이 일치하지 않습니다.');
 NS.V032E12?.validateRuntime?.(w,o.meta);
 return w;}
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족. 전체 체크포인트 JSON으로 내보내세요: '+e.message);}},load(){const x=localStorage.getItem(KEY);return x?NS.World.from(JSON.parse(x)):oldSave.load?.();},export(w){download(`village-observer-v035H1A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){download(`village-observer-v035H1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportH1APerf(w){download(`vilob-v035H1A-performance-${w.year}y.json`,JSON.stringify(report(w),null,2));},exportH1ACheckpoint(w){const x=scenario(w);download(`vilob-PERF-${x.perf.seed}-${cal(w)}d-checkpoint.json`,JSON.stringify(x));return x;},importH1ACheckpoint:importCheckpoint};
function uiInstall(ui){if(typeof document==='undefined')return;const host=document.getElementById('v035gConstructionExports')||document.getElementById('view-world');if(!host)return;let box=document.getElementById('v035h1aPanel');if(!box){box=document.createElement('div');box.id='v035h1aPanel';box.className='panel';box.innerHTML='<h3>H1A · 고정 성능 시나리오</h3><div class="small muted">19×19 · 기본 7개국 · 맵 시드/RNG 고정. 시나리오 체크포인트에서 같은 상태로 재시작합니다.</div><div class="button-grid"><button id="v035h1aStart">고정 시나리오 시작</button><button id="v035h1aCheckpoint">현재 체크포인트 JSON</button><label class="file-btn">체크포인트 불러오기<input id="v035h1aImport" type="file" accept=".json,application/json"></label><button id="v035h1aReport">성능·상태 요약 JSON</button></div><div id="v035h1aStatus" class="small muted"></div>';host.appendChild(box);const q=id=>document.getElementById(id);q('v035h1aStart').onclick=()=>{if(!confirm('현재 세계를 종료하고 표준 PERF-19X19-A 고정 시나리오를 시작할까요?'))return;try{const w=createWorld();ui.setWorld(w);ui.render?.();uiInstall(ui);}catch(e){q('v035h1aStatus').textContent='시작 실패: '+e.message;}};q('v035h1aCheckpoint').onclick=()=>{try{NS.SaveSystem.exportH1ACheckpoint(ui.world);q('v035h1aStatus').textContent='체크포인트 내보내기 완료';}catch(e){q('v035h1aStatus').textContent=e.message;}};q('v035h1aImport').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!confirm('현재 세계를 종료하고 이 H1A 성능 체크포인트를 불러올까요?'))return;const w=await importCheckpoint(f);ui.setWorld(w);ui.render?.();uiInstall(ui);}catch(ex){q('v035h1aStatus').textContent='체크포인트 오류: '+ex.message;}finally{e.target.value='';}};q('v035h1aReport').onclick=()=>NS.SaveSystem.exportH1APerf(ui.world);}
 const d=ui?.world?.v35h1a,st=document.getElementById('v035h1aStatus');if(st)st.textContent=d?.enabled?`고정 모드 ON · ${d.seed} · ${ui.world.year}년 · RNG ${d.rngState} · 요약 체크포인트 ${Object.keys(d.checkpoints||{}).join(', ')}`:'일반 세계 · 고정 성능 모드 비활성';}
if(NS.UI){const prevRender=NS.UI.prototype.renderWorld,prevHeader=NS.UI.prototype.renderHeader,prevAll=NS.UI.prototype.render,prevViews=NS.UI.prototype.renderViews;NS.UI.prototype.renderWorld=function(...args){const r=prevRender.apply(this,args);uiInstall(this);return r;};NS.UI.prototype.renderHeader=function(...args){const r=prevHeader.apply(this,args);badge();return r;};NS.UI.prototype.render=function(...args){const r=prevAll.apply(this,args);badge();return r;};NS.UI.prototype.renderViews=function(...args){const r=prevViews.apply(this,args);badge();return r;};}
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Fixed-Seed Performance Scenario · H1A',summary:'기본 7개국 19×19 세계의 맵 생성·시뮬레이션 난수를 재현하고, 복원 가능한 체크포인트 시나리오와 연차별 세계 상태 서명을 제공합니다.',sections:[['고정 자연주행',['표준 PERF-19X19-A로 지도 시드와 초기/진행 난수 상태를 고정합니다.','기존 G3 AI Anchor Profile을 적용하지 않고 기본 7개 국가 구성을 사용합니다.']],['체크포인트',['20·30·40·60·75·90·100·120·150년 진입 시 가벼운 상태 서명만 자동 기록합니다.','전체 세계를 재시작할 체크포인트 JSON은 사용자가 세계 탭에서 내보내며, 불러오기 시 RNG·시드·상태 서명을 확인합니다.']],['성능 정책',['실행시간 계측은 기본 OFF이고 계측 JSON은 시나리오 세계 상태와 구분합니다.','기존 H0 BFS 최적화, 건설·경제·군사·주거·기술 43개, CSV 1683열을 보존합니다.']]]});
NS.V035H1A=Object.freeze({version:VERSION,seed:DEFAULT_SEED,createWorld,checkpoint,report,scenario,importCheckpoint,fingerprint,ensure,withRng});badge();
})(window.VSim);
