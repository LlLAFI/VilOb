/* V0.35E — build-only, reversible instrumentation / conservative housing hotpath.
   NEVER modify the immutable C1H source files. With profiling OFF, wrappers
   only forward to the exact legacy function and consume no simulation RNG.
*/
function once(text, needle, replacement, label) {
 const at=text.indexOf(needle);
 if(at<0 || text.indexOf(needle,at+needle.length)>=0) throw Error('35E transform anchor missing or ambiguous: '+label);
 return text.slice(0,at)+replacement+text.slice(at+needle.length);
}
const timed=[
 ['housingRowsD3','v,w','housingRowsD3'],
 ['orderedHousingScopeD3','v,w,sourceId,rows','orderedHousingScopeD3'],
 ['tryHousingResolveD3',"v,w,sourceId,reason='HOUSING32D3'",'tryHousingResolveD3'],
 ['adminRegionKeyD3','v,w,id','adminRegionKeyD3'],
 ['tileBusyD3','v,id','tileBusyD3'],
];
function instrument(text,name,args,key){
 const call=args.split(',').map(x=>x.trim().split('=')[0].trim()).join(',');
 const needle=`function ${name}(${args}){`;
 const target=`function ${name}(${args}){const profiler=NS.V035E;return profiler?.isMeasuring?.()?profiler.measure('${key}',()=>${name}35EImpl(${call})):${name}35EImpl(${call});}\nfunction ${name}35EImpl(${args}){`;
 return once(text,needle,target,name);
}
export function e35Transform(file,text){let out=text;
 if(file==='src/legacy/025.js'){
   // Captures V0.17 housing branch BEFORE the later V0.32D3 override.
   const needle="const daily16=NS.Village.prototype.dailyTick;";
   const insert=`const buildHouseV17E=NS.Village.prototype.buildHouse;\nNS.Village.prototype.buildHouse=function(w){const e=NS.V035E;return e?.isMeasuring?.()?e.measure('buildHouseV17',()=>buildHouseV17E.call(this,w)):buildHouseV17E.call(this,w);};\n`;
   out=once(out,needle,insert+needle,'legacy buildHouse V17 capture');
   // Existing 35D instrumentation renamed the body; E instruments this body
   // independently (it contains ALL nested housing attempts).
   out=instrument(out,'demandDevelopment35DImpl','v,w','demandDevelopment');
   // 'pop' in the V17 buildHouse ranked entries was calculated but never read.
   // Avoid a full tileResidents() call for each territorial tile and retry.
   out=once(out,'p:settlementPressure(this,t,w),pop:this.tileResidents(t.id).filter(p=>p.alive).length','p:settlementPressure(this,t,w)','V17 unused population calculation');
 }
 if(file==='src/legacy/065.js'){
   for(const [name,args,key] of timed)out=instrument(out,name,args,key);
   // Later overrides kept intact: this is the final housing entry point.
   const needle='/* Housing reserve also participates in the existing AI reserve plan. */';
   const wrapper=`const buildHouseTop35E=NS.Village.prototype.buildHouse;\nNS.Village.prototype.buildHouse=function(w){const e=NS.V035E;return e?.isMeasuring?.()?e.measureHouseCall(this,w,()=>buildHouseTop35E.call(this,w)):buildHouseTop35E.call(this,w);};\n`;
   out=once(out,needle,wrapper+needle,'D3 top level housing');
   // Scope ranking previously calls deterministic map.distance twice per
   // candidate. Use the SAME distance value for tier and ordering.
   const from="const rank=[];for(const r of rows){if(r.id===Number(sourceId))continue;let tier=4;if(zoneSet.has(r.id))tier=0;else if(admin&&adminRegionKeyD3(v,w,r.id)===admin)tier=1;else{const d=src?w.map.distance(src.id,r.id):999;if(d<=2)tier=2;else if(d<=4)tier=3;}rank.push({...r,tier,distance:src?w.map.distance(src.id,r.id):999});}";
   const to="const rank=[];for(const r of rows){if(r.id===Number(sourceId))continue;const distance=src?w.map.distance(src.id,r.id):999;let tier=4;if(zoneSet.has(r.id))tier=0;else if(admin&&adminRegionKeyD3(v,w,r.id)===admin)tier=1;else{if(distance<=2)tier=2;else if(distance<=4)tier=3;}rank.push({...r,tier,distance});}";
   out=once(out,from,to,'D3 duplicated distance');
 }
 return out;
}
