
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const REV32C2='military-finance-performance2-stats-stability';
const MIL32C2=new Set(['barracks','training_ground','armory']);
const FACILITY_JOBS32C2=new Set(['농부','광부','상인','학자','철공']);
const VALID_JOBS32C2=new Set(['농부','채집꾼','사냥꾼','목수','광부','철공','건축가','상인','경비','학자','무직']);
const CUSTOM_GOLD32C2={
 world:{treasuryGold30:'국가 금고 Gold',marketGold30:'Settlement 시장 Gold',personGold30:'Person Gold',moneySupply30:'전체 통화량',observedGoldSource30:'관측 Gold 순증가',observedGoldSink30:'관측 Gold 순감소',adminCenters30:'행정 중심지 수'},
 nation:{treasuryGold30:'국가 금고 Gold',marketGold30:'Settlement 시장 Gold',personGold30:'Person Gold',moneySupply30:'국내 통화량',adminCenters30:'행정 중심지 수',adminLevy30:'누적 행정세',regionalGrants30:'누적 지역 공공지출'},
 settlement:{marketGold30:'Settlement 시장 Gold',marketGoldPerCap30:'1인당 시장 Gold',jobUtil30:'Job slot 사용률'}
};
const cal32C2=w=>Number(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
function opt32C2(w){
 const d={militaryFinanceTransfers:0,militaryFinanceGold:0,reserveLogsCollapsed:0,fastJobSkips:0,jobDelegations:0,childJobSkips:0,facilityJobFastSkips:0};
 w.v32c2OptimizationStats=w.v32c2OptimizationStats||{};
 for(const [k,v] of Object.entries(d))if(!Number.isFinite(Number(w.v32c2OptimizationStats[k])))w.v32c2OptimizationStats[k]=v;
 return w.v32c2OptimizationStats;
}

/* ============================================================
   1) Military strategic finance: one funding rule from planning to payment.
   ============================================================ */
const payBefore32C2=NS.Village.prototype.payBuild;
NS.Village.prototype.payBuild=function(tileId,cost){
 const type=this._v29BuildTypeContext||null,w=this._world,goldCost=Number(cost?.gold||0);
 if(!w||!MIL32C2.has(type)||goldCost<=0)return payBefore32C2.call(this,tileId,cost);
 const f=NS.V031H?.funding?.(this,w,tileId,type);
 if(!f||Number(f.funding||0)+1e-9<goldCost)return false;
 const treasuryBefore=Number(this.gold||0),moves=[];
 let need=Math.max(0,goldCost-Number(f.treasurySpendable||0));
 const rows=Array.isArray(f.rows)?f.rows:[],local=rows.find(r=>Number(r.id)===Number(tileId));
 if(local&&need>1e-9&&local.econ){
  const q=Math.min(need,Math.max(0,Number(f.localAvailable||0)));
  if(q>0){local.econ.marketGold=Number(local.econ.marketGold||0)-q;this.gold=Number(this.gold||0)+q;moves.push({row:local,amount:q});need-=q;}
 }
 let remoteBudget=Math.min(need,Math.max(0,Number(f.remoteAvailable||0)));
 for(const row of rows){
  if(remoteBudget<=1e-9||need<=1e-9)break;
  if(Number(row.id)===Number(tileId)||!row.econ)continue;
  const q=Math.min(need,remoteBudget,Math.max(0,Number(row.available||0)));
  if(q<=0)continue;
  row.econ.marketGold=Number(row.econ.marketGold||0)-q;this.gold=Number(this.gold||0)+q;moves.push({row,amount:q});need-=q;remoteBudget-=q;
 }
 if(need>1e-7){for(const m of moves)m.row.econ.marketGold=Number(m.row.econ.marketGold||0)+m.amount;this.gold=treasuryBefore;return false;}
 const ctx=this._v29BuildTypeContext;let ok=false;
 try{
  /* Funding() already enforced the strategic treasury reserve. Clearing only
     the build-type context prevents the older Treasury-only B2 gate from
     rejecting the exact same payment a second time with marketSupport=0. */
  this._v29BuildTypeContext=null;
  ok=!!payBefore32C2.call(this,tileId,cost);
 }finally{this._v29BuildTypeContext=ctx;}
 if(!ok){for(const m of moves)m.row.econ.marketGold=Number(m.row.econ.marketGold||0)+m.amount;this.gold=treasuryBefore;return false;}
 const amount=moves.reduce((a,m)=>a+m.amount,0),o=opt32C2(w);o.militaryFinanceTransfers+=moves.length;o.militaryFinanceGold+=amount;
 if(amount>0)w.telemetry?.record?.('MILITARY_MARKET_POOL32C2',w,{village:this.name,villageId:this.id,targetTileId:tileId,type,amount:+amount.toFixed(3),goldCost:+goldCost.toFixed(2),treasurySpendable:+Number(f.treasurySpendable||0).toFixed(3),sources:moves.map(m=>({tileId:m.row.id,amount:+m.amount.toFixed(3)}))});
 return true;
};

/* ============================================================
   2) Person optimization pass #2.
   V0.29 chooseJob() calls ensureNation29() before it knows whether the Person
   is even due for a job review. ensureNation29 scans every resident and tile.
   Stable citizens can safely skip that wrapper until their already-scheduled
   review; all special/invalid/structural cases delegate to the exact legacy
   implementation.
   ============================================================ */
const chooseBefore32C2=NS.Person.prototype.chooseJob;
NS.Person.prototype.chooseJob=function(v,w){
 const o=opt32C2(w),now=cal32C2(w);
 if(this.age<15){
  if(this.job!=='아이')this.job='아이';
  this.workTileId=this.homeTileId;this._v29SlotKey=null;o.fastJobSkips++;o.childJobSkips++;return;
 }
 if(this.assignment==='PIONEER'){o.fastJobSkips++;return;}
 const next=Number(this._v29NextJobReviewCal),home=w?.map?.get?.(Number(this.homeTileId)),job=this.job;
 const mustDelegate=!Number.isFinite(next)||now>=next||this._v29LaborForceDirty||v?._v29LaborForceDirty||!VALID_JOBS32C2.has(job)||job==='무직'||!home||home.ownerId!==v.id;
 if(mustDelegate){o.jobDelegations++;return chooseBefore32C2.call(this,v,w);}
 if(FACILITY_JOBS32C2.has(job)){
  const index=v._v29LaborIndex,slot=this._v29SlotKey&&index?.slotMap?.get?.(this._v29SlotKey),work=Number(this.workTileId),tile=w.map.get(work),bi=Number(this.workBuildingIndex29),bt=this.workBuildingType29;
  const buildingValid=tile&&tile.ownerId===v.id&&Number.isInteger(bi)&&bi>=0&&tile.buildings?.[bi]===bt;
  const slotValid=!!(slot&&slot.job===job&&slot.used<=slot.cap&&Number(slot.tileId)===work&&buildingValid);
  if(!slotValid){o.jobDelegations++;return chooseBefore32C2.call(this,v,w);}
  this._v29LaborStampSeen=index.stamp;o.fastJobSkips++;o.facilityJobFastSkips++;return;
 }
 if(v._v29LaborIndex)this._v29LaborStampSeen=v._v29LaborIndex.stamp;
 o.fastJobSkips++;return;
};

/* ============================================================
   3) Military reserved-slot log aggregation.
   ============================================================ */
const recordBefore32C2=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){
 if(type==='MILITARY_SLOT_RESERVED32C1'){
  const bucket=Math.floor(cal32C2(w)/90),key=`${bucket}:${payload?.villageId??payload?.village??''}:${payload?.target||''}`;
  this._v32c2ReserveAgg=this._v32c2ReserveAgg||new Map();let a=this._v32c2ReserveAgg.get(key);
  if(!a){
   const p={village:payload.village,villageId:payload.villageId,target:payload.target,quarterBucket:bucket,projects:payload.projects,projectCap:payload.projectCap,funding:payload.funding,goldCost:payload.goldCost,blockedTypes:[payload.blockedType].filter(Boolean),reasons:[payload.reason].filter(Boolean),blockedAttempts:1};
   recordBefore32C2.call(this,'MILITARY_SLOT_RESERVED32C2',w,p);const entry=this.entries?.at?.(-1);a={payload:entry?.payload||p};this._v32c2ReserveAgg.set(key,a);
  }else{
   const p=a.payload;p.blockedAttempts=Number(p.blockedAttempts||0)+1;
   if(payload.blockedType&&!p.blockedTypes.includes(payload.blockedType))p.blockedTypes.push(payload.blockedType);
   if(payload.reason&&!p.reasons.includes(payload.reason))p.reasons.push(payload.reason);
   opt32C2(w).reserveLogsCollapsed++;
  }
  if(this._v32c2ReserveAgg.size>80)for(const [k] of this._v32c2ReserveAgg)if(!k.startsWith(`${bucket}:`))this._v32c2ReserveAgg.delete(k);
  return;
 }
 return recordBefore32C2.call(this,type,w,payload);
};

/* ============================================================
   4) Gold/statistics canvas stability.
   V0.30 custom metrics used to draw a temporary population graph on the real
   canvas and immediately overwrite it with the Gold graph. C2 lets the legacy
   wrappers update their controls against a detached canvas, then paints the
   visible canvas exactly once. Existing C1a select-DOM protection is retained.
   ============================================================ */
function customRows32C2(ui,key){
 const scope=ui.statsScope||'nation',period=Number(ui.statsPeriod||0),now=Number(ui.world?.year||0);let rows=[];
 if(scope==='world')rows=(ui.world?.telemetry?.yearlySummaries||[]).map(x=>({year:Number(x.year),value:Number(x.global?.[key])}));
 else if(scope==='nation'){
  const id=Number(ui.statsNationId??ui.world?.selectedVillageId);rows=(ui.world?.telemetry?.yearlySummaries||[]).map(x=>{const n=(x.nations||[]).find(n=>Number(n.id)===id);return{year:Number(x.year),value:Number(n?.[key])};});
 }else{
  const id=Number(ui.statsNationId??ui.world?.selectedVillageId),tile=Number(ui.statsSettlementId??ui.world?.selectedTileId),map={marketGold30:'mg30',marketGoldPerCap30:'mgpc30',jobUtil30:'ju30'},k=map[key];
  rows=(ui.world?.telemetry?.settlementYearly?.[`${id}:${tile}`]||[]).map(x=>({year:Number(x.y),value:Number(x[k])}));
 }
 rows=rows.filter(x=>Number.isFinite(x.year)&&Number.isFinite(x.value));if(period>0)rows=rows.filter(x=>x.year>=Math.max(1,now-period+1));return rows;
}
function drawStable32C2(ui,rows,label){
 const canvas=ui.q('statsCanvas');if(!canvas)return;const wrap=canvas.parentElement,W=Math.max(300,Math.min(920,wrap?.clientWidth||760)),H=350,dpr=Math.min(2,window.devicePixelRatio||1),pw=Math.round(W*dpr),ph=Math.round(H*dpr);
 if(canvas.width!==pw)canvas.width=pw;if(canvas.height!==ph)canvas.height=ph;if(canvas.style.width!==W+'px')canvas.style.width=W+'px';if(canvas.style.height!==H+'px')canvas.style.height=H+'px';
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);const pad={l:58,r:18,t:24,b:38};ctx.font='12px system-ui';ctx.fillStyle='#93a6bf';
 if(!rows.length){ctx.fillText('이 조건에서 표시할 연간 기록이 없습니다.',24,45);return;}
 let min=Math.min(...rows.map(x=>x.value)),max=Math.max(...rows.map(x=>x.value));if(min===max){min=Math.max(0,min-1);max+=1;}const margin=(max-min)*.08||1;min=Math.max(0,min-margin);max+=margin;
 const x0=pad.l,cw=W-pad.l-pad.r,ch=H-pad.t-pad.b,xf=y=>rows.length===1?x0+cw/2:x0+(y-rows[0].year)/(rows.at(-1).year-rows[0].year||1)*cw,yf=x=>pad.t+(max-x)/(max-min)*ch;
 ctx.strokeStyle='#2a3d58';ctx.lineWidth=1;for(let i=0;i<=4;i++){const y=pad.t+ch*i/4,val=max-(max-min)*i/4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+cw,y);ctx.stroke();ctx.fillStyle='#93a6bf';ctx.textAlign='right';ctx.fillText(Math.abs(val)>=1000?Math.round(val).toLocaleString():val.toFixed(Math.abs(max-min)<10?2:1),x0-7,y+4);}
 ctx.strokeStyle='#69adff';ctx.lineWidth=2.5;ctx.beginPath();rows.forEach((r,i)=>{const x=xf(r.year),y=yf(r.value);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.fillStyle='#eef5ff';ctx.textAlign='left';ctx.font='700 13px system-ui';ctx.fillText(label,pad.l,pad.t-7);ctx.font='11px system-ui';ctx.fillStyle='#93a6bf';ctx.textAlign='center';
 for(const i of [0,Math.floor((rows.length-1)/2),rows.length-1].filter((v,i,a)=>a.indexOf(v)===i))ctx.fillText(`${rows[i].year}년`,xf(rows[i].year),H-14);const last=rows.at(-1);ctx.fillStyle='#eef5ff';ctx.textAlign='right';ctx.fillText(`최근 ${last.year}년 · ${last.value.toLocaleString(undefined,{maximumFractionDigits:3})}`,W-pad.r,pad.t-7);
}
if(NS.UI){
 const statsBefore32C2=NS.UI.prototype.renderStats;
 NS.UI.prototype.renderStats=function(){
  const scope=this.statsScope||'nation',key=this.statsMetric||'',label=CUSTOM_GOLD32C2[scope]?.[key];if(!label)return statsBefore32C2.call(this);
  const realQ=this.q,dummy=document.createElement('canvas');dummy.width=900;dummy.height=350;
  this.q=function(id){return id==='statsCanvas'?dummy:realQ.call(this,id);};try{statsBefore32C2.call(this);}finally{this.q=realQ;}
  drawStable32C2(this,customRows32C2(this,key),label);const note=this.q('statsNote');if(note)note.textContent='V0.32C2: Gold 계열 통계는 실제 차트를 틱당 한 번만 그려 캔버스 깜빡임을 줄입니다.';
 };
}

/* ---------- telemetry / persistence / presentation ---------- */
const snapBefore32C2=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snapBefore32C2.call(this,w,reason,note);if(!s)return s;const o=opt32C2(w),x={v32c2MilitaryFinanceTransfers:Number(o.militaryFinanceTransfers||0),v32c2MilitaryFinanceGold:+Number(o.militaryFinanceGold||0).toFixed(3),v32c2ReserveLogsCollapsed:Number(o.reserveLogsCollapsed||0),v32c2FastJobSkips:Number(o.fastJobSkips||0),v32c2JobDelegations:Number(o.jobDelegations||0),v32c2ChildJobSkips:Number(o.childJobSkips||0),v32c2FacilityJobFastSkips:Number(o.facilityJobFastSkips||0)};Object.assign(s.global,x);const ys=(this.yearlySummaries||[]).find(q=>q.year===w.year);if(ys)Object.assign(ys.global,x);return s;
};
const jsonBefore32C2=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonBefore32C2.call(this,w);d.version='0.32C2';Object.assign(d.worldSummary,{v32C2Revision:REV32C2,militaryFinance32C2:'military planning and actual payment share conserved Settlement-market + Treasury-above-reserve funding',personOptimization32C2:'stable citizens skip the V0.29 full-nation job wrapper until their scheduled review; special/invalid/structural cases keep the exact legacy path',statsCanvas32C2:'V0.30 custom Gold metrics update legacy controls on a detached canvas and paint the visible canvas once per tick',militaryReserveLog32C2:'military strategic-slot blocks are aggregated by nation, target facility and quarter'});return d;};
function attach32C2(w){w=NS.V032C1?.attachWorld?.(w)||w;if(!w)return w;opt32C2(w);for(const v of w.villages||[])v._world=w;return w;}
const serializeBefore32C2=NS.World.prototype.serialize,fromBefore32C2=NS.World.from;
NS.World.prototype.serialize=function(){const d=serializeBefore32C2.call(this);d.version='0.32C2';d.v32c2={revision:REV32C2,militaryFinanceUnified:true,optimizationPass:2,statsCanvasStable:true,reserveLogAggregation:true};d.v32c2OptimizationStats={...opt32C2(this)};return d;};
NS.World.from=function(d){if(d?.version==='0.32C2'){const w=attach32C2(fromBefore32C2({...d,version:'0.32C1a'}));w.v32c2OptimizationStats={...opt32C2(w),...(d.v32c2OptimizationStats||{})};return w;}return attach32C2(fromBefore32C2(d));};
if(NS.UI){const setWorldBefore32C2=NS.UI.prototype.setWorld,headerBefore32C2=NS.UI.prototype.renderHeader;NS.UI.prototype.setWorld=function(w){return setWorldBefore32C2.call(this,attach32C2(w));};NS.UI.prototype.renderHeader=function(){headerBefore32C2.call(this);document.title='Village Observer V0.32C2';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.32C2</strong>';const st=this.q('runtimeStatus');if(st)st.textContent='✓ V0.32C2 군사 공동재정 통일 · Person 최적화 2차 · Gold 통계 안정화';};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.32C2'))NS.PATCH_NOTES.unshift({version:'V0.32C2',date:'2026-09-26',title:'군사 공동재정 통일 · 성능 최적화 2차 · 통계 안정화',summary:'C1a 99년 주행에서 확인된 무기고 결제 게이트 불일치, Person.act 병목, 전체 통화량 차트 이중 렌더와 군사 슬롯 로그 과다를 정리합니다.',sections:[['군사시설 공동재정',['병영·훈련장·무기고의 사전 funding 판정과 실제 payBuild 결제가 같은 Settlement 시장 + 국고 준비금 규칙을 사용합니다.','전략 준비금을 이미 검증한 군사시설에 대해서만 구형 Treasury-only 중복 검사를 우회하며 Gold는 생성하지 않습니다.','무기고가 실제 착공되면 기존 C 장비 생산이 철·목재·도구를 소비해 자연 발화할 수 있습니다.']],['최적화 2차',['Hunger·행복도·생산·질병·건설·군복무 로직은 그대로 유지합니다.','안정적인 시민은 예약된 직업 재검토 시점 전까지 V0.29의 전 주민·전 영토 초기화 경로를 건너뜁니다.','무직·시설 슬롯 이상·영토 이상·구조 변경·정기 재검토 시에는 기존 chooseJob 경로를 그대로 사용합니다.']],['통계·로그',['세계/국가/Settlement Gold 계열 통계는 기존 컨트롤 갱신을 임시 캔버스에서 수행하고 실제 캔버스는 틱당 한 번만 그립니다.','실제 픽셀 크기가 같으면 canvas width/height를 다시 할당하지 않습니다.','군사 전략 슬롯 차단 로그는 국가·목표시설·분기별 한 건으로 집계합니다.']]]});
(function(){const KEY='village-observer-v0-32c2',fallback=['village-observer-v0-32c1a','village-observer-v0-32c1','village-observer-v0-32c','village-observer-v0-32b','village-observer-v0-32a','village-observer-v0-31i','village-observer-v0-31h','village-observer-v0-31g','village-observer-v0-31f','village-observer-v0-31a','village-observer-v0-31'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v032C2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v032C2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v032C2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attach32C2(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
NS.V032C2={revision:REV32C2,attachWorld:attach32C2};
try{window.villageObserver?.renderHeader?.();}catch(_){}
})(window.VSim);

