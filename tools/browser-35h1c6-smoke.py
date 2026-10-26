from playwright.sync_api import sync_playwright
from pathlib import Path
from time import monotonic
p=Path(__file__).resolve().parent.parent/'index-standalone.html'
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('dialog',lambda d:d.accept())
  t=monotonic()
  page.set_content(p.read_text(),wait_until='load',timeout=85000)
  outcome=page.evaluate('''() => ({version:window.VSim?.RELEASE_VERSION,badge:document.getElementById('versionBadge')?.textContent,ready:!!window.VSim?.V035H1C6,stageCount:window.VSim?.V035H1C6?.stageNames?.length,tech:window.VSim?.TECH_ORDER?.length,diagnostic:!!window.VSim?.V035H1C1,hasWorld:!!window.villageObserver?.world,htmlTitle:document.title})''')
  assert outcome['version']=='V0.35H1C6',outcome
  assert outcome['badge']=='Village Observer · V0.35H1C6',outcome
  assert outcome['ready'] and outcome['stageCount']>=30 and outcome['tech']==43 and outcome['diagnostic'],outcome
  assert not errors,errors[:10]
  print({'status':'PASS','viewport':(width,height),'seconds':round(monotonic()-t,2),'state':outcome,'errors':errors},flush=True)
  page.close()
 browser.close()
