// V0.34G2: Single-authority Settlement food relief. Legacy V27/V28/E2
// routines remain present for compatibility only, never executed once the
// G2 bootstrap is loaded. Original C1H protected blocks remain unchanged.
const replaceOnce=(s,needle,replacement,label)=>{
 const count=s.split(needle).length-1;
 if(count!==1)throw Error('G2 '+label+' anchor expected once, found '+count);
 return s.replace(needle,replacement);
};
export function g2Transform(file,source){
 if(file==='src/legacy/038.js')return replaceOnce(source,
  'preemptiveFoodRelief27(this);return advance26.call(this);',
  'if(!NS.V034G2?.relay)preemptiveFoodRelief27(this);return advance26.call(this);','V27 food');
 if(file==='src/legacy/039.js')return replaceOnce(source,
  'urbanFoodRelief28(this);const x=advance27.call(this);',
  'if(NS.V034G2?.relay)NS.V034G2.relay(this);else urbanFoodRelief28(this);const x=advance27.call(this);','V28 food');
 if(file==='src/legacy/069.js')return replaceOnce(source,
  'runHousingResolverE1(this);nationalFoodRelayE1(this);return r;',
  'runHousingResolverE1(this);if(!NS.V034G2?.relay)nationalFoodRelayE1(this);return r;','E2 food');
 return source;
}
