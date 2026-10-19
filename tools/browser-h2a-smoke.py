from pathlib import Path
import re, json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for flavor in ['standalone','hosted']:
  src=(root/'dist/standalone/index.html').read_text() if flavor=='standalone' else (root/'dist/hosted/index.html').read_text()
  if flavor=='hosted':
   basedir=root/'dist/hosted'
   def js(m):return '<script>'+ (basedir/m.group(1).split('?')[0]).read_text()+'</script>'
   def css(m):return '<style>'+ (basedir/m.group(1).split('?')[0]).read_text()+'</style>'
   src=re.sub(r'<script\s+src="([^"]+)"\s*></script>',js,src)
   src=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>',css,src)
  for width,height in [(1440,900),(390,844)]:
   p=browser.new_page(viewport={'width':width,'height':height});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.set_content(src,wait_until='load',timeout=90000)
   p.wait_for_timeout(200)
   observed=p.evaluate('''() => {const NS=window.VSim,ui=window.villageObserver;return {version:NS.RELEASE_VERSION,loaded:!!ui?.world,verify:NS.V034H2A.verify().ok,tech:NS.TECH_ORDER.length,save:ui?.world?.serialize().version,mapBoundary:!!document.querySelector('#h1SettlementBoundary'),nationViews:NS.V034H2.views.length,ghostAudit:NS.V034C.inspect(ui.world).ok};}''')
   assert observed['version']=='V0.34H2A' and observed['save']=='V0.34H2A' and observed['loaded'] and observed['verify'] and observed['tech']==43 and observed['mapBoundary'] and observed['nationViews']==7 and observed['ghostAudit'], observed
   p.select_option('#h1SettlementBoundary','selected')
   assert p.evaluate('window.villageObserver.h1BoundaryMode')=='selected'
   assert not errors,errors
   results.append({'flavor':flavor,'width':width,'height':height,'result':observed,'pageErrors':errors})
   print('PASS',flavor,width,'H2A/43 tech/7 nation views/Settlement audit',flush=True)
   p.close()
 browser.close()
(root/'docs/H2A-BROWSER-RESULTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
