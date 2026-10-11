
/* V0.34B-HF1 — noncombat postwar access and target-owner guard. */
(function(NS){'use strict';
const VERSION='V0.34B-HF1', PREV='V0.34B';
const CAL=w=>Number(w?.calendarOrdinalDay?.()??0);
const forms=(v,w)=>v?.v32dMilitary?.formations||[];
const withdrawing=f=>!!(f?.v33aWithdrawal?.active||f?.v33dReturnState||String(f?.status||'').includes('POSTWAR_WITHDRAWAL'));
function liveWars(w,id){return(NS.V033D?.warsForNation?.(w,id)||[]).filter(x=>x.status==='ACTIVE');}
function guarded(v,w){if(!w||liveWars(w,v.id).length)return[];return forms(v,w).filter(f=>withdrawing(f)).map(f=>({f,tileId:f.tileId,targetTileId:f.targetTileId,targetReason:f.targetReason,status:f.status,lastPlanCal:f.lastPlanCal,lastMoveCal:f.lastMoveCal,nextMove:f.v33c1NextMoveCal,trail:f.recentTrail,moveCount:f.moveCount,coh:(f.cohortIds||[]).map(cid=>(v.military32A?.cohorts||[]).find(c=>String(c.id)===String(cid))).filter(Boolean).map(c=>({c,tileId:c.tileId,status:c.status}))}));}
function restore(rows){for(const o of rows){const f=o.f;f.tileId=o.tileId;f.targetTileId=o.targetTileId;f.targetReason=o.targetReason;f.status=o.status;f.lastPlanCal=o.lastPlanCal;f.lastMoveCal=o.lastMoveCal;f.v33c1NextMoveCal=o.nextMove;f.recentTrail=o.trail;f.moveCount=o.moveCount;for(const x of o.coh){x.c.tileId=x.tileId;x.c.status=x.status;}}}
// Outer guard catches planners added after V0.33A's original daily/seasonal protection.
for(const key of ['dailyTick','seasonalTick']){const previous=NS.Village.prototype[key];NS.Village.prototype[key]=function(w,...args){const rows=guarded(this,w);if(!rows.length)return previous.call(this,w,...args);const keyset=new Set(rows.map(o=>String(o.f.id)));const prevGuard=w._v34bHF1Guard;w._v34bHF1Guard={nationId:Number(this.id),formationIds:keyset};try{return previous.call(this,w,...args);}finally{restore(rows);w._v34bHF1Guard=prevGuard;}};}
const oldRecord=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){
 const guard=w?._v34bHF1Guard;
 if(guard&&['FORMATION_TARGET_CHANGED32D','FORMATION_MOVEMENT32D'].includes(type)&&Number(payload?.villageId)===guard.nationId&&guard.formationIds.has(String(payload?.formationId)))return null;
 return oldRecord.call(this,type,w,payload);
};
function inspect(w){const z=NS.V034B.inspect(w,{baseline:false});let withdrawingCount=0,blocked=0,badAccess=0;
 for(const v of w.activeVillages||[])for(const f of forms(v,w)){if(!withdrawing(f))continue;withdrawingCount++;const st=f.v33aWithdrawal;if(st?.blockedSinceCal!=null)blocked++;if(st&&st.allowedOwnerIds&&!st.allowedOwnerIds.every(x=>Number.isSafeInteger(Number(x))))badAccess++;}
 return {ok:z.ok&&badAccess===0,settlements:z.counts,registryErrors:z.errors.length,withdrawing:withdrawingCount,blockedWithdrawals:blocked,badPassports:badAccess};}
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const row=oldSnapshot.call(this,w,reason,note);if(row){const a=inspect(w);Object.assign(row.global,{activeSettlements34B:a.settlements?.activeSettlements??0,abandonedSettlements34B:a.settlements?.abandonedSettlements??0,settlementRegistryErrors34B:a.registryErrors,postwarWithdrawing34BHF1:a.withdrawing,postwarBlocked34BHF1:a.blockedWithdrawals});}return row;};
const previousCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=previousCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const keys=['activeSettlements34B','abandonedSettlements34B','settlementRegistryErrors34B','postwarWithdrawing34BHF1','postwarBlocked34BHF1'];const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+keys.map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const row of s.villages||[]){if(i<lines.length)lines[i++]+=','+keys.map(k=>q(s.global?.[k])).join(',');}return lines.join('\n');};
const oldToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldToJSON.call(this,w);d.version=VERSION;d.worldSummary.v034bHF1Revision='postwar-coalition-passport-and-target-guard';d.worldSummary.v034bHF1State=inspect(w);return d;};
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v34bHF1={revision:'postwar-coalition-passport-and-target-guard'};return d;};
NS.World.from=function(data){return oldFrom(String(data?.version||'')===VERSION?{...data,version:PREV}:data);};
const prevSave=NS.SaveSystem;
function dl(name,content,mime='application/json'){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([content],{type:mime}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...prevSave,
 save(w){const s=JSON.stringify(w.serialize());try{localStorage.setItem('village-observer-v034b-hf1',s);}catch(e){throw Error('로컬 저장 공간 부족: 세이브 JSON 파일로 내보내세요. '+String(e.message||e));}},
 load(){const s=localStorage.getItem('village-observer-v034b-hf1');return s?NS.World.from(JSON.parse(s)):prevSave.load?.();},
 export(w){dl('village-observer-v034B-HF1-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl('village-observer-v034B-HF1-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),v=NS.V032E14?.validateCSV?.(csv);if(v&&!v.ok)throw Error('V034B-HF1 CSV schema mismatch '+JSON.stringify(v.bad?.slice(0,4)));dl('village-observer-v034B-HF1-snapshots-'+w.telemetry.sessionId+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this);document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el)el.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-09',title:'종전 후 연합군 철수 통행권 안정화',summary:'종전 후 참전국 전체에 철수 전용 통행권을 유지하고, 평시 AI 목표가 철수 중 Formation을 덮어쓰는 문제를 막습니다. 다중 타일 Settlement는 변경하지 않습니다.',sections:[['철수 전용 통행권',['종전 당시 같은 편과 상대편의 모든 참여국 영토를 철군 중에만 통과할 수 있습니다.','최초 유예 360일이 지나도 철수가 완료되지 않으면 철수 권한을 연장하되 전투·점령·일반 군사이동에 사용할 수 없습니다.','참전하지 않은 제3국 영토는 일반적으로 통과할 수 없습니다.']],['경로 실패',['물리적 철수 경로가 720일 연속 없는 경우, 실제 참전 기록을 가진 Formation만 외교 송환으로 자국으로 돌려보냅니다.','외교 송환은 전투 이동이 아닌 추상화된 비전투 송환이며 Person·장비·Gold를 생성하거나 소멸시키지 않습니다.']],['군사 제어권',['철수 중 Formation에 대한 평시 국경/자원 목표 갱신을 차단하고 관련 중복 로그를 억제합니다.','철수 시작·통행 복원·유예 연장·송환·귀환·권한 해제 이벤트를 기록합니다.']],['Settlement 관측',['Snapshot/CSV에 ACTIVE/ABANDONED Settlement 수와 레지스트리 오류 수, 철수·경로 고착 수를 추가합니다.','전쟁 승패·전투·경제·생애 계산식은 변경하지 않습니다.']]]});
NS.V034BHF1=Object.freeze({version:VERSION,inspect,passport:NS.V034BHF1Core?.passport,pathHome:NS.V034BHF1Core?.pathHome,mark:NS.V034BHF1Core?.mark,move:NS.V034BHF1Core?.move});
try{window.villageObserver?.renderHeader?.();}catch(e){console.warn('V0.34B HF1 header',e);}
})(window.VSim);
