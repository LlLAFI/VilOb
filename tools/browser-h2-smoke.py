from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re,os
root=Path(__file__).resolve().parents[1]
out=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--allow-file-access-from-files'])
 for flavor in [os.environ['H2_FLAVOR']] if os.environ.get('H2_FLAVOR') else ['standalone','hosted']:
  for width,height in [(390,844)] if os.environ.get('H2_MOBILE_ONLY') else [(1440,900),(390,844)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   if flavor=='standalone':html=(root/'dist/standalone/index.html').read_text()
   else:
    a=root/'dist/hosted';html=(a/'index.html').read_text()
    html=re.sub(r'<script\s+src="([^"]+)"\s*></script>',lambda m:'<script>'+ (a/m.group(1).split('?')[0]).read_text()+'</script>',html)
    html=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>',lambda m:'<style>'+ (a/m.group(1).split('?')[0]).read_text()+'</style>',html)
   page.set_content(html,wait_until='load',timeout=120000)
   assert page.evaluate('VSim.RELEASE_VERSION')=='V0.34H2'
   assert page.evaluate('VSim.V034G5.verify(villageObserver.world).ok')
   results={}
   for tab in ['overview','residents','economy','trade','social','military','tech']:
    data=page.evaluate('''(tab)=>{const u=villageObserver;u.view='village';u.sub=tab;u.renderViews();u.renderVillageContent();const root=document.getElementById('villageContent');return {exists:!!root.querySelector('.h2-root'),legacy:!!root.querySelector('.h2-original'),text:root.querySelector('.h2-root')?.innerText?.slice(0,140),fields:root.querySelectorAll('[data-h2-field]').length}}''',tab)
    assert data['exists'] and data['legacy'] and data['text'],(flavor,width,tab,data)
    results[tab]=data
    if tab=='overview':
     assert page.locator('.h2-hero').count()==1
    if tab=='residents':
     page.locator('[data-h2-field="search"]').fill('zzzz___noname')
     assert '현재목록0명' in re.sub(r'\s+','',page.locator('.h2-root').inner_text())
     page.locator('[data-h2-field="search"]').fill('')
     assert page.locator('.h2-people details').count()>0
    if tab=='social':
     page.select_option('[data-h2-field="socialScope"]',label='세계')
     val=page.locator('.h2-root').inner_text()
     assert '문화 구성' in val
     options=page.locator('[data-h2-field="socialScope"] option').all_text_contents()
     if len(options)>2:page.select_option('[data-h2-field="socialScope"]',index=2)
    if tab=='trade':
     page.select_option('[data-h2-field="direction"]','import')
     assert page.locator('[data-h2-field="direction"]').input_value()=='import'
    if tab=='tech':assert '43' in page.locator('.h2-root').inner_text()
   # Preserve G1B settlement page, H1 borders, original game engine and 4-day smoke
   page.evaluate('''()=>{const u=villageObserver;u.sub='settlements';u.renderVillageContent();}''')
   assert page.locator('.v034g1b-root').count()==1
   assert page.locator('.h2-root').count()==0
   saved=page.evaluate('''()=>{const w=villageObserver.world;for(let i=0;i<4;i++)w.advanceOneDay();return {version:w.serialize().version,tech:VSim.TECH_ORDER.length,groups:VSim.V034H1.geometryFor(w).length,integrity:VSim.V034G5.verify(w).ok};}''')
   assert saved['version']=='V0.34H2' and saved['tech']==43 and saved['integrity'] and saved['groups']>0,saved
   assert not errors,(flavor,width,errors)
   out.append({'distribution':flavor,'width':width,'tabs':results,'world':saved,'errors':errors})
   print('PASS',flavor,width,'tabs',len(results),'groups',saved['groups'],'errors',len(errors),flush=True)
   if width==1440 and flavor=='standalone':
    page.evaluate('''()=>{const u=villageObserver;u.view='village';u.sub='overview';u.renderViews();u.renderVillageContent();}''')
    page.screenshot(path=str(root/'TEST-H2-NATION-1440.png'))
   page.close()
 browser.close()
(root/'docs/H2-BROWSER-RESULTS.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
