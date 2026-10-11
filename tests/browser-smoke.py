#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import json,time
PAGES=[('desktop-in-memory','memory'),('mobile-in-memory','memory')]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,url in PAGES:
  page=browser.new_page(viewport=({'width':1365,'height':850} if name.startswith('desktop') else {'width':390,'height':844}),accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  from pathlib import Path
  html=Path("/mnt/data/village-observer-v034D0/index-standalone.html").read_text()
  page.evaluate("""() => { const data=new Map(); Object.defineProperty(window, 'localStorage', {configurable:true,value:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}}); }""")
  page.set_content(html,wait_until="load",timeout=120000)
  page.wait_for_timeout(1600)
  result=page.evaluate('''() => {
   const ns=window.VSim;
   const game=window.villageObserver;
   const w=new ns.World(19,19);
   const saved=w.serialize();
   const restored=ns.World.from(JSON.parse(JSON.stringify(saved)));
   const reserialized=restored.serialize();
   w.telemetry.snapshot(w,'MANUAL','baseline');
   const legacy=w.telemetry.snapshotsCSV();
   const v2=ns.V034D0.csvV2(legacy);
   const h=legacy.split('\\n')[0],v=v2.split('\\n')[0];
   const oldNames=ns.V034D0.schema.originalColumns;
   const v2Names=ns.V034D0.schema.v2Columns;
   const result={
    title:document.title,version:saved.version,roundtripVersion:reserialized.version,
    patch:ns.PATCH_NOTES?.[0]?.version,notes:ns.PATCH_NOTES?.length,
    csvV2Button:!!document.getElementById('exportLogCsvV2Btn'),
    legacyCSVHeaderLength:h.split(',').length,v2CSVHeaderLength:v.split(',').length,
    csvValueRowsIdentical:legacy.slice(legacy.indexOf('\\n'))===v2.slice(v2.indexOf('\\n')),
    csvChangedHeader:h!==v,
    schemaColumns:oldNames.length,schemaUnique:new Set(v2Names).size,
    csvLegacyValidate:ns.V032E14.validateCSV(legacy).ok,
    csvV2Validate:ns.V032E14.validateCSV(v2).ok,
    activeNations:w.activeVillages.length,
    saveKey:ns.V034D0.saveKey,
    selfWorld:!!game?.world,
   };
   ns.SaveSystem.save(w);result.loadOK=ns.SaveSystem.load()?.serialize()?.version==='V0.34D0';
   return result;
  }''')
  result['errors']=errors[:12];print(name,json.dumps(result,ensure_ascii=False))
  assert result['version']=='V0.34D0' and result['roundtripVersion']=='V0.34D0'
  assert result['patch']=='V0.34D0' and result['csvV2Button'] and result['loadOK']
  assert result['csvLegacyValidate'] and result['csvV2Validate']
  assert result['csvValueRowsIdentical'] and result['schemaUnique']==1683 and result['activeNations']==7
  assert not errors,errors
  # notes modal click smoke
  page.close()
 browser.close()
