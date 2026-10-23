"""H1B PC/mobile UI + opt-in diagnostics smoke, no save/upload required."""
from playwright.sync_api import sync_playwright
from pathlib import Path
html=(Path(__file__).resolve().parent.parent/'index-standalone.html').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
  page.set_content(html,wait_until='load',timeout=90000)
  page.evaluate("() => {villageObserver.view='world';villageObserver.renderViews()}")
  info=page.evaluate("""() => ({version:VSim.RELEASE_VERSION,badge:document.getElementById('versionBadge')?.textContent,hasStart:!!document.querySelector('#v035h1aStart'),hasModes:document.querySelectorAll('[data-h1b]').length,hasSnapshot:!!document.getElementById('v035h1b1SnapStart'),hasCheckpointDiag:!!document.getElementById('v035h1b1CheckpointDiag'),tech:VSim.TECH_ORDER.length})""")
  assert info['version']=='V0.35H1B1' and info['hasStart'] and info['hasModes']==4 and info['hasSnapshot'] and info['hasCheckpointDiag'] and info['tech']==43,info
  page.evaluate("() => document.querySelector('#v035h1aStart').click()")
  page.evaluate("""() => {document.querySelector('[data-h1b="BASELINE"]').click();for(let i=0;i<10;i++)villageObserver.world.advanceOneDay();document.getElementById('v035h1bStop').click();}""")
  result=page.evaluate("""() => ({r:VSim.V035H1B.report(),rng:villageObserver.world.v35h1a.rngState,year:villageObserver.world.year,people:villageObserver.world.allPeople.length,tech:VSim.TECH_ORDER.length})""")
  assert result['r']['observedDays']==10 and result['r']['mode']=='BASELINE' and result['r']['nonoverlap10DayBatches']['samples']==1,result
  page.evaluate("""() => {document.getElementById('v035h1b1SnapStart').click();for(let i=0;i<10;i++)villageObserver.world.advanceOneDay();document.getElementById('v035h1b1SnapStop').click();}""")
  snapshot=page.evaluate("""() => VSim.V035H1B1.snapshotReport()""")
  assert snapshot['format']=='vilob-v035h1b1-snapshot-v1' and snapshot['observedDays']==10 and snapshot['segments']['E4_AND_EARLIER']['calls']>0,snapshot
  assert not errors,errors[:5]
  print('PASS',width,height,info,'days',result['r']['observedDays'],'rng',result['rng'],'jsErrors',len(errors))
  page.close()
 browser.close()
