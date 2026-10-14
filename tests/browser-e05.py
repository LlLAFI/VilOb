from playwright.sync_api import sync_playwright
from pathlib import Path
import json, subprocess, time, socket
root=Path(__file__).resolve().parent.parent
server=subprocess.Popen(['python','-m','http.server','18765','--bind','127.0.0.1','--directory',str(root)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
try:
 with sync_playwright() as p:

     browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
     page=browser.new_page(accept_downloads=True)
     errors=[]
     page.on('pageerror',lambda e:errors.append(str(e)))
     page.set_content((root/'tools/benchmark-local.html').read_text(),wait_until='load')
     page.locator('#save').set_input_files(str(root/'tests/fixtures/e04-browser-save.json'))
     source=str(root/'index-standalone.html')
     page.locator('#baseline').set_input_files(source)
     page.locator('#candidate').set_input_files(source)
     page.locator('#warmup').select_option('6')
     page.locator('#days').select_option('30')
     page.locator('#runs').select_option('1')
     page.once('dialog',lambda d:d.accept())
     page.locator('#start').click()
     page.wait_for_function('!document.querySelector("#export").disabled || document.querySelector("#status").textContent.includes("오류")', timeout=120000)
     output=page.locator('#output').inner_text()
     print('STATUS',page.locator('#status').inner_text())
     print('SUMMARY',output[:1600]);print('ERRORS',errors[:4])
     if errors: raise RuntimeError(errors)
     d=json.loads(output)
     assert d['semanticRngAndSnapshotMatch'],d
     # launch game in desktop and mobile viewports
     for mobile in (False,True):
         p2=browser.new_page(viewport={'width':390 if mobile else 1280,'height':820},is_mobile=mobile,has_touch=mobile)
         ee=[];p2.on('pageerror',lambda e:ee.append(str(e)))
         p2.set_content((root/'index-standalone.html').read_text(),wait_until='load')
         p2.wait_for_timeout(1200)
         name=p2.evaluate('window.VSim?.RELEASE_VERSION')
         print('GAME','mobile' if mobile else 'PC',name,'errors',ee[:2]);assert name=='V0.34E-rc5' and not ee
         p2.close()
     browser.close()
finally:
 server.terminate()
 server.wait(timeout=5)
