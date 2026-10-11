
window.VSim=window.VSim||{};(function(NS){
class SurvivalBrain extends NS.VillageBrain{constructor(){super('survival','생존형',{FOOD:5,MAINTAIN:3,TRADE:2,EXPAND:-1});}}
class DiplomaticBrain extends NS.VillageBrain{constructor(){super('diplomatic','외교형',{TRADE:7,MAINTAIN:1,SECURITY:-1});}}
class ExpansionistBrain extends NS.VillageBrain{constructor(){super('expansionist','확장형',{EXPAND:8,SECURITY:2,TRADE:-1});}}
class BalancedBrain extends NS.VillageBrain{constructor(){super('balanced','균형형',{MAINTAIN:2});}}
const f={survival:()=>new SurvivalBrain(),diplomatic:()=>new DiplomaticBrain(),expansionist:()=>new ExpansionistBrain(),balanced:()=>new BalancedBrain()};NS.Brains={create:t=>(f[t]||f.balanced)(),random(){const k=Object.keys(f);return f[k[Math.floor(Math.random()*k.length)]]();},types:Object.keys(f)};
})(window.VSim);

