from pathlib import Path
p=Path(__file__).with_name('benchmark-local.html')
s=p.read_text()
s=s.replace('VILOB E-02 로컬','VILOB E-03 로컬').replace('V0.34E-rc2 · 로컬','V0.34E-rc3 · 로컬').replace('B3B와 E-rc2','B3B와 E-rc3').replace('E-rc2 독립 실행 HTML','E-rc3 독립 실행 HTML').replace('E-rc2 HTML','E-rc3 HTML').replace("'E-rc2'","'E-rc3'").replace('E-rc2', 'E-rc3')
s=s.replace('function hash(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return (\'00000000\'+h.toString(16)).slice(-8);}', '''function hash(s){let h=2166136261>>>0,g=0x9e3779b9>>>0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h=Math.imul(h^c,16777619)>>>0;g=Math.imul(g+c,2246822519)>>>0;}return ('00000000'+h.toString(16)).slice(-8)+('00000000'+g.toString(16)).slice(-8);}''')
start=s.index('function fingerprint(w){')
end=s.index('\nfunction median', start)
s=s[:start]+'''function fingerprint(w){
 const nations=(w.villages||[]).map(v=>[v.id,v.status,v.gold,v.food,v.wood,v.stone,
  [...(v.technologies||[])].sort(),[...(v.territory||[])].sort((a,b)=>a-b),
  (v.residents||[]).map(p=>[p.id,p.alive,p.age,p.health,p.hunger,p.happiness,p.job,p.assignment,p.homeTileId,p.workTileId,p.gold29,p.weapon33I,p.armor33I,p.cultureMix]),
  v.v32d3Housing,v.v32d3Expansion,v.aiPlan,v.frontierProjects,v.constructionProjects,v.landDevelopmentProjects,
  v.v33dFormations,v.fieldFormations,v.v33iEquipmentInventory]);
 const tiles=(w.map?.tiles||[]).map(t=>[t.id,t.ownerId,t.v33OccupierId,t.stocks,t.resources,t.buildings,t.buildingCondition,t.developedBuildSpace,t.settlementId]);
 return hash(JSON.stringify([w.year,w.ordinalDay(),nations,tiles,
  (w.wars||[]).map(x=>[x.id,x.status,x.endedCal,x.winnerSide,x.sideAIds,x.sideBIds]) ]));
}''' +s[end:]
s=s.replace('return s[Math.floor(s.length/2)]??null;', 'return s.length?(s[Math.floor((s.length-1)/2)]+s[Math.floor(s.length/2)])/2:null;')
s=s.replace('const startFingerprint=fingerprint(world),startRng=calls,startSnapshots=world.telemetry?.snapshots?.length||0;', '''const startFingerprint=fingerprint(world),startRng=calls,startSnapshots=world.telemetry?.snapshots?.length||0;
 let snapshotCalls=0,snapshotMs=0,snapshotReasons={};
 const oldSnapshot=win.VSim.Telemetry.prototype.snapshot;
 win.VSim.Telemetry.prototype.snapshot=function(...args){snapshotCalls++;const reason=String(args[1]||'AUTO');snapshotReasons[reason]=(snapshotReasons[reason]||0)+1;const st=win.performance.now();try{return oldSnapshot.apply(this,args);}finally{snapshotMs+=win.performance.now()-st;}};''')
s=s.replace('let sum=0;for(let d=0;d<days;d++){const st=win.performance.now();world.advanceOneDay();sum+=win.performance.now()-st;', 'let sum=0,daySamples=[];for(let d=0;d<days;d++){const st=win.performance.now();world.advanceOneDay();const elapsed=win.performance.now()-st;sum+=elapsed;daySamples.push(+elapsed.toFixed(3));')
s=s.replace('snapshotsAdded:(world.telemetry?.snapshots?.length||0)-startSnapshots,startYear:world.year', '''snapshotsAdded:(world.telemetry?.snapshots?.length||0)-startSnapshots,snapshotCalls,snapshotMs:+snapshotMs.toFixed(3),snapshotReasons,daySamplesMs:daySamples,
 simMedianDayMs:+median(daySamples).toFixed(3),simMaxDayMs:+Math.max(...daySamples).toFixed(3),startYear:world.year''')
s=s.replace("const valid=b.length===e.length&&b.every((r,i)=>r.initialFingerprint===e.find(q=>q.run===r.run)?.initialFingerprint&&r.finalFingerprint===e.find(q=>q.run===r.run)?.finalFingerprint&&r.rngCalls===e.find(q=>q.run===r.run)?.rngCalls);", "const valid=b.length===e.length&&b.every(r=>r.initialFingerprint===e.find(q=>q.run===r.run)?.initialFingerprint&&r.finalFingerprint===e.find(q=>q.run===r.run)?.finalFingerprint&&r.rngCalls===e.find(q=>q.run===r.run)?.rngCalls&&r.snapshotCalls===e.find(q=>q.run===r.run)?.snapshotCalls);")
s=s.replace('report.summary={baselineMedianMsDay:x,candidateMedianMsDay:y,improvementPercent:+((x-y)/x*100).toFixed(2),semanticAndRngMatch:valid};', '''report.summary={baselineMedianMsDay:+x.toFixed(3),candidateMedianMsDay:+y.toFixed(3),improvementPercent:+((x-y)/x*100).toFixed(2),semanticRngAndSnapshotMatch:valid,medianMethod:'exact midpoint average for even runs',fingerprintScope:'enhanced key world and settlement state; not exhaustive'};''')
s=s.replace('vilob-browser-local-ab-e02','vilob-browser-local-ab-e03').replace("'vilob-E02-61y-local-ab.json'","'vilob-E03-61y-local-ab.json'")
s=s.replace('게임 화면 렌더링과 Wall 시간은 측정하지 않습니다.', '게임 화면 렌더링과 Wall 시간은 측정하지 않습니다. Snapshot 호출 수·시각과 확대된 의미 상태 지문을 함께 기록합니다.')
p.write_text(s)
