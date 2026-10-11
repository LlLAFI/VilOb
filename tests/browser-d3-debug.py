from pathlib import Path
from playwright.sync_api import sync_playwright
import time
html=(Path(__file__).parent.parent/'dist/standalone/index.html').read_text()
print('START',len(html),flush=True)
with sync_playwright() as p:
 print('driver ready',flush=True)
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 print('browser launched',flush=True)
 page=browser.new_page(viewport={'width':1280,'height':800})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 print('page ready',flush=True)
 start=time.monotonic()
 page.set_content(html,wait_until='domcontentloaded',timeout=30000)
 print('html loaded',round(time.monotonic()-start,2),errors[:3],flush=True)
 print('title',page.evaluate('document.title'),flush=True)
 print('NS',page.evaluate('''() => ({version:window.VSim?.V034D3?.version, world: window.villageObserver?.world?.villages?.length})'''),flush=True)
 browser.close()
