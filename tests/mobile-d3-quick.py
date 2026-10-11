from pathlib import Path
from playwright.sync_api import sync_playwright
import json
s=(Path(__file__).parent.parent/'dist/standalone/index.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 pg=b.new_page(viewport={'width':390,'height':844});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.set_content(s,wait_until='domcontentloaded',timeout=16000)
 print(json.dumps(pg.evaluate('''() => ({version:window.VSim?.V034D3?.version,header:document.title,patch:window.VSim?.PATCH_NOTES?.[0]?.version,button:!!document.getElementById('exportSettlementEconomyD3Btn')})'''),ensure_ascii=False),flush=True)
 print('errors',errors,flush=True)
 assert not errors
 b.close()
