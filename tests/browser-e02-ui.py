from playwright.sync_api import sync_playwright
from pathlib import Path
html=Path('/mnt/data/vilob_e_rc2_work/index-standalone.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for mode,size in [('PC',(1360,900)),('mobile',(390,844))]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]},is_mobile=(mode=='mobile'),has_touch=(mode=='mobile'))
  err=[];page.on('pageerror',lambda e:err.append(str(e)))
  page.set_content(html,wait_until='load',timeout=120000)
  page.wait_for_timeout(350)
  badge=page.evaluate('window.VSim?.RELEASE_VERSION')
  panel=page.locator('#v034eE01Panel').count()
  print({'mode':mode,'releaseVersion':badge,'developerPanel':panel,'JSerrors':err[:5]})
  assert badge=='V0.34E-rc2' and not err
  page.close()
 b.close()
