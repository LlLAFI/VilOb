from pathlib import Path
import re
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--allow-file-access-from-files'])
 for distribution in ['standalone','hosted']:
  for width,height in [(1440,900),(390,844)]:
   page=browser.new_page(viewport={'width':width,'height':height})
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   if distribution=='standalone':
    page.set_content((root/'dist/standalone/index.html').read_text(),wait_until='load',timeout=120000)
   else:
    hosted_root=root/'dist/hosted'
    html=(hosted_root/'index.html').read_text()
    def asset_script(m):
     path=m.group(1).split('?')[0]; f=hosted_root/path
     assert f.is_file(),path
     return '<script>'+f.read_text()+'</script>'
    html=re.sub(r'<script\s+src="([^"]+)"\s*></script>',asset_script,html)
    def asset_style(m):
     path=m.group(1).split('?')[0];f=hosted_root/path
     assert f.is_file(),path
     return '<style>'+f.read_text()+'</style>'
    html=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>',asset_style,html)
    page.set_content(html,wait_until='load',timeout=120000)
   page.wait_for_timeout(800)
   o=page.evaluate('''() => {const ui=window.villageObserver,w=ui?.world,layer=document.getElementById('v15LayerSelect'),sel=document.getElementById('h1SettlementBoundary');return {version:window.VSim.RELEASE_VERSION,world:!!w,stats:document.getElementById('globalStats')?.innerText,controls:!!sel,mode:sel?.value,legacy:!!document.querySelector('#v15LayerSelect option[value="lifezone"]'),oldBoundary:!!document.getElementById('v34cBoundaryToggle'),groups:window.VSim.V034H1.geometryFor(w).length,tech:window.VSim.TECH_ORDER.length,integrity:window.VSim.V034H1.verify().ok,save:w.serialize().version,tile:document.getElementById('tileInspector')?.innerText.slice(0,280),tileDetails:document.querySelectorAll('#tileInspector details[data-h1-group]').length}}''')
   assert o['version']=='V0.34H1' and o['world'] and o['controls'] and o['groups']>0 and o['tech']==43 and o['integrity'] and not o['legacy'] and not o['oldBoundary'] and o['save']=='V0.34H1',o
   assert '정착지' in o['stats'] and '영토 타일' in o['stats'],o
   page.select_option('#h1SettlementBoundary','selected')
   assert page.evaluate("window.villageObserver.h1BoundaryMode")=='selected'
   page.select_option('#h1SettlementBoundary','off')
   assert page.evaluate("window.villageObserver.h1BoundaryMode")=='off'
   page.select_option('#h1SettlementBoundary','all')
   page.evaluate('''() => {const ui=window.villageObserver,w=ui.world;ui.world.selectedTileId=w.map.tiles.find(t=>t.ownerId!=null&&t.settlementId)?.id;ui.renderMapView();}''')
   current=page.evaluate('''() => ({basic:document.querySelector('.h1-tile-summary')?.innerText,groups:[...document.querySelectorAll('#tileInspector details[data-h1-group]')].map(x=>x.dataset.h1Group),stats:document.getElementById('globalStats')?.innerText,old:document.querySelector('#v15LayerSelect option[value="lifezone"]')?.value})''')
   assert current['basic'] and current['groups'] and not current['old'],current
   page.evaluate('''() => {const w=window.villageObserver.world;for(let i=0;i<4;i++)w.advanceOneDay();window.villageObserver.render();}''')
   page.wait_for_timeout(50)
   assert not errors,errors
   result={'distribution':distribution,'viewport':width,'initial':o,'selected':current,'errors':errors}
   results.append(result)
   print('PASS',distribution,width,'groups',o['groups'],'tile details',current['groups'],'errors',len(errors),flush=True)
   if distribution=='standalone' and width==1440:
    page.screenshot(path=str(root/'TEST-H1-MAP-1440.png'),full_page=False)
   page.close()
 browser.close()

(root/'docs/H1-BROWSER-RESULTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
