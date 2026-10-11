#!/usr/bin/env python3
"""Real Chromium smoke: in-memory standalone only; local HTTP is blocked in this environment."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
html=(root/'dist/standalone/index.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,vp in [('desktop',{'width':1365,'height':850}),('mobile',{'width':390,'height':844})]:
  page=browser.new_page(viewport=vp,accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate("""() => {const data=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}})}""")
  page.set_content(html,wait_until='load',timeout=120000)
  page.wait_for_timeout(850)
  info=page.evaluate('''() => {
    const NS=window.VSim,w=window.villageObserver?.world||new NS.World(19,19);
    const a=NS.V034D2,rows=a.contextAll(w),audit=NS.V034D2A.audit(w),csv=a.csv(w);
    const save=w.serialize(),loaded=NS.World.from(JSON.parse(JSON.stringify(save)));
    NS.SaveSystem.save(w);
    const first=rows[0],ui=window.villageObserver;
    if(ui&&first){w.selectedTileId=first.tileIds[0];ui.renderTile();}
    const tile=document.querySelector('.v034d2-housing');
    const labour=document.querySelector('.v034d1a-labor');
    const btn=document.getElementById('exportSettlementHousingD2Btn');
    return {title:document.title,version:save.version,roundtrip:loaded.serialize().version,
     active:rows.length,errors:audit.errors,warnings:audit.warnings,columns:csv.split('\\n')[0].split(',').length,
     header:csv.split('\\n')[0].split(',').length,button:!!btn,buttonText:btn?.textContent,
     inspector:!!tile,labour:!!labour,labourText:labour?.textContent.slice(0,95),
     patch: NS.PATCH_NOTES?.[0]?.version,loadedSave:NS.SaveSystem.load()?.serialize().version,
     csvV2Unique:NS.V034D0.schema.v2Columns.length===1683&&new Set(NS.V034D0.schema.v2Columns).size===1683};
  }''')
  info['pageErrors']=errors[:10]
  print(name,json.dumps(info,ensure_ascii=False))
  assert info['version']=='V0.34D3A' and info['roundtrip']=='V0.34D3A'
  assert info['loadedSave']=='V0.34D3A' and info['patch']=='V0.34D3A'
  assert info['button'] and info['columns']==11 and info['header']==11
  assert info['inspector'] and info['labour'] and info['csvV2Unique']
  assert info['errors']==[] and info['pageErrors']==[]
  page.close()
 browser.close()
