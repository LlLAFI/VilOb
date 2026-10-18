from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 for mode in ['standalone','hosted']:
  for vp in [{'width':1440,'height':900},{'width':390,'height':844}]:
   page=b.new_page(viewport=vp)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   if mode=='standalone': html=(ROOT/'index-standalone.html').read_text(encoding='utf-8')
   else:
    html=(ROOT/'index.html').read_text(encoding='utf-8')
    html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+ (ROOT/m.group(1).split('?')[0]).read_text(encoding='utf-8')+'</script>',html)
    html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (ROOT/m.group(1).split('?')[0]).read_text(encoding='utf-8')+'</style>',html)
   page.set_content(html,wait_until='load',timeout=120000)
   init=page.evaluate('''() => {
    const ui=window.villageObserver;ui.view='stats';ui.renderViews();
    const sel=document.querySelector('#statsScope'),opt=sel.querySelector('option[value="settlement"]');
    if(!sel||!opt)throw Error('missing stats control');
    const observer=new MutationObserver(records=>{window._g4a1StatsMutations+=(records.length);});window._g4a1StatsMutations=0;
    observer.observe(sel,{attributes:true,childList:true,characterData:true,subtree:true});sel.focus();
    return {version:VSim.RELEASE_VERSION,scope:sel.value,caption:opt.textContent,integrity:VSim.V034G5.verify(ui.world)};
   }''')
   assert init['version']=='V0.34G5' and init['integrity']['ok'], (mode,vp,init)
   state=page.evaluate('''() => {
    const ui=window.villageObserver,sel=document.querySelector('#statsScope'),option=sel.querySelector('option[value="settlement"]');
    const same=option;for(let j=0;j<5;j++){ui.world.advanceOneDay();ui.render();}
    const out={mutations:window._g4a1StatsMutations,sameOption:option===same,focused:document.activeElement===sel,caption:option.textContent,scope:sel.value};
    sel.value='world';sel.dispatchEvent(new Event('change',{bubbles:true}));ui.render();out.selectedAfterChange=sel.value;out.integrity=VSim.V034G5.verify(ui.world).ok;
    return out;
   }''')
   # MutationObserver callbacks are microtasks; evaluate again to flush.
   count=page.evaluate('window._g4a1StatsMutations')
   assert not errors,(mode,vp,errors[:3]);assert state['sameOption'] and state['focused'] and state['caption']=='타일 (기존 장기 통계)',(mode,vp,state)
   assert state['selectedAfterChange']=='world' and state['integrity'],(mode,vp,state)
   assert state['mutations']==0,(mode,vp,'dropdown mutates during tick',state)
   print('PASS',mode,vp,'focused option mutations',state['mutations'],'selected',state['selectedAfterChange'])
   page.close()
 b.close()
