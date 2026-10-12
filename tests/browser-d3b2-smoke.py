#!/usr/bin/env python3
"""PC/mobile smoke. Hosted JS/CSS asset bytes are inlined because this sandbox blocks browser URL navigation."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re
root=Path(__file__).resolve().parents[1]

def page_content(flavor):
 html=(root/'dist'/flavor/'index.html').read_text(encoding='utf-8')
 if flavor=='hosted':
  def asset(m):
   rel=m.group(1)
   body=(root/'dist'/'hosted'/rel).read_text(encoding='utf-8')
   return '<script>\n'+body+'\n</script>'
  def css(m):
   rel=m.group(1)
   body=(root/'dist'/'hosted'/rel).read_text(encoding='utf-8')
   return '<style>\n'+body+'\n</style>'
  html=re.sub(r'<script src="(assets/[^"]+)"></script>',asset,html)
  html=re.sub(r'<link rel="stylesheet" href="(assets/[^"]+)">',css,html)
  assert not re.search(r'<script\s+src=',html)
 return html

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for flavor in ['standalone','hosted']:
  html=page_content(flavor)
  for name,vp in [('desktop',{'width':1365,'height':850}),('mobile',{'width':390,'height':844})]:
   page=browser.new_page(viewport=vp,accept_downloads=True)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(html,wait_until='domcontentloaded',timeout=45000)
   page.wait_for_timeout(150)
   info=page.evaluate('''() => {
     const NS=window.VSim,ui=window.villageObserver,w=ui?.world;
     const before=document.getElementById('versionBadge')?.innerText;
     ui?.renderHeader?.();
     const after=document.getElementById('versionBadge')?.innerText;
     const save=w.serialize(),restored=NS.World.from(JSON.parse(JSON.stringify(save)));
     return {before,after,title:document.title,release:NS.RELEASE_VERSION,save:save.version,roundtrip:restored.serialize().version,telemetry:w.telemetry.toJSON(w).version,patch:NS.PATCH_NOTES[0].version,foodColumns:NS.V034D3A2.columns.length,snapshotCols:NS.V034D0.schema.v2Columns.length};
   }''')
   info['pageErrors']=errors[:8]
   print(flavor,name,json.dumps(info,ensure_ascii=False),flush=True)
   assert not info['pageErrors'],info['pageErrors']
   assert all('V0.34D3B2' in info[k] for k in ['before','after','title','release','save','roundtrip','telemetry','patch'])
   assert info['foodColumns']==48 and info['snapshotCols']==1683
   page.close()
 browser.close()
