import { renderAdmin, initAdmin } from './admin.js?v=1.0';

let session;try{const response=await fetch('/api/admin/me',{cache:'no-store'});if(response.ok)session=(await response.json()).admin}catch{}
if(session){
 sessionStorage.setItem('medbiomate_admin_session',JSON.stringify(session));document.querySelector('#app').innerHTML=renderAdmin();await initAdmin();
}else{
 document.querySelector('#app').innerHTML=`<main style="max-width:420px;margin:10vh auto;padding:32px;font-family:system-ui;background:white;border-radius:12px;box-shadow:0 10px 60px #0001"><h1>Medbiomate Admin</h1><p>Sign in to manage jobs, employers, and pages.</p><form id="admin-login-form"><label>Email<input name="identity" type="email" required autocomplete="username" style="display:block;width:100%;padding:12px;margin:10px 0"></label><label>Password<input name="password" type="password" required autocomplete="current-password" style="display:block;width:100%;padding:12px;margin:10px 0"></label><button style="padding:12px 25px;background:#1967d2;border:0;border-radius:6px;color:white">Login</button><p role="status" id="login-status"></p></form><a href="/">Back to website</a></main>`;
 document.querySelector('#admin-login-form').onsubmit=async event=>{event.preventDefault();try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(event.target)))});const data=await r.json();if(!r.ok)throw Error(data.error);location.href='/admin'}catch(e){document.querySelector('#login-status').textContent=e.message}};
}

// Website recovery shares the same backend and account records as the mobile app.
document.querySelectorAll('[data-password-reset]').forEach(link => link.addEventListener('click', event => {
 event.preventDefault();
 const form = link.closest('form') || document.querySelector('#loginForm');
 if (!form) return;
 form.innerHTML = `<h2>Reset your password</h2><label for="recoveryEmail">Email</label><input id="recoveryEmail" name="email" type="email" autocomplete="email" required><div class="recovery-fields"></div><button class="auth-submit-btn" type="submit">Send reset code</button><p class="form-message" role="status" aria-live="polite"></p><a href="${location.pathname}" class="forgot-link">Back to sign in</a>`;
 const replacement = form.cloneNode(true); replacement.removeAttribute('novalidate'); replacement.setAttribute('autocomplete','on'); form.replaceWith(replacement);
 const styleRecoveryFields = () => replacement.querySelectorAll('input').forEach(input => { if (input.parentElement.classList.contains('input-wrap')) return; const wrap = document.createElement('div'); wrap.className = 'input-wrap'; input.before(wrap); wrap.append(input); });
 styleRecoveryFields();
 let challenge = '';
 replacement.addEventListener('submit', async event => {
  event.preventDefault(); const button = replacement.querySelector('button'); if (button.disabled) return;
  const message = replacement.querySelector('.form-message'); const values = Object.fromEntries(new FormData(replacement));
  button.disabled = true; message.textContent = '';
  try {
   const response = await fetch(challenge ? '/api/auth/reset-password' : '/api/auth/forgot-password', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,challenge})});
   const result = await response.json(); if (!response.ok) throw new Error(result.message || result.error || 'Please try again.');
   if (challenge) { replacement.querySelector('.recovery-fields').replaceChildren(); button.remove(); message.textContent = 'Your password has been reset. You can now sign in.'; }
   else {
    challenge = result.challenge;
    replacement.querySelector('[name="email"]').readOnly = true;
    replacement.querySelector('.recovery-fields').innerHTML = `<label for="recoveryCode">Reset code</label><input id="recoveryCode" name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required><label for="recoveryPassword">New password</label><input id="recoveryPassword" name="new_password" type="password" autocomplete="new-password" minlength="8" maxlength="256" required>`;
    styleRecoveryFields(); button.textContent = 'Reset password'; message.textContent = 'If an account exists, a reset code has been sent. It expires in 10 minutes.'; replacement.querySelector('[name="otp"]').focus();
   }
  } catch (error) { message.textContent = error.message || 'Unable to connect. Please try again.'; }
  finally { button.disabled = false; }
 });
 replacement.querySelector('[name="email"]').focus();
}));

