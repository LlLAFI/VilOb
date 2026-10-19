from pathlib import Path
import re, json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for flavor in ('standalone','hosted'):
  html=(root/'dist/standalone/index.html').read_text() if flavor=='standalone' else (root/'dist/hosted/index.html').read_text()
  if flavor=='hosted':
   basedir=root/'dist/hosted'
   html=re.sub(r'<script\s+src="([^"]+)"\s*></script>',lambda m:'<script>'+(basedir/m.group(1).split('?')[0]).read_text()+'</script>',html)
   html=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>',lambda m:'<style>'+(basedir/m.group(1).split('?')[0]).read_text()+'</style>',html)
  for width,height in ((1440,900),(390,844)):
   p=browser.new_page(viewport={'width':width,'height':height});errors=[]
   p.on('pageerror',lambda e:errors.append(str(e)))
   p.set_content(html,wait_until='load',timeout=90000)
   startup=p.evaluate('''() => {const NS=VSim,ui=villageObserver,w=ui.world;return {release:NS.RELEASE_VERSION,serialize:w.serialize().version,tech:NS.TECH_ORDER.length,registry:NS.V034C.inspect(w).ok,panels:['v034f0PerfPanel','v034f1Panel'].map(id=>[id,document.getElementById(id)?.parentElement?.id,typeof document.getElementById(id)?.querySelector('button')?.onclick]),h1:!!document.getElementById('h1SettlementBoundary'),h2Views:NS.V034H2.views.length,cHistory:!!document.getElementById('v33cEngagementHistoryPanel')}}''')
   assert startup['release']=='V0.34H4' and startup['serialize']=='V0.34H4',startup
   assert startup['tech']==43 and startup['registry'] and startup['h1'] and startup['h2Views']==7,startup
   assert all(pn[1]=='h3Observer' and pn[2]=='function' for pn in startup['panels']),startup
   assert not startup['cHistory'],startup
   p.evaluate("() => {villageObserver.view='world';villageObserver.renderViews()}")
   world=p.evaluate('''() => {let w=villageObserver.world;return{overview:!!document.getElementById('h3WorldMetrics')?.textContent,rows:document.querySelectorAll('#h3CompareTable tbody tr').length,observer:document.getElementById('v034f0PerfPanel')?.parentElement?.id,e05:document.getElementById('v034eE01Panel')?.parentElement?.id,chronicle:document.querySelectorAll('#h3ChronicleList .h3-history-item').length}}''')
   assert world['overview'] and world['rows']==7 and world['observer']=='h3Observer' and world['e05']=='h3Diagnostics',world
   p.select_option('#h3CompareSort','tech')
   p.locator('#h3CompareExtinct').check()
   p.select_option('#h3ChronicleFilter','tech')
   p.evaluate("() => {document.getElementById('h3Advanced').open=true;document.getElementById('h3Diagnostics').open=true;}")
   p.locator('#h3AuditRun').click()
   audit=p.locator('#h3AuditOutput').inner_text()
   assert '검사 시점' in audit and '무결성 오류 0건' in audit, audit
   assert p.evaluate('''() => VSim.V034H4.audit(villageObserver.world).storageSummary.unexplained >= 0''')
   assert p.locator('#h3CompareTable tbody tr').count()==7
   p.evaluate('''() => {let w=villageObserver.world,A=w.activeVillages[0],B=w.activeVillages[1],id=[...A.territory][0]; w.v33War.wars.push({id:'test-h3-war',attackerId:A.id,defenderId:B.id,sideAIds:[A.id],sideBIds:[B.id],status:'ENDED',startCal:5,endCal:45,winnerSide:'A',casualties:{},wounded:{},battles:2,engagements33C:[{tileId:id,status:'ENDED',startCal:6,endCal:12}],warGoal33F:{targetTileIds:[id]},peaceSettlement33F:{outcome:'GOLD_ONLY',cededTiles:[]}});villageObserver.view='stats';villageObserver.render();}''')
   war=p.evaluate('''() =>({warCards:document.querySelectorAll('#v33aWarHistoryPanel .v33a-warcard').length,siteButtons:document.querySelectorAll('.h3-site-links button').length,oldC:!!document.getElementById('v33cEngagementHistoryPanel')})''')
   assert war['warCards'] and war['siteButtons'] and not war['oldC'],war
   target=int(p.locator('.h3-site-links button').first.get_attribute('data-h3-war-tile'))
   p.locator('.h3-site-links button').first.click()
   actual=p.evaluate('''() => ({view:villageObserver.view,selected:villageObserver.world.selectedTileId,map:document.getElementById('view-map').classList.contains('active')})''')
   assert actual['view']=='map' and actual['selected']==target and actual['map'],actual
   integrity=p.evaluate('''() => {const ui=villageObserver,w=ui.world;w.telemetry.snapshots.push({global:{settlementRegistryErrors34B:2}});ui.renderHeader();const el=document.getElementById('h3IntegrityAlert');const shown=!el.hidden && el.textContent.includes('오류');w.telemetry.snapshots.pop();ui.renderHeader();return{shown,cleared:el.hidden}}''')
   assert integrity=={'shown':True,'cleared':True},integrity
   assert not errors,(flavor,width,errors)
   results.append({'flavor':flavor,'viewport':width,'startup':startup,'world':world,'war':war,'mapJump':actual,'integrity':integrity,'pageErrors':errors})
   print('PASS',flavor,width,'H4 panels/filters/F0-F1/War map/Alerts/43 tech',flush=True)
   p.close()
 browser.close()
(root/'docs/H4-BROWSER-RESULTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
