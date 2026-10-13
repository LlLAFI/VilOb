from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
standalone=(root/'index-standalone.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for device,viewport in [('PC',(1280,800)),('mobile',(390,844))]:
  page=browser.new_page(viewport={'width':viewport[0],'height':viewport[1]},is_mobile=device=='mobile',has_touch=device=='mobile')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(standalone,wait_until='load',timeout=120000)
  page.wait_for_timeout(300)
  page.locator('[data-view="world"]').first.click()
  page.wait_for_timeout(150)
  version=page.evaluate('window.VSim?.RELEASE_VERSION')
  assert version=='V0.34E-rc4',version
  assert page.locator('#v034eE01Panel').count()==1
  assert not errors,errors[:3]
  print({'device':device,'version':version,'panel':'PASS','errors':len(errors)})
  page.close()
 # A/B must start from the baseline-version save, not the candidate save.
 save_page=browser.new_page()
 save_page.set_content((root/'tests/fixtures/v034D3B3B-index.html').read_text(encoding='utf-8'),wait_until='load',timeout=120000)
 save=(save_page.evaluate('JSON.stringify(window.villageObserver.world.serialize())'))
 (root/'tests/fixtures/e04-browser-save.json').write_text(save,encoding='utf-8')
 save_page.close()
 page=browser.new_page()
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 page.set_content((root/'tools/benchmark-local.html').read_text(encoding='utf-8'),wait_until='load')
 page.locator('#save').set_input_files(str(root/'tests/fixtures/e04-browser-save.json'))
 page.locator('#baseline').set_input_files(str(root/'tests/fixtures/v034D3B3B-index.html'))
 page.locator('#candidate').set_input_files(str(root/'index-standalone.html'))
 page.locator('#days').select_option('30');page.locator('#runs').select_option('1')
 page.locator('#start').click()
 page.wait_for_function("document.querySelector('#status').textContent.includes('완료') || document.querySelector('#status').textContent.includes('오류')",timeout=180000)
 status=page.locator('#status').inner_text();output=page.locator('#output').inner_text()
 print({'benchmarkStatus':status,'output':output[:500],'results':page.locator('#rows tr').count(),'errors':errors[:2]})
 assert '오류' not in status,(status,output)
 assert page.locator('#rows tr').count()==2
 assert 'semanticRngAndSnapshotMatch' in output
 assert not errors
 import json
 with page.expect_download() as download_event:
  page.locator('#export').click()
 download=download_event.value
 local=root/'tests/fixtures/e04-browser-benchmark.json'
 download.save_as(str(local))
 result=json.loads(local.read_text(encoding='utf-8'))
 assert result['summary']['semanticRngAndSnapshotMatch']
 from statistics import median
 old=median([r['simMsDay'] for r in result['results'] if r['label']=='B3B'])
 new=median([r['simMsDay'] for r in result['results'] if r['label']=='E-rc4'])
 assert result['summary']['baselineMedianMsDay']==round(old,3)
 assert result['summary']['candidateMedianMsDay']==round(new,3)
 assert all('snapshotCalls' in r and 'daySamplesMs' in r for r in result['results'])
 print({'download':'PASS','evenRunsMedian':'PASS','snapshots':'PASS'})
 page.close()
 browser.close()
