/* V0.35D source-verified, build-only hotpath transforms. Immutable legacy files
 * remain byte-identical. Instrumentation is OFF until the explicit 35D session.
 */
const metrics={
 'src/legacy/021.js':[['updateConcernEvents','v,w','concernEvents'],['processFoodSpoilage','v,w','foodSpoilage']],
 'src/legacy/023.js':[['recoveryProfile','v,w','recoveryProfile'],['updateRecovery','v,w,seasonal=false','updateRecovery']],
 'src/legacy/025.js':[['recentTradeVolume','v,tileId,w,window=120','tradeVolumeLookup'],['settlementPressure','v,t,w,tradeIndex=null','settlementPressure'],['localTargetPrice','v,t,k,w','localTargetPrice'],['demandDevelopment','v,w','demandDevelopment']],
 'src/legacy/026.js':[['considerFestival','v,w','festivalDecision']]
};
function exactly(text,from,to,label){const p=text.indexOf(from);if(p<0||text.indexOf(from,p+from.length)>=0)throw Error('35D anchor missing/ambiguous '+label);return text.slice(0,p)+to+text.slice(p+from.length);}
function wrap(text,name,args,key){
 const original=`function ${name}(${args}){`;
 const target=`function ${name}35DImpl(${args}){`;
 const supplied=args.split(',').map(x=>x.trim().split('=')[0].trim()).join(',');
 const newText=`function ${name}(${args}){const d=NS.V035D;return d?.isMeasuring?.()?d.measure('${key}',()=>${name}35DImpl(${supplied})):${name}35DImpl(${supplied});}\n${target}`;
 return exactly(text,original,newText,`${name} wrapper`);
}
export function d35Transform(file,source){if(!metrics[file])return source;let out=source;
 if(file==='src/legacy/025.js'){
  // Only the current demandDevelopment invocation shares the trade index;
  // buildHouse and UI settlementPressure retain original per-tile semantics.
  const from="function demandDevelopment(v,w){if(v.status!=='active')return false;const rows=[...v.territory].map(id=>w.map.get(id)).filter(Boolean).map(t=>({t,p:settlementPressure(v,t,w)}));";
  const to="function demandDevelopment(v,w){if(v.status!=='active')return false;const tradeIndex=v.territory.size>=3&&(v.tradeHistory||[]).length>=8?tradeVolumeIndex35D(v,w):null;const rows=[...v.territory].map(id=>w.map.get(id)).filter(Boolean).map(t=>({t,p:settlementPressure(v,t,w,tradeIndex)}));";
  out=exactly(out,from,to,'demandDevelopment trade aggregate');
  // Preserve stable per-tile trade record addition order and strict tile-ID equality.
  const anchor="/* ---------- settlement demand/pressure ---------- */";
  const helper=`function tradeVolumeIndex35D(v,w){const out=new Map();for(const r of v.tradeHistory||[]){if(w.ordinalDay()-(r.day||0)>120)continue;const qty=Number(r.qty||0),a=r.buyerTileId,b=r.sellerTileId;let x=out.get(a);if(!x){x={qty:0,count:0};out.set(a,x);}x.qty+=qty;x.count++;if(b!==a){let y=out.get(b);if(!y){y={qty:0,count:0};out.set(b,y);}y.qty+=qty;y.count++;}}return out;}\n`;
  out=exactly(out,anchor,anchor+'\n'+helper,'trade index entry');
  out=exactly(out,'function settlementPressure(v,t,w){','function settlementPressure(v,t,w,tradeIndex=null){','pressure arg');
  out=exactly(out,'tr=recentTradeVolume(v,t.id,w),prices=', 'tr=tradeIndex?(tradeIndex.get(t.id)||{qty:0,count:0}):recentTradeVolume(v,t.id,w),prices=','settlementPressure trade index');
  // 30 and 120 day sums were two full scans. One ordered scan preserves the
  // exact additions within EACH window, including future-dated rows exclusion.
  const old="prod=(days)=>{const start=day-days+1,sum=ledger.filter(r=>Number(r.day)>=start&&Number(r.day)<=day).reduce((a,r)=>a+Number(r[k]||0),0);return sum/Math.max(1,Math.min(days,day));},prod30=prod(30),prod120=prod(120),hasProd=";
  const newer="totals35D=(()=>{let s30=0,s120=0;for(const r of ledger){const d=Number(r.day);if(d>=day-29&&d<=day)s30+=Number(r[k]||0);if(d>=day-119&&d<=day)s120+=Number(r[k]||0);}return [s30,s120];})(),prod30=totals35D[0]/Math.max(1,Math.min(30,day)),prod120=totals35D[1]/Math.max(1,Math.min(120,day)),hasProd=";
  out=exactly(out,old,newer,'production ledger single scan');
 }
 for(const [name,args,key] of metrics[file])out=wrap(out,name,args,key);
 return out;
}
