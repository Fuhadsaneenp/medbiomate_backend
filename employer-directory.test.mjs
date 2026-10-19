import test from 'node:test';
import assert from 'node:assert/strict';
import {employerDirectory} from './employer-directory.mjs';
const company=(id,name,category='Hospital',location='Dubai')=>({id,slug:name.toLowerCase(),title:{rendered:name},status:'publish',metas:{_employer_category:{0:category},_employer_location:{0:location}}});
const job=(id,companyId,status='publish')=>({id,slug:'job-'+id,status,title:{rendered:'Nurse'},metas:{_job_employer_posted_by:companyId}});
test('employer vacancy filters and sort operate across the complete catalogue before pagination',()=>{
 const companies=Array.from({length:15},(_,i)=>company(i+1,'Company'+(i+1)));
 const jobs=Array.from({length:20},(_,i)=>job(i+1,15));
 const r=employerDirectory(companies,jobs,{},new URLSearchParams('min_jobs=5&sort=jobs'));
 assert.equal(r.total,1);assert.equal(r.rows[0].id,15);assert.equal(r.rows[0].openJobs,20);
});
test('company search matches specialties and locations and facets use real employer counts',()=>{
 const r=employerDirectory([company(1,'Alpha'),company(2,'Beta','Pharmacy','Abu Dhabi')],[],{},new URLSearchParams('q=pharmacy'));
 assert.equal(r.total,1);assert.equal(r.rows[0].title,'Beta');assert.deepEqual(r.locations.find(x=>x.name==='Dubai'),{name:'Dubai',count:1});
});
test('draft edits remove employers and jobs from public directory and vacancy counts',()=>{
 const companies=[company(1,'Alpha'),company(2,'Beta')];
 const local={employers:[{id:2,slug:'beta',title:'Beta',status:'draft'}],jobs:[{id:1,slug:'job-1',title:'Nurse',status:'draft'}]};
 const r=employerDirectory(companies,[job(1,1),job(2,1,'draft')],local);
 assert.equal(r.total,1);assert.equal(r.rows[0].openJobs,0);
});
test('vacancies match employer URLs and company names without counting a job twice',()=>{
 const employers=[company(1,'Alpha')];const jobs=[{...job(1,1),metas:{_job_employer_posted_by:1,_job_employer_url:'/employer/alpha',_job_employer_name:'Alpha'}},{...job(2,0),metas:{_job_employer_url:'https://www.medbiomate.com/employer/alpha'}},{...job(3,0),metas:{_job_employer_name:'Alpha'}}];
 assert.equal(employerDirectory(employers,jobs).rows[0].openJobs,3);
});
test('global alphabetical order and out-of-range pages return a valid catalogue page',()=>{
 const rows=Array.from({length:25},(_,i)=>company(i+1,'Company '+String(25-i).padStart(2,'0')));
 const r=employerDirectory(rows,[],{},new URLSearchParams('sort=az&page=999&per_page=12'));
 assert.equal(r.page,3);assert.equal(r.rows.length,1);assert.equal(r.rows[0].title,'Company 25');
});
test('directory returns only its public summary fields',()=>{
 const c={...company(1,'Alpha'),passwordHash:'private',content:{rendered:'Private metadata'},metas:{_employer_email:'private@example.test'}};
 const r=employerDirectory([c],[]);assert.ok(!JSON.stringify(r).includes('private'));assert.ok(!Object.hasOwn(r.rows[0],'content'));
});
