export function renderAdminLogin(){
 document.title='Admin Sign In | Medbiomate';
 document.body.style.margin='0';
 document.querySelector('#app').innerHTML=`<style>
    .admin-auth-page{min-height:100vh;display:grid;grid-template-columns:minmax(320px,.9fr) minmax(520px,1.1fr);background:#f7f8fb;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827}
    .admin-auth-brand{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:46px 52px;background:linear-gradient(145deg,#0744a8 0%,#0755ce 48%,#0866ff 100%);color:#fff}
    .admin-auth-brand:before,.admin-auth-brand:after{content:"";position:absolute;border-radius:50%;pointer-events:none}
    .admin-auth-brand:before{width:430px;height:430px;right:-210px;top:-190px;border:1px solid rgba(255,255,255,.16);box-shadow:0 0 0 70px rgba(255,255,255,.035),0 0 0 140px rgba(255,255,255,.025)}
    .admin-auth-brand:after{width:280px;height:280px;left:-150px;bottom:-145px;background:rgba(42,0,2,.18)}
    .admin-auth-logo,.admin-auth-copy,.admin-auth-brand-foot{position:relative;z-index:1}
    .admin-auth-logo{display:flex;align-items:center;width:max-content;padding:10px 14px;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(55,0,3,.16)}
    .admin-auth-logo img{width:154px;height:auto;display:block}
    .admin-auth-copy{max-width:470px;margin:auto 0}
    .admin-auth-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:22px;padding:7px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.1);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
    .admin-auth-kicker:before{content:"";width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.14)}
    .admin-auth-copy h2{margin:0 0 18px;font-size:clamp(34px,4vw,54px);line-height:1.05;letter-spacing:-.045em;color:#fff}
    .admin-auth-copy p{max-width:410px;margin:0;color:rgba(255,255,255,.78);font-size:16px;line-height:1.7}
    .admin-auth-points{display:grid;gap:12px;margin-top:34px}
    .admin-auth-point{display:flex;align-items:center;gap:11px;color:rgba(255,255,255,.88);font-size:13px;font-weight:600}
    .admin-auth-point svg{width:18px;height:18px;flex:0 0 auto}
    .admin-auth-brand-foot{font-size:12px;color:rgba(255,255,255,.62)}
    .admin-auth-form-side{display:flex;align-items:center;justify-content:center;padding:48px}
    .admin-auth-card{width:100%;max-width:465px}
    .admin-auth-mobile-logo{display:none;margin-bottom:32px}.admin-auth-mobile-logo img{width:160px;height:auto}
    .admin-auth-icon{width:48px;height:48px;display:grid;place-items:center;margin-bottom:28px;border-radius:14px;background:#eff6ff;color:#0866ff;box-shadow:inset 0 0 0 1px #dbeafe}
    .admin-auth-card h1{margin:0 0 10px;font-size:32px;line-height:1.2;letter-spacing:-.035em;color:#111827}
    .admin-auth-intro{margin:0 0 34px;color:#687386;font-size:14px;line-height:1.65}
    .admin-auth-field{display:block;margin-bottom:20px}
    .admin-auth-field>span{display:block;margin-bottom:8px;color:#263244;font-size:13px;font-weight:700}
    .admin-auth-input-wrap{position:relative}
    .admin-auth-input{width:100%;height:54px;box-sizing:border-box;border:1px solid #d8dee8;border-radius:12px;background:#fff;padding:0 16px;color:#111827;font-size:14px;outline:none;box-shadow:0 1px 2px rgba(15,23,42,.03);transition:border-color .18s,box-shadow .18s}
    .admin-auth-input::placeholder{color:#9aa4b2}.admin-auth-input:focus{border-color:#0866ff;box-shadow:0 0 0 4px rgba(8,102,255,.09)}
    .admin-auth-input.has-action{padding-right:50px}
    .admin-pass-toggle{position:absolute;right:7px;top:7px;width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:9px;background:transparent;color:#7c8798;cursor:pointer}
    .admin-pass-toggle:hover{background:#f2f4f7;color:#263244}.admin-pass-toggle svg{width:19px;height:19px}
    #adminLoginError{display:none;margin-bottom:20px;padding:12px 14px;border:1px solid #fecaca;border-radius:10px;background:#eff6ff;color:#991b1b;font-size:13px;line-height:1.5}
    .admin-auth-submit{width:100%;height:54px;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:12px;background:linear-gradient(135deg,#0755ce,#0866ff);color:#fff;font-size:14px;font-weight:750;cursor:pointer;box-shadow:0 10px 24px rgba(8,102,255,.22);transition:transform .18s,box-shadow .18s,filter .18s}
    .admin-auth-submit:hover{transform:translateY(-1px);box-shadow:0 14px 28px rgba(8,102,255,.28);filter:saturate(1.08)}.admin-auth-submit:disabled{opacity:.7;cursor:wait;transform:none}
    .admin-auth-meta{display:flex;align-items:flex-start;gap:10px;margin-top:28px;padding-top:23px;border-top:1px solid #e5e9f0;color:#7b8797;font-size:12px;line-height:1.55}
    .admin-auth-meta svg{width:17px;height:17px;flex:0 0 auto;margin-top:1px;color:#8c96a5}
    .admin-auth-home{display:inline-flex;align-items:center;gap:7px;margin-top:22px;color:#596579;font-size:12px;font-weight:650;text-decoration:none}.admin-auth-home:hover{color:#0866ff}
    @media(max-width:860px){.admin-auth-page{display:block;background:#fff}.admin-auth-brand{display:none}.admin-auth-form-side{min-height:100vh;padding:42px 24px}.admin-auth-mobile-logo{display:block}.admin-auth-card{max-width:500px}.admin-auth-card h1{font-size:29px}}
    @media(max-width:480px){.admin-auth-form-side{align-items:flex-start;padding:28px 20px}.admin-auth-mobile-logo{margin-bottom:42px}.admin-auth-icon{margin-bottom:22px}.admin-auth-card h1{font-size:26px}.admin-auth-intro{margin-bottom:28px}}
  </style>
  <main class="admin-auth-page">
    <section class="admin-auth-brand" aria-label="Medbiomate administration portal">
      <a class="admin-auth-logo" href="/"><img src="/admin-assets/assets/medbiomate-logo.png" alt="Medbiomate"></a>
      <div class="admin-auth-copy">
        <span class="admin-auth-kicker">Private workspace</span>
        <h2>Run Medbiomate<br>with confidence.</h2>
        <p>Manage jobs, employers, content and platform operations from one secure workspace.</p>
        <div class="admin-auth-points">
          <div class="admin-auth-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>Protected administrator access</div>
          <div class="admin-auth-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>Centralised publishing controls</div>
        </div>
      </div>
      <div class="admin-auth-brand-foot">Medbiomate Administration · Internal use only</div>
    </section>
    <section class="admin-auth-form-side">
      <div class="admin-auth-card">
        <a class="admin-auth-mobile-logo" href="/"><img src="/admin-assets/assets/medbiomate-logo.png" alt="Medbiomate"></a>
        <div class="admin-auth-icon"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div>
        <h1>Welcome back</h1>
        <p class="admin-auth-intro">Sign in with your administrator credentials to continue to the Medbiomate console.</p>
        <div id="adminLoginError" role="alert"></div>
        <form id="adminLoginForm">
          <label class="admin-auth-field"><span>Username or email</span><div class="admin-auth-input-wrap"><input class="admin-auth-input" type="text" id="adminLoginUser" required autocomplete="username" data-lpignore="true" data-form-type="other" placeholder="Enter username or email"></div></label>
          <label class="admin-auth-field"><span>Password</span><div class="admin-auth-input-wrap"><input class="admin-auth-input has-action" type="password" id="adminLoginPass" required autocomplete="current-password" data-lpignore="true" data-form-type="other" placeholder="Enter your password"><button class="admin-pass-toggle" id="adminPassToggle" type="button" aria-label="Show password" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg></button></div></label>
          <button type="submit" id="adminLoginBtn" class="admin-auth-submit">Sign in securely <span aria-hidden="true">→</span></button>
        </form>
        <div class="admin-auth-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg><span>This is a restricted system. Administrative activity may be recorded for security and auditing.</span></div>
        <a class="admin-auth-home" href="/">← Return to the Medbiomate website</a>
      </div>
    </section>
  </main>`;
 const form=document.querySelector('#adminLoginForm'),identity=document.querySelector('#adminLoginUser'),password=document.querySelector('#adminLoginPass'),toggle=document.querySelector('#adminPassToggle'),error=document.querySelector('#adminLoginError'),button=document.querySelector('#adminLoginBtn');
 toggle.onclick=()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.setAttribute('aria-label',show?'Hide password':'Show password');toggle.setAttribute('aria-pressed',String(show))};
 if(new URLSearchParams(location.search).get('reason')==='session-expired'){error.textContent='Your session expired. Sign in again to continue.';error.style.display='block'}
 form.onsubmit=async event=>{event.preventDefault();if(button.disabled)return;button.disabled=true;button.textContent='Signing in…';form.setAttribute('aria-busy','true');error.style.display='none';try{const response=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identity:identity.value.trim(),password:password.value})});const data=await response.json();if(!response.ok)throw Error(data.error||'Unable to sign in. Please try again.');location.href='/admin'+location.hash}catch(e){error.textContent=e.message;error.style.display='block';button.disabled=false;button.textContent='Sign in securely →';form.setAttribute('aria-busy','false')}};
}
