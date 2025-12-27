// Minimal client-side handlers for register & login forms (fetch to your backend endpoints)
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  async function postJSON(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // include cookies if using session cookies
      body: JSON.stringify(data)
    });
    return res.json();
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('registerMessage');
      const fd = new FormData(registerForm);
      const payload = Object.fromEntries(fd.entries());

      if (payload.password !== payload.confirmPassword) {
        msg.textContent = 'Passwords do not match.';
        return;
      }
      msg.textContent = 'Creating account...';

      try {
        const res = await postJSON('/api/auth/register', payload);
        if (res.success) {
          msg.textContent = 'Registration successful. Please check your email to verify.';
          registerForm.reset();
        } else {
          msg.textContent = res.message || 'Registration failed.';
        }
      } catch (err) {
        msg.textContent = 'Network error. Try again.';
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('loginMessage');
      const fd = new FormData(loginForm);
      const payload = Object.fromEntries(fd.entries());
      msg.textContent = 'Signing in...';

      try {
        const res = await postJSON('/api/auth/login', payload);
        if (res.success) {
          msg.textContent = 'Login successful. Redirecting...';
          window.location.href = '/my-dashboard.html'; // or your dashboard route
        } else {
          msg.textContent = res.message || 'Login failed.';
        }
      } catch (err) {
        msg.textContent = 'Network error. Try again.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/';
    });
  }
});