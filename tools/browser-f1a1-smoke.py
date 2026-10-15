from playwright.sync_api import sync_playwright
from pathlib import Path
import json
base=Path('/mnt/data/v034F1A1_work')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 for viewport in ({'width':1440,'height':900},{'width':390,'height':844}):
  p=b.new_page(viewport=viewport)
  errors=[]; p.on('pageerror',lambda e: errors.append(str(e)))
  p.set_content((base/'index-standalone.html').read_text(),wait_until='load',timeout=120000)
  p.wait_for_timeout(800)
  ver=p.evaluate('window.VSim?.RELEASE_VERSION')
  rendered=p.evaluate('Boolean(document.getElementById("versionBadge"))')
  print('BROWSER',viewport,ver,rendered,errors[:3]);assert ver=='V0.34F1A1' and not errors
  p.close()
 savep=base/'tests/fixtures/f1a1-browser-tmp-save.json'
 page=b.new_page()
 page.set_content((base/'index-F1-baseline.html').read_text(),wait_until='load',timeout=120000)
 save=page.evaluate('JSON.stringify(new VSim.World(19,19).serialize())')
 savep.write_text(save,encoding='utf-8')
 print('SAMPLE_SAVE_BYTES',savep.stat().st_size)
 page.close()
 page=b.new_page(viewport={'width':1400,'height':940},accept_downloads=True)
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.on('dialog',lambda d:d.accept())
 page.set_content((base/'benchmark-local.html').read_text(),wait_until='load',timeout=120000)
 page.set_input_files('#save',str(savep))
 page.set_input_files('#baseline',str(base/'index-F1-baseline.html'))
 page.set_input_files('#candidate',str(base/'index-standalone.html'))
 page.select_option('#days','30')
 page.click('#start')
 try:
  page.wait_for_function("!document.getElementById('export').disabled",timeout=200000)
  summary=json.loads(page.locator('#output').inner_text())
  print('LOCAL_AB_SUMMARY',json.dumps({k:summary.get(k) for k in ['baselineRestoreMatch','semanticParityRequired','semanticParityByRun','improvementPercent','baselineActualVersions','candidateActualVersions']},ensure_ascii=False))
  assert summary['semanticParityByRun'][0]['sameRng'] and summary['semanticParityByRun'][0]['sameFingerprint']
  assert summary['semanticParityByRun'][0]['samePopulation'] and summary['semanticParityRequired']
  with page.expect_download(timeout=10000) as info:page.click('#export')
  download=info.value
  saved=base/'tests/fixtures/f1a1-browser-verified-report.json'
  download.save_as(saved)
  test=json.loads(saved.read_text());print('REPORT_BYTES',saved.stat().st_size,'FILE',download.suggested_filename)
 except Exception as err:
  print('LOCAL_AB_FAIL',page.locator('#status').inner_text(),page.locator('#output').inner_text()[:2000],errs)
  raise
 finally:
  page.close();b.close();savep.unlink(missing_ok=True)
