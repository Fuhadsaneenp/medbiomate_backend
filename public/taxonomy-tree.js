export function buildHierarchy(terms=[]){
 const rows=Array.isArray(terms)?terms:[],byKey=new Map();
 const key=value=>String(value??'').trim().toLowerCase();
 for(const row of rows)for(const value of [row.id,row.slug,row.name])if(value!=null&&key(value))byKey.set(key(value),row);
 const children=new Map(),roots=[];
 for(const row of rows){const parent=byKey.get(key(row.parent));if(!parent||parent===row)roots.push(row);else{if(!children.has(parent))children.set(parent,[]);children.get(parent).push(row);}}
 const result=[],seen=new Set();const walk=(row,depth)=>{if(seen.has(row))return;seen.add(row);result.push({...row,depth});for(const child of children.get(row)||[])walk(child,depth+1);};
 roots.forEach(row=>walk(row,0));rows.forEach(row=>walk(row,0));return result;
}
