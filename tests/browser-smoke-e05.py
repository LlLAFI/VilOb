from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for mobile in (False,True):
  page=b.new_page(viewport={'width':390 if mobile else 1280,'height':820},is_mobile=mobile,has_touch=mobile)
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.set_content((root/'index-standalone.html').read_text(),wait_until='load',timeout=20000)
  info=page.evaluate("({version:window.VSim?.RELEASE_VERSION,world:!!window.VSim?.World,html:document.title})")
  print('mobile' if mobile else 'desktop',info,'errors',errors[:2],flush=True)
  assert info['version']=='V0.34E-rc5' and not errors
  page.close()
 b.close()
