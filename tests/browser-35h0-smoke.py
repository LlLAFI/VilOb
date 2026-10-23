from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for width,height in [(1440,900),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda err: errors.append(str(err)))
        page.set_content((ROOT/'index-standalone.html').read_text(encoding='utf8'),wait_until='load',timeout=120000)
        result=page.evaluate('''() => {const ui=window.villageObserver,w=ui.world;for(let i=0;i<8;i++)w.advanceOneDay();ui.view='world';ui.renderViews();const badge=document.getElementById('versionBadge');const diag=VSim.V035H0.routeReport(w);return {version:VSim.RELEASE_VERSION,badge:badge?.textContent,title:document.title,pop:w.activeVillages.reduce((a,v)=>a+v.population(),0),techs:VSim.TECH_ORDER.length,base:VSim.V035G1A.constants.BASE_DAILY,architect:VSim.V035G1A.constants.ARCH_MULT,report:diag.version,routeExport:!!document.getElementById('v035h0RoutingExport'),routeToggle:!!document.getElementById('v035h0RouteToggle')};}''')
        assert not errors,(width,errors[:8]);assert result['version']=='V0.35H0' and 'H0' in result['badge'],result
        assert result['techs']==43 and result['base']==0.8 and result['architect']==3,result
        assert result['routeExport'] and result['routeToggle'],result
        print('PASS',width,height,result)
        page.close()
    browser.close()
