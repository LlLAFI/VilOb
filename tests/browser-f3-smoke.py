from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for viewport in [{'width':1440,'height':900},{'width':390,'height':844}]:
        page=browser.new_page(viewport=viewport)
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((root/'index-standalone.html').read_text(encoding='utf-8'),wait_until='load',timeout=120000)
        page.wait_for_timeout(350)
        data=page.evaluate('''() => ({version:VSim.RELEASE_VERSION, f2:!!VSim.V034F2?.enabled, f3:!!VSim.V034F3?.enabled, hasWorld:!!window.villageObserver?.world})''')
        assert data['version']=='V0.34F3' and data['f2'] and data['f3'] and not errors,(viewport,data,errors[:4])
        print('BROWSER',viewport,data,'errors',len(errors))
        page.close()
    browser.close()
