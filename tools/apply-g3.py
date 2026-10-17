from pathlib import Path
base=Path('/mnt/data/v034g3-work')
p=base/'src/bootstrap/v034g2a.js';s=p.read_text()
def r(old,new):
 global s
 if s.count(old)!=1: raise Exception('bad anchor count '+str(s.count(old))+' '+old[:80])
 s=s.replace(old,new)
r("const receivers=state.filter(demandUrgent).sort((a,b)=>b.critical-a.critical||b.severe-a.severe||a.days-b.days||a.anchor-b.anchor);", "const receivers=state.filter(demandUrgent).sort((a,b)=>(NS.V034G3?.receiverRank?.(b)||0)-(NS.V034G3?.receiverRank?.(a)||0)||b.critical-a.critical||b.severe-a.severe||a.days-b.days||a.anchor-b.anchor);")
r("const floor=crisis?24:40, target=crisis?38:30;", "const basePlan={floor:crisis?24:40,target:crisis?38:30},plan=NS.V034G3?.reliefPlan?.(w,r,state,basePlan)||basePlan;\n   const {floor,target}=plan;")
r("refreshStock(w,v,d,s);\n     return d.stock-reserveAmount(d,floor)>=.5;", "refreshStock(w,v,d,s);\n     return (plan.mode!=='IMMINENT'||(d.severe===0&&d.critical===0))&&d.stock-reserveAmount(d,floor)>=.5;")
r("s.shipments++;s.quantity+=put;", "s.shipments++;s.quantity+=put;NS.V034G3?.onDelivery?.(w,plan.mode,put);")
r("reserveViolation:reserveShortfall>1e-6?1:0});", "reserveViolation:reserveShortfall>1e-6?1:0,reliefMode:plan.mode||'STANDARD',reliefFloorCycles:floor});")
r("model:'V0.34G2A_LIVE_SURPLUS'});", "model:NS.V034G3?'V0.34G3_CRISIS_PRIORITY':'V0.34G2A_LIVE_SURPLUS',reliefMode:plan.mode||'STANDARD',reliefFloorCycles:floor});")
r("'receiverCyclesAfter','reserveViolation'];", "'receiverCyclesAfter','reserveViolation','reliefMode','reliefFloorCycles'];")
p.write_text(s)

p=base/'src/bootstrap/v034d3b1.js';s=p.read_text();
old="function candidateExtension(v,w,c){\n // Potential road"
new="function candidateExtension(v,w,c){\n if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.candidateExtension(v,w,c);\n // Potential road"
assert s.count(old)==1;s=s.replace(old,new);p.write_text(s)

p=base/'tools/build.mjs';s=p.read_text()
def rep(old,new):
 global s
 if s.count(old)!=1:raise Exception('build anchor '+str(s.count(old))+' '+old[:70])
 s=s.replace(old,new)
rep("import {g2Transform} from './g2-transform.mjs';","import {g2Transform} from './g2-transform.mjs';\nimport {g3Transform} from './g3-transform.mjs';")
rep("const VERSION='V0.34G2A';","const VERSION='V0.34G3';")
rep("const g2a=get('src/bootstrap/v034g2a.js').toString('utf8');","const g2a=get('src/bootstrap/v034g2a.js').toString('utf8');\nconst g3=get('src/bootstrap/v034g3.js').toString('utf8');")
# 2 occurrences of function lists
assert s.count('g1Transform,g2Transform]')==2
s=s.replace('g1Transform,g2Transform]','g1Transform,g2Transform,g3Transform]')
rep("+g2a+'\\n</script>':", "+g2a+'\\n</script>\\n<script>\\n'+g3+'\\n</script>':")
rep('bootstrap/v034g2a.js"></script>\';', 'bootstrap/v034g2a.js"></script>\\n<script src="\'+assetPrefix+\'bootstrap/v034g3.js"></script>\';')
rep("fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g2a.js'),g2a);", "fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g2a.js'),g2a);\nfs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g3.js'),g3);")
p.write_text(s)

p=base/'package.json';s=p.read_text().replace('"version": "0.34.0-g2a"','"version": "0.34.0-g3"');import json
j=json.loads(s);j['scripts']['test:static']+=' && node tests/test-g3.cjs';j['scripts']['test:g3']='node tests/test-g3.cjs && node tests/test-g2a-reserve.cjs';p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
