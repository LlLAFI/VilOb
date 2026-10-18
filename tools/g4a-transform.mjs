// G4A: only ration demand and individual Hunger response constants in F0.
// Protected C1H legacy modules, F2 death grace, F3 health and G4 tech remain untouched.
function once(source,from,to,label){const matches=source.split(from).length-1;if(matches!==1)throw Error('G4A '+label+' anchor expected once, found '+matches);return source.replace(from,to);}
export function g4aTransform(file,src){if(file!=='src/bootstrap/v034f0.js')return src;
 let s=src;
 s=once(s,"const base=p.age<15?.30:.42;","const base=p.age<15?.28:.39;",'food-demand');
 s=once(s,"p.hunger=clamp(num(p.hunger)+(worked?5+Math.random()*3:4+Math.random()*2));","p.hunger=clamp(num(p.hunger)+NS.V034G4A.hungerGain((worked?5+Math.random()*3:4+Math.random()*2),ratio));",'underfed-hunger');
 s=once(s,"const relief=(5+Math.random()+(3+Math.random())*curve)*ratio;","const relief=(5+Math.random()+(3+Math.random())*curve)*ratio*NS.V034G4A.reliefFactor(before);",'high-hunger-relief');
 return s;
}
