
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV33A='postwar-withdrawal-war-visibility-history-stabilization';
const CALA=w=>Number(w?.calendarOrdinalDay?.()??((Number(w?.ordinalDay?.()||0))*3));
const cloneA=x=>{try{return JSON.parse(JSON.stringify(x));}catch{return x;}};
const sameA=(a,b)=>a!=null&&b!=null&&Number(a)===Number(b);
const escA=s=>String(s??'').replace(/[&<>\"']/g,c=>c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c==='\"'?'&quot;':'&#39;');
const villageA=(w,id)=>(w?.villages||[]).find(v=>Number(v.id)===Number(id));
const warsA=w=>NS.V033?.ensureWorld?.(w)?.wars||[];
const activeWarA=(w,id)=>NS.V033?.warForNation?.(w,id)||null;
function formationsA(v,w){try{return NS.V032D?.ensureFormations?.(v,w)||v?.v32dMilitary?.formations||[];}catch{return v?.v32dMilitary?.formations||[];}}
function fieldFormsA(v,w){return formationsA(v,w).filter(f=>Array.isArray(f.cohortIds)&&f.cohortIds.length>0);}
function withdrawalA(f){return f?.v33aWithdrawal&&f.v33aWithdrawal.active?f.v33aWithdrawal:null;}
function withdrawingCountA(v,w){return fieldFormsA(v,w).filter(f=>withdrawalA(f)).length;}
function peacetimeForeignRowsA(v,w){if(activeWarA(w,v.id))return[];return fieldFormsA(v,w).filter(f=>{const t=w.map.get(Number(f.tileId));return t&&t.ownerId!=null&&!sameA(t.ownerId,v.id);});}
function participantIds34BHF1(war){
 const ids=[...(war?.sideAIds||[]),...(war?.sideBIds||[])];
 if(!ids.length)ids.push(war?.attackerId,war?.defenderId);
 return [...new Set(ids.filter(x=>x!==null&&x!==undefined&&Number.isSafeInteger(Number(x))).map(Number))];
}
function endedWar34BHF1(w,id){return warsA(w).find(x=>String(x.id)===String(id)&&x.status==='ENDED')||null;}
function lastEndedWarWithA(w,a,b){return warsA(w).filter(x=>x.status==='ENDED'&&participantIds34BHF1(x).includes(Number(a))&&participantIds34BHF1(x).includes(Number(b))).sort((x,y)=>Number(y.endCal||0)-Number(x.endCal||0))[0]||null;}
function passport34BHF1(v,w,f,enemyId,oldState=null){
 const d=f?.v33dReturnState, preferred=endedWar34BHF1(w,d?.warId||oldState?.warId),war=preferred&&participantIds34BHF1(preferred).includes(Number(v.id))?preferred:lastEndedWarWithA(w,v.id,enemyId);
 const members=war?participantIds34BHF1(war):[];
 const carried=(d?.warId&&String(d.warId)===String(war?.id))?d?.allowedOwnerIds:[];
 const previous=(oldState?.warId&&String(oldState.warId)===String(war?.id))?oldState?.allowedOwnerIds:[];
 const allowed=[...new Set([...members,...(carried||[]),...(previous||[])].map(Number).filter(x=>Number.isSafeInteger(x)&&x!==Number(v.id)))];
 // No unrelated historical treaties: an unknown war retains only the original opposite owner.
 if(!war&&!allowed.length&&Number.isSafeInteger(Number(enemyId)))allowed.push(Number(enemyId));
 return {warId:war?.id||d?.warId||oldState?.warId||null,allowedOwnerIds:allowed,participants:war?members:[],sourceWarEndCal:war?Number(war.endCal||0):null};
}
function cohortA(v,id){return(v.military32A?.cohorts||[]).find(c=>String(c.id)===String(id));}
function markWithdrawalA(v,w,f,source='POSTWAR'){
 if(!f||activeWarA(w,v.id))return false;
 const t=w.map.get(Number(f.tileId));if(!t||t.ownerId==null||sameA(t.ownerId,v.id)){if(f.v33aWithdrawal)delete f.v33aWithdrawal;return false;}
 const enemyId=Number(t.ownerId),now=CALA(w),existing=withdrawalA(f),passport=passport34BHF1(v,w,f,enemyId,existing);
 if(existing){
   const before=JSON.stringify(existing.allowedOwnerIds||[]);
   if(passport.warId&&(!existing.warId||String(existing.warId)===String(passport.warId))){existing.warId=passport.warId;existing.allowedOwnerIds=passport.allowedOwnerIds;existing.participants=passport.participants;}
   else if(!Array.isArray(existing.allowedOwnerIds))existing.allowedOwnerIds=[Number(existing.opponentId)];
   if(before!==JSON.stringify(existing.allowedOwnerIds||[]))w.telemetry?.record?.('POSTWAR_ACCESS_RESTORED34BHF1',w,{warId:existing.warId,villageId:v.id,formationId:f.id,allowedOwnerIds:existing.allowedOwnerIds});
   if(f.v33dReturnState){NS.V033F5A2?.noteWithdrawalOwnershipTransfer?.(v,w,f,f.v33dReturnState);delete f.v33dReturnState;}
   return true;
 }
 f.v33aWithdrawal={active:true,opponentId:enemyId,warId:passport.warId,allowedOwnerIds:passport.allowedOwnerIds,participants:passport.participants,startedCal:now,lastMoveCal:now-15,accessSoftExpiryCal:now+360,source};
 if(f.v33dReturnState){NS.V033F5A2?.noteWithdrawalOwnershipTransfer?.(v,w,f,f.v33dReturnState);delete f.v33dReturnState;}
 f.status='POSTWAR_WITHDRAWAL';f.targetReason='POSTWAR_WITHDRAWAL';
 w.telemetry?.record?.(source==='INVARIANT_RECOVERY'?'FOREIGN_FORMATION_RECOVERY33A':'POSTWAR_WITHDRAWAL_STARTED33A',w,{warId:passport.warId,village:v.name,villageId:v.id,formationId:f.id,fromTileId:Number(f.tileId),foreignOwnerId:enemyId,foreignOwner:villageA(w,enemyId)?.name||null,source});
 w.telemetry?.record?.('POSTWAR_ACCESS_GRANTED34BHF1',w,{warId:passport.warId,villageId:v.id,formationId:f.id,allowedOwnerIds:passport.allowedOwnerIds,graceDays:360,withdrawalOnly:true});
 return true;
}
function ensureWithdrawalsA(w,source='INVARIANT_RECOVERY'){
 let started=0;
 for(const v of w.activeVillages||[]){
  if(activeWarA(w,v.id))continue;
  for(const f of fieldFormsA(v,w)){
   const t=w.map.get(Number(f.tileId));
   if(t&&t.ownerId!=null&&!sameA(t.ownerId,v.id)){
    const was=!!withdrawalA(f);if(markWithdrawalA(v,w,f,source)&&!was)started++;
   }else if(t&&sameA(t.ownerId,v.id)&&withdrawalA(f))completeWithdrawalA(v,w,f,'ALREADY_HOME');
  }
 }
 return started;
}
function pathHomeA(v,w,f,st){
 const from=Number(f.tileId),allowed=new Set([Number(v.id),...(st.allowedOwnerIds||[st.opponentId]).map(Number)]),dist=new Map([[from,0]]),prev=new Map(),open=[[0,from]];
 let goal=null;
 while(open.length){
  open.sort((a,b)=>a[0]-b[0]);const[d,id]=open.shift();if(d!==dist.get(id))continue;
  const t=w.map.get(id);if(t&&sameA(t.ownerId,v.id)){goal=id;break;}
  for(const n of w.map.neighbors4(id)){
   if(!n||!NS.TERRAIN?.[n.terrain]?.passable||(n.ownerId!=null&&!allowed.has(Number(n.ownerId))))continue;
   let step=Number(NS.TERRAIN?.[n.terrain]?.tradeCost||1);if((n.buildings||[]).includes('road'))step*=.72;
   const nd=d+step;if(nd<(dist.get(n.id)??Infinity)){dist.set(n.id,nd);prev.set(n.id,id);open.push([nd,n.id]);}
  }
 }
 if(goal==null)return[];
 const p=[goal];let cur=goal;while(cur!==from){cur=prev.get(cur);if(cur==null)return[];p.push(cur);}return p.reverse();
}
function completeWithdrawalA(v,w,f,reason='REACHED_HOME'){
 const st=withdrawalA(f);if(!st)return false;
 const now=CALA(w),tile=Number(f.tileId);
 w.telemetry?.record?.('POSTWAR_WITHDRAWAL_COMPLETED33A',w,{warId:st.warId||null,village:v.name,villageId:v.id,formationId:f.id,tileId:tile,durationCalendarDays:Math.max(0,now-Number(st.startedCal??now)),reason});
 w.telemetry?.record?.('POSTWAR_ACCESS_REVOKED34BHF1',w,{warId:st.warId||null,villageId:v.id,formationId:f.id,reason});
 delete f.v33aWithdrawal;delete f.v33dReturnState;
 f.status='RETURNED';f.targetReason='HOME_RETURNED';f.targetTileId=Number(f.homeTileId??v.coreTileId);f._v33LastMoveCal=now;
 return true;
}
function moveWithdrawalA(v,w,f){
 const st=withdrawalA(f);if(!st)return false;
 const now=CALA(w),here=w.map.get(Number(f.tileId));if(here&&sameA(here.ownerId,v.id))return completeWithdrawalA(v,w,f);
 if(now>Number(st.accessSoftExpiryCal??(Number(st.startedCal||now)+360))&&now>=Number(st.lastExtensionCal||0)+360){st.lastExtensionCal=now;w.telemetry?.record?.('POSTWAR_ACCESS_EXTENDED34BHF1',w,{warId:st.warId,villageId:v.id,formationId:f.id,withdrawalOnly:true});}
 const path=pathHomeA(v,w,f,st);
 if(path.length<2){
  if(st.blockedSinceCal==null)st.blockedSinceCal=now;
  st.lastMoveCal=now;
  if(now-Number(st.lastBlockedLogCal??-99999)>=90){st.lastBlockedLogCal=now;w.telemetry?.record?.('POSTWAR_WITHDRAWAL_BLOCKED33A',w,{warId:st.warId||null,village:v.name,villageId:v.id,formationId:f.id,tileId:Number(f.tileId),opponentId:st.opponentId,allowedOwnerIds:st.allowedOwnerIds,blockedDays:now-st.blockedSinceCal,reason:'NO_RETURN_PATH'});}
  // A long, verified physical dead end is resolved as noncombat diplomatic repatriation.
  // No synthetic Person or equipment; this is explicitly NOT path-based military access.
  const validWar=endedWar34BHF1(w,st.warId),home=w.map.get(Number(v.coreTileId))?.ownerId==v.id?w.map.get(Number(v.coreTileId)):(w.map.tiles||[]).find(t=>sameA(t.ownerId,v.id)&&NS.TERRAIN?.[t.terrain]?.passable);
  if(validWar&&participantIds34BHF1(validWar).includes(Number(v.id))&&home&&now-Number(st.blockedSinceCal)>=720&&now-Number(st.startedCal)>=720){
   const from=Number(f.tileId);f.tileId=Number(home.id);f.lastMoveCal=now;f._v33LastMoveCal=now;f.v33c1NextMoveCal=now;
   for(const cid of f.cohortIds||[]){const c=cohortA(v,cid);if(c){c.tileId=Number(home.id);c.status='FIELD';}}
   w.telemetry?.record?.('POSTWAR_DIPLOMATIC_REPATRIATION34BHF1',w,{warId:st.warId,villageId:v.id,formationId:f.id,fromTileId:from,toTileId:Number(home.id),blockedDays:now-st.blockedSinceCal,nonCombat:true,noNewPersons:true,noEquipmentTransfer:true});
   completeWithdrawalA(v,w,f,'DIPLOMATIC_REPATRIATION');return true;
  }
  return false;
 }
 if(st.blockedSinceCal!=null){w.telemetry?.record?.('POSTWAR_PATH_REOPENED34BHF1',w,{warId:st.warId,villageId:v.id,formationId:f.id,blockedDays:now-Number(st.blockedSinceCal),pathSteps:path.length-1});delete st.blockedSinceCal;}
 const from=Number(f.tileId),to=Number(path[1]),info=NS.V033?.militaryMoveDays?.(v,w,f,from,to,'WITHDRAWAL')||{days:10};
 // D and A return handlers can run in the same day. Never grant two moves.
 if(Number(f._v33LastMoveCal)===now||now-Number(st.lastMoveCal??-99999)<Number(info.days||10))return false;
 f.tileId=to;f.targetTileId=Number(path[path.length-1]);f.targetReason='POSTWAR_WITHDRAWAL';f.status='POSTWAR_WITHDRAWAL';f.lastMoveCal=now;f._v33LastMoveCal=now;f.v33c1NextMoveCal=now+Number(info.days||10);f.moveCount=Number(f.moveCount||0)+1;st.lastMoveCal=now;
 for(const cid of f.cohortIds||[]){const c=cohortA(v,cid);if(c){c.tileId=to;c.status='FIELD';}}
 w.telemetry?.record?.('POSTWAR_WITHDRAWAL_MOVE33A',w,{warId:st.warId||null,village:v.name,villageId:v.id,formationId:f.id,fromTileId:from,toTileId:to,returnTileId:Number(path[path.length-1]),remainingSteps:Math.max(0,path.length-2),nonCombat:true,moveDays33C1:Number(info.days||10),mobility33C1:info,allowedOwnerIds:st.allowedOwnerIds});
 const dest=w.map.get(to);if(dest&&sameA(dest.ownerId,v.id))completeWithdrawalA(v,w,f);return true;
}
function withdrawalPulseA(w){ensureWithdrawalsA(w);for(const v of w.activeVillages||[]){if(activeWarA(w,v.id))continue;for(const f of fieldFormsA(v,w))if(withdrawalA(f))moveWithdrawalA(v,w,f);}}
function snapshotWithdrawalFormsA(v,w){const rows=fieldFormsA(v,w).filter(f=>withdrawalA(f));if(!rows.length)return null;return rows.map(f=>({f,id:f.id,state:{tileId:f.tileId,targetTileId:f.targetTileId,status:f.status,lastMoveCal:f.lastMoveCal,lastPlanCal:f.lastPlanCal,moveCount:f.moveCount,targetReason:f.targetReason,recentTrail:cloneA(f.recentTrail||[])},coh:(f.cohortIds||[]).map(id=>{const c=cohortA(v,id);return c?{c,tileId:c.tileId,status:c.status}:null;}).filter(Boolean)}));}
function restoreWithdrawalFormsA(rows){for(const x of rows||[]){Object.assign(x.f,cloneA(x.state));for(const q of x.coh){q.c.tileId=q.tileId;q.c.status=q.status;}}}
const dailyA=NS.Village.prototype.dailyTick,seasonalA=NS.Village.prototype.seasonalTick;
NS.Village.prototype.dailyTick=function(w){const snap=snapshotWithdrawalFormsA(this,w);if(snap)w._v33aSuppressWithdrawalLegacyLogs=true;try{return dailyA.call(this,w);}finally{if(snap){restoreWithdrawalFormsA(snap);w._v33aSuppressWithdrawalLegacyLogs=false;}}};
NS.Village.prototype.seasonalTick=function(w){const snap=snapshotWithdrawalFormsA(this,w);if(snap)w._v33aSuppressWithdrawalLegacyLogs=true;try{return seasonalA.call(this,w);}finally{if(snap){restoreWithdrawalFormsA(snap);w._v33aSuppressWithdrawalLegacyLogs=false;}}};

function historyObjA(war){war.history33A=war.history33A||{};const h=war.history33A;h.uniqueOccupiedTileIdsBySide=h.uniqueOccupiedTileIdsBySide||{};h.currentOccupiedTileIdsBySide=h.currentOccupiedTileIdsBySide||{};h.maxSimultaneousBySide=h.maxSimultaneousBySide||{};h.capitalOccupiedBySide=h.capitalOccupiedBySide||{};h.capitalFirstCalBySide=h.capitalFirstCalBySide||{};return h;}
function arrAddA(o,k,v){const a=o[k]=Array.isArray(o[k])?o[k]:[];if(!a.some(x=>Number(x)===Number(v)))a.push(Number(v));return a;}
function arrDelA(o,k,v){const a=Array.isArray(o[k])?o[k]:[];o[k]=a.filter(x=>Number(x)!==Number(v));return o[k];}
function processHistoryEventA(w,type,p={}){const war=(warsA(w)).find(x=>String(x.id)===String(p.warId));if(!war)return;const h=historyObjA(war);if(type==='WAR_DECLARED33'){h.attackerName=p.attacker||h.attackerName;h.defenderName=p.defender||h.defenderName;}else if(type==='TILE_OCCUPIED33'){const k=String(p.occupierId),tile=Number(p.tileId);arrAddA(h.uniqueOccupiedTileIdsBySide,k,tile);const cur=arrAddA(h.currentOccupiedTileIdsBySide,k,tile);h.maxSimultaneousBySide[k]=Math.max(Number(h.maxSimultaneousBySide[k]||0),cur.length);if(p.core){h.capitalOccupiedBySide[k]=true;if(h.capitalFirstCalBySide[k]==null)h.capitalFirstCalBySide[k]=CALA(w);}}else if(type==='TILE_LIBERATED33'){const k=String(p.formerOccupierId);arrDelA(h.currentOccupiedTileIdsBySide,k,Number(p.tileId));}else if(type==='WAR_ENDED33'){for(const k of Object.keys(h.currentOccupiedTileIdsBySide))h.currentOccupiedTileIdsBySide[k]=[];h.endReason=p.reason||war.endReason;h.winnerName=p.winner||h.winnerName;}}
function backfillHistoryA(w){const s=NS.V033?.ensureWorld?.(w);if(!s||s.historyBackfilled33A)return;for(const war of s.wars||[])historyObjA(war);for(const e of w.telemetry?.entries||[])if(['WAR_DECLARED33','TILE_OCCUPIED33','TILE_LIBERATED33','WAR_ENDED33'].includes(e.type))processHistoryEventA(w,e.type,e.payload||{});s.historyBackfilled33A=true;}
const recA=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){if(w?._v33aSuppressWithdrawalLegacyLogs&&['FORMATION_MOVEMENT32D','FORMATION_TARGET_CHANGED32D'].includes(type))return null;const r=recA.call(this,type,w,payload);try{if(['WAR_DECLARED33','TILE_OCCUPIED33','TILE_LIBERATED33','WAR_ENDED33'].includes(type))processHistoryEventA(w,type,payload||{});}catch(e){console.error('V0.33A history event failed',e);}return r;};

function withdrawalSaveRowsA(w){const out=[];for(const v of w?.villages||[])for(const f of fieldFormsA(v,w)){const st=withdrawalA(f);if(st)out.push({villageId:v.id,formationId:f.id,state:cloneA(st)});}return out;}
function restoreWithdrawalSaveA(w,d){for(const row of d?.v33a?.withdrawals||[]){const v=villageA(w,row.villageId);if(!v)continue;const f=fieldFormsA(v,w).find(x=>String(x.id)===String(row.formationId));if(f&&row.state?.active){f.v33aWithdrawal=cloneA(row.state);f.status='POSTWAR_WITHDRAWAL';f.targetReason='POSTWAR_WITHDRAWAL';}}}
function attachA(w,d=null){w=NS.V033?.attachWorld?.(w,d)||w;if(!w)return w;backfillHistoryA(w);restoreWithdrawalSaveA(w,d);ensureWithdrawalsA(w,'INVARIANT_RECOVERY');return w;}
const advanceA=NS.World.prototype.advanceOneDay;NS.World.prototype.advanceOneDay=function(){const r=advanceA.call(this);withdrawalPulseA(this);return r;};

function calLabelA(cal){cal=Number(cal);if(!Number.isFinite(cal)||cal<=0)return'기록 없음';const y=Math.floor((cal-1)/360)+1,d=(cal-1)%360,q=Math.floor(d/90)+1,dd=d%90+1;return`${y}년 ${q}분기 ${dd}일`;}
function reasonLabelA(x){return({FIELD_FORCE_COLLAPSE:'야전전력 붕괴',WAR_EXHAUSTION:'전쟁 피로',NATION_COLLAPSE:'국가 붕괴',EXHAUSTION:'전쟁 피로'}[x]||x||'미정');}
function warNamesA(w,war){const a=villageA(w,war.attackerId),b=villageA(w,war.defenderId),h=historyObjA(war);return{a:a?.name||h.attackerName||`국가 #${war.attackerId}`,b:b?.name||h.defenderName||`국가 #${war.defenderId}`};}
function resultA(w,war,id=null){if(war.status==='ACTIVE')return'진행 중';if(war.winnerId==null)return'무승부/불명확';if(id==null)return`${villageA(w,war.winnerId)?.name||historyObjA(war).winnerName||`국가 #${war.winnerId}`} 승리`;return sameA(war.winnerId,id)?'승전':'패전';}
function warCardA(w,war,id=null,compact=false){const n=warNamesA(w,war),h=historyObjA(war),opp=id==null?null:(sameA(war.attackerId,id)?n.b:n.a),dur=Math.max(0,Number((war.endCal??CALA(w))-Number(war.startCal||CALA(w)))),uA=(h.uniqueOccupiedTileIdsBySide?.[String(war.attackerId)]||[]).length,uB=(h.uniqueOccupiedTileIdsBySide?.[String(war.defenderId)]||[]).length,cA=!!h.capitalOccupiedBySide?.[String(war.attackerId)],cB=!!h.capitalOccupiedBySide?.[String(war.defenderId)],deA=Number(war.casualties?.[war.attackerId]||0),deB=Number(war.casualties?.[war.defenderId]||0),woA=Number(war.wounded?.[war.attackerId]||0),woB=Number(war.wounded?.[war.defenderId]||0);if(compact){const myCap=id!=null?(sameA(id,war.attackerId)?cB:cA):false,enemyCap=id!=null?(sameA(id,war.attackerId)?cA:cB):false;return`<div class=\"v33a-miniwar\"><b>${escA(opp||`${n.a}–${n.b}`)}</b> · ${escA(resultA(w,war,id))} · ${dur}일 · 전투 ${Number(war.battles||0)}${enemyCap?' · 적 수도 점령':''}${myCap?' · 수도 피점령':''}<br><span class=\"muted\">${calLabelA(war.startCal)} ~ ${war.endCal?calLabelA(war.endCal):'진행 중'} · ${escA(reasonLabelA(war.endReason))}</span></div>`;}return`<div class=\"v33a-warcard ${war.status==='ACTIVE'?'active':''}\"><div class=\"section-head\"><div><b>⚔ ${escA(n.a)} – ${escA(n.b)}</b><div class=\"small muted\">${calLabelA(war.startCal)} ~ ${war.endCal?calLabelA(war.endCal):'진행 중'} · ${dur}일</div></div><span class=\"tag\">${escA(resultA(w,war))}</span></div><div class=\"v33a-wargrid\"><span>종전 <b>${escA(war.status==='ACTIVE'?'진행 중':reasonLabelA(war.endReason))}</b></span><span>전투 <b>${Number(war.battles||0)}</b></span><span>전사 <b>${deA} / ${deB}</b></span><span>부상 <b>${woA} / ${woB}</b></span><span>누적 점령 <b>${uA} / ${uB}</b></span><span>수도 점령 <b>${cA?'공격국':''}${cA&&cB?' / ':''}${cB?'방어국':''}${!cA&&!cB?'없음':' 측'}</b></span></div></div>`;}
/* V0.33E1 removed obsolete War History writer: updateHistoryPanelA */
function updateMapBannerA(ui){const panel=document.querySelector('#view-map .panel');if(!panel)return;let box=document.getElementById('v33aWarBanner');if(!box){box=document.createElement('div');box.id='v33aWarBanner';box.className='v33a-banner';const tb=panel.querySelector('.map-toolbar');panel.insertBefore(box,tb||panel.firstChild);}const list=NS.V033?.activeWars?.(ui.world)||[];if(!list.length){box.style.display='none';box.innerHTML='';return;}box.style.display='block';box.innerHTML=list.map(w=>{const n=warNamesA(ui.world,w);return`<div><b>⚔ 전쟁 중 · ${escA(n.a)} ↔ ${escA(n.b)}</b><span>${Math.max(0,CALA(ui.world)-Number(w.startCal||CALA(ui.world)))}일째 · 전투 ${Number(w.battles||0)}</span></div>`;}).join('');}
function recentWarsMiniA(v,w){const list=[...warsA(w)].filter(x=>sameA(x.attackerId,v.id)||sameA(x.defenderId,v.id)).sort((a,b)=>Number(b.startCal||0)-Number(a.startCal||0)).slice(0,5);return`<div class=\"v33a-recent\"><div class=\"section-head\"><div><strong>📜 최근 전쟁</strong><div class=\"small muted\">이 국가가 참가한 최근 전쟁 기록</div></div><span class=\"tag\">${list.length}</span></div>${list.map(x=>warCardA(w,x,v.id,true)).join('')||'<div class=\"small muted\">참전 기록 없음</div>'}</div>`;}
function drawWarFrontA(ui){const g=ui._mapGeom,c=ui.q?.('worldCanvas');if(!g||!c)return;const wars=NS.V033?.activeWars?.(ui.world)||[];if(!wars.length)return;const ctx=c.getContext('2d'),{cell,ox,oy}=g,w=ui.world,pairs=new Set(wars.map(x=>[Number(x.attackerId),Number(x.defenderId)].sort((a,b)=>a-b).join('-')));ctx.save();ctx.strokeStyle='rgba(255,78,78,.95)';ctx.lineWidth=Math.max(2,cell*.085);ctx.setLineDash([Math.max(3,cell*.16),Math.max(2,cell*.10)]);for(const t of w.map.tiles||[]){if(t.ownerId==null)continue;for(const n of w.map.neighbors4(t.id)){if(n.id<t.id||n.ownerId==null)continue;const key=[Number(t.ownerId),Number(n.ownerId)].sort((a,b)=>a-b).join('-');if(!pairs.has(key))continue;let x1,y1,x2,y2;if(n.x===t.x+1){x1=x2=ox+(t.x+1)*cell;y1=oy+t.y*cell;y2=y1+cell;}else if(n.x===t.x-1){x1=x2=ox+t.x*cell;y1=oy+t.y*cell;y2=y1+cell;}else if(n.y===t.y+1){y1=y2=oy+(t.y+1)*cell;x1=ox+t.x*cell;x2=x1+cell;}else{y1=y2=oy+t.y*cell;x1=ox+t.x*cell;x2=x1+cell;}ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}}ctx.setLineDash([]);if(!NS.V033D1?.suppressLegacyFormationRing)for(const war of wars)for(const id of [war.attackerId,war.defenderId]){const v=villageA(w,id);if(!v)continue;for(const f of fieldFormsA(v,w)){const t=w.map.get(Number(f.tileId));if(!t)continue;ctx.beginPath();ctx.strokeStyle='rgba(255,82,82,.95)';ctx.lineWidth=Math.max(2,cell*.07);ctx.arc(ox+(t.x+.5)*cell,oy+(t.y+.5)*cell,cell*.34,0,Math.PI*2);ctx.stroke();}}ctx.restore();}
function updateUiA(ui){backfillHistoryA(ui.world);updateMapBannerA(ui);}

if(NS.UI){const setA=NS.UI.prototype.setWorld,headA=NS.UI.prototype.renderHeader,contentA=NS.UI.prototype.renderVillageContent,worldA=NS.UI.prototype.renderWorld,renderA=NS.UI.prototype.render;NS.UI.prototype.setWorld=function(w){return setA.call(this,attachA(w));};NS.UI.prototype.renderHeader=function(){headA.call(this);document.title='Village Observer V0.33A';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.33A</strong>';const st=this.q('runtimeStatus');if(st){const wars=NS.V033?.activeWars?.(this.world)?.length||0,wd=(this.world.activeVillages||[]).reduce((a,v)=>a+withdrawingCountA(v,this.world),0),foreign=(this.world.activeVillages||[]).reduce((a,v)=>a+peacetimeForeignRowsA(v,this.world).length,0);st.textContent=`✓ V0.33A 전쟁 안정화 · active wars ${wars} · 철군 ${wd} · 평시 외국군 ${foreign}`;}updateUiA(this);};NS.UI.prototype.renderVillageContent=function(){contentA.call(this);const v=this.world.selectedNation,root=this.q('villageContent');if(v&&root&&this.sub==='military'&&!root.querySelector('.v33a-recent'))root.insertAdjacentHTML('beforeend',recentWarsMiniA(v,this.world));};NS.UI.prototype.renderWorld=function(){worldA.call(this);drawWarFrontA(this);updateMapBannerA(this);};NS.UI.prototype.render=function(){const r=renderA.call(this);updateUiA(this);return r;};}

const snapA=NS.Telemetry.prototype.snapshot;NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snapA.call(this,w,reason,note);if(!s)return s;let withdrawing=0,foreign=0,cap=0;for(const war of warsA(w)){const h=historyObjA(war);cap+=Object.values(h.capitalOccupiedBySide||{}).filter(Boolean).length;}for(const v of w.activeVillages||[]){withdrawing+=withdrawingCountA(v,w);foreign+=peacetimeForeignRowsA(v,w).length;}Object.assign(s.global,{withdrawingFormations33A:withdrawing,peacetimeForeignFormations33A:foreign,warHistoryCount33A:warsA(w).length,capitalOccupations33A:cap});for(const row of s.villages||[]){const v=villageA(w,row.id);if(v){row.withdrawingFormations33A=withdrawingCountA(v,w);row.peacetimeForeignFormations33A=peacetimeForeignRowsA(v,w).length;}}const ys=(this.yearlySummaries||[]).find(x=>Number(x.year)===Number(w.year));if(ys){Object.assign(ys.global,s.global);for(const n of ys.nations||[]){const row=s.villages.find(x=>Number(x.id)===Number(n.id));if(row){n.withdrawingFormations33A=row.withdrawingFormations33A;n.peacetimeForeignFormations33A=row.peacetimeForeignFormations33A;}}}return s;};
const csvA=NS.Telemetry.prototype.snapshotsCSV;NS.Telemetry.prototype.snapshotsCSV=function(){const base=csvA.call(this),lines=base.split('\n');if(!lines.length)return base;const G=['withdrawingFormations33A','peacetimeForeignFormations33A','warHistoryCount33A','capitalOccupations33A'],R=['withdrawingFormations33A','peacetimeForeignFormations33A'],q=v=>`\"${String(v??'').replace(/\"/g,'\"\"')}\"`;lines[0]+=','+[...G,...R].map(q).join(',');let i=1;for(const s of this.snapshots||[])for(const row of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+[...G.map(k=>s.global?.[k]),...R.map(k=>row?.[k])].map(q).join(',');}return lines.join('\n');};
const jsonA=NS.Telemetry.prototype.toJSON;NS.Telemetry.prototype.toJSON=function(w){const d=jsonA.call(this,w);d.version='0.33A';Object.assign(d.worldSummary,{v33ARevision:REV33A,postwarWithdrawal33A:'ended-war foreign formations use a non-combat return corridor through the former opponent territory until re-entering home territory',warVisibility33A:'active-war banner + red front-border overlay + wartime formation rings',warHistory33A:'persistent wars[] exposed in statistics and nation military UI; occupation/capital history backfilled from retained war events when available'});return d;};

const serA=NS.World.prototype.serialize,fromA=NS.World.from;NS.World.prototype.serialize=function(){const d=serA.call(this);d.version='0.33A';d.v33a={revision:REV33A,postwarWithdrawal:true,warVisibility:true,warHistory:true,peacetimeForeignInvariant:true,withdrawals:withdrawalSaveRowsA(this)};return d;};NS.World.from=function(d){if(d?.version==='0.33A'){const w=fromA({...d,version:'0.33'});return attachA(w,d);}return attachA(fromA(d),d);};
function dlA(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
const savePrevA=NS.SaveSystem;(function(){const KEY='village-observer-v0-33a',fallback=['village-observer-v0-33','village-observer-v0-32f'];NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dlA(`village-observer-v033A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dlA(`village-observer-v033A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){const text=w.telemetry.snapshotsCSV(),c=NS.V032E14?.validateCSV?.(text);if(c&&!c.ok)throw new Error(`CSV schema mismatch: expected ${c.columns} columns; bad rows ${c.bad.slice(0,8).join(', ')}`);dlA(`village-observer-v033A-snapshots-${w.telemetry.sessionId}.csv`,'\\ufeff'+text,'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attachA(await savePrevA.importMap(file));},async importScenario(file){return attachA(await savePrevA.importScenario(file));},exportScenario(w,meta=null){const x=NS.V032E14?.scenarioWrapper?.(w,meta);if(!x)return savePrevA.exportScenario(w,meta);x.meta={...x.meta,intendedVersion:'0.33A'};x.world.testScenario={...x.meta};if(x.world.v32e11)x.world.v32e11.scenario={...x.meta};dlA(`village-observer-v033A-scenario-${x.meta.id}.json`,JSON.stringify(x));return x;}};})();

if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`.v33a-banner{display:none;margin:0 0 8px;padding:9px 11px;border:1px solid rgba(255,90,90,.65);border-radius:11px;background:rgba(150,35,35,.18);box-shadow:0 0 0 1px rgba(255,70,70,.08) inset}.v33a-banner>div{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.v33a-banner b{color:#ffb0b0}.v33a-banner span{font-size:11px;color:#ffd0d0}.v33a-history{display:grid;gap:8px;max-height:58vh;overflow:auto}.v33a-warcard,.v33a-recent{border:1px solid rgba(120,150,190,.3);border-radius:11px;padding:9px;background:rgba(255,255,255,.025)}.v33a-warcard.active{border-color:rgba(255,90,90,.55);background:rgba(145,45,45,.08)}.v33a-wargrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.v33a-wargrid span,.v33a-miniwar{font-size:11px;padding:6px 7px;border-radius:8px;background:rgba(255,255,255,.04)}.v33a-miniwar{margin-top:5px}@media(max-width:760px){.v33a-wargrid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(st);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.33A'))NS.PATCH_NOTES.unshift({version:'V0.33A',date:'2026-09-28',title:'Post-war Withdrawal + War Observer',summary:'첫 자연전쟁에서 발견된 종전 후 외국 영토 Formation 고립을 수정하고, 현재 전쟁을 지도에서 놓치지 않도록 전쟁 배너/전선 표시를 추가하며, 종료된 전쟁을 통계·국가 군사 탭에서 다시 볼 수 있게 합니다.',sections:[['종전 후 철군',['평화 상태에서 외국 영토에 남은 Field Formation은 POSTWAR_WITHDRAWAL 상태로 자동 전환됩니다.','철군 중에는 직전 교전국 영토를 비전투로 통과하며 기존 15 calendar-day/1 tile 속도로 가장 가까운 자국 영토까지 귀환합니다.','철군 중 Formation은 평시 BORDER/RESOURCE planner의 목표 변경과 이동에서 보호되며 점령·전투를 수행하지 않습니다.','평화+외국 영토 Formation invariant가 매일 복구를 시도하고 저장/불러오기 후에도 철군 상태를 유지합니다.']],['지도 전쟁 가시성',['전쟁 중에는 지도 상단에 교전국과 전쟁 경과일을 표시하는 붉은 배너를 노출합니다.','교전국 사이 실제 국경을 붉은 점선 전선으로 강조하고 전쟁 참가 Field Formation 위치에 붉은 링을 표시합니다.','기존 임시 점령 사선 표시는 그대로 유지합니다.']],['War History',['World v33War.wars의 현재/과거 전쟁을 통계 탭의 전쟁 기록 패널에서 시간순으로 열람할 수 있습니다.','국가 군사 탭에는 해당 국가의 최근 전쟁을 간단히 표시합니다.','누적 점령 타일, 최대 동시 점령, 수도 점령 여부를 전쟁 이력에 보존하며 기존 0.33 저장은 남아 있는 war telemetry에서 가능한 범위까지 자동 보강합니다.']],['관측·회귀',['CSV에 철군 Formation 수와 평시 외국군 invariant를 추가합니다.','철군 중에는 새 전쟁 선포 대상에서 제외해 전후 복귀가 끝나기 전에 다른 전쟁으로 재진입하는 것을 막습니다.','승전 보상·배상·영구 영토 할양 등 Peace Outcome 시스템은 이번 A에 추가하지 않습니다.']]]});
NS.V033A={revision:REV33A,attachWorld:attachA,withdrawalPulse:withdrawalPulseA,withdrawingCount:withdrawingCountA,foreignRows:peacetimeForeignRowsA,history:historyObjA,combat:true};
NS.V034BHF1Core=Object.freeze({passport:passport34BHF1,pathHome:pathHomeA,mark:markWithdrawalA,move:moveWithdrawalA,ensure:ensureWithdrawalsA,participantIds:participantIds34BHF1});
try{const ui=window.villageObserver;if(ui){ui.world=attachA(ui.world);withdrawalPulseA(ui.world);ui.renderHeader?.();ui.render?.();}}catch(e){console.error('V0.33A startup attach failed',e);}
})(window.VSim);
