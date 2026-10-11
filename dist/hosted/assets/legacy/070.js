
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const REV32E3='person-settlement-performance5-leaf-fastpaths-housing-gate';
const CAL=w=>Number(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));

/* ============================================================
   V0.32E3 · Person / Settlement Performance Pass #5
   - Keep the exact accumulated Person.act chain.
   - Remove repeated leaf work proven hot by E2 profiling.
   - Priority-0 housing thresholds are patched in the D3 source above:
     normal 0.90~1.00 occupancy can no longer trigger D3 relocation.
   ============================================================ */
function statsE3(w){
 let s=w.v32e3OptimizationStats;if(s&&s._ready32E3)return s;s=s||{};
 const init={knowledgeFastAdds:0,knowledgeLegacyAdds:0,knowledgeTerritoryTilesAvoided:0,foodReserveFastCalls:0,foodReserveTileScans:0,criticalFoodReserveFastCalls:0,populationIndexCalls:0};
 for(const k in init)if(!Number.isFinite(Number(s[k])))s[k]=init[k];
 Object.defineProperty(s,'_ready32E3',{value:true,writable:true,configurable:true,enumerable:false});w.v32e3OptimizationStats=s;return s;
}
function ensureKnowledgeMetaE3(v,w){
 v._world=w;v.eurekaClaimed=v.eurekaClaimed||[];if(!(v.eurekaClaimed instanceof Set))v.eurekaClaimed=new Set(v.eurekaClaimed);
 v.eurekaBank=v.eurekaBank||{};v.diffusionReceived=v.diffusionReceived||{};v.logisticsStats=v.logisticsStats||{moves:0,foodMoved:0};
 if(!Number.isFinite(v.logisticsStats.woodMoved))v.logisticsStats.woodMoved=0;if(!Number.isFinite(v.logisticsStats.stoneMoved))v.logisticsStats.stoneMoved=0;
 v.knowledgeBySource=v.knowledgeBySource||{};
}
function knowledgeMulE3(v){
 const tc=Number(v.technologies?.size||0),mask=(v.hasTech?.('RECORD_KEEPING')?1:0)|(v.hasTech?.('SCHOLARSHIP')?2:0)|(v.hasTech?.('EDUCATION')?4:0),key=`${tc}:${mask}`;
 if(v._v32e3KnowledgeMulKey===key)return Number(v._v32e3KnowledgeMul||1);
 let m=1;if(mask&1)m*=1.15;if(mask&2)m*=1.32;if(mask&4)m*=1.15;v._v32e3KnowledgeMulKey=key;v._v32e3KnowledgeMul=m;return m;
}

/* ---------- Knowledge fast-add ----------
   V0.8 gainKnowledge calls syncStorageTech(), scanning the whole territory for every
   Person knowledge gain until all 40 technologies are complete. When the current gain
   cannot complete the active research, that scan has no observable effect. Add the
   exact same Knowledge/progress directly and delegate every boundary/special case. */
const gainKnowledgeE2=NS.Village.prototype.gainKnowledge;
NS.Village.prototype.gainKnowledge=function(amount,w,source='생활'){
 if(this.status!=='active')return gainKnowledgeE2.call(this,amount,w,source);
 const a=Number(amount),target=this.researchTarget,tech=target&&NS.TECH?.[target];
 if(!Number.isFinite(a)||!target||!tech||this.technologies?.has?.(target)){statsE3(w).knowledgeLegacyAdds++;return gainKnowledgeE2.call(this,amount,w,source);}
 ensureKnowledgeMetaE3(this,w);const n=a*knowledgeMulE3(this),progress=Number(this.researchProgress||0);
 if(!Number.isFinite(n)||progress+n+1e-9>=Number(tech.cost||0)){statsE3(w).knowledgeLegacyAdds++;return gainKnowledgeE2.call(this,amount,w,source);}
 this.totalKnowledge=Number(this.totalKnowledge||0)+n;this.knowledgeBySource[source]=Number(this.knowledgeBySource[source]||0)+n;this.researchProgress=progress+n;
 const st=statsE3(w);st.knowledgeFastAdds++;st.knowledgeTerritoryTilesAvoided+=Number(this.territory?.size||0);
};

/* ---------- Food reserve math fast paths ----------
   V0.29 reserve days are age-weighted (.30 child / .42 adult). Build the same
   denominator directly from the invalidation-aware resident index instead of repeatedly
   filtering residents and re-entering settlementReserveDays/localFoodNeed29. */
function foodNeedE3(ps){let n=0;for(const p of ps||[])n+=Number(p?.age)<15?.30:.42;return Math.max(.12,n);}
NS.Village.prototype.settlementReserveDays=function(tileId){
 const w=this._world,ps=NS.V026?.ensureResidentIndex?.(this)?.byHome?.get(Number(tileId));if(!w)return 0;if(!ps?.length)return 999;return Number(this.stockAt?.(Number(tileId),'food')||0)/foodNeedE3(ps);
};
NS.Village.prototype.foodReserveDays=function(){
 const w=this._world,byHome=NS.V026?.ensureResidentIndex?.(this)?.byHome;if(!w||!byHome)return 0;
 let pop=0,total=0,scans=0;for(const id0 of this.territory||[]){const id=Number(id0),ps=byHome.get(id);if(!ps?.length)continue;const n=ps.length,d=Number(this.stockAt?.(id,'food')||0)/foodNeedE3(ps);pop+=n;total+=n*d;scans++;}
 const st=statsE3(w);st.foodReserveFastCalls++;st.foodReserveTileScans+=scans;return pop?total/pop:0;
};
NS.Village.prototype.criticalFoodReserveDays=function(){
 const w=this._world,byHome=NS.V026?.ensureResidentIndex?.(this)?.byHome;if(!w||!byHome)return 0;
 let min=Infinity,seen=0;for(const id0 of this.territory||[]){const id=Number(id0),ps=byHome.get(id);if(!ps?.length)continue;const d=Number(this.stockAt?.(id,'food')||0)/foodNeedE3(ps);if(d<min)min=d;seen++;}
 statsE3(w).criticalFoodReserveFastCalls++;return seen?min:0;
};

/* ---------- Population index ---------- */
const populationE2=NS.Village.prototype.population;
NS.Village.prototype.population=function(){
 /* V0.21 deliberately freezes structural population during an active dailyTick. */
 if(this._v21DailyPerf?.active)return populationE2.call(this);
 const idx=NS.V026?.ensureResidentIndex?.(this);if(!idx)return populationE2.call(this);const w=this._world;if(w)statsE3(w).populationIndexCalls++;return idx.alive.length;
};

/* ---------- telemetry ---------- */
const snapE2=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snapE2.call(this,w,reason,note);if(!s)return s;const x=statsE3(w),fields={knowledgeFastAdds32E3:Number(x.knowledgeFastAdds||0),knowledgeLegacyAdds32E3:Number(x.knowledgeLegacyAdds||0),knowledgeTerritoryTilesAvoided32E3:Number(x.knowledgeTerritoryTilesAvoided||0),foodReserveFastCalls32E3:Number(x.foodReserveFastCalls||0),foodReserveTileScans32E3:Number(x.foodReserveTileScans||0),criticalFoodReserveFastCalls32E3:Number(x.criticalFoodReserveFastCalls||0),populationIndexCalls32E3:Number(x.populationIndexCalls||0)};
 Object.assign(s.global,fields);const ys=(this.yearlySummaries||[]).find(q=>Number(q.year)===Number(w.year));if(ys)Object.assign(ys.global,fields);return s;
};
const csvE2=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){
 const base=csvE2.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['knowledgeFastAdds32E3','knowledgeLegacyAdds32E3','knowledgeTerritoryTilesAvoided32E3','foodReserveFastCalls32E3','foodReserveTileScans32E3','criticalFoodReserveFastCalls32E3','populationIndexCalls32E3'],q=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>q(s.global?.[k]??v[k])).join(',');}return lines.join('\n');
};
const jsonE2=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonE2.call(this,w);d.version='0.32E3';Object.assign(d.worldSummary,{v32E3Revision:REV32E3,housingGate32E3:'D3 housing relocation now requires actual overcrowding (occupancy >= 1.12) or at least one-unit shortage on every D3 entry path',knowledgeFastPath32E3:'in-progress non-completing Person Knowledge gains bypass the legacy per-Person whole-territory storage-tech synchronization; completion and target-selection cases retain exact legacy behavior',foodReserveFastPath32E3:'nation and settlement food reserve calculations preserve the V0.29 age-weighted formula while using the resident index instead of repeated resident filters',populationFastPath32E3:'population reads use the V0.26 invalidation-aware resident index',performance32E3:'operation counters are exported alongside existing SIM/personAct timings so device speed can be separated from code work'});return d;};

/* ---------- persistence ---------- */
function attachE3(w,src=null){w=NS.V032E2?.attachWorld?.(w,src)||w;if(!w)return w;const saved=src?.v32e3OptimizationStats||w.v32e3OptimizationStats||{};w.v32e3OptimizationStats={...statsE3(w),...saved};for(const v of w.villages||[]){v._world=w;v._v32e3KnowledgeMulKey=null;const urban=!!v.hasTech?.('URBANIZATION');for(const id of v.territory||[]){const t=w.map.get(Number(id));if(t)t._v08UrbanStorage=urban;}}return w;}
const serE2=NS.World.prototype.serialize,fromE2=NS.World.from;
NS.World.prototype.serialize=function(){const d=serE2.call(this);d.version='0.32E3';d.v32e3={revision:REV32E3,housingActualShortageGate:true,knowledgeFastAdd:true,foodReserveFastPath:true,populationResidentIndex:true,combat:false};d.v32e3OptimizationStats={...statsE3(this)};return d;};
NS.World.from=function(d){if(d?.version==='0.32E3'){const w=fromE2({...d,version:'0.32E2'});return attachE3(w,d);}return attachE3(fromE2(d),d);};

/* ---------- UI / patch notes / save surface ---------- */
if(NS.UI){const setWorldE2=NS.UI.prototype.setWorld,headerE2=NS.UI.prototype.renderHeader,contentE2=NS.UI.prototype.renderVillageContent;NS.UI.prototype.setWorld=function(w){return setWorldE2.call(this,attachE3(w));};NS.UI.prototype.renderHeader=function(){headerE2.call(this);document.title='Village Observer V0.32E3';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32E3</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32E3 Person/Settlement 성능 Pass #5 · Housing actual-shortage gate · Knowledge/Reserve leaf fast paths';};NS.UI.prototype.renderVillageContent=function(){contentE2.call(this);if(this.sub!=='economy')return;const root=this.q('villageContent');if(!root||root.querySelector('.v32e3-perf-note'))return;const x=statsE3(this.world),tot=Number(x.knowledgeFastAdds||0)+Number(x.knowledgeLegacyAdds||0),share=tot?Number(x.knowledgeFastAdds||0)/tot*100:0;root.insertAdjacentHTML('beforeend',`<div class="v32e3-perf-note small muted">⚡ E3 Knowledge fast-add ${Number(x.knowledgeFastAdds||0).toLocaleString()}회 (${share.toFixed(1)}%) · 영토 scan 회피 ${Number(x.knowledgeTerritoryTilesAvoided||0).toLocaleString()} tile</div>`);};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32E3'))NS.PATCH_NOTES.unshift({version:'V0.32E3',date:'2026-09-27',title:'Person/Settlement Performance Pass #5',summary:'E2 모바일 데이터에서 남은 Person/villageDaily 비용을 결과 보존형 leaf 최적화로 줄이고, 정상 90~100% 점유 정착지의 D3 강제 relocation 버그를 차단합니다.',sections:[['0순위 Housing 버그',['D3의 정책·Settlement Demand·periodic resolver가 모두 실제 과밀(점유율 112% 이상) 또는 실제 주거 부족 1 이상일 때만 강제 relocation을 시도합니다.','정상 포화 상태에서는 기존 D2/V17 주택·개축·토지정비 경로로 그대로 내려가므로 주거 개발 자체는 막지 않습니다.']],['Person/Settlement 성능 Pass #5',['Person.act 체인은 재작성하지 않고 그대로 유지합니다.','연구 완료가 일어나지 않는 일반 Knowledge gain은 V0.8의 불필요한 매-Person 전국 영토 storage-tech 동기화를 생략합니다.','정착지·국가 식량 비축일은 V0.29의 아동 0.30/성인 0.42 age-weighted 공식을 그대로 유지하면서 resident index로 중복 주민 조회를 제거합니다.','population 조회는 V0.21의 daily structural cache 의미를 보존하면서, 그 밖의 조회는 alive resident index를 사용합니다.']],['성능 관측',['Knowledge fast/legacy 횟수, 회피한 영토 tile scan 수, food reserve 호출/scan, population index 호출을 CSV/JSON에 기록합니다.','기존 SIM·personAct 시간과 operation count를 함께 봐 PC/모바일 실행환경 차이와 실제 코드 연산량을 분리할 수 있습니다.']]]});
(function(){const KEY='village-observer-v0-32e3',fallback=['village-observer-v0-32e2','village-observer-v0-32e1','village-observer-v0-32d5','village-observer-v0-32d4','village-observer-v0-32d3','village-observer-v0-32d2','village-observer-v0-32d1','village-observer-v0-32d','village-observer-v0-32c2'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v032E3-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v032E3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v032E3-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){const data=JSON.parse(await file.text()),w=NS.V019.worldFromMapData(data);return attachE3(NS.V032D5?.attachWorld?.(w)||w);}};})();
NS.V032E3={revision:REV32E3,attachWorld:attachE3};
try{const ui=window.villageObserver;if(ui){ui.world=attachE3(ui.world);ui.renderHeader?.();ui.render?.();}}catch(e){console.error('V0.32E3 startup attach failed',e);}
})(window.VSim);
