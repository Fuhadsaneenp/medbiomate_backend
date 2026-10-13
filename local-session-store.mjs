// Explicit local development adapter. Production retains the shared MySQL session store.
import crypto from 'node:crypto';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {dirname} from 'node:path';
export async function localSessions(file,{ttl=604800000}={}){
 let rows={};try{rows=JSON.parse(await readFile(file,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
 let pending=Promise.resolve();const hash=t=>crypto.createHash('sha256').update(String(t)).digest('hex');
 const persist=()=>{pending=pending.then(async()=>{await mkdir(dirname(file),{recursive:true});await writeFile(file+'.tmp',JSON.stringify(rows),{mode:0o600});await rename(file+'.tmp',file)});return pending};
 return {get(t){const r=rows[hash(t)];return r&&r.expires>Date.now()?r.value:undefined},set(t,value){rows[hash(t)]={value,expires:Date.now()+ttl};persist();return this},delete(t){delete rows[hash(t)];persist();return true},flush(){return pending},get size(){return Object.keys(rows).length},*[Symbol.iterator](){for(const [k,v]of Object.entries(rows))yield[k,v.value]}};
}
