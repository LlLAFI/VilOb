from playwright.sync_api import sync_playwright
from pathlib import Path
import json
html=Path('/mnt/data/v034F1_work/dist/standalone/index.html').read_text()
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
  for mode,width,height in [('PC',1440,900),('mobile',390,844)]:
    page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(html,wait_until='load',timeout=60000)
    page.wait_for_timeout(700)
    got=page.evaluate('''() => ({version: window.VSim?.RELEASE_VERSION, f1:!!window.VSim?.V034F1, f0:!!window.VSim?.V034F0, panel:!!document.getElementById('v034f1Panel'), labels:document.body.textContent.includes('F1 · 식량 위험')})''')
    assert got['version']=='V0.34F1' and got['f1'] and got['f0'],got
    assert got['panel'] and got['labels'],got
    assert not errors,errors[:4]
    print(json.dumps({'mode':mode,'ok':True,'errors':len(errors),**got},ensure_ascii=False))
    page.close()
  browser.close()
