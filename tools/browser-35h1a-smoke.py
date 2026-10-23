from playwright.sync_api import sync_playwright
from pathlib import Path
p=Path(__file__).resolve().parent.parent/'index-standalone.html'
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.on('dialog',lambda d:d.accept())
  page.set_content(p.read_text(),wait_until='load',timeout=90000)
  page.evaluate("() => {villageObserver.view='world'; villageObserver.renderViews()}")
  page.wait_for_timeout(350)
  before=page.evaluate('''() => ({version:window.VSim?.RELEASE_VERSION,badge:document.getElementById('versionBadge')?.textContent,ready:!!window.VSim?.V035H1A,button:!!document.querySelector('#v035h1aStart'),diagnostic:!!document.querySelector('[data-h1b]'),tech:window.VSim?.TECH_ORDER?.length})''')
  assert before['version']=='V0.35H1B',before
  assert before['ready'] and before['button'] and before['diagnostic'] and before['tech']==43,before
  page.evaluate("() => document.getElementById('v035h1aStart').click()")
  page.wait_for_timeout(500)
  after=page.evaluate('''() => ({fixed:window.villageObserver?.world?.v35h1a?.enabled,seed:window.villageObserver?.world?.v35h1a?.seed,cap:window.VSim?.V035G1A?.constants?.BASE_DAILY,arch:window.VSim?.V035G1A?.constants?.ARCH_MULT,person:window.villageObserver?.world?.allPeople?.length,rng:window.villageObserver?.world?.v35h1a?.rngState,hash:window.VSim?.V035H1A?.fingerprint(window.villageObserver?.world),profiles:window.villageObserver?.world?.villages?.map(v=>v.aiProfileId)})''')
  assert after['fixed'] and after['seed']=='perf-19x19-a-v1',after
  assert after['cap']==0.8 and after['arch']==3,after
  assert not errs,errs[:6]
  if width==1440:
   fixture=page.evaluate('''() => JSON.stringify(VSim.V035H1A.scenario(villageObserver.world))''')
   output=Path(__file__).resolve().parent.parent/'tests/fixtures/v035H1B-perf19x19A-initial.json'
   output.write_text(fixture)
   print('INITIAL_FIXTURE',output,output.stat().st_size)
  print('PASS',width,height,before,after,'jsErrors',len(errs))
  page.close()
 browser.close()
