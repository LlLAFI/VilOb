from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path('/mnt/data/vilob_e_rc2_work')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 page=b.new_page()
 errors=[]
 page.on('pageerror',lambda ex:errors.append(str(ex)))
 page.on('dialog',lambda d:d.accept())
 page.set_content((root/'tools/benchmark-local.html').read_text(encoding='utf-8'),wait_until='load')
 page.locator('#save').set_input_files('/mnt/data/e02-smoke-save.json')
 page.locator('#baseline').set_input_files(str(root/'tests/fixtures/v034D3B3B-index.html'))
 page.locator('#candidate').set_input_files(str(root/'index-standalone.html'))
 page.locator('#days').select_option('30')
 page.locator('#runs').select_option('1')
 page.locator('#start').click()
 page.wait_for_function("document.querySelector('#status').textContent.includes('완료') || document.querySelector('#status').textContent.includes('오류')",timeout=150000)
 print({'status':page.locator('#status').inner_text(),'output':page.locator('#output').inner_text()[:700],'rows':page.locator('#rows tr').count(),'errors':errors[:5]})
 if '오류' in page.locator('#status').inner_text(): raise Exception(page.locator('#output').inner_text())
 assert page.locator('#rows tr').count()==2
 assert 'semanticAndRngMatch' in page.locator('#output').inner_text()
 assert not errors
 b.close()
