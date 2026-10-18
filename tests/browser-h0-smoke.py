from pathlib import Path
from playwright.sync_api import sync_playwright
import re,json
ROOT=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 for mode in ('standalone','hosted'):
  for vp in ({'width':1440,'height':900},{'width':390,'height':844}):
   page=browser.new_page(viewport=vp)
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   html=(ROOT/('index-standalone.html' if mode=='standalone' else 'index.html')).read_text(encoding='utf-8')
   if mode=='hosted':
    html=re.sub(r'<script\b([^>]*?)src="([^"]+)"([^>]*)></script>',lambda m:'<script>'+ (ROOT/m.group(2).split('?')[0]).read_text(encoding='utf-8')+'</script>',html)
    html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (ROOT/m.group(1).split('?')[0]).read_text(encoding='utf-8')+'</style>',html)
   page.set_content(html,wait_until='load',timeout=120000)
   state=page.evaluate('''() => {
    const ui=window.villageObserver,ns=window.VSim;
    const report={version:ns.RELEASE_VERSION,tech:ns.TECH_ORDER.length,integrity:ns.V034H0.verify().ok,
      oldBanner:window.getComputedStyle(document.getElementById('runtimeStatus')).display,
      secondBanner:document.getElementById('g3aRuntimeIntegrity')?.style.display,
      mapFile:!!document.getElementById('mapImportInput'),newWorld:!!document.getElementById('newWorldBtn'),
      world:!!ui?.world,head:document.title};
    for(const view of ['map','village','tech','stats','world']){ui.view=view;ui.renderViews();}
    const sel=document.getElementById('statsScope'),opt=sel?.querySelector('option[value="settlement"]');
    report.statsCaption=opt?.textContent;
    report.f0=!!ns.V034F0;report.f1=!!ns.V034F1;
    report.saveVersion=ui.world.serialize().version;
    return report;
   }''')
   assert not errors,(mode,vp,errors[:5])
   assert state['version']=='V0.34H0' and state['tech']==43 and state['integrity'],state
   assert state['oldBanner']=='none' and state['secondBanner']=='none',state
   assert state['mapFile'] and state['newWorld'] and state['world'] and state['f0'] and state['f1'],state
   assert state['statsCaption']=='타일 (기존 장기 통계)' and state['saveVersion']=='V0.34H0',state
   state['mode']=mode;state['viewport']=vp;results.append(state)
   print('PASS',mode,vp,'version',state['version'],'stats',state['statsCaption'],'old-banner',state['oldBanner'])
   page.close()
 browser.close()
(ROOT/'TEST-H0-BROWSER.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
