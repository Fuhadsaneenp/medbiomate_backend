import {calculateCandidateCompletion} from './candidate-profile.mjs';
export function profileBenchmark(users,user){
 const own=calculateCandidateCompletion({...user.profile,name:user.name,email:user.email});
 const peers=users.filter(item=>String(item.id)!==String(user.id)&&String(item.role).toLowerCase()==='candidate');
 if(peers.length<10)return {available:false,completion:own,reason:'More candidate profiles are needed for a reliable comparison.'};
 const scores=peers.map(item=>calculateCandidateCompletion({...item.profile,name:item.name,email:item.email}));
 return {available:true,completion:own,sampleSize:scores.length,average:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length),aheadOfPercent:Math.round(scores.filter(value=>value<own).length/scores.length*100),equalPercent:Math.round(scores.filter(value=>value===own).length/scores.length*100),metric:'profile-completion'};
}
