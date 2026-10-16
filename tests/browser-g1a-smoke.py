from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for size in ({'width':1440,'height':900},{'width':390,'height':844}):
        page=browser.new_page(viewport=size)
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((ROOT/'index-standalone.html').read_text(encoding='utf8'),wait_until='load',timeout=120000)
        result=page.evaluate('''() => {const ui=window.villageObserver,w=ui.world;for(let i=0;i<7;i++)w.advanceOneDay();ui.view='village';ui.sub='settlements';ui.renderViews();const a={version:VSim.RELEASE_VERSION,sampled:VSim.V034G1A.summary(w).sampleDays,defaultCards:ui.q('villageContent').querySelectorAll('details.v034g1a-settlement-card').length,tabLabels:[...ui.q('villageContent').querySelectorAll('.v034g1a-switch button')].map(b=>b.textContent)};ui.q('villageContent').querySelector('[data-g1a-mode="tiles"]').click();a.tileCards=ui.q('villageContent').querySelectorAll('[data-v17-settlement]').length;a.tileMode=ui._g1aMode;ui.q('villageContent').querySelector('[data-g1a-mode="settlements"]').click();a.returnCards=ui.q('villageContent').querySelectorAll('details.v034g1a-settlement-card').length;return a;}''')
        assert not errors,(size,errors[:5]);assert result['version']=='V0.34G1A' and result['sampled']>0,result
        assert result['defaultCards']>0 and result['tileCards']>0 and result['returnCards']>0,result
        assert result['tileMode']=='tiles',result
        print('PASS',size,result)
        page.close()
    browser.close()
