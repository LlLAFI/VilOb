from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 for vp in ({'width':1440,'height':900},{'width':390,'height':844}):
  page=b.new_page(viewport=vp)
  errs=[];page.on('pageerror',lambda e: errs.append(str(e)))
  page.set_content((root/'dist/standalone/index.html').read_text(),wait_until='load',timeout=120000)
  page.wait_for_timeout(700)
  actual=page.evaluate('''() => ({version:window.VSim?.RELEASE_VERSION,world:!!window.villageObserver?.world, badge:document.getElementById('versionBadge')?.innerText, button:!!document.getElementById('exportLogisticsAuditG1Btn'), title:document.title, uiNation:document.getElementById('villageContent')?.innerText?.slice(0,450)})''')
  print('BROWSER',vp,actual,'ERRORS',errs[:4]);assert actual['version']=='V0.34G1' and actual['button'] and not errs
  # Run a few ticks on a real browser engine.
  page.evaluate('''() => { const w=window.villageObserver?.world;for(let i=0;i<5;i++)w.advanceOneDay();window.villageObserver?.render?.(); }''')
  page.wait_for_timeout(250)
  assert not errs, errs
  page.close()
 b.close()
