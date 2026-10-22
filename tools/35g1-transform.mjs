/* V0.35G1 build-only construction abstraction. Protected C1H blocks stay byte-identical. */
function seg(s,start,end,body,label){const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0||s.indexOf(start,a+1)!==-1)throw Error('35G1 anchor '+label);return s.slice(0,a)+body+s.slice(b);}
export function g351Transform(file,source){let s=source;
if(file==='src/legacy/036.js'){
 s=seg(s,'function prepareConstructionTasks25(v,w){','const startConstruction24=',`function prepareConstructionTasks25(v,w){
  clearCycleTasks25(v);convertAllProjects25(v);NS.V035G1.prepare(v,w);
 }
`, 'schedule');
 // Replace all direct Person-backed construction work; actual buildings and completion paths remain V25.
 const old='const workers=taskWorkers25(this,\'construction\',p.id);if(!workers.length){p.stallDays=(p.stallDays||0)+1;continue;}let eff=0;for(const q of workers){s.construction+=3;const e=3*constructionEff25(q);eff+=e;s.constructionEffective+=e;}';
 if(!s.includes(old))throw Error('35G1 new build work anchor');
 s=s.replace(old,"const eff=NS.V035G1.work(this,w,p,'construction');");
 const aux=/const p=convertProject25\(v,(up|sp)\[i\],\1\[i\]\.to\),workers=taskWorkers25\(v,'(upgrade|specialization)',p\.id\),t=w\.map\.get\(p\.tileId\);/g;
 let found=0;s=s.replace(aux,(_m,array,kind)=>{found++;return `const p=convertProject25(v,${array}[i],${array}[i].to),t=w.map.get(p.tileId);`;});if(found!==2)throw Error('35G1 aux workers header '+found);
 const effort='let eff=0;for(const q of workers){const s=ensureLaborStats25(v);s.construction+=3;const e=3*constructionEff25(q);s.constructionEffective+=e;eff+=e;}';
 const pieces=s.split(effort);if(pieces.length!==3)throw Error('35G1 aux eff anchors '+(pieces.length-1));
 s=pieces[0]+"const eff=NS.V035G1.work(v,w,p,'upgrade');"+pieces[1]+"const eff=NS.V035G1.work(v,w,p,'specialization');"+pieces[2];
 // Maintenance mission planners must not steal an architect who is already in transit/on site.
 const localPlanner="if(p.alive&&p.assignment!=='PIONEER'&&p.age>=13)";
 if(!s.includes(localPlanner))throw Error('35G1 maintenance local anchor');
 s=s.replace(localPlanner,"if(p.alive&&p.assignment!=='PIONEER'&&p.age>=13&&!p.v35g1Dispatch)");
 const remotePlanner="if(!p.alive||p.age<16||p.assignment==='PIONEER'||p.homeTileId===o.tileId)continue;";
 if(s.split(remotePlanner).length!==3)throw Error('35G1 maintenance remote anchor');
 s=s.replaceAll(remotePlanner,"if(!p.alive||p.age<16||p.assignment==='PIONEER'||p.homeTileId===o.tileId||p.v35g1Dispatch)continue;");
 // Avoid historical V25 real-person label in new events; the G1 effective units are virtual.
 s=s.replaceAll("laborModel:'V0.25_ADULT_DAY'", "laborModel:'V0.35G1_ABSTRACT_CONSTRUCTION'");
}
if(file==='src/legacy/025.js'){
 const start='function progressLandDevelopment(v,w){',end='/* ---------- actual building replacement projects ---------- */';
 const a=s.indexOf(start),b=s.indexOf(end,a);if(a<0||b<0)throw Error('35G1 land section');let part=s.slice(a,b);
 const from='const workers=v.tileResidents(p.tileId)';const anchor='if(p.progress>=p.duration)';const i=part.indexOf(from),j=part.indexOf(anchor,i);
 if(i<0||j<0)throw Error('35G1 land worker anchors');
 part=part.slice(0,i)+'p.progress+=NS.V035G1.landWork(v,w,p);'+part.slice(j);
 s=s.slice(0,a)+part+s.slice(b);
}
return s;}
