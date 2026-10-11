#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
root=Path(__file__).resolve().parents[1]
html=(root/'dist/standalone/index.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,vp in [('desktop',{'width':1365,'height':850}),('mobile',{'width':390,'height':844})]:
  page=browser.new_page(viewport=vp,accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded',timeout=30000)
  page.wait_for_timeout(150)
  info=page.evaluate('''() => {
    const NS=window.VSim,w=window.villageObserver?.world||new NS.World(19,19);
    const a=NS.V034D3.audit(w),csv=NS.V034D3.csv(w),flow=NS.V034D3A.foodCSV(w),save=w.serialize();
    const loaded=NS.World.from(JSON.parse(JSON.stringify(save)));
    const ui=window.villageObserver, first=NS.V034D3.economyRows(w)[0];
    if(ui&&first){w.selectedTileId=first.tileIds[0];ui.renderTile();}
    const economyBtn=document.getElementById('exportSettlementEconomyD3Btn');
    return {title:document.title,version:save.version,roundtrip:loaded.serialize().version,
     auditErrors:a.errors,settlements:a.settlements,economyColumns:csv.split('\\n')[0].split(',').length,
     btn:!!economyBtn,foodButton:!!document.getElementById('exportSettlementFoodFlowD3ABtn'),foodColumns:flow.split('\\n')[0].split(',').length,inspector:!!document.querySelector('.v034d3-economy'),
     snapshotCols:NS.V034D0.schema.v2Columns.length,patch:NS.PATCH_NOTES?.[0]?.version};
  }''')
  info['pageErrors']=errors[:8]
  print(name,json.dumps(info,ensure_ascii=False),flush=True)
  assert info['version']=='V0.34D3A' and info['roundtrip']=='V0.34D3A'
  assert info['auditErrors']==[] and info['pageErrors']==[]
  assert info['economyColumns']==24 and info['snapshotCols']==1683
  assert info['foodButton'] and info['foodColumns']==45
  assert info['btn'] and info['inspector'] and info['patch']=='V0.34D3A'
  page.close()
 browser.close()
