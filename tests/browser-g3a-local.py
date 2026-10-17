from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 page=b.new_page(viewport={'width':1366,'height':850},accept_downloads=True)
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_content((ROOT/'local-validator-g3a.html').read_text(encoding='utf-8'),wait_until='domcontentloaded',timeout=90000)
 page.wait_for_function("!document.querySelector('#run').disabled",timeout=90000)
 before=page.evaluate('''() => {const f=document.getElementById('engine').contentWindow;return {title:f.document.title,badge:f.document.getElementById('versionBadge')?.textContent,integrity:f.VSim.V034G3A.verify(f.villageObserver.world),version:f.VSim.RELEASE_VERSION,save:JSON.stringify(f.villageObserver.world.serialize())};}''')
 assert before['version']=='V0.34G3A' and before['integrity']['ok'] and 'G3A' in before['badge'],before
 import json
 obj=json.loads(before.pop('save')); obj['version']='V0.34G3'; obj.pop('v034g3a',None); save=json.dumps(obj,ensure_ascii=False)
 page.locator('#file').set_input_files({'name':'v034g3a-small-save.json','mimeType':'application/json','buffer':save.encode()})
 page.locator('#days').select_option('30')
 page.locator('#run').click()
 page.wait_for_function('!document.querySelector("#json").disabled',timeout=120000)
 out=page.evaluate('''() => ({ready:!!result,days:result?.completedDays,points:result?.checkpoints?.length,errors:result?.errors,initialIntegrity:result?.checkpoints[0]?.integrity,final:result?.checkpoints.at(-1)?.world,p:document.title})''')
 assert not errs,errs
 assert out['ready'] and out['days']==30 and out['points']==2 and out['initialIntegrity']['ok'],out
 with page.expect_download(timeout=20000) as dl:page.locator('#json').click()
 assert dl.value.suggested_filename.endswith('.json')
 with page.expect_download(timeout=20000) as dl:page.locator('#csv').click()
 assert dl.value.suggested_filename.endswith('.csv')
 print('PASS G3A LOCAL VALIDATOR',before,out)
 b.close()
