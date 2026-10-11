
/* V0.33I1A2 — Military Equipment Lifecycle Conservation Fix.
   The two physical I1A2 lifecycle hooks live in V24 daily demography and
   international migration/peace cession sites earlier in this monolith.
   Historic I1A1 residuals are carried over ONLY on an explicit legacy save
   import; they are never treated as fresh physical gear or re-rolled losses. */
window.VSim=window.VSim||{};(function(NS){
'use strict';
const VERSION='0.33I1A2',REV='equipment-lifecycle-conservation-fix-i1a2';
const clone=x=>JSON.parse(JSON.stringify(x));
const reasonCounters={NONCOMBAT_DEATH:'nonCombatDeathRecovered',PRE_REMOVAL_DEATH:'nonCombatDeathRecovered',EXTERNAL_MIGRATION:'externalMigrationRecovered',PEACE_CESSION:'peaceCessionRecovered'};
function ext(v){const s=NS.V033I1.ensureNation(v).stats;for(const k of ['nonCombatDeathRecovered','externalMigrationRecovered','peaceCessionRecovered','preI1A2UntrackedLoss','lifecycleReturnEvents'])if(!Number.isFinite(Number(s[k])))s[k]=0;return s;}
const baseReturn=NS.V033I1.returnEquipment;
function physicalReturn(v,w,p,reason='STATUS_EXIT'){
 const e=NS.V033I1.ensurePerson(p),items=[e.weaponId,e.armorId].filter(Boolean);
 if(!items.length)return false;
 const ok=baseReturn(v,w,p,reason);
 if(ok&&reasonCounters[reason]){
   const st=ext(v);st[reasonCounters[reason]]+=items.length;st.lifecycleReturnEvents++;
   w.telemetry?.record?.('MILITARY_EQUIPMENT_LIFECYCLE_RETURN33I1A2',w,{village:v.name,villageId:v.id,person:p.name,personId:p.id,reason,itemIds:items,items:items.length,sourceNationId:v.id,physicallyReturned:true});
 }
 return ok;
}
NS.V033I1.returnEquipment=physicalReturn;
function carryLegacy(v,w){
 const s=ext(v);if(s.i1a2LegacyChecked)return;s.i1a2LegacyChecked=true;
 const old=NS.V033I1.audit(v,w,false),carried=[];
 for(const r of old){const q=Number(r.delta||0);if(!Number.isInteger(q)||q<=0)continue;
  s.legacyUntrackedByItem[r.itemId]=Number(s.legacyUntrackedByItem[r.itemId]||0)+q;
  s.legacyUntrackedLoss=Number(s.legacyUntrackedLoss||0)+q;
  s.preI1A2UntrackedLoss+=q;carried.push({itemId:r.itemId,qty:q});
 }
 if(carried.length)w.telemetry?.record?.('MILITARY_EQUIPMENT_PRE_I1A2_DEFICIT_CARRIED',w,{village:v.name,villageId:v.id,sourceVersion:'0.33I1A1',items:carried,total:carried.reduce((a,x)=>a+x.qty,0),note:'Historical deficit; no item created and not recast as battlefield loss'});
}
const fromPrev=NS.World.from;
NS.World.from=function(d){
 const oldVersion=String(d?.version||'');
 const w=fromPrev(oldVersion===VERSION?{...d,version:'0.33I1A1'}:d);
 if(oldVersion==='0.33I1A1')for(const v of w.villages||[])carryLegacy(v,w);
 for(const v of w.villages||[])ext(v);
 w.v33i1a2={revision:REV,carriedFrom:oldVersion};return w;
};
const serializePrev=NS.World.prototype.serialize;
NS.World.prototype.serialize=function(){const d=serializePrev.call(this);d.version=VERSION;d.v33i1a2={revision:REV,equipmentLifecycleReturns:true,preI1A2DeficitsLabeled:true,qualityCombatEnabled:false,inTileCombatEnabled:false};return d;};
const snapPrev=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snapPrev.call(this,w,reason,note);if(!s)return s;
 const keys=['nonCombatDeathRecovered','externalMigrationRecovered','peaceCessionRecovered','preI1A2UntrackedLoss','lifecycleReturnEvents'];
 for(const k of keys)s.global['equipment'+k[0].toUpperCase()+k.slice(1)+'33I1A2']=0;
 for(const row of s.villages||[]){const v=w.villages.find(x=>Number(x.id)===Number(row.id));if(!v)continue;const st=ext(v);for(const k of keys){const name='equipment'+k[0].toUpperCase()+k.slice(1)+'33I1A2',q=Number(st[k]||0);row[name]=q;s.global[name]+=q;}}
 return s;
};
const csvPrev=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){
 const base=csvPrev.call(this),lines=base.split('\n');if(!lines.length)return base;
 const k=['NonCombatDeathRecovered','ExternalMigrationRecovered','PeaceCessionRecovered','PreI1A2UntrackedLoss','LifecycleReturnEvents'].map(s=>'equipment'+s+'33I1A2');
 const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 lines[0]+=','+[...k,...k].map(q).join(',');let i=1;
 for(const s of this.snapshots||[])for(const r of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+[...k.map(x=>s.global?.[x]),...k.map(x=>r?.[x])].map(q).join(',');}
 return lines.join('\n');
};
const jsonPrev=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonPrev.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{},{v33I1A2Revision:REV,nonCombatDeathEquipment33I1A2:'Return Person weapon and armor before V24 daily demography filters deceased residents, with a pre-removal safety sweep.',externalMigrationEquipment33I1A2:'Return carried equipment to the origin nation before Person changes nation.',peaceCessionEquipment33I1A2:'Return resident-held equipment to the old nation before cession demilitarizes/transfers them; no equipment teleport between national ledgers.',historicalResidual33I1A2:'Only on an explicit V0.33I1A1 save import, pre-existing unexplained positive deficits are tagged separately as preI1A2UntrackedLoss and added once to legacy untracked loss; never fabricated as inventory.',combatUnchanged33I1A2:'Battlefield rates, existing engagement system, H2 combat power and disabled I2 qualitative combat remain unchanged.'});return d;};
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33I1A2'))NS.PATCH_NOTES.unshift({version:'V0.33I1A2',date:'2026-10-08',title:'Equipment Lifecycle Conservation Fix',summary:'질병·노환 등 비전투 사망에서 주민 roster를 제거하기 전에 Person의 무기·방어구를 실물 재고로 회수합니다. 이주·영토 양도 등 국가 변경 시에도 출발 국가에서 장비를 정산합니다. I1A1의 전장 회수 확률과 전투 밸런스는 그대로 유지합니다.',sections:[['확인된 원인',['V0.24 일일 인구 모듈은 사망자 Person을 주민 배열에서 즉시 필터링하는 반면 기존 I1A1 반환은 이후 군사 dailyTick/yearlyTick/reconcile에 의존해 투창·직물 방어구가 장부에서 소실될 수 있었습니다.','I1A1 자연주행 티아 68년 1분기 질병 사망 사례에서 장비 지급 기록 2개가 사망 후 미설명 결손 2개로 나타났습니다.']],['실물 반환',['사망 처리 시 Person 제거 전에 weapon/armor를 원 소속 국가의 유효 supply node로 1개씩 반환합니다. 중복 반환은 빈 슬롯 검사로 차단합니다.','국가 간 이주·전후 영토 양도 시에도 Person 이동 전에 원 국가 재고로 회수하며, 기존 장비 생산·이동 비용과 물리적 회수 수량은 변경하지 않습니다.']],['기존 데이터 처리',['V0.33I1A1 저장을 새 버전으로 불러올 때 이미 소멸한 장비는 복구 가능한 Person 정보가 없으므로 새 장비를 만들어 넣지 않습니다. 기존 미설명 양(+) 결손만 별도 pre-I1A2 legacy 항목에 1회 보존하고 경고 기록을 남깁니다.','새 세계에는 legacy carry-over가 일어나지 않으며, 전장 회수/유실·Formation cache 보존식은 그대로 적용됩니다.']],['관측·범위',['비전투 사망 장비 회수, 국가 간 이주 회수, 전후 양도 회수, 과거 결손 carry-over를 JSON/CSV에 집계합니다.','기존 I1A1 전장 회수 확률과 H2 전투력 공식, I2 비활성화 상태는 변경하지 않습니다.']]]});
if(NS.UI){
 const headerPrev=NS.UI.prototype.renderHeader,contentPrev=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderHeader=function(){headerPrev.call(this);document.title='Village Observer V0.33I1A2';const b=this.q?.('versionBadge')||document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33I1A2</strong>';const st=this.q?.('runtimeStatus');if(st)st.textContent='✓ V0.33I1A2 Equipment Lifecycle Conservation Fix';};
 NS.UI.prototype.renderVillageContent=function(){const r=contentPrev.call(this);if(this.sub!=='military')return r;const panel=this.q?.('villageContent')?.querySelector('.v33i1-equipment-panel'),v=this.world?.selectedNation;if(!panel||!v)return r;const heading=panel.querySelector('strong');if(heading)heading.textContent='🗡 I1A2 실제 군사 장비';const st=ext(v),line=document.createElement('div');line.className='small muted';line.textContent=`I1A2 생애 정산 · 비전투 사망 회수 ${st.nonCombatDeathRecovered} · 국제 이주 회수 ${st.externalMigrationRecovered} · 영토 양도 회수 ${st.peaceCessionRecovered} · 패치 이전 결손 ${st.preI1A2UntrackedLoss}`;panel.appendChild(line);return r;};
}
const savePrev=NS.SaveSystem;
function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
NS.SaveSystem={...savePrev,
 save(w){localStorage.setItem('village-observer-v0-33i1a2',JSON.stringify(w.serialize()));},
 load(){let r=localStorage.getItem('village-observer-v0-33i1a2');if(r)return NS.World.from(JSON.parse(r));return savePrev.load?.();},
 export(w){dl(`village-observer-v033I1A2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v033I1A2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw new Error(`CSV schema mismatch: expected ${test.columns} columns; bad rows ${test.bad.slice(0,8).join(', ')}`);dl(`village-observer-v033I1A2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');},
 async import(file){return NS.World.from(JSON.parse(await file.text()));}
};
NS.V033I1.version=VERSION;NS.V033I1.revision=REV;NS.V033I1A2={version:VERSION,revision:REV,returnEquipment:physicalReturn,carryLegacy,stats:ext};
try{const ui=window.villageObserver;if(ui){for(const v of ui.world?.villages||[])ext(v);ui.renderHeader?.();}}catch(e){console.error('I1A2 init',e);}
})(window.VSim);
