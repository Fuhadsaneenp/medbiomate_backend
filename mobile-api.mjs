// Compatibility API for the React/Capacitor Medbiomate app.
export async function handleMobileApi(req,res,url,ctx){
  if(!url.pathname.startsWith('/api/mobile/'))return false;
  const {readJsonBody,readLocalDb,writeLocalDb,passwordHash,passwordMatches,sessions,crypto,sendJson,wordpressRecords,fallbackRecords,wpDb,memoryStore}=ctx;
  const path=url.pathname.slice('/api/mobile'.length);
  const reply=(status,body)=>sendJson(req,res,status,body);
  try{
    if(path.startsWith('/wp/')&&req.method==='GET'){
      const type=path.slice(4);const params=new URLSearchParams(url.search);const page=Math.max(1,Number(params.get('page'))||1);const limit=Math.min(1000,Math.max(1,Number(params.get('per_page'))||100));
      if(params.has('search'))params.set('q',params.get('search'));
      for(const [taxonomy,key] of [['job_listing_category','category'],['job_listing_location','location']]){
        if(!params.has(taxonomy))continue;
        const id=Number(params.get(taxonomy));let term;
        try{const [rows]=await wpDb.query('SELECT t.name FROM wp_terms t JOIN wp_term_taxonomy tt ON tt.term_id=t.term_id WHERE t.term_id=? AND tt.taxonomy=?',[id,taxonomy]);term=rows[0];}catch{term=(memoryStore.taxonomies?.[key==='category'?'categories':'locations']||[]).find(t=>Number(t.id)===id);}
        if(!term){await reply(200,[]);return true;}params.set(key,term.name);
      }
      let items;
      if(['job_listing_category','job_listing_location'].includes(type)){
        try{const [rows]=await wpDb.query('SELECT t.term_id id,t.name,tt.count,tt.parent FROM wp_term_taxonomy tt JOIN wp_terms t ON t.term_id=tt.term_id WHERE tt.taxonomy=?',[type]);items=rows;}catch{items=memoryStore.taxonomies?.[type.endsWith('category')?'categories':'locations']||[];}
      }else if(['job_listing','employer'].includes(type)){
        // Fetch pages until exhausted to supply the total headers expected by the app.
        items=[];const allParams=new URLSearchParams(params);allParams.set('per_page','1000');
        for(let n=1;n<=100;n++){allParams.set('page',String(n));let batch;try{batch=await wordpressRecords(type,allParams);}catch{batch=fallbackRecords(type,allParams);}items.push(...batch);if(batch.length<1000)break;}
      }else{await reply(404,{success:false,message:'Unknown content type.'});return true;}
      res.setHeader('X-WP-Total',String(items.length));res.setHeader('X-WP-TotalPages',String(Math.max(1,Math.ceil(items.length/limit))));res.setHeader('Access-Control-Expose-Headers','X-WP-Total, X-WP-TotalPages');
      await reply(200,items.slice((page-1)*limit,page*limit));return true;
    }
    if(['/login','/register'].includes(path)&&req.method==='POST'){
      const body=await readJsonBody(req);const email=String(body.email||body.identifier||'').trim().toLowerCase();const db=await readLocalDb();let user=db.users.find(u=>u.email===email);
      if(path==='/register'){
        if(!/^\S+@\S+\.\S+$/.test(email)||!String(body.name||'').trim()||String(body.password||'').length<8){await reply(400,{success:false,message:'Enter your name, valid email and a password of at least 8 characters.'});return true;}
        if(user){await reply(409,{success:false,code:'email_exists',message:'This email already has an account.'});return true;}
        const credentials=passwordHash(body.password);user={id:crypto.randomUUID(),email,name:String(body.name).trim(),role:'Candidate',passwordSalt:credentials.salt,passwordHash:credentials.hash,createdAt:new Date().toISOString()};db.users.push(user);await writeLocalDb(db);
      }else if(!user||!passwordMatches(String(body.password||''),user)){await reply(401,{success:false,message:'Invalid email or password.'});return true;}
      const token=crypto.randomUUID();sessions.set(token,{userId:user.id,email:user.email,name:user.name});await reply(200,{success:true,message:'Signed in.',token,user:{id:user.id,email:user.email,name:user.name},profile:user.profile});return true;
    }
    if(path==='/applications/count'&&req.method==='GET'){
      const db=await readLocalDb();const jobId=Number(url.searchParams.get('job_id'));await reply(200,{success:true,count:db.users.filter(u=>u.mobileApplications?.includes(jobId)).length});return true;
    }
    const token=String(req.headers.authorization||'').replace(/^Bearer /,'');const session=(token?sessions.get(token):null)||ctx.currentSession?.(req);
    if(!session){await reply(401,{success:false,message:'Sign in to continue.'});return true;}
    const db=await readLocalDb();const user=db.users.find(u=>String(u.id)===String(session.userId));if(!user){await reply(401,{success:false,message:'Account not found.'});return true;}
    const body=['POST','PUT'].includes(req.method)?await readJsonBody(req,14_000_000):{};
    let result={success:true,message:'Saved.'};let changed=false;
    if(path==='/candidate/data'){
      if(req.method==='POST'){user.mobileData={...(user.mobileData||{}),...(body.data||{})};if(body.data?.profile)user.profile=body.data.profile;user.mobileUpdatedAt=Date.now();changed=true;}
      result={...result,data:{...(user.mobileData||{}),profile:user.profile||user.mobileData?.profile},updatedAt:user.mobileUpdatedAt||0};
    }else if(path==='/candidate/resume'){
      if(req.method==='POST'){if(String(body.base64||'').length>14000000){await reply(413,{success:false,message:'Resume is too large.'});return true;}user.mobileResume={name:body.name,type:body.type,size:body.size,base64:body.base64,updatedAt:Date.now()};changed=true;}
      if(req.method==='DELETE'){delete user.mobileResume;changed=true;}result.resume=user.mobileResume;
    }else if(path==='/candidate/cv-builder'){
      db.resumes ||= [];const id=body.resume?.id||url.searchParams.get('resume_id');
      if(req.method==='POST'){if(!id||!body.resume?.state){await reply(400,{success:false,message:'A valid resume is required.'});return true;}const owned=db.resumes.filter(r=>r.userId===user.id);if(owned.length>=10&&!owned.some(r=>r.id===id)){await reply(409,{success:false,message:'You can save up to 10 resumes.'});return true;}db.resumes=db.resumes.filter(r=>!(r.userId===user.id&&r.id===id));db.resumes.push({...body.resume,userId:user.id,updatedAt:Date.now()});changed=true;result.resume=body.resume;}
      if(req.method==='DELETE'){db.resumes=db.resumes.filter(r=>!(r.userId===user.id&&r.id===id));changed=true;}result.resumes=db.resumes.filter(r=>r.userId===user.id);
    }else if(['/applications/status','/applications/apply'].includes(path)&&req.method==='POST'){
      user.mobileApplications ||= [];const jobId=Number(body.job_id);if(!Number.isSafeInteger(jobId)||jobId<=0){await reply(400,{success:false,message:'Invalid job.'});return true;}const first=!user.mobileApplications.includes(jobId);if(path.endsWith('/apply')&&first){user.mobileApplications.push(jobId);changed=true;}result={...result,applied:user.mobileApplications.includes(jobId),firstApplication:first,count:db.users.filter(u=>u.mobileApplications?.includes(jobId)).length};
    }else{await reply(404,{success:false,message:'This feature is not available.'});return true;}
    if(changed)await writeLocalDb(db);await reply(200,result);return true;
  }catch(error){await reply(400,{success:false,message:error.message||'Unable to complete request.'});return true;}
}
