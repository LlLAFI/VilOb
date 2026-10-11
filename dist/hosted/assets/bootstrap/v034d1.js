/* V0.34D1 — read-only Settlement Aggregate V1. No economic or Person state mutation. */
(function(NS){'use strict';
const VERSION='V0.34D1',PREVIOUS='V0.34D0',SAVE_KEY='village-observer-v034d1';
const RESOURCES=['food','wood','stone','iron_ore','iron','tools'];
const N=x=>{const n=Number(x);return Number.isFinite(n)?n:0;};
const same=(a,b)=>String(a)===String(b);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const F=x=>N(x).toFixed(2);
function activeRecords(w){return (w?.v34b?.settlements||[]).filter(r=>r.lifecycle==='ACTIVE'&&Array.isArray(r.tileIds)&&r.tileIds.length);}
function lookup(w,id){return w?._v34bActive?.get(String(id))||activeRecords(w).find(r=>same(r.id,id))||null;}
function nation(w,id){return (w?.villages||[]).find(v=>same(v.id,id))||null;}
function housing(t){let out=0;const arr=t.buildings||[];
 for(let i=0;i<arr.length;i++){const b=arr[i],cap=N(NS.BUILDINGS?.[b]?.capacity);if(!cap)continue;
  const eff=typeof t.buildingEfficiency==='function'?N(t.buildingEfficiency(b)):Math.min(1,Math.max(0,N(t.buildingCondition?.[i]??100)/70));out+=cap*eff;}
 return out;
}
// Strictly observational. Do NOT invoke ensureLaborIndex29, stockAt, tileResidents or old cachedAggregate.
function prepare(w){const byNation=new Map();for(const v of w.villages||[]){const peopleByHome=new Map(),peopleByWork=new Map();
 for(const p of v.residents||[]){if(!p||p.alive===false)continue;
  const home=Number(p.homeTileId);if(Number.isInteger(home)){const a=peopleByHome.get(home)||[];a.push(p);peopleByHome.set(home,a);}
  if(p.workTileId!==null&&p.workTileId!==undefined&&p.workTileId!==''){const work=Number(p.workTileId);if(Number.isInteger(work)){const a=peopleByWork.get(work)||[];a.push(p);peopleByWork.set(work,a);}}
 }
 byNation.set(String(v.id),{v,peopleByHome,peopleByWork});}
 return {world:w,byNation};
}
function aggregate(w,id,prepared){const r=lookup(w,id);if(!r)return null;
 const prep=prepared?.world===w?prepared:prepare(w),z=prep.byNation.get(String(r.nationId)),v=z?.v;
 if(!v)return null;
 const members=new Set(r.tileIds.map(Number)),resources=Object.fromEntries(RESOURCES.map(k=>[k,0])),resourcesByTile=[],buildingsByType={},condition={sum:0,count:0,inactive:0,below70:0},finance={marketGold:0,walletGold:0},housingInfo={capacity:0,residents:0,overcrowdedTiles:0,shortage:0},people={total:0,children:0,age15Plus:0,age16Plus:0,age18Plus:0,pioneers:0,activeMilitary:0,assignedJobs:0,withWorkTile:0,workplaces:0,inboundCommuters:0,outboundCommuters:0},tileDetails=[];
 for(const tid of r.tileIds){const t=w.map.get(Number(tid));if(!t)continue;
  const resident=z.peopleByHome.get(Number(tid))||[],cap=housing(t),row={tileId:Number(tid),population:resident.length,housingCapacity:cap,stocks:{},marketGold:N(t.v29Economy?.marketGold),buildings:(t.buildings||[]).length};
  housingInfo.capacity+=cap;housingInfo.residents+=resident.length;housingInfo.shortage+=Math.max(0,resident.length-cap);if(resident.length>cap+1e-9)housingInfo.overcrowdedTiles++;
  finance.marketGold+=row.marketGold;
  for(const k of RESOURCES){const val=N(t.stocks?.[k]);resources[k]+=val;row.stocks[k]=val;}
  for(let i=0;i<(t.buildings||[]).length;i++){const key=t.buildings[i];buildingsByType[key]=(buildingsByType[key]||0)+1;const c=N(t.buildingCondition?.[i]??100);condition.sum+=c;condition.count++;if(c<=0)condition.inactive++;if(c<70)condition.below70++;}
  tileDetails.push(row);resourcesByTile.push({tileId:row.tileId,...row.stocks});
 }
 for(const tid of r.tileIds){for(const p of z.peopleByHome.get(Number(tid))||[]){people.total++;const age=N(p.age);if(age<15)people.children++;if(age>=15)people.age15Plus++;if(age>=16)people.age16Plus++;if(age>=18)people.age18Plus++;
  if(p.assignment==='PIONEER')people.pioneers++;if(p.militaryStatus32A==='active'||p.militaryActive32B)people.activeMilitary++;
  if(p.job&&p.job!=='무직'&&p.job!=='실업')people.assignedJobs++;finance.walletGold+=N(p.gold29);
  const wr=p.workTileId;if(wr!==null&&wr!==undefined&&wr!==''){people.withWorkTile++;const target=w.map.get(Number(wr));if(!members.has(Number(wr))||!target||!same(target.ownerId,r.nationId))people.outboundCommuters++;}
 }}
 // Work location is computed separately; foreign-nation workers do not inflate resident population.
 for(const [nid,other] of prep.byNation)for(const tid of r.tileIds){const workers=other.peopleByWork.get(Number(tid))||[];for(const p of workers){people.workplaces++;if(!same(nid,r.nationId)||!members.has(Number(p.homeTileId)))people.inboundCommuters++;}}
 return {settlementId:r.id,nationId:r.nationId,nationName:v.name,coreTileId:r.coreTileId,tileIds:r.tileIds.slice(),tiles:r.tileIds.length,population:people.total,buildings:condition.count,resources,resourcesByTile,buildingsByType,condition:{count:condition.count,average:condition.count?condition.sum/condition.count:0,inactive:condition.inactive,below70:condition.below70},housing:housingInfo,people,finance,tileDetails};
}
function all(w){const prep=prepare(w);return activeRecords(w).map(r=>aggregate(w,r.id,prep)).filter(Boolean);}
// Independent tile/Person audit: no aggregate cache, and no calls to gameplay / labor reconciliation APIs.
function audit(w,rows){rows=rows||all(w);const errors=[],claimed=new Set(),byId=new Map(rows.map(r=>[r.settlementId,r]));
 const tallies=new Map();for(const v of w.villages||[]){const res=Object.fromEntries(RESOURCES.map(k=>[k,0]));tallies.set(String(v.id),{res,marketGold:0,walletGold:0,pop:0,buildings:0,tiles:0});}
 for(const t of w.map.tiles||[]){if(t.ownerId===null||t.ownerId===undefined)continue;const n=String(t.ownerId),b=tallies.get(n);if(!b){errors.push('TILE_BAD_OWNER:'+t.id);continue;}b.tiles++;b.buildings+=(t.buildings||[]).length;b.marketGold+=N(t.v29Economy?.marketGold);for(const k of RESOURCES)b.res[k]+=N(t.stocks?.[k]);if(!byId.has(t.settlementId))errors.push('TILE_NO_SETTLEMENT:'+t.id);}
 for(const v of w.villages||[]){const b=tallies.get(String(v.id));for(const p of v.residents||[]){if(!p||p.alive===false)continue;b.pop++;b.walletGold+=N(p.gold29);if(!w.map.get(Number(p.homeTileId))||!same(w.map.get(Number(p.homeTileId)).ownerId,v.id))errors.push('PERSON_HOME_OWNER:'+p.id);}}
 for(const r of rows){const n=String(r.nationId),b=tallies.get(n);if(!b){errors.push('BAD_SETTLEMENT_NATION:'+r.settlementId);continue;}for(const id of r.tileIds){if(claimed.has(id))errors.push('DUP_TILE:'+id);claimed.add(id);const t=w.map.get(id);if(!t||!same(t.ownerId,r.nationId)||!same(t.settlementId,r.settlementId))errors.push('WRONG_TILE:'+id);}
  if(r.population!==r.housing.residents)errors.push('INTERNAL_POP:'+r.settlementId);
 }
 for(const [nid,b] of tallies){const rr=rows.filter(r=>String(r.nationId)===nid),sum=k=>rr.reduce((a,r)=>a+k(r),0);if(sum(r=>r.tiles)!==b.tiles)errors.push('TILES:'+nid);if(sum(r=>r.population)!==b.pop)errors.push('POP:'+nid);if(sum(r=>r.buildings)!==b.buildings)errors.push('BUILDINGS:'+nid);
  for(const k of RESOURCES)if(Math.abs(sum(r=>r.resources[k])-b.res[k])>1e-6)errors.push('RESOURCE:'+nid+':'+k);
  if(Math.abs(sum(r=>r.finance.marketGold)-b.marketGold)>1e-6)errors.push('MARKET_GOLD:'+nid);
  if(Math.abs(sum(r=>r.finance.walletGold)-b.walletGold)>1e-6)errors.push('WALLET_GOLD:'+nid);
 }
 return {ok:!errors.length,errors,settlements:rows.length,claimedTiles:claimed.size,people:rows.reduce((s,r)=>s+r.population,0),resources:RESOURCES.slice()};
}
const columns=['settlementId','nationId','nationName','coreTileId','tiles','tileIds','population','children','age15Plus','age16Plus','age18Plus','pioneers','activeMilitary','assignedJobs','workersAtTile','inboundCommuters','outboundCommuters','housingCapacity','overcrowdedTiles','housingShortage','buildings','conditionAverage','conditionBelow70','conditionInactive','marketGold','walletGold',...RESOURCES.map(k=>'stock_'+k)];
function csv(w){const rows=all(w),q=x=>'"'+String(x??'').replace(/"/g,'""')+'"',data=[columns.map(q).join(',')];for(const r of rows){const d={...r,...r.people,...r.finance,children:r.people.children,workersAtTile:r.people.workplaces,housingCapacity:r.housing.capacity,overcrowdedTiles:r.housing.overcrowdedTiles,housingShortage:r.housing.shortage,conditionAverage:r.condition.average,conditionBelow70:r.condition.below70,conditionInactive:r.condition.inactive,tileIds:r.tileIds.join('|')};for(const k of RESOURCES)d['stock_'+k]=r.resources[k];data.push(columns.map(k=>q(d[k])).join(','));}return data.join('\n');}
function download(filename,content,type){const u=URL.createObjectURL(new Blob([content],{type:type||'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=oldSerialize.call(this);data.version=VERSION;return data;};
NS.World.from=function(data){
 if(!data||data.version!==VERSION)throw Error('V0.34D1 저장 파일만 지원합니다.');
 const w=oldFrom({...data,version:PREVIOUS});
 // Older inherited loaders initialize missing fields and may re-run old founder/building
 // migrations. D1 is a current-schema save: its stored physical facts are authoritative.
 if(Array.isArray(data.map?.tiles))for(const source of data.map.tiles){const t=w.map.get(source.id);if(!t)continue;
  for(const key of ['buildings','buildingCondition','buildingAbandonSeasons','buildingRuins','buildingRepairProgress','stocks','v29Economy','developedBuildSpace'])
   if(Object.prototype.hasOwnProperty.call(source,key))t[key]=JSON.parse(JSON.stringify(source[key]));
 }
 if(Array.isArray(data.villages))for(const sv of data.villages){const v=nation(w,sv.id);if(!v||!Array.isArray(sv.residents))continue;
  const byId=new Map((v.residents||[]).map(p=>[String(p.id),p]));
  for(const sp of sv.residents){const p=byId.get(String(sp.id));if(!p)continue;
   for(const [key,val] of Object.entries(sp)){
    if(key==='_v26Owner'||key==='_v26Hooked'||key==='_v26ResidentCache')continue;
    try{p[key]=val&&typeof val==='object'?JSON.parse(JSON.stringify(val)):val;}catch(_){}
   }
  }
 }
 // Restoring a save must not append legacy migration/recon observations.
 if(data.telemetry&&w.telemetry){for(const [key,val] of Object.entries(data.telemetry))
  w.telemetry[key]=val&&typeof val==='object'?JSON.parse(JSON.stringify(val)):val;
 }
 return w;
};
const oldSave=NS.SaveSystem;NS.SaveSystem={...oldSave,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const data=localStorage.getItem(SAVE_KEY);return data?NS.World.from(JSON.parse(data)):null;},
 export(w){download(`village-observer-v034D1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){const s=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(s);if(check&&!check.ok)throw Error('D1 Legacy CSV 열 검증 실패');download(`village-observer-v034D1-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+s);},
 exportDevCSVV2(w){const s=NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),check=NS.V032E14?.validateCSV?.(s);if(check&&!check.ok)throw Error('D1 CSV V2 열 검증 실패');download(`village-observer-v034D1-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+s);},
 exportSettlementCSV(w){const rows=all(w),check=audit(w,rows);if(!check.ok)throw Error('Settlement D1 audit failed: '+check.errors.slice(0,8).join(','));download(`village-observer-v034D1-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w),rows=all(w),check=audit(w,rows);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d1Revision='settlement-aggregate-read-only-v1';d.worldSummary.v034d1Aggregate={...check,multiTile:rows.filter(r=>r.tiles>1).length};}return d;};
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=oldSnapshot.call(this,w,...args);if(s){const rows=all(w),x=audit(w,rows);Object.assign(s.global,{d1SettlementCount:rows.length,d1AggregateErrors:x.errors.length,d1OvercrowdedTileCount:rows.reduce((a,r)=>a+r.housing.overcrowdedTiles,0),d1InactiveBuildings:rows.reduce((a,r)=>a+r.condition.inactive,0)});}return s;};
function addButton(){const legacy=document.getElementById('exportLogCsvV2Btn')||document.getElementById('exportLogCsvBtn');if(!legacy||document.getElementById('exportSettlementCsvD1Btn'))return;const b=document.createElement('button');b.id='exportSettlementCsvD1Btn';b.textContent='Settlement CSV';b.title='다중 타일 Settlement 전체 집계 (D1)';b.addEventListener('click',()=>{try{const w=window.villageObserver?.world;if(!w)throw Error('세계가 없습니다.');NS.SaveSystem.exportSettlementCSV(w);}catch(e){console.error(e);alert('Settlement CSV 오류: '+e.message);}});legacy.insertAdjacentElement('afterend',b);}
if(NS.UI){const oldTile=NS.UI.prototype.renderTile,oldHead=NS.UI.prototype.renderHeader,oldContent=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderTile=function(...args){const v=oldTile.apply(this,args),w=this.world,t=w?.map?.get(w.selectedTileId),root=this.q?.('tileInspector');if(!t||!root||t.ownerId==null)return v;
 const s=aggregate(w,t.settlementId);if(!s)return v;const old=root.querySelector?.('.v34c-settlement-tile');if(old)old.remove();let box=root.querySelector?.('.v34d1-settlement-detail');if(!box){box=document.createElement('div');box.className='v34d1-settlement-detail';root.appendChild(box);}
 const stocks=RESOURCES.map(k=>`${({food:'식량',wood:'목재',stone:'석재',iron_ore:'철광석',iron:'철',tools:'도구'})[k]} ${F(s.resources[k])}`).join(' · ');
 box.innerHTML=`<strong>🏘️ Settlement ${esc(s.settlementId)}</strong><div class="small muted">중심 #${s.coreTileId} · 구성 ${s.tiles}타일 (#${s.tileIds.join(', #')})</div><div class="small">인구 <b>${s.population}</b>명 · 주거 <b>${F(s.housing.capacity)}</b>명분 · 과밀 타일 ${s.housing.overcrowdedTiles}개<br>건물 ${s.buildings}개 · 평균 상태 ${F(s.condition.average)} · 비활성 ${s.condition.inactive}개<br>근무 위치 ${s.people.workplaces}명 · 내부 유입 ${s.people.inboundCommuters}명 · 외부 통근 ${s.people.outboundCommuters}명<br>${stocks}<br>시장 ${F(s.finance.marketGold)}G · 주민 지갑 ${F(s.finance.walletGold)}G</div>`;return v;};
 NS.UI.prototype.renderVillageContent=function(...a){const out=oldContent.apply(this,a);if(this.sub!=='settlements')return out;const w=this.world,v=w?.selectedNation,root=this.q?.('villageContent');if(!v||!root)return out;
 const prepared=prepare(w),rows=activeRecords(w).filter(r=>same(r.nationId,v.id)).map(r=>aggregate(w,r.id,prepared));let el=root.querySelector?.('.v34d1-settlement-overview');if(!el){el=document.createElement('div');el.className='v34d1-settlement-overview';root.insertAdjacentElement('afterbegin',el);}const pop=rows.reduce((a,r)=>a+r.population,0),vac=rows.reduce((a,r)=>a+r.housing.capacity,0);el.innerHTML=`<strong>🏘️ D1 통합 Settlement</strong><div class="small muted">${rows.length}개 · 다중 타일 ${rows.filter(r=>r.tiles>1).length}개 · 주민 ${pop}명 · 주거 ${F(vac)}명분<br>소속 타일의 실제 물자·시설·근무 위치를 별도로 집계하며 정착지 사이의 물자 이동은 변경하지 않습니다.</div>`;return out;};
 NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent='.v34d1-settlement-detail,.v34d1-settlement-overview{margin:9px 0;padding:10px;border:1px solid #568c94;border-radius:10px;background:rgba(55,130,132,.10);line-height:1.65}.v34d1-settlement-detail strong,.v34d1-settlement-overview strong{color:#9cdfd7}';document.head?.appendChild(st);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Settlement Aggregate V1',summary:'다중 타일 Settlement의 인구·주거·노동·건물·6종 자원·시장 Gold를 읽기 전용으로 통합 조회합니다. 물리 재고·경제·AI·전투 규칙은 유지합니다.',sections:[['집계 API',['NS.V034D1.aggregate / all / audit로 실제 타일 위치와 주민·근무 위치를 별도 집계합니다.','같은 날 자원·주거·건물 상태가 변해도 이전 집계값을 재사용하지 않습니다.','관측 과정에서 기존 V29 노동 인덱스의 일자리 재조정을 호출하지 않습니다.']],['관측',['타일 정보창과 국가 정착지 정보에 D1 통합 정보를 표시합니다.','Settlement CSV를 별도로 제공하며 기존 1,683열 Legacy/V2 Snapshot CSV는 그대로 유지합니다.','정기 스냅샷에서 D1 집계 오류 수와 비활성 건물·과밀 타일 수를 기록합니다.']],['범위',['D2 주거 정책·D3 경제 정책은 변경하지 않습니다.','구버전 세이브 지원은 필수 요구사항이 아니며 D1 자체 저장·복원은 지원합니다.']]]});
NS.V034D1=Object.freeze({version:VERSION,resources:RESOURCES.slice(),prepare,aggregate,all,audit,csv,columns:columns.slice()});addButton();
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D1 initial header',e);}
})(window.VSim);
