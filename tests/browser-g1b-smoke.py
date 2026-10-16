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
        result=page.evaluate('''() => {const ui=window.villageObserver,w=ui.world;for(let i=0;i<6;i++)w.advanceOneDay();ui.view='village';ui.sub='settlements';ui.renderViews();const root=ui.q('villageContent');const a={version:VSim.RELEASE_VERSION,pulses:VSim.V034G1A.summary(w).sampleDays,defaultCards:root.querySelectorAll('.v034g1b-settlement').length,resources:root.querySelectorAll('.v034g1b-resource').length,unit:root.querySelector('.v034g1b-reserve')?.textContent,tabLabels:[...root.querySelectorAll('.v034g1a-switch button')].map(b=>b.textContent),mapStart:ui.view};root.querySelector('[data-g1a-mode="tiles"]').click();a.tileRows=root.querySelectorAll('.v034g1b-tile-row').length;a.oldDetailedTileCards=root.querySelectorAll('.settlement-card').length;root.querySelector('[data-g1b-tile]')?.click();a.physicalRows=root.querySelectorAll('.v034g1b-tile-detail').length;const sel=ui.world.selectedTileId;root.querySelector('[data-g1a-mode="settlements"]').click();a.returnCards=root.querySelectorAll('.v034g1b-settlement').length;root.querySelector('[data-g1b-expand]')?.click();a.memberRows=root.querySelectorAll('.v034g1b-member-list').length;root.querySelector('[data-g1b-member]')?.click();a.memberGoesTiles=ui._g1aMode==='tiles';a.memberDetail=root.querySelectorAll('.v034g1b-tile-detail').length;return a;}''')
        assert not errors,(size,errors[:5]);assert result['version']=='V0.34G1B' and result['pulses']>0,result
        assert result['defaultCards']>0 and result['resources']>=6 and '작업주기' in result['unit'],result
        assert result['tileRows']>0 and result['oldDetailedTileCards']==0 and result['physicalRows']==1,result
        assert result['returnCards']>0 and result['memberRows']>0 and result['memberGoesTiles'] and result['memberDetail']==1,result
        print('PASS',size,result)
        page.screenshot(path=str(ROOT/('TEST-G1B-UI-%s.png'%size['width'])),full_page=False)
        page.close()
    browser.close()
