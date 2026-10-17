from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for mode in ['standalone','hosted']:
        for vp in [{'width':1440,'height':900},{'width':390,'height':844}]:
            page=browser.new_page(viewport=vp);errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            if mode=='standalone':page.set_content((ROOT/'index-standalone.html').read_text(encoding='utf8'),wait_until='load',timeout=120000)
            else:
                html=(ROOT/'index.html').read_text(encoding='utf8')
                # Inline the exact generated hosted assets; this environment blocks localhost/file navigation.
                html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+ (ROOT/m.group(1).split('?')[0]).read_text(encoding='utf8')+'</script>',html)
                html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (ROOT/m.group(1).split('?')[0]).read_text(encoding='utf8')+'</style>',html)
                page.set_content(html,wait_until='load',timeout=120000)
            out=page.evaluate('''() => {const ui=window.villageObserver,w=ui?.world;if(!ui)return {noUI:true};for(let i=0;i<6;i++)w.advanceOneDay();ui.view='village';ui.sub='settlements';ui.renderViews();const root=ui.q('villageContent');const result={version:VSim.RELEASE_VERSION,integrity:VSim.V034G4.verify(w),badge:document.getElementById('versionBadge')?.textContent,g2:!!VSim.V034G2,relayBtn:!!document.getElementById('exportG2RelayBtn'),pulses:VSim.V034G2A.summary(w).pulses,settlements:root.querySelectorAll('.v034g1b-settlement').length,resources:root.querySelectorAll('.v034g1b-resource').length};root.querySelector('[data-g1a-mode="tiles"]')?.click();result.tileRows=root.querySelectorAll('.v034g1b-tile-row').length;return result;}''')
            assert not errors,(mode,vp,errors[:3]);assert out['version']=='V0.34G4' and out['g2'] and out['relayBtn'] and out['pulses']>=2,(mode,vp,out)
            assert out['integrity']['ok'] and 'G4' in out['badge'],(mode,vp,out);assert out['settlements']>0 and out['resources']>=6 and out['tileRows']>0,(mode,vp,out)
            print('PASS',mode,vp,out)
            page.close()
    browser.close()
